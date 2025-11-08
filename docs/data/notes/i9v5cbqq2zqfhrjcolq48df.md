
# Development Patterns

This document captures recurring architectural and code patterns used throughout the Semantic Flow project.

## Architectural Patterns

### Comunica SPARQL vs Quadstore Primitives for data access

Both can win. Pick by query shape.

Use Quadstore primitives (`get`, `getStream`, `match`) when:

* One or two triple patterns with fixed IRIs/literals.
* You can drive lookups by known keys and stop early.
* You need strict control over streaming, batching, or a read-modify-write cycle.
* You want zero SPARQL parse/plan overhead.

Use SPARQL via Comunica when:

* Three or more patterns with joins, OPTIONAL/UNION, FILTER, ORDER BY, GROUP BY, LIMIT.
* You’d benefit from join reordering, filter/projection pushdown, and early result streaming.
* You might federate later or swap sources without rewriting app code.

Why primitives can be faster on “simple”:

* Direct index hits with no planner cost.
* Tight loops with `for await...of` and immediate early-exit.
* You can pre-narrow with exact keys or prefix scans and avoid any join at all.

A practical split for internal data access:

* “Path to one thing” lookups (by IRI, by type, by id): primitives.
* Graph navigation with 3+ hops or any aggregation/sorting: SPARQL.

Hybrid patterns that work well:

* Use primitives to fetch candidate IRIs, then pass them into a SPARQL `VALUES` clause.
* Pre-materialize small “views” (denormalized quads) you hit often, then query them with SPARQL.
* Keep SPARQL templates for common shapes; fall back to primitives for hot key-lookups.

Implementation notes:

* Consume streams with `for await (const q of stream)`; await completion at the boundary with `stream/promises` `finished()` or `pipeline()`.
* Reuse a single Comunica engine instance to amortize init cost.
* With Quadstore, structure data so frequent lookups align with available index permutations; primitives shine when you can select by the leading fields.

Rule of thumb:

* Simple, key-oriented, latency-sensitive ⇒ primitives.
* Anything with joins/options/ordering/aggregation ⇒ SPARQL.

### Stream Patterns

Use async/await for boundaries (start/finish), and use async iteration for the stream body.

* Promises: use `await` for file I/O (`fs/promises`), HTTP fetches, initialization, and “collect-all” helpers that intentionally materialize results.

* Streaming RDF (RDF/JS, Comunica, rdf-parse/serialize, rdf-ext):

  * Prefer async iterators:

    ```ts
    // quadStream implements AsyncIterable<Quad>
    for await (const quad of quadStream) {
      // process quad
    }
    ```

    This gives proper backpressure. Do not `.on('data', ...)` and `await` inside the handler.
  * If a sink uses RDF/JS `Sink#import(source)`, await completion with Node’s stream utilities:

    ```ts
    import { finished } from 'stream/promises';

    const writer = serializer.import(quadStream); // returns a Node stream
    await finished(writer); // resolves on 'finish' or rejects on error
    ```
  * For stream pipelines, use `pipeline`:

    ```ts
    import { pipeline } from 'stream/promises';

    await pipeline(sourceStream, transformA, transformB, destStream);
    ```
  * Comunica result streams (bindings/quad streams) also support async iteration:

    ```ts
    const { data } = await engine.query('CONSTRUCT {...}', { sources });
    for await (const quad of data) { /* ... */ }
    ```

* Collecting small results only:

  ```ts
  import arrayifyStream from 'arrayify-stream';
  const quads = await arrayifyStream(quadStream); // OK for small datasets
  ```

  Avoid this for large data.

* Writing to stores:

  ```ts
  // RDF/JS store that exposes import()
  const importing = store.import(quadStream);
  await finished(importing);
  ```

Rule of thumb to include:
Use `await` for Promises and stream completion. Use `for await...of` to consume streaming RDF. Avoid `await` inside `'data'` listeners and avoid buffering everything unless you explicitly need it.

### Error Handling and Logging System Patterns

see [[dev.logging-and-error-handling]]


