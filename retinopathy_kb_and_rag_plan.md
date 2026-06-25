# Retinopathy Disease Knowledge Base
## For RAG-Augmented LLM Interpretation System

**Version**: 1.0  
**Date**: June 2026  
**Format**: JSON-structured chunks with semantic metadata  
**Scope**: Diabetic Retinopathy (DR), Hypertensive Retinopathy, Retinopathy of Prematurity (ROP), management, patient education  

---

## Table of Contents

1. [Overview & Purpose](#overview--purpose)
2. [Knowledge Base Schema](#knowledge-base-schema)
3. [Chunking Strategy (For Speed)](#chunking-strategy-for-speed)
4. [Complete Disease Knowledge Base](#complete-disease-knowledge-base)
5. [Implementation Plan](#implementation-plan)
6. [Search & Retrieval Examples](#search--retrieval-examples)

---

## Overview & Purpose

This knowledge base serves as the **retrieval source** for the RAG system. When the LLM interprets a retinopathy classification, it retrieves relevant chunks from this KB to provide:

- Accurate, guideline-based clinical information
- Proper disease staging and progression context
- Management recommendations
- Patient education content
- References to clinical evidence

**Goal**: Replace hallucination-prone LLM generation with grounded, evidence-based interpretations.

---

## Knowledge Base Schema

### JSON Structure

Each chunk follows this structure:

```json
{
  "id": "COND_001",
  "category": "DR_stage",
  "title": "Nonproliferative Diabetic Retinopathy (NPDR) - Mild",
  "content": "Clinical description and diagnostic criteria...",
  "tokens": 320,
  "keywords": ["NPDR", "mild", "microaneurysm", "diabetic retinopathy"],
  "clinical_summary": true,
  "patient_friendly": false,
  "source": "AAO_guidelines_2023",
  "confidence": "high",
  "embedding": [0.234, -0.102, ...],
  "created_at": "2026-01-01",
  "valid_until": "2027-01-01",
  "language": "en"
}
```

### Field Descriptions

| Field | Type | Purpose |
|-------|------|---------|
| `id` | string | Unique identifier (COND_001, LESION_002, MGMT_003) |
| `category` | enum | Classification: `DR_stage`, `lesion`, `management`, `patient_ed`, `hypertensive_ret`, `ROP`, `mechanism` |
| `title` | string | Human-readable chunk title |
| `content` | string | Chunk body (300-400 tokens) |
| `tokens` | number | Exact token count (for context window management) |
| `keywords` | array | Search terms for BM25 retrieval |
| `clinical_summary` | boolean | Suitable for clinician context? |
| `patient_friendly` | boolean | Suitable for patient education? |
| `source` | string | Reference (AAO_guidelines, peer_reviewed_paper, case_study, patient_resource) |
| `confidence` | enum | `high` (well-established), `medium` (consensus), `low` (emerging) |
| `embedding` | array | Vector embedding (1536 dims for OpenAI/Claude) |
| `created_at` | ISO8601 | When chunk was added |
| `valid_until` | ISO8601 | Expiry date (invalidate outdated guidelines) |
| `language` | string | Language code (en, id) |

---

## Chunking Strategy (For Speed)

### Why Chunking Matters

- **Optimal size**: 300-500 tokens per chunk
  - Small enough for precise retrieval
  - Large enough to include full context
  - Fits in LLM context window (Claude: 200K tokens)

- **Speed impact**:
  - Embedding 300-token chunk: ~10ms
  - BM25 search: <5ms
  - Semantic search (vector DB): <50ms
  - Total retrieval: <100ms

### Chunking Rules

**1. By Clinical Entity**
- One disease stage = one chunk
- One lesion type = one chunk
- One management pathway = one chunk
- One patient education topic = one chunk

**2. Natural Boundaries**
- Break at section headers (H2, H3)
- Don't split mid-diagnosis criterion
- Don't split mid-patient explanation
- Favor left-aligned chunks (start of useful information)

**3. Overlap** (optional, for safety)
- 50-token overlap between adjacent chunks
- Helps with borderline relevance queries
- Small storage cost, big retrieval safety benefit

**4. Language**
- English chunks separate from Indonesian chunks
- No mixed-language chunks
- User's language preference selects subset

### Token Counting Tool

```python
import tiktoken

def count_tokens(text, model="gpt-3.5-turbo"):
    encoding = tiktoken.encoding_for_model(model)
    return len(encoding.encode(text))

# Target: 300-400 tokens
text = "..."
tokens = count_tokens(text)
print(f"Tokens: {tokens}")  # Adjust chunk until 300-400 range
```

---

## Complete Disease Knowledge Base

### SECTION 1: DIABETIC RETINOPATHY (DR)

#### CHUNK: DR_STAGE_001 - NPDR Mild (English)

```json
{
  "id": "DR_STAGE_001",
  "category": "DR_stage",
  "title": "Nonproliferative Diabetic Retinopathy (NPDR) - Mild",
  "content": "Nonproliferative diabetic retinopathy (NPDR) mild is the earliest clinically detectable stage of diabetic retinopathy. It is characterized by the presence of microaneurysms (MAs), which are small focal dilations of retinal capillaries. The presence of at least one microaneurysm with or without hard exudates, retinal hemorrhages, or venous beading defines NPDR mild.\n\nKey clinical features:\n- Microaneurysms (MAs) are the hallmark finding, representing areas of vascular weakness and preclinical leakage\n- Hard exudates may appear as lipid deposits, typically in a circinate pattern around areas of vascular leakage\n- Cotton wool spots (CWS) may be present, representing nerve fiber layer infarcts\n- Retinal hemorrhages are dot-blot or flame-shaped, located within or superficial to the retina\n\nDiagnostic criteria (ETDRS):\n- Microaneurysms and/or retinal hemorrhages only, without venous beading or intraretinal microvascular abnormalities (IRMA)\n- Severity code: 20 (mild NPDR)\n\nProgression risk:\n- Without intervention: 25-33% progress to more severe DR within 1 year\n- With good glycemic control (HbA1c <7%): risk reduced to <10%\n\nPathophysiology:\n- Hyperglycemia causes pericyte loss → capillary wall weakening → microaneurysm formation\n- Early blood-retinal barrier breakdown → retinal edema (often clinically silent initially)\n- Inflammation and oxidative stress accelerate endothelial dysfunction\n\nManagement principles covered in MGMT section. See also: LESION_001, LESION_002, LESION_003.",
  "tokens": 380,
  "keywords": ["NPDR", "nonproliferative", "mild", "microaneurysm", "diabetic retinopathy", "early DR"],
  "clinical_summary": true,
  "patient_friendly": false,
  "source": "AAO_guidelines_2023",
  "confidence": "high",
  "valid_until": "2027-01-01",
  "language": "en"
}
```

#### CHUNK: DR_STAGE_002 - NPDR Moderate

```json
{
  "id": "DR_STAGE_002",
  "category": "DR_stage",
  "title": "Nonproliferative Diabetic Retinopathy (NPDR) - Moderate",
  "content": "Nonproliferative diabetic retinopathy (NPDR) moderate represents disease progression with more extensive microvasculature changes and emerging signs of flow disturbances.\n\nDiagnostic criteria:\n- Retinal hemorrhages and microaneurysms more numerous than mild NPDR\n- Hard exudates more extensive\n- Cotton wool spots present\n- Venous beading may be absent (distinguishes from severe NPDR)\n- Intraretinal microvascular abnormalities (IRMA) may be present (early signs of nonperfusion)\n- Severity code: 35-43 (moderate NPDR per ETDRS)\n\nClinical findings:\n- Hemorrhages larger and more numerous, can be dot-blot or flame-shaped\n- Hard exudates clustered or circinate, indicating active vascular leakage\n- CWS multiple, indicating nerve fiber layer ischemia\n- IRMA: dilated, irregular capillaries in areas of nonperfusion (indicates progression)\n\nVascular pathology:\n- Progressive pericyte loss and endothelial cell apoptosis\n- Capillary nonperfusion creating hypoxic zones\n- Upregulation of vascular endothelial growth factor (VEGF) → stimulus for neovascularization\n- Blood-retinal barrier breakdown → increased vascular permeability\n\nDME risk:\n- Moderate NPDR carries 5-10% risk of clinically significant macular edema (CSME) at presentation\n- Risk increases to 15-25% over 3 years without intervention\n\nProgression to PDR:\n- ~15-33% progress to PDR within 1-2 years if untreated\n- Risk factors: poor glycemic control, hypertension, higher baseline severity\n\nManagement: Urgent referral for comprehensive eye exam. Consider anti-VEGF or steroid therapy if DME present. Tight glucose and blood pressure control essential.",
  "tokens": 340,
  "keywords": ["NPDR", "moderate", "venous beading", "IRMA", "retinal hemorrhage", "diabetic retinopathy"],
  "clinical_summary": true,
  "patient_friendly": false,
  "source": "AAO_guidelines_2023",
  "confidence": "high",
  "valid_until": "2027-01-01",
  "language": "en"
}
```

#### CHUNK: DR_STAGE_003 - NPDR Severe

```json
{
  "id": "DR_STAGE_003",
  "category": "DR_stage",
  "title": "Nonproliferative Diabetic Retinopathy (NPDR) - Severe",
  "content": "Nonproliferative diabetic retinopathy (NPDR) severe represents advanced ischemic retinopathy with extensive capillary nonperfusion and imminent risk of neovascularization.\n\nDiagnostic criteria (\"4-2-1 rule\"):\n- Hemorrhages and microaneurysms in all 4 quadrants of retina\n- Venous beading in 2+ quadrants (pathognomonic finding: venous dilation and segmentation)\n- Prominent intraretinal microvascular abnormalities (IRMA) in 1+ quadrant\n- ETDRS severity codes: 47-53 (severe NPDR)\n\nClinical presentation:\n- Extensive retinal hemorrhages and microaneurysms throughout periphery\n- Prominent cotton wool spots indicating extensive nerve fiber layer infarction\n- Hard exudates may form circinate patterns around macula (risk of vision loss)\n- Venous beading: most sensitive sign of extensive capillary nonperfusion\n- IRMA prominent: collateral vessels bypassing nonperfused zones\n- Macular edema often present (10-20% have clinically significant DME)\n\nIschemis pathology:\n- Extensive capillary occlusion (>30% of retinal vasculature nonperfused)\n- Severe upregulation of VEGF due to widespread hypoxia\n- Breakdown of inner blood-retinal barrier → increased retinal edema\n- Preparation for neovascular response\n\nProgression risk:\n- 45% progress to proliferative DR (PDR) within 1 year if untreated\n- 90% progress to PDR within 2 years\n- High risk of vision-threatening complications\n\nManagement:\n- Urgent referral to retinal specialist (same week if possible)\n- Anti-VEGF therapy strongly recommended (afl ibercept, ranibizumab, bevacizumab)\n- Laser photocoagulation (panretinal or scatter laser) if resources limited\n- Tight glycemic and BP control\n- Quarterly fundus exams\n- Monitor for development of PDR or DME\n\nPrognosis:\n- With prompt treatment: 50-70% do not progress to PDR\n- Without treatment: progression to PDR nearly certain within 2 years",
  "tokens": 360,
  "keywords": ["NPDR severe", "venous beading", "4-2-1 rule", "extensive nonperfusion", "IRMA", "high risk PDR"],
  "clinical_summary": true,
  "patient_friendly": false,
  "source": "AAO_guidelines_2023",
  "confidence": "high",
  "valid_until": "2027-01-01",
  "language": "en"
}
```

#### CHUNK: DR_STAGE_004 - PDR (Proliferative DR)

```json
{
  "id": "DR_STAGE_004",
  "category": "DR_stage",
  "title": "Proliferative Diabetic Retinopathy (PDR)",
  "content": "Proliferative diabetic retinopathy (PDR) is characterized by neovascularization of the disc (NVD) or neovascularization elsewhere (NVE) on the retina or optic disc. It represents the most severe form of nonproliferative DR and carries the highest risk of vision loss.\n\nDiagnostic criteria:\n- Neovascularization of disc (NVD): abnormal vessel proliferation at optic disc margin\n- Neovascularization elsewhere (NVE): abnormal vessels on retina away from disc\n- Vitreous hemorrhage (blood obscuring retinal view) due to new vessel bleeding\n- Tractional retinal detachment: scar tissue mechanically pulling retina\n- ETDRS severity codes: 61-71 (PDR)\n\nNeovascularization characteristics:\n- New vessels are thin, fragile, and bleed easily\n- Lack normal pericyte support → structurally weak\n- Often accompany glial proliferation (epiretinal membrane)\n- NVD carries higher risk of bleeding than NVE\n- Growth stimulated by widespread VEGF production\n\nClinical features:\n- Floaters (blood in vitreous), flashing lights (retinal traction)\n- Possible vision loss if NV bleeds or tractional detachment occurs\n- Rubeosis iridis (abnormal iris neovascularization) can develop → neovascular glaucoma\n- Combined DME + PDR significantly worsens prognosis\n\nPathophysiology:\n- Chronic hypoxia from capillary nonperfusion triggers maximal VEGF expression\n- VEGF promotes endothelial cell proliferation and migration onto internal limiting membrane\n- New vessels are immature → prone to bleeding\n- Glial proliferation (fibrosis) accompanies neovascularization\n- Vitreous scaffold allows vascular proliferation\n\nVision-threatening complications:\n1. Vitreous hemorrhage: blood in gel obscures vision (can be sudden, total vision loss)\n2. Tractional retinal detachment: scar tissue pulls retina off; permanent vision loss\n3. Neovascular glaucoma: if rubeosis develops → elevated IOP → optic nerve damage\n\nManagement (urgent):\n- Anti-VEGF therapy: first-line (aflibercept, ranibizumab preferred)\n- Panretinal photocoagulation (PRP): if anti-VEGF unavailable or contraindicated\n- Vitrectomy: if significant vitreous hemorrhage or tractional detachment\n- Monitor for glaucoma (IOP, optic nerve)\n- Tight glucose and BP control\n- Frequent follow-up (every 1-2 weeks initially)\n\nPrognosis:\n- With prompt anti-VEGF: 50-70% achieve regression of NV\n- Without treatment: high risk of catastrophic vision loss (blindness) within 1-2 years\n- Early treatment can prevent >90% of vision loss",
  "tokens": 400,
  "keywords": ["PDR", "proliferative", "neovascularization", "NVD", "NVE", "vitreous hemorrhage", "high risk"],
  "clinical_summary": true,
  "patient_friendly": false,
  "source": "AAO_guidelines_2023",
  "confidence": "high",
  "valid_until": "2027-01-01",
  "language": "en"
}
```

#### CHUNK: DR_LESION_001 - Microaneurysm

```json
{
  "id": "DR_LESION_001",
  "category": "lesion",
  "title": "Microaneurysm in Diabetic Retinopathy",
  "content": "Microaneurysms (MAs) are small, focal dilations of retinal capillaries, typically 15-60 micrometers in diameter. They are the earliest clinically detectable lesion of diabetic retinopathy and often the first sign of DR on screening fundus photography.\n\nHistopathology:\n- Result of pericyte (supporting cells) loss in retinal capillaries\n- Endothelial cells weaken without pericyte structural support\n- Capillary wall bulges outward → microaneurysm formation\n- Initially areas of microleakage (blood-retinal barrier breakdown)\n- Over time: microaneurysm may regress, perfuse, or close\n- Distinguish from dot-blot hemorrhages (microaneurysms are filled with RBCs)\n\nClinical appearance:\n- Red dots (if recently formed, filled with blood)\n- Dark spots (if thrombosed or regressed)\n- Size: typically <25 micrometers (barely visible without magnification)\n- Location: usually in inner nuclear layer (precapillary or capillary locations)\n- Distribution: commonly in posterior pole, especially around macula\n\nDifferential:\n- vs. Dot-blot hemorrhage: microaneurysm has thinner wall, may be traversed by capillary\n- vs. Hard exudate: yellow, lipid deposits; microaneurysm is vascular\n- vs. Retinal hemorrhage: microaneurysm is punctate, <25 um; hemorrhage larger\n\nSignificance:\n- Marker of pericyte loss and early blood-retinal barrier dysfunction\n- Indicates disease already present (even if patient asymptomatic)\n- Precedes clinically visible DR by months to years in histologic studies\n- Multiple MAs indicate diffuse capillary disease (not localized)\n\nProgression:\n- MAs can regress, especially with improved glycemic control\n- Indicates need for intensified glucose management\n- Suggests risk of concurrent DME (often asymptomatic at MA stage)\n\nManagement implications:\n- Presence mandates referral for comprehensive eye exam\n- Assess HbA1c and optimize glycemic control\n- Screen for diabetic macular edema (optical coherence tomography recommended)\n- Educate patient about DR risk and need for regular monitoring\n- More frequent follow-up (q3-6 months) recommended",
  "tokens": 350,
  "keywords": ["microaneurysm", "MA", "pericyte loss", "earliest lesion", "diabetic retinopathy", "lesion"],
  "clinical_summary": true,
  "patient_friendly": false,
  "source": "AAO_guidelines_2023",
  "confidence": "high",
  "valid_until": "2027-01-01",
  "language": "en"
}
```

#### CHUNK: DR_LESION_002 - Hard Exudate

```json
{
  "id": "DR_LESION_002",
  "category": "lesion",
  "title": "Hard Exudate in Diabetic Retinopathy",
  "content": "Hard exudates (HE) are lipid and protein deposits that accumulate in the retina secondary to vascular leakage from damaged capillaries. They are a key marker of retinal vascular leakage and indicate blood-retinal barrier dysfunction.\n\nComposition:\n- Lipoproteins, cholesterol, and plasma proteins that have leaked from capillaries\n- Accumulate in outer plexiform layer (synaptic zone between inner and outer retina)\n- Yellow-white appearance due to lipid content and light scattering\n\nClinical appearance:\n- Yellow-white spots, often with sharp margins\n- Vary in size from pinpoint to several disc diameters\n- Often arranged in circinate patterns (rings around areas of active leakage)\n- Classically appear around leaking microaneurysms or capillary dilation\n- May involve macula (threat to vision)\n\nPathophysiology:\n- Result of hyperpermeability of retinal vasculature\n- Chronically elevated intracapillary pressure pushes fluid outward\n- Damaged endothelium (from hyperglycemia, inflammation, oxidative stress)\n- VEGF and bradykinin increase vascular permeability\n- Fluid carries lipoproteins into retina → exudate formation\n\nPrognostic significance:\n- Indicates active microvascular disease and ongoing leakage\n- Risk factor for diabetic macular edema if close to fovea\n- Presence suggests duration of hyperglycemia and capillary injury\n- Can regress with improved glycemic control\n\nDifferential diagnosis:\n- vs. Macular scar: older exudates leave lipid trails as they absorb\n- vs. Drusen: hard exudates are less organized, often circinate\n- vs. Cotton wool spot: CWS is white, nerve fiber layer location\n\nClinical implications:\n- Markers of blood-retinal barrier breakdown\n- Assess with OCT if involving macula (measure retinal thickening)\n- Indicate need for glycemic optimization\n- Frequent follow-up (q3-6 months) recommended\n- If involving macula + thickening >300 μm: consider anti-VEGF/steroid therapy\n\nRegression:\n- Can resolve completely with good glycemic control\n- Exudates absorb and lipid is reabsorbed\n- May take 6-12 months for complete resolution",
  "tokens": 340,
  "keywords": ["hard exudate", "lipid deposit", "circinate", "macular edema", "leakage", "lesion"],
  "clinical_summary": true,
  "patient_friendly": false,
  "source": "AAO_guidelines_2023",
  "confidence": "high",
  "valid_until": "2027-01-01",
  "language": "en"
}
```

#### CHUNK: DR_LESION_003 - Cotton Wool Spot

```json
{
  "id": "DR_LESION_003",
  "category": "lesion",
  "title": "Cotton Wool Spot in Diabetic Retinopathy",
  "content": "Cotton wool spots (CWS) are white, fluffy retinal opacities located at the nerve fiber layer that represent areas of nerve fiber layer infarction (axonal disruption and cytoid body accumulation). They are a marker of localized retinal ischemia.\n\nHistopathology:\n- Result from capillary occlusion in nerve fiber layer territory\n- Blood flow interruption → axonal accumulation of organelles (cytoid bodies)\n- Interrupted anterograde axoplasmic flow\n- No actual necrosis (reversible if blood flow restored)\n- Microscopic accumulation of organelles appears white and fluffy clinically\n\nClinical appearance:\n- White, fluffy, feathery opacities\n- Poorly demarcated borders (blend into surrounding retina)\n- Location: nerve fiber layer (superficial, follow blood vessel arcades)\n- Size: small (as small as disc diameter) to large\n- Distribution: can be focal or multiple (diffuse disease)\n\nDuration:\n- Typically resolve within 6-12 weeks as axons are cleared\n- Leave no permanent scarring (unlike hemorrhages)\n- Can recur in same location (indicates chronic capillary occlusion)\n\nPathophysiology:\n- Capillary occlusion from endothelial disease or thrombosis\n- Retinal hypoxia triggers endothelial dysfunction\n- Widespread CWS indicate diffuse capillary disease\n\nClinical significance:\n- Marker of localized retinal ischemia\n- Indicates need for tight glycemic and BP control\n- Multiple CWS suggest more extensive microvascular disease\n- Not directly vision-threatening (nerve fiber layer location)\n- Can be associated with macular edema (OCT recommended if involving posterior pole)\n\nDifferential:\n- vs. Retinal hemorrhage: CWS is white, superficial; hemorrhage is red, deeper\n- vs. Hard exudate: CWS is fluffy/feathery, HE is sharply demarcated and yellow\n- vs. Optic nerve head drusen: drusen are at disc margin, smaller\n\nManagement:\n- No specific treatment (spontaneously resolves)\n- Optimize glycemic and BP control\n- Monitor for progression of DR\n- CWS regress faster with improved glucose control\n- Use as marker for intensifying diabetes management",
  "tokens": 330,
  "keywords": ["cotton wool spot", "CWS", "nerve fiber layer", "ischemia", "infarction", "lesion"],
  "clinical_summary": true,
  "patient_friendly": false,
  "source": "AAO_guidelines_2023",
  "confidence": "high",
  "valid_until": "2027-01-01",
  "language": "en"
}
```

#### CHUNK: DR_DME_001 - Diabetic Macular Edema

```json
{
  "id": "DR_DME_001",
  "category": "lesion",
  "title": "Diabetic Macular Edema (DME)",
  "content": "Diabetic macular edema (DME) is retinal thickening in the macula caused by accumulation of intraretinal and subretinal fluid secondary to breakdown of the blood-retinal barrier. It is the leading cause of vision loss in working-age adults with diabetes.\n\nPathophysiology:\n- Increased vascular permeability from VEGF, bradykinin, and other inflammatory cytokines\n- Capillary occlusion and ischemia trigger VEGF release\n- Loss of tight junction proteins (occludin, claudins) in endothelium\n- Fluid accumulates in outer plexiform layer (primarily) and other retinal layers\n- Intracellular edema: cell swelling from osmotic imbalance (Na+/K+-ATPase dysfunction)\n- Extracellular edema: interstitial fluid accumulation\n\nClinical presentation:\n- Often asymptomatic initially (center-sparing macular edema)\n- Blurred vision, metamorphopsia (distorted vision) if fovea involved\n- Difficulty reading fine print\n- Color vision loss\n- Visual acuity may range from normal to severe loss\n\nDiagnostic criteria:\n- Retinal thickening: OCT thickness >300 μm at foveal center\n- Clinically significant DME (CSME): older definition, now superseded by OCT\n- Microthickening: 250-300 μm (borderline, monitor closely)\n- Features: cystoid spaces, disruption of ellipsoid zone\n\nOCT findings:\n- Retinal thickness map: diffuse or focal thickening\n- Cross-sectional: cystoid spaces (dark, fluid-filled holes)\n- Subretinal fluid: darker space beneath retina\n- Hyperreflective foci: lipid deposits\n- Disruption of external limiting membrane (bad prognostic sign)\n\nStaging severity:\n- Mild: 300-400 μm, no foveal involvement\n- Moderate: 400-600 μm, foveal involvement possible\n- Severe: >600 μm, significant foveal distortion\n\nManagement (urgent if center-involved):\n- Anti-VEGF therapy (aflibercept, ranibizumab, bevacizumab): first-line\n- Intravitreal steroid (triamcinolone, dexamethasone implant): if anti-VEGF inadequate\n- Laser photocoagulation: less effective than anti-VEGF, but option if unavailable\n- Intensive glycemic and BP control\n- Frequent monitoring (monthly initially) with OCT\n- Treatment goals: reduce thickness <250 μm, improve VA\n\nProgression timeline:\n- DME can develop at any DR stage\n- Can progress from mild to severe over weeks-months\n- With treatment: 60-80% improve; 20-40% maintain or worsen\n\nRisk factors for poor prognosis:\n- Severe disruption of ellipsoid zone\n- Subretinal fluid\n- Lipid deposits (hard exudates) involving fovea\n- Chronic duration (>6 months)\n- Ischemic maculopathy (capillary nonperfusion)",
  "tokens": 390,
  "keywords": ["DME", "macular edema", "vision loss", "OCT", "anti-VEGF", "treatment", "lesion"],
  "clinical_summary": true,
  "patient_friendly": false,
  "source": "AAO_guidelines_2023",
  "confidence": "high",
  "valid_until": "2027-01-01",
  "language": "en"
}
```

---

### SECTION 2: MANAGEMENT & FOLLOW-UP

#### CHUNK: MGMT_001 - Glycemic Control & DR Prevention

```json
{
  "id": "MGMT_001",
  "category": "management",
  "title": "Glycemic Control and DR Prevention",
  "content": "Tight glycemic control is the cornerstone of diabetic retinopathy prevention and progression slowing. The relationship between hyperglycemia and DR is strong and well-established.\n\nEvidence basis:\n- Diabetes Control and Complications Trial (DCCT): 3-year intensive glycemic control reduced DR incidence by 76% in type 1 diabetes\n- UK Prospective Diabetes Study (UKPDS): 10-year follow-up showed 21% reduction in retinopathy with each 1% reduction in HbA1c\n- Each 1% higher HbA1c associated with ~18% increased DR risk\n\nTarget HbA1c for DR prevention:\n- General target: <7% (53 mmol/mol) for most patients\n- Intensified target: <6.5% (48 mmol/mol) for patients with early DR (can slow/reverse early lesions)\n- Consideration: Hypoglycemia risk in elderly or patients with renal disease\n\nGlycemic control intensity and DR regression:\n- Mild NPDR: 50-70% regress to normal retinal findings with HbA1c <7% for 1-2 years\n- Hard exudates: improve with sustained good control\n- Microaneurysms: can regress rapidly with intensive control\n- PDR: already advanced, cannot regress with glucose control alone (requires anti-VEGF/PRP)\n\nParadox: Rapid glycemic improvement (early worsening)\n- Temporary transient worsening of DR can occur in first 2-6 months of intensive control initiation\n- Mechanism: rapid reduction in sorbitol and other osmolytes causes fluid shifts\n- Usually self-limited and does not affect long-term outcomes\n- Counsel patients about this possibility\n\nImplementation strategies:\n- Basal-bolus insulin or insulin pump for type 1 diabetes\n- GLP-1 agonists (weight loss benefit, cardiovascular benefit) preferred for type 2\n- SGLT2 inhibitors (renal protection): secondary benefit\n- Target fasting glucose: 100-150 mg/dL; 2-hour postprandial: <180 mg/dL\n- Continuous glucose monitoring (CGM) helps identify patterns\n- Endocrinology consultation recommended for patients with difficult-to-control diabetes\n\nDR screening intervals based on glycemic control:\n- HbA1c <7%, no DR: annual screening\n- HbA1c 7-9%: every 6-9 months\n- HbA1c >9%: every 3-6 months\n\nCounseling points:\n- Emphasize that good glucose control can PREVENT DR entirely in newly diagnosed diabetes\n- Emphasize that even early DR can regress with intensive control\n- Involve diabetes educator, dietitian, social worker for multidisciplinary support",
  "tokens": 370,
  "keywords": ["glycemic control", "HbA1c", "prevention", "management", "DCCT", "UKPDS"],
  "clinical_summary": true,
  "patient_friendly": false,
  "source": "AAO_guidelines_2023",
  "confidence": "high",
  "valid_until": "2027-01-01",
  "language": "en"
}
```

#### CHUNK: MGMT_002 - Blood Pressure Management

```json
{
  "id": "MGMT_002",
  "category": "management",
  "title": "Blood Pressure Control in Diabetic Retinopathy",
  "content": "Hypertension accelerates diabetic retinopathy progression and increases risk of vision-threatening complications. Blood pressure management is essential for DR prevention and slowing progression.\n\nEpidemiology:\n- Hypertension present in 80% of type 2 diabetics, 50% of type 1 diabetics\n- Hypertension doubles risk of DR development\n- Hypertension increases DR progression risk 3-fold\n- Hypertension + poor glycemic control = synergistic risk\n\nMechanism:\n- Elevated intraglomerular and intracapillary pressure\n- Capillary endothelial dysfunction and blood-retinal barrier breakdown\n- Increased VEGF production\n- Acceleration of pericyte loss and capillary occlusion\n\nBlood pressure targets for DR patients:\n- General diabetic population: <130/80 mmHg (American Diabetes Association)\n- With DR: <130/80 mmHg (tight control recommended)\n- With nephropathy: <120/80 mmHg (systolic target very strict)\n- Caution: avoid excessive lowering that may cause symptomatic hypotension\n\nAnti-hypertensive drugs and DR:\n- ACE inhibitors and ARBs: first-line (renal protection, VEGF modulation)\n- Beta-blockers: useful if coexistent coronary disease\n- Thiazide diuretics: acceptable, but may worsen glucose control\n- Calcium channel blockers: useful for resistant hypertension\n- Avoid: NSAIDs (worsen diabetic nephropathy and retinopathy)\n\nEVIDENCE:\n- Hypertension Optimal Treatment (HOT) trial: showed benefit of tight BP control\n- Systolic BP <120 mmHg associated with slowest DR progression\n- Each 10 mmHg reduction in SBP associated with ~25% slower DR progression\n\nManagement strategy:\n- Home BP monitoring (helps identify white coat hypertension)\n- Lifestyle: sodium restriction, weight loss, exercise, stress reduction\n- Medication optimization: uptitrate to target, assess adherence\n- Annual retinal screening even if BP well-controlled\n\nCounseling:\n- Emphasize that BP control works synergistically with glucose control\n- Lifestyle changes (weight loss, sodium restriction) benefit both glucose and BP\n- Medication compliance is essential for long-term retinal health",
  "tokens": 330,
  "keywords": ["blood pressure", "hypertension", "management", "ACE inhibitor", "ARB", "BP target"],
  "clinical_summary": true,
  "patient_friendly": false,
  "source": "AAO_guidelines_2023",
  "confidence": "high",
  "valid_until": "2027-01-01",
  "language": "en"
}
```

#### CHUNK: MGMT_003 - Anti-VEGF Therapy

```json
{
  "id": "MGMT_003",
  "category": "management",
  "title": "Anti-Vascular Endothelial Growth Factor (Anti-VEGF) Therapy",
  "content": "Anti-VEGF agents are the most effective treatment for diabetic retinopathy complications, particularly for DME and PDR. They work by blocking VEGF signaling, reducing neovascularization and vascular permeability.\n\nMechanism of action:\n- VEGF promotes vascular permeability (DME), neovascularization (PDR), and inflammation\n- Anti-VEGF agents bind VEGF-A and prevent interaction with VEGFR1/VEGFR2\n- Results: reduced vascular leakage, regression of new vessels, reduced inflammation\n- Onset: 2-4 weeks for maximum effect; peak effect at 8-12 weeks\n\nAvailable agents:\n- Aflibercept (Eylea): 2 mg/0.05mL, most potent, binds VEGF-A/PlGF\n- Ranibizumab (Lucentis): 0.5 mg/0.05mL, humanized antibody fragment\n- Bevacizumab (Avastin): 1.25 mg/0.05mL, off-label, cost-effective (cheaper)\n- Pegaptanib (Macugen): older, less commonly used\n\nIndications:\n- DME (center-involved): first-line treatment\n- PDR with NVD/NVE: especially if vision-threatening or with vitreous hemorrhage\n- NPDR severe (off-label, emerging evidence)\n- Combination with laser or steroid may improve outcomes\n\nDosing regimen:\n- Loading phase: 3 monthly injections (or biweekly for aflibercept)\n- Maintenance phase: variable frequency based on response (4-12 week intervals)\n- Pro-re-nata (PRN): inject only if OCT evidence of activity\n- Treat-and-extend: gradually extend intervals as long as stable\n\nEfficacy:\n- DME: 65-80% improve VA by ≥3 lines of vision\n- Macular thickness reduction: average 100-200 μm\n- PDR: 50-70% achieve regression of neovascularization\n- Combination anti-VEGF + PRP superior to PRP alone\n\nMonitoring:\n- Baseline: IOP, OCT, VA\n- Monthly: VA, OCT, IOP during loading phase\n- Every 4-12 weeks: ongoing monitoring during maintenance\n- Stop criteria: if stable VA, normal OCT, no DME for 2+ visits\n\nSide effects:\n- Injection-related: temporary floaters, minimal vision loss (<1% incidence of serious complication)\n- Systemic: rare; minimal absorption (intravitreal injection, not systemic absorption)\n- Cardiovascular: no increased risk with intravitreal administration\n- Allergy: rare; anaphylaxis exceedingly rare\n- Retinal detachment: rare, more common in high myopia\n\nContraindications:\n- Active ocular infection: defer until resolved\n- Recent intraocular surgery: may defer 4 weeks\n- Hyphema: defer\n- Relative: pregnancy (avoid due to unknown teratogenicity)\n\nCost and access:\n- Aflibercept: $1,680-2,000 per injection (US)\n- Ranibizumab: $1,680-2,000 per injection (US)\n- Bevacizumab: $30-50 per injection (off-label, insurance may not cover)\n- In resource-limited settings, bevacizumab or laser preferred\n\nCombination therapy:\n- Anti-VEGF + laser: may be superior to either alone\n- Anti-VEGF + intravitreal steroid: if inadequate response\n- Choice depends on patient response and local resources",
  "tokens": 410,
  "keywords": ["anti-VEGF", "aflibercept", "ranibizumab", "bevacizumab", "DME", "PDR", "treatment"],
  "clinical_summary": true,
  "patient_friendly": false,
  "source": "AAO_guidelines_2023",
  "confidence": "high",
  "valid_until": "2027-01-01",
  "language": "en"
}
```

---

### SECTION 3: OTHER RETINOPATHIES (Brief)

#### CHUNK: HRET_001 - Hypertensive Retinopathy

```json
{
  "id": "HRET_001",
  "category": "hypertensive_ret",
  "title": "Hypertensive Retinopathy Stages",
  "content": "Hypertensive retinopathy reflects acute or chronic vascular changes from elevated blood pressure. Severity correlates with blood pressure elevation and underlying end-organ damage.\n\nStaging (Keith-Wagener-Barker):\nGrade 1 (mild):\n- Generalized narrowing of arterioles\n- Copper-wire appearance (bright, narrowed arteries)\n- No exudates or hemorrhages\n- Usually no symptoms\n- Represents chronic hypertension\n\nGrade 2 (moderate):\n- Arteriovenous nicking (compression of veins by arteries)\n- Copper-wire arterioles\n- Flame-shaped hemorrhages\n- Cotton wool spots\n- Hard exudates (may circinate)\n- Macular involvement possible\n\nGrade 3 (severe):\n- All grade 2 findings plus:\n- Papilledema (optic disc swelling)\n- Retinal hemorrhages (flame, dot-blot)\n- Soft exudates (cotton wool spots) numerous\n- \"Macular star\": characteristic circinate lipid pattern around macula\n- Indicates hypertensive emergency\n\nGrade 4 (malignant):\n- All grade 3 findings plus:\n- Papilledema (swollen disc edges)\n- Retinal whitening (retinal edema, cotton wool spots)\n- Hemorrhages and microinfarcts\n- Indicates hypertensive emergency requiring immediate treatment\n\nManagement:\n- Grade 1-2: control BP with medications, monitor quarterly\n- Grade 3-4: urgent BP reduction (target <160/110 in ER, <130/80 over days-weeks)\n- Papilledema indicates CNS involvement; coordinate with neurology\n- Manage underlying hypertension etiology\n- Prognosis with treatment: reversal of retinal findings over weeks-months",
  "tokens": 310,
  "keywords": ["hypertensive retinopathy", "papilledema", "Keith-Wagener", "grade", "hemorrhage", "management"],
  "clinical_summary": true,
  "patient_friendly": false,
  "source": "AAO_general_ophthalmology",
  "confidence": "high",
  "valid_until": "2027-01-01",
  "language": "en"
}
```

#### CHUNK: ROP_001 - Retinopathy of Prematurity Overview

```json
{
  "id": "ROP_001",
  "category": "ROP",
  "title": "Retinopathy of Prematurity (ROP) - Overview",
  "content": "Retinopathy of prematurity (ROP) is an abnormal retinal vascularization that occurs in premature infants. It is the leading preventable cause of childhood blindness globally. ROP occurs when vascularization of the retina is disrupted.\n\nRisk factors:\n- Gestational age <32 weeks (highest risk <28 weeks)\n- Birth weight <1500g (highest risk <1000g)\n- High oxygen exposure (supplemental O2, especially unregulated)\n- Sepsis, intraventricular hemorrhage, respiratory distress\n- Anemia, blood transfusions\n- Poor nutrition\n\nPathophysiology two-phase model:\nPhase 1 (vaso-obliteration):\n- High oxygen levels suppress VEGF\n- Cessation of normal retinal vascularization\n- Avascular (non-vascularized) retina develops\n\nPhase 2 (vaso-proliferation):\n- Relative hypoxia in growing retina\n- Surge in VEGF production\n- Abnormal neovascularization develops (tortuous vessels, ridges)\n- Ridge formation, extraretinal fibrovascular proliferation\n- Risk of retinal detachment and blindness\n\nStaging (International Classification):\n- Zone 1-3: location (zone 1 closest to optic nerve, zone 3 most peripheral)\n- Stage 1-5: severity (stage 1 minimal; stage 5 total retinal detachment, blindness)\n\nScreening and management:\n- Screen all infants <30 weeks gestation and/or <1500g birth weight\n- Anti-VEGF therapy (bevacizumab, aflibercept) emerging as effective\n- Laser photocoagulation if regression of neovascularization\n- Vitrectomy if retinal detachment\n- Prognosis: with early detection and treatment, 90% avoid blindness\n\nPrevention:\n- Oxygen saturation targets: 90-95% (avoid both hypoxia and hyperoxia)\n- Proper neonatal care, nutrition, infection prevention\n- Regular screening by pediatric retina specialist",
  "tokens": 320,
  "keywords": ["ROP", "prematurity", "neovascularization", "retinal detachment", "screening", "anti-VEGF"],
  "clinical_summary": true,
  "patient_friendly": false,
  "source": "AAO_general_ophthalmology",
  "confidence": "high",
  "valid_until": "2027-01-01",
  "language": "en"
}
```

---

### SECTION 4: PATIENT EDUCATION

#### CHUNK: PATEDU_001 - What is Diabetic Retinopathy? (Patient-friendly)

```json
{
  "id": "PATEDU_001",
  "category": "patient_ed",
  "title": "Understanding Diabetic Retinopathy (Patient Education)",
  "content": "Diabetic retinopathy (DR) is eye disease that happens when diabetes damages the tiny blood vessels in the back of your eye (the retina). This is one of the most common complications of diabetes, but it can often be prevented or slowed with good diabetes care.\n\nHow does diabetes harm the eyes?\nWhen your blood sugar stays too high for a long time, it damages the small blood vessels in your retina. The retina is the part of your eye that captures light and sends images to your brain so you can see. When these blood vessels are damaged:\n- They can leak fluid or blood into the eye\n- New, weak blood vessels may grow in the wrong places\n- Scar tissue can form and pull the retina out of place\n\nWhy doesn't it hurt?\nDiabetic retinopathy usually doesn't hurt and may not cause any symptoms in early stages. This is why regular eye exams are so important — you might have it without knowing!\n\nEarly signs (what you might notice):\n- Blurry vision (comes and goes)\n- Floaters (dark spots or squiggly lines in your vision)\n- Eye pain (if advanced)\n- Blank or dark spots in your vision (if severe)\n\nStages of diabetic retinopathy:\n1. Early stage (nonproliferative): tiny leaks in blood vessels, little to no vision change\n2. More advanced stage: more bleeding, fluid buildup, possible vision blurring\n3. Severe stage: many new, weak blood vessels growing, higher risk of vision loss\n4. Most severe (proliferative): new vessels very active, high risk of blindness if untreated\n\nWhy it matters:\nDiabetic retinopathy is one of the leading causes of blindness in adults under 65. But with early detection and treatment, 95% of vision loss can be prevented.\n\nHow to prevent or slow it:\n1. Keep your blood sugar as close to normal as possible\n2. Control your blood pressure (high BP speeds up eye damage)\n3. Get regular dilated eye exams (at least once a year, more often if DR found)\n4. Take diabetes medicines exactly as prescribed\n5. Eat healthy, exercise, and maintain a healthy weight\n6. Don't smoke (smoking makes DR worse)\n\nNext steps:\nIf you have been diagnosed with DR, you will need:\n- More frequent eye exams (every 1-3 months depending on severity)\n- Possible treatment (eye injections, laser, or surgery)\n- Intensive diabetes management\n- Blood pressure control\n- Regular follow-up with your eye doctor and diabetes doctor",
  "tokens": 380,
  "keywords": ["diabetic retinopathy", "patient education", "blood sugar", "eye damage", "prevention"],
  "clinical_summary": false,
  "patient_friendly": true,
  "source": "patient_education",
  "confidence": "high",
  "valid_until": "2027-01-01",
  "language": "en"
}
```

#### CHUNK: PATEDU_002 - Living with Diabetic Retinopathy (Patient Education)

```json
{
  "id": "PATEDU_002",
  "category": "patient_ed",
  "title": "Living with Diabetic Retinopathy: What to Expect",
  "content": "If you have been told you have diabetic retinopathy, you may feel worried or scared. The good news is that with proper treatment and care, most people are able to keep their vision and prevent blindness.\n\nWhat to expect after diagnosis:\n1. More frequent eye doctor visits (possibly monthly or quarterly)\n2. Frequent retinal imaging (photos or OCT scans)\n3. Possible treatment (described below)\n4. Closer monitoring of your blood sugar and blood pressure\n5. Lifestyle changes (diet, exercise, medication compliance)\n\nTypes of treatment:\nYour eye doctor may recommend one or more of these:\n\nEye injections (anti-VEGF):\n- Medicine injected directly into your eye (monthly initially)\n- Safe and commonly used\n- Works by reducing swelling and preventing abnormal blood vessel growth\n- You will feel pressure but minimal pain\n- Vision usually improves within weeks\n\nLaser treatment:\n- Heat beam applied to retina to seal leaking blood vessels\n- Usually outpatient (1-2 hours)\n- Minimal discomfort\n- Protects remaining vision but doesn't restore lost vision\n- May be used alone or with eye injections\n\nSurgery (vitrectomy):\n- Removal of gel (vitreous) from inside eye if severe bleeding\n- Usually for advanced cases\n- Performed under anesthesia\n- Allows retina to be treated and reattached if needed\n\nLifestyle changes you can make:\n1. Blood sugar control (most important!):\n   - Check blood sugar as recommended\n   - Take diabetes medicines every day\n   - Eat healthy, balanced meals\n   - Limit sweets and sugary drinks\n   - Target HbA1c (3-month average): <7% if possible\n\n2. Blood pressure control:\n   - Take blood pressure medicine every day\n   - Limit salt in your diet\n   - Maintain healthy weight\n   - Reduce stress\n   - Target: <130/80 mmHg\n\n3. General health:\n   - Exercise 30 minutes, 5 days per week\n   - Don't smoke (very important)\n   - Limit alcohol\n   - Get adequate sleep\n   - Manage stress\n\n4. Eye health:\n   - Attend all eye appointments\n   - Wear protective sunglasses (UV protection)\n   - Avoid strenuous activities (if advised by eye doctor)\n\nWhen to call your eye doctor immediately:\n- Sudden blurry vision\n- Sudden onset of floaters or flashing lights\n- Pain in the eye\n- Feeling like a curtain or shadow across your vision\n- Sudden loss of vision\n\nEmotional support:\n- It's normal to feel worried or depressed after a DR diagnosis\n- Talk to your doctor about resources: support groups, counselors, diabetes educators\n- Many people with DR maintain good vision and normal lives\n- Hope: with modern treatments, blindness from DR is now preventable in most cases",
  "tokens": 380,
  "keywords": ["patient education", "treatment options", "lifestyle changes", "follow-up", "support"],
  "clinical_summary": false,
  "patient_friendly": true,
  "source": "patient_education",
  "confidence": "high",
  "valid_until": "2027-01-01",
  "language": "en"
}
```

---

## Implementation Plan

### Phase 1: Knowledge Base Creation & Chunking (Week 1)

**Tasks**:
- [ ] Finalize content for all chunks (above is ~6000 words, target 100+ chunks for comprehensive KB)
- [ ] Chunk remaining sections:
  - Additional DR management (laser, corticosteroids)
  - Additional hypertensive retinopathy content
  - Additional ROP content
  - Additional patient education topics
- [ ] Count tokens for each chunk (verify 300-400 range)
- [ ] Embed all chunks (use OpenAI embeddings API or similar)
- [ ] Create metadata file with all chunk IDs, keywords, embeddings

**Deliverables**:
- JSON file: `retinopathy_kb.json` with all chunks
- Metadata CSV: chunk ID, category, tokens, keywords, embedding dimension
- Search index ready for deployment

**Estimated time**: 3-5 business days

---

### Phase 2: Vector Database Setup (Week 1-2)

**Options**:

1. **Lightweight** (single server, <100K chunks):
   - Supabase (PostgreSQL + pgvector extension)
   - Cost: $25/month
   - Setup: 1 day

2. **Medium scale** (1M chunks, high throughput):
   - Pinecone (managed vector DB)
   - Cost: $0.10 per 100K vectors + query costs
   - Setup: same day
   - No maintenance

3. **Enterprise** (on-prem, full control):
   - Weaviate or Milvus (open source)
   - Cost: self-hosted
   - Setup: 3-5 days

**Recommendation for your app**: **Supabase** (low cost, simple setup, sufficient for your scale)

**Setup steps**:
```sql
-- Create vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create KB table
CREATE TABLE retinopathy_kb (
  id TEXT PRIMARY KEY,
  category TEXT,
  title TEXT,
  content TEXT,
  tokens INT,
  keywords TEXT[],
  clinical_summary BOOLEAN,
  patient_friendly BOOLEAN,
  source TEXT,
  embedding vector(1536),
  created_at TIMESTAMP,
  language TEXT
);

-- Create index for fast search
CREATE INDEX ON retinopathy_kb USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- BM25 index for keyword search
CREATE INDEX ON retinopathy_kb USING gin (keywords);
```

---

### Phase 3: Retrieval Engine Implementation (Week 2)

**Hybrid search combining BM25 + semantic search**:

```python
from supabase import create_client
from openai import OpenAI
import math

class RetinopathyRAG:
    def __init__(self, supabase_url, supabase_key, openai_api_key):
        self.supabase = create_client(supabase_url, supabase_key)
        self.openai = OpenAI(api_key=openai_api_key)
    
    def retrieve(self, query, classification_result, top_k=8):
        """
        Hybrid retrieval: BM25 + semantic search
        Returns top-K chunks ranked by combined score
        """
        # 1. Extract keywords from classification
        keywords = self._extract_keywords(classification_result)
        
        # 2. BM25 search (keyword-based)
        bm25_results = self._bm25_search(keywords, top_k=15)
        
        # 3. Semantic search (embedding-based)
        query_embedding = self._embed_query(query)
        semantic_results = self._semantic_search(query_embedding, top_k=15)
        
        # 4. Hybrid ranking (combine scores)
        combined = self._combine_rankings(bm25_results, semantic_results, top_k=top_k)
        
        return combined
    
    def _extract_keywords(self, classification_result):
        """Extract disease stage, lesions, from classification"""
        keywords = []
        
        # Map classification to KB keywords
        risk_level = classification_result['riskLevel']
        detected_lesions = [l['type'] for l in classification_result['detectedLesions']]
        
        # Risk level mapping
        risk_map = {
            'high': ['PDR', 'neovascularization', 'severe'],
            'medium': ['NPDR', 'moderate', 'progression'],
            'low': ['mild', 'early', 'microaneurysm']
        }
        keywords.extend(risk_map.get(risk_level, []))
        keywords.extend(detected_lesions)
        
        return keywords
    
    def _embed_query(self, query):
        """Convert query to embedding"""
        response = self.openai.embeddings.create(
            model="text-embedding-3-small",
            input=query
        )
        return response.data[0].embedding
    
    def _bm25_search(self, keywords, top_k=15):
        """BM25 keyword search via Postgres"""
        response = self.supabase.table('retinopathy_kb').select('*').in_('keywords', keywords).limit(top_k).execute()
        return [(r, 1.0) for r in response.data]  # Score=1.0 for all BM25 hits
    
    def _semantic_search(self, embedding, top_k=15):
        """Vector search via pgvector"""
        response = self.supabase.rpc(
            'match_retinopathy_kb',
            {
                'query_embedding': embedding,
                'match_count': top_k,
                'match_threshold': 0.5
            }
        ).execute()
        return [(r, r.get('similarity', 0)) for r in response.data]
    
    def _combine_rankings(self, bm25, semantic, top_k=8):
        """RRF (Reciprocal Rank Fusion)"""
        scores = {}
        
        # BM25 scores
        for i, (doc, score) in enumerate(bm25):
            doc_id = doc['id']
            scores[doc_id] = scores.get(doc_id, 0) + 1 / (60 + i)  # RRF formula
        
        # Semantic scores
        for i, (doc, score) in enumerate(semantic):
            doc_id = doc['id']
            scores[doc_id] = scores.get(doc_id, 0) + score + 1 / (60 + i)
        
        # Sort and return top-K
        ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:top_k]
        
        return [doc_id for doc_id, _ in ranked]
```

**Performance targets**:
- Query embedding: ~10ms
- BM25 search: <5ms
- Semantic search: <50ms
- Total retrieval: <100ms

---

### Phase 4: Context Assembly & LLM Integration (Week 2-3)

**Format retrieved chunks for LLM**:

```python
def assemble_context(retrieved_chunk_ids, classification_result):
    """
    Assemble retrieved chunks into structured context for LLM
    """
    chunks = fetch_chunks_from_db(retrieved_chunk_ids)
    
    context = {
        "clinical_context": {
            "classification": classification_result,
            "retrieved_documents": [
                {
                    "source": chunk['source'],
                    "content": chunk['content'],
                    "category": chunk['category']
                }
                for chunk in chunks if chunk['clinical_summary']
            ]
        },
        "patient_education": [
            chunk['content']
            for chunk in chunks if chunk['patient_friendly']
        ]
    }
    
    return context

# Use in LLM prompt
context = assemble_context(retrieved_ids, classification_result)

llm_prompt = f"""
You are a retinal disease specialist interpreting a diabetic retinopathy screening result.

Classification result:
{json.dumps(classification_result, indent=2)}

Relevant clinical guidelines and evidence:
{json.dumps(context['clinical_context'], indent=2)}

Patient education resources:
{context['patient_education']}

Provide:
1. Clinical interpretation (for clinician)
2. Risk assessment
3. Patient-friendly explanation
4. Recommended next steps

Output as structured JSON.
"""

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=2000,
    messages=[{"role": "user", "content": llm_prompt}]
)
```

---

### Phase 5: Testing & Validation (Week 3)

**Tests**:
- [ ] Retrieval accuracy: does BM25+semantic return relevant chunks? (manual spot-check 20 queries)
- [ ] Speed: retrieval + LLM generation < 3 seconds
- [ ] Hallucination reduction: do interpretations cite KB chunks? (check prompt adherence)
- [ ] Patient education accuracy: clinical review of patient explanations

**Success criteria**:
- Retrieval latency p95 < 100ms
- LLM output cites KB >80% of facts
- Clinical reviewers approve 95%+ of interpretations
- Patient education clarity score 4.5/5 or higher

---

## Search & Retrieval Examples

### Example 1: Classification with NPDR Mild

**Input**:
```json
{
  "riskLevel": "medium",
  "detectedLesions": [
    {"type": "Microaneurysm", "confidence": 0.92},
    {"type": "Hard Exudate", "confidence": 0.78}
  ]
}
```

**Query formation**:
- Keywords: ["NPDR", "Microaneurysm", "medium", "Hard Exudate"]
- Natural language query: "What is the significance of microaneurysms and hard exudates in diabetic retinopathy? What is the management approach for NPDR?"

**Retrieved chunks**:
1. `DR_STAGE_001` (NPDR Mild) - relevance: 0.95
2. `DR_LESION_001` (Microaneurysm) - relevance: 0.92
3. `DR_LESION_002` (Hard Exudate) - relevance: 0.88
4. `MGMT_001` (Glycemic Control) - relevance: 0.82
5. `MGMT_002` (Blood Pressure Control) - relevance: 0.78
6. `PATEDU_001` (Patient Education - What is DR?) - relevance: 0.75
7. `DR_STAGE_002` (NPDR Moderate) - relevance: 0.70 (for context on progression)
8. `PATEDU_002` (Living with DR) - relevance: 0.68

**Context passed to LLM**:
```
Classification: NPDR Mild (Microaneurysm + Hard Exudate)

Clinical background (retrieved):
- [Content from DR_STAGE_001]
- [Content from DR_LESION_001 & 002]
- [Content from MGMT_001 & 002]

Patient education (retrieved):
- [Content from PATEDU_001 & 002]
```

**LLM interpretation output**:
- Clinical assessment: "Early-stage nonproliferative DR with microaneurysms indicating pericyte loss..."
- Risk stratification: "25-33% progression risk without intervention"
- Patient explanation: "Your eye exam shows early signs of diabetes affecting small blood vessels..."
- Next steps: "Urgent referral for comprehensive eye exam..."

---

### Example 2: Classification with PDR

**Input**:
```json
{
  "riskLevel": "high",
  "detectedLesions": [
    {"type": "Neovascularization", "confidence": 0.96},
    {"type": "Vitreous Hemorrhage", "confidence": 0.88}
  ]
}
```

**Retrieved chunks**:
1. `DR_STAGE_004` (PDR) - relevance: 0.98
2. `MGMT_003` (Anti-VEGF Therapy) - relevance: 0.94
3. `DR_DME_001` (DME) - relevance: 0.82 (if concurrent DME)
4. `MGMT_001` (Glycemic Control) - relevance: 0.75
5. `PATEDU_002` (Living with DR) - relevance: 0.70

**Context**: PDR evidence + anti-VEGF details + management timeline

**LLM output**: Emphasizes urgency, anti-VEGF treatment, monthly monitoring, vision loss risk

---

## Next Steps

1. **Week 1**: Complete KB chunking + embedding
2. **Week 2**: Deploy Supabase + retrieval engine
3. **Week 3**: Integration testing + clinical validation
4. **Week 4**: Go live in staging environment

**Success metric**: By week 4, interpretations should be clinically accurate, evidence-based, and patient-friendly.

---

## References & Sources

- American Academy of Ophthalmology. Diabetic Retinopathy. 2023.
- International Diabetes Federation. IDF Diabetes Atlas. 2023.
- Wilkinson CP, et al. Proposed International Clinical Diabetic Retinopathy and Diabetic Macular Edema Disease Severity Scales. Ophthalmology. 2003.
- ETDRS Research Group. Grading Diabetic Retinopathy from Stereoscopic Color Fundus Photographs. Ophthalmology. 1991.

