export type TrendItem = {
  title: string;
  growth_rate: number;
  saturation: "low" | "medium" | "high";
  examples: string[];
  created_at: string; // ISO8601
};
