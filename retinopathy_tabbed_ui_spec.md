# Retinopathy Detection: Tabbed UI with LLM Integration
## Design Specification & Implementation Plan

**Version**: 1.0  
**Date**: June 2026  
**Status**: Design Phase  
**Scope**: Classification + Interpretation & Education Tabs with RAG LLM Integration

---

## Table of Contents

1. [Design Philosophy & Anti-Slop Guidelines](#design-philosophy--anti-slop-guidelines)
2. [UI Concept: Tabbed Interface](#ui-concept-tabbed-interface)
3. [Design System Specifications](#design-system-specifications)
4. [Component Architecture](#component-architecture)
5. [LLM Integration Architecture](#llm-integration-architecture)
6. [Implementation Plan](#implementation-plan)
7. [Code Examples](#code-examples)
8. [Testing & Validation](#testing--validation)

---

## Design Philosophy & Anti-Slop Guidelines

### What This Is NOT

This design intentionally avoids common AI-generated aesthetic mistakes:

❌ **NO gradient fills** on buttons, headers, or cards  
❌ **NO drop shadows or glows** except functional focus indicators  
❌ **NO rounded corner abuse** (corner radius only where necessary)  
❌ **NO color stickers or badges everywhere** (semantic use only)  
❌ **NO animation bloat** (only purpose-driven transitions)  
❌ **NO thin hairline borders** that disappear in light/dark mode  
❌ **NO hardcoded hex colors** (always use design tokens)  
❌ **NO inconsistent spacing** (strict rhythm: 4px, 8px, 12px, 16px, 24px)  
❌ **NO icon overload** (icons only when they reduce cognitive load)  
❌ **NO overlapping text and backgrounds** (always sufficient contrast)  

### Core Principles

**1. Intentionality**  
Every visual element must serve a function. If you can't explain why a color, border, or spacing exists in one sentence, remove it.

**2. Hierarchy Through Restraint**  
Don't emphasize everything—emphasize nothing. Use ONE primary action color, white space, and weight hierarchy (400 regular / 500 bold only).

**3. Consistency Over Novelty**  
Match your existing medical software standards. Clinicians recognize tabs, modals, and data tables. Don't reinvent them.

**4. Dark Mode First**  
Design for both modes simultaneously. If a color works only in light mode, it's not ready.

**5. Accessibility as Default**  
Minimum WCAG AA contrast (4.5:1 for text, 3:1 for UI components). Test with real users who have color blindness or low vision.

---

## UI Concept: Tabbed Interface

### Overview

Two-tab system that preserves fast clinical workflow while adding contextual LLM interpretation:

```
┌─────────────────────────────────────────────────────────────┐
│  RETINA CARE                                                 │
├──────────────────────────────┬──────────────────────────────┤
│ 📊 Hasil Klasifikasi         │ 📘 Interpretasi & Edukasi   │
├──────────────────────────────┴──────────────────────────────┤
│                                                              │
│  ⚠️ RISIKO SEDANG                                            │
│                                                              │
│  CONFIDENCE SCORE                                            │
│  Akurasi Model:  [████████░] 87%                            │
│                                                              │
│  KONDISI TERDETEKSI                                          │
│  • Microaneurysm              92% confidence               │
│  • Hard Exudate               78% confidence               │
│  • Cotton Wool Spot           65% confidence               │
│                                                              │
│  REKOMENDASI TINDAK LANJUT                                  │
│  Rujuk ke spesialis retina untuk evaluasi lebih lanjut...  │
│                                                              │
│  [Download Laporan] [Print] [Lihat Interpretasi →]         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Why Tabbed?

- **Sequential mental model**: Classification first, then interpretation
- **Respects cognitive load**: User controls pace of information
- **Mobile-friendly**: No layout issues at any viewport size
- **Scalable**: Easy to add future tabs (timeline, comparison, archives)
- **Reduces API overhead**: Interpretation loaded on-demand, not every analysis
- **Preserves speed perception**: Classification results show instantly

---

## Design System Specifications

### Typography

**Font Family**: `var(--font-sans)` (Anthropic Sans or system sans-serif)

| Element | Size | Weight | Line Height | Use Case |
|---------|------|--------|-------------|----------|
| H1 | 22px | 500 | 1.2 | Page title |
| H2 | 18px | 500 | 1.3 | Section header |
| H3 | 16px | 500 | 1.4 | Subsection |
| Body | 13px | 400 | 1.6 | Classification details, interpretation text |
| Label | 11px | 500 | 1.4 | Field labels, section titles (uppercase) |
| Small | 11px | 400 | 1.5 | Helper text, secondary info |

**CRITICAL**: Only TWO weights: `400 (regular)` and `500 (bold)`. Never use 600, 700, or weights below 400. Medium (500) is BOLD in this system.

**Text Rendering**: Anti-aliased (`-webkit-font-smoothing: antialiased`)

---

### Color System

**Note**: Use CSS variables for ALL colors. Never hardcode hex values in component code.

#### Semantic Colors (Light Mode Reference)

```css
/* Text */
--color-text-primary:     #1A1A18       /* Black, 95% opacity in dark mode */
--color-text-secondary:   #686866       /* Mid gray, 70% in dark mode */
--color-text-tertiary:    #B0AEA8       /* Light gray, 50% in dark mode */

/* Backgrounds */
--color-background-primary:   #FFFFFF   /* White, #1A1A18 dark mode */
--color-background-secondary: #F5F5F3   /* Light gray, #2A2A28 dark mode */
--color-background-tertiary:  #E8E8E6   /* Lighter gray, #3A3A38 dark mode */

/* Semantic */
--color-background-success:   #EAF3DE   /* Green 50 */
--color-text-success:         #3B6D11   /* Green 800 */

--color-background-warning:   #FAEEDA   /* Amber 50 */
--color-text-warning:         #854F0B   /* Amber 800 */

--color-background-danger:    #FCEBEB   /* Red 50 */
--color-text-danger:          #A32D2D   /* Red 800 */

--color-background-info:      #E6F1FB   /* Blue 50 */
--color-text-info:            #185FA5   /* Blue 800 */

/* Borders */
--color-border-tertiary:  rgba(0, 0, 0, 0.08)  /* Subtle, always visible */
--color-border-secondary: rgba(0, 0, 0, 0.15)  /* Hover state */
--color-border-primary:   rgba(0, 0, 0, 0.25)  /* Strong, accents */
```

#### Button Border Colors (NO GRADIENTS, NO SHADOWS)

```css
/* Default/Secondary Button */
border: 0.5px solid var(--color-border-secondary);
background: transparent;
color: var(--color-text-primary);

/* Hover State (only change: slightly darker background) */
border: 0.5px solid var(--color-border-secondary);
background: var(--color-background-secondary);
color: var(--color-text-primary);

/* Active State (pressed) */
border: 0.5px solid var(--color-border-secondary);
background: var(--color-background-secondary);
transform: scale(0.98);  /* ONLY animation: tiny scale */
```

```css
/* Primary Button (Info/Action) */
border: 0.5px solid var(--color-border-info);
background: var(--color-background-info);
color: var(--color-text-info);

/* Hover State */
border: 0.5px solid var(--color-border-info);
background: var(--color-background-info);
opacity: 0.85;  /* ONLY change: slightly transparent */
```

**CRITICAL RULES FOR BUTTONS:**
- Border: ALWAYS `0.5px` (never `1px`, never `2px` for primary)
- NO box-shadow, NO gradients, NO multiple borders
- Hover: change background OR opacity, not border color
- Active: only `scale(0.98)` for tactile feedback
- Padding: `10px 16px` (min-height 36px for accessibility)
- Border radius: `6px` (NOT rounded pill unless intentional)

---

### Spacing System

**Base Unit**: 4px (strictly enforced)

```
4px   = 0.25rem   (Icon spacing, tight gaps)
8px   = 0.5rem    (Small gaps, icon margins)
12px  = 0.75rem   (Component internal spacing)
16px  = 1rem      (Padding, section spacing)
24px  = 1.5rem    (Large gaps, section dividers)
32px  = 2rem      (Page-level spacing)
```

**Margin/Padding Rule**: Never use values outside this scale. No `11px`, `13px`, `15px`, etc.

---

### Border Radius

```
0px        (none)
4px        (small elements: inputs, badges)
6px        (buttons, small cards)
8px        (standard, var(--border-radius-md))
12px       (cards, panels, var(--border-radius-lg))
16px       (large cards, var(--border-radius-xl))
```

**CRITICAL**: No `border-radius` on single-sided borders (e.g., `border-left` only). Only use radius when border surrounds all 4 sides.

---

### Contrast & Accessibility

**Minimum WCAG AA** (even in dark mode):
- Text on background: `4.5:1` contrast ratio
- UI components: `3:1` contrast ratio
- Icons: `3:1` if they convey information

**Dark Mode Flip Rule**:  
If a color doesn't read clearly in dark mode, add transparency instead of adding a new color.

Example:
```css
/* WRONG: Different gray for each mode */
light mode: color: #686866;
dark mode:  color: #999999;  /* NEW color, breaks consistency */

/* RIGHT: Same token, automatic flip */
color: var(--color-text-secondary);  /* Handles both automatically */
```

---

## Component Architecture

### 1. Tab Container (Parent)

```html
<div class="tabs-wrapper">
  <div class="tabs-header">
    <button class="tab-btn active" data-tab="classification">
      <i class="ti ti-chart-bar"></i> Hasil Klasifikasi
    </button>
    <button class="tab-btn" data-tab="interpretation">
      <i class="ti ti-book"></i> Interpretasi & Edukasi
    </button>
  </div>
  <div class="tabs-body">
    <div id="tab-classification" class="tab-panel active">...</div>
    <div id="tab-interpretation" class="tab-panel">...</div>
  </div>
</div>
```

### 2. Tab Button Component

**CSS Specification**:

```css
.tabs-header {
  display: flex;
  border-bottom: 0.5px solid var(--color-border-tertiary);
  background: var(--color-background-secondary);
  height: 56px;  /* Accessible touch target */
  align-items: center;
}

.tab-btn {
  flex: 1;
  padding: 0 16px;
  height: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  border-bottom: 2px solid transparent;
  margin-bottom: -0.5px;  /* Overlap with parent border */
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tab-btn:hover:not(.active) {
  color: var(--color-text-primary);
  background: rgba(0, 0, 0, 0.02);  /* Minimal hover hint */
}

.tab-btn.active {
  color: var(--color-text-info);
  border-bottom-color: var(--color-text-info);
  background: transparent;  /* NO background change when active */
}

.tab-btn i {
  font-size: 16px;
}
```

**Rules**:
- Tab height: minimum 44px (accessibility)
- Active indicator: ONLY bottom border, NO background color
- Border: `2px` (thicker than default borders to indicate state)
- Transition: ONLY on `color`, not on border or background
- Icon: 16px, inherited color from parent

### 3. Tab Panel Component

```css
.tabs-body {
  position: relative;
  min-height: 400px;  /* Prevent layout shift */
}

.tab-panel {
  display: none;
  padding: 24px;
  animation: fadeIn 0.2s ease-in;
}

.tab-panel.active {
  display: block;
}

@keyframes fadeIn {
  from { opacity: 0.9; }
  to { opacity: 1; }
}
```

**Rules**:
- Animation: ONLY opacity fade, 0.2s max
- Padding: 24px (1.5rem, consistent with design system)
- Min-height: Prevents content jump on tab switch

---

### 4. Risk Badge Component

```css
.risk-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 4px;  /* Slightly rounded, NOT pill */
  font-weight: 500;
  font-size: 13px;
  margin-bottom: 24px;
  border: 0.5px solid;
  width: fit-content;
}

.risk-badge.high {
  background: var(--color-background-danger);
  color: var(--color-text-danger);
  border-color: rgba(163, 45, 45, 0.3);  /* Transparent red border */
}

.risk-badge.medium {
  background: var(--color-background-warning);
  color: var(--color-text-warning);
  border-color: rgba(133, 79, 11, 0.3);
}

.risk-badge.low {
  background: var(--color-background-success);
  color: var(--color-text-success);
  border-color: rgba(59, 109, 17, 0.3);
}
```

**Rules**:
- NO emoji/icons inside badge (emoji rendering inconsistent)
- Border: subtle matching color, 0.5px, with transparency
- Padding: 8px vertical, 16px horizontal
- Radius: 4px (small), NOT 20px (pill is overused in AI apps)
- Text only: "RISK HIGH", "RISK MEDIUM", "RISK LOW"

---

### 5. Result Section Component

```css
.result-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 0.5px solid var(--color-border-tertiary);
}

.result-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  margin-bottom: 12px;
  letter-spacing: 0.3px;  /* Subtle letter spacing for labels */
}
```

**Rules**:
- Section spacing: 24px (consistent with base spacing)
- Divider: subtle `0.5px` border only between sections
- Title: 11px, 500 weight (bold in this system), UPPERCASE
- No icons in section titles (text only)

---

### 6. Confidence Bar Component

```css
.confidence-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.confidence-bar-label {
  font-size: 13px;
  color: var(--color-text-primary);
  min-width: 100px;
  white-space: nowrap;
}

.bar-container {
  flex: 1;
  height: 6px;
  background: var(--color-background-secondary);
  border-radius: 3px;
  overflow: hidden;
  border: 0.5px solid var(--color-border-tertiary);
}

.bar-fill {
  height: 100%;
  background: var(--color-background-info);
  border-radius: 3px;
}

.confidence-value {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-info);
  min-width: 40px;
  text-align: right;
}
```

**CRITICAL Rules**:
- Bar height: 6px (thin, readable)
- Fill: SOLID color ONLY (NO gradient)
- Border: 0.5px around container (subtle definition)
- Radius: 3px (pill shape appropriate for bars)
- Value text: info color, right-aligned, monospace-friendly width

---

### 7. Classification Grid (Classes Detected)

```css
.classes-grid {
  display: grid;
  gap: 8px;
}

.class-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--color-background-secondary);
  border-radius: 6px;
  border: 0.5px solid var(--color-border-tertiary);
  font-size: 13px;
}

.class-item:hover {
  border-color: var(--color-border-secondary);
  background: var(--color-background-tertiary);
}

.class-name {
  color: var(--color-text-primary);
  font-weight: 500;
}

.class-score {
  color: var(--color-text-secondary);
  font-size: 12px;
}
```

**Rules**:
- Grid gap: 8px (tight, professional)
- Item padding: 12px vertical, 16px horizontal
- Border: 0.5px, subtle (only visible on hover in some modes)
- Hover: change border and background, NEVER shadow
- Text: primary bold for class name, secondary for confidence

---

### 8. Interpretation Section Component

```css
.interpretation-section {
  margin-bottom: 24px;
  padding: 16px;
  background: var(--color-background-secondary);
  border-radius: 8px;
  border-left: 3px solid var(--color-border-info);
  border: 0.5px solid var(--color-border-tertiary);
  border-left: 3px solid var(--color-border-info);
}

.interpretation-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.interpretation-icon {
  font-size: 16px;
  color: var(--color-text-primary);
}

.interpretation-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.interpretation-text {
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin: 0;
}

.interpretation-text strong {
  color: var(--color-text-primary);
  font-weight: 500;
}
```

**Rules**:
- Background: secondary (slightly raised)
- Border: normal 0.5px + left accent 3px (two-border approach)
- Icon: 16px, only semantic icons (book, stethoscope, etc.)
- Text: secondary color for body, primary for emphasis
- Bold: 500 weight only, for clinical terms

---

### 9. Button Group Component

```css
.button-group {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
  align-items: flex-start;
}

.btn {
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  border: 0.5px solid var(--color-border-secondary);
  background: transparent;
  cursor: pointer;
  transition: all 0.15s ease;
  color: var(--color-text-primary);
  white-space: nowrap;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn:hover {
  background: var(--color-background-secondary);
  border-color: var(--color-border-secondary);
}

.btn:active {
  transform: scale(0.98);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--color-background-info);
  color: var(--color-text-info);
  border-color: var(--color-border-info);
}

.btn-primary:hover {
  opacity: 0.85;
  background: var(--color-background-info);
}
```

**CRITICAL Button Rules**:
- Border: 0.5px only, never 1px
- Padding: 10px vertical, 16px horizontal (36px min-height)
- Radius: 6px (NOT 8px, NOT 20px)
- Hover: background change OR opacity, not border color
- Active: ONLY `scale(0.98)` transform
- NO shadows, NO gradients, NO multiple borders
- Text color must contrast 4.5:1 with background
- Icon: 16px max, right-align with gap

---

### 10. Loading State Component

```css
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  color: var(--color-text-secondary);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 2px solid var(--color-border-tertiary);
  border-top-color: var(--color-text-info);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 13px;
  text-align: center;
  color: var(--color-text-secondary);
  max-width: 240px;
  line-height: 1.6;
}
```

**Rules**:
- Spinner: 32px, 2px border
- Animation: linear, 0.8s (not too fast, not annoying)
- Min-height: 240px (gives LLM 1-2 seconds to respond without collapse)
- Text below spinner: centered, secondary color

---

## LLM Integration Architecture

### Data Flow Diagram

```
┌─────────────┐
│ User Upload │
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│ Image Classification │ (< 3 seconds, your current model)
└──────┬───────────────┘
       │
       ├─────────────────────────┐
       │                         │
       ▼                         ▼
┌──────────────┐         ┌──────────────────┐
│ Show Results │         │ Preload LLM Req  │ (background)
│ Tab 1        │         │ (deferred)       │
└──────────────┘         └──────────────────┘
       │                         │
       └────────────┬────────────┘
                    │
              (User clicks Tab 2)
                    │
                    ▼
        ┌───────────────────────┐
        │ Show Loading State    │
        │ (spinner + text)      │
        └───────────┬───────────┘
                    │
                    ▼ (await LLM promise)
        ┌───────────────────────┐
        │ Parse LLM Response    │
        │ (JSON structure)      │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │ Render Interpretation │
        │ Tab Content           │
        └───────────────────────┘
```

### LLM Prompt Engineering (RAG Context)

**System Message** (Clinician-focused):

```
You are a retinal disease specialist providing clinical interpretation 
of diabetic retinopathy screening results from an AI classifier.

Your role is to:
1. Contextualize the AI findings within standard clinical frameworks
2. Identify patterns that suggest disease progression
3. Generate actionable next-step recommendations
4. Assess urgency (routine follow-up vs. urgent referral)

Output structured interpretation that separates:
- Clinical assessment (for ophthalmologist review)
- Risk stratification (for clinical decision-making)
- Patient-friendly explanation (for patient communication)

DISCLAIMER: This is AI-assisted interpretation, not a definitive diagnosis. 
Clinical judgment and in-person examination are required.
```

**User Message Template**:

```json
{
  "classification": {
    "riskLevel": "medium",
    "riskScore": 0.67,
    "confidence": 0.87,
    "detectedLesions": [
      {"type": "Microaneurysm", "confidence": 0.92, "count": 3},
      {"type": "Hard Exudate", "confidence": 0.78, "count": 2},
      {"type": "Cotton Wool Spot", "confidence": 0.65, "count": 1}
    ],
    "classificationDetails": {
      "DR_Stage": "NPDR_Mild",
      "DR_Score": 20,
      "DME_Risk": "Low"
    }
  },
  "imageMetadata": {
    "imagingType": "Fundus Photo",
    "quality": "Good",
    "laterality": "OD",
    "timestamp": "2026-06-23T14:32:00Z"
  },
  "patientContext": {
    "age": 45,
    "diabetesType": "Type 2",
    "yearsWithDiabetes": 8,
    "lastHbA1c": 8.2,
    "lastHbA1cDate": "2026-05-15",
    "knownComorbidities": ["Hypertension"],
    "previousDRStaging": "No prior DR"
  }
}
```

**Expected Output Format** (JSON):

```json
{
  "clinicalInterpretation": {
    "title": "Mild Nonproliferative Diabetic Retinopathy (NPDR)",
    "summary": "Fundoscopic examination reveals early-stage diabetic retinopathy with microaneurysms and hard exudates, consistent with NPDR mild stage.",
    "findingsDetail": [
      "Microaneurysms: 3 lesions in posterior pole, typical of DR pathophysiology",
      "Hard exudates: 2 lipid deposits suggesting vascular permeability",
      "Cotton wool spots: 1 nerve fiber layer hemorrhage, nonspecific but supportive"
    ],
    "stagingRationale": "Presence of intraretinal hemorrhages/microaneurysms without venous beading or extensive retinal hemorrhages places this in NPDR mild category"
  },
  
  "riskAssessment": {
    "currentRiskLevel": "moderate",
    "progressionRisk6mo": "20-30%",
    "progressionRisk1yr": "30-40%",
    "riskFactors": [
      "Elevated HbA1c (8.2%) indicates suboptimal glycemic control",
      "Hypertension comorbidity accelerates DR progression",
      "No documented prior DR screening, disease may progress undetected"
    ],
    "protectiveFactors": [
      "NPDR mild stage (reversible with intervention)",
      "No evidence of DME (macular edema not present)"
    ]
  },
  
  "recommendations": {
    "referralUrgency": "Routine (2-4 weeks)",
    "nextStepsForClinician": [
      "Comprehensive eye examination by ophthalmologist/optometrist",
      "OCT imaging to rule out subclinical DME",
      "Document baseline for monitoring progression",
      "Communicate results to primary care/endocrinology team"
    ],
    "patientActions": [
      "Optimize glycemic control (target HbA1c < 7%)",
      "Monitor and control blood pressure (target < 130/80)",
      "Schedule comprehensive eye exam within 2-4 weeks",
      "Follow recommended frequency: annual screening minimum"
    ]
  },
  
  "patientEducation": {
    "simpleSummary": "Your eye exam shows early signs of diabetes affecting small blood vessels in the back of your eye. This is common in people with diabetes but can be managed well with good blood sugar control.",
    
    "whatItMeans": "Diabetic retinopathy happens when high blood sugar damages tiny blood vessels in the retina (the light-sensitive tissue at the back of your eye). Right now, you have early-stage damage that can often be reversed or stopped with proper care.",
    
    "whatYouCanDo": [
      "Keep your blood sugar levels in target range (ask your doctor what your target is)",
      "Check your blood pressure regularly—high blood pressure speeds up eye damage",
      "Take all diabetes medications as prescribed",
      "Eat a balanced diet and exercise regularly",
      "Don't smoke (smoking worsens diabetic complications)"
    ],
    
    "whenToSeeDoctor": "Schedule an appointment with an eye doctor within 2-4 weeks. Go sooner if you notice sudden changes in vision, new floaters, or blurry vision.",
    
    "importantNote": "Early detection and treatment can prevent vision loss. Many people with diabetic retinopathy don't notice symptoms early, which is why regular screening is important."
  },
  
  "confidenceMetrics": {
    "interpretationConfidence": 0.92,
    "stagingConfidence": 0.88,
    "riskAssessmentConfidence": 0.85,
    "qualityFlags": ["Good image quality enables confident interpretation"],
    "limitationFlags": [
      "Single timepoint—cannot assess progression rate without prior imaging",
      "Patient HbA1c from prior month—current glycemic control unknown"
    ]
  }
}
```

**Rendering Rules**:
- Clinical interpretation → clinical user
- Risk assessment → clinical decision-making
- Patient education → patient communication OR printed materials
- Confidence metrics → transparency on AI uncertainty

---

## Implementation Plan

### Phase 1: Foundation (Weeks 1-2)

**Goal**: Stable tabbed interface with placeholder content

**Tasks**:

- [ ] Create `TabsComponent.tsx` with all CSS specifications
  - Tab header with navigation
  - Tab panels with proper show/hide logic
  - Semantic HTML (`<button>`, `<div role="tablist">`)
  
- [ ] Refactor classification results into Tab 1
  - Move existing components into `.tab-panel#classification`
  - Maintain current functionality, no logic changes
  - Test all existing workflows still work
  
- [ ] Create Tab 2 placeholder structure
  - Section components (interpretation, implications, education, next steps)
  - Loading state component
  - Button group with stub actions
  
- [ ] Design system tokens implementation
  - CSS variables file or Tailwind config
  - Document in shared variables file
  - Test light/dark mode switching

**Acceptance Criteria**:
- Tabs switch on click
- Content properly hidden/shown
- No layout shift on tab switch
- Mobile responsive (test at 375px, 768px, 1024px)
- Color contrast meets WCAG AA
- Keyboard navigation (Tab key, Enter to activate)

**Timeline**: 5 business days

---

### Phase 2: LLM Integration (Weeks 3-4)

**Goal**: End-to-end LLM interpretation flow

**Tasks**:

- [ ] Implement API layer for LLM calls
  ```typescript
  // services/llmInterpreter.ts
  async function interpretationResults(
    classificationResult: ClassificationOutput,
    patientContext?: PatientMetadata
  ): Promise<InterpretationResponse> {
    // Build prompt from template
    // Call LLM API (Claude / GPT-4)
    // Parse and validate JSON response
    // Return structured interpretation
  }
  ```
  
- [ ] Implement deferred loading strategy
  - Classification tab: immediate render (< 3s)
  - On mount: trigger LLM request in background
  - On Tab 2 click: check if LLM promise resolved
    - If yes: render content
    - If no: show loading state + spinner
  
- [ ] Create interpretation rendering components
  - `ClinicalInterpretation.tsx`
  - `RiskAssessment.tsx`
  - `PatientEducation.tsx`
  - `NextSteps.tsx`
  
- [ ] Error handling & fallbacks
  - LLM API timeout? → show retry button + cached response
  - Invalid JSON response? → log error, show generic message
  - Network error? → offline mode with last cached result
  
- [ ] Loading state animations
  - Spinner component
  - Estimated load time messaging
  - Skeleton screens (optional, for perceived performance)

**Code Structure**:

```
/components
  /Tabs
    - TabsComponent.tsx
    - TabHeader.tsx
    - TabPanel.tsx
  /Classification
    - ClassificationTab.tsx
    - RiskBadge.tsx
    - ConfidenceBar.tsx
    - ClassesGrid.tsx
  /Interpretation
    - InterpretationTab.tsx
    - ClinicalSection.tsx
    - RiskSection.tsx
    - PatientEducationSection.tsx
    - NextStepsSection.tsx
    - LoadingState.tsx

/services
  - llmInterpreter.ts
  - apiClient.ts
  
/types
  - classification.ts
  - interpretation.ts
  - llm.ts

/styles
  - design-tokens.css
  - components.css
```

**Acceptance Criteria**:
- LLM API integration complete
- Interpretation renders on Tab 2
- Loading state appears during wait
- Error handling tested (timeout, invalid response)
- Performance: LLM response < 3-5 seconds typical
- No API key exposed in client code

**Timeline**: 8 business days

---

### Phase 3: Content & Education (Week 5)

**Goal**: Polished patient education, clinician-ready messaging

**Tasks**:

- [ ] Refine LLM prompt templates with clinical feedback
  - Review with ophthalmologist / optometrist
  - Validate terminology and accuracy
  - Test with real classification results
  
- [ ] Create patient education templates
  - Indonesian language support (your current app)
  - Plain-language explanations for each DR stage
  - Visual aids (optional: add SVG diagrams?)
  
- [ ] Testing with clinical team
  - Screen shot patient education with sample patients
  - Validate recommendations match clinical guidelines
  - Gather feedback on terminology
  
- [ ] Internationalization (i18n) setup
  - Separate messaging from components
  - Support Indonesian + English
  - LLM can output in patient language

**Deliverables**:
- Patient education content document
- LLM prompt refinement document
- Glossary of terms (medical → patient-friendly)

**Timeline**: 5 business days

---

### Phase 4: Testing & Validation (Week 6)

**Goal**: Production-ready, clinically validated

**Tasks**:

- [ ] Accessibility testing (WCAG 2.1 AA)
  - Color contrast checker
  - Screen reader testing (NVDA, JAWS)
  - Keyboard navigation (Tab, Enter, Esc)
  - Test with people who have low vision
  
- [ ] Mobile testing
  - iPhone 12/13/14/15 sizes
  - Android (Samsung S21+)
  - Landscape/portrait orientation
  - Touch responsiveness
  
- [ ] Performance testing
  - LLM latency (track 50th, 95th percentiles)
  - API cost per analysis
  - Cache hit rates
  
- [ ] Clinical user testing (real workflow)
  - 3-5 clinicians test with actual patient images
  - Time analysis (classification → interpretation → decision)
  - Collect feedback on UX vs. current workflow
  - Validate interpretation accuracy
  
- [ ] Security & privacy audit
  - No patient PII in logs
  - API request/response doesn't store images
  - Compliance check (HIPAA / local regulations)

**Acceptance Criteria**:
- WCAG AA pass rate: 100%
- Keyboard navigation: fully functional
- Mobile layout: no scrolling issues, proper sizing
- LLM latency p95: < 5 seconds
- Clinical team approval: "ready for pilots"
- Privacy audit: cleared

**Timeline**: 1 week

---

### Phase 5: Deployment & Monitoring (Week 7+)

**Goal**: Live in production, monitored for quality

**Tasks**:

- [ ] Staging environment deployment
  - Test with real LLM API (not mock)
  - Full E2E testing
  
- [ ] Production deployment
  - Gradual rollout (10% → 25% → 50% → 100%)
  - Feature flag for old vs. new UI
  - Monitoring dashboards
  
- [ ] Analytics & monitoring
  - Track Tab 2 click-through rate
  - Monitor LLM API errors
  - Log user feedback (in-app survey)
  - Track time spent on interpretation vs. classification
  
- [ ] Feedback loop
  - Weekly review of usage patterns
  - Collect clinician feedback
  - Bug fixes & prompt refinements

**Monitoring Metrics**:
```
- Tab 2 engagement rate (% of users who click)
- LLM response time (p50, p95, p99)
- API error rate (% failed requests)
- Interpretation accuracy (manual spot-check)
- Patient feedback sentiment (if survey enabled)
```

---

## Code Examples

### Example 1: Tabs Component (React/TypeScript)

```typescript
import React, { useState } from 'react';
import './TabsComponent.css';

interface Tab {
  id: string;
  label: string;
  icon: string;
  content: React.ReactNode;
}

interface TabsComponentProps {
  tabs: Tab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
}

export const TabsComponent: React.FC<TabsComponentProps> = ({
  tabs,
  defaultTab = tabs[0]?.id,
  onTabChange
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className="tabs-wrapper">
      {/* Tab Header */}
      <div className="tab-header" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => handleTabClick(tab.id)}
            type="button"
          >
            <i className={`ti ${tab.icon}`} aria-hidden="true"></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Body */}
      <div className="tabs-body">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`tabpanel-${tab.id}`}
            className={`tab-panel ${activeTab === tab.id ? 'active' : ''}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Example 2: Risk Badge Component

```typescript
import React from 'react';
import './RiskBadge.css';

type RiskLevel = 'low' | 'medium' | 'high';

const riskLabels: Record<RiskLevel, string> = {
  low: 'RISK LOW',
  medium: 'RISK MEDIUM',
  high: 'RISK HIGH'
};

interface RiskBadgeProps {
  level: RiskLevel;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level }) => {
  return (
    <div className={`risk-badge ${level}`}>
      {riskLabels[level]}
    </div>
  );
};
```

**CSS** (no hardcoded colors):

```css
.risk-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 13px;
  border: 0.5px solid;
  width: fit-content;
}

.risk-badge.high {
  background: var(--color-background-danger);
  color: var(--color-text-danger);
  border-color: rgba(163, 45, 45, 0.3);
}

.risk-badge.medium {
  background: var(--color-background-warning);
  color: var(--color-text-warning);
  border-color: rgba(133, 79, 11, 0.3);
}

.risk-badge.low {
  background: var(--color-background-success);
  color: var(--color-text-success);
  border-color: rgba(59, 109, 17, 0.3);
}
```

### Example 3: LLM Integration Service

```typescript
// services/llmInterpreter.ts

import { Anthropic } from '@anthropic-ai/sdk';

interface ClassificationResult {
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  confidence: number;
  detectedLesions: Array<{
    type: string;
    confidence: number;
    count: number;
  }>;
}

interface InterpretationResponse {
  clinicalInterpretation: {
    title: string;
    summary: string;
    findingsDetail: string[];
  };
  riskAssessment: {
    currentRiskLevel: string;
    progressionRisk6mo: string;
    riskFactors: string[];
  };
  recommendations: {
    referralUrgency: string;
    nextStepsForClinician: string[];
    patientActions: string[];
  };
  patientEducation: {
    simpleSummary: string;
    whatItMeans: string;
    whatYouCanDo: string[];
  };
}

const client = new Anthropic();

export async function interpretRetinalResults(
  classificationResult: ClassificationResult,
  patientContext?: {
    age?: number;
    diabetesType?: string;
    yearsWithDiabetes?: number;
    lastHbA1c?: number;
  }
): Promise<InterpretationResponse> {
  const systemPrompt = `You are a retinal disease specialist providing clinical interpretation 
of diabetic retinopathy screening results from an AI classifier.

Your role is to:
1. Contextualize the AI findings within standard clinical frameworks
2. Identify patterns that suggest disease progression
3. Generate actionable next-step recommendations
4. Assess urgency (routine follow-up vs. urgent referral)

Output ONLY valid JSON in this exact structure:
{
  "clinicalInterpretation": {
    "title": "string",
    "summary": "string",
    "findingsDetail": ["string", "string"]
  },
  "riskAssessment": {
    "currentRiskLevel": "string",
    "progressionRisk6mo": "string",
    "riskFactors": ["string"]
  },
  "recommendations": {
    "referralUrgency": "string",
    "nextStepsForClinician": ["string"],
    "patientActions": ["string"]
  },
  "patientEducation": {
    "simpleSummary": "string",
    "whatItMeans": "string",
    "whatYouCanDo": ["string"]
  }
}

Do NOT include markdown, explanations, or preamble. Output ONLY the JSON object.`;

  const userMessage = `Interpret these retinal screening results:
${JSON.stringify(classificationResult, null, 2)}

Patient context:
${JSON.stringify(patientContext || {}, null, 2)}

Provide structured clinical interpretation following the JSON schema.`;

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ],
      system: systemPrompt
    });

    // Extract text content
    const textContent = response.content.find(block => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from LLM');
    }

    // Parse JSON response
    const interpretation: InterpretationResponse = JSON.parse(textContent.text);
    return interpretation;
  } catch (error) {
    console.error('LLM interpretation error:', error);
    throw new Error(`Failed to interpret results: ${error instanceof Error ? error.message : String(error)}`);
  }
}
```

### Example 4: Deferred Loading Pattern

```typescript
// hooks/useLLMInterpretation.ts

import { useEffect, useState } from 'react';
import { interpretRetinalResults } from '@/services/llmInterpreter';
import type { ClassificationResult, InterpretationResponse } from '@/types';

export function useLLMInterpretation(classificationResult: ClassificationResult) {
  const [interpretation, setInterpretation] = useState<InterpretationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Automatically fetch interpretation in background
  useEffect(() => {
    const fetchInterpretation = async () => {
      try {
        const result = await interpretRetinalResults(classificationResult);
        setInterpretation(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Failed to fetch interpretation:', err);
      }
    };

    // Don't block UI, fetch in background
    fetchInterpretation();
  }, [classificationResult]);

  // Optional: Manual refetch
  const refetch = async () => {
    setIsLoading(true);
    try {
      const result = await interpretRetinalResults(classificationResult);
      setInterpretation(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return { interpretation, isLoading, error, refetch };
}
```

### Example 5: Interpretation Tab Component

```typescript
// components/Interpretation/InterpretationTab.tsx

import React from 'react';
import { useLLMInterpretation } from '@/hooks/useLLMInterpretation';
import { LoadingState } from './LoadingState';
import { ClinicalSection } from './ClinicalSection';
import { RiskSection } from './RiskSection';
import { PatientEducationSection } from './PatientEducationSection';
import { NextStepsSection } from './NextStepsSection';
import type { ClassificationResult } from '@/types';
import './InterpretationTab.css';

interface InterpretationTabProps {
  classificationResult: ClassificationResult;
}

export const InterpretationTab: React.FC<InterpretationTabProps> = ({
  classificationResult
}) => {
  const { interpretation, error } = useLLMInterpretation(classificationResult);

  if (error) {
    return (
      <div className="interpretation-error">
        <p>Tidak bisa memuat interpretasi AI.</p>
        <p className="error-detail">{error}</p>
        <button className="btn">Coba Lagi</button>
      </div>
    );
  }

  if (!interpretation) {
    return <LoadingState />;
  }

  return (
    <div className="interpretation-tab">
      <ClinicalSection data={interpretation.clinicalInterpretation} />
      <RiskSection data={interpretation.riskAssessment} />
      <PatientEducationSection data={interpretation.patientEducation} />
      <NextStepsSection data={interpretation.recommendations} />

      <div className="button-group">
        <button className="btn">💬 Tanya Lebih Lanjut</button>
        <button className="btn">📋 Print Edukasi Pasien</button>
        <button className="btn btn-primary">Lihat Resources →</button>
      </div>
    </div>
  );
};
```

---

## Testing & Validation

### Unit Tests (Vitest / Jest)

```typescript
// components/Tabs/__tests__/TabsComponent.test.ts

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TabsComponent } from '../TabsComponent';

describe('TabsComponent', () => {
  const mockTabs = [
    { id: 'tab-1', label: 'Tab 1', icon: 'ti-chart-bar', content: <div>Content 1</div> },
    { id: 'tab-2', label: 'Tab 2', icon: 'ti-book', content: <div>Content 2</div> }
  ];

  it('renders all tabs', () => {
    render(<TabsComponent tabs={mockTabs} />);
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
  });

  it('shows first tab by default', () => {
    render(<TabsComponent tabs={mockTabs} />);
    expect(screen.getByText('Content 1')).toBeVisible();
    expect(screen.getByText('Content 2')).not.toBeVisible();
  });

  it('switches tabs on click', async () => {
    const user = userEvent.setup();
    render(<TabsComponent tabs={mockTabs} />);

    const tab2Button = screen.getByRole('tab', { name: /Tab 2/i });
    await user.click(tab2Button);

    expect(screen.getByText('Content 2')).toBeVisible();
    expect(screen.getByText('Content 1')).not.toBeVisible();
  });

  it('keyboard navigation works', async () => {
    const user = userEvent.setup();
    render(<TabsComponent tabs={mockTabs} />);

    const tab1Button = screen.getByRole('tab', { name: /Tab 1/i });
    tab1Button.focus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: /Tab 2/i })).toHaveFocus();
  });
});
```

### E2E Tests (Cypress)

```typescript
// cypress/e2e/interpretation.cy.ts

describe('Classification to Interpretation Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('shows classification immediately, interpretation deferred', () => {
    // Upload image
    cy.get('input[type="file"]').selectFile('cypress/fixtures/retina_sample.jpg');
    cy.contains('Mulai Analisis').click();

    // Classification should appear instantly
    cy.get('[role="tab"]').contains('Hasil Klasifikasi').should('be.visible');
    cy.contains('RISK MEDIUM').should('be.visible');

    // Interpretation tab should be available but content not loaded yet
    cy.get('[role="tab"]').contains('Interpretasi & Edukasi').should('exist');
  });

  it('loads interpretation on tab click', () => {
    // ... setup classification first ...

    cy.get('[role="tab"]').contains('Interpretasi & Edukasi').click();

    // Should show loading state briefly
    cy.contains('Menganalisis...').should('be.visible');

    // Should render interpretation within 5 seconds
    cy.contains('Interpretasi Klinis', { timeout: 5000 }).should('be.visible');
    cy.contains('Penjelasan untuk Pasien').should('be.visible');
  });

  it('handles LLM API errors gracefully', () => {
    cy.intercept('POST', '/api/llm/interpret', { statusCode: 500 }).as('llmError');

    // ... trigger interpretation loading ...

    cy.get('[role="tab"]').contains('Interpretasi & Edukasi').click();
    cy.wait('@llmError');

    // Should show error message
    cy.contains('Tidak bisa memuat interpretasi').should('be.visible');
    cy.contains('Coba Lagi').should('be.visible');
  });
});
```

### Accessibility Testing Checklist

- [ ] **Color Contrast**
  - Text on background: 4.5:1 minimum
  - UI components: 3:1 minimum
  - Test with WCAG Contrast Checker

- [ ] **Keyboard Navigation**
  - Tab through all interactive elements
  - Tab order is logical (left-to-right, top-to-bottom)
  - All buttons/tabs are keyboard accessible
  - Focus indicator visible and clear

- [ ] **Screen Reader (NVDA, JAWS, VoiceOver)**
  - All buttons have accessible names
  - Tab roles and states announced
  - Content sections have semantic headings
  - Form fields have associated labels

- [ ] **Mobile Accessibility**
  - Touch targets minimum 44px x 44px
  - No horizontal scrolling
  - Zoom works at 200%

### Performance Testing

```bash
# Lighthouse CI
npm run lighthouse

# Expected scores:
# Performance: > 85
# Accessibility: > 95
# Best Practices: > 90
# SEO: > 90
```

---

## Checklist for Implementation

### Design Foundation
- [ ] Design tokens defined (colors, spacing, typography)
- [ ] CSS variables file created and tested in light/dark mode
- [ ] Component library created with all specifications
- [ ] Design review completed with stakeholders

### Development
- [ ] Tabs component implemented
- [ ] Classification tab refactored from existing code
- [ ] LLM integration service created
- [ ] Deferred loading pattern implemented
- [ ] Error handling and fallbacks working
- [ ] Loading states working
- [ ] Interpretation rendering components built

### Testing
- [ ] Unit tests passing (> 80% coverage)
- [ ] E2E tests passing
- [ ] Accessibility audit passing (WCAG 2.1 AA)
- [ ] Mobile testing complete (3+ device sizes)
- [ ] Light/dark mode testing complete
- [ ] LLM API timeout handling tested

### Clinical Validation
- [ ] Prompt templates reviewed by clinician
- [ ] Patient education messaging reviewed
- [ ] Sample interpretations validated for accuracy
- [ ] Terminology approved by medical team
- [ ] Privacy/security audit cleared
- [ ] User testing with 3-5 clinicians completed

### Production Readiness
- [ ] Documentation completed
- [ ] Deployment plan finalized
- [ ] Monitoring dashboards set up
- [ ] Rollback plan documented
- [ ] Stakeholder approval obtained

---

## Anti-Slop Checklist (Design Quality Assurance)

Before every component ships:

- [ ] **No gradients** anywhere (check CSS for `linear-gradient`, `radial-gradient`)
- [ ] **No drop shadows** except on focus rings (`box-shadow: 0 0 0 2px`)
- [ ] **No animated icons** (Tabler icons should be static)
- [ ] **No emoji in functional UI** (emoji only in educational content)
- [ ] **No hardcoded colors** in component CSS (always `var(--color-*)`)
- [ ] **Consistent border widths** (0.5px standard, 2px only for active states)
- [ ] **Rounded corners only where justified** (pills, buttons, cards—not everything)
- [ ] **Text always has 4.5:1 contrast** with background (test in both light/dark)
- [ ] **Spacing follows 4px grid** (no `11px`, `13px`, `15px` values)
- [ ] **Font weights only 400 and 500** (no 600, 700, 300)
- [ ] **Button borders clear** and visible in both modes (use alpha transparency)
- [ ] **Loading states have spinners, not pulsing badges**
- [ ] **Focus indicators visible** (at least 2px, high contrast)
- [ ] **No decorative icons** without `aria-hidden="true"`
- [ ] **No "sticker" aesthetic** (badges, tags, pills used judiciously for semantic meaning)

---

## References & Resources

### Medical Standards
- [ETDRS Classification for Diabetic Retinopathy](https://www.aao.org/)
- [American Academy of Ophthalmology: DR Screening Guidelines](https://www.aao.org/)

### Design & Accessibility
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Accessible Tabs Pattern (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)

### Implementation
- [Claude API Documentation](https://docs.anthropic.com/)
- [React Accessibility](https://react.dev/reference/react-dom/components)
- [Tabler Icons Documentation](https://tabler-icons.io/)

---

## Questions & Support

For questions about this specification:
1. Review the relevant section above
2. Check the code examples
3. Consult the component CSS specifications
4. Refer to the anti-slop checklist for quality gates

**Document Ownership**: Architecture Team  
**Last Updated**: June 2026  
**Next Review**: After Phase 1 Implementation (Week 2)
