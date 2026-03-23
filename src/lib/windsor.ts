// Windsor.ai integration layer for GA4 data
// In production, this would call the Windsor.ai REST API directly.
// During development, data is fetched via the MCP connector.

export const WINDSOR_CONFIG = {
  connector: "googleanalytics4",
  accountId: "372674508",
  accountName: "GA4 Vortex",
} as const;

export interface GA4DailyData {
  date: string;
  sessions: number;
  active_users: number;
  item_view_events: number;
  add_to_carts: number;
  checkouts: number;
  ecommerce_purchases: number;
  purchase_revenue: number;
  engaged_sessions: number;
  bounce_rate: number;
}

export interface GA4ChannelData {
  session_default_channel_group: string;
  sessions: number;
  active_users: number;
  item_view_events: number;
  add_to_carts: number;
  checkouts: number;
  ecommerce_purchases: number;
  purchase_revenue: number;
}

export interface FunnelStep {
  label: string;
  key: string;
  value: number;
  previousValue: number;
  color: string;
}

export interface KPIData {
  label: string;
  value: number;
  previousValue: number;
  format: "number" | "currency" | "percent";
}

// Real GA4 data - Last 30 days (2026-02-21 to 2026-03-22)
export const ga4DailyData: GA4DailyData[] = [
  { date: "2026-02-21", sessions: 1381, active_users: 1092, item_view_events: 1310, add_to_carts: 159, checkouts: 33, ecommerce_purchases: 13, purchase_revenue: 3409.54, engaged_sessions: 1024, bounce_rate: 0.2585 },
  { date: "2026-02-22", sessions: 1352, active_users: 1128, item_view_events: 1281, add_to_carts: 121, checkouts: 28, ecommerce_purchases: 13, purchase_revenue: 2565.54, engaged_sessions: 1000, bounce_rate: 0.2604 },
  { date: "2026-02-23", sessions: 1364, active_users: 1078, item_view_events: 1362, add_to_carts: 145, checkouts: 30, ecommerce_purchases: 22, purchase_revenue: 5224.89, engaged_sessions: 1028, bounce_rate: 0.2463 },
  { date: "2026-02-24", sessions: 1358, active_users: 1045, item_view_events: 1379, add_to_carts: 160, checkouts: 42, ecommerce_purchases: 30, purchase_revenue: 6306.68, engaged_sessions: 1025, bounce_rate: 0.2452 },
  { date: "2026-02-25", sessions: 1264, active_users: 988, item_view_events: 1369, add_to_carts: 180, checkouts: 37, ecommerce_purchases: 24, purchase_revenue: 5751.99, engaged_sessions: 954, bounce_rate: 0.2453 },
  { date: "2026-02-26", sessions: 1291, active_users: 1042, item_view_events: 1344, add_to_carts: 196, checkouts: 51, ecommerce_purchases: 20, purchase_revenue: 4148.45, engaged_sessions: 975, bounce_rate: 0.2448 },
  { date: "2026-02-27", sessions: 1235, active_users: 986, item_view_events: 1267, add_to_carts: 158, checkouts: 40, ecommerce_purchases: 25, purchase_revenue: 5347.54, engaged_sessions: 981, bounce_rate: 0.2057 },
  { date: "2026-02-28", sessions: 1266, active_users: 985, item_view_events: 1455, add_to_carts: 194, checkouts: 56, ecommerce_purchases: 27, purchase_revenue: 6251.48, engaged_sessions: 973, bounce_rate: 0.2314 },
  { date: "2026-03-01", sessions: 1590, active_users: 1280, item_view_events: 1720, add_to_carts: 252, checkouts: 61, ecommerce_purchases: 29, purchase_revenue: 6738.40, engaged_sessions: 1227, bounce_rate: 0.2283 },
  { date: "2026-03-02", sessions: 1444, active_users: 1161, item_view_events: 1501, add_to_carts: 196, checkouts: 45, ecommerce_purchases: 22, purchase_revenue: 4908.07, engaged_sessions: 1153, bounce_rate: 0.2015 },
  { date: "2026-03-03", sessions: 1504, active_users: 1150, item_view_events: 1546, add_to_carts: 213, checkouts: 55, ecommerce_purchases: 34, purchase_revenue: 8112.54, engaged_sessions: 1159, bounce_rate: 0.2294 },
  { date: "2026-03-04", sessions: 1626, active_users: 1279, item_view_events: 1677, add_to_carts: 207, checkouts: 49, ecommerce_purchases: 28, purchase_revenue: 6197.73, engaged_sessions: 1285, bounce_rate: 0.2097 },
  { date: "2026-03-05", sessions: 1209, active_users: 936, item_view_events: 1235, add_to_carts: 163, checkouts: 42, ecommerce_purchases: 22, purchase_revenue: 4757.14, engaged_sessions: 968, bounce_rate: 0.1993 },
  { date: "2026-03-06", sessions: 1121, active_users: 811, item_view_events: 1174, add_to_carts: 169, checkouts: 47, ecommerce_purchases: 31, purchase_revenue: 7440.29, engaged_sessions: 850, bounce_rate: 0.2417 },
  { date: "2026-03-07", sessions: 1340, active_users: 1046, item_view_events: 1482, add_to_carts: 231, checkouts: 61, ecommerce_purchases: 35, purchase_revenue: 8222.99, engaged_sessions: 1030, bounce_rate: 0.2313 },
  { date: "2026-03-08", sessions: 1564, active_users: 1234, item_view_events: 1744, add_to_carts: 269, checkouts: 66, ecommerce_purchases: 40, purchase_revenue: 9486.46, engaged_sessions: 1211, bounce_rate: 0.2257 },
  { date: "2026-03-09", sessions: 1541, active_users: 1192, item_view_events: 1591, add_to_carts: 218, checkouts: 51, ecommerce_purchases: 34, purchase_revenue: 7907.26, engaged_sessions: 1160, bounce_rate: 0.2472 },
  { date: "2026-03-10", sessions: 1369, active_users: 1065, item_view_events: 1528, add_to_carts: 241, checkouts: 56, ecommerce_purchases: 36, purchase_revenue: 8090.28, engaged_sessions: 1057, bounce_rate: 0.2279 },
  { date: "2026-03-11", sessions: 1482, active_users: 1173, item_view_events: 1666, add_to_carts: 243, checkouts: 68, ecommerce_purchases: 50, purchase_revenue: 12846.41, engaged_sessions: 1124, bounce_rate: 0.2416 },
  { date: "2026-03-12", sessions: 1438, active_users: 1163, item_view_events: 1567, add_to_carts: 232, checkouts: 60, ecommerce_purchases: 38, purchase_revenue: 8934.13, engaged_sessions: 1146, bounce_rate: 0.2031 },
  { date: "2026-03-13", sessions: 1415, active_users: 1127, item_view_events: 1547, add_to_carts: 211, checkouts: 60, ecommerce_purchases: 31, purchase_revenue: 7301.94, engaged_sessions: 1063, bounce_rate: 0.2488 },
  { date: "2026-03-14", sessions: 1455, active_users: 1140, item_view_events: 1589, add_to_carts: 213, checkouts: 40, ecommerce_purchases: 22, purchase_revenue: 5375.06, engaged_sessions: 1093, bounce_rate: 0.2488 },
  { date: "2026-03-15", sessions: 1633, active_users: 1336, item_view_events: 1639, add_to_carts: 209, checkouts: 62, ecommerce_purchases: 38, purchase_revenue: 8371.17, engaged_sessions: 1226, bounce_rate: 0.2492 },
  { date: "2026-03-16", sessions: 1459, active_users: 1175, item_view_events: 1535, add_to_carts: 211, checkouts: 58, ecommerce_purchases: 36, purchase_revenue: 8063.73, engaged_sessions: 1120, bounce_rate: 0.2324 },
  { date: "2026-03-17", sessions: 1349, active_users: 1060, item_view_events: 1345, add_to_carts: 165, checkouts: 32, ecommerce_purchases: 17, purchase_revenue: 3667.87, engaged_sessions: 1022, bounce_rate: 0.2424 },
  { date: "2026-03-18", sessions: 1117, active_users: 857, item_view_events: 1163, add_to_carts: 152, checkouts: 43, ecommerce_purchases: 32, purchase_revenue: 6791.22, engaged_sessions: 879, bounce_rate: 0.2131 },
  { date: "2026-03-19", sessions: 1238, active_users: 934, item_view_events: 1413, add_to_carts: 191, checkouts: 42, ecommerce_purchases: 30, purchase_revenue: 6773.31, engaged_sessions: 956, bounce_rate: 0.2278 },
  { date: "2026-03-20", sessions: 1177, active_users: 917, item_view_events: 1337, add_to_carts: 184, checkouts: 36, ecommerce_purchases: 26, purchase_revenue: 6270.49, engaged_sessions: 929, bounce_rate: 0.2107 },
  { date: "2026-03-21", sessions: 1207, active_users: 941, item_view_events: 1369, add_to_carts: 169, checkouts: 40, ecommerce_purchases: 25, purchase_revenue: 5846.54, engaged_sessions: 963, bounce_rate: 0.2022 },
  { date: "2026-03-22", sessions: 1375, active_users: 1120, item_view_events: 1328, add_to_carts: 161, checkouts: 33, ecommerce_purchases: 17, purchase_revenue: 4535.97, engaged_sessions: 656, bounce_rate: 0.5229 },
];

// Previous 30 days for comparison (2026-01-22 to 2026-02-20)
export const ga4PreviousPeriodData: GA4DailyData[] = [
  { date: "2026-01-22", sessions: 1985, active_users: 1596, item_view_events: 2125, add_to_carts: 216, checkouts: 57, ecommerce_purchases: 31, purchase_revenue: 6536.90, engaged_sessions: 1544, bounce_rate: 0.2222 },
  { date: "2026-01-23", sessions: 1889, active_users: 1559, item_view_events: 2181, add_to_carts: 227, checkouts: 60, ecommerce_purchases: 34, purchase_revenue: 7308.78, engaged_sessions: 1537, bounce_rate: 0.1863 },
  { date: "2026-01-24", sessions: 1871, active_users: 1553, item_view_events: 2200, add_to_carts: 234, checkouts: 42, ecommerce_purchases: 25, purchase_revenue: 5896.01, engaged_sessions: 1513, bounce_rate: 0.1913 },
  { date: "2026-01-25", sessions: 2103, active_users: 1778, item_view_events: 2407, add_to_carts: 200, checkouts: 43, ecommerce_purchases: 21, purchase_revenue: 4830.21, engaged_sessions: 1719, bounce_rate: 0.1826 },
  { date: "2026-01-26", sessions: 1895, active_users: 1530, item_view_events: 2220, add_to_carts: 251, checkouts: 67, ecommerce_purchases: 36, purchase_revenue: 9308.71, engaged_sessions: 1548, bounce_rate: 0.1831 },
  { date: "2026-01-27", sessions: 2184, active_users: 1797, item_view_events: 2432, add_to_carts: 231, checkouts: 51, ecommerce_purchases: 31, purchase_revenue: 6844.75, engaged_sessions: 1774, bounce_rate: 0.1877 },
  { date: "2026-01-28", sessions: 2175, active_users: 1809, item_view_events: 2432, add_to_carts: 266, checkouts: 68, ecommerce_purchases: 34, purchase_revenue: 7529.58, engaged_sessions: 1791, bounce_rate: 0.1766 },
  { date: "2026-01-29", sessions: 2246, active_users: 1842, item_view_events: 2597, add_to_carts: 298, checkouts: 61, ecommerce_purchases: 36, purchase_revenue: 7167.18, engaged_sessions: 1840, bounce_rate: 0.1808 },
  { date: "2026-01-30", sessions: 2428, active_users: 2033, item_view_events: 2183, add_to_carts: 248, checkouts: 65, ecommerce_purchases: 40, purchase_revenue: 8531.05, engaged_sessions: 1819, bounce_rate: 0.2508 },
  { date: "2026-01-31", sessions: 2611, active_users: 2252, item_view_events: 2371, add_to_carts: 290, checkouts: 79, ecommerce_purchases: 42, purchase_revenue: 9543.27, engaged_sessions: 1995, bounce_rate: 0.2359 },
  { date: "2026-02-01", sessions: 3211, active_users: 2792, item_view_events: 2678, add_to_carts: 319, checkouts: 70, ecommerce_purchases: 39, purchase_revenue: 8191.72, engaged_sessions: 2370, bounce_rate: 0.2619 },
  { date: "2026-02-02", sessions: 3074, active_users: 2637, item_view_events: 2639, add_to_carts: 337, checkouts: 75, ecommerce_purchases: 43, purchase_revenue: 9909.21, engaged_sessions: 2245, bounce_rate: 0.2697 },
  { date: "2026-02-03", sessions: 2980, active_users: 2586, item_view_events: 2620, add_to_carts: 274, checkouts: 72, ecommerce_purchases: 39, purchase_revenue: 9135.08, engaged_sessions: 2195, bounce_rate: 0.2634 },
  { date: "2026-02-04", sessions: 2973, active_users: 2538, item_view_events: 2564, add_to_carts: 284, checkouts: 73, ecommerce_purchases: 36, purchase_revenue: 7841.10, engaged_sessions: 2235, bounce_rate: 0.2482 },
  { date: "2026-02-05", sessions: 2817, active_users: 2337, item_view_events: 2654, add_to_carts: 319, checkouts: 82, ecommerce_purchases: 47, purchase_revenue: 10413.04, engaged_sessions: 2109, bounce_rate: 0.2513 },
  { date: "2026-02-06", sessions: 2624, active_users: 2158, item_view_events: 2319, add_to_carts: 295, checkouts: 78, ecommerce_purchases: 47, purchase_revenue: 10118.91, engaged_sessions: 1964, bounce_rate: 0.2515 },
  { date: "2026-02-07", sessions: 2326, active_users: 1932, item_view_events: 2108, add_to_carts: 288, checkouts: 63, ecommerce_purchases: 28, purchase_revenue: 7044.38, engaged_sessions: 1755, bounce_rate: 0.2455 },
  { date: "2026-02-08", sessions: 2657, active_users: 2198, item_view_events: 2555, add_to_carts: 343, checkouts: 88, ecommerce_purchases: 52, purchase_revenue: 11594.35, engaged_sessions: 1992, bounce_rate: 0.2503 },
  { date: "2026-02-09", sessions: 2273, active_users: 1838, item_view_events: 2012, add_to_carts: 257, checkouts: 59, ecommerce_purchases: 34, purchase_revenue: 7809.41, engaged_sessions: 1669, bounce_rate: 0.2657 },
  { date: "2026-02-10", sessions: 1977, active_users: 1579, item_view_events: 1942, add_to_carts: 252, checkouts: 64, ecommerce_purchases: 39, purchase_revenue: 8660.28, engaged_sessions: 1513, bounce_rate: 0.2347 },
  { date: "2026-02-11", sessions: 1987, active_users: 1616, item_view_events: 1856, add_to_carts: 240, checkouts: 74, ecommerce_purchases: 34, purchase_revenue: 7370.32, engaged_sessions: 1461, bounce_rate: 0.2647 },
  { date: "2026-02-12", sessions: 1939, active_users: 1578, item_view_events: 1840, add_to_carts: 263, checkouts: 79, ecommerce_purchases: 39, purchase_revenue: 8478.00, engaged_sessions: 1455, bounce_rate: 0.2496 },
  { date: "2026-02-13", sessions: 1819, active_users: 1460, item_view_events: 1571, add_to_carts: 217, checkouts: 54, ecommerce_purchases: 33, purchase_revenue: 7664.17, engaged_sessions: 1298, bounce_rate: 0.2864 },
  { date: "2026-02-14", sessions: 1928, active_users: 1569, item_view_events: 1756, add_to_carts: 192, checkouts: 52, ecommerce_purchases: 27, purchase_revenue: 6325.66, engaged_sessions: 1417, bounce_rate: 0.2650 },
  { date: "2026-02-15", sessions: 2176, active_users: 1821, item_view_events: 1947, add_to_carts: 238, checkouts: 46, ecommerce_purchases: 23, purchase_revenue: 5345.53, engaged_sessions: 1585, bounce_rate: 0.2716 },
  { date: "2026-02-16", sessions: 1258, active_users: 1010, item_view_events: 1188, add_to_carts: 128, checkouts: 30, ecommerce_purchases: 16, purchase_revenue: 3676.26, engaged_sessions: 901, bounce_rate: 0.2838 },
  { date: "2026-02-17", sessions: 1585, active_users: 1293, item_view_events: 1302, add_to_carts: 150, checkouts: 35, ecommerce_purchases: 16, purchase_revenue: 3515.29, engaged_sessions: 1154, bounce_rate: 0.2719 },
  { date: "2026-02-18", sessions: 1399, active_users: 1137, item_view_events: 1417, add_to_carts: 183, checkouts: 36, ecommerce_purchases: 27, purchase_revenue: 6066.05, engaged_sessions: 1035, bounce_rate: 0.2602 },
  { date: "2026-02-19", sessions: 1463, active_users: 1194, item_view_events: 1452, add_to_carts: 152, checkouts: 41, ecommerce_purchases: 23, purchase_revenue: 4874.50, engaged_sessions: 1078, bounce_rate: 0.2632 },
  { date: "2026-02-20", sessions: 1353, active_users: 1082, item_view_events: 1337, add_to_carts: 162, checkouts: 43, ecommerce_purchases: 24, purchase_revenue: 5267.81, engaged_sessions: 1002, bounce_rate: 0.2594 },
];

// Real channel breakdown data from GA4
export const ga4ChannelData: GA4ChannelData[] = [
  { session_default_channel_group: "Organic Social", sessions: 23047, active_users: 15178, item_view_events: 21581, add_to_carts: 2977, checkouts: 612, ecommerce_purchases: 321, purchase_revenue: 74690.41 },
  { session_default_channel_group: "Unassigned", sessions: 7676, active_users: 5555, item_view_events: 8577, add_to_carts: 1326, checkouts: 413, ecommerce_purchases: 254, purchase_revenue: 60363.37 },
  { session_default_channel_group: "Paid Search", sessions: 2752, active_users: 2161, item_view_events: 2982, add_to_carts: 558, checkouts: 152, ecommerce_purchases: 94, purchase_revenue: 21116.79 },
  { session_default_channel_group: "Direct", sessions: 6826, active_users: 6409, item_view_events: 8825, add_to_carts: 693, checkouts: 151, ecommerce_purchases: 90, purchase_revenue: 18835.00 },
  { session_default_channel_group: "Organic Search", sessions: 743, active_users: 459, item_view_events: 771, add_to_carts: 132, checkouts: 58, ecommerce_purchases: 51, purchase_revenue: 11758.35 },
  { session_default_channel_group: "Email", sessions: 178, active_users: 139, item_view_events: 162, add_to_carts: 38, checkouts: 16, ecommerce_purchases: 17, purchase_revenue: 3995.47 },
  { session_default_channel_group: "Paid Social", sessions: 556, active_users: 367, item_view_events: 464, add_to_carts: 71, checkouts: 15, ecommerce_purchases: 11, purchase_revenue: 2932.01 },
  { session_default_channel_group: "Referral", sessions: 84, active_users: 44, item_view_events: 62, add_to_carts: 8, checkouts: 2, ecommerce_purchases: 2, purchase_revenue: 321.49 },
  { session_default_channel_group: "Paid Other", sessions: 12, active_users: 4, item_view_events: 15, add_to_carts: 4, checkouts: 2, ecommerce_purchases: 1, purchase_revenue: 234.98 },
  { session_default_channel_group: "Organic Shopping", sessions: 10, active_users: 6, item_view_events: 15, add_to_carts: 3, checkouts: 1, ecommerce_purchases: 2, purchase_revenue: 467.69 },
  { session_default_channel_group: "Cross-network", sessions: 2, active_users: 2, item_view_events: 4, add_to_carts: 2, checkouts: 1, ecommerce_purchases: 1, purchase_revenue: 239.84 },
  { session_default_channel_group: "SMS", sessions: 8, active_users: 6, item_view_events: 5, add_to_carts: 1, checkouts: 1, ecommerce_purchases: 3, purchase_revenue: 689.71 },
];

// Computed aggregations
function sumField(data: GA4DailyData[], field: keyof GA4DailyData): number {
  return data.reduce((sum, d) => sum + (d[field] as number), 0);
}

function avgField(data: GA4DailyData[], field: keyof GA4DailyData): number {
  return data.reduce((sum, d) => sum + (d[field] as number), 0) / data.length;
}

export function getAggregatedFunnel(): FunnelStep[] {
  const current = ga4DailyData;
  const previous = ga4PreviousPeriodData;

  return [
    { label: "Sessões", key: "sessions", value: sumField(current, "sessions"), previousValue: sumField(previous, "sessions"), color: "#6366f1" },
    { label: "View Item", key: "item_view_events", value: sumField(current, "item_view_events"), previousValue: sumField(previous, "item_view_events"), color: "#8b5cf6" },
    { label: "Add to Cart", key: "add_to_carts", value: sumField(current, "add_to_carts"), previousValue: sumField(previous, "add_to_carts"), color: "#a78bfa" },
    { label: "Begin Checkout", key: "checkouts", value: sumField(current, "checkouts"), previousValue: sumField(previous, "checkouts"), color: "#c4b5fd" },
    { label: "Purchase", key: "ecommerce_purchases", value: sumField(current, "ecommerce_purchases"), previousValue: sumField(previous, "ecommerce_purchases"), color: "#ddd6fe" },
  ];
}

export function getKPIs(): KPIData[] {
  const current = ga4DailyData;
  const previous = ga4PreviousPeriodData;

  return [
    { label: "Sessões", value: sumField(current, "sessions"), previousValue: sumField(previous, "sessions"), format: "number" },
    { label: "Usuários Ativos", value: sumField(current, "active_users"), previousValue: sumField(previous, "active_users"), format: "number" },
    { label: "Receita", value: sumField(current, "purchase_revenue"), previousValue: sumField(previous, "purchase_revenue"), format: "currency" },
    { label: "Taxa de Engajamento", value: avgField(current, "bounce_rate"), previousValue: avgField(previous, "bounce_rate"), format: "percent" },
  ];
}
