import React, { useState } from 'react';
import { JetBotFunction } from '../types/jetbot';
import { JETBOT_FUNCTIONS } from '../data/jetbotData';
import {
  X,
  ScanEye,
  ShieldAlert,
  Navigation,
  Gamepad2,
  Activity,
  CodeXml,
  Play,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Sliders,
  ChevronRight,
  Terminal,
} from 'lucide-react';

interface FunctionSimulationsModalProps {
  initialFunction: JetBotFunction | null;
  onClose: () => void;
}

export const FunctionSimulationsModal: React.FC<FunctionSimulationsModalProps> = ({
  initialFunction,
  onClose,
}) => {
  const [selectedFunc, setSelectedFunc] = useState<JetBotFunction>(
    initialFunction || JETBOT_FUNCTIONS[0]
  );

  // States for interactive simulations
  // 1. Object detection
  const [detectedObj, setDetectedObj] = useState<'ball' | 'cup' | 'stopsign'>('ball');
  // 2. Obstacle avoidance
  const [obstacleDistance, setObstacleDistance] = useState<number>(45); // in cm
  // 3. Autonomous navigation
  const [trackSteering, setTrackSteering] = useState<number>(0); // -1.0 to 1.0
  // 4. Remote control
  const [remoteSpeed, setRemoteSpeed] = useState<number>(0);
  const [remoteSteer, setRemoteSteer] = useState<number>(0);
  // 6. Python code runner
  const [codeOutput, setCodeOutput] = useState<string | null>(null);
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false);

  const runSamplePython = () => {
    setIsRunningCode(true);
    setCodeOutput(null);
    setTimeout(() => {
      setIsRunningCode(false);
      setCodeOutput(`[JETBOT SYSTEM] Khởi tạo thư viện JetBot thành công.
[CAMERA] Đã kết nối cảm biến CSI Camera (1280x720 @ 30fps).
[AI ENGINE] Nạp mô hình TensorRT 'ssd_mobilenet_v2.engine' vào GPU Maxwell (128 cores).
[EXECUTION] Bắt đầu chương trình: Robot tiến lên 1.0s với tốc độ 40%...
[STATUS] Hoàn thành bài toán thực thi mẫu.`);
    }, 600);
  };

  const getFunctionIcon = (name: string) => {
    switch (name) {
      case 'ScanEye': return <ScanEye className="w-4 h-4" />;
      case 'ShieldAlert': return <ShieldAlert className="w-4 h-4" />;
      case 'Navigation': return <Navigation className="w-4 h-4" />;
      case 'Gamepad2': return <Gamepad2 className="w-4 h-4" />;
      case 'Activity': return <Activity className="w-4 h-4" />;
      case 'CodeXml': return <CodeXml className="w-4 h-4" />;
      default: return <ScanEye className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl text-white shadow-md flex items-center justify-center"
              style={{ backgroundColor: selectedFunc.color }}
            >
              {getFunctionIcon(selectedFunc.iconName)}
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400">
                Mô phỏng chức năng học đường #{selectedFunc.number}
              </span>
              <h2 className="text-lg font-bold text-white">
                {selectedFunc.nameVi}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Function Switcher Pills */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 border-b border-slate-800 bg-slate-950/40 overflow-x-auto text-xs">
          {JETBOT_FUNCTIONS.map(f => (
            <button
              key={f.id}
              onClick={() => {
                setSelectedFunc(f);
                setCodeOutput(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition font-medium ${
                f.id === selectedFunc.id
                  ? 'bg-slate-800 text-white border border-sky-500/50 shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span>{f.number}. {f.nameVi}</span>
            </button>
          ))}
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* 1. Official Required Prompt Text */}
          <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/30">
            <div className="text-xs font-semibold text-sky-400 uppercase tracking-wide mb-1">
              Khái niệm cốt lõi
            </div>
            <p className="text-base font-semibold text-white leading-relaxed">
              {selectedFunc.descVi}
            </p>
          </div>

          {/* 2. Interactive Hands-on Demonstration Sandbox */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                Mô phỏng tương tác trực tiếp
              </span>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                Thời gian thực
              </span>
            </div>

            {/* SIMULATION 1: Nhận diện hình ảnh */}
            {selectedFunc.id === 'image-recognition' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-slate-300">Chọn vật thể đưa trước camera:</span>
                  <div className="flex gap-2">
                    {[
                      { id: 'ball', label: 'Quả bóng tennis', score: 0.96 },
                      { id: 'stopsign', label: 'Biển báo Stop', score: 0.98 },
                      { id: 'cup', label: 'Cốc nước', score: 0.91 },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => setDetectedObj(item.id as any)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                          detectedObj === item.id
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated Camera Viewfinder with AI Bounding Box */}
                <div className="relative w-full h-56 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
                  <div className="absolute inset-0 bg-radial from-slate-800/40 to-slate-950 pointer-events-none" />
                  
                  {/* Grid lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415510_1px,transparent_1px),linear-gradient(to_bottom,#33415510_1px,transparent_1px)] bg-[size:2rem_2rem]" />

                  {/* Simulated Object in View */}
                  {detectedObj === 'ball' && (
                    <div className="relative border-2 border-emerald-400 bg-emerald-500/10 rounded-lg p-6 flex flex-col items-center animate-in zoom-in-95 duration-200">
                      <div className="absolute -top-6 left-0 bg-emerald-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                        Ball: 96% [x:120, y:85]
                      </div>
                      <div className="w-16 h-16 rounded-full bg-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.5)] border-2 border-white flex items-center justify-center text-slate-950 font-bold text-xs">
                        🎾
                      </div>
                    </div>
                  )}

                  {detectedObj === 'stopsign' && (
                    <div className="relative border-2 border-rose-500 bg-rose-500/10 rounded-lg p-6 flex flex-col items-center animate-in zoom-in-95 duration-200">
                      <div className="absolute -top-6 left-0 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                        Stop Sign: 98% [Hạn chế di chuyển]
                      </div>
                      <div className="w-16 h-16 bg-rose-600 border-2 border-white flex items-center justify-center text-white font-extrabold text-xs shadow-[0_0_20px_rgba(225,29,72,0.5)] [clip-path:polygon(30%_0%,70%_0%,100%_30%,100%_70%,70%_100%,30%_100%,0%_70%,0%_30%)]">
                        STOP
                      </div>
                    </div>
                  )}

                  {detectedObj === 'cup' && (
                    <div className="relative border-2 border-sky-400 bg-sky-500/10 rounded-lg p-6 flex flex-col items-center animate-in zoom-in-95 duration-200">
                      <div className="absolute -top-6 left-0 bg-sky-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                        Cup: 91% [x:205, y:110]
                      </div>
                      <div className="w-14 h-18 bg-sky-200 rounded-b-xl border-2 border-sky-400 flex items-center justify-center text-slate-950 font-bold text-xl">
                        ☕
                      </div>
                    </div>
                  )}

                  {/* Camera overlay watermark */}
                  <div className="absolute bottom-2 left-3 font-mono text-[10px] text-emerald-400">
                    REC [1280x720] • 30 FPS • NVIDIA SSD-MobileNet V2
                  </div>
                </div>
              </div>
            )}

            {/* SIMULATION 2: Tránh vật cản */}
            {selectedFunc.id === 'collision-avoidance' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Khoảng cách chướng ngại vật phía trước:</span>
                  <span className={`text-sm font-bold font-mono px-3 py-1 rounded ${
                    obstacleDistance < 30
                      ? 'bg-rose-950 text-rose-300 border border-rose-500'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                  }`}>
                    {obstacleDistance} cm
                  </span>
                </div>

                <input
                  type="range"
                  min="10"
                  max="100"
                  value={obstacleDistance}
                  onChange={e => setObstacleDistance(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />

                {/* Radar display */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {obstacleDistance < 30 ? (
                      <AlertTriangle className="w-8 h-8 text-rose-400 animate-bounce" />
                    ) : (
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    )}
                    <div>
                      <div className="text-xs font-bold text-white">
                        {obstacleDistance < 30
                          ? 'PHÁT HIỆN VẬT CẢN NGUY HIỂM!'
                          : 'ĐƯỜNG ĐI THÔNG THOÁNG'}
                      </div>
                      <div className="text-xs text-slate-400">
                        {obstacleDistance < 30
                          ? 'Mô hình AI kích hoạt: Giảm tốc và bẻ lái sang trái để né tránh.'
                          : 'Robot tiếp tục tiến thẳng với tốc độ ổn định.'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SIMULATION 3: Di chuyển tự động */}
            {selectedFunc.id === 'autonomous-navigation' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Điều chỉnh độ lệch tâm làn đường (Road Center Offset):</span>
                  <span className="text-xs font-mono font-bold text-sky-400">
                    {trackSteering === 0 ? 'Chính giữa (0.0)' : trackSteering < 0 ? `Lệch trái (${trackSteering})` : `Lệch phải (+${trackSteering})`}
                  </span>
                </div>

                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.1"
                  value={trackSteering}
                  onChange={e => setTrackSteering(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />

                {/* Track visual */}
                <div className="relative w-full h-32 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
                  {/* Road lines */}
                  <div className="absolute inset-y-0 w-48 border-x-4 border-dashed border-yellow-400/80 bg-slate-950/60" />
                  {/* Center line */}
                  <div className="absolute inset-y-0 w-0.5 border-l-2 border-dotted border-white/60" />
                  {/* Target green steering dot */}
                  <div
                    style={{ transform: `translateX(${trackSteering * 70}px)` }}
                    className="relative z-10 flex flex-col items-center transition-transform duration-200"
                  >
                    <div className="w-8 h-12 bg-emerald-500 rounded-md shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-white flex items-center justify-center text-[10px] font-bold text-slate-950">
                      JETBOT
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono mt-1">
                      {trackSteering !== 0 ? `Bẻ lái: ${(-trackSteering * 35).toFixed(0)}°` : 'Cân bằng'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SIMULATION 4: Điều khiển từ xa */}
            {selectedFunc.id === 'remote-control' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  Học sinh có thể điều khiển trực tiếp robot thông qua các nút bấm ảo hoặc bàn phím:
                </p>
                <div className="flex flex-col items-center gap-2">
                  <button
                    onMouseDown={() => { setRemoteSpeed(0.5); setRemoteSteer(0); }}
                    onMouseUp={() => setRemoteSpeed(0)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 rounded-xl font-bold text-xs border border-slate-700 shadow"
                  >
                    ▲ TIẾN LÊN
                  </button>
                  <div className="flex gap-2">
                    <button
                      onMouseDown={() => { setRemoteSpeed(0.4); setRemoteSteer(-0.6); }}
                      onMouseUp={() => { setRemoteSpeed(0); setRemoteSteer(0); }}
                      className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 rounded-xl font-bold text-xs border border-slate-700 shadow"
                    >
                      ◄ RẼ TRÁI
                    </button>
                    <button
                      onClick={() => { setRemoteSpeed(0); setRemoteSteer(0); }}
                      className="px-5 py-2.5 bg-rose-950 hover:bg-rose-900 border border-rose-700 text-rose-300 rounded-xl font-bold text-xs shadow"
                    >
                      DỪNG
                    </button>
                    <button
                      onMouseDown={() => { setRemoteSpeed(0.4); setRemoteSteer(0.6); }}
                      onMouseUp={() => { setRemoteSpeed(0); setRemoteSteer(0); }}
                      className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 rounded-xl font-bold text-xs border border-slate-700 shadow"
                    >
                      RẼ PHẢI ►
                    </button>
                  </div>
                  <button
                    onMouseDown={() => { setRemoteSpeed(-0.4); setRemoteSteer(0); }}
                    onMouseUp={() => setRemoteSpeed(0)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-emerald-600 rounded-xl font-bold text-xs border border-slate-700 shadow"
                  >
                    ▼ LÙI LẠI
                  </button>
                </div>
                <div className="text-center font-mono text-xs text-sky-400">
                  Trạng thái tín hiệu Wi-Fi: Tốc độ = {remoteSpeed * 100}% | Bẻ lái = {remoteSteer * 100}%
                </div>
              </div>
            )}

            {/* SIMULATION 5: Xử lý thời gian thực */}
            {selectedFunc.id === 'realtime-processing' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">Bước 1: Camera</span>
                    <span className="text-xs font-bold text-sky-400">30 FPS Raw</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">Bước 2: GPU Maxwell</span>
                    <span className="text-xs font-bold text-emerald-400">128 Nhân CUDA</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">Bước 3: AI Inference</span>
                    <span className="text-xs font-bold text-amber-400">5.2 ms Latency</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">Bước 4: Động cơ</span>
                    <span className="text-xs font-bold text-purple-400">PWM 50 Hz</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <span className="font-semibold text-emerald-300">Tối ưu hoá TensorRT: </span>
                  NVIDIA Jetson Nano chuyển đổi các mô hình học sâu sang dạng dấu phẩy động 16-bit (FP16), giúp tăng tốc độ suy luận gấp 4 lần so với CPU thông thường.
                </div>
              </div>
            )}

            {/* SIMULATION 6: Lập trình robot Python */}
            {selectedFunc.id === 'python-programming' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-mono flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                    jetbot_control.py (Chương trình Python mẫu)
                  </span>
                  <button
                    onClick={runSamplePython}
                    disabled={isRunningCode}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold shadow transition"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isRunningCode ? 'Đang chạy...' : 'Chạy thử mã (Run)'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                  <pre>{selectedFunc.pythonSnippet}</pre>
                </div>

                {codeOutput && (
                  <div className="p-3 rounded-xl bg-black border border-emerald-900/60 font-mono text-xs text-emerald-400 whitespace-pre-line animate-in fade-in">
                    {codeOutput}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* 3. Deep-dive Explanation & STEM Education Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Nguyên lý kỹ thuật chi tiết
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedFunc.howItWorksVi}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider block mb-1">
                Ứng dụng trong dự án trường học
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedFunc.schoolContextVi}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
