import React, { useState } from 'react';
import { CameraPreset, StudioLightingMode } from '../types/jetbot';
import {
  Layers,
  Camera,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Compass,
  RotateCcw,
  Sliders,
  Car,
  FileText,
  Sun,
  Moon,
} from 'lucide-react';

interface BottomControlDockProps {
  explodedAmount: number;
  onExplodedChange: (val: number) => void;
  cameraPreset: CameraPreset;
  onCameraPresetChange: (preset: CameraPreset) => void;
  showAnnotations: boolean;
  onToggleAnnotations: () => void;
  isDriving: boolean;
  onToggleDriving: () => void;
  driveSpeed: number;
  driveSteer: number;
  onDriveChange: (speed: number, steer: number) => void;
  onOpenSimulations: () => void;
  onSwitchToPoster: () => void;
  studioMode?: StudioLightingMode;
  onToggleStudioMode?: () => void;
}

export const BottomControlDock: React.FC<BottomControlDockProps> = ({
  explodedAmount,
  onExplodedChange,
  cameraPreset,
  onCameraPresetChange,
  showAnnotations,
  onToggleAnnotations,
  isDriving,
  onToggleDriving,
  driveSpeed,
  driveSteer,
  onDriveChange,
  onOpenSimulations,
  onSwitchToPoster,
  studioMode = 'dark',
  onToggleStudioMode,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'exploded' | 'camera' | 'drive'>('exploded');

  const presets: { id: CameraPreset; label: string }[] = [
    { id: 'isometric', label: '3/4 Mặc định' },
    { id: 'closeLidar', label: 'Cận cảnh LiDAR A1' },
    { id: 'closeCamera', label: 'Cận cảnh Camera' },
    { id: 'closeJetson', label: 'Cận cảnh Jetson' },
    { id: 'underbody', label: 'Gầm xe & Động cơ' },
    { id: 'front', label: 'Mặt trước' },
    { id: 'side', label: 'Mặt bên' },
    { id: 'top', label: 'Mặt trên' },
  ];

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-30 transition-transform duration-300 w-[96%] max-w-4xl ${
        isCollapsed ? 'translate-y-[calc(100%-36px)]' : 'translate-y-0'
      }`}
    >
      {/* Collapse / Expand Tab Button */}
      <div className="flex justify-center -mb-px">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-t-xl bg-slate-900 border-t border-x border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white shadow-lg backdrop-blur-md transition"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hiện bảng điều khiển 3D</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Thu gọn điều khiển</span>
            </>
          )}
        </button>
      </div>

      {/* Main Glassmorphic Control Dock Panel */}
      <div className="bg-slate-900/95 border border-slate-700/90 rounded-2xl shadow-2xl backdrop-blur-xl p-4 text-slate-200">
        
        {/* Top Control Bar: Tabs & Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          {/* Sub-panel selector tabs */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('exploded')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'exploded'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tách lớp linh kiện</span>
            </button>
            <button
              onClick={() => setActiveTab('camera')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'camera'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Góc nhìn 3D</span>
            </button>
            <button
              onClick={() => setActiveTab('drive')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                activeTab === 'drive'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Chuyển động</span>
            </button>
          </div>

          {/* Quick utility action buttons */}
          <div className="flex items-center gap-2">
            {/* Studio Lighting Toggle (Lab white vs Dark tech) */}
            {onToggleStudioMode && (
              <button
                onClick={onToggleStudioMode}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                  studioMode === 'lab'
                    ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                }`}
                title="Chuyển chế độ phòng Lab (Sáng) / Studio Kỹ thuật (Tối)"
              >
                {studioMode === 'lab' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Phòng Lab</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-sky-400" />
                    <span className="hidden sm:inline">Studio Tối</span>
                  </>
                )}
              </button>
            )}

            {/* Toggle Annotations */}
            <button
              onClick={onToggleAnnotations}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                showAnnotations
                  ? 'bg-slate-800 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Bật/Tắt nhãn chú thích 3D"
            >
              {showAnnotations ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Nhãn 3D</span>
            </button>

            {/* Open 6 Functions Simulation Modal */}
            <button
              onClick={onOpenSimulations}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 text-xs font-semibold shadow-sm transition"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>6 Chức năng</span>
            </button>

            {/* Poster Mode button */}
            <button
              onClick={onSwitchToPoster}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Xem Bản Poster</span>
            </button>
          </div>
        </div>

        {/* Dynamic Tab Body */}
        <div className="pt-3">
          {/* TAB 1: Exploded View Slider */}
          {activeTab === 'exploded' && (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium shrink-0">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Độ phân rã 3D (Exploded View):</span>
                <span className="font-mono text-emerald-400 font-bold w-12 text-right">
                  {Math.round(explodedAmount * 100)}%
                </span>
              </div>

              <div className="flex-1 w-full flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={explodedAmount}
                  onChange={e => onExplodedChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 focus:outline-none"
                />

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onExplodedChange(0)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition ${
                      explodedAmount === 0
                        ? 'bg-slate-700 text-white font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Nguyên vẹn (0%)
                  </button>
                  <button
                    onClick={() => onExplodedChange(0.5)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition ${
                      Math.abs(explodedAmount - 0.5) < 0.05
                        ? 'bg-slate-700 text-white font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    50%
                  </button>
                  <button
                    onClick={() => onExplodedChange(1)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition ${
                      explodedAmount === 1
                        ? 'bg-slate-700 text-white font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Tách rời (100%)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Camera Presets */}
          {activeTab === 'camera' && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-slate-400 shrink-0 mr-1 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-sky-400" />
                Góc quay:
              </span>
              {presets.map(p => (
                <button
                  key={p.id}
                  onClick={() => onCameraPresetChange(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
                    cameraPreset === p.id
                      ? 'bg-sky-950 border-sky-500 text-sky-200 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
              <button
                onClick={() => onCameraPresetChange('isometric')}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition ml-auto"
                title="Khôi phục góc nhìn"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* TAB 3: Drive Motion Test */}
          {activeTab === 'drive' && (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={onToggleDriving}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    isDriving
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>{isDriving ? 'Đang bật tự lăn bánh' : 'Tự động lăn bánh'}</span>
                </button>
                <div className="text-xs text-slate-300 flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-emerald-400">Phím lái xe:</span>
                  <span className="font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    W: Tiến • A: Trái • S: Lùi • D: Phải
                  </span>
                  <span className="font-mono bg-amber-950/70 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 font-semibold">
                    Shift + W/A/S/D: Tăng tốc Turbo x2.2
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>P: Tự lái AI</span>
                <span>•</span>
                <span>R: Về vạch CP1</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
