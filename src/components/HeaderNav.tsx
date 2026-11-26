import { StudioLightingMode, ViewMode } from '../types/jetbot';
import { Bot, FileText, Image as ImageIcon, Sliders, Sun, Moon } from 'lucide-react';

interface HeaderNavProps {
  viewMode: ViewMode['type'];
  onViewModeChange: (mode: ViewMode['type']) => void;
  onOpenSimulations: () => void;
  onOpenPhotoModal: () => void;
  studioMode?: StudioLightingMode;
  onToggleStudioMode?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  viewMode,
  onViewModeChange,
  onOpenSimulations,
  onOpenPhotoModal,
  studioMode = 'dark',
  onToggleStudioMode,
}) => {
  return (
    <header className="relative z-30 w-full px-4 sm:px-6 py-3 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md flex items-center justify-between gap-4">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-950/50">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight leading-none">
              Robot JetBot NVIDIA Jetson Nano
            </h1>
            <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300">
              STEM Robotics
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
            Mô hình 3D kỹ thuật & Infographic dành cho học sinh
          </p>
        </div>
      </div>

      {/* Mode Selector & Quick Tools */}
      <div className="flex items-center gap-2">
        {/* Toggle between 3D Viewer & Infographic Poster View */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => onViewModeChange('3d-interactive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              viewMode === '3d-interactive'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Khám Phá 3D</span>
            <span className="sm:hidden">3D</span>
          </button>
          <button
            onClick={() => onViewModeChange('infographic-poster')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              viewMode === 'infographic-poster'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bản Infographic</span>
            <span className="sm:hidden">Poster</span>
          </button>
        </div>

        {/* Quick Simulations button */}
        <button
          onClick={onOpenSimulations}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs text-sky-300 transition"
          title="Mở 6 chức năng thực nghiệm"
        >
          <Sliders className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden md:inline">6 Chức Năng</span>
        </button>

        {/* Studio lighting mode quick toggle */}
        {onToggleStudioMode && (
          <button
            onClick={onToggleStudioMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
              studioMode === 'lab'
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700/80 text-slate-300'
            }`}
            title="Chuyển chế độ phòng Lab sáng (chuẩn ảnh thực tế) / Studio tối"
          >
            {studioMode === 'lab' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Phòng Lab</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden md:inline">Studio Tối</span>
              </>
            )}
          </button>
        )}

        {/* Real kit reference photo preview */}
        <button
          onClick={onOpenPhotoModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 transition"
          title="Đối chiếu với ảnh mẫu JetBot"
        >
          <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline">Ảnh Thực Tế</span>
        </button>
      </div>
    </header>
  );
};
