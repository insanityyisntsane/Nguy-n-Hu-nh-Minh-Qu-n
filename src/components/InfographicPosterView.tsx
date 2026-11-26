import React, { useState } from 'react';
import { JETBOT_COMPONENTS, JETBOT_FUNCTIONS, SCHOOL_PROJECT_META } from '../data/jetbotData';
import { JetBotComponent, JetBotFunction } from '../types/jetbot';
import { RealPhotoGalleryModal } from './RealPhotoGalleryModal';
import {
  Printer,
  X,
  Maximize2,
  ExternalLink,
  Cpu,
  Camera,
  Gauge,
  Zap,
  Disc,
  BatteryCharging,
  Fan,
  GitFork,
  ScanEye,
  ShieldAlert,
  Navigation,
  Gamepad2,
  Activity,
  CodeXml,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface InfographicPosterViewProps {
  onBackTo3D: () => void;
  onSelectComponent: (comp: JetBotComponent) => void;
  onSelectFunction: (func: JetBotFunction) => void;
}

export const InfographicPosterView: React.FC<InfographicPosterViewProps> = ({
  onBackTo3D,
  onSelectComponent,
  onSelectFunction,
}) => {
  const [showPhotoCompare, setShowPhotoCompare] = useState<boolean>(false);
  const [highlightedCompId, setHighlightedCompId] = useState<string | null>(null);

  const getComponentIcon = (name: string) => {
    switch (name) {
      case 'Cpu': return <Cpu className="w-4 h-4" />;
      case 'Camera': return <Camera className="w-4 h-4" />;
      case 'Gauge': return <Gauge className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'Disc': return <Disc className="w-4 h-4" />;
      case 'BatteryCharging': return <BatteryCharging className="w-4 h-4" />;
      case 'Fan': return <Fan className="w-4 h-4" />;
      case 'GitFork': return <GitFork className="w-4 h-4" />;
      default: return <Cpu className="w-4 h-4" />;
    }
  };

  const getFunctionIcon = (name: string) => {
    switch (name) {
      case 'ScanEye': return <ScanEye className="w-5 h-5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5" />;
      case 'Navigation': return <Navigation className="w-5 h-5" />;
      case 'Gamepad2': return <Gamepad2 className="w-5 h-5" />;
      case 'Activity': return <Activity className="w-5 h-5" />;
      case 'CodeXml': return <CodeXml className="w-5 h-5" />;
      default: return <ScanEye className="w-5 h-5" />;
    }
  };

  // 4 components on the left, 4 components on the right for balanced infographic poster
  const leftComponents = [
    JETBOT_COMPONENTS[0], // Bo mạch NVIDIA Jetson Nano
    JETBOT_COMPONENTS[6], // Quạt tản nhiệt hoặc bộ tản nhiệt
    JETBOT_COMPONENTS[3], // Mạch điều khiển động cơ
    JETBOT_COMPONENTS[5], // Nguồn điện hoặc pin
  ];

  const rightComponents = [
    JETBOT_COMPONENTS[1], // Camera
    JETBOT_COMPONENTS[7], // Dây kết nối và cổng giao tiếp
    JETBOT_COMPONENTS[4], // Bánh xe và khung xe
    JETBOT_COMPONENTS[2], // Động cơ DC giảm tốc
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative min-h-screen w-full bg-[#070b14] text-slate-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 print:p-0 print:bg-white print:text-black">
      
      {/* Action Bar (Top Floating on Web, Hidden on Print) */}
      <div className="w-full max-w-7xl flex items-center justify-between gap-4 mb-6 print:hidden">
        <button
          onClick={onBackTo3D}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition"
        >
          <span>◄ Quay lại chế độ 3D tương tác</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPhotoCompare(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 transition"
          >
            <span>Ảnh bộ kit thực tế</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-950/40 transition"
          >
            <Printer className="w-4 h-4" />
            <span>In Poster / Lưu PDF</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          POSTER CANVAS CONTAINER (Designed for standard A3 / A4 / Presentation)
         ========================================================================= */}
      <div className="w-full max-w-7xl bg-[#0b0f19] border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 relative overflow-hidden print:border-none print:shadow-none print:p-2 print:bg-white print:text-black">
        
        {/* Subtle Background Blueprint Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none print:hidden" />

        {/* 1. POSTER HEADER */}
        <header className="relative text-center border-b border-slate-800 pb-6 mb-8 print:border-black print:pb-4 print:mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-3 print:border-black print:text-black">
            <Sparkles className="w-3.5 h-3.5" />
            {SCHOOL_PROJECT_META.schoolLevel}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white uppercase print:text-black">
            {SCHOOL_PROJECT_META.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl mx-auto font-medium print:text-slate-700">
            {SCHOOL_PROJECT_META.subtitle}
          </p>
        </header>

        {/* 2. MAIN SECTION: 3D ROBOT IN CENTER + 8 LINH KIỆN WITH CALLOUT LINES */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-12 print:mb-6">
          
          {/* Left Column: 4 Components */}
          <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">
            {leftComponents.map((comp, idx) => {
              const isHovered = highlightedCompId === comp.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => onSelectComponent(comp)}
                  onMouseEnter={() => setHighlightedCompId(comp.id)}
                  onMouseLeave={() => setHighlightedCompId(null)}
                  className={`group relative p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer print:border-slate-300 print:bg-slate-50 ${
                    isHovered
                      ? 'bg-slate-800/90 border-emerald-400 shadow-lg shadow-emerald-950/30 -translate-x-1'
                      : 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-700/80 bg-black/60 shadow-sm relative">
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
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs font-mono text-emerald-400 font-bold uppercase print:text-emerald-700">
                          0{idx + 1}
                        </span>
                        <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition-colors truncate print:text-black">
                          {comp.nameVi}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-300 leading-snug font-normal line-clamp-2 print:text-slate-800">
                        {comp.shortDesc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center Column: Big 3D JetBot Cutaway Illustration */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center order-1 lg:order-2 py-4">
            
            {/* Visual Technical Framing Box */}
            <div className="relative w-full aspect-square max-w-[480px] flex items-center justify-center p-2 rounded-3xl bg-radial from-slate-900/60 to-slate-950/90 border border-slate-800 shadow-inner overflow-hidden">
              
              {/* Technical Target Reticle Graphic */}
              <div className="absolute inset-8 rounded-full border border-dashed border-emerald-500/20 pointer-events-none" />
              <div className="absolute inset-20 rounded-full border border-sky-500/20 pointer-events-none" />
              
              {/* High-detail Technical JetBot Center Visual */}
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src="/assets/aistudio/1793236899794_5870436072623479520_g1886750943568300472_cc585515e117871d8bc4a018f138415d_b185bff4.jpg"
                  alt="JetBot ROS AI Kit Thực Tế"
                  className="max-h-full max-w-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] filter brightness-105 contrast-105"
                />
              </div>

              {/* Center Callout Overlay Indicator Pins */}
              <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-1 rounded border border-slate-800">
                GÓC NHÌN 3/4 CHI TIẾT
              </div>

              <div className="absolute bottom-4 right-4 text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-2 py-1 rounded border border-emerald-900/60">
                8 LINH KIỆN KỸ THUẬT
              </div>
            </div>

            {/* Hint under center visual */}
            <p className="text-xs text-slate-400 mt-3 text-center print:hidden">
              Nhấp vào bất kỳ linh kiện nào để mở bảng chi tiết thông số
            </p>
          </div>

          {/* Right Column: 4 Components */}
          <div className="lg:col-span-3 space-y-4 order-3">
            {rightComponents.map((comp, idx) => {
              const isHovered = highlightedCompId === comp.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => onSelectComponent(comp)}
                  onMouseEnter={() => setHighlightedCompId(comp.id)}
                  onMouseLeave={() => setHighlightedCompId(null)}
                  className={`group relative p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer print:border-slate-300 print:bg-slate-50 ${
                    isHovered
                      ? 'bg-slate-800/90 border-emerald-400 shadow-lg shadow-emerald-950/30 translate-x-1'
                      : 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-700/80 bg-black/60 shadow-sm relative">
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
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs font-mono text-emerald-400 font-bold uppercase print:text-emerald-700">
                          0{idx + 5}
                        </span>
                        <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition-colors truncate print:text-black">
                          {comp.nameVi}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-300 leading-snug font-normal line-clamp-2 print:text-slate-800">
                        {comp.shortDesc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* 3. BOTTOM SECTION: 6 CHỨC NĂNG CƠ BẢN KÈM HÌNH MINH HỌA */}
        <div className="relative pt-6 border-t border-slate-800 print:border-black print:pt-4">
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-mono text-sky-400 font-semibold tracking-wider uppercase block print:text-sky-700">
                KHẢ NĂNG ỨNG DỤNG THỰC TẾ
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white print:text-black">
                6 Chức Năng Cơ Bản Của Robot JetBot
              </h2>
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline print:hidden">
              Nhấp chức năng để xem mô phỏng hoạt động
            </span>
          </div>

          {/* 6 Functions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {JETBOT_FUNCTIONS.map((func) => (
              <div
                key={func.id}
                onClick={() => onSelectFunction(func)}
                className="group relative p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/60 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between print:border-slate-300 print:bg-slate-50"
              >
                <div>
                  {/* Card Header: Icon & Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105"
                      style={{ backgroundColor: func.color }}
                    >
                      {getFunctionIcon(func.iconName)}
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 print:border-slate-400 print:text-black">
                      {func.badgeVi}
                    </span>
                  </div>

                  {/* Function Title */}
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-sky-300 transition-colors mb-1.5 print:text-black">
                    {func.number}. {func.nameVi}
                  </h3>

                  {/* Function Short Description (Mandatory prompt text) */}
                  <p className="text-xs text-slate-300 leading-relaxed font-normal print:text-slate-800">
                    {func.descVi}
                  </p>
                </div>

                {/* Educational context note */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 print:text-slate-600">
                  <span className="truncate max-w-[200px]">{func.schoolContextVi}</span>
                  <span className="text-sky-400 group-hover:translate-x-0.5 transition-transform font-bold print:hidden">
                    ►
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* 4. POSTER FOOTER / METADATA */}
        <footer className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 print:border-slate-400 print:text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Nội dung chuẩn học đường Việt Nam • Thiết kế kỹ thuật rõ ràng</span>
          </div>
          <div className="font-mono text-[11px]">
            {SCHOOL_PROJECT_META.frameworks}
          </div>
        </footer>

      </div>

      {/* Modal for comparing with Real Kit Image */}
      {showPhotoCompare && (
        <RealPhotoGalleryModal onClose={() => setShowPhotoCompare(false)} />
      )}

    </div>
  );
};
