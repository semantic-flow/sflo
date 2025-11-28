/**
 * Metadata Generation
 *
 * Creates minimal node metadata with provenance stubs.
 *
 * NOTE: This is used by weaves, not by createNode.
 * createNode no longer generates metadata RDF.
 *
 * See: task.2025-11-27-createNode, concept.metadata.provenance
 */

import { DataFactory } from "n3";
import type { Quad } from "@rdfjs/types";

const { namedNode, literal, quad, defaultGraph } = DataFactory;

// Common vocabulary IRIs
const RDF = {
  type: namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
};

const DCTERMS = {
  title: namedNode("http://purl.org/dc/terms/title"),
  description: namedNode("http://purl.org/dc/terms/description"),
  created: namedNode("http://purl.org/dc/terms/created"),
  rightsHolder: namedNode("http://purl.org/dc/terms/rightsHolder"),
  license: namedNode("http://purl.org/dc/terms/license"),
};

const PROV = {
  Entity: namedNode("http://www.w3.org/ns/prov#Entity"),
  Activity: namedNode("http://www.w3.org/ns/prov#Activity"),
  wasGeneratedBy: namedNode("http://www.w3.org/ns/prov#wasGeneratedBy"),
  wasAssociatedWith: namedNode("http://www.w3.org/ns/prov#wasAssociatedWith"),
  atTime: namedNode("http://www.w3.org/ns/prov#atTime"),
};

/**
 * Generate minimal node metadata quads
 *
 * Creates:
 * - Node entity with type
 * - Creation activity stub
 * - Basic provenance (rights holder, license if provided)
 * - Timestamp
 *
 * @param nodeSlug - The node's slug
 * @param baseIri - The base IRI for this node (file:/// URL)
 * @param provenanceInput - Optional provenance information
 * @returns Array of RDF quads with absolute IRIs
 */
export function generateNodeMetadata(
  nodeSlug: string,
  baseIri: string,
  provenanceInput?: {
    primaryAgentIri?: string;
    organizationIri?: string;
    contributorsIri?: string[];
    rightsHolderIri?: string;
    licenseIri?: string;
  }
): Quad[] {
  const quads: Quad[] = [];

  // Node IRI: relative path from metadata file to node (../../..)
  // This will be debased to "../../.." in serialization
  const nodeIri = namedNode(`${baseIri}/../../..`);

  // Creation activity IRI (fragment, resolved against base)
  const creationActivityIri = namedNode(`${baseIri}#creation`);

  // Current timestamp
  const now = new Date().toISOString();

  // --- Node as PROV Entity ---
  quads.push(
    quad(nodeIri, RDF.type, PROV.Entity, defaultGraph())
  );

  // Basic descriptive metadata
  quads.push(
    quad(
      nodeIri,
      DCTERMS.title,
      literal(nodeSlug),
      defaultGraph()
    )
  );

  quads.push(
    quad(
      nodeIri,
      DCTERMS.description,
      literal(`Mesh node: ${nodeSlug}`),
      defaultGraph()
    )
  );

  quads.push(
    quad(
      nodeIri,
      DCTERMS.created,
      literal(now, namedNode("http://www.w3.org/2001/XMLSchema#dateTime")),
      defaultGraph()
    )
  );

  // --- Creation Activity ---
  quads.push(
    quad(creationActivityIri, RDF.type, PROV.Activity, defaultGraph())
  );

  quads.push(
    quad(
      creationActivityIri,
      PROV.atTime,
      literal(now, namedNode("http://www.w3.org/2001/XMLSchema#dateTime")),
      defaultGraph()
    )
  );

  // Link node to creation activity
  quads.push(
    quad(nodeIri, PROV.wasGeneratedBy, creationActivityIri, defaultGraph())
  );

  // --- Provenance Information ---
  if (provenanceInput) {
    // Primary agent
    if (provenanceInput.primaryAgentIri) {
      quads.push(
        quad(
          creationActivityIri,
          PROV.wasAssociatedWith,
          namedNode(provenanceInput.primaryAgentIri),
          defaultGraph()
        )
      );
    }

    // Rights holder
    const rightsHolderIri = provenanceInput.rightsHolderIri
      || provenanceInput.organizationIri
      || provenanceInput.primaryAgentIri;

    if (rightsHolderIri) {
      quads.push(
        quad(
          nodeIri,
          DCTERMS.rightsHolder,
          namedNode(rightsHolderIri),
          defaultGraph()
        )
      );
    }

    // License
    if (provenanceInput.licenseIri) {
      quads.push(
        quad(
          nodeIri,
          DCTERMS.license,
          namedNode(provenanceInput.licenseIri),
          defaultGraph()
        )
      );
    }

    // Additional contributors
    if (provenanceInput.contributorsIri) {
      for (const contributorIri of provenanceInput.contributorsIri) {
        quads.push(
          quad(
            creationActivityIri,
            PROV.wasAssociatedWith,
            namedNode(contributorIri),
            defaultGraph()
          )
        );
      }
    }
  }

  return quads;
}
