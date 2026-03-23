export interface FunnelStep {
  label: string;
  value: number;
  previousValue: number;
  color: string;
}

export interface DailyData {
  date: string;
  sessions: number;
  viewItem: number;
  addToCart: number;
  beginCheckout: number;
  purchase: number;
}

export const funnelData: FunnelStep[] = [
  { label: "Sessões", value: 48520, previousValue: 42100, color: "#6366f1" },
  { label: "View Item", value: 21834, previousValue: 18945, color: "#8b5cf6" },
  { label: "Add to Cart", value: 8734, previousValue: 7560, color: "#a78bfa" },
  { label: "Begin Checkout", value: 4367, previousValue: 3780, color: "#c4b5fd" },
  { label: "Purchase", value: 1746, previousValue: 1512, color: "#ddd6fe" },
];

export const channelBreakdown: Record<string, FunnelStep[]> = {
  "meta-ads": [
    { label: "Sessões", value: 15200, previousValue: 13100, color: "#6366f1" },
    { label: "View Item", value: 7600, previousValue: 6550, color: "#8b5cf6" },
    { label: "Add to Cart", value: 3040, previousValue: 2620, color: "#a78bfa" },
    { label: "Begin Checkout", value: 1520, previousValue: 1310, color: "#c4b5fd" },
    { label: "Purchase", value: 608, previousValue: 524, color: "#ddd6fe" },
  ],
  "google-ads": [
    { label: "Sessões", value: 12800, previousValue: 11200, color: "#6366f1" },
    { label: "View Item", value: 5760, previousValue: 5040, color: "#8b5cf6" },
    { label: "Add to Cart", value: 2304, previousValue: 2016, color: "#a78bfa" },
    { label: "Begin Checkout", value: 1152, previousValue: 1008, color: "#c4b5fd" },
    { label: "Purchase", value: 461, previousValue: 403, color: "#ddd6fe" },
  ],
  organic: [
    { label: "Sessões", value: 14120, previousValue: 12300, color: "#6366f1" },
    { label: "View Item", value: 5648, previousValue: 4920, color: "#8b5cf6" },
    { label: "Add to Cart", value: 2260, previousValue: 1968, color: "#a78bfa" },
    { label: "Begin Checkout", value: 1130, previousValue: 984, color: "#c4b5fd" },
    { label: "Purchase", value: 452, previousValue: 394, color: "#ddd6fe" },
  ],
  direct: [
    { label: "Sessões", value: 6400, previousValue: 5500, color: "#6366f1" },
    { label: "View Item", value: 2826, previousValue: 2435, color: "#8b5cf6" },
    { label: "Add to Cart", value: 1130, previousValue: 956, color: "#a78bfa" },
    { label: "Begin Checkout", value: 565, previousValue: 478, color: "#c4b5fd" },
    { label: "Purchase", value: 225, previousValue: 191, color: "#ddd6fe" },
  ],
};

export const dailyData: DailyData[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 2, i + 1);
  const base = 1400 + Math.floor(Math.random() * 600);
  return {
    date: date.toISOString().split("T")[0],
    sessions: base,
    viewItem: Math.floor(base * 0.45),
    addToCart: Math.floor(base * 0.18),
    beginCheckout: Math.floor(base * 0.09),
    purchase: Math.floor(base * 0.036),
  };
});

export function getConversionRate(current: number, previous: number): string {
  return ((current / previous) * 100).toFixed(1);
}

export function getDropOff(from: number, to: number): string {
  return (((from - to) / from) * 100).toFixed(1);
}
