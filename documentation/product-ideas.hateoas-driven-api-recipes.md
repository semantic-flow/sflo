---
id: 4j2enes6uw5mgysfqaucuty
title: Hateoas Driven API Recipe
desc: ''
updated: 1753569859264
created: 1753569823797
---

## Your Use Case

You're not just documenting the API — you're using it:

-   To **operate a mesh manually**, before clients exist.
    
-   You need an **executable interface**, not just static documentation.
    
-   You want **structured examples** (i.e. **recipes**) that can act as proto-clients or decision-paths.
    
-   You lean toward **HATEOAS** style: i.e., user follows links (or rels), maybe inputting small bits along the way.
    

___

## 🔥 This is _not_ what Scalar is designed for

Scalar is a **docs tool**, great for:

-   Rendering OpenAPI reference UIs.
    
-   Hosting and styling spec-based endpoints.
    
-   **Not** for chaining calls, dynamic flows, or acting like a human-in-the-loop client.
    

Even Stoplight or RapiDoc start to feel clunky in your context, because what you’re actually describing is closer to:

### \> ✅ A human-usable API client with structured, composable, inspectable **API macros or flows**

___

## 🚨 So yes, you probably need to build something.

But here's how to think about it critically, so you **don’t throw away everything** or reinvent everything either.

___

## 🧠 What You Actually Want: A “HATEOAS Recipe Runner”

You’re describing a system that does the following:

| Feature                        | Description                                                    |
| ------------------------------ | -------------------------------------------------------------- |
| 🔧 **Embeds real OpenAPI**      | So you get type safety, endpoint listings, schemas, validation |
| 🧪 **Can execute requests**     | Full HTTP interaction, possibly with state/cookies/token       |
| 🪜 **Supports recipes/flows**   | Sequence of calls, possibly branching via hypermedia           |
| 🧵 **Has local state/input**    | To reuse values from previous steps                            |
| 📎 **HATEOAS link traversal**   | e.g. follow `"next"` or `"create"` link relations dynamically  |
| 🧰 **Deno/TS-native**           | So it integrates with your mesh, Weave, etc.                   |
| 🧭 **Interactive + replayable** | You can try things, backtrack, debug                           |

## Your Use Case

You're not just documenting the API — you're using it:

-   To **operate a mesh manually**, before clients exist.
    
-   You need an **executable interface**, not just static documentation.
    
-   You want **structured examples** (i.e. **recipes**) that can act as proto-clients or decision-paths.
    
-   You lean toward **HATEOAS** style: i.e., user follows links (or rels), maybe inputting small bits along the way.
    

___

## 🔥 This is _not_ what Scalar is designed for

Scalar is a **docs tool**, great for:

-   Rendering OpenAPI reference UIs.
    
-   Hosting and styling spec-based endpoints.
    
-   **Not** for chaining calls, dynamic flows, or acting like a human-in-the-loop client.
    

Even Stoplight or RapiDoc start to feel clunky in your context, because what you’re actually describing is closer to:

### \> ✅ A human-usable API client with structured, composable, inspectable **API macros or flows**

___

## 🚨 So yes, you probably need to build something.

But here's how to think about it critically, so you **don’t throw away everything** or reinvent everything either.

___

## 🧠 What You Actually Want: A “HATEOAS Recipe Runner”

You’re describing a system that does the following:

| Feature                        | Description                                                    |
| ------------------------------ | -------------------------------------------------------------- |
| 🔧 **Embeds real OpenAPI**      | So you get type safety, endpoint listings, schemas, validation |
| 🧪 **Can execute requests**     | Full HTTP interaction, possibly with state/cookies/token       |
| 🪜 **Supports recipes/flows**   | Sequence of calls, possibly branching via hypermedia           |
| 🧵 **Has local state/input**    | To reuse values from previous steps                            |
| 📎 **HATEOAS link traversal**   | e.g. follow `"next"` or `"create"` link relations dynamically  |
| 🧰 **Deno/TS-native**           | So it integrates with your mesh, Weave, etc.                   |
| 🧭 **Interactive + replayable** | You can try things, backtrack, debug                           |

## Your Use Case

You're not just documenting the API — you're using it:

-   To **operate a mesh manually**, before clients exist.
    
-   You need an **executable interface**, not just static documentation.
    
-   You want **structured examples** (i.e. **recipes**) that can act as proto-clients or decision-paths.
    
-   You lean toward **HATEOAS** style: i.e., user follows links (or rels), maybe inputting small bits along the way.
    

___

## 🔥 This is _not_ what Scalar is designed for

Scalar is a **docs tool**, great for:

-   Rendering OpenAPI reference UIs.
    
-   Hosting and styling spec-based endpoints.
    
-   **Not** for chaining calls, dynamic flows, or acting like a human-in-the-loop client.
    

Even Stoplight or RapiDoc start to feel clunky in your context, because what you’re actually describing is closer to:

### \> ✅ A human-usable API client with structured, composable, inspectable **API macros or flows**

___

## 🚨 So yes, you probably need to build something.

But here's how to think about it critically, so you **don’t throw away everything** or reinvent everything either.

___

## 🧠 What You Actually Want: A “HATEOAS Recipe Runner”

You’re describing a system that does the following:

| Feature                        | Description                                                    |
| ------------------------------ | -------------------------------------------------------------- |
| 🔧 **Embeds real OpenAPI**      | So you get type safety, endpoint listings, schemas, validation |
| 🧪 **Can execute requests**     | Full HTTP interaction, possibly with state/cookies/token       |
| 🪜 **Supports recipes/flows**   | Sequence of calls, possibly branching via hypermedia           |
| 🧵 **Has local state/input**    | To reuse values from previous steps                            |
| 📎 **HATEOAS link traversal**   | e.g. follow `"next"` or `"create"` link relations dynamically  |
| 🧰 **Deno/TS-native**           | So it integrates with your mesh, Weave, etc.                   |
| 🧭 **Interactive + replayable** | You can try things, backtrack, debug                           |

## Your Use Case

You're not just documenting the API — you're using it:

-   To **operate a mesh manually**, before clients exist.
    
-   You need an **executable interface**, not just static documentation.
    
-   You want **structured examples** (i.e. **recipes**) that can act as proto-clients or decision-paths.
    
-   You lean toward **HATEOAS** style: i.e., user follows links (or rels), maybe inputting small bits along the way.
    

___

## 🔥 This is _not_ what Scalar is designed for

Scalar is a **docs tool**, great for:

-   Rendering OpenAPI reference UIs.
    
-   Hosting and styling spec-based endpoints.
    
-   **Not** for chaining calls, dynamic flows, or acting like a human-in-the-loop client.
    

Even Stoplight or RapiDoc start to feel clunky in your context, because what you’re actually describing is closer to:

### \> ✅ A human-usable API client with structured, composable, inspectable **API macros or flows**

___

## 🚨 So yes, you probably need to build something.

But here's how to think about it critically, so you **don’t throw away everything** or reinvent everything either.

___

## 🧠 What You Actually Want: A “HATEOAS Recipe Runner”

You’re describing a system that does the following:

| Feature                        | Description                                                    |
| ------------------------------ | -------------------------------------------------------------- |
| 🔧 **Embeds real OpenAPI**      | So you get type safety, endpoint listings, schemas, validation |
| 🧪 **Can execute requests**     | Full HTTP interaction, possibly with state/cookies/token       |
| 🪜 **Supports recipes/flows**   | Sequence of calls, possibly branching via hypermedia           |
| 🧵 **Has local state/input**    | To reuse values from previous steps                            |
| 📎 **HATEOAS link traversal**   | e.g. follow `"next"` or `"create"` link relations dynamically  |
| 🧰 **Deno/TS-native**           | So it integrates with your mesh, Weave, etc.                   |
| 🧭 **Interactive + replayable** | You can try things, backtrack, debug                           |

## Your Use Case

You're not just documenting the API — you're using it:

-   To **operate a mesh manually**, before clients exist.
    
-   You need an **executable interface**, not just static documentation.
    
-   You want **structured examples** (i.e. **recipes**) that can act as proto-clients or decision-paths.
    
-   You lean toward **HATEOAS** style: i.e., user follows links (or rels), maybe inputting small bits along the way.
    

___

## 🔥 This is _not_ what Scalar is designed for

Scalar is a **docs tool**, great for:

-   Rendering OpenAPI reference UIs.
    
-   Hosting and styling spec-based endpoints.
    
-   **Not** for chaining calls, dynamic flows, or acting like a human-in-the-loop client.
    

Even Stoplight or RapiDoc start to feel clunky in your context, because what you’re actually describing is closer to:

### \> ✅ A human-usable API client with structured, composable, inspectable **API macros or flows**

___

## 🚨 So yes, you probably need to build something.

But here's how to think about it critically, so you **don’t throw away everything** or reinvent everything either.

___

## 🧠 What You Actually Want: A “HATEOAS Recipe Runner”

You’re describing a system that does the following:

| Feature                        | Description                                                    |
| ------------------------------ | -------------------------------------------------------------- |
| 🔧 **Embeds real OpenAPI**      | So you get type safety, endpoint listings, schemas, validation |
| 🧪 **Can execute requests**     | Full HTTP interaction, possibly with state/cookies/token       |
| 🪜 **Supports recipes/flows**   | Sequence of calls, possibly branching via hypermedia           |
| 🧵 **Has local state/input**    | To reuse values from previous steps                            |
| 📎 **HATEOAS link traversal**   | e.g. follow `"next"` or `"create"` link relations dynamically  |
| 🧰 **Deno/TS-native**           | So it integrates with your mesh, Weave, etc.                   |
| 🧭 **Interactive + replayable** | You can try things, backtrack, debug                           |

## Your Use Case

You're not just documenting the API — you're using it:

-   To **operate a mesh manually**, before clients exist.
    
-   You need an **executable interface**, not just static documentation.
    
-   You want **structured examples** (i.e. **recipes**) that can act as proto-clients or decision-paths.
    
-   You lean toward **HATEOAS** style: i.e., user follows links (or rels), maybe inputting small bits along the way.
    

___

## 🔥 This is _not_ what Scalar is designed for

Scalar is a **docs tool**, great for:

-   Rendering OpenAPI reference UIs.
    
-   Hosting and styling spec-based endpoints.
    
-   **Not** for chaining calls, dynamic flows, or acting like a human-in-the-loop client.
    

Even Stoplight or RapiDoc start to feel clunky in your context, because what you’re actually describing is closer to:

### \> ✅ A human-usable API client with structured, composable, inspectable **API macros or flows**

___

## 🚨 So yes, you probably need to build something.

But here's how to think about it critically, so you **don’t throw away everything** or reinvent everything either.

___

## 🧠 What You Actually Want: A “HATEOAS Recipe Runner”

You’re describing a system that does the following:

| Feature                        | Description                                                    |
| ------------------------------ | -------------------------------------------------------------- |
| 🔧 **Embeds real OpenAPI**      | So you get type safety, endpoint listings, schemas, validation |
| 🧪 **Can execute requests**     | Full HTTP interaction, possibly with state/cookies/token       |
| 🪜 **Supports recipes/flows**   | Sequence of calls, possibly branching via hypermedia           |
| 🧵 **Has local state/input**    | To reuse values from previous steps                            |
| 📎 **HATEOAS link traversal**   | e.g. follow `"next"` or `"create"` link relations dynamically  |
| 🧰 **Deno/TS-native**           | So it integrates with your mesh, Weave, etc.                   |
| 🧭 **Interactive + replayable** | You can try things, backtrack, debug                           |

## Your Use Case

You're not just documenting the API — you're using it:

-   To **operate a mesh manually**, before clients exist.
    
-   You need an **executable interface**, not just static documentation.
    
-   You want **structured examples** (i.e. **recipes**) that can act as proto-clients or decision-paths.
    
-   You lean toward **HATEOAS** style: i.e., user follows links (or rels), maybe inputting small bits along the way.
    

___

## 🔥 This is _not_ what Scalar is designed for

Scalar is a **docs tool**, great for:

-   Rendering OpenAPI reference UIs.
    
-   Hosting and styling spec-based endpoints.
    
-   **Not** for chaining calls, dynamic flows, or acting like a human-in-the-loop client.
    

Even Stoplight or RapiDoc start to feel clunky in your context, because what you’re actually describing is closer to:

### \> ✅ A human-usable API client with structured, composable, inspectable **API macros or flows**

___

## 🚨 So yes, you probably need to build something.

But here's how to think about it critically, so you **don’t throw away everything** or reinvent everything either.

___

## 🧠 What You Actually Want: A “HATEOAS Recipe Runner”

You’re describing a system that does the following:

| Feature                        | Description                                                    |
| ------------------------------ | -------------------------------------------------------------- |
| 🔧 **Embeds real OpenAPI**      | So you get type safety, endpoint listings, schemas, validation |
| 🧪 **Can execute requests**     | Full HTTP interaction, possibly with state/cookies/token       |
| 🪜 **Supports recipes/flows**   | Sequence of calls, possibly branching via hypermedia           |
| 🧵 **Has local state/input**    | To reuse values from previous steps                            |
| 📎 **HATEOAS link traversal**   | e.g. follow `"next"` or `"create"` link relations dynamically  |
| 🧰 **Deno/TS-native**           | So it integrates with your mesh, Weave, etc.                   |
| 🧭 **Interactive + replayable** | You can try things, backtrack, debug                           |

## Your Use Case

You're not just documenting the API — you're using it:

-   To **operate a mesh manually**, before clients exist.
    
-   You need an **executable interface**, not just static documentation.
    
-   You want **structured examples** (i.e. **recipes**) that can act as proto-clients or decision-paths.
    
-   You lean toward **HATEOAS** style: i.e., user follows links (or rels), maybe inputting small bits along the way.
    

___

## 🔥 This is _not_ what Scalar is designed for

Scalar is a **docs tool**, great for:

-   Rendering OpenAPI reference UIs.
    
-   Hosting and styling spec-based endpoints.
    
-   **Not** for chaining calls, dynamic flows, or acting like a human-in-the-loop client.
    

Even Stoplight or RapiDoc start to feel clunky in your context, because what you’re actually describing is closer to:

### \> ✅ A human-usable API client with structured, composable, inspectable **API macros or flows**

___

## 🚨 So yes, you probably need to build something.

But here's how to think about it critically, so you **don’t throw away everything** or reinvent everything either.

___

## 🧠 What You Actually Want: A “HATEOAS Recipe Runner”

You’re describing a system that does the following:

| Feature                        | Description                                                    |
| ------------------------------ | -------------------------------------------------------------- |
| 🔧 **Embeds real OpenAPI**      | So you get type safety, endpoint listings, schemas, validation |
| 🧪 **Can execute requests**     | Full HTTP interaction, possibly with state/cookies/token       |
| 🪜 **Supports recipes/flows**   | Sequence of calls, possibly branching via hypermedia           |
| 🧵 **Has local state/input**    | To reuse values from previous steps                            |
| 📎 **HATEOAS link traversal**   | e.g. follow `"next"` or `"create"` link relations dynamically  |
| 🧰 **Deno/TS-native**           | So it integrates with your mesh, Weave, etc.                   |
| 🧭 **Interactive + replayable** | You can try things, backtrack, debug                           |

## Your Use Case

You're not just documenting the API — you're using it:

-   To **operate a mesh manually**, before clients exist.
    
-   You need an **executable interface**, not just static documentation.
    
-   You want **structured examples** (i.e. **recipes**) that can act as proto-clients or decision-paths.
    
-   You lean toward **HATEOAS** style: i.e., user follows links (or rels), maybe inputting small bits along the way.
    

___

## 🔥 This is _not_ what Scalar is designed for

Scalar is a **docs tool**, great for:

-   Rendering OpenAPI reference UIs.
    
-   Hosting and styling spec-based endpoints.
    
-   **Not** for chaining calls, dynamic flows, or acting like a human-in-the-loop client.
    

Even Stoplight or RapiDoc start to feel clunky in your context, because what you’re actually describing is closer to:

### \> ✅ A human-usable API client with structured, composable, inspectable **API macros or flows**

___

## 🚨 So yes, you probably need to build something.

But here's how to think about it critically, so you **don’t throw away everything** or reinvent everything either.

___

## 🧠 What You Actually Want: A “HATEOAS Recipe Runner”

You’re describing a system that does the following:

| Feature                        | Description                                                    |
| ------------------------------ | -------------------------------------------------------------- |
| 🔧 **Embeds real OpenAPI**      | So you get type safety, endpoint listings, schemas, validation |
| 🧪 **Can execute requests**     | Full HTTP interaction, possibly with state/cookies/token       |
| 🪜 **Supports recipes/flows**   | Sequence of calls, possibly branching via hypermedia           |
| 🧵 **Has local state/input**    | To reuse values from previous steps                            |
| 📎 **HATEOAS link traversal**   | e.g. follow `"next"` or `"create"` link relations dynamically  |
| 🧰 **Deno/TS-native**           | So it integrates with your mesh, Weave, etc.                   |
| 🧭 **Interactive + replayable** | You can try things, backtrack, debug                           |