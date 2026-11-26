import React, { useState, useEffect } from 'react';
import { JetBotComponent } from '../types/jetbot';
import {
  X,
  Cpu,
  Camera,
  Gauge,
  Zap,
  Disc,
  BatteryCharging,
  Fan,
  GitFork,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
} from 'lucide-react';

interface ComponentDetailModalProps {
  component: JetBotComponent | null;
  onClose: () => void;
  onSelectComponent: (comp: JetBotComponent) => void;
  allComponents: JetBotComponent[];
}

export const ComponentDetailModal: React.FC<ComponentDetailModalProps> = ({
  component,
  onClose,
  onSelectComponent,
  allComponents,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'photo' | 'specs'>('photo');

  // Reset photo index when component changes
  useEffect(() => {
    setActivePhotoIdx(0);
    setIsLightboxOpen(false);
  }, [component?.id]);

  if (!component) return null;

  const photos = component.galleryPhotos && component.galleryPhotos.length > 0
    ? component.galleryPhotos
    : [
        {
          url: component.primaryPhotoUrl,
          caption: component.primaryPhotoCaption,
          tag: 'Ảnh chính',
        },
      ];

  const currentPhoto = photos[activePhotoIdx] || photos[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Camera': return <Camera className="w-5 h-5" />;
      case 'Gauge': return <Gauge className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      case 'Disc': return <Disc className="w-5 h-5" />;
      case 'BatteryCharging': return <BatteryCharging className="w-5 h-5" />;
      case 'Fan': return <Fan className="w-5 h-5" />;
      case 'GitFork': return <GitFork className="w-5 h-5" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx(prev => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx(prev => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-950/80">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="p-2.5 rounded-xl flex items-center justify-center text-white shadow-md shrink-0"
                style={{ backgroundColor: component.color }}
              >
                {getIcon(component.iconName)}
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block truncate">
                  {component.technicalTerm}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-100 leading-tight truncate">
                  {component.nameVi}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
                aria-label="Đóng cửa sổ"
                title="Đóng (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub Navigation Bar inside Modal */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-2 border-b border-slate-800/80 bg-slate-900/90 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('photo')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition ${
                  activeTab === 'photo'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ảnh thực tế & Giới thiệu</span>
              </button>

              <button
                onClick={() => setActiveTab('specs')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition ${
                  activeTab === 'specs'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Info className="w-3.5 h-3.5 text-sky-400" />
                <span>Thông số kỹ thuật</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Linh kiện {allComponents.findIndex(c => c.id === component.id) + 1} / {allComponents.length}
            </span>
          </div>

          {/* Modal Scrollable Content */}
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
            
            {/* 1. REAL PHOTOGRAPH SHOWCASE SECTION */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  Ảnh thực tế từ bộ kit JetBot ROS
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Góc {activePhotoIdx + 1} / {photos.length}
                </span>
              </div>

              {/* Main Photo Card Container */}
              <div className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-inner">
                {/* Image */}
                <div
                  className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-950 flex items-center justify-center cursor-pointer overflow-hidden"
                  onClick={() => setIsLightboxOpen(true)}
                  title="Nhấp để phóng to toàn màn hình"
                >
                  <img
                    src={currentPhoto.url}
                    alt={component.nameVi}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="eager"
                  />

                  {/* Gradient bottom overlay for caption */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                  {/* Zoom button on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLightboxOpen(true);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm border border-white/20 transition shadow-lg opacity-80 group-hover:opacity-100"
                    title="Phóng to ảnh"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  {/* Tag badge on top left */}
                  {currentPhoto.tag && (
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/50 text-[10px] font-bold text-emerald-300 backdrop-blur-sm uppercase tracking-wider">
                      {currentPhoto.tag}
                    </div>
                  )}

                  {/* Next / Prev buttons on image hover if multiple photos */}
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevPhoto}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-emerald-600 text-white backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
                        title="Ảnh trước"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNextPhoto}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-emerald-600 text-white backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
                        title="Ảnh kế tiếp"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Caption below image */}
                <div className="p-3 bg-slate-950/90 border-t border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <Camera className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="leading-snug text-slate-200 font-medium">
                    {currentPhoto.caption}
                  </p>
                </div>
              </div>

              {/* Photo Thumbnail Strip if multiple photos */}
              {photos.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
                  {photos.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border transition-all ${
                        activePhotoIdx === idx
                          ? 'border-emerald-400 ring-2 ring-emerald-500/50 scale-105'
                          : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                      }`}
                    >
                      <img
                        src={p.url}
                        alt={`Ảnh góc ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-white text-center font-mono py-0.5 truncate px-0.5">
                        {p.tag || `Góc ${idx + 1}`}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. MAIN INTRO CARD (Required by prompt) */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 shadow-sm">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Giới thiệu ngắn (Chức năng cốt lõi)</span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
                {component.shortDesc}
              </p>
            </div>

            {/* TAB CONTENT: SPECS VS DETAILED INFO */}
            {activeTab === 'specs' && component.specs && (
              <div className="space-y-2 animate-in fade-in duration-150">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-sky-400" />
                  Thông số phần cứng chi tiết
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {component.specs.map((spec, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex flex-col justify-between"
                    >
                      <span className="text-slate-400 text-[11px] font-mono">{spec.label}</span>
                      <span className="text-slate-200 font-semibold mt-0.5">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. DETAILED EXPLANATION FOR STUDENTS */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Mô tả chi tiết kỹ thuật
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                {component.fullDesc}
              </p>
            </div>

            {/* 4. QUICK SPECS GRID (Location & Connection) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-0.5 font-mono">
                  Vị trí lắp đặt trên robot:
                </span>
                <span className="text-xs font-medium text-slate-200">
                  {component.locationVi}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-0.5 font-mono">
                  Kiểu cổng & Dây kết nối:
                </span>
                <span className="text-xs font-medium text-slate-200">
                  {component.connectionVi}
                </span>
              </div>
            </div>

            {/* 5. STEM SAFETY & STUDENT PRACTICAL NOTE */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-950/30 border border-sky-800/40 text-xs text-sky-200">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-sky-300">Lưu ý thực hành cho học sinh: </span>
                Khi tháo lắp hoặc kiểm tra bo mạch và cáp camera CSI, luôn tắt công tắc nguồn trên bo mạch mở rộng và rút giắc pin để tránh tĩnh điện làm hư hỏng vi xử lý GPU.
              </div>
            </div>

          </div>

          {/* Footer: 8 Component Navigation Strip */}
          <div className="px-5 sm:px-6 py-3 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <span className="font-medium text-slate-300">Chọn linh kiện xem ảnh thật:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              {allComponents.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => onSelectComponent(c)}
                  title={`${i + 1}. ${c.nameVi}`}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold transition text-xs ${
                    c.id === component.id
                      ? 'ring-2 ring-emerald-400 text-white scale-110 shadow-lg'
                      : 'opacity-50 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.color }}
                >
                  <span className="text-[11px] text-white">
                    {i + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-md"
              title="Đóng phóng to"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          <div
            className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentPhoto.url}
              alt={component.nameVi}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-white/10"
            />
            <div className="mt-3 px-4 py-2 rounded-lg bg-slate-900/90 border border-slate-700/80 text-center max-w-xl">
              <p className="text-sm font-semibold text-white">
                {component.nameVi} - {currentPhoto.tag || 'Ảnh chụp thực tế'}
              </p>
              <p className="text-xs text-slate-300 mt-0.5 font-light">
                {currentPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
