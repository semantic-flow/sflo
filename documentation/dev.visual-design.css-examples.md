---
id: 6r1p6ovoa5pe33en1uicy15
title: CSS Examples
desc: ''
updated: 1765427493667
created: 1765427450307
---

Below are **production-ready UI component samples** and a **homepage hero section** designed specifically for the *Semantic Flow* brand system.


# **UI COMPONENT SET (Semantic Flow)**

### *“Modern 70s Computer Manual” aesthetic applied to real interface elements.*

---

# **1. Buttons**

### **Primary Button (Sienna)**

Warm, grounded, slightly retro, no gradients, soft radius.

```html
<button class="sf-btn-primary">Start Weaving</button>
```

```css
.sf-btn-primary {
  background: var(--sf-sienna);
  color: white;
  padding: 12px 20px;
  border-radius: var(--radius);
  border: none;
  font-family: var(--font-primary);
  font-weight: 500;
  letter-spacing: 0.2px;
}
.sf-btn-primary:hover {
  background: #8e5c24;
}
```

### **Secondary Button (Oat Outline)**

Feels like a vintage manual tab.

```html
<button class="sf-btn-secondary">Learn More</button>
```

```css
.sf-btn-secondary {
  background: transparent;
  color: var(--sf-sienna);
  padding: 12px 20px;
  border-radius: var(--radius);
  border: 2px solid var(--sf-oat);
  font-family: var(--font-primary);
  font-weight: 500;
}
.sf-btn-secondary:hover {
  background: var(--sf-oat);
  color: var(--sf-ink);
}
```

---

# **2. Navigation Bar**

### **Retro-manual style:** lots of spacing, simple lines, warm tones.

```html
<nav class="sf-nav">
  <div class="sf-logo">SF</div>
  <ul>
    <li>Docs</li>
    <li>Playground</li>
    <li>Templates</li>
    <li>GitHub</li>
  </ul>
</nav>
```

```css
.sf-nav {
  background: var(--sf-cream-paper);
  padding: var(--space-3) var(--space-4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--sf-oat);
  font-family: var(--font-primary);
}

.sf-nav ul {
  display: flex;
  gap: var(--space-4);
  list-style: none;
}

.sf-nav li {
  font-weight: 500;
  color: var(--sf-ink);
}
```

---

# **3. Card Component**

### **Metadata Card / Flow Summary**

Uses soft edges, analog cream, subtle border—feels like an index card.

```html
<div class="sf-card">
  <h3>Node: /ontology/core/Flow</h3>
  <p>Defines the canonical unit of woven semantic data.</p>
  <a href="#">View details →</a>
</div>
```

```css
.sf-card {
  background: white;
  border: 2px solid var(--sf-oat);
  padding: var(--space-4);
  border-radius: var(--radius);
  width: 360px;
  font-family: var(--font-tech);
}

.sf-card h3 {
  font-family: var(--font-primary);
  color: var(--sf-sienna);
  margin-bottom: var(--space-2);
}

.sf-card a {
  color: var(--sf-teal-thread);
  font-family: var(--font-tech);
  font-weight: 500;
}
```

---

# **4. Dataset Table (70s Technical Style)**

```html
<table class="sf-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Updated</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>/flow/default</td>
      <td>Dataset</td>
      <td>2025-12-10</td>
      <td class="ok">Valid</td>
    </tr>
    <tr>
      <td>/nodes/knot-23</td>
      <td>Node</td>
      <td>2025-11-19</td>
      <td class="warn">Changed</td>
    </tr>
  </tbody>
</table>
```

```css
.sf-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-tech);
  background: white;
}

.sf-table thead {
  background: var(--sf-oat);
}

.sf-table th,
.sf-table td {
  border: 1px solid var(--sf-oat);
  padding: var(--space-2);
}

.sf-table .ok {
  color: var(--sf-success-green);
  font-weight: 600;
}

.sf-table .warn {
  color: var(--sf-red-clay);
  font-weight: 600;
}
```

---

# ------------------------------------------------------------

# **HOMEPAGE HERO SECTION**

### *Built around your monogram, with the aesthetic fully expressed.*

Below is a real HTML/CSS hero section suitable for a website.

---

# **5. Homepage Hero (Live Markup)**

```html
<section class="sf-hero">
  <div class="sf-hero-content">
    <img src="sf-monogram.png" class="sf-hero-logo" />

    <h1>Semantic Flow</h1>
    <p>The woven semantic workspace for ontologies, datasets, and knowledge systems.  
       Build meshes of meaning — versioned, connected, and beautifully structured.</p>

    <div class="sf-hero-actions">
      <button class="sf-btn-primary">Start Weaving</button>
      <button class="sf-btn-secondary">Documentation</button>
    </div>
  </div>
</section>
```

```css
.sf-hero {
  background: var(--sf-cream-paper);
  padding: 80px 0;
  border-bottom: 2px solid var(--sf-oat);
}

.sf-hero-content {
  width: 80%;
  max-width: 960px;
  margin: 0 auto;
  text-align: left;
}

.sf-hero-logo {
  width: 140px;
  margin-bottom: var(--space-3);
}

.sf-hero h1 {
  font-family: var(--font-primary);
  font-size: 3rem;
  color: var(--sf-sienna);
  margin-bottom: var(--space-2);
  letter-spacing: -0.5px;
}

.sf-hero p {
  font-family: var(--font-tech);
  font-size: 1.25rem;
  color: var(--sf-ink);
  max-width: 600px;
  line-height: 1.55;
  margin-bottom: var(--space-4);
}

.sf-hero-actions {
  display: flex;
  gap: var(--space-3);
}
```

---

# ------------------------------------------------------------

# **BONUS: Hero Visual Alternative**

If you want a stronger weaving metaphor, here is a variant:

### **“Ribbon Sweep” Hero**

* Large horizontal ribbon (Sienna) behind the monogram
* Subtle overlapping Oat ribbon behind text
* Anchored to 70s graphic posters

I can generate SVG ribbons that follow the monogram curves if you want.

---

# ------------------------------------------------------------

# **Next Steps Available**

I can now produce any of the following:

### **1. Full Figma Component Library**

* Buttons, cards, nav, tables, code blocks
* Autolayout, constraints, style tokens
* Ready for handoff

### **2. Documentation Site Template**

Styled like a vintage technical manual with modern layout.

### **3. SVG hero illustrations**

* woven threads
* semantic nodes
* flow networks
* grid-based diagrams with retro aesthetics

### **4. A complete landing page**

Fully wired-up HTML/CSS, including sections like:

* Features
* How it Works
* Example Mesh
* Testimonials
* Footer

---

