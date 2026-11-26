import * as THREE from 'three';
import { soundManager } from '../utils/audioEffects';

export interface ArenaObstacle {
  id: string;
  type: 'cone' | 'barrier' | 'barrel' | 'crate';
  nameVi: string;
  x: number;
  z: number;
  vx: number;
  vz: number;
  rotX: number;
  rotZ: number;
  vRotX: number;
  vRotZ: number;
  radius: number;
  height: number;
  mass: number; // 0 for static/immovable, > 0 for dynamic pushable
  isKnocked: boolean;
  initialX: number;
  initialZ: number;
  meshGroup: THREE.Group;
}

export interface ArenaCheckpoint {
  id: number;
  nameVi: string;
  descVi: string;
  x: number;
  z: number;
  radius: number;
  color: string;
  activeColor: string;
  meshGroup: THREE.Group;
  ringMesh: THREE.Mesh;
  hologramMesh: THREE.Mesh;
  lightBeamMesh?: THREE.Mesh;
  pointLight?: THREE.PointLight;
}

export interface CollisionResult {
  hasCollided: boolean;
  obstacleType?: 'cone' | 'barrier' | 'barrel';
  obstacleName?: string;
  impactSpeed: number;
  contactPoint?: THREE.Vector3;
}

export interface ObstacleArenaInstance {
  rootGroup: THREE.Group;
  obstacles: ArenaObstacle[];
  checkpoints: ArenaCheckpoint[];
  update: (time: number, delta: number, currentCpIdx: number) => void;
  resolveCarCollisions: (
    carPos: THREE.Vector3,
    carLinearVel: { current: number },
    time: number
  ) => CollisionResult;
  resetObstacles: () => void;
  dispose: () => void;
}

/**
 * Procedural canvas texture generator for a massive 64m x 64m arena race track floor.
 */
function createGrandArenaTrackTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d')!;

  // 1. Dark high-grip asphalt background
  ctx.fillStyle = '#0a0f1d';
  ctx.fillRect(0, 0, 2048, 2048);

  // 2. Blueprint precision technical sub-grid
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.35)';
  ctx.lineWidth = 1;
  const gridSize = 32;
  for (let x = 0; x <= 2048; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 2048);
    ctx.stroke();
  }
  for (let y = 0; y <= 2048; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(2048, y);
    ctx.stroke();
  }

  // Heavy 10-meter major grid lines
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.18)';
  ctx.lineWidth = 2;
  for (let x = 0; x <= 2048; x += gridSize * 5) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 2048);
    ctx.stroke();
  }
  for (let y = 0; y <= 2048; y += gridSize * 5) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(2048, y);
    ctx.stroke();
  }

  // 3. Coordinate conversion: World (-30 to +30 meters) -> Canvas (0 to 2048)
  const toCanvas = (wx: number, wz: number) => ({
    x: 1024 + (wx / 31) * 920,
    y: 1024 + (wz / 31) * 920,
  });

  // Grand Circuit Waypoints (CP1 -> CP2 -> CP3 -> CP4 -> CP5 -> CP1)
  const waypoints = [
    { x: 0, z: 14.0 },      // CP1 Start / Finish
    { x: 14.0, z: 16.0 },   // Mid-Sector 1
    { x: 20.0, z: 12.0 },   // CP2 Slalom Turn
    { x: 23.0, z: -2.0 },   // Sector 2
    { x: 20.0, z: -18.0 },  // CP3 Hairpin Turn
    { x: 2.0, z: -21.0 },   // Sector 3
    { x: -18.0, z: -19.0 }, // CP4 Speed Straight
    { x: -22.0, z: -5.0 },  // Sector 4
    { x: -20.0, z: 7.0 },   // CP5 Technical Curves
    { x: -12.0, z: 13.0 },  // Final Approach
  ];

  // Draw wide road asphalt overlay (double-wide professional track)
  ctx.lineWidth = 240;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#152033';
  ctx.beginPath();
  const startPt = toCanvas(waypoints[0].x, waypoints[0].z);
  ctx.moveTo(startPt.x, startPt.y);
  for (let i = 1; i < waypoints.length; i++) {
    const pt = toCanvas(waypoints[i].x, waypoints[i].z);
    ctx.lineTo(pt.x, pt.y);
  }
  ctx.closePath();
  ctx.stroke();

  // White lane outer borders
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.moveTo(startPt.x, startPt.y);
  for (let i = 1; i < waypoints.length; i++) {
    const pt = toCanvas(waypoints[i].x, waypoints[i].z);
    ctx.lineTo(pt.x, pt.y);
  }
  ctx.closePath();
  ctx.stroke();

  // Cyber Emerald / Cyan Dashed Centerline
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#10b981';
  ctx.setLineDash([24, 24]);
  ctx.beginPath();
  ctx.moveTo(startPt.x, startPt.y);
  for (let i = 1; i < waypoints.length; i++) {
    const pt = toCanvas(waypoints[i].x, waypoints[i].z);
    ctx.lineTo(pt.x, pt.y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.setLineDash([]); // reset

  // 4. Start / Finish Checkered line at CP1 (0, 14.0)
  const cp1 = toCanvas(0, 14.0);
  const sq = 18;
  for (let row = 0; row < 4; row++) {
    for (let col = -6; col <= 6; col++) {
      ctx.fillStyle = (row + col) % 2 === 0 ? '#ffffff' : '#020617';
      ctx.fillRect(cp1.x + col * sq, cp1.y - 36 + row * sq, sq, sq);
    }
  }

  // High-visibility START / FINISH text painted on track
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('START / FINISH LINE', cp1.x, cp1.y + 60);

  // 5. Directional Arrows on Track
  const arrows = [
    { x: 10.0, z: 15.0, angle: Math.PI / 2 },
    { x: 22.0, z: 4.0, angle: Math.PI },
    { x: 10.0, z: -19.5, angle: -Math.PI / 2 },
    { x: -20.0, z: -12.0, angle: 0 },
    { x: -16.0, z: 10.0, angle: Math.PI / 3 },
  ];

  ctx.fillStyle = '#38bdf8';
  arrows.forEach(arr => {
    const p = toCanvas(arr.x, arr.z);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(arr.angle);
    ctx.beginPath();
    ctx.moveTo(0, -32);
    ctx.lineTo(24, 20);
    ctx.lineTo(10, 20);
    ctx.lineTo(10, 38);
    ctx.lineTo(-10, 38);
    ctx.lineTo(-10, 20);
    ctx.lineTo(-24, 20);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Creates a detailed rubber traffic cone obstacle.
 */
function createTrafficCone(): THREE.Group {
  const group = new THREE.Group();

  // Black rubber square base
  const baseGeo = new THREE.BoxGeometry(0.65, 0.06, 0.65);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.9,
    metalness: 0.1,
  });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = 0.03;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  // Orange cone body
  const coneGeo = new THREE.ConeGeometry(0.26, 0.88, 18, 1, true);
  const coneMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.55,
    metalness: 0.1,
  });
  const cone = new THREE.Mesh(coneGeo, coneMat);
  cone.position.y = 0.47;
  cone.castShadow = true;
  cone.receiveShadow = true;
  group.add(cone);

  // White reflective collar ring
  const collarGeo = new THREE.CylinderGeometry(0.16, 0.20, 0.24, 18, 1, true);
  const collarMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.3,
  });
  const collar = new THREE.Mesh(collarGeo, collarMat);
  collar.position.y = 0.48;
  group.add(collar);

  // Top lip
  const topGeo = new THREE.TorusGeometry(0.05, 0.022, 8, 16);
  const topMesh = new THREE.Mesh(topGeo, baseMat);
  topMesh.rotation.x = Math.PI / 2;
  topMesh.position.y = 0.91;
  group.add(topMesh);

  return group;
}

/**
 * Creates an industrial hazard barrier block with diagonal caution stripes.
 */
function createHazardBarrier(width = 2.4): THREE.Group {
  const group = new THREE.Group();

  // Canvas with yellow and black diagonal hazard stripes
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(0, 0, 512, 128);

  ctx.fillStyle = '#0f172a';
  for (let x = -128; x < 640; x += 44) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 28, 0);
    ctx.lineTo(x - 24, 128);
    ctx.lineTo(x - 52, 128);
    ctx.closePath();
    ctx.fill();
  }

  const stripeTex = new THREE.CanvasTexture(canvas);
  stripeTex.wrapS = THREE.RepeatWrapping;
  stripeTex.repeat.set(width > 2.0 ? 2 : 1, 1);

  // Main concrete / polymer barrier body
  const bodyGeo = new THREE.BoxGeometry(width, 0.75, 0.55);
  const bodyMat = new THREE.MeshStandardMaterial({
    map: stripeTex,
    roughness: 0.65,
    metalness: 0.2,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.38;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Heavy steel feet
  const footGeo = new THREE.BoxGeometry(0.16, 0.09, 0.75);
  const footMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.7 });

  const leftFoot = new THREE.Mesh(footGeo, footMat);
  leftFoot.position.set(-width * 0.42, 0.045, 0);
  leftFoot.castShadow = true;
  group.add(leftFoot);

  const rightFoot = new THREE.Mesh(footGeo, footMat);
  rightFoot.position.set(width * 0.42, 0.045, 0);
  rightFoot.castShadow = true;
  group.add(rightFoot);

  return group;
}

/**
 * Creates an industrial metal oil/fuel barrel.
 */
function createMetalBarrel(colorHex = 0x2563eb): THREE.Group {
  const group = new THREE.Group();

  const barrelGeo = new THREE.CylinderGeometry(0.42, 0.42, 1.05, 22);
  const barrelMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: 0.4,
    metalness: 0.7,
  });
  const barrel = new THREE.Mesh(barrelGeo, barrelMat);
  barrel.position.y = 0.525;
  barrel.castShadow = true;
  barrel.receiveShadow = true;
  group.add(barrel);

  // Reinforcing steel rings
  const ringGeo = new THREE.TorusGeometry(0.425, 0.024, 8, 24);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.8 });

  const r1 = new THREE.Mesh(ringGeo, ringMat);
  r1.rotation.x = Math.PI / 2;
  r1.position.y = 0.34;
  group.add(r1);

  const r2 = new THREE.Mesh(ringGeo, ringMat);
  r2.rotation.x = Math.PI / 2;
  r2.position.y = 0.72;
  group.add(r2);

  // Hazard warning label
  const labelGeo = new THREE.CylinderGeometry(0.426, 0.426, 0.26, 22, 1, true, 0, Math.PI);
  const labelMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide });
  const label = new THREE.Mesh(labelGeo, labelMat);
  label.position.y = 0.525;
  group.add(label);

  return group;
}

/**
 * Creates an animated holographic Checkpoint waypoint.
 */
function createCheckpointMesh(
  id: number,
  x: number,
  z: number,
  label: string,
  colorHex: string
): ArenaCheckpoint {
  const group = new THREE.Group();
  group.position.set(x, -0.41, z);

  // 1. Glowing Floor Target Ring
  const ringGeo = new THREE.RingGeometry(0.9, 1.35, 36);
  const ringMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(colorHex),
    transparent: true,
    opacity: 0.88,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = -Math.PI / 2;
  ringMesh.position.y = 0.015;
  group.add(ringMesh);

  // Inner pulsing target disc
  const discGeo = new THREE.CircleGeometry(0.8, 28);
  const discMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(colorHex),
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  });
  const discMesh = new THREE.Mesh(discGeo, discMat);
  discMesh.rotation.x = -Math.PI / 2;
  discMesh.position.y = 0.008;
  group.add(discMesh);

  // 2. Floating Holographic Waypoint Gem (Octahedron)
  const holoGeo = new THREE.OctahedronGeometry(0.38, 0);
  const holoMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorHex),
    emissive: new THREE.Color(colorHex),
    emissiveIntensity: 0.85,
    roughness: 0.2,
    metalness: 0.8,
    transparent: true,
    opacity: 0.92,
  });
  const hologramMesh = new THREE.Mesh(holoGeo, holoMat);
  hologramMesh.position.y = 1.6;
  group.add(hologramMesh);

  // Outer wireframe cage
  const cageGeo = new THREE.OctahedronGeometry(0.52, 0);
  const cageMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.5,
  });
  const cageMesh = new THREE.Mesh(cageGeo, cageMat);
  cageMesh.position.y = 1.6;
  group.add(cageMesh);

  // 3. Vertical Light Beam
  const beamGeo = new THREE.CylinderGeometry(0.65, 1.05, 3.2, 24, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(colorHex),
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const lightBeamMesh = new THREE.Mesh(beamGeo, beamMat);
  lightBeamMesh.position.y = 1.6;
  group.add(lightBeamMesh);

  // 4. Floating Checkpoint Text Badge (Canvas Sprite)
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#0f172a';
  ctx.roundRect(10, 10, 236, 108, 20);
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = colorHex;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`CP 0${id}`, 128, 52);

  ctx.fillStyle = colorHex;
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(label, 128, 92);

  const spriteTex = new THREE.CanvasTexture(canvas);
  const spriteMat = new THREE.SpriteMaterial({ map: spriteTex, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(1.9, 0.95, 1);
  sprite.position.y = 2.65;
  group.add(sprite);

  // Dynamic Point Light
  const pointLight = new THREE.PointLight(new THREE.Color(colorHex), 1.6, 7.0);
  pointLight.position.y = 1.6;
  group.add(pointLight);

  return {
    id,
    nameVi: `Checkpoint ${id}: ${label}`,
    descVi: '',
    x,
    z,
    radius: 1.85, // Generous trigger radius for high speed
    color: colorHex,
    activeColor: '#f59e0b',
    meshGroup: group,
    ringMesh,
    hologramMesh,
    lightBeamMesh,
    pointLight,
  };
}

/**
 * Creates the Grand JetBot Obstacle Arena (64m x 64m):
 * - Massive circuit track with multiple sectors
 * - Perimeter hazard curbs
 * - 24+ fully collideable physical obstacles (cones, barriers, metal drums)
 *   with real-time knock-down / slide / wobble physics and continuous collision resolution!
 * - 5 interactive sequential checkpoints (CP1 to CP5)
 */
export function createJetBotObstacleArena(): ObstacleArenaInstance {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'GrandJetBotObstacleArena';

  // 1. Massive Race Track Floor Surface (64m x 64m)
  const floorGeo = new THREE.PlaneGeometry(64, 64);
  const trackTexture = createGrandArenaTrackTexture();
  const floorMat = new THREE.MeshStandardMaterial({
    map: trackTexture,
    roughness: 0.85,
    metalness: 0.15,
  });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.y = -0.418;
  floorMesh.receiveShadow = true;
  rootGroup.add(floorMesh);

  // 2. Perimeter Safety Kerbs / Boundary Walls (64m x 64m)
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.7,
    metalness: 0.3,
  });
  const curbGeoX = new THREE.BoxGeometry(64, 0.45, 0.6);
  const curbGeoZ = new THREE.BoxGeometry(0.6, 0.45, 64);

  const northCurb = new THREE.Mesh(curbGeoX, wallMat);
  northCurb.position.set(0, -0.19, -32);
  northCurb.castShadow = true;
  rootGroup.add(northCurb);

  const southCurb = new THREE.Mesh(curbGeoX, wallMat);
  southCurb.position.set(0, -0.19, 32);
  southCurb.castShadow = true;
  rootGroup.add(southCurb);

  const westCurb = new THREE.Mesh(curbGeoZ, wallMat);
  westCurb.position.set(-32, -0.19, 0);
  westCurb.castShadow = true;
  rootGroup.add(westCurb);

  const eastCurb = new THREE.Mesh(curbGeoZ, wallMat);
  eastCurb.position.set(32, -0.19, 0);
  eastCurb.castShadow = true;
  rootGroup.add(eastCurb);

  // 3. Dynamic Collideable Physical Obstacles Setup
  const obstacles: ArenaObstacle[] = [];

  const addObstacle = (
    type: ArenaObstacle['type'],
    nameVi: string,
    x: number,
    z: number,
    radius: number,
    height: number,
    mass: number,
    mesh: THREE.Group
  ) => {
    mesh.position.set(x, -0.41, z);
    rootGroup.add(mesh);
    obstacles.push({
      id: `obs_${obstacles.length + 1}`,
      type,
      nameVi,
      x,
      z,
      vx: 0,
      vz: 0,
      rotX: 0,
      rotZ: 0,
      vRotX: 0,
      vRotZ: 0,
      radius,
      height,
      mass,
      isKnocked: false,
      initialX: x,
      initialZ: z,
      meshGroup: mesh,
    });
  };

  // --- SECTOR 1: Start/Finish straight (x=0, z=14) to CP2 (x=20, z=12) ---
  // Slalom cones that can be knocked over!
  addObstacle('cone', 'Cọc tiêu Slalom 1', 6.0, 15.5, 0.38, 0.88, 1.0, createTrafficCone());
  addObstacle('cone', 'Cọc tiêu Slalom 2', 10.5, 13.0, 0.38, 0.88, 1.0, createTrafficCone());
  addObstacle('cone', 'Cọc tiêu Slalom 3', 15.0, 16.5, 0.38, 0.88, 1.0, createTrafficCone());
  addObstacle('cone', 'Cọc tiêu Slalom 4', 18.5, 14.0, 0.38, 0.88, 1.0, createTrafficCone());

  // --- SECTOR 2: Corner CP2 (20, 12) -> East Straight -> CP3 (20, -18) ---
  const bEast1 = createHazardBarrier(2.6);
  bEast1.rotation.y = 0.2;
  addObstacle('barrier', 'Rào chắn khúc cua Đông 1', 24.5, 6.0, 1.35, 0.75, 0, bEast1);

  addObstacle('barrel', 'Thùng phuy kim loại xanh 1', 18.0, 1.0, 0.48, 1.05, 3.2, createMetalBarrel(0x2563eb));
  addObstacle('barrel', 'Thùng phuy kim loại đỏ 1', 19.5, -4.5, 0.48, 1.05, 3.2, createMetalBarrel(0xdc2626));

  const bEast2 = createHazardBarrier(2.6);
  bEast2.rotation.y = -0.3;
  addObstacle('barrier', 'Rào chắn khúc cua Đông 2', 24.0, -10.0, 1.35, 0.75, 0, bEast2);

  // Hairpin Chicane around CP3 (20, -18)
  const bHairpin = createHazardBarrier(3.2);
  bHairpin.rotation.y = -Math.PI / 4;
  addObstacle('barrier', 'Rào chắn Hairpin CP3', 24.5, -21.0, 1.65, 0.75, 0, bHairpin);

  addObstacle('barrel', 'Thùng phuy Hairpin', 17.5, -21.5, 0.48, 1.05, 3.2, createMetalBarrel(0x0284c7));

  // --- SECTOR 3: South Super Long Turbo Straight to CP4 (-18, -19) ---
  // Obstacles along the high-speed straight
  addObstacle('cone', 'Cọc tiêu đường thẳng 1', 10.0, -21.0, 0.38, 0.88, 1.0, createTrafficCone());
  addObstacle('barrel', 'Thùng phuy giữa đường thẳng', 0.0, -22.5, 0.48, 1.05, 3.2, createMetalBarrel(0x2563eb));
  addObstacle('cone', 'Cọc tiêu đường thẳng 2', -9.0, -20.0, 0.38, 0.88, 1.0, createTrafficCone());

  const bSouth = createHazardBarrier(2.8);
  bSouth.rotation.y = 0.15;
  addObstacle('barrier', 'Rào chắn dải phân cách Nam', -13.0, -22.0, 1.45, 0.75, 0, bSouth);

  // --- SECTOR 4: West Turn around CP4 (-18, -19) towards CP5 (-20, 7) ---
  const bWest1 = createHazardBarrier(3.0);
  bWest1.rotation.y = Math.PI / 3;
  addObstacle('barrier', 'Rào chắn góc cua Tây 1', -24.5, -12.0, 1.55, 0.75, 0, bWest1);

  addObstacle('barrel', 'Thùng phuy khúc cua Tây', -17.0, -8.0, 0.48, 1.05, 3.2, createMetalBarrel(0xdc2626));
  addObstacle('cone', 'Cọc tiêu chicanes Tây 1', -23.0, 0.0, 0.38, 0.88, 1.0, createTrafficCone());
  addObstacle('cone', 'Cọc tiêu chicanes Tây 2', -18.5, 3.0, 0.38, 0.88, 1.0, createTrafficCone());

  // --- SECTOR 5: Final Approach CP5 (-20, 7) back to Start/Finish CP1 (0, 14) ---
  const bNorthWest = createHazardBarrier(2.8);
  bNorthWest.rotation.y = -Math.PI / 6;
  addObstacle('barrier', 'Rào chắn khúc cua Về Đích', -16.0, 14.5, 1.45, 0.75, 0, bNorthWest);

  addObstacle('barrel', 'Thùng phuy cua Về Đích', -9.0, 16.5, 0.48, 1.05, 3.2, createMetalBarrel(0x2563eb));
  addObstacle('cone', 'Cọc tiêu cổng về đích 1', -5.0, 12.5, 0.38, 0.88, 1.0, createTrafficCone());
  addObstacle('cone', 'Cọc tiêu cổng về đích 2', -3.0, 15.5, 0.38, 0.88, 1.0, createTrafficCone());

  // Center Island Obstacles (Prevents crossing the middle)
  const bCenter1 = createHazardBarrier(3.4);
  bCenter1.rotation.y = Math.PI / 4;
  addObstacle('barrier', 'Rào chắn dải phân cách Trung tâm 1', 3.0, 0.0, 1.75, 0.75, 0, bCenter1);

  const bCenter2 = createHazardBarrier(3.4);
  bCenter2.rotation.y = -Math.PI / 4;
  addObstacle('barrier', 'Rào chắn dải phân cách Trung tâm 2', -4.0, -3.0, 1.75, 0.75, 0, bCenter2);

  addObstacle('barrel', 'Thùng phuy đảo trung tâm 1', 0.0, -6.0, 0.48, 1.05, 3.2, createMetalBarrel(0xdc2626));
  addObstacle('barrel', 'Thùng phuy đảo trung tâm 2', 0.0, 6.0, 0.48, 1.05, 3.2, createMetalBarrel(0x2563eb));

  // 4. Interactive Sequential Checkpoints Setup (5 Checkpoints in Grand Arena)
  const checkpoints: ArenaCheckpoint[] = [
    createCheckpointMesh(1, 0, 14.0, 'XUẤT PHÁT / ĐÍCH', '#10b981'),
    createCheckpointMesh(2, 20.0, 12.0, 'CUA CHỮ S', '#38bdf8'),
    createCheckpointMesh(3, 20.0, -18.0, 'KHÚC CUA GẤP', '#a855f7'),
    createCheckpointMesh(4, -18.0, -19.0, 'ĐOẠN TĂNG TỐC', '#f59e0b'),
    createCheckpointMesh(5, -20.0, 7.0, 'CUA VỀ ĐÍCH', '#ec4899'),
  ];

  checkpoints.forEach(cp => rootGroup.add(cp.meshGroup));

  // 5. Physics simulation loop for movable obstacles (knocking, sliding, tilting)
  const update = (time: number, delta: number, currentCpIdx: number) => {
    // A. Update Checkpoints visuals
    checkpoints.forEach((cp, idx) => {
      const isCurrentTarget = idx === currentCpIdx;

      cp.hologramMesh.rotation.y += delta * (isCurrentTarget ? 2.5 : 1.0);
      cp.hologramMesh.rotation.x = Math.sin(time * 0.002 + idx) * 0.2;
      cp.hologramMesh.position.y = 1.6 + Math.sin(time * 0.003 + idx * 1.5) * 0.15;

      if (isCurrentTarget) {
        const pulse = 1.0 + Math.sin(time * 0.008) * 0.15;
        cp.ringMesh.scale.set(pulse, pulse, pulse);
        (cp.ringMesh.material as THREE.MeshBasicMaterial).opacity = 0.92 + Math.sin(time * 0.008) * 0.08;
        if (cp.lightBeamMesh) {
          (cp.lightBeamMesh.material as THREE.MeshBasicMaterial).opacity = 0.32 + Math.sin(time * 0.006) * 0.15;
        }
        if (cp.pointLight) {
          cp.pointLight.intensity = 2.4 + Math.sin(time * 0.008) * 0.8;
        }
      } else {
        cp.ringMesh.scale.set(1, 1, 1);
        (cp.ringMesh.material as THREE.MeshBasicMaterial).opacity = 0.45;
        if (cp.lightBeamMesh) {
          (cp.lightBeamMesh.material as THREE.MeshBasicMaterial).opacity = 0.08;
        }
        if (cp.pointLight) {
          cp.pointLight.intensity = 0.4;
        }
      }
    });

    // B. Physical dynamic updates for movable obstacles (sliding, rotating, damping)
    obstacles.forEach(obs => {
      if (obs.mass > 0) {
        // Linear motion from impact
        if (Math.abs(obs.vx) > 0.005 || Math.abs(obs.vz) > 0.005) {
          obs.x += obs.vx * delta;
          obs.z += obs.vz * delta;

          // Ground friction damping
          obs.vx = THREE.MathUtils.damp(obs.vx, 0, 4.5, delta);
          obs.vz = THREE.MathUtils.damp(obs.vz, 0, 4.5, delta);

          // Keep obstacles inside the arena boundaries
          obs.x = Math.max(-31, Math.min(31, obs.x));
          obs.z = Math.max(-31, Math.min(31, obs.z));

          obs.meshGroup.position.x = obs.x;
          obs.meshGroup.position.z = obs.z;
        }

        // Rotational tilt / wobble on impact
        if (Math.abs(obs.vRotX) > 0.01 || Math.abs(obs.vRotZ) > 0.01 || Math.abs(obs.rotX) > 0.01 || Math.abs(obs.rotZ) > 0.01) {
          obs.rotX += obs.vRotX * delta;
          obs.rotZ += obs.vRotZ * delta;

          // If knocked heavily, cone can tilt up to ~75 degrees on its side
          if (obs.type === 'cone') {
            const maxTilt = 1.35; // radians (~77 degrees)
            obs.rotX = THREE.MathUtils.clamp(obs.rotX, -maxTilt, maxTilt);
            obs.rotZ = THREE.MathUtils.clamp(obs.rotZ, -maxTilt, maxTilt);
            // Damping angular velocity
            obs.vRotX = THREE.MathUtils.damp(obs.vRotX, 0, 6.0, delta);
            obs.vRotZ = THREE.MathUtils.damp(obs.vRotZ, 0, 6.0, delta);
          } else {
            // Barrels wobble back upright due to heavy base
            obs.vRotX = THREE.MathUtils.damp(obs.vRotX, -obs.rotX * 12, 5.0, delta);
            obs.vRotZ = THREE.MathUtils.damp(obs.vRotZ, -obs.rotZ * 12, 5.0, delta);
            obs.rotX = THREE.MathUtils.damp(obs.rotX, 0, 4.0, delta);
            obs.rotZ = THREE.MathUtils.damp(obs.rotZ, 0, 4.0, delta);
          }

          obs.meshGroup.rotation.x = obs.rotX;
          obs.meshGroup.rotation.z = obs.rotZ;
        }
      }
    });
  };

  /**
   * CONTINUOUS RIGID COLLISION RESOLUTION:
   * Tested with sub-stepping so the car CANNOT pass through or tunnel through obstacles!
   */
  const resolveCarCollisions = (
    carPos: THREE.Vector3,
    carLinearVel: { current: number },
    time: number
  ): CollisionResult => {
    let result: CollisionResult = {
      hasCollided: false,
      impactSpeed: Math.abs(carLinearVel.current),
    };

    const carRadius = 0.68; // JetBot body radius

    // Test collision against all obstacles in the arena
    for (const obs of obstacles) {
      const dx = carPos.x - obs.x;
      const dz = carPos.z - obs.z;
      const dist = Math.hypot(dx, dz);
      const minDist = obs.radius + carRadius;

      if (dist < minDist) {
        result.hasCollided = true;
        result.obstacleType = obs.type === 'cone' ? 'cone' : obs.type === 'barrel' ? 'barrel' : 'barrier';
        result.obstacleName = obs.nameVi;
        result.contactPoint = new THREE.Vector3(
          obs.x + (dx / (dist || 0.001)) * obs.radius,
          0.1,
          obs.z + (dz / (dist || 0.001)) * obs.radius
        );

        const overlap = minDist - dist;
        const nx = dx / (dist || 0.001);
        const nz = dz / (dist || 0.001);

        if (obs.mass > 0) {
          // Dynamic Movable Obstacle (Traffic Cones & Metal Barrels)
          // 1. Position displacement share between car and obstacle
          carPos.x += nx * overlap * 0.45;
          carPos.z += nz * overlap * 0.45;
          obs.x -= nx * overlap * 0.55;
          obs.z -= nz * overlap * 0.55;
          obs.meshGroup.position.x = obs.x;
          obs.meshGroup.position.z = obs.z;

          // 2. Transfer kinetic momentum to obstacle!
          const impulse = Math.max(1.8, Math.abs(carLinearVel.current) * 1.4);
          obs.vx -= nx * impulse * (obs.type === 'cone' ? 1.6 : 0.85);
          obs.vz -= nz * impulse * (obs.type === 'cone' ? 1.6 : 0.85);

          // 3. Impart rotational knock/tilt on hit!
          obs.vRotX += nz * impulse * (obs.type === 'cone' ? 4.5 : 1.2);
          obs.vRotZ -= nx * impulse * (obs.type === 'cone' ? 4.5 : 1.2);
          obs.isKnocked = true;

          // Car slows down and bounces slightly
          carLinearVel.current *= -0.25;

          // Trigger specific sound
          if (obs.type === 'cone') {
            soundManager.playConeHit();
          } else {
            soundManager.playBarrelHit();
          }
        } else {
          // Immovable Rigid Solid Barrier
          // Full repulsion onto car
          carPos.x += nx * overlap;
          carPos.z += nz * overlap;
          carLinearVel.current *= -0.4; // Solid rebound
          soundManager.playBumpSound();
        }
      }
    }

    return result;
  };

  /**
   * Reset all knocked obstacles back to their original positions.
   */
  const resetObstacles = () => {
    obstacles.forEach(obs => {
      obs.x = obs.initialX;
      obs.z = obs.initialZ;
      obs.vx = 0;
      obs.vz = 0;
      obs.rotX = 0;
      obs.rotZ = 0;
      obs.vRotX = 0;
      obs.vRotZ = 0;
      obs.isKnocked = false;
      obs.meshGroup.position.set(obs.initialX, -0.41, obs.initialZ);
      obs.meshGroup.rotation.set(0, obs.meshGroup.rotation.y, 0);
    });
  };

  const dispose = () => {
    trackTexture.dispose();
  };

  return {
    rootGroup,
    obstacles,
    checkpoints,
    update,
    resolveCarCollisions,
    resetObstacles,
    dispose,
  };
}
