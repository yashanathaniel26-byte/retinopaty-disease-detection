export type ClinicalInterpretation = {
  title: string;
  summary: string;
  findingsDetail: string[];
  stagingRationale?: string;
};

export type RiskAssessment = {
  currentRiskLevel: string;
  progressionRisk6mo?: string;
  progressionRisk1yr?: string;
  riskFactors: string[];
  protectiveFactors?: string[];
};

export type Recommendations = {
  referralUrgency: string;
  nextStepsForClinician: string[];
  patientActions: string[];
};

export type PatientEducation = {
  simpleSummary: string;
  whatItMeans: string;
  whatYouCanDo: string[];
  whenToSeeDoctor: string;
  importantNote?: string;
};

export type ConfidenceMetrics = {
  interpretationConfidence: number;
  stagingConfidence: number;
  riskAssessmentConfidence: number;
  qualityFlags?: string[];
  limitationFlags?: string[];
};

export type InterpretationResponse = {
  clinicalInterpretation: ClinicalInterpretation;
  riskAssessment: RiskAssessment;
  recommendations: Recommendations;
  patientEducation: PatientEducation;
  confidenceMetrics?: ConfidenceMetrics;
};
