from pathlib import Path

from pyshacl import validate
from rdflib import Graph


ROOT = Path(__file__).resolve().parents[1]
SHAPES_PATH = ROOT / "semantic-flow-core-shacl.ttl"
ONTOLOGY_PATH = ROOT / "semantic-flow-core-ontology.ttl"
DIGEST_A = "sha256:" + "a" * 64
DIGEST_B = "sha256:" + "b" * 64

PREFIXES = """
@prefix ex: <https://example.test/> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix sflo: <https://semantic-flow.github.io/sflo/ontology/> .
"""


CASES = [
    (
        "manifestation target makes a local resolution spec exact",
        True,
        """
        ex:spec a sflo:ArtifactResolutionSpec ;
          sflo:targetLocalRelativePath "source.ttl" ;
          sflo:targetManifestation ex:manifestation .
        ex:manifestation a sflo:ArtifactManifestation ;
          sflo:locatedFileForManifestation ex:file .
        ex:file a sflo:LocatedFile .
        """,
        None,
    ),
    (
        "valid manifestation and located-file claims",
        True,
        f"""
        ex:manifestation a sflo:ArtifactManifestation ;
          sflo:hasContentDigest "{DIGEST_A}" ;
          sflo:locatedFileForManifestation ex:file .
        ex:file a sflo:LocatedFile ;
          sflo:hasContentDigest "{DIGEST_A}" .
        """,
        None,
    ),
    (
        "valid downstream bearer subclass",
        True,
        f"""
        ex:CustomBearer rdfs:subClassOf sflo:ContentDigestBearer .
        ex:content a ex:CustomBearer ;
          sflo:hasContentDigest "{DIGEST_A}" .
        """,
        None,
    ),
    (
        "expected and historical observed values may differ in stored RDF",
        True,
        f"""
        ex:requested a sflo:ArtifactResolutionSpec ;
          sflo:expectsContentDigest "{DIGEST_A}" ;
          sflo:hasResolutionObservation ex:observation .
        ex:observation a sflo:ArtifactResolutionObservation ;
          sflo:observedArtifactResolutionSpec [ a sflo:ArtifactResolutionSpec ] ;
          sflo:observedContentDigest "{DIGEST_B}" .
        """,
        None,
    ),
    (
        "untyped malformed observed digest",
        False,
        """
        ex:observation sflo:observedContentDigest "sha256:XYZ" .
        """,
        "sflo:observedContentDigest values MUST use 'sha256:'",
    ),
    (
        "duplicate standing digest method",
        False,
        f"""
        ex:file a sflo:LocatedFile ;
          sflo:hasContentDigest "{DIGEST_A}", "{DIGEST_B}" .
        """,
        "MUST NOT declare different sflo:hasContentDigest values",
    ),
    (
        "manifestation and file mismatch without explicit manifestation type",
        False,
        f"""
        ex:manifestation
          sflo:hasContentDigest "{DIGEST_A}" ;
          sflo:locatedFileForManifestation ex:file .
        ex:file a sflo:LocatedFile ;
          sflo:hasContentDigest "{DIGEST_B}" .
        """,
        "MUST NOT declare different content digests",
    ),
    (
        "duplicate observed digest method",
        False,
        f"""
        ex:observation
          sflo:observedArtifactResolutionSpec [ a sflo:ArtifactResolutionSpec ] ;
          sflo:observedContentDigest "{DIGEST_A}", "{DIGEST_B}" .
        """,
        "MUST NOT declare different observed content-digest values",
    ),
    (
        "repository locator digest",
        False,
        f"""
        ex:locator a sflo:RepositorySourceLocator ;
          sflo:sourceRepositoryUrl "https://example.test/repository.git" ;
          sflo:sourceRepositoryRef "main" ;
          sflo:sourceRepositoryPath "source.ttl" ;
          sflo:hasContentDigest "{DIGEST_A}" .
        """,
        "RepositorySourceLocator MUST NOT declare sflo:hasContentDigest",
    ),
    (
        "repository locator expected and observed digest leakage",
        False,
        f"""
        ex:locator a sflo:RepositorySourceLocator ;
          sflo:sourceRepositoryUrl "https://example.test/repository.git" ;
          sflo:sourceRepositoryRef "main" ;
          sflo:sourceRepositoryPath "source.ttl" ;
          sflo:expectsContentDigest "{DIGEST_A}" ;
          sflo:observedArtifactResolutionSpec [ a sflo:ArtifactResolutionSpec ] ;
          sflo:observedContentDigest "{DIGEST_A}" .
        """,
        "RepositorySourceLocator MUST NOT declare sflo:observedContentDigest",
    ),
    (
        "standing digest without an explicit bearer type",
        False,
        f"""
        ex:content sflo:hasContentDigest "{DIGEST_A}" .
        """,
        "SHOULD be explicitly typed sflo:ContentDigestBearer",
    ),
]


def parse_turtle(contents: str) -> Graph:
    graph = Graph()
    graph.parse(data=PREFIXES + contents, format="turtle")
    return graph


def main() -> None:
    shapes = Graph().parse(SHAPES_PATH, format="turtle")
    ontology = Graph().parse(ONTOLOGY_PATH, format="turtle")

    failures: list[str] = []
    for name, expected_conforms, turtle, expected_message in CASES:
        conforms, _, report_text = validate(
            data_graph=parse_turtle(turtle),
            shacl_graph=shapes,
            ont_graph=ontology,
            inference="none",
            advanced=True,
            allow_infos=False,
            allow_warnings=False,
        )
        if bool(conforms) != expected_conforms:
            failures.append(
                f"{name}: expected conforms={expected_conforms}, got {conforms}\n{report_text}"
            )
            continue
        if expected_message is not None and expected_message not in report_text:
            failures.append(
                f"{name}: report omitted expected message {expected_message!r}\n{report_text}"
            )

    if failures:
        raise SystemExit("\n\n".join(failures))

    print(f"Executed {len(CASES)} SHACL fixtures with PySHACL.")


if __name__ == "__main__":
    main()
