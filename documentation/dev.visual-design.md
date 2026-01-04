---
id: kr80es6zlr0mz36d34h9m4v
title: Visual Design
desc: ''
updated: 1765427227502
created: 1765318238983
---

## **1. Brand Aesthetic Overview**

Semantic Flow adopts a visual identity best described as:

### **“Modern 1970s Computer Manual”**

A design language that merges:

* the warmth and tactility of 1970s industrial and instructional graphics,
* with the clarity and precision of contemporary typography and UI systems.

### **Core Characteristics**

* **Warm analog tones** evoking card catalogs, punch-card envelopes, and technical documentation.
* **Simple, geometric strokes** inspired by early UNIX diagrams, Bell Labs mark-making, and library signage.
* **Softened geometry** that evokes weaving, threads, and semantic relationships.
* **Clear hierarchy**, with calm spacing and a rhythm inspired by systems thinking.
* **No gradients or glossing**; everything is solid, flat, structured.

### **Goals of this aesthetic**

* Feel authoritative but approachable
* Evoke a sense of craft and knowledge organization
* Avoid the saturation and sameness of modern SaaS branding
* Communicate structure + flow simultaneously
* Bridge analog history (documentation, metadata) with modern semantic tooling

---

# ------------------------------------------------------------

# **2. Color System**

The Semantic Flow palette is built around two central tones:

* **Sienna** — structure, foundation, ontology
* **Oat** — flow, emergence, weaving

These tones express the conceptual duality of Semantic Flow.

## **2.1 Core Brand Colors**

### **Sienna (Primary Dark)**

```
Hex: #A06A2CFF
RGB: 160, 106, 44
```

Warm, grounded, architectural. Represents structure, data models, and stability.

### **Oat (Primary Light)**

```
Hex: #D2B075FF
RGB: 210, 176, 117
```

Soft gold tone, representing flow, transformation, and semantic layering.

---

## **2.2 Background**

### **Cream Paper (Primary Background)**

```
Hex: #F4E9D8
RGB: 244, 233, 216
```

A subtle off-white modeled after archival paper.
Gives the brand warmth and retro-material authenticity.

---

## **2.3 Supporting Colors**

These extend the palette into UI contexts:

### **Ink Brown (Text Primary)**

```
Hex: #7A4E26
```

Good contrast on Cream Paper, reminiscent of printed manuals.

### **Slate Neutral (UI Borders / Metadata)**

```
Hex: #4F5B66
```

Modern counterbalance to warm tones.

### **Teal Thread (Accent / Links / Highlights)**

```
Hex: #1FA8A8
```

A cool accent used sparingly for structural emphasis.

### **Red Clay (Errors / Warnings)**

```
Hex: #BA4A3A
```

### **Success Green (Validation / Completed Flow)**

```
Hex: #4F7C3A
```

### **Shadow Neutral**

```
rgba(0, 0, 0, 0.08)
```

Used for subtle elevation in UI.

---

# ------------------------------------------------------------

# **3. Typography System**

Semantic Flow uses two open-source typefaces to balance warmth and technical precision.

## **3.1 Primary Typeface — Plus Jakarta Sans**

Used for **brand wordmark, interface labels, headings, and marketing text**.

### Why this font works

* Geometry echoes the curvature of the SF monogram.
* Slight retro softness without feeling nostalgic or gimmicky.
* Excellent legibility.
* Works beautifully on Cream Paper.

### Recommended Weights

* **Semantic → Medium (500)**
* **Flow → SemiBold (600)**
* **H1 / H2 → SemiBold**
* **Body text → Regular or Medium**

---

## **3.2 Technical Typeface — IBM Plex Sans**

Used for:

* documentation
* developer-facing interfaces
* diagrams
* product UI text that requires strong clarity

### Why

* Evokes the precision of classic IBM and Bell Labs manuals
* Slight industrial feel
* Works well with code and structured data examples

---

## **3.3 Monospace Typeface — JetBrains Mono**

Used for:

* JSON-LD
* SHACL
* RDF/Turtle
* configuration snippets

Clear, friendly, and rhythmically aligned with the brand.

---

# ------------------------------------------------------------

# **4. Layout, Spacing & Composition Principles**

## **4.1 Spacing Scale**

Use an 8-point modular scale:

```
4 → 8 → 16 → 24 → 32 → 48 → 64
```

This mirrors the internal geometry of the SF monogram.

## **4.2 Corner Radius**

```
8px
```

Friendly, human, slightly retro.

## **4.3 Stroke Weights**

```
2px (UI standard)
```

Matches the thickness logic of the monogram.

## **4.4 Wordmark Spacing**

* Wordmark baseline aligns with F-baseline of the monogram.
* Horizontal spacing from monogram = internal negative space of the S (optically ~1 “S-width chunk”).
* Kerning adjustments must be done manually for precision.

---

# ------------------------------------------------------------

# **5. Iconography & Graphic Language**

## **5.1 Forms**

* Rounded rectangles
* Soft angles
* Thick strokes
* Simple layering

## **5.2 Conceptual Themes**

* Threads, weaving, interlocking lines
* Data paths, flows, and relations
* Bundles (representing dataset series)
* “Mechanical calm”: diagrams should feel deliberate and slow, not noisy or energetic

## **5.3 No gradients**

All icons use **flat fills**, consistent with 1970s technical design.

---

# ------------------------------------------------------------

# **6. Motion / Interaction Principles**

When used, motion should reflect:

* **Flow, not bounce**
  Smooth easing, slow acceleration, gentle arcs.

* **Weaving, not sliding**
  Elements should pass behind/over each other subtly.

* **Reveals, not pops**
  Opacity fades and mask reveals fit the analog feel.

---

# ------------------------------------------------------------

# **7. Voice and Tone Alignment**

The brand’s visual tone is warm, thoughtful, and systematic.
The written tone should match:

* clear
* reference-manual inspired
* structured but not academic
* quietly confident
* metaphor-friendly (threads, weaving, maps, flows)

Think:
“1970s DEC manual rewritten with modern clarity.”

---

# ------------------------------------------------------------

# **8. CSS Tokens / Variables (Initial Set)**

```css
:root {
  /* Brand colors */
  --sf-sienna: #A06A2C;
  --sf-oat: #D2B075;
  --sf-cream-paper: #F4E9D8;

  /* Neutral system */
  --sf-ink: #7A4E26;
  --sf-slate: #4F5B66;

  /* Accents */
  --sf-teal-thread: #1FA8A8;
  --sf-red-clay: #BA4A3A;
  --sf-success-green: #4F7C3A;

  /* Typography */
  --font-primary: "Plus Jakarta Sans", sans-serif;
  --font-tech: "IBM Plex Sans", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;

  /* UI elements */
  --radius: 8px;
  --stroke: 2px;
}
```

---

# ------------------------------------------------------------

# **9. Summary**

Semantic Flow’s design system blends:

* **warmth (70s analog archives)**
* **clarity (modern typography)**
* **structure (ontology, semantic graphs)**
* **flow (ribbons, relationships, movement)**

The result is a brand that feels timeless, unique in the technology space, and deeply aligned with the mission of organizing and connecting meaning.

---
