export type Prediction = {
  class_index: number;
  label: string;
  confidence: number;
};

export type PredictResponse = {
  class_index: number;
  label: string;
  confidence: number;
  top_5: Prediction[];
};

export type RiskLevel = "low" | "medium" | "high";
