# ECOTERRA 🌱
> **"The future isn't inherited. It's designed."**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-supercodersteracode.vercel.app-brightgreen?style=for-the-badge&logo=vercel)](https://supercodersteracode.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.4.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 🏆 Competition Context

**ECOTERRA** was engineered for **TERRACODE 2026**, an online web development competition organized by the **FOSS Club** under the **Department of Computer Science & Engineering, MEA Engineering College, Perinthalmanna**.

* **Official Theme:** *GREEN TOMORROW — Building a Sustainable Future*
* **Submission Date:** November 2026
* **Team:** SuperCoders
* **Production Deployment:** [https://supercodersteracode.vercel.app](https://supercodersteracode.vercel.app/)
* **GitHub Repository:** [https://github.com/yedindev16-a11y/supercoders_teracode](https://github.com/yedindev16-a11y/supercoders_teracode)

---

## 🌍 Executive Summary

Rapid urbanization is placing an unprecedented burden on our planet. Cities consume over **75% of global natural resources** and generate **70% of global greenhouse gas emissions**. 

**ECOTERRA** transforms passive environmental reading into an interactive, visual digital laboratory. By modeling urban ecosystems across five interconnected vectors, users can simulate municipal interventions, examine immediate environmental indicators, and discover practical personal and civic actions to accelerate the transition to a regenerative future.

### The User Journey
$$\text{DISCOVER} \longrightarrow \text{EXPLORE} \longrightarrow \text{DESIGN} \longrightarrow \text{COMPARE} \longrightarrow \text{TAKE ACTION}$$

---

## ✨ Core Feature Modules

### 1. ⚡ Cinematic Hero (`Hero.tsx`)
* Atmospheric multi-layered radial lighting and subtle technical grid aesthetics.
* Responsive headline typography (`font-mono`) with electric lime accents (`#D4FF00`).
* Real-time platform metric counters (Simulated Systems, Reactive Engine, Indicators, SDG Alignment).
* Smooth directional anchor navigation.

### 2. 🏛️ The Urban Challenge (`Challenge.tsx`)
* Evidence-based environmental storytelling addressing the global metropolitan climate footprint.
* Animated statistics counters with documented, verified citations:
  * **75%** natural resources consumed by cities *(UN Environment Programme)*
  * **70%** global CO₂ emissions from urban areas *(UN-Habitat)*
  * **68%** world population projected in cities by 2050 *(United Nations DESA)*
  * **40%** energy-related CO₂ from buildings *(International Energy Agency)*
* Dynamic split-screen SVG city skyline contrasting **"Today"** (smog, factories, congestion) vs. **"Tomorrow"** (rooftop gardens, micro-turbines, solar, and bike corridors).

### 3. 🏙️ Future City Lab Simulator (`CityLab.tsx`)
The centerpiece simulation engine providing 2.5D/isometric visual reactivity:
* **5 Interactive Sustainability Controls:**
  1. **Renewable Energy (0–100%):** Deploys rooftop solar panels, wind turbine arrays, and clean power grids.
  2. **Urban Green Coverage (0–100%):** Expands vertical gardens, city parks, canopy cover, and bio-corridors.
  3. **Sustainable Transport (0–100%):** Transforms roads into active cycling lanes and electrified transit networks.
  4. **Waste Recovery (0–100%):** Integrates circular sorting nodes and composting hubs.
  5. **Water Conservation (0–100%):** Deploys rainwater catchment, retention ponds, and bioswales.
* **Instant Preset Scenarios:**
  * *Today's Average City* (Baseline status-quo)
  * *Progressive City* (Active sustainable investment)
  * *Ecotopia 2050* (Maximized circularity and regenerative systems)
  * *Minimal Effort* (Low regulation / fossil dependent)
* **Real-time Baseline vs. Custom Comparison Mode:**
  * Side-by-side delta visualization tracking exact improvements and percentage gains.
* **6 Derived Environmental Indicators:**
  * CO₂ Reduction Percentage, Air Quality Index (AQI), Biodiversity Score, Livability Score, Resource Efficiency, and Climate Shock Resilience.
* **SVG Circular Sustainability Gauge:** Real-time 0–100 index calculation with color transitions.

### 4. 🔬 Impact Observatory (`ImpactObservatory.tsx`)
* **Pentagonal Systems Radar Matrix:** Pure SVG spider/radar chart displaying multivariate balance across energy, green space, transport, circularity, and hydrology. Includes live slider overrides.
* **Synthesized Metric Indicators:** Horizontal gradient-animated progress bars representing planetary boundaries.
* **2026–2050 Strategic Transition Roadmap:** Milestone cards connecting localized microgrids to net-zero equilibrium targets.

### 5. 🌿 Green Discovery Solutions (`GreenDiscovery.tsx`)
* Modern bento-grid layout showcasing 6 foundational pillars:
  * Clean Energy, Water Conservation, Sustainable Transport, Circular Economy, Biodiversity Corridors, and Green Infrastructure.
* Bespoke geometric SVG iconography and adaptive hover state glows.

### 6. ✅ Take Action Interactive Checklist (`TakeAction.tsx`)
* Contrast editorial layout (`#F5F5F0`) highlighting actionable human agency.
* 12 practical actions segmented into **At Home**, **In Transit**, and **In Community**.
* Real-time progress bar computing the user's **Personal Action Index**.
* Zero-hydration mismatch state management powered by React 19's `useSyncExternalStore` and `localStorage` persistence (`ecoterra-actions`).

### 7. 🌌 Closing Experience & Global Footer (`Footer.tsx`)
* Inspirational Native American proverb framing intergenerational ecological stewardship.
* Direct action return anchor to the City Lab.
* Official accreditation to TERRACODE 2026, MEA Engineering College CSE Department, and FOSS Club.

---

## 🧮 Simulation Methodology & Math

All simulation data is illustrative and calculated locally on the client using documented non-linear modeling curves to represent realistic diminishing returns and compounding ecological investments:

$$\text{Category Score} = \frac{x^{1.1}}{100^{0.1}}$$

$$\text{Sustainability Index} = \sum (\text{Category Score}_i \times w_i)$$

Where weights ($w_i$) reflect major urban sustainability indices:
* **Renewable Energy:** $0.25$
* **Urban Green Space:** $0.20$
* **Sustainable Transport:** $0.20$
* **Water Conservation:** $0.20$
* **Waste Recovery:** $0.15$

> *Disclaimer: All simulation metrics are illustrative models designed for educational analysis and do not represent measured real-time scientific telemetry.*

---

## 🎨 Visual Identity & Design System

The visual language balances cinematic depth with technical precision:

| Token | Hex Code | Usage |
| :--- | :--- | :--- |
| **Deep Forest** | `#0A1F0A` | Primary canvas background |
| **Dark Green** | `#0D1B0D` | Surface cards, modals, and container panels |
| **Emerald Primary** | `#059669` | Positive indicators, action items, foliage nodes |
| **Emerald Light** | `#10B981` | Gradients, progress gauges, and active states |
| **Electric Lime** | `#D4FF00` | High-impact callouts, brand accents, and active pills |
| **Lime Secondary** | `#84CC16` | Secondary telemetry and badges |
| **Off-White** | `#F5F5F0` | Primary typography and editorial light sections |

* **Typography:** `Geist Sans` for legible data and editorial reading; `Geist Mono` for indices, badges, and simulation metrics.
* **Accessibility:** Built with native keyboard navigation, semantic HTML5 landmarks, responsive viewports, and full `prefers-reduced-motion` compliance.

---

## 💻 Tech Stack & Architecture

* **Framework:** [Next.js 16.4.5](https://nextjs.org/) (App Router, Turbopack, React Server Components)
* **Library:** [React 19.3.0](https://react.dev/)
* **Language:** [TypeScript 5.9](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Animation:** [Motion](https://motion.dev/) (`motion/react`)
* **State Management:** React 19 `useSyncExternalStore` & `useMemo`
* **Icons & Visuals:** Inline procedural SVGs (Zero external icon bundle bloat)
* **Hosting:** [Vercel](https://vercel.com/) Edge Network

---

## 📂 Project Structure

```text
supercoders_teracode/
├── app/
│   ├── components/
│   │   ├── Challenge.tsx         # Environmental challenge & split skyline SVG
│   │   ├── CityLab.tsx           # 2.5D isometric simulator & indicator cards
│   │   ├── Footer.tsx            # Closing quote, attribution & footer
│   │   ├── GreenDiscovery.tsx    # 6-pillar bento grid solutions
│   │   ├── Hero.tsx              # Cinematic hero section with ambient glow
│   │   ├── ImpactObservatory.tsx # Pentagonal Radar chart & timeline
│   │   ├── Navigation.tsx        # Glassmorphic header & mobile navigation
│   │   └── TakeAction.tsx        # Action checklist with localStorage store
│   ├── lib/
│   │   └── simulation.ts         # Pure TypeScript mathematical simulation model
│   ├── favicon.ico
│   ├── globals.css               # Tailwind v4 configuration & keyframes
│   ├── layout.tsx                # Metadata & font configuration
│   └── page.tsx                  # Cohesive single-page application orchestrator
├── public/                       # Static SVGs & branding assets
├── .gitignore                    # Production git ignores
├── eslint.config.mjs             # ESLint configuration
├── next.config.ts                # Next.js & Turbopack root config
├── package.json                  # Dependencies & security overrides
├── tsconfig.json                 # TypeScript compiler configuration
└── README.md                     # Comprehensive project documentation
```

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v20.x or higher recommended)
* `npm`, `pnpm`, or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yedindev16-a11y/supercoders_teracode.git
   cd supercoders_teracode
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to view the live interface.

### Quality & Build Verification

* **Run ESLint checks:**
  ```bash
  npm run lint
  ```
* **Execute Production Build:**
  ```bash
  npm run build
  ```
* **Verify Security Audit:**
  ```bash
  npm audit
  ```
  *(Audited with 0 vulnerabilities via scoped dependency overrides).*

---

## 🔭 Future Scope

* **Real-time OpenData Ingestion:** Ingest open weather and air quality telemetry (e.g., OpenAQ API) from real metropolitan areas to benchmark simulated scores.
* **WebGL / Three.js 3D Twin:** Expand the 2.5D SVG visualization into a full 3D interactive digital twin allowing building-by-building environmental inspection.
* **Community Climate Impact Leagues:** Enable school and municipal teams to create shared scenario blueprints and vote on regional sustainability proposals.
* **Exportable PDF Municipal Reports:** Generate downloadable policy summary sheets directly from custom simulation runs.

---

## 👥 Authors & Acknowledgments

* **Project:** ECOTERRA
* **Development Team:** **SuperCoders**
* **Event:** **TERRACODE 2026**
* **Host:** **FOSS Club, Department of Computer Science & Engineering, MEA Engineering College**

*Designed and engineered with passion for a greener, more resilient tomorrow.*
