"use client";

import { getAggregatedFunnel, type FunnelStep } from "@/lib/windsor";
import { Html, OrbitControls } from "@react-three/drei";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { useCallback, useMemo, useState } from "react";
import * as THREE from "three";

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
    const sliceHeight = 0.7;
    const gap = 0.08;
    const topRadius = (step.value / maxValue) * 2;
    const bottomRadius = nextStep ? (nextStep.value / maxValue) * 2 : topRadius * 0.6;
    // Top of funnel (index 0) = highest Y, bottom (last index) = lowest Y
    const y = ((totalSteps - 1) / 2 - index) * (sliceHeight + gap);

    const segments = 64;
    const geo = new THREE.CylinderGeometry(bottomRadius, topRadius, sliceHeight, segments);
    return { geometry: geo, position: [0, y, 0] as [number, number, number] };
  }, [step, nextStep, index, totalSteps, maxValue]);

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(true);
      onHover(step, nextStep, [position[0] + 2.8, position[1], position[2]]);
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
        opacity={hovered ? 1 : 0.85}
        emissive={hovered ? step.color : "#000000"}
        emissiveIntensity={hovered ? 0.3 : 0}
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
      <div className="pointer-events-none w-52 rounded-lg border border-slate-200 bg-white p-3 shadow-xl">
        <p className="text-sm font-semibold text-slate-800">{data.step.label}</p>
        <p className="mt-1 text-lg font-bold text-slate-900">
          {data.step.value.toLocaleString("pt-BR")}
        </p>
        <p className={`text-xs font-medium ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
          {isPositive ? "+" : ""}{prevChange}% vs anterior
        </p>
        {conversionRate && (
          <div className="mt-2 border-t border-slate-100 pt-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Conv. p/ {data.nextStep!.label}</span>
              <span className="font-semibold text-indigo-600">{conversionRate}%</span>
            </div>
            <div className="flex justify-between text-xs mt-0.5">
              <span className="text-slate-500">Drop-off</span>
              <span className="font-semibold text-red-500">{dropOff}%</span>
            </div>
          </div>
        )}
        {!data.nextStep && (
          <div className="mt-2 border-t border-slate-100 pt-2">
            <p className="text-xs text-slate-500">Etapa final do funil</p>
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
  const overallRate = ((funnelData[4].value / funnelData[0].value) * 100).toFixed(2);

  const handleHover = useCallback(
    (step: FunnelStep | null, nextStep: FunnelStep | null, position: [number, number, number]) => {
      if (step) {
        setTooltip({ step, nextStep, position });
      } else {
        setTooltip(null);
      }
    },
    []
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Funil 3D</h2>
          <p className="text-xs text-slate-400">Passe o mouse para ver detalhes</p>
        </div>
        <div className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
          {overallRate}% conv.
        </div>
      </div>
      <div className="h-[400px] w-full cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [4, 1.5, 4], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
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
            autoRotateSpeed={1.5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Canvas>
      </div>
      <div className="flex justify-center gap-4 border-t border-slate-100 px-6 py-3">
        {funnelData.map((step) => (
          <div key={step.key} className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: step.color }} />
            <span className="text-xs text-slate-500">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
