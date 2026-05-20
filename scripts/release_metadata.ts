export const ACTIVE_RELEASE_FILES = [
  {
    file: "semantic-flow-core-ontology.ttl",
    ontologyIri: "https://semantic-flow.github.io/sflo/ontology",
    namespaceUri: "https://semantic-flow.github.io/sflo/ontology/",
    prefix: "sflo",
    pagesPublished: true,
  },
  {
    file: "semantic-flow-core-shacl.ttl",
    ontologyIri: "https://semantic-flow.github.io/sflo/ontology/shacl",
    namespaceUri: "https://semantic-flow.github.io/sflo/ontology/shacl/",
    prefix: "sflo-shacl",
    pagesPublished: true,
  },
  {
    file: "semantic-flow-config-ontology.ttl",
    ontologyIri: "https://semantic-flow.github.io/sflo/config",
    namespaceUri: "https://semantic-flow.github.io/sflo/config/",
    prefix: "sfcfg",
    pagesPublished: true,
  },
  {
    file: "semantic-flow-job-ontology.ttl",
    ontologyIri: "https://semantic-flow.github.io/ontology/job",
    namespaceUri: "https://semantic-flow.github.io/ontology/job/",
    prefix: "sfjob",
    pagesPublished: false,
  },
  {
    file: "semantic-flow-prov-ontology.ttl",
    ontologyIri: "https://semantic-flow.github.io/ontology/prov",
    namespaceUri: "https://semantic-flow.github.io/ontology/prov/",
    prefix: "sfprov",
    pagesPublished: false,
  },
] as const;

export type ReleaseFileDescriptor = typeof ACTIVE_RELEASE_FILES[number];

export function releaseIris(
  descriptor: ReleaseFileDescriptor,
  version: string,
): ReleaseIris {
  const releaseIri = `${descriptor.ontologyIri}/releases/v${version}`;
  const manifestationIri = `${releaseIri}/ttl`;
  const releasePayloadIri = `${manifestationIri}/${descriptor.file}`;
  const versionIri =
    `https://raw.githubusercontent.com/semantic-flow/sflo/refs/tags/v${version}/${descriptor.file}`;

  return {
    manifestationIri,
    releaseIri,
    releasePayloadIri,
    versionIri,
  };
}

export function isSemver(value: string): boolean {
  return /^\d+\.\d+\.\d+$/.test(value);
}

export function isDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export interface ReleaseIris {
  manifestationIri: string;
  releaseIri: string;
  releasePayloadIri: string;
  versionIri: string;
}
