"use client";

import { getAggregatedFunnel, type FunnelStep } from "@/lib/windsor";
import { Html, OrbitControls } from "@react-three/drei";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { useCallback, useMemo, useState } from "react";
import * as THREE from "three";

// Use sqrt scaling so smaller slices remain visible
function scaleRadius(value: number, maxValue: number): number {
  const minRadius = 0.35;
  const maxRadius = 2;
  const normalized = Math.sqrt(value / maxValue);
  return minRadius + normalized * (maxRadius - minRadius);
}

interface FunnelSliceProps {
  step: FunnelStep;
  nextStep: FunnelStep | null;
  index: number;
  totalSteps: number;
  maxValue: number;
  onHover: (step: FunnelStep | null, nextStep: FunnelStep | null, position: [number, number, number]) => void;
}

function FunnelSlice({ step, nextStep, index, totalSteps, maxValue, onHover }: FunnelSliceProps) {
  const [hovered, setHovered] = useState(false);

  const { geometry, position } = useMemo(() => {
    const sliceHeight = 0.55;
    const gap = 0.03;
    const topRadius = scaleRadius(step.value, maxValue);
    const bottomRadius = nextStep
      ? scaleRadius(nextStep.value, maxValue)
      : topRadius * 0.7;
    const y = ((totalSteps - 1) / 2 - index) * (sliceHeight + gap);

    const geo = new THREE.CylinderGeometry(bottomRadius, topRadius, sliceHeight, 64);
    return { geometry: geo, position: [0, y, 0] as [number, number, number] };
  }, [step, nextStep, index, totalSteps, maxValue]);

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(true);
      onHover(step, nextStep, [position[0] + 2.5, position[1], position[2]]);
    },
    [step, nextStep, position, onHover]
  );

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    onHover(null, null, [0, 0, 0]);
  }, [onHover]);

  return (
    <mesh
      geometry={geometry}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <meshStandardMaterial
        color={step.color}
        transparent
        opacity={hovered ? 1 : 0.88}
        emissive={hovered ? step.color : "#000000"}
        emissiveIntensity={hovered ? 0.25 : 0}
      />
    </mesh>
  );
}

interface TooltipData {
  step: FunnelStep;
  nextStep: FunnelStep | null;
  position: [number, number, number];
}

function Tooltip({ data }: { data: TooltipData }) {
  const conversionRate = data.nextStep
    ? ((data.nextStep.value / data.step.value) * 100).toFixed(1)
    : null;
  const dropOff = data.nextStep
    ? (((data.step.value - data.nextStep.value) / data.step.value) * 100).toFixed(1)
    : null;
  const prevChange = (
    ((data.step.value - data.step.previousValue) / data.step.previousValue) * 100
  ).toFixed(1);
  const isPositive = data.step.value >= data.step.previousValue;

  return (
    <Html position={data.position} center>
      <div className="pointer-events-none w-48 rounded-xl border border-slate-100 bg-white/95 p-3 shadow-lg backdrop-blur-sm">
        <p className="text-xs font-bold text-slate-800">{data.step.label}</p>
        <p className="mt-0.5 text-base font-bold text-slate-900">
          {data.step.value.toLocaleString("pt-BR")}
        </p>
        <p className={`text-[10px] font-semibold ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
          {isPositive ? "+" : ""}{prevChange}% vs anterior
        </p>
        {conversionRate && (
          <div className="mt-1.5 border-t border-slate-100 pt-1.5 space-y-0.5">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">Conversão</span>
              <span className="font-bold text-indigo-600">{conversionRate}%</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">Drop-off</span>
              <span className="font-bold text-red-500">{dropOff}%</span>
            </div>
          </div>
        )}
      </div>
    </Html>
  );
}

export function Funnel3D() {
  const funnelData = getAggregatedFunnel();
  const maxValue = funnelData[0].value;
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const handleHover = useCallback(
    (step: FunnelStep | null, nextStep: FunnelStep | null, position: [number, number, number]) => {
      setTooltip(step ? { step, nextStep, position } : null);
    },
    []
  );

  return (
    <div className="h-full w-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [3.5, 1, 3.5], fov: 40 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <directionalLight position={[-3, 3, -3]} intensity={0.3} />
        <group>
          {funnelData.map((step, i) => (
            <FunnelSlice
              key={step.key}
              step={step}
              nextStep={i < funnelData.length - 1 ? funnelData[i + 1] : null}
              index={i}
              totalSteps={funnelData.length}
              maxValue={maxValue}
              onHover={handleHover}
            />
          ))}
          {tooltip && <Tooltip data={tooltip} />}
        </group>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.2}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  );
}
