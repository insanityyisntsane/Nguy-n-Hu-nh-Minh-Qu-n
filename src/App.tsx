import React, { useState, useCallback, useEffect } from 'react';
import { JetBot3DViewer } from './components/JetBot3DViewer';
import { BottomControlDock } from './components/BottomControlDock';
import { HeaderNav } from './components/HeaderNav';
import { ComponentDetailModal } from './components/ComponentDetailModal';
import { FunctionSimulationsModal } from './components/FunctionSimulationsModal';
import { InfographicPosterView } from './components/InfographicPosterView';
import { RealPhotoGalleryModal } from './components/RealPhotoGalleryModal';
import { JETBOT_COMPONENTS, JETBOT_FUNCTIONS } from './data/jetbotData';
import { JetBotComponent, JetBotFunction, CameraPreset, ViewMode, StudioLightingMode } from './types/jetbot';
import {
  Layers,
  Info,
  X,
  Sparkles,
  Bot,
  Sliders,
  ChevronRight,
  Eye,
  Camera as CameraIcon,
} from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode['type']>('3d-interactive');
  const [studioMode, setStudioMode] = useState<StudioLightingMode>('dark');
  const [explodedAmount, setExplodedAmount] = useState<number>(0.2); // slight exploded by default to show layers
  const [selectedComponent, setSelectedComponent] = useState<JetBotComponent | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<JetBotFunction | null>(null);
  const [showFunctionModal, setShowFunctionModal] = useState<boolean>(false);
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('isometric');
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [isDriving, setIsDriving] = useState<boolean>(false);
  const [driveSpeed, setDriveSpeed] = useState<number>(1.0);
  const [driveSteer, setDriveSteer] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === ' ' || e.code === 'Space') {
        // Reset camera
        setCameraPreset('isometric');
      } else if (e.key.toLowerCase() === 'e') {
        // Toggle exploded
        setExplodedAmount(prev => (prev > 0.4 ? 0 : 0.8));
      } else if (e.key.toLowerCase() === 'h') {
        // Toggle annotations (H key)
        setShowAnnotations(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectComponent = useCallback((comp: JetBotComponent | null) => {
    setSelectedComponent(comp);
  }, []);

  const handleSelectFunction = useCallback((func: JetBotFunction) => {
    setSelectedFunction(func);
    setShowFunctionModal(true);
  }, []);

  const handleDriveChange = useCallback((speed: number, steer: number) => {
    setDriveSpeed(speed);
    setDriveSteer(steer);
  }, []);

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden flex flex-col select-none transition-colors duration-300 ${
        studioMode === 'lab' ? 'bg-slate-100 text-slate-800' : 'bg-[#0b0f19] text-slate-100'
      }`}
    >
      
      {/* Top Navigation */}
      <HeaderNav
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenSimulations={() => setShowFunctionModal(true)}
        onOpenPhotoModal={() => setShowPhotoModal(true)}
        studioMode={studioMode}
        onToggleStudioMode={() => setStudioMode(prev => (prev === 'dark' ? 'lab' : 'dark'))}
      />

      {/* Main View Area */}
      <main className="relative flex-1 w-full h-[calc(100vh-57px)] overflow-hidden">
        {viewMode === '3d-interactive' ? (
          <>
            {/* 3D WebGL Scene */}
            <JetBot3DViewer
              explodedAmount={explodedAmount}
              selectedComponentId={selectedComponent ? selectedComponent.id : null}
              onSelectComponent={handleSelectComponent}
              cameraPreset={cameraPreset}
              isDriving={isDriving}
              driveSpeed={driveSpeed}
              driveSteer={driveSteer}
              showAnnotations={showAnnotations}
              wireframeMode={false}
              studioMode={studioMode}
            />

            {/* Quick Component Inspection Button (Top Right Floating) */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xl backdrop-blur-md transition ${
                  studioMode === 'lab'
                    ? 'bg-white/90 border border-slate-300 hover:bg-slate-50 text-slate-800'
                    : 'bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 text-slate-200'
                }`}
              >
                <Layers className="w-4 h-4 text-emerald-500" />
                <span>Danh mục 8 linh kiện</span>
              </button>
            </div>

            {/* Slide-out Component Quick Drawer (Right Side) */}
            {isSidebarOpen && (
              <div
                className={`absolute top-16 right-4 z-30 w-80 max-h-[calc(100vh-190px)] border rounded-2xl shadow-2xl backdrop-blur-xl p-4 overflow-y-auto animate-in slide-in-from-right-4 duration-200 flex flex-col ${
                  studioMode === 'lab'
                    ? 'bg-white/95 border-slate-300 text-slate-800'
                    : 'bg-slate-900/95 border-slate-700/80 text-slate-100'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    8 Linh kiện cốt lõi
                  </span>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {JETBOT_COMPONENTS.map((comp, idx) => (
                    <button
                      key={comp.id}
                      onClick={() => {
                        handleSelectComponent(comp);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition flex items-center gap-3 group ${
                        studioMode === 'lab'
                          ? 'bg-slate-50 hover:bg-white border-slate-200 hover:border-slate-400'
                          : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Real Photo Thumbnail */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-700/70 bg-black/40 shadow-sm relative">
                        <img
                          src={comp.primaryPhotoUrl}
                          alt={comp.nameVi}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          loading="lazy"
                        />
                        <span
                          className="absolute bottom-1 right-1 w-2 h-2 rounded-full ring-1 ring-black"
                          style={{ backgroundColor: comp.color }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-xs font-bold group-hover:text-emerald-500 truncate ${
                            studioMode === 'lab' ? 'text-slate-800' : 'text-slate-200'
                          }`}
                        >
                          {idx + 1}. {comp.nameVi}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                          {comp.shortDesc}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Consolidated Sleek Bottom Control Dock (Exploded View, Camera Presets, Motion) */}
            <BottomControlDock
              explodedAmount={explodedAmount}
              onExplodedChange={setExplodedAmount}
              cameraPreset={cameraPreset}
              onCameraPresetChange={setCameraPreset}
              showAnnotations={showAnnotations}
              onToggleAnnotations={() => setShowAnnotations(!showAnnotations)}
              isDriving={isDriving}
              onToggleDriving={() => setIsDriving(!isDriving)}
              driveSpeed={driveSpeed}
              driveSteer={driveSteer}
              onDriveChange={handleDriveChange}
              onOpenSimulations={() => setShowFunctionModal(true)}
              onSwitchToPoster={() => setViewMode('infographic-poster')}
              studioMode={studioMode}
              onToggleStudioMode={() => setStudioMode(prev => (prev === 'dark' ? 'lab' : 'dark'))}
            />
          </>
        ) : (
          /* Full Infographic Poster View */
          <div className="w-full h-full overflow-y-auto">
            <InfographicPosterView
              onBackTo3D={() => setViewMode('3d-interactive')}
              onSelectComponent={handleSelectComponent}
              onSelectFunction={handleSelectFunction}
            />
          </div>
        )}
      </main>

      {/* Component Detail Modal */}
      <ComponentDetailModal
        component={selectedComponent}
        onClose={() => setSelectedComponent(null)}
        onSelectComponent={handleSelectComponent}
        allComponents={JETBOT_COMPONENTS}
      />

      {/* 6 Functions Simulations & Practical STEM Modal */}
      {showFunctionModal && (
        <FunctionSimulationsModal
          initialFunction={selectedFunction}
          onClose={() => {
            setShowFunctionModal(false);
            setSelectedFunction(null);
          }}
        />
      )}

      {/* Real Kit Photo Comparison Modal / Gallery */}
      {showPhotoModal && (
        <RealPhotoGalleryModal onClose={() => setShowPhotoModal(false)} />
      )}

    </div>
  );
}
