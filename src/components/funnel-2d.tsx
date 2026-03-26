"use client";

import { getAggregatedFunnel } from "@/lib/windsor";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function Funnel2D() {
  const funnelData = getAggregatedFunnel();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const totalSteps = funnelData.length;
  const funnelHeight = 520;
  const topWidth = 340;
  const bottomWidth = 120;
  const sliceGap = 3;
  const sliceHeight = (funnelHeight - sliceGap * (totalSteps - 1)) / totalSteps;
  const centerX = 200;

  // Calculate each slice's top and bottom width (linear taper)
  const slices = funnelData.map((step, i) => {
    const topW = topWidth - (topWidth - bottomWidth) * (i / totalSteps);
    const bottomW = topWidth - (topWidth - bottomWidth) * ((i + 1) / totalSteps);
    const y = i * (sliceHeight + sliceGap);
    const change = ((step.value - step.previousValue) / step.previousValue) * 100;
    const isPositive = step.value >= step.previousValue;

    // Drop-off to next step
    const nextStep = i < totalSteps - 1 ? funnelData[i + 1] : null;
    const dropOff = nextStep ? ((step.value - nextStep.value) / step.value * 100).toFixed(1) : null;

    return { step, topW, bottomW, y, change, isPositive, dropOff, nextStep };
  });

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 400 ${funnelHeight + 10}`}
        className="w-full max-w-[400px]"
        preserveAspectRatio="xMidYMid meet"
      >
        {slices.map((s, i) => {
          const isHovered = hoveredIdx === i;
          const x1 = centerX - s.topW / 2;
          const x2 = centerX + s.topW / 2;
          const x3 = centerX + s.bottomW / 2;
          const x4 = centerX - s.bottomW / 2;

          // Trapezoid path
          const path = `M ${x1} ${s.y} L ${x2} ${s.y} L ${x3} ${s.y + sliceHeight} L ${x4} ${s.y + sliceHeight} Z`;

          return (
            <g
              key={s.step.key}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="cursor-pointer"
            >
              {/* Slice shape */}
              <path
                d={path}
                fill={s.step.color}
                opacity={isHovered ? 1 : 0.9}
                stroke={isHovered ? "#fff" : "transparent"}
                strokeWidth={isHovered ? 2 : 0}
                className="transition-all duration-150"
              />

              {/* Label */}
              <text
                x={centerX}
                y={s.y + sliceHeight / 2 - 8}
                textAnchor="middle"
                className="pointer-events-none"
                fill="rgba(255,255,255,0.7)"
                fontSize={10}
                fontWeight={500}
              >
                {s.step.label}
              </text>

              {/* Value */}
              <text
                x={centerX}
                y={s.y + sliceHeight / 2 + 10}
                textAnchor="middle"
                className="pointer-events-none"
                fill="#fff"
                fontSize={18}
                fontWeight={700}
              >
                {s.step.value.toLocaleString("pt-BR")}
              </text>

              {/* Drop-off arrow on the right */}
              {s.dropOff && (
                <>
                  <line
                    x1={x2 + 8}
                    y1={s.y + sliceHeight}
                    x2={x3 + 8}
                    y2={s.y + sliceHeight + sliceGap}
                    stroke="#cbd5e1"
                    strokeWidth={1}
                    strokeDasharray="3 2"
                  />
                  <text
                    x={Math.max(x2, x3) + 16}
                    y={s.y + sliceHeight + 2}
                    fill="#94a3b8"
                    fontSize={9}
                    fontWeight={600}
                    className="pointer-events-none"
                  >
                    -{s.dropOff}%
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* Hover detail */}
      {hoveredIdx !== null && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: slices[hoveredIdx].step.color }} />
              <span className="font-semibold text-slate-700">{slices[hoveredIdx].step.label}</span>
            </div>
            <span className="tabular-nums font-bold text-slate-900">
              {slices[hoveredIdx].step.value.toLocaleString("pt-BR")}
            </span>
            <span className={cn(
              "font-semibold tabular-nums",
              slices[hoveredIdx].isPositive ? "text-emerald-500" : "text-red-500"
            )}>
              {slices[hoveredIdx].change >= 0 ? "+" : ""}{slices[hoveredIdx].change.toFixed(1)}% vs anterior
            </span>
            {slices[hoveredIdx].dropOff && (
              <span className="text-slate-400">
                drop-off: <span className="font-bold text-red-500">{slices[hoveredIdx].dropOff}%</span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
