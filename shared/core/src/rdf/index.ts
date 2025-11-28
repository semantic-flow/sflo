/**
 * RDF Loading and Serialization
 * 
 * Exports the core RDF functionality for Semantic Flow:
 * - Type definitions for RdfSource
 * - Parsing with file:/// base handling
 * - Serialization with debasing support
 * 
 * See: concept.implied-rdf-base, concept.debasing, concept.identifier.intramesh.relative
 */

export type {
  RdfSyntax,
  JsonLdValue,
  RdfSource,
  ParsedRdf,
} from "./types.js";

export { parseRdfSource } from "./parser.js";

export type { SerializeOptions } from "./serializer.js";
export { serializeRdf } from "./serializer.js";
