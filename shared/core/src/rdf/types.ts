/**
 * RDF Source Types
 * 
 * Type definitions for RDF loading and serialization.
 * 
 * See: concept.implied-rdf-base, concept.identifier.intramesh.relative
 */

import type { Quad } from "@rdfjs/types";

/**
 * Supported RDF serialization formats
 */
export type RdfSyntax =
  | "jsonld"
  | "turtle"
  | "trig"
  | "ntriples"
  | "nquads";

/**
 * JSON-LD value (object or compact IRI string)
 */
export type JsonLdValue = string | object;

/**
 * RDF source - discriminated union for different input types
 * 
 * All RDF sources must be parseable with a known base IRI:
 * - file: Uses file:/// URL from absolute path
 * - url: Uses the URL itself as base
 * - inline: Uses synthetic file:///virtual/... as base
 */
export type RdfSource =
  | {
    kind: "inline";
    syntax: "jsonld";
    jsonld: JsonLdValue;
  }
  | {
    kind: "file";
    path: string;
    syntax?: RdfSyntax; // optional hint for format detection
  }
  | {
    kind: "url";
    url: string;
    syntax?: RdfSyntax; // optional hint for format detection
  };

/**
 * Parsed RDF dataset with metadata
 * 
 * Quads always contain absolute IRIs (RDF/JS standard).
 * Relativity is a serialization concern, not a data model concern.
 */
export interface ParsedRdf {
  /** Detected or provided syntax */
  syntax: RdfSyntax;

  /** The document IRI used as parse base (always absolute) */
  baseIri: string;

  /** RDF quads with absolute IRIs */
  quads: Quad[];
}
