import * as THREE from 'three';

export interface JetBotModelLayers {
  rootGroup: THREE.Group;
  topModuleGroup: THREE.Group;     // RPLIDAR A1 + belt drive + motor + pulley + logo
  topDeckGroup: THREE.Group;       // Top plate + brass standoffs + fan mount
  coolingFanGroup: THREE.Group;    // 40mm fan + 4 corner screws & nuts + 4-pin wire harness
  jetsonNanoGroup: THREE.Group;    // Jetson board + heatsink + ports (USB 3.0, LAN, DC)
  cameraGroup: THREE.Group;        // Lime green bracket + knurled thumbscrews + IMX219 camera
  cablesGroup: THREE.Group;        // FFC ribbon cable + antenna coax + RPLIDAR wire harness
  motorDriverGroup: THREE.Group;   // Waveshare black shield + OLED screen + A1 PWR socket + switch
  chassisGroup: THREE.Group;       // Emerald green chassis plate with wheel cutouts + brass SMA mounts
  wheelsGroup: THREE.Group;        // Left & right 10-spoke blue metallic wheels + brass couplers
  castersGroup: THREE.Group;       // DUAL casters: Front caster AND Rear caster with chrome forks
  motorsGroup: THREE.Group;        // DUAL silver cylindrical metal gear motors (GA25 style)
  batteryGroup: THREE.Group;       // 3S blue Li-ion pack + battery wiring
  fanBlades: THREE.Mesh;
  leftWheel: THREE.Group;
  rightWheel: THREE.Group;
  frontCasterSwivel: THREE.Group;
  rearCasterSwivel: THREE.Group;
  lidarRotor: THREE.Group;
  lidarPulley: THREE.Mesh;
  componentMeshes: Map<string, THREE.Object3D[]>;
}

// ==========================================
// PROCEDURAL HIGH-RESOLUTION TEXTURE GENERATORS
// ==========================================

/** Creates sparkling anodized metallic green finish with CNC bevel edge effects */
function createAnodizedGreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base metallic emerald green
  ctx.fillStyle = '#1c7d3c';
  ctx.fillRect(0, 0, 1024, 1024);

  // Micro-sparkle anodized grain
  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 36;
    data[i] = Math.max(0, Math.min(255, data[i] + noise * 0.5));        // R
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise * 1.3));// G
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise * 0.7));// B
  }
  ctx.putImageData(imgData, 0, 0);

  // Subtle circular brushed highlights matching real CNC cut aluminum
  const grad = ctx.createRadialGradient(512, 512, 60, 512, 512, 510);
  grad.addColorStop(0, 'rgba(167, 243, 208, 0.25)');
  grad.addColorStop(0.4, 'rgba(52, 211, 153, 0.1)');
  grad.addColorStop(0.85, 'rgba(16, 185, 129, 0.05)');
  grad.addColorStop(1, 'rgba(6, 78, 59, 0.4)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Fine concentric lathe / CNC milling toolpaths
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let r = 70; r < 510; r += 20) {
    ctx.beginPath();
    ctx.arc(512, 512, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/** Creates normal map for metallic plate micro-grooves */
function createAnodizedGreenNormalMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Neutral tangent-space normal (RGB: 128, 128, 255)
  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, 512, 512);

  // Concentric normal ring relief
  for (let r = 40; r < 250; r += 16) {
    ctx.strokeStyle = 'rgba(140, 140, 255, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(256, 256, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/** Creates metallic blue anodized texture for wheel rims */
function createBlueRimTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep royal blue metallic base
  ctx.fillStyle = '#0047b3';
  ctx.fillRect(0, 0, 512, 512);

  // Radial brushed specular sheen
  const grad = ctx.createRadialGradient(256, 256, 15, 256, 256, 250);
  grad.addColorStop(0, '#60a5fa');
  grad.addColorStop(0.35, '#2563eb');
  grad.addColorStop(0.75, '#1d4ed8');
  grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Concentric lathe grooves
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 1.5;
  for (let r = 25; r < 250; r += 14) {
    ctx.beginPath();
    ctx.arc(256, 256, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Creates realistic tire tread & sidewall relief normal map */
function createTireNormalMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Flat tangent-space normal
  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, 512, 512);

  // Embossed directional chevron and block tread ridges
  ctx.fillStyle = '#9090ff';
  for (let y = 0; y < 512; y += 32) {
    ctx.fillRect(0, y, 512, 14);
  }

  // Micro rubber pebbled grain
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * 12;
    data[i] = Math.max(0, Math.min(255, data[i] + n));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/** Creates authentic FFC ribbon cable texture with blue stiffener stripe and printed technical text */
function createRibbonTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Clean flat flexible cable background
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 512, 128);

  // Parallel conductor lines (15 pin gold/copper traces)
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.2;
  for (let y = 12; y < 118; y += 7) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Blue reinforcement stiffener stripe at connector end
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(470, 0, 42, 128);

  // Printed technical markings (matching photo: AWM 20706 105C 60V VW-1)
  ctx.fillStyle = '#15803d';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('AWM 20706 105C 60V VW-1  •  WAVESHARE CSI-CAM', 25, 45);
  ctx.fillText('AWM 20706 105C 60V VW-1  •  JETSON NANO BOT', 25, 85);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Creates authentic RPLIDAR top disc logo texture matching photo exactly */
function createLidarLogoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Matte dark grey/black background
  ctx.fillStyle = '#18181b';
  ctx.fillRect(0, 0, 512, 512);

  // Concentric engraved rings
  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(256, 256, 224, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#3f3f46';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(256, 256, 176, 0, Math.PI * 2);
  ctx.stroke();

  // Recessed center circular bezel
  ctx.fillStyle = '#121214';
  ctx.beginPath();
  ctx.arc(256, 256, 145, 0, Math.PI * 2);
  ctx.fill();

  // Embossed RPLIDAR text matching real sensor cap
  ctx.fillStyle = '#a1a1aa';
  ctx.font = 'bold 38px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '5px';
  ctx.fillText('RPLIDAR', 256, 256);

  // 3 Countersunk Screw indentations at 120° angles (matching user's Photo 3!)
  for (let i = 0; i < 3; i++) {
    const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
    const sx = 256 + Math.cos(angle) * 195;
    const sy = 256 + Math.sin(angle) * 195;

    // Screw recess
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.arc(sx, sy, 10, 0, Math.PI * 2);
    ctx.fill();

    // Phillips screw head slot
    ctx.strokeStyle = '#71717a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(sx - 6, sy);
    ctx.lineTo(sx + 6, sy);
    ctx.moveTo(sx, sy - 6);
    ctx.lineTo(sx, sy + 6);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Creates glowing 0.91" OLED display telemetry texture */
function createOledTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Dark OLED background
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, 256, 64);

  // Glowing Cyan OLED pixels
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('JETBOT ROS [AI]', 12, 22);

  ctx.font = '11px monospace';
  ctx.fillText('IP: 192.168.1.105', 12, 40);
  ctx.fillText('BAT: 12.4V [92%]', 12, 54);

  // Battery icon
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(192, 12, 40, 16);
  ctx.fillRect(232, 16, 3, 8);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(195, 15, 32, 10);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Creates authentic Waveshare expansion shield PCB silkscreen texture */
function createWavesharePcbTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Matte black PCB solder mask
  ctx.fillStyle = '#111317';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle copper trace routes
  ctx.strokeStyle = '#1a1f26';
  ctx.lineWidth = 2;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.moveTo(40 + i * 22, 30);
    ctx.lineTo(60 + i * 22, 200);
    ctx.lineTo(120 + i * 15, 480);
    ctx.stroke();
  }

  // Crisp white silkscreen markings matching real board in Photo 3
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('WAVESHARE JETBOT EXPANSION', 40, 48);

  ctx.font = 'bold 11px monospace';
  ctx.fillText('A1 PWR', 45, 185);
  ctx.fillText('MOTOR-L', 45, 460);
  ctx.fillText('MOTOR-R', 380, 460);
  ctx.fillText('12.6V CHG', 370, 60);
  ctx.fillText('OLED 0.91"', 210, 485);

  // Silk-screen connector pinout boxes
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(40, 195, 80, 36);

  // Golden annular solder rings around mounting standoff holes
  ctx.fillStyle = '#d97706';
  const holes = [
    [40, 40],
    [472, 40],
    [40, 472],
    [472, 472],
  ];
  holes.forEach(([hx, hy]) => {
    ctx.beginPath();
    ctx.arc(hx, hy, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.arc(hx, hy, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d97706';
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Creates Jetson Nano PCB silkscreen texture */
function createJetsonPcbTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0f1217';
  ctx.fillRect(0, 0, 512, 512);

  // Silkscreen
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('NVIDIA Jetson Nano', 30, 40);
  ctx.font = '10px monospace';
  ctx.fillText('CAM0 CSI-2', 40, 460);
  ctx.fillText('40-PIN GPIO', 180, 485);
  ctx.fillText('GBE', 420, 200);

  // Green NVIDIA logo accent
  ctx.fillStyle = '#76b900';
  ctx.fillRect(30, 48, 12, 12);

  // Chip footprints
  ctx.fillStyle = '#1f242d';
  ctx.fillRect(180, 160, 150, 150);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Creates authentic Li-ion 3S Battery Pack wrap label */
function createBatteryLabelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Blue PVC heat shrink background
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 0, 512, 256);

  // White spec label block
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(30, 40, 452, 176);

  // Dark typography
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('RECHARGEABLE Li-ion BATTERY PACK', 50, 75);

  ctx.font = 'bold 16px monospace';
  ctx.fillText('MODEL: 3S1P-18650  •  11.1V / 12.6V MAX', 50, 110);
  ctx.fillText('CAPACITY: 2600mAh (28.86Wh)', 50, 135);

  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('CAUTION: USE DEDICATED 12.6V CHARGER ONLY • DO NOT PUNCTURE', 50, 175);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Creates laser safety warning sticker for RPLIDAR turret */
function createLaserWarningTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Yellow warning label background
  ctx.fillStyle = '#facc15';
  ctx.fillRect(0, 0, 256, 128);

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CLASS 1 LASER PRODUCT', 128, 45);

  ctx.font = 'bold 12px monospace';
  ctx.fillText('785nm < 5mW • SLAMTEC', 128, 75);
  ctx.fillText('EN/IEC 60825-1:2014', 128, 95);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createJetBotModel(): JetBotModelLayers {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'JetBot_Root';

  // Subgroups for hierarchical exploded view
  const topModuleGroup = new THREE.Group();
  topModuleGroup.name = 'RPLIDAR_A1';

  const topDeckGroup = new THREE.Group();
  topDeckGroup.name = 'TopDeck';

  const coolingFanGroup = new THREE.Group();
  coolingFanGroup.name = 'CoolingFan';

  const jetsonNanoGroup = new THREE.Group();
  jetsonNanoGroup.name = 'JetsonNano';

  const cameraGroup = new THREE.Group();
  cameraGroup.name = 'CSI_Camera';

  const cablesGroup = new THREE.Group();
  cablesGroup.name = 'Cables_Interfaces';

  const motorDriverGroup = new THREE.Group();
  motorDriverGroup.name = 'Waveshare_Shield';

  const chassisGroup = new THREE.Group();
  chassisGroup.name = 'Chassis_Plate';

  const wheelsGroup = new THREE.Group();
  wheelsGroup.name = 'Drive_Wheels';

  const castersGroup = new THREE.Group();
  castersGroup.name = 'Dual_Casters';

  const motorsGroup = new THREE.Group();
  motorsGroup.name = 'Metal_Gear_Motors';

  const batteryGroup = new THREE.Group();
  batteryGroup.name = 'Battery_Pack';

  const componentMeshes = new Map<string, THREE.Object3D[]>();
  function registerMesh(componentId: string, obj: THREE.Object3D) {
    if (!componentMeshes.has(componentId)) {
      componentMeshes.set(componentId, []);
    }
    componentMeshes.get(componentId)!.push(obj);
  }

  // ==========================================
  // PROCEDURAL PBR MATERIALS MATCHING USER'S PHOTOS
  // ==========================================
  const anodizedGreenTex = createAnodizedGreenTexture();
  const anodizedGreenNormal = createAnodizedGreenNormalMap();
  const blueRimTex = createBlueRimTexture();
  const tireNormalTex = createTireNormalMap();
  const ribbonTex = createRibbonTexture();
  const lidarLogoTex = createLidarLogoTexture();
  const oledTex = createOledTexture();
  const wavesharePcbTex = createWavesharePcbTexture();
  const jetsonPcbTex = createJetsonPcbTexture();
  const batteryLabelTex = createBatteryLabelTexture();
  const laserWarningTex = createLaserWarningTexture();

  // Sparkle metallic green chassis plate with normal map
  const greenChassisMat = new THREE.MeshStandardMaterial({
    map: anodizedGreenTex,
    normalMap: anodizedGreenNormal,
    normalScale: new THREE.Vector2(0.3, 0.3),
    color: 0x228b44,
    roughness: 0.28,
    metalness: 0.78,
  });

  // Lime-green anodized aluminum camera bracket (bright and vibrant)
  const greenCameraBracketMat = new THREE.MeshStandardMaterial({
    color: 0x3cd63c,
    roughness: 0.24,
    metalness: 0.74,
  });

  // Matte black PCB / Acrylic plates
  const blackPcbMat = new THREE.MeshStandardMaterial({
    color: 0x11141a,
    roughness: 0.48,
    metalness: 0.18,
  });

  const wavesharePcbMat = new THREE.MeshStandardMaterial({
    map: wavesharePcbTex,
    roughness: 0.4,
    metalness: 0.22,
  });

  const jetsonPcbMat = new THREE.MeshStandardMaterial({
    map: jetsonPcbTex,
    roughness: 0.4,
    metalness: 0.22,
  });

  // Jetson Nano black extruded aluminum heatsink
  const heatsinkBlackMat = new THREE.MeshStandardMaterial({
    color: 0x141820,
    roughness: 0.35,
    metalness: 0.85,
  });

  // Polished chrome / stainless steel (casters, screws, USB shells)
  const chromeMetalMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.08,
    metalness: 0.98,
  });

  // GA25 silver metal cylindrical motor can
  const motorMetalMat = new THREE.MeshStandardMaterial({
    color: 0xa8a8b2,
    roughness: 0.25,
    metalness: 0.92,
  });

  // Rich golden brass standoffs & SMA connectors
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.2,
    metalness: 0.95,
  });

  // Ultra-reflective deep royal blue metallic wheel rim (exact match to user photos)
  const blueRimMat = new THREE.MeshStandardMaterial({
    map: blueRimTex,
    color: 0x0055d4,
    roughness: 0.12,
    metalness: 0.96,
  });

  // Heavy tread tire rubber with relief normal map
  const tireRubberMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    normalMap: tireNormalTex,
    normalScale: new THREE.Vector2(0.5, 0.5),
    roughness: 0.85,
    metalness: 0.05,
  });

  // Dark gray polyurethane caster wheels
  const casterWheelMat = new THREE.MeshStandardMaterial({
    color: 0x3f3f46,
    roughness: 0.55,
    metalness: 0.15,
  });

  // USB 3.0 blue tab
  const usbBlueMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.25,
    metalness: 0.1,
  });

  // FFC ribbon cable material with printed graphics
  const ribbonCableMat = new THREE.MeshStandardMaterial({
    map: ribbonTex,
    roughness: 0.45,
    metalness: 0.08,
  });

  // Camera optical glass with realistic clearcoat
  const cameraLensGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x090d16,
    roughness: 0.02,
    metalness: 0.96,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
  });

  // OLED Screen glowing display
  const oledDisplayMat = new THREE.MeshBasicMaterial({
    map: oledTex,
  });

  // Green sensor PCB inside RPLIDAR
  const greenSensorPcbMat = new THREE.MeshStandardMaterial({
    color: 0x15803d,
    roughness: 0.45,
    metalness: 0.2,
  });

  // White JST-XH nylon connector
  const jstWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.35,
    metalness: 0.05,
  });

  // Li-ion Battery Label Material
  const batteryLabelMat = new THREE.MeshStandardMaterial({
    map: batteryLabelTex,
    roughness: 0.4,
    metalness: 0.1,
  });

  // Laser Warning Label Material
  const laserWarningMat = new THREE.MeshStandardMaterial({
    map: laserWarningTex,
    roughness: 0.5,
    metalness: 0.05,
  });

  // ==========================================
  // 1. CHASSIS BASE WITH DUAL SIDE WHEEL CUTOUTS
  // ==========================================
  const chassisShape = new THREE.Shape();
  const chassisRadius = 1.75;
  chassisShape.absarc(0, 0, chassisRadius, 0, Math.PI * 2, false);

  // Left wheel cutout hole
  const leftHole = new THREE.Path();
  leftHole.moveTo(-1.8, -0.62);
  leftHole.lineTo(-1.18, -0.62);
  leftHole.lineTo(-1.18, 0.52);
  leftHole.lineTo(-1.8, 0.52);
  leftHole.closePath();
  chassisShape.holes.push(leftHole);

  // Right wheel cutout hole
  const rightHole = new THREE.Path();
  rightHole.moveTo(1.18, -0.62);
  rightHole.lineTo(1.8, -0.62);
  rightHole.lineTo(1.8, 0.52);
  rightHole.lineTo(1.18, 0.52);
  rightHole.closePath();
  chassisShape.holes.push(rightHole);

  // Wire slot holes in chassis
  const wireSlotHole = new THREE.Path();
  wireSlotHole.moveTo(-0.15, -0.2);
  wireSlotHole.lineTo(0.15, -0.2);
  wireSlotHole.lineTo(0.15, -0.1);
  wireSlotHole.lineTo(-0.15, -0.1);
  wireSlotHole.closePath();
  chassisShape.holes.push(wireSlotHole);

  const chassisGeom = new THREE.ExtrudeGeometry(chassisShape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 3,
  });
  chassisGeom.rotateX(Math.PI / 2);

  const chassisMesh = new THREE.Mesh(chassisGeom, greenChassisMat);
  chassisMesh.castShadow = true;
  chassisMesh.receiveShadow = true;
  chassisGroup.add(chassisMesh);
  registerMesh('wheels-chassis', chassisMesh);

  // CNC Edge Chamfer Highlight Rings (Borders with metallic silver bevel shine)
  const chamferRingGeom = new THREE.TorusGeometry(1.74, 0.008, 6, 48);
  chamferRingGeom.rotateX(Math.PI / 2);
  const chamferTop = new THREE.Mesh(chamferRingGeom, chromeMetalMat);
  chamferTop.position.y = 0.032;
  chassisGroup.add(chamferTop);

  // Standoff screw holes on chassis plate (Silver countersunk screws)
  const chassisScrewGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.015, 12);
  [
    [-0.65, 0.035, -0.7],
    [0.65, 0.035, -0.7],
    [-0.65, 0.035, 0.6],
    [0.65, 0.035, 0.6],
    [0, 0.035, 1.25],
    [0, 0.035, -1.25],
  ].forEach(([sx, sy, sz]) => {
    const scr = new THREE.Mesh(chassisScrewGeom, chromeMetalMat);
    scr.position.set(sx, sy, sz);
    chassisGroup.add(scr);
  });

  // Brass hexagonal standoffs (4 primary support pillars with M3 threads)
  const standoffGeom = new THREE.CylinderGeometry(0.045, 0.045, 0.65, 6);
  const standoffCoords = [
    [-0.65, 0.32, -0.7],
    [0.65, 0.32, -0.7],
    [-0.65, 0.32, 0.6],
    [0.65, 0.32, 0.6],
  ];
  standoffCoords.forEach(([x, y, z]) => {
    const post = new THREE.Mesh(standoffGeom, brassMat);
    post.position.set(x, y, z);
    post.castShadow = true;
    chassisGroup.add(post);
    registerMesh('wheels-chassis', post);
  });

  // Brass SMA Bulkhead Antenna Connectors on rear corners of green chassis (exact match to photo!)
  const smaBaseGeom = new THREE.CylinderGeometry(0.075, 0.075, 0.12, 6);
  const smaWasherGeom = new THREE.CylinderGeometry(0.09, 0.09, 0.02, 16);
  [-1.15, 1.15].forEach(x => {
    const smaWasher = new THREE.Mesh(smaWasherGeom, chromeMetalMat);
    smaWasher.position.set(x, 0.04, -1.05);
    chassisGroup.add(smaWasher);

    const smaHex = new THREE.Mesh(smaBaseGeom, brassMat);
    smaHex.position.set(x, 0.09, -1.05);
    chassisGroup.add(smaHex);
    registerMesh('cables-interfaces', smaHex);

    // Coaxial black antenna wire running from underneath
    const coaxWire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.35, 8),
      blackPcbMat
    );
    coaxWire.position.set(x, -0.15, -1.05);
    chassisGroup.add(coaxWire);
    registerMesh('cables-interfaces', coaxWire);
  });

  // Dual tall Wi-Fi Antennas with knurled hinge
  function createWiFiAntenna(): THREE.Group {
    const ag = new THREE.Group();
    // Swivel knuckle
    const knuckle = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.12, 0.09), blackPcbMat);
    knuckle.position.set(0, 0.12, 0);
    ag.add(knuckle);

    // Rubber duck mast
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.065, 2.1, 16), blackPcbMat);
    mast.position.set(0, 1.15, 0);
    mast.castShadow = true;
    ag.add(mast);

    return ag;
  }

  const leftAntenna = createWiFiAntenna();
  leftAntenna.position.set(-1.15, 0.09, -1.05);
  leftAntenna.rotation.z = 0.08;
  chassisGroup.add(leftAntenna);
  registerMesh('cables-interfaces', leftAntenna);

  const rightAntenna = createWiFiAntenna();
  rightAntenna.position.set(1.15, 0.09, -1.05);
  rightAntenna.rotation.z = -0.08;
  chassisGroup.add(rightAntenna);
  registerMesh('cables-interfaces', rightAntenna);

  // ==========================================
  // 2. DUAL CASTERS (FRONT & REAR SWIVEL CASTERS)
  // ==========================================
  function createSwivelCaster(): THREE.Group {
    const cg = new THREE.Group();

    // Stamped square chrome baseplate
    const baseplateGeom = new THREE.BoxGeometry(0.48, 0.04, 0.48);
    const baseplate = new THREE.Mesh(baseplateGeom, chromeMetalMat);
    baseplate.position.set(0, -0.02, 0);
    baseplate.castShadow = true;
    cg.add(baseplate);

    // 4 Corner mounting screws
    const screwGeom = new THREE.CylinderGeometry(0.035, 0.035, 0.06, 12);
    [
      [-0.18, 0.01, -0.18],
      [0.18, 0.01, -0.18],
      [-0.18, 0.01, 0.18],
      [0.18, 0.01, 0.18],
    ].forEach(([sx, sy, sz]) => {
      const scr = new THREE.Mesh(screwGeom, chromeMetalMat);
      scr.position.set(sx, sy, sz);
      cg.add(scr);
    });

    // Swivel race / bearing crown
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 16), chromeMetalMat);
    crown.position.set(0, -0.08, 0);
    cg.add(crown);

    // Chrome swivel horn/fork
    const forkLeft = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.34, 0.22), chromeMetalMat);
    forkLeft.position.set(-0.16, -0.23, 0.04);
    forkLeft.rotation.z = 0.1;
    cg.add(forkLeft);

    const forkRight = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.34, 0.22), chromeMetalMat);
    forkRight.position.set(0.16, -0.23, 0.04);
    forkRight.rotation.z = -0.1;
    cg.add(forkRight);

    // Wheel axle bolt with hexagonal nuts
    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.38, 12), chromeMetalMat);
    axle.rotateZ(Math.PI / 2);
    axle.position.set(0, -0.32, 0.04);
    cg.add(axle);

    const axleNut = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.06, 6), chromeMetalMat);
    axleNut.rotateZ(Math.PI / 2);
    axleNut.position.set(0.2, -0.32, 0.04);
    cg.add(axleNut);

    // Caster roller wheel
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.22, 24), casterWheelMat);
    wheel.rotateZ(Math.PI / 2);
    wheel.position.set(0, -0.32, 0.04);
    wheel.castShadow = true;
    cg.add(wheel);

    return cg;
  }

  const frontCasterSwivel = createSwivelCaster();
  frontCasterSwivel.position.set(0, 0, 1.25);
  castersGroup.add(frontCasterSwivel);
  registerMesh('wheels-chassis', frontCasterSwivel);

  const rearCasterSwivel = createSwivelCaster();
  rearCasterSwivel.position.set(0, 0, -1.25);
  castersGroup.add(rearCasterSwivel);
  registerMesh('wheels-chassis', rearCasterSwivel);

  // ==========================================
  // 3. DC GEAR MOTORS (CYLINDRICAL GA25 METAL MOTORS)
  // ==========================================
  function createMetalGearMotor(isRight: boolean): THREE.Group {
    const mg = new THREE.Group();

    // Motor cylindrical galvanized steel can
    const motorCanGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.65, 24);
    motorCanGeom.rotateZ(Math.PI / 2);
    const motorCan = new THREE.Mesh(motorCanGeom, motorMetalMat);
    motorCan.castShadow = true;
    mg.add(motorCan);
    registerMesh('dc-motors', motorCan);

    // Precision reduction gearbox faceplate
    const gearboxFace = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.25, 0.08, 24),
      chromeMetalMat
    );
    gearboxFace.rotateZ(Math.PI / 2);
    gearboxFace.position.set(isRight ? 0.35 : -0.35, 0, 0);
    mg.add(gearboxFace);
    registerMesh('dc-motors', gearboxFace);

    // Brass hexagonal motor-wheel coupler with set screws (exact match to photo!)
    const coupler = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.32, 6), brassMat);
    coupler.rotateZ(Math.PI / 2);
    coupler.position.set(isRight ? 0.52 : -0.52, 0, 0);
    mg.add(coupler);
    registerMesh('dc-motors', coupler);

    // Coupler tiny black set screws
    const setScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.19, 8), blackPcbMat);
    setScrew.position.set(isRight ? 0.52 : -0.52, 0, 0);
    mg.add(setScrew);

    // Motor rear encoder disc and connector socket
    const encoderDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.23, 0.23, 0.1, 16),
      blackPcbMat
    );
    encoderDisc.rotateZ(Math.PI / 2);
    encoderDisc.position.set(isRight ? -0.36 : 0.36, 0, 0);
    mg.add(encoderDisc);

    // Encoder wire harness (red, black, white, green wires)
    const wireGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.35, 6);
    const wire = new THREE.Mesh(wireGeom, new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    wire.position.set(isRight ? -0.4 : 0.4, 0.12, 0.05);
    wire.rotation.z = isRight ? 0.4 : -0.4;
    mg.add(wire);

    // Green anodized aluminum L-bracket securing motor to chassis
    const mountBracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.55, 0.5),
      greenChassisMat
    );
    mountBracket.position.set(isRight ? 0.28 : -0.28, 0.18, 0);
    mg.add(mountBracket);

    return mg;
  }

  const leftMotor = createMetalGearMotor(false);
  leftMotor.position.set(-0.62, -0.32, -0.05);
  motorsGroup.add(leftMotor);

  const rightMotor = createMetalGearMotor(true);
  rightMotor.position.set(0.62, -0.32, -0.05);
  motorsGroup.add(rightMotor);

  // ==========================================
  // 4. DRIVE WHEELS (10-SPOKE METALLIC BLUE RIMS & TREADS)
  // ==========================================
  function createDriveWheel(isRight: boolean): THREE.Group {
    const wg = new THREE.Group();

    // Heavy Rubber Tire
    const tireGeom = new THREE.CylinderGeometry(0.72, 0.72, 0.42, 36);
    tireGeom.rotateZ(Math.PI / 2);
    const tire = new THREE.Mesh(tireGeom, tireRubberMat);
    tire.castShadow = true;
    wg.add(tire);
    registerMesh('wheels-chassis', tire);

    // Chunky aggressive off-road tread blocks (matching photo: bold staggered rectangular blocks)
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const blockGeom = new THREE.BoxGeometry(0.43, 0.05, 0.09);
      const block = new THREE.Mesh(blockGeom, tireRubberMat);
      block.position.set(0, Math.sin(angle) * 0.71, Math.cos(angle) * 0.71);
      block.rotation.x = -angle;
      wg.add(block);
    }

    // Outer Chrome Rim Lip
    const outerRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.56, 0.56, 0.38, 32),
      blueRimMat
    );
    outerRing.rotateZ(Math.PI / 2);
    outerRing.castShadow = true;
    wg.add(outerRing);
    registerMesh('wheels-chassis', outerRing);

    // 10-Spoke Curved Anodized Electric Blue Rim
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const spokeGeom = new THREE.BoxGeometry(0.39, 0.48, 0.05);
      const spoke = new THREE.Mesh(spokeGeom, blueRimMat);
      spoke.position.set(
        isRight ? 0.04 : -0.04,
        Math.sin(angle) * 0.26,
        Math.cos(angle) * 0.26
      );
      spoke.rotation.x = -angle;
      spoke.rotation.y = isRight ? 0.12 : -0.12;
      wg.add(spoke);
    }

    // Deep-dish center hub with center silver Phillips screw
    const centerCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.42, 16),
      blueRimMat
    );
    centerCap.rotateZ(Math.PI / 2);
    wg.add(centerCap);

    // 5 Lug nut indents
    for (let j = 0; j < 5; j++) {
      const la = (j / 5) * Math.PI * 2;
      const lug = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.44, 6),
        chromeMetalMat
      );
      lug.rotateZ(Math.PI / 2);
      lug.position.set(0, Math.sin(la) * 0.11, Math.cos(la) * 0.11);
      wg.add(lug);
    }

    const centerScrew = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.45, 12),
      chromeMetalMat
    );
    centerScrew.rotateZ(Math.PI / 2);
    wg.add(centerScrew);

    return wg;
  }

  const leftWheel = createDriveWheel(false);
  leftWheel.position.set(-1.48, -0.32, -0.05);
  wheelsGroup.add(leftWheel);

  const rightWheel = createDriveWheel(true);
  rightWheel.position.set(1.48, -0.32, -0.05);
  wheelsGroup.add(rightWheel);

  // ==========================================
  // 5. BATTERY PACK (3S BLUE LI-ION CELLS WITH SPEC LABEL)
  // ==========================================
  const batteryPack = new THREE.Group();
  for (let i = -1; i <= 1; i++) {
    const cellGeom = new THREE.CylinderGeometry(0.16, 0.16, 1.25, 20);
    cellGeom.rotateX(Math.PI / 2);
    const cell = new THREE.Mesh(
      cellGeom,
      new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.42,
        metalness: 0.12,
      })
    );
    cell.position.set(i * 0.36, 0.14, 0.0);
    cell.castShadow = true;
    batteryPack.add(cell);
    registerMesh('power-battery', cell);
  }

  // Realistic technical specification label on top of battery pack
  const bLabelMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.42), batteryLabelMat);
  bLabelMesh.rotateX(-Math.PI / 2);
  bLabelMesh.position.set(0, 0.305, 0);
  batteryPack.add(bLabelMesh);

  // Thick 16AWG red/black power leads with yellow XT60 connector
  const bWireRed = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
  bWireRed.position.set(0.15, 0.22, -0.45);
  batteryPack.add(bWireRed);

  const bWireBlack = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8), new THREE.MeshBasicMaterial({ color: 0x09090b }));
  bWireBlack.position.set(0.05, 0.22, -0.45);
  batteryPack.add(bWireBlack);

  const xt60 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.18), new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3 }));
  xt60.position.set(0.1, 0.22, -0.58);
  batteryPack.add(xt60);

  batteryGroup.add(batteryPack);

  // ==========================================
  // 6. WAVESHARE EXPANSION SHIELD BOARD (Black PCB)
  // ==========================================
  const wavesharePcbGeom = new THREE.BoxGeometry(1.85, 0.05, 1.6);
  const wavesharePcb = new THREE.Mesh(wavesharePcbGeom, wavesharePcbMat);
  wavesharePcb.position.set(0, 0.32, 0);
  wavesharePcb.castShadow = true;
  motorDriverGroup.add(wavesharePcb);
  registerMesh('motor-driver', wavesharePcb);

  // 0.91" OLED Screen with live telemetry texture
  const oledBezel = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.04, 0.22), blackPcbMat);
  oledBezel.position.set(0, 0.36, -0.62);
  motorDriverGroup.add(oledBezel);

  const oledScreenGeom = new THREE.PlaneGeometry(0.48, 0.16);
  oledScreenGeom.rotateX(-Math.PI / 2);
  const oledScreen = new THREE.Mesh(oledScreenGeom, oledDisplayMat);
  oledScreen.position.set(0, 0.385, -0.62);
  motorDriverGroup.add(oledScreen);
  registerMesh('motor-driver', oledScreen);

  // Dual Motor Driver H-Bridge ICs with mini aluminum heatsinks
  [-0.45, 0.45].forEach(x => {
    const driverIc = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.2), blackPcbMat);
    driverIc.position.set(x, 0.36, 0.05);
    motorDriverGroup.add(driverIc);

    // Micro heatsink fins
    const icSink = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.18), heatsinkBlackMat);
    icSink.position.set(x, 0.41, 0.05);
    motorDriverGroup.add(icSink);
  });

  // Power switch (ON/OFF red & silver slider switch)
  const switchBox = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.12), chromeMetalMat);
  switchBox.position.set(-0.65, 0.38, -0.65);
  motorDriverGroup.add(switchBox);

  const switchLever = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.08), blackPcbMat);
  switchLever.position.set(-0.68, 0.45, -0.65);
  motorDriverGroup.add(switchLever);
  registerMesh('motor-driver', switchBox);

  // 12.6V DC charge jack
  const chargeJack = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16),
    chromeMetalMat
  );
  chargeJack.rotateX(Math.PI / 2);
  chargeJack.position.set(0.68, 0.38, -0.65);
  motorDriverGroup.add(chargeJack);
  registerMesh('power-battery', chargeJack);

  // "A1 PWR" 4-Pin JST-XH white socket on Waveshare shield (Photo 3!)
  const a1PwrSocket = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.14, 0.12), jstWhiteMat);
  a1PwrSocket.position.set(-0.72, 0.38, 0.35);
  motorDriverGroup.add(a1PwrSocket);
  registerMesh('motor-driver', a1PwrSocket);
  registerMesh('cables-interfaces', a1PwrSocket);

  // Status Indicator LEDs (PWR Red + RUN Green)
  const pwrLed = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.03, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
  pwrLed.position.set(-0.52, 0.36, -0.58);
  motorDriverGroup.add(pwrLed);

  const runLed = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.03, 8), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
  runLed.position.set(-0.46, 0.36, -0.58);
  motorDriverGroup.add(runLed);

  // ==========================================
  // 7. NVIDIA JETSON NANO BOARD & HEATSINK
  // ==========================================
  const jetsonPcbGeom = new THREE.BoxGeometry(1.85, 0.05, 1.55);
  const jetsonPcb = new THREE.Mesh(jetsonPcbGeom, jetsonPcbMat);
  jetsonPcb.position.set(0, 0.62, 0.05);
  jetsonPcb.castShadow = true;
  jetsonNanoGroup.add(jetsonPcb);
  registerMesh('jetson-nano', jetsonPcb);

  // Finned Aluminum Heatsink (Iconic NVIDIA black heatsink)
  const heatsinkBaseGeom = new THREE.BoxGeometry(1.05, 0.12, 0.95);
  const heatsinkBase = new THREE.Mesh(heatsinkBaseGeom, heatsinkBlackMat);
  heatsinkBase.position.set(-0.12, 0.74, 0.05);
  heatsinkBase.castShadow = true;
  jetsonNanoGroup.add(heatsinkBase);
  registerMesh('jetson-nano', heatsinkBase);
  registerMesh('cooling-fan', heatsinkBase);

  // 14 Vertical cooling fins
  const finGeom = new THREE.BoxGeometry(0.035, 0.26, 0.95);
  for (let i = 0; i < 14; i++) {
    const fin = new THREE.Mesh(finGeom, heatsinkBlackMat);
    fin.position.set(-0.62 + i * 0.078, 0.91, 0.05);
    fin.castShadow = true;
    jetsonNanoGroup.add(fin);
    registerMesh('cooling-fan', fin);
  }

  // 4x USB 3.0 Stacked Ports (silver block with blue tabs on right edge)
  const usbBlock = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.32, 0.58), chromeMetalMat);
  usbBlock.position.set(0.74, 0.8, -0.2);
  usbBlock.castShadow = true;
  jetsonNanoGroup.add(usbBlock);
  registerMesh('cables-interfaces', usbBlock);
  registerMesh('jetson-nano', usbBlock);

  // Blue interior port indicators
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      const usbTab = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.18), usbBlueMat);
      usbTab.position.set(0.94, 0.72 + r * 0.14, -0.34 + c * 0.24);
      jetsonNanoGroup.add(usbTab);
      registerMesh('cables-interfaces', usbTab);
    }
  }

  // Gigabit RJ45 Ethernet Port with metal shield and LEDs
  const rj45 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.28, 0.38), chromeMetalMat);
  rj45.position.set(0.74, 0.78, 0.36);
  rj45.castShadow = true;
  jetsonNanoGroup.add(rj45);
  registerMesh('cables-interfaces', rj45);

  const rj45LedGreen = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 0.03, 0.04),
    new THREE.MeshBasicMaterial({ color: 0x22c55e })
  );
  rj45LedGreen.position.set(0.94, 0.86, 0.24);
  jetsonNanoGroup.add(rj45LedGreen);

  // DC Barrel 5V Power Jack
  const dcJack = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.24, 16), blackPcbMat);
  dcJack.rotateZ(Math.PI / 2);
  dcJack.position.set(0.76, 0.72, -0.62);
  jetsonNanoGroup.add(dcJack);
  registerMesh('cables-interfaces', dcJack);

  // 40-Pin GPIO Header (dual row gold pins)
  const gpioBar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.14), blackPcbMat);
  gpioBar.position.set(-0.12, 0.68, -0.62);
  jetsonNanoGroup.add(gpioBar);
  registerMesh('cables-interfaces', gpioBar);

  for (let i = 0; i < 20; i++) {
    const pin = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 0.02), brassMat);
    pin.position.set(-0.65 + i * 0.055, 0.74, -0.64);
    jetsonNanoGroup.add(pin);
  }

  // Camera CSI Connector socket on Jetson Nano with white latch
  const csiSocket = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.08), jstWhiteMat);
  csiSocket.position.set(0.06, 0.68, 0.42);
  jetsonNanoGroup.add(csiSocket);
  registerMesh('cables-interfaces', csiSocket);

  // ==========================================
  // 8. 40MM COOLING FAN WITH 4 CORNER SCREWS & WIRES
  // ==========================================
  const fanFrameGeom = new THREE.BoxGeometry(0.88, 0.14, 0.88);
  const fanFrame = new THREE.Mesh(fanFrameGeom, blackPcbMat);
  fanFrame.position.set(-0.12, 1.12, 0.05);
  fanFrame.castShadow = true;
  coolingFanGroup.add(fanFrame);
  registerMesh('cooling-fan', fanFrame);

  // 4 Silver Mounting Screws & nuts at fan corners (exact match to photo!)
  const fanScrewGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.06, 12);
  const fanNutGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.03, 6);
  [
    [-0.48, 1.2, -0.32],
    [0.24, 1.2, -0.32],
    [-0.48, 1.2, 0.42],
    [0.24, 1.2, 0.42],
  ].forEach(([x, y, z]) => {
    const scr = new THREE.Mesh(fanScrewGeom, chromeMetalMat);
    scr.position.set(x, y, z);
    coolingFanGroup.add(scr);

    const nut = new THREE.Mesh(fanNutGeom, chromeMetalMat);
    nut.position.set(x, 1.04, z);
    coolingFanGroup.add(nut);
  });

  // Fan spinning blades with center hub
  const rotorHubGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 20);
  const fanBlades = new THREE.Mesh(rotorHubGeom, blackPcbMat);
  fanBlades.position.set(-0.12, 1.12, 0.05);

  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2;
    const bladeGeom = new THREE.BoxGeometry(0.26, 0.02, 0.09);
    const blade = new THREE.Mesh(bladeGeom, blackPcbMat);
    blade.position.set(Math.cos(angle) * 0.22, 0, Math.sin(angle) * 0.22);
    blade.rotation.y = -angle;
    blade.rotation.z = 0.35;
    fanBlades.add(blade);
  }
  coolingFanGroup.add(fanBlades);
  registerMesh('cooling-fan', fanBlades);

  // Fan wire harness (red, black, yellow wires curved towards socket)
  const fanWireCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.3, 1.12, 0.35),
    new THREE.Vector3(0.5, 0.95, 0.2),
    new THREE.Vector3(0.45, 0.7, -0.1),
  ]);
  const fanWireGeom = new THREE.TubeGeometry(fanWireCurve, 12, 0.02, 6, false);
  const fanWire = new THREE.Mesh(fanWireGeom, new THREE.MeshBasicMaterial({ color: 0xef4444 }));
  coolingFanGroup.add(fanWire);
  registerMesh('cooling-fan', fanWire);

  // ==========================================
  // 9. CSI CAMERA & LIME-GREEN ALUMINUM BRACKET
  // ==========================================
  const bracketFoot = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.05, 0.35),
    greenCameraBracketMat
  );
  bracketFoot.position.set(0, 0.26, 1.35);
  cameraGroup.add(bracketFoot);
  registerMesh('camera', bracketFoot);

  // Screws holding camera bracket to chassis
  [-0.14, 0.14].forEach(x => {
    const bScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.04, 12), chromeMetalMat);
    bScrew.position.set(x, 0.29, 1.35);
    cameraGroup.add(bScrew);
  });

  // Upright tilted green neck with reinforcement flanges
  const bracketNeck = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.72, 0.06),
    greenCameraBracketMat
  );
  bracketNeck.position.set(0, 0.58, 1.4);
  bracketNeck.rotation.x = -0.12;
  bracketNeck.castShadow = true;
  cameraGroup.add(bracketNeck);
  registerMesh('camera', bracketNeck);

  // Knurled Thumbscrews on sides for pitch adjustment (Ốc siết khía rãnh kim loại)
  const knurlGeom = new THREE.CylinderGeometry(0.065, 0.065, 0.18, 16);
  knurlGeom.rotateZ(Math.PI / 2);
  [-0.26, 0.26].forEach(x => {
    const knurl = new THREE.Mesh(knurlGeom, chromeMetalMat);
    knurl.position.set(x, 0.88, 1.44);
    cameraGroup.add(knurl);
    registerMesh('camera', knurl);

    const lockNut = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 6), chromeMetalMat);
    lockNut.rotateZ(Math.PI / 2);
    lockNut.position.set(x > 0 ? x + 0.1 : x - 0.1, 0.88, 1.44);
    cameraGroup.add(lockNut);
  });

  // Camera swivel plate holding sensor
  const camHeadPlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.36, 0.04),
    greenCameraBracketMat
  );
  camHeadPlate.position.set(0, 0.88, 1.46);
  cameraGroup.add(camHeadPlate);
  registerMesh('camera', camHeadPlate);

  // Sony IMX219 Camera Sensor module
  const camPcb = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.04), blackPcbMat);
  camPcb.position.set(0, 0.88, 1.5);
  camPcb.castShadow = true;
  cameraGroup.add(camPcb);
  registerMesh('camera', camPcb);

  // Wide-angle lens barrel with focus ring
  const lensBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.11, 0.18, 20),
    blackPcbMat
  );
  lensBarrel.rotateX(Math.PI / 2);
  lensBarrel.position.set(0, 0.88, 1.6);
  lensBarrel.castShadow = true;
  cameraGroup.add(lensBarrel);
  registerMesh('camera', lensBarrel);

  // Front camera optic glass element with iridescent rainbow coating
  const lensGlass = new THREE.Mesh(new THREE.CircleGeometry(0.075, 20), cameraLensGlassMat);
  lensGlass.position.set(0, 0.88, 1.7);
  cameraGroup.add(lensGlass);
  registerMesh('camera', lensGlass);

  // FFC CSI Ribbon Cable with printed texture curving gracefully
  const ribbonCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.86, 1.54),
    new THREE.Vector3(0.04, 1.15, 1.25),
    new THREE.Vector3(0.08, 1.02, 0.82),
    new THREE.Vector3(0.06, 0.72, 0.44),
  ]);
  const ribbonGeom = new THREE.TubeGeometry(ribbonCurve, 24, 0.09, 4, false);
  const ribbon = new THREE.Mesh(ribbonGeom, ribbonCableMat);
  cablesGroup.add(ribbon);
  registerMesh('cables-interfaces', ribbon);
  registerMesh('camera', ribbon);

  // ==========================================
  // 10. RPLIDAR A1 SENSOR WITH BELT DRIVE & LOGO CAP
  // ==========================================
  const topDeckGeom = new THREE.BoxGeometry(1.65, 0.05, 1.35);
  const topDeck = new THREE.Mesh(topDeckGeom, blackPcbMat);
  topDeck.position.set(0, 1.32, -0.05);
  topDeck.castShadow = true;
  topDeckGroup.add(topDeck);
  registerMesh('wheels-chassis', topDeck);

  // Standoff pillars holding top deck
  const topStandoffGeom = new THREE.CylinderGeometry(0.035, 0.035, 0.65, 6);
  [
    [-0.68, 0.98, -0.6],
    [0.68, 0.98, -0.6],
    [-0.68, 0.98, 0.5],
    [0.68, 0.98, 0.5],
  ].forEach(([x, y, z]) => {
    const post = new THREE.Mesh(topStandoffGeom, brassMat);
    post.position.set(x, y, z);
    topDeckGroup.add(post);
  });

  // Black standoffs holding RPLIDAR baseplate above top deck
  const lidarStandoffGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.16, 6);
  [
    [-0.52, 1.4, -0.45],
    [0.52, 1.4, -0.45],
    [-0.52, 1.4, 0.35],
    [0.52, 1.4, 0.35],
  ].forEach(([lx, ly, lz]) => {
    const lpost = new THREE.Mesh(lidarStandoffGeom, blackPcbMat);
    lpost.position.set(lx, ly, lz);
    topModuleGroup.add(lpost);
  });

  // RPLIDAR A1 Teardrop Baseplate
  const rplidarBaseMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.62, 0.64, 0.08, 32),
    blackPcbMat
  );
  rplidarBaseMesh.position.set(0, 1.48, -0.05);
  topModuleGroup.add(rplidarBaseMesh);

  // Green circular sensor PCB visible underneath turret as seen in Photo 2
  const lidarGreenPcb = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.58, 0.03, 32),
    greenSensorPcbMat
  );
  lidarGreenPcb.position.set(0, 1.52, -0.05);
  topModuleGroup.add(lidarGreenPcb);

  // Offset belt-drive motor can (motor kéo dây curoa)
  const beltMotorCan = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.32, 20),
    motorMetalMat
  );
  beltMotorCan.position.set(0, 1.54, 0.48);
  beltMotorCan.castShadow = true;
  topModuleGroup.add(beltMotorCan);

  // Motor drive pulley with toothed grooves
  const lidarPulley = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.12, 16),
    blackPcbMat
  );
  lidarPulley.position.set(0, 1.72, 0.48);
  topModuleGroup.add(lidarPulley);

  // Black Rubber Drive Belt (Dây curoa cao su nối từ motor sang đầu quét)
  const beltCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.08, 1.72, 0.48),
    new THREE.Vector3(0.55, 1.72, -0.05),
    new THREE.Vector3(-0.55, 1.72, -0.05),
    new THREE.Vector3(-0.08, 1.72, 0.48),
  ], true);
  const beltGeom = new THREE.TubeGeometry(beltCurve, 24, 0.035, 6, true);
  const beltMesh = new THREE.Mesh(beltGeom, tireRubberMat);
  topModuleGroup.add(beltMesh);

  // Multi-color wire harness from RPLIDAR down to Waveshare board "A1 PWR" socket (Photo 3!)
  const a1WireCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.12, 1.48, 0.35),
    new THREE.Vector3(-0.45, 1.15, 0.42),
    new THREE.Vector3(-0.68, 0.72, 0.38),
    new THREE.Vector3(-0.72, 0.42, 0.35),
  ]);
  const a1WireGeom = new THREE.TubeGeometry(a1WireCurve, 16, 0.022, 6, false);
  const a1Wire = new THREE.Mesh(a1WireGeom, new THREE.MeshBasicMaterial({ color: 0x1e293b }));
  cablesGroup.add(a1Wire);
  registerMesh('cables-interfaces', a1Wire);

  // Rotating Laser Head (LiDAR Rotor with "RPLIDAR" cap)
  const lidarRotor = new THREE.Group();
  lidarRotor.position.set(0, 1.72, -0.05);

  // Scanner cylindrical body
  const scannerBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.54, 0.54, 0.42, 32),
    blackPcbMat
  );
  scannerBody.castShadow = true;
  lidarRotor.add(scannerBody);

  // Laser warning label on side of scanner turret
  const warningLabelMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.26, 0.12),
    laserWarningMat
  );
  warningLabelMesh.position.set(0.48, 0, 0.22);
  warningLabelMesh.rotation.y = Math.PI / 4;
  lidarRotor.add(warningLabelMesh);

  // Optical laser transmitter & receiver window
  const laserWindow = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.16, 0.16),
    new THREE.MeshBasicMaterial({ color: 0x991b1b })
  );
  laserWindow.position.set(0, 0.04, 0.5);
  lidarRotor.add(laserWindow);

  // Top Cap with authentic engraved "RPLIDAR" texture
  const capGeom = new THREE.CircleGeometry(0.55, 32);
  capGeom.rotateX(-Math.PI / 2);
  const topCap = new THREE.Mesh(
    capGeom,
    new THREE.MeshStandardMaterial({
      map: lidarLogoTex,
      roughness: 0.38,
      metalness: 0.58,
    })
  );
  topCap.position.set(0, 0.22, 0);
  lidarRotor.add(topCap);

  topModuleGroup.add(lidarRotor);

  // ==========================================
  // ASSEMBLE ALL GROUPS INTO ROOT
  // ==========================================
  rootGroup.add(chassisGroup);
  rootGroup.add(wheelsGroup);
  rootGroup.add(castersGroup);
  rootGroup.add(motorsGroup);
  rootGroup.add(batteryGroup);
  rootGroup.add(motorDriverGroup);
  rootGroup.add(jetsonNanoGroup);
  rootGroup.add(coolingFanGroup);
  rootGroup.add(cameraGroup);
  rootGroup.add(cablesGroup);
  rootGroup.add(topDeckGroup);
  rootGroup.add(topModuleGroup);

  return {
    rootGroup,
    topModuleGroup,
    topDeckGroup,
    coolingFanGroup,
    jetsonNanoGroup,
    cameraGroup,
    cablesGroup,
    motorDriverGroup,
    chassisGroup,
    wheelsGroup,
    castersGroup,
    motorsGroup,
    batteryGroup,
    fanBlades,
    leftWheel,
    rightWheel,
    frontCasterSwivel,
    rearCasterSwivel,
    lidarRotor,
    lidarPulley,
    componentMeshes,
  };
}

/**
 * Updates the positions of the layers based on explodedAmount [0.0 - 1.0]
 */
export function updateExplodedState(layers: JetBotModelLayers, explodedAmount: number) {
  const e = Math.max(0, Math.min(1, explodedAmount));

  // Top RPLIDAR module lifts high
  layers.topModuleGroup.position.y = e * 2.3;

  // Top deck plate
  layers.topDeckGroup.position.y = e * 1.6;

  // Cooling fan & screws
  layers.coolingFanGroup.position.y = e * 1.15;

  // Jetson Nano board & heatsink
  layers.jetsonNanoGroup.position.y = e * 0.75;

  // CSI Camera moves forward & slightly up
  layers.cameraGroup.position.y = e * 0.45;
  layers.cameraGroup.position.z = e * 0.4;

  // Cable harnesses
  layers.cablesGroup.position.y = e * 0.6;

  // Waveshare Motor Driver Shield
  layers.motorDriverGroup.position.y = e * 0.28;

  // Chassis plate stays at Y = 0 as anchor
  layers.chassisGroup.position.y = 0;

  // DC Metal Gear motors lower down
  layers.motorsGroup.position.y = -e * 0.65;

  // Battery pack drops lower
  layers.batteryGroup.position.y = -e * 1.05;

  // Wheels slide outward for exploded cutaway
  layers.leftWheel.position.x = -1.48 - e * 0.55;
  layers.rightWheel.position.x = 1.48 + e * 0.55;

  // Dual casters drop down
  layers.castersGroup.position.y = -e * 0.5;
}
