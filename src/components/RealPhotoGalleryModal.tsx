import React, { useState } from 'react';
import { REAL_PHOTOS_GALLERY } from '../data/jetbotData';
import { X, ChevronLeft, ChevronRight, Info, Eye } from 'lucide-react';

interface RealPhotoGalleryModalProps {
  onClose: () => void;
}

export const RealPhotoGalleryModal: React.FC<RealPhotoGalleryModalProps> = ({ onClose }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentPhoto = REAL_PHOTOS_GALLERY[currentIndex];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? REAL_PHOTOS_GALLERY.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === REAL_PHOTOS_GALLERY.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Bộ Sưu Tập Ảnh Chi Tiết Robot JetBot Thực Tế
              </h3>
              <p className="text-xs text-slate-400">
                Đối chiếu các góc chụp linh kiện thực tế với mô hình 3D tương tác
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Photo Viewer Area */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[320px] max-h-[55vh] overflow-hidden select-none">
          <img
            src={currentPhoto.url}
            alt={currentPhoto.title}
            className="max-h-full max-w-full object-contain p-2"
          />

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-800 text-white border border-slate-700/80 shadow-lg backdrop-blur-sm transition"
            aria-label="Ảnh trước"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-800 text-white border border-slate-700/80 shadow-lg backdrop-blur-sm transition"
            aria-label="Ảnh kế tiếp"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Counter pill */}
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-xs font-mono text-emerald-400">
            {currentIndex + 1} / {REAL_PHOTOS_GALLERY.length}
          </div>
        </div>

        {/* Current Photo Information */}
        <div className="px-6 py-3.5 bg-slate-950/90 border-t border-slate-800">
          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-400 shrink-0" />
            {currentPhoto.title}
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {currentPhoto.desc}
          </p>
        </div>

        {/* Thumbnail Strip */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
          {REAL_PHOTOS_GALLERY.map((item, idx) => (
            <button
              key={item.url}
              onClick={() => setCurrentIndex(idx)}
              className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition ${
                idx === currentIndex
                  ? 'border-emerald-500 scale-105 shadow-md shadow-emerald-950'
                  : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
              }`}
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
