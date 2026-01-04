/**
 * RDF Parser
 * 
 * Parses RdfSource inputs into RDF/JS quads with absolute IRIs.
 * 
 * Key rules:
 * - Local files: ALWAYS parse with file:/// URL from absolute path
 * - URLs: Use the URL itself as document IRI
 * - Inline: Use synthetic file:///virtual/... base
 * - All quads in memory have absolute IRIs (RDF/JS standard)
 * 
 * See: concept.implied-rdf-base, concept.identifier.intramesh.relative
 */

import jsonld from "jsonld";
import { Parser as N3Parser } from "n3";
import { promises as fs } from "fs";
import { resolve } from "path";
import { pathToFileURL } from "url";
import type { Quad } from "@rdfjs/types";
import type { RdfSource, RdfSyntax, ParsedRdf } from "./types.js";

/**
 * Parse an RdfSource into quads with absolute IRIs
 * 
 * @param source - The RDF source to parse
 * @returns Parsed RDF with metadata
 */
export async function parseRdfSource(source: RdfSource): Promise<ParsedRdf> {
  switch (source.kind) {
    case "file":
      return parseFile(source.path, source.syntax);
    case "url":
      return parseUrl(source.url, source.syntax);
    case "inline":
      return parseInline(source.jsonld);
    default:
      throw new Error(`Unknown RdfSource kind: ${(source as any).kind}`);
  }
}

/**
 * Parse a file from disk
 * 
 * CRITICAL: Always uses file:/// URL from absolute path as base
 */
async function parseFile(
  filePath: string,
  syntaxHint?: RdfSyntax
): Promise<ParsedRdf> {
  // Resolve to absolute path
  const absPath = resolve(filePath);

  // Compute document IRI as file:/// URL
  const baseIri = pathToFileURL(absPath).href;

  // Read file content
  const content = await fs.readFile(absPath, "utf-8");

  // Detect syntax
  const syntax = syntaxHint || detectSyntaxFromPath(filePath);

  // Parse based on syntax
  if (syntax === "jsonld") {
    return parseJsonLdString(content, baseIri, syntax);
  } else {
    return parseRdfString(content, baseIri, syntax);
  }
}

/**
 * Parse from a URL
 * 
 * Uses the URL itself as document IRI
 */
async function parseUrl(
  url: string,
  syntaxHint?: RdfSyntax
): Promise<ParsedRdf> {
  // Fetch content
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  const content = await response.text();

  // Detect syntax from Content-Type or URL
  const contentType = response.headers.get("content-type");
  const syntax = syntaxHint || detectSyntaxFromContentType(contentType) || detectSyntaxFromPath(url);

  // Use URL as base
  const baseIri = url;

  // Parse based on syntax
  if (syntax === "jsonld") {
    return parseJsonLdString(content, baseIri, syntax);
  } else {
    return parseRdfString(content, baseIri, syntax);
  }
}

/**
 * Parse inline JSON-LD
 * 
 * Uses synthetic file:///virtual/inline-{timestamp} as base
 */
async function parseInline(jsonldValue: string | object): Promise<ParsedRdf> {
  // Synthetic base for inline content
  const baseIri = `file:///virtual/inline-${Date.now()}`;

  // Parse the JSON-LD
  const doc = typeof jsonldValue === "string" ? JSON.parse(jsonldValue) : jsonldValue;

  // Expand to quads using jsonld library
  const expanded = await jsonld.expand(doc, { base: baseIri });
  const quads = await jsonld.toRDF(expanded, { format: "application/n-quads" }) as unknown as Quad[];

  return {
    syntax: "jsonld",
    baseIri,
    quads,
  };
}

/**
 * Parse JSON-LD string with explicit base
 */
async function parseJsonLdString(
  content: string,
  baseIri: string,
  syntax: RdfSyntax
): Promise<ParsedRdf> {
  const doc = JSON.parse(content);

  // CRITICAL: Always expand with explicit base
  // This resolves relative IRIs to absolute IRIs based on baseIri
  const expanded = await jsonld.expand(doc, { base: baseIri });
  const quads = await jsonld.toRDF(expanded, { format: "application/n-quads" }) as unknown as Quad[];

  return {
    syntax,
    baseIri,
    quads,
  };
}

/**
 * Parse Turtle/TriG/N-Triples/N-Quads with explicit base
 */
async function parseRdfString(
  content: string,
  baseIri: string,
  syntax: RdfSyntax
): Promise<ParsedRdf> {
  const parser = new N3Parser({
    baseIRI: baseIri,
    format: syntaxToN3Format(syntax)
  });

  return new Promise((resolve, reject) => {
    const quads: Quad[] = [];

    parser.parse(content, (error, quad) => {
      if (error) {
        reject(new Error(`Parse error: ${error.message}`));
      } else if (quad) {
        quads.push(quad);
      } else {
        // End of stream
        resolve({
          syntax,
          baseIri,
          quads,
        });
      }
    });
  });
}

/**
 * Detect RDF syntax from file path extension
 */
function detectSyntaxFromPath(path: string): RdfSyntax {
  const lower = path.toLowerCase();
  if (lower.endsWith(".jsonld") || lower.endsWith(".json")) return "jsonld";
  if (lower.endsWith(".ttl") || lower.endsWith(".turtle")) return "turtle";
  if (lower.endsWith(".trig")) return "trig";
  if (lower.endsWith(".nt") || lower.endsWith(".ntriples")) return "ntriples";
  if (lower.endsWith(".nq") || lower.endsWith(".nquads")) return "nquads";

  // Default to JSON-LD for unknown extensions
  return "jsonld";
}

/**
 * Detect RDF syntax from HTTP Content-Type header
 */
function detectSyntaxFromContentType(contentType: string | null): RdfSyntax | null {
  if (!contentType) return null;

  const lower = contentType.toLowerCase();
  if (lower.includes("application/ld+json")) return "jsonld";
  if (lower.includes("text/turtle")) return "turtle";
  if (lower.includes("application/trig")) return "trig";
  if (lower.includes("application/n-triples")) return "ntriples";
  if (lower.includes("application/n-quads")) return "nquads";

  return null;
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
    default: throw new Error(`Unsupported syntax for N3: ${syntax}`);
  }
}
