import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createJetBotModel, updateExplodedState, JetBotModelLayers } from './JetBotProceduralModel';
import { createJetBotObstacleArena, ObstacleArenaInstance } from './JetBotObstacleArena';
import { soundManager } from '../utils/audioEffects';
import { JETBOT_COMPONENTS } from '../data/jetbotData';
import { JetBotComponent, CameraPreset, StudioLightingMode } from '../types/jetbot';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Navigation,
  Gauge,
  Gamepad2,
  Zap,
  Flag,
  AlertTriangle,
  Bot,
  Volume2,
  VolumeX,
  Trophy,
  Timer,
  MapPin,
  Compass,
  Sparkles,
  CheckCircle2,
  Play,
  Pause,
  Map,
} from 'lucide-react';

interface ScreenPin {
  component: JetBotComponent;
  x: number;
  y: number;
  visible: boolean;
  distance: number;
}

interface JetBot3DViewerProps {
  explodedAmount: number;
  selectedComponentId: string | null;
  onSelectComponent: (comp: JetBotComponent | null) => void;
  cameraPreset: CameraPreset;
  isDriving: boolean;
  driveSpeed: number;
  driveSteer: number;
  showAnnotations: boolean;
  wireframeMode: boolean;
  studioMode?: StudioLightingMode;
}

export const JetBot3DViewer: React.FC<JetBot3DViewerProps> = ({
  explodedAmount,
  selectedComponentId,
  onSelectComponent,
  cameraPreset,
  isDriving,
  driveSpeed,
  driveSteer,
  showAnnotations,
  wireframeMode,
  studioMode = 'dark',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [screenPins, setScreenPins] = useState<ScreenPin[]>([]);
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);

  // WASD Key States & Telemetry State
  const [activeKeys, setActiveKeys] = useState<{
    w: boolean;
    a: boolean;
    s: boolean;
    d: boolean;
    shift: boolean;
  }>({
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false,
  });

  const [driveTelemetry, setDriveTelemetry] = useState<{
    speed: number;
    headingDeg: number;
    isMoving: boolean;
    isBoost: boolean;
    statusText: string;
  }>({
    speed: 0,
    headingDeg: 90,
    isMoving: false,
    isBoost: false,
    statusText: 'Sẵn sàng tại vạch xuất phát',
  });

  // Checkpoint & Obstacle Arena States
  const [isArenaActive, setIsArenaActive] = useState<boolean>(true);
  const [isAutoPilot, setIsAutoPilot] = useState<boolean>(false);
  const [currentCpIdx, setCurrentCpIdx] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [arenaStats, setArenaStats] = useState<{
    laps: number;
    lapTime: number;
    bestLapTime: number | null;
    collisions: number;
    bumpFlash: boolean;
    lastClearedBanner: string | null;
    distToTarget: number;
    targetRelativeAngleDeg: number;
  }>({
    laps: 0,
    lapTime: 0,
    bestLapTime: null,
    collisions: 0,
    bumpFlash: false,
    lastClearedBanner: null,
    distToTarget: 0,
    targetRelativeAngleDeg: 0,
  });

  // Mutable refs for animation loop
  const layersRef = useRef<JetBotModelLayers | null>(null);
  const currentExplodedRef = useRef<number>(explodedAmount);
  const targetExplodedRef = useRef<number>(explodedAmount);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Position, Heading & Velocity of JetBot (Spawn at CP1: x=0, z=14.0, facing East toward CP2)
  const botPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 14.0));
  const botHeadingRef = useRef<number>(Math.PI / 2); // 90 degrees (+X axis)
  const botLinearVelRef = useRef<number>(0);
  const botAngularVelRef = useRef<number>(0);

  // Obstacle Arena & Checkpoint refs
  const arenaRef = useRef<ObstacleArenaInstance | null>(null);
  const isAutoPilotRef = useRef<boolean>(false);
  const currentCpIdxRef = useRef<number>(0);
  const isArenaActiveRef = useRef<boolean>(true);
  const lapTimerRef = useRef<number>(0);
  const lastBumpTimeRef = useRef<number>(0);

  // Active Key Pressed tracking (including Shift for turbo boost)
  const keysDownRef = useRef<{
    w: boolean;
    a: boolean;
    s: boolean;
    d: boolean;
    shift: boolean;
  }>({
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false,
  });

  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(3.5, 3.2, 7.2));
  const targetCamLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.45, 3.5));
  const isTransitioningCamRef = useRef<boolean>(false);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const shadowMeshRef = useRef<THREE.Mesh | null>(null);

  const propsRef = useRef({
    isDriving,
    driveSpeed,
    driveSteer,
    selectedComponentId,
    wireframeMode,
    studioMode,
  });

  useEffect(() => {
    propsRef.current = {
      isDriving,
      driveSpeed,
      driveSteer,
      selectedComponentId,
      wireframeMode,
      studioMode,
    };
  }, [isDriving, driveSpeed, driveSteer, selectedComponentId, wireframeMode, studioMode]);

  useEffect(() => {
    targetExplodedRef.current = explodedAmount;
  }, [explodedAmount]);

  useEffect(() => {
    isAutoPilotRef.current = isAutoPilot;
  }, [isAutoPilot]);

  useEffect(() => {
    isArenaActiveRef.current = isArenaActive;
    if (arenaRef.current) {
      arenaRef.current.rootGroup.visible = isArenaActive;
    }
    if (gridHelperRef.current) {
      gridHelperRef.current.visible = !isArenaActive;
    }
  }, [isArenaActive]);

  const toggleSound = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      soundManager.setMuted(next);
      return next;
    });
  }, []);

  // Reset JetBot Position back to Checkpoint 1 (or origin)
  const handleResetPosition = useCallback((toStartCheckpoint: boolean = true) => {
    if (toStartCheckpoint && arenaRef.current && arenaRef.current.checkpoints.length > 0) {
      const cp1 = arenaRef.current.checkpoints[0];
      botPosRef.current.set(cp1.x, 0, cp1.z);
      botHeadingRef.current = Math.PI / 2; // facing East towards CP2
    } else {
      botPosRef.current.set(0, 0, 0);
      botHeadingRef.current = 0;
    }

    botLinearVelRef.current = 0;
    botAngularVelRef.current = 0;
    currentCpIdxRef.current = 0;
    setCurrentCpIdx(0);
    lapTimerRef.current = 0;

    if (layersRef.current) {
      layersRef.current.rootGroup.position.copy(botPosRef.current);
      layersRef.current.rootGroup.rotation.y = botHeadingRef.current;
      layersRef.current.frontCasterSwivel.rotation.y = 0;
      layersRef.current.rearCasterSwivel.rotation.y = 0;
    }
    if (shadowMeshRef.current) {
      shadowMeshRef.current.position.set(botPosRef.current.x, -0.41, botPosRef.current.z);
      shadowMeshRef.current.rotation.z = -botHeadingRef.current;
    }
    if (controlsRef.current && cameraRef.current) {
      controlsRef.current.target.set(botPosRef.current.x, 0.45, botPosRef.current.z);
      cameraRef.current.position.set(botPosRef.current.x + 3.5, 3.2, botPosRef.current.z + 3.8);
    }
    setDriveTelemetry({
      speed: 0,
      headingDeg: Math.round(((botHeadingRef.current * 180) / Math.PI) % 360),
      isMoving: false,
      isBoost: false,
      statusText: 'Đã về Vạch xuất phát CP1',
    });
    setArenaStats(prev => ({
      ...prev,
      lastClearedBanner: '🏁 Sẵn sàng xuất phát tại Checkpoint 1!',
    }));
    setTimeout(() => {
      setArenaStats(prev => ({ ...prev, lastClearedBanner: null }));
    }, 2000);
  }, []);

  // Reset all knocked obstacles (cones & barrels) back to their upright original spots
  const handleResetObstacles = useCallback(() => {
    if (arenaRef.current) {
      arenaRef.current.resetObstacles();
      soundManager.playCheckpointChime();
      setArenaStats(prev => ({
        ...prev,
        lastClearedBanner: '🧹 Đã dựng lại tất cả nón giao thông & thùng cản!',
      }));
      setTimeout(() => {
        setArenaStats(prev => ({ ...prev, lastClearedBanner: null }));
      }, 2000);
    }
  }, []);

  // Keyboard Event Listeners for W, A, S, D, Shift, P (AutoPilot), R (Reset Pos), O (Reset Obstacles)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toLowerCase();
      let handled = false;

      // Shift detection (Turbo boost)
      if (e.key === 'Shift' || e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.shiftKey) {
        keysDownRef.current.shift = true;
        setActiveKeys(prev => ({ ...prev, shift: true }));
      }

      if (key === 'w' || e.code === 'ArrowUp') {
        keysDownRef.current.w = true;
        setActiveKeys(prev => ({ ...prev, w: true }));
        handled = true;
      } else if (key === 's' || e.code === 'ArrowDown') {
        keysDownRef.current.s = true;
        setActiveKeys(prev => ({ ...prev, s: true }));
        handled = true;
      } else if (key === 'a' || e.code === 'ArrowLeft') {
        keysDownRef.current.a = true;
        setActiveKeys(prev => ({ ...prev, a: true }));
        handled = true;
      } else if (key === 'd' || e.code === 'ArrowRight') {
        keysDownRef.current.d = true;
        setActiveKeys(prev => ({ ...prev, d: true }));
        handled = true;
      } else if (key === 'r') {
        // R key: Reset position to CP1
        handleResetPosition(true);
        handled = true;
      } else if (key === 'o') {
        // O key: Reset knocked obstacles back upright
        handleResetObstacles();
        handled = true;
      } else if (key === 'p') {
        // P key: Toggle AI Auto-Pilot
        setIsAutoPilot(prev => !prev);
        handled = true;
      } else if (key === 'm') {
        // M key: Toggle Mute
        toggleSound();
        handled = true;
      }

      if (handled) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (e.key === 'Shift' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        keysDownRef.current.shift = false;
        setActiveKeys(prev => ({ ...prev, shift: false }));
      } else if (!e.shiftKey && keysDownRef.current.shift) {
        keysDownRef.current.shift = false;
        setActiveKeys(prev => ({ ...prev, shift: false }));
      }

      if (key === 'w' || e.code === 'ArrowUp') {
        keysDownRef.current.w = false;
        setActiveKeys(prev => ({ ...prev, w: false }));
      } else if (key === 's' || e.code === 'ArrowDown') {
        keysDownRef.current.s = false;
        setActiveKeys(prev => ({ ...prev, s: false }));
      } else if (key === 'a' || e.code === 'ArrowLeft') {
        keysDownRef.current.a = false;
        setActiveKeys(prev => ({ ...prev, a: false }));
      } else if (key === 'd' || e.code === 'ArrowRight') {
        keysDownRef.current.d = false;
        setActiveKeys(prev => ({ ...prev, d: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleResetPosition, toggleSound, handleResetObstacles]);

  // Touch and mouse click simulator for on-screen driving buttons
  const startVirtualKey = (key: 'w' | 'a' | 's' | 'd' | 'shift') => {
    keysDownRef.current[key] = true;
    setActiveKeys(prev => ({ ...prev, [key]: true }));
  };

  const stopVirtualKey = (key: 'w' | 'a' | 's' | 'd' | 'shift') => {
    keysDownRef.current[key] = false;
    setActiveKeys(prev => ({ ...prev, [key]: false }));
  };

  // Camera Presets handler
  useEffect(() => {
    if (!controlsRef.current || !cameraRef.current) return;
    const controls = controlsRef.current;
    isTransitioningCamRef.current = true;

    const bx = botPosRef.current.x;
    const bz = botPosRef.current.z;

    targetCamLookAtRef.current.set(bx, 0.45, bz);

    switch (cameraPreset) {
      case 'front':
        targetCamPosRef.current.set(bx, 0.75, bz + 3.8);
        break;
      case 'side':
        targetCamPosRef.current.set(bx + 3.8, 0.75, bz);
        break;
      case 'top':
        targetCamPosRef.current.set(bx, 7.5, bz + 0.05);
        break;
      case 'closeJetson':
        targetCamPosRef.current.set(bx + 1.2, 1.4, bz + 1.2);
        targetCamLookAtRef.current.set(bx, 0.7, bz);
        break;
      case 'closeCamera':
        targetCamPosRef.current.set(bx, 0.85, bz + 2.1);
        targetCamLookAtRef.current.set(bx, 0.85, bz + 1.35);
        break;
      case 'closeLidar':
        targetCamPosRef.current.set(bx + 0.9, 2.0, bz + 0.9);
        targetCamLookAtRef.current.set(bx, 1.55, bz);
        break;
      case 'underbody':
        targetCamPosRef.current.set(bx + 2.2, -0.15, bz + 2.2);
        targetCamLookAtRef.current.set(bx, -0.1, bz);
        break;
      case 'isometric':
      default:
        targetCamPosRef.current.set(bx + 3.5, 3.2, bz + 3.8);
        break;
    }
  }, [cameraPreset]);

  // Focus camera smoothly when a component is clicked
  useEffect(() => {
    if (selectedComponentId) {
      const comp = JETBOT_COMPONENTS.find(c => c.id === selectedComponentId);
      if (comp && controlsRef.current && cameraRef.current) {
        isTransitioningCamRef.current = true;
        const [ax, ay, az] = comp.anchorOffset;
        const bx = botPosRef.current.x;
        const bz = botPosRef.current.z;

        targetCamLookAtRef.current.set(bx + ax, ay + currentExplodedRef.current * 0.4, bz + az);
        targetCamPosRef.current.set(
          bx + ax + (ax >= 0 ? 1.8 : -1.8),
          ay + 1.2 + currentExplodedRef.current * 0.6,
          bz + az + 1.8
        );
      }
    }
  }, [selectedComponentId]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const isLab = propsRef.current.studioMode === 'lab';
    scene.background = new THREE.Color(isLab ? 0xf1f5f9 : 0x090d16);
    scene.fog = new THREE.FogExp2(isLab ? 0xf1f5f9 : 0x090d16, 0.012);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      160
    );
    camera.position.set(3.8, 3.8, 18.8);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isLab ? 1.25 : 1.2;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Studio Environment map (RoomEnvironment reflection)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.minDistance = 1.0;
    controls.maxDistance = 75.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.18;
    controls.target.set(0, 0.45, 14.0);
    controlsRef.current = controls;

    controls.addEventListener('start', () => {
      isTransitioningCamRef.current = false;
    });

    // Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 35;
    const d = 14.0;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.4);
    fillLight.position.set(-8, 8, -6);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.6);
    rimLight.position.set(0, 10, -8);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x0f172a, 0.7);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    // Optional Minimal Grid Helper
    const gridHelper = new THREE.GridHelper(36, 72, 0x334155, 0x1e293b);
    gridHelper.position.y = -0.42;
    gridHelper.visible = false;
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;

    // 1. ADD OBSTACLE ARENA & CHECKPOINTS MAP
    const arena = createJetBotObstacleArena();
    scene.add(arena.rootGroup);
    arenaRef.current = arena;
    arena.rootGroup.visible = isArenaActiveRef.current;

    // Enhanced Multi-Point Ambient Occlusion Ground Contact Shadow Canvas
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 512;
    shadowCanvas.height = 512;
    const sctx = shadowCanvas.getContext('2d')!;

    const mainGrad = sctx.createRadialGradient(256, 256, 20, 256, 256, 220);
    mainGrad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
    mainGrad.addColorStop(0.45, 'rgba(0, 0, 0, 0.32)');
    mainGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.08)');
    mainGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sctx.fillStyle = mainGrad;
    sctx.fillRect(0, 0, 512, 512);

    const contactPoints = [
      { x: 256 - 150, y: 256, rx: 24, ry: 48 }, // Left wheel
      { x: 256 + 150, y: 256, rx: 24, ry: 48 }, // Right wheel
      { x: 256, y: 256 + 130, rx: 22, ry: 22 }, // Front caster
      { x: 256, y: 256 - 130, rx: 22, ry: 22 }, // Rear caster
    ];

    contactPoints.forEach(pt => {
      const cgrad = sctx.createRadialGradient(pt.x, pt.y, 2, pt.x, pt.y, Math.max(pt.rx, pt.ry));
      cgrad.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
      cgrad.addColorStop(0.55, 'rgba(0, 0, 0, 0.55)');
      cgrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sctx.fillStyle = cgrad;
      sctx.beginPath();
      sctx.ellipse(pt.x, pt.y, pt.rx, pt.ry, 0, 0, Math.PI * 2);
      sctx.fill();
    });

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(4.6, 4.6),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: isLab ? 0.75 : 0.65,
        depthWrite: false,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -0.41, 14.0);
    scene.add(shadowPlane);
    shadowMeshRef.current = shadowPlane;

    // Assemble JetBot 3D procedural model & place at CP1
    const jetbotLayers = createJetBotModel();
    jetbotLayers.rootGroup.position.set(0, 0, 14.0);
    jetbotLayers.rootGroup.rotation.y = Math.PI / 2;
    scene.add(jetbotLayers.rootGroup);
    layersRef.current = jetbotLayers;

    // Raycasting for interactive clicking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(jetbotLayers.rootGroup.children, true);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        for (const [compId, meshes] of jetbotLayers.componentMeshes.entries()) {
          if (meshes.includes(hitMesh) || meshes.some(m => hitMesh.parent === m || hitMesh === m)) {
            const comp = JETBOT_COMPONENTS.find(c => c.id === compId);
            if (comp) {
              onSelectComponent(comp);
              return;
            }
          }
        }
      }
    };

    const handlePointerMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(jetbotLayers.rootGroup.children, true);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        let foundId: string | null = null;
        for (const [compId, meshes] of jetbotLayers.componentMeshes.entries()) {
          if (meshes.includes(hitMesh) || meshes.some(m => hitMesh.parent === m || hitMesh === m)) {
            foundId = compId;
            break;
          }
        }
        setHoveredComponentId(foundId);
      } else {
        setHoveredComponentId(null);
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);

    // Animation & Physics Loop
    let animId: number;
    let lastTime = performance.now();
    let lastTelemetryTime = 0;
    const tempVec3 = new THREE.Vector3();

    const renderLoop = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // 1. Smooth lerp exploded view
      currentExplodedRef.current = THREE.MathUtils.damp(
        currentExplodedRef.current,
        targetExplodedRef.current,
        7,
        delta
      );
      updateExplodedState(jetbotLayers, currentExplodedRef.current);

      // 2. Continuous rotating parts
      const fanMultiplier = keysDownRef.current.shift ? 1.6 : 1.0;
      jetbotLayers.fanBlades.rotation.y += delta * 24 * fanMultiplier;
      jetbotLayers.lidarRotor.rotation.y += delta * 8;
      jetbotLayers.lidarPulley.rotation.y += delta * 24;

      // 3. Update Arena Animations (Rotating holographic gems & pulsing rings)
      if (arenaRef.current && isArenaActiveRef.current) {
        arenaRef.current.update(time, delta, currentCpIdxRef.current);
      }

      // 4. Checkpoint Trigger & Lap Progress Tracking
      let distToTarget = 0;
      let targetRelativeAngleDeg = 0;

      if (arenaRef.current && isArenaActiveRef.current) {
        lapTimerRef.current += delta;
        const checkpoints = arenaRef.current.checkpoints;
        const currentTarget = checkpoints[currentCpIdxRef.current];

        const dx = currentTarget.x - botPosRef.current.x;
        const dz = currentTarget.z - botPosRef.current.z;
        distToTarget = Math.hypot(dx, dz);

        // Calculate heading relative to target for HUD compass arrow
        const targetGlobalAngle = Math.atan2(dx, dz);
        let relAngle = targetGlobalAngle - botHeadingRef.current;
        while (relAngle > Math.PI) relAngle -= Math.PI * 2;
        while (relAngle < -Math.PI) relAngle += Math.PI * 2;
        targetRelativeAngleDeg = Math.round((relAngle * 180) / Math.PI);

        // Checkpoint proximity trigger
        if (distToTarget < currentTarget.radius) {
          const clearedIdx = currentCpIdxRef.current;
          const nextIdx = (clearedIdx + 1) % checkpoints.length;
          currentCpIdxRef.current = nextIdx;
          setCurrentCpIdx(nextIdx);

          if (clearedIdx === checkpoints.length - 1) {
            // Completed full circuit lap!
            soundManager.playLapFanfare();
            const finishedLapTime = lapTimerRef.current;
            lapTimerRef.current = 0;
            setArenaStats(prev => {
              const newLaps = prev.laps + 1;
              const newBest = prev.bestLapTime === null || finishedLapTime < prev.bestLapTime
                ? finishedLapTime
                : prev.bestLapTime;
              return {
                ...prev,
                laps: newLaps,
                bestLapTime: newBest,
                lastClearedBanner: `🏆 HOÀN THÀNH VÒNG ${newLaps}! Thời gian: ${finishedLapTime.toFixed(1)}s`,
              };
            });
          } else {
            soundManager.playCheckpointChime();
            setArenaStats(prev => ({
              ...prev,
              lastClearedBanner: `✓ Đạt ${currentTarget.nameVi}! Tiếp theo: CP 0${nextIdx + 1}`,
            }));
          }

          setTimeout(() => {
            setArenaStats(prev => ({ ...prev, lastClearedBanner: null }));
          }, 2400);
        }
      }

      // 5. PHYSICAL WASD & AUTONOMOUS AI NAVIGATION KINEMATICS
      const keys = keysDownRef.current;
      const isShift = keys.shift;
      const linearSpeedFactor = isShift ? 2.2 : 1.0;
      const angularSpeedFactor = isShift ? 1.35 : 1.0;

      let targetLinear = 0;
      let targetAngular = 0;

      if (isAutoPilotRef.current && arenaRef.current && isArenaActiveRef.current) {
        // AUTONOMOUS NAVIGATION (AI Tự lái qua lại các checkpoints)
        const targetCp = arenaRef.current.checkpoints[currentCpIdxRef.current];
        const dx = targetCp.x - botPosRef.current.x;
        const dz = targetCp.z - botPosRef.current.z;
        const dist = Math.hypot(dx, dz);

        // Desired target heading
        const targetAngle = Math.atan2(dx, dz);
        let angleDiff = targetAngle - botHeadingRef.current;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        // Obstacle avoidance repulsion field
        let avoidanceSteer = 0;
        for (const obs of arenaRef.current.obstacles) {
          const odx = obs.x - botPosRef.current.x;
          const odz = obs.z - botPosRef.current.z;
          const odist = Math.hypot(odx, odz);
          if (odist < 2.5) {
            const oAngle = Math.atan2(odx, odz);
            let oDiff = oAngle - botHeadingRef.current;
            while (oDiff > Math.PI) oDiff -= Math.PI * 2;
            while (oDiff < -Math.PI) oDiff += Math.PI * 2;
            if (Math.abs(oDiff) < 1.1) {
              avoidanceSteer += (oDiff > 0 ? -1 : 1) * (2.5 - odist) * 2.2;
            }
          }
        }

        targetAngular = THREE.MathUtils.clamp(angleDiff * 3.4 + avoidanceSteer, -3.2, 3.2);
        const turnPenalty = Math.max(0.35, 1.0 - Math.abs(angleDiff) * 0.65);
        targetLinear = (dist < 1.2 ? 1.6 : 2.8) * turnPenalty;
      } else {
        // MANUAL DRIVE (WASD + Shift)
        if (keys.w) targetLinear += 2.2 * linearSpeedFactor;
        if (keys.s) targetLinear -= 1.6 * linearSpeedFactor;
        if (keys.a) targetAngular += 2.4 * angularSpeedFactor;
        if (keys.d) targetAngular -= 2.4 * angularSpeedFactor;

        if (propsRef.current.isDriving) {
          targetLinear += propsRef.current.driveSpeed * 1.6 * linearSpeedFactor;
          targetAngular -= propsRef.current.driveSteer * 2.2 * angularSpeedFactor;
        }
      }

      // Smooth inertia damping
      const dampLinear = isShift ? 10 : 8;
      const dampAngular = isShift ? 12 : 10;
      botLinearVelRef.current = THREE.MathUtils.damp(botLinearVelRef.current, targetLinear, dampLinear, delta);
      botAngularVelRef.current = THREE.MathUtils.damp(botAngularVelRef.current, targetAngular, dampAngular, delta);

      const v = botLinearVelRef.current;
      const omega = botAngularVelRef.current;
      const isMoving = Math.abs(v) > 0.03 || Math.abs(omega) > 0.03;

      if (isMoving) {
        const prevX = botPosRef.current.x;
        const prevZ = botPosRef.current.z;

        // Multi-substep physics integration to prevent tunneling at Turbo x2.2 speeds
        const subSteps = 3;
        const subDelta = delta / subSteps;

        for (let step = 0; step < subSteps; step++) {
          botHeadingRef.current += omega * subDelta;
          botPosRef.current.x += Math.sin(botHeadingRef.current) * v * subDelta;
          botPosRef.current.z += Math.cos(botHeadingRef.current) * v * subDelta;

          // Full physical collision resolution (dynamic sliding, wobbling, knocking over & solid barrier rebounds)
          if (arenaRef.current && isArenaActiveRef.current) {
            const collision = arenaRef.current.resolveCarCollisions(
              botPosRef.current,
              botLinearVelRef,
              time
            );

            if (collision.hasCollided && time - lastBumpTimeRef.current > 280) {
              lastBumpTimeRef.current = time;
              setArenaStats(prev => ({
                ...prev,
                collisions: prev.collisions + 1,
                bumpFlash: true,
                lastClearedBanner: collision.obstacleName
                  ? `💥 Va chạm: ${collision.obstacleName}!`
                  : prev.lastClearedBanner,
              }));
              setTimeout(() => {
                setArenaStats(prev => ({ ...prev, bumpFlash: false }));
              }, 300);
            }
          }
        }

        // Arena boundary limit (64m x 64m arena -> bounds [-31.0, 31.0])
        const bound = isArenaActiveRef.current ? 31.0 : 31.0;
        botPosRef.current.x = Math.max(-bound, Math.min(bound, botPosRef.current.x));
        botPosRef.current.z = Math.max(-bound, Math.min(bound, botPosRef.current.z));

        // Update 3D robot model in scene
        jetbotLayers.rootGroup.position.copy(botPosRef.current);
        jetbotLayers.rootGroup.rotation.y = botHeadingRef.current;

        if (shadowMeshRef.current) {
          shadowMeshRef.current.position.set(botPosRef.current.x, -0.41, botPosRef.current.z);
          shadowMeshRef.current.rotation.z = -botHeadingRef.current;
        }

        // Differential drive wheel rotation
        const wheelTrackHalf = 0.74;
        const wheelRadius = 0.36;
        const vL = v - omega * wheelTrackHalf;
        const vR = v + omega * wheelTrackHalf;
        jetbotLayers.leftWheel.rotation.x += (vL / wheelRadius) * delta;
        jetbotLayers.rightWheel.rotation.x += (vR / wheelRadius) * delta;

        // Swivel Casters steering
        const casterTargetAngle = THREE.MathUtils.clamp(-omega * 0.45, -0.85, 0.85);
        jetbotLayers.frontCasterSwivel.rotation.y = THREE.MathUtils.damp(
          jetbotLayers.frontCasterSwivel.rotation.y,
          casterTargetAngle,
          10,
          delta
        );
        jetbotLayers.rearCasterSwivel.rotation.y = THREE.MathUtils.damp(
          jetbotLayers.rearCasterSwivel.rotation.y,
          -casterTargetAngle,
          10,
          delta
        );

        // Smooth camera follow
        const deltaX = botPosRef.current.x - prevX;
        const deltaZ = botPosRef.current.z - prevZ;
        camera.position.x += deltaX;
        camera.position.z += deltaZ;
        controls.target.x = botPosRef.current.x;
        controls.target.z = botPosRef.current.z;
      }

      // Telemetry update interval (100ms)
      if (time - lastTelemetryTime > 100) {
        lastTelemetryTime = time;
        const deg = Math.round(((botHeadingRef.current * 180) / Math.PI) % 360);
        const normDeg = deg < 0 ? deg + 360 : deg;
        const isBoost = isShift && (keys.w || keys.s || keys.a || keys.d || isMoving);
        let status = 'Đang dừng';

        if (isAutoPilotRef.current) {
          status = `🤖 Tự lái AI ➔ CP 0${currentCpIdxRef.current + 1}`;
        } else if (keys.w && keys.a) status = isShift ? '⚡ Tiến + Trái (Turbo)' : 'Tiến + Rẽ Trái';
        else if (keys.w && keys.d) status = isShift ? '⚡ Tiến + Phải (Turbo)' : 'Tiến + Rẽ Phải';
        else if (keys.s && keys.a) status = isShift ? '⚡ Lùi + Trái (Turbo)' : 'Lùi + Rẽ Trái';
        else if (keys.s && keys.d) status = isShift ? '⚡ Lùi + Phải (Turbo)' : 'Lùi + Rẽ Phải';
        else if (keys.w) status = isShift ? '⚡ Tiến cực nhanh (Turbo)' : 'Đi thẳng';
        else if (keys.s) status = isShift ? '⚡ Lùi nhanh (Turbo)' : 'Đi lùi';
        else if (keys.a) status = isShift ? '⚡ Drift quay trái' : 'Quay trái';
        else if (keys.d) status = isShift ? '⚡ Drift quay phải' : 'Quay phải';
        else if (isMoving) status = isShift ? '⚡ Đang lướt nhanh' : 'Đang lăn bánh';

        setDriveTelemetry({
          speed: Math.abs(Math.round(v * 10) / 10),
          headingDeg: normDeg,
          isMoving,
          isBoost,
          statusText: status,
        });

        setArenaStats(prev => ({
          ...prev,
          lapTime: Math.round(lapTimerRef.current * 10) / 10,
          distToTarget: Math.round(distToTarget * 10) / 10,
          targetRelativeAngleDeg,
        }));
      }

      // Smooth Camera Preset Interpolation
      if (isTransitioningCamRef.current) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPosRef.current.x, 5, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPosRef.current.y, 5, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPosRef.current.z, 5, delta);

        controls.target.x = THREE.MathUtils.damp(controls.target.x, targetCamLookAtRef.current.x, 5, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, targetCamLookAtRef.current.y, 5, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, targetCamLookAtRef.current.z, 5, delta);

        if (camera.position.distanceTo(targetCamPosRef.current) < 0.04) {
          isTransitioningCamRef.current = false;
        }
      }

      controls.update();

      // Screen pins projection
      const width = container.clientWidth;
      const height = container.clientHeight;
      const calculatedPins: ScreenPin[] = [];

      JETBOT_COMPONENTS.forEach(comp => {
        const [ox, oy, oz] = comp.anchorOffset;
        const [ex, ey, ez] = comp.explodedOffset;
        const curE = currentExplodedRef.current;
        tempVec3.set(
          THREE.MathUtils.lerp(ox, ex, curE),
          THREE.MathUtils.lerp(oy, ey, curE),
          THREE.MathUtils.lerp(oz, ez, curE)
        );

        tempVec3.applyMatrix4(jetbotLayers.rootGroup.matrixWorld);

        const worldPos = tempVec3.clone();
        tempVec3.project(camera);

        const isVisible = tempVec3.z < 1.0;
        const screenX = ((tempVec3.x + 1) * width) / 2;
        const screenY = ((-tempVec3.y + 1) * height) / 2;
        const dist = camera.position.distanceTo(worldPos);

        calculatedPins.push({
          component: comp,
          x: screenX,
          y: screenY,
          visible: isVisible && screenX > 20 && screenX < width - 20 && screenY > 20 && screenY < height - 20,
          distance: dist,
        });
      });

      setScreenPins(calculatedPins);

      // Render
      renderer.render(scene, camera);
      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    // Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      arena.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onSelectComponent]);

  const isLabMode = studioMode === 'lab';

  const checkpointLabels = [
    'CP 01: Xuất phát / Về đích (0, 14m)',
    'CP 02: Cua Chữ S (+20m, 12m)',
    'CP 03: Khúc Cua Gấp (+20m, -18m)',
    'CP 04: Đoạn Tăng Tốc (-18m, -19m)',
    'CP 05: Cua Về Đích (-20m, 7m)',
  ];

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Checkpoint Clearance Celebration Toast */}
      {arenaStats.lastClearedBanner && (
        <div className="absolute top-20 inset-x-0 mx-auto w-fit z-40 animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
          <div className="px-5 py-2.5 rounded-2xl bg-emerald-500/95 text-slate-950 font-bold text-xs sm:text-sm shadow-2xl backdrop-blur-md border border-emerald-300 flex items-center gap-2.5 ring-4 ring-emerald-400/40">
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>{arenaStats.lastClearedBanner}</span>
          </div>
        </div>
      )}

      {/* Bump Collision Visual Halo Alert */}
      {arenaStats.bumpFlash && (
        <div className="absolute inset-0 pointer-events-none z-30 border-[10px] border-red-500/60 animate-ping duration-300" />
      )}

      {/* TOP ARENA & CHECKPOINTS MISSION HUD */}
      <div className="absolute top-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left: Mode Badge & Quick Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsArenaActive(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-md transition ${
              isArenaActive
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 ring-1 ring-emerald-500/40'
                : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Bật/Tắt Bản đồ thi đấu chướng ngại vật"
          >
            <Map className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isArenaActive ? 'Bản đồ 64m' : 'Sàn Studio'}</span>
          </button>

          {isArenaActive && (
            <>
              <button
                onClick={() => setIsAutoPilot(prev => !prev)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md transition ${
                  isAutoPilot
                    ? 'bg-sky-500 text-slate-950 border-sky-300 ring-2 ring-sky-400/50 animate-pulse'
                    : 'bg-slate-900/80 border-slate-700 text-slate-200 hover:border-sky-500/60 hover:text-sky-300'
                }`}
                title="Phím tắt: P - Tự động lái qua các điểm checkpoint và tránh chướng ngại vật"
              >
                <Bot className={`w-3.5 h-3.5 ${isAutoPilot ? 'text-slate-950' : 'text-sky-400'}`} />
                <span>{isAutoPilot ? '🤖 TỰ LÁI AI: BẬT' : '🤖 BẬT TỰ LÁI AI'}</span>
                <kbd className="hidden sm:inline px-1 py-0.2 rounded text-[10px] bg-black/30 font-mono ml-0.5">P</kbd>
              </button>

              <button
                onClick={handleResetObstacles}
                className="px-2.5 py-1.5 rounded-xl border border-amber-500/40 bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-md transition"
                title="Phím tắt: O - Dựng lại tất cả nón giao thông & thùng cản bị húc ngã"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Dựng lại vật cản</span>
                <kbd className="px-1 py-0.2 rounded text-[10px] bg-amber-500/20 font-mono">O</kbd>
              </button>
            </>
          )}
        </div>

        {/* Center / Right: Checkpoint Circuit Stepper & Race Telemetry */}
        {isArenaActive && (
          <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
            {/* Checkpoint Stepper Bar */}
            <div className="px-3.5 py-1.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs shadow-xl backdrop-blur-md flex items-center gap-2.5">
              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <Flag className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mục tiêu:</span>
              </span>

              {/* 5 Checkpoints Indicator Dots */}
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3, 4].map(idx => {
                  const isCurrent = currentCpIdx === idx;
                  const isPassed = currentCpIdx > idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        currentCpIdxRef.current = idx;
                        setCurrentCpIdx(idx);
                      }}
                      className={`relative px-2 py-0.5 rounded-md text-[10px] font-bold font-mono transition-all ${
                        isCurrent
                          ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/50 scale-105 shadow-md shadow-amber-500/40 animate-pulse'
                          : isPassed
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                      }`}
                      title={checkpointLabels[idx]}
                    >
                      CP{idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Waypoint Compass Pointer */}
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800 text-[11px] font-mono text-amber-300">
                <Navigation
                  className="w-3.5 h-3.5 transition-transform duration-100"
                  style={{
                    transform: `rotate(${arenaStats.targetRelativeAngleDeg}deg)`,
                  }}
                />
                <span>{arenaStats.distToTarget}m</span>
              </div>
            </div>

            {/* Lap Timer & Stats */}
            <div className="px-3 py-1.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs shadow-xl backdrop-blur-md flex items-center gap-3">
              <span className="flex items-center gap-1 text-slate-300 font-mono">
                <Timer className="w-3.5 h-3.5 text-sky-400" />
                <span>{arenaStats.lapTime.toFixed(1)}s</span>
              </span>

              <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                <Trophy className="w-3 h-3 text-emerald-400" />
                <span>Vòng {arenaStats.laps + 1}</span>
              </span>

              {/* Collisions Count */}
              <span
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold transition ${
                  arenaStats.collisions > 0
                    ? 'bg-red-950/80 border border-red-500/40 text-red-300'
                    : 'text-slate-400'
                }`}
                title="Số lần va chạm chướng ngại vật"
              >
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>{arenaStats.collisions}</span>
              </span>

              {/* Mute Audio Toggle */}
              <button
                onClick={toggleSound}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition"
                title={isMuted ? 'Bật âm thanh (M)' : 'Tắt âm thanh (M)'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Floating 2D Annotations Callouts */}
      {showAnnotations && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {screenPins
            .filter(pin => pin.visible)
            .map(pin => {
              const isSelected = selectedComponentId === pin.component.id;
              const isHovered = hoveredComponentId === pin.component.id;
              const strokeColor = isSelected ? '#10b981' : isHovered ? '#38bdf8' : isLabMode ? '#64748b' : '#475569';

              return (
                <g key={`pin-leader-${pin.component.id}`}>
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r={isSelected ? 4 : 2.5}
                    fill={isSelected ? '#10b981' : strokeColor}
                  />
                </g>
              );
            })}
        </svg>
      )}

      {showAnnotations && (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
          {screenPins
            .filter(pin => pin.visible)
            .map(pin => {
              const isSelected = selectedComponentId === pin.component.id;
              const isHovered = hoveredComponentId === pin.component.id;

              return (
                <div
                  key={pin.component.id}
                  style={{
                    left: `${pin.x}px`,
                    top: `${pin.y}px`,
                    transform: 'translate(-50%, -135%)',
                  }}
                  className={`absolute pointer-events-auto cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'scale-105 z-30'
                      : isHovered
                      ? 'scale-100 z-20'
                      : 'scale-90 opacity-80 hover:opacity-100 hover:scale-95'
                  }`}
                  onClick={() => onSelectComponent(pin.component)}
                  onMouseEnter={() => setHoveredComponentId(pin.component.id)}
                  onMouseLeave={() => setHoveredComponentId(null)}
                >
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border shadow-lg backdrop-blur-md transition-all ${
                      isSelected
                        ? isLabMode
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-800 ring-2 ring-emerald-500/30'
                          : 'bg-emerald-950/90 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                        : isHovered
                        ? isLabMode
                          ? 'bg-white border-sky-600 text-sky-800'
                          : 'bg-slate-900/90 border-sky-400 text-sky-200'
                        : isLabMode
                        ? 'bg-white/90 border-slate-300 text-slate-800 hover:border-slate-500'
                        : 'bg-slate-950/80 border-slate-700/80 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: pin.component.color }}
                    />
                    <span className="whitespace-nowrap font-semibold tracking-wide">
                      {pin.component.nameVi}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Floating WASD Keypad & Driving Telemetry HUD (Bottom Left) */}
      <div className="absolute bottom-24 left-4 z-20 flex flex-col gap-2">
        <div
          className={`p-3.5 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all duration-200 ${
            isLabMode
              ? 'bg-white/95 border-slate-300 text-slate-800'
              : 'bg-slate-950/90 border-slate-800 text-slate-100'
          }`}
        >
          {/* Header of HUD */}
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800/80 mb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
              <Gamepad2 className="w-4 h-4 text-emerald-500" />
              <span>Phím lái xe (WASD)</span>
            </div>
            {/* Reset buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleResetPosition(true)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold border transition ${
                  isLabMode
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
                title="Đặt lại vị trí xe về Vạch xuất phát CP1 (0, 0, 14m) - Phím R"
              >
                <RotateCcw className="w-3 h-3 text-emerald-400" />
                <span>Về CP1 (R)</span>
              </button>

              <button
                onClick={handleResetObstacles}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold border transition ${
                  isLabMode
                    ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-800'
                    : 'bg-amber-950/60 hover:bg-amber-900/70 border-amber-500/40 text-amber-300'
                }`}
                title="Dựng lại tất cả nón giao thông & thùng cản bị húc ngã - Phím O"
              >
                <span>Dựng cản (O)</span>
              </button>
            </div>
          </div>

          {/* Interactive Keyboard Layout */}
          <div className="flex flex-col items-center gap-1.5 py-1">
            {/* Shift Key Turbo Boost Button */}
            <button
              onPointerDown={() => startVirtualKey('shift')}
              onPointerUp={() => stopVirtualKey('shift')}
              onPointerLeave={() => stopVirtualKey('shift')}
              className={`w-full py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 font-bold text-[11px] border transition-all duration-100 shadow-md ${
                activeKeys.shift
                  ? 'bg-amber-500 text-slate-950 border-amber-300 scale-[0.98] shadow-amber-500/50 ring-2 ring-amber-400 font-extrabold'
                  : isLabMode
                  ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100 active:scale-95'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/50 active:scale-95'
              }`}
              title="Nhấn giữ phím Shift + W/A/S/D để kích hoạt chế độ tăng tốc Turbo x2.2"
            >
              <Zap className={`w-3.5 h-3.5 ${activeKeys.shift ? 'fill-slate-950 text-slate-950' : 'text-amber-400'}`} />
              <span>⇧ SHIFT : TĂNG TỐC (TURBO x2.2)</span>
            </button>

            {/* Key W (Forward) */}
            <button
              onPointerDown={() => startVirtualKey('w')}
              onPointerUp={() => stopVirtualKey('w')}
              onPointerLeave={() => stopVirtualKey('w')}
              className={`w-12 h-11 rounded-xl flex flex-col items-center justify-center font-bold text-xs border transition-all duration-100 shadow-md ${
                activeKeys.w
                  ? 'bg-emerald-500 text-white border-emerald-400 scale-95 shadow-emerald-500/50 ring-2 ring-emerald-400/50'
                  : isLabMode
                  ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 active:scale-95'
                  : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 active:scale-95'
              }`}
            >
              <ArrowUp className="w-3.5 h-3.5 mb-0.5" />
              <span>W</span>
            </button>

            {/* Keys A, S, D (Left, Back, Right) */}
            <div className="flex items-center gap-1.5">
              {/* Key A (Left) */}
              <button
                onPointerDown={() => startVirtualKey('a')}
                onPointerUp={() => stopVirtualKey('a')}
                onPointerLeave={() => stopVirtualKey('a')}
                className={`w-12 h-11 rounded-xl flex flex-col items-center justify-center font-bold text-xs border transition-all duration-100 shadow-md ${
                  activeKeys.a
                    ? 'bg-emerald-500 text-white border-emerald-400 scale-95 shadow-emerald-500/50 ring-2 ring-emerald-400/50'
                    : isLabMode
                    ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 active:scale-95'
                    : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 active:scale-95'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5 mb-0.5" />
                <span>A</span>
              </button>

              {/* Key S (Back) */}
              <button
                onPointerDown={() => startVirtualKey('s')}
                onPointerUp={() => stopVirtualKey('s')}
                onPointerLeave={() => stopVirtualKey('s')}
                className={`w-12 h-11 rounded-xl flex flex-col items-center justify-center font-bold text-xs border transition-all duration-100 shadow-md ${
                  activeKeys.s
                    ? 'bg-emerald-500 text-white border-emerald-400 scale-95 shadow-emerald-500/50 ring-2 ring-emerald-400/50'
                    : isLabMode
                    ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 active:scale-95'
                    : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 active:scale-95'
                }`}
              >
                <ArrowDown className="w-3.5 h-3.5 mb-0.5" />
                <span>S</span>
              </button>

              {/* Key D (Right) */}
              <button
                onPointerDown={() => startVirtualKey('d')}
                onPointerUp={() => stopVirtualKey('d')}
                onPointerLeave={() => stopVirtualKey('d')}
                className={`w-12 h-11 rounded-xl flex flex-col items-center justify-center font-bold text-xs border transition-all duration-100 shadow-md ${
                  activeKeys.d
                    ? 'bg-emerald-500 text-white border-emerald-400 scale-95 shadow-emerald-500/50 ring-2 ring-emerald-400/50'
                    : isLabMode
                    ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 active:scale-95'
                    : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 active:scale-95'
                }`}
              >
                <ArrowRight className="w-3.5 h-3.5 mb-0.5" />
                <span>D</span>
              </button>
            </div>
          </div>

          {/* Key Meanings Vietnamese Guide */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/80 mt-2 font-mono">
            <div>
              <b className="text-emerald-500">W:</b> Đi thẳng
            </div>
            <div>
              <b className="text-emerald-500">A:</b> Rẽ trái
            </div>
            <div>
              <b className="text-emerald-500">S:</b> Đi lùi
            </div>
            <div>
              <b className="text-emerald-500">D:</b> Rẽ phải
            </div>
            <div className="col-span-2 pt-1 text-amber-500 dark:text-amber-400 font-medium flex items-center gap-1">
              <Zap className="w-3 h-3 flex-shrink-0 fill-amber-400" />
              <span><b>Shift + WASD:</b> Tăng tốc x2.2</span>
            </div>
            <div className="col-span-2 pt-0.5 text-sky-400 font-medium flex items-center gap-1">
              <Bot className="w-3 h-3 flex-shrink-0" />
              <span><b>P:</b> Tự lái AI | <b>O:</b> Dựng lại cản</span>
            </div>
          </div>

          {/* Live Status Pill */}
          <div className="flex items-center justify-between text-[11px] font-mono pt-2 mt-1.5 border-t border-slate-200 dark:border-slate-800/80">
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 truncate max-w-[170px]">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  driveTelemetry.isBoost
                    ? 'bg-amber-400 ring-2 ring-amber-400/50 animate-ping'
                    : driveTelemetry.isMoving
                    ? 'bg-emerald-500 animate-ping'
                    : 'bg-slate-400'
                }`}
              />
              <span className="font-semibold truncate">{driveTelemetry.statusText}</span>
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {driveTelemetry.isBoost && (
                <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-black tracking-wider shadow-sm animate-pulse">
                  TURBO
                </span>
              )}
              <span className="text-slate-400 font-bold">{driveTelemetry.headingDeg}°</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
