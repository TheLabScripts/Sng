import type { DealAnalysisInput, DealAnalysisResult } from "@/types/snagd";
import { analyzeDeal } from "@/lib/scoring/dealScoring";

export type AiScoringService = {
  scoreDeal(input: DealAnalysisInput): Promise<DealAnalysisResult>;
};

// Real adapters should run server-side. This boundary can support Gemini,
// OpenAI, Claude-compatible, or private model providers without exposing keys
// in the client or coupling Snagd to one scoring provider.
export const aiScoringService: AiScoringService = {
  async scoreDeal(input) {
    return analyzeDeal(input);
  },
};