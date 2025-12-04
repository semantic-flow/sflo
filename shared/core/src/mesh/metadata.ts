/**
 * Metadata Generation
 *
 * Creates minimal knop metadata with provenance stubs.
 *
 * NOTE: This is used by weaves, not by createKnop.
 * createKnop no longer generates metadata RDF.
 *
 * See: task.2025-11-27-createKnop, concept.metadata.provenance
 */

import { DataFactory } from "n3";
import type { Quad } from "@rdfjs/types";

const { namedKnop, literal, quad, defaultGraph } = DataFactory;

// Common vocabulary IRIs
const RDF = {
  type: namedKnop("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
};

const DCTERMS = {
  title: namedKnop("http://purl.org/dc/terms/title"),
  description: namedKnop("http://purl.org/dc/terms/description"),
  created: namedKnop("http://purl.org/dc/terms/created"),
  rightsHolder: namedKnop("http://purl.org/dc/terms/rightsHolder"),
  license: namedKnop("http://purl.org/dc/terms/license"),
};

const PROV = {
  Entity: namedKnop("http://www.w3.org/ns/prov#Entity"),
  Activity: namedKnop("http://www.w3.org/ns/prov#Activity"),
  wasGeneratedBy: namedKnop("http://www.w3.org/ns/prov#wasGeneratedBy"),
  wasAssociatedWith: namedKnop("http://www.w3.org/ns/prov#wasAssociatedWith"),
  atTime: namedKnop("http://www.w3.org/ns/prov#atTime"),
};

/**
 * Generate minimal knop metadata quads
 *
 * Creates:
 * - Knop entity with type
 * - Creation activity stub
 * - Basic provenance (rights holder, license if provided)
 * - Timestamp
 *
 * @param knopSlug - The knop's slug
 * @param baseIri - The base IRI for this knop (file:/// URL)
 * @param provenanceInput - Optional provenance information
 * @returns Array of RDF quads with absolute IRIs
 */
export function generateKnopMetadata(
  knopSlug: string,
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

  // Knop IRI: relative path from metadata file to knop (../../..)
  // This will be debased to "../../.." in serialization
  const knopIri = namedKnop(`${baseIri}/../../..`);

  // Creation activity IRI (fragment, resolved against base)
  const creationActivityIri = namedKnop(`${baseIri}#creation`);

  // Current timestamp
  const now = new Date().toISOString();

  // --- Knop as PROV Entity ---
  quads.push(
    quad(knopIri, RDF.type, PROV.Entity, defaultGraph())
  );

  // Basic descriptive metadata
  quads.push(
    quad(
      knopIri,
      DCTERMS.title,
      literal(knopSlug),
      defaultGraph()
    )
  );

  quads.push(
    quad(
      knopIri,
      DCTERMS.description,
      literal(`mesh knop: ${knopSlug}`),
      defaultGraph()
    )
  );

  quads.push(
    quad(
      knopIri,
      DCTERMS.created,
      literal(now, namedKnop("http://www.w3.org/2001/XMLSchema#dateTime")),
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
      literal(now, namedKnop("http://www.w3.org/2001/XMLSchema#dateTime")),
      defaultGraph()
    )
  );

  // Link knop to creation activity
  quads.push(
    quad(knopIri, PROV.wasGeneratedBy, creationActivityIri, defaultGraph())
  );

  // --- Provenance Information ---
  if (provenanceInput) {
    // Primary agent
    if (provenanceInput.primaryAgentIri) {
      quads.push(
        quad(
          creationActivityIri,
          PROV.wasAssociatedWith,
          namedKnop(provenanceInput.primaryAgentIri),
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
          knopIri,
          DCTERMS.rightsHolder,
          namedKnop(rightsHolderIri),
          defaultGraph()
        )
      );
    }

    // License
    if (provenanceInput.licenseIri) {
      quads.push(
        quad(
          knopIri,
          DCTERMS.license,
          namedKnop(provenanceInput.licenseIri),
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
            namedKnop(contributorIri),
            defaultGraph()
          )
        );
      }
    }
  }

  return quads;
}
