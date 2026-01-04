/**
 * RDF Serializer with Debasing
 * 
 * Serializes RDF/JS quads to mesh-native formats.
 * 
 * Key concepts:
 * - Quads always have absolute IRIs (RDF/JS standard)
 * - Debasing is a SERIALIZATION concern, not a data model concern
 * - For mesh-native JSON-LD: strip targetBase prefix to create relative IRIs
 * - External IRIs remain absolute
 * - NO @base in output files
 * 
 * See: concept.debasing, concept.identifier.intramesh.relative
 */

import jsonld from "jsonld";
import { Writer as N3Writer } from "n3";
import type { Quad } from "@rdfjs/types";
import type { RdfSyntax } from "./types.js";

/**
 * Options for serializing RDF
 */
export interface SerializeOptions {
  /** Target base IRI for debasing (typically file:/// URL) */
  targetBase: string;

  /** Output syntax format */
  syntax: RdfSyntax;

  /** Whether to compact JSON-LD output (default: true) */
  compact?: boolean;

  /** JSON-LD context to use when compacting (optional) */
  context?: any;
}

/**
 * Serialize quads to mesh-native RDF string
 * 
 * For mesh-native JSON-LD:
 * - No @base in output
 * - Local IRIs become relative (prefix stripped)
 * - External IRIs remain absolute
 * 
 * @param quads - RDF quads with absolute IRIs
 * @param options - Serialization options
 * @returns Serialized RDF string
 */
export async function serializeRdf(
  quads: Quad[],
  options: SerializeOptions
): Promise<string> {
  const { targetBase, syntax } = options;

  if (syntax === "jsonld") {
    return serializeJsonLd(quads, targetBase, options);
  } else {
    return serializeWithN3(quads, targetBase, syntax);
  }
}

/**
 * Serialize to mesh-native JSON-LD
 * 
 * Applies debasing during serialization to create relative IRIs
 */
async function serializeJsonLd(
  quads: Quad[],
  targetBase: string,
  options: SerializeOptions
): Promise<string> {
  // Convert quads to N-Quads string for jsonld library
  const nquadsStr = await quadsToNQuads(quads);
  
  // Parse N-Quads into JSON-LD document
  const doc = await jsonld.fromRDF(nquadsStr, { format: "application/n-quads" });

  // Apply debasing: make local IRIs relative
  const debased = debaseJsonLd(doc, targetBase);

  // Optionally compact with context
  if (options.compact !== false && options.context) {
    const compacted = await jsonld.compact(debased, options.context);
    return JSON.stringify(compacted, null, 2);
  }

  return JSON.stringify(debased, null, 2);
}

/**
 * Debase a JSON-LD document
 * 
 * Transforms absolute IRIs that start with targetBase into relative IRIs.
 * Leaves external IRIs unchanged.
 * 
 * This is the core "debasing" operation - converting from absolute
 * in-memory representation to relative serialized form.
 */
function debaseJsonLd(doc: any, targetBase: string): any {
  // Ensure targetBase ends with / or # for proper prefix matching
  const base = normalizeBase(targetBase);

  if (Array.isArray(doc)) {
    return doc.map((item) => debaseJsonLd(item, targetBase));
  }

  if (typeof doc !== "object" || doc === null) {
    return doc;
  }

  const result: any = {};

  for (const [key, value] of Object.entries(doc)) {
    // Handle @id field
    if (key === "@id" && typeof value === "string") {
      result[key] = debaseIri(value, base);
    }
    // Handle @type field (can be string or array)
    else if (key === "@type") {
      if (typeof value === "string") {
        result[key] = debaseIri(value, base);
      } else if (Array.isArray(value)) {
        result[key] = value.map((v) => typeof v === "string" ? debaseIri(v, base) : v);
      } else {
        result[key] = value;
      }
    }
    // Recurse into nested objects/arrays
    else if (typeof value === "object" && value !== null) {
      result[key] = debaseJsonLd(value, targetBase);
    }
    // Keep primitives as-is
    else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Debase a single IRI string
 * 
 * If IRI starts with base, strip the base prefix to make it relative.
 * Otherwise, leave it absolute (external IRI).
 */
function debaseIri(iri: string, normalizedBase: string): string {
  if (iri.startsWith(normalizedBase)) {
    // Strip base prefix to create relative IRI
    const relative = iri.substring(normalizedBase.length);

    // Handle edge case: if relative is empty, use "." or ""
    // (typically means IRI === base)
    return relative || "";
  }

  // External IRI - keep absolute
  return iri;
}

/**
 * Normalize base IRI for prefix matching
 *
 * For file URIs pointing to documents (with extensions), return as-is.
 * For directory-style bases, ensure they end with /.
 */
function normalizeBase(base: string): string {
  // Already ends with / or # - no normalization needed
  if (base.endsWith("/") || base.endsWith("#")) {
    return base;
  }

  // File URIs ending with common RDF extensions are document bases
  // Don't add / - we want exact IRI matching for the document
  if (base.includes("file://") && /\.(jsonld|ttl|trig|nt|nq|rdf|owl)$/i.test(base)) {
    return base;
  }

  // Directory-style base - add /
  return base + "/";
}

/**
 * Serialize to Turtle/TriG/N-Triples/N-Quads using N3
 * 
 * For these formats, N3Writer handles relative IRI generation
 * based on the base IRI parameter.
 */
async function serializeWithN3(
  quads: Quad[],
  targetBase: string,
  syntax: RdfSyntax
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new N3Writer({
      format: syntaxToN3Format(syntax),
      baseIRI: targetBase,
    });

    // Add all quads
    for (const quad of quads) {
      writer.addQuad(quad);
    }

    // Finish writing
    writer.end((error, result) => {
      if (error) {
        reject(new Error(`Serialization error: ${error.message}`));
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * Convert quads to N-Quads string (for jsonld library)
 */
async function quadsToNQuads(quads: Quad[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new N3Writer({
      format: "application/n-quads"
    });
    
    // Add all quads
    for (const quad of quads) {
      writer.addQuad(quad);
    }
    
    // End writing with callback to get result
    writer.end((error, result) => {
      if (error) {
        reject(new Error(`N-Quads conversion error: ${error.message}`));
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * Convert RdfSyntax to N3 format string
 */
function syntaxToN3Format(syntax: RdfSyntax): string {
  switch (syntax) {
    case "turtle": return "text/turtle";
    case "trig": return "application/trig";
    case "ntriples": return "application/n-triples";
    case "nquads": return "application/n-quads";
    case "jsonld": throw new Error("JSON-LD should use serializeJsonLd");
    default: throw new Error(`Unsupported syntax: ${syntax}`);
  }
}
