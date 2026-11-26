export interface ComponentPhotoItem {
  url: string;
  caption: string;
  tag?: string;
}

export interface ComponentSpecItem {
  label: string;
  value: string;
}

export interface JetBotComponent {
  id: string;
  nameVi: string;
  shortDesc: string;
  fullDesc: string;
  roleVi: string;
  technicalTerm: string;
  locationVi: string;
  connectionVi: string;
  iconName: string;
  color: string;
  anchorOffset: [number, number, number]; // 3D anchor position relative to JetBot center
  explodedOffset: [number, number, number]; // offset in exploded state
  primaryPhotoUrl: string;
  primaryPhotoCaption: string;
  galleryPhotos?: ComponentPhotoItem[];
  specs?: ComponentSpecItem[];
}

export interface JetBotFunction {
  id: string;
  number: number;
  nameVi: string;
  descVi: string;
  howItWorksVi: string;
  schoolContextVi: string;
  iconName: string;
  color: string;
  badgeVi: string;
  pythonSnippet?: string;
}

export type CameraPreset =
  | 'isometric'
  | 'front'
  | 'side'
  | 'top'
  | 'closeJetson'
  | 'closeCamera'
  | 'closeLidar'
  | 'underbody';

export type StudioLightingMode = 'dark' | 'lab';

export interface ViewMode {
  type: '3d-interactive' | 'infographic-poster';
}
