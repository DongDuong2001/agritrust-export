import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { 
  Globe, 
  Compass, 
  Trees, 
  ShieldCheck, 
  CheckCircle, 
  Sparkles, 
  ArrowRight,
  Layers,
  ZoomIn,
  RotateCcw,
  MapPin,
  Flame,
  Radio,
  Mountain,
  Coffee,
  Check
} from 'lucide-react';
import { CoffeeShipment } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface GeographicOriginMapProps {
  shipments: CoffeeShipment[];
  onSelectShipment: (id: string) => void;
  darkMode: boolean;
}

type MapDisplayMode = 'interactive_map' | 'density_grid' | 'satellite_layers';
type TileLayerTheme = 'satellite' | 'street' | 'dark';

export interface RegionOriginMeta {
  id: string;
  name: string;
  nameVi: string;
  isKeyRegion: boolean;
  macroRegion: 'central_highlands' | 'northwest' | 'central_coast';
  province: string;
  lat: number;
  lng: number;
  zoomLevel: number;
  polygonCoords: [number, number][];
  avgElevation: number;
  primaryVariety: string;
  coopCount: number;
  farmerCount: number;
  forestBaseline2020: string;
  satellitePassDate: string;
  description: string;
  descriptionVi: string;
  // Key region signature styling
  signatureColor: string;
  signatureBorderColor: string;
  signatureFillColor: string;
  badgeTitleVi: string;
  badgeTitleEn: string;
  badgeSubtitleVi: string;
  badgeSubtitleEn: string;
  badgeType: 'robusta' | 'arabica' | 'agroforestry' | 'general';
}

const VIETNAM_CENTER: [number, number] = [15.2, 108.0];
const DEFAULT_ZOOM = 6;

// Precise coordinates outlining the sovereign S-shape mainland of Vietnam
const VIETNAM_MAINLAND_OUTLINE: [number, number][] = [
  [22.85, 105.35], // Ha Giang top
  [23.38, 105.28], // Dong Van / Lung Cu
  [23.08, 105.90],
  [22.75, 106.65], // Cao Bang
  [22.25, 106.75], // Lang Son
  [21.55, 107.95], // Mong Cai / Quang Ninh
  [20.85, 106.95], // Hai Phong / Ha Long Bay
  [20.25, 106.35], // Nam Dinh / Ninh Binh coast
  [19.80, 105.90], // Thanh Hoa
  [18.90, 105.70], // Nghe An
  [18.35, 106.00], // Ha Tinh
  [17.80, 106.50], // Quang Binh
  [16.85, 107.15], // Quang Tri
  [16.45, 107.60], // Hue
  [16.08, 108.25], // Da Nang
  [15.55, 108.55], // Quang Nam
  [15.15, 108.85], // Quang Ngai
  [14.15, 109.15], // Binh Dinh
  [13.10, 109.30], // Phu Yen
  [12.25, 109.25], // Khanh Hoa / Nha Trang
  [11.55, 109.05], // Ninh Thuan / Phan Rang
  [10.95, 108.25], // Binh Thuan / Phan Thiet
  [10.35, 107.15], // Ba Ria - Vung Tau
  [10.30, 106.75], // TP.HCM Can Gio coast
  [9.90, 106.35],  // Tien Giang / Ben Tre
  [9.30, 105.75],  // Soc Trang / Bac Lieu
  [8.60, 104.75],  // Ca Mau Cape (Mũi Cà Mau)
  [9.35, 104.85],  // Kien Giang / Rach Gia
  [10.38, 104.45], // Ha Tien
  [10.75, 105.15], // An Giang / Chau Doc border
  [10.95, 105.75], // Dong Thap / Long An border
  [11.45, 106.05], // Tay Ninh border
  [11.85, 106.90], // Binh Phuoc border
  [12.25, 107.45], // Dak Nong border
  [12.75, 107.65], // Dak Lak border
  [13.65, 107.55], // Gia Lai border
  [14.45, 107.55], // Kon Tum / Bo Y tripoint
  [15.25, 107.50], // Quang Nam border
  [16.15, 107.25], // Thua Thien Hue border
  [16.75, 106.65], // Quang Tri Lao Bao
  [17.45, 106.15], // Quang Binh border
  [18.45, 105.25], // Ha Tinh border
  [19.25, 104.25], // Nghe An Ky Son
  [20.55, 104.05], // Thanh Hoa / Son La border
  [21.15, 103.05], // Dien Bien border (A Pa Chai tripoint)
  [22.45, 102.15], // Muong Nhe
  [22.80, 103.25], // Lai Chau / Lao Cai
  [22.85, 105.35]  // Back to Ha Giang
];

// Macro Coffee Belts in Vietnam
const MACRO_COFFEE_BELTS = [
  {
    id: 'central_highlands_belt',
    name: 'Vành Đai Cà Phê Tây Nguyên (Central Highlands Belt)',
    desc: 'Thủ phủ Robusta & Arabica xuất khẩu chất lượng cao (85%+ sản lượng cả nước)',
    color: '#10b981',
    fillColor: '#10b981',
    coords: [
      [14.65, 107.55],
      [14.75, 108.35],
      [13.95, 108.65],
      [12.95, 108.75],
      [12.05, 108.85],
      [11.45, 108.45],
      [11.75, 107.35],
      [12.45, 107.30],
      [13.75, 107.40]
    ]
  },
  {
    id: 'northwest_arabica_belt',
    name: 'Vành Đai Cà Phê Tây Bắc (Northwest Specialty Belt)',
    desc: 'Vùng đồi dốc núi cao chuyên canh Specialty Catimor Arabica chế biến ướt',
    color: '#06b6d4',
    fillColor: '#06b6d4',
    coords: [
      [21.75, 103.45],
      [21.85, 104.35],
      [21.05, 104.45],
      [20.75, 103.65]
    ]
  }
];

// High-precision region polygons and metadata with explicit styling for KEY regions (Dak Lak, Lam Dong, Gia Lai)
const REGION_METADATA: RegionOriginMeta[] = [
  {
    id: 'dak_lak',
    name: 'Dak Lak Highlands (Buon Ma Thuot & Cu M\'gar)',
    nameVi: 'Cao nguyên Đắk Lắk (Buôn Ma Thuột & Cư M\'gar)',
    isKeyRegion: true,
    macroRegion: 'central_highlands',
    province: 'Dak Lak',
    lat: 12.6683,
    lng: 108.0383,
    zoomLevel: 9,
    polygonCoords: [
      [13.40, 107.85], // Ea Hleo
      [13.25, 108.35], // Krong Buk / Krong Nang
      [12.95, 108.75], // Krong Bong
      [12.45, 108.65], // Lak Lake
      [12.35, 108.05], // Buon Don
      [12.55, 107.50], // Ea Sup
      [13.10, 107.60]  // Cu Mgar boundary
    ],
    avgElevation: 620,
    primaryVariety: 'Fine Robusta (Specialty Grade 1 & Wet Polished)',
    coopCount: 14,
    farmerCount: 2850,
    forestBaseline2020: '100% Verified Sentinel-2 (0.0% Deforestation)',
    satellitePassDate: '12 Aug 2026 (Copernicus L2A)',
    description: 'Capital of Vietnam Robusta. Rich basalt red soil, registered smallholder polygon plots with full traceability.',
    descriptionVi: 'Thủ phủ Robusta Thế Giới. Đất đỏ bazan màu mỡ, vùng trồng liên kết 2.850 hộ đạt chuẩn 100% không phá rừng.',
    signatureColor: '#10b981',
    signatureBorderColor: '#34d399',
    signatureFillColor: '#059669',
    badgeTitleVi: 'ĐẮK LẮK • THỦ PHỦ ROBUSTA',
    badgeTitleEn: 'DAK LAK • ROBUSTA CAPITAL',
    badgeSubtitleVi: 'Vùng Trồng Chủ Lực #1 • 2.850 Nông Hộ',
    badgeSubtitleEn: 'Core Origin #1 • 2,850 Smallholders',
    badgeType: 'robusta'
  },
  {
    id: 'lam_dong',
    name: 'Lam Dong Plateau (Da Lat, Cau Dat & Lac Duong)',
    nameVi: 'Cao nguyên Lâm Đồng (Đà Lạt, Cầu Đất & Lạc Dương)',
    isKeyRegion: true,
    macroRegion: 'central_highlands',
    province: 'Lam Dong',
    lat: 11.9404,
    lng: 108.4583,
    zoomLevel: 9,
    polygonCoords: [
      [12.35, 108.35], // Lac Duong / Lang Biang
      [12.15, 108.75], // Don Duong
      [11.75, 108.70], // Duc Trong
      [11.45, 108.20], // Di Linh / Bao Loc
      [11.60, 107.75], // Cat Tien
      [11.95, 107.95], // Lam Ha
      [12.20, 108.15]  // Da Lat plateau
    ],
    avgElevation: 1480,
    primaryVariety: 'Specialty Arabica (Bourbon, Typica & Catimor)',
    coopCount: 8,
    farmerCount: 1420,
    forestBaseline2020: '100% Shaded Forest Canopy Preserved',
    satellitePassDate: '10 Aug 2026 (Sentinel-2 MSI)',
    description: 'High-altitude microclimates on Lang Biang range (1,480m). Rainforest Alliance certified double fermentation.',
    descriptionVi: 'Thánh địa Specialty Arabica Cầu Đất - Lang Biang (1.480m). Khí hậu ôn đới mát mẻ, sơ chế ướt lên men kiểm soát.',
    signatureColor: '#a855f7',
    signatureBorderColor: '#c084fc',
    signatureFillColor: '#7e22ce',
    badgeTitleVi: 'LÂM ĐỒNG • SPECIALTY ARABICA',
    badgeTitleEn: 'LAM DONG • SPECIALTY ARABICA',
    badgeSubtitleVi: 'Cao Nguyên 1.480m • Lang Biang & Cầu Đất',
    badgeSubtitleEn: 'Plateau 1,480m • Lang Biang & Cau Dat',
    badgeType: 'arabica'
  },
  {
    id: 'gia_lai',
    name: 'Gia Lai Highlands (Pleiku, Chu Se & Chu Prong)',
    nameVi: 'Cao nguyên Gia Lai (Pleiku, Chư Sê & Chư Prông)',
    isKeyRegion: true,
    macroRegion: 'central_highlands',
    province: 'Gia Lai',
    lat: 13.9833,
    lng: 108.0000,
    zoomLevel: 9,
    polygonCoords: [
      [14.50, 107.75], // Chu Pah / Ia Grai
      [14.45, 108.45], // Kbang / An Khe
      [13.75, 108.65], // Kong Chro / Krong Pa
      [13.35, 108.20], // Chu Se / Chu Puh
      [13.55, 107.60], // Chu Prong
      [14.15, 107.50]  // Duc Co
    ],
    avgElevation: 780,
    primaryVariety: 'Organic Robusta & Agroforestry Shade Blend',
    coopCount: 6,
    farmerCount: 980,
    forestBaseline2020: 'Zero Forest Encroachment (EUDR Art. 3)',
    satellitePassDate: '08 Aug 2026 (ESA LandCover)',
    description: 'Pioneering organic shade agroforestry cooperative alliance with automated weighbridge digital tags.',
    descriptionVi: 'Vành đai Nông lâm kết hợp (Agroforestry) & Robusta hữu cơ. Tầng tán bóng mát tự nhiên, đất bazan cổ.',
    signatureColor: '#0ea5e9',
    signatureBorderColor: '#38bdf8',
    signatureFillColor: '#0284c7',
    badgeTitleVi: 'GIA LAI • NÔNG LÂM HỮU CƠ',
    badgeTitleEn: 'GIA LAI • AGROFORESTRY SHADE',
    badgeSubtitleVi: 'Tầng Tán Tự Nhiên • 980 Nông Hộ',
    badgeSubtitleEn: 'Natural Canopy • 980 Smallholders',
    badgeType: 'agroforestry'
  },
  {
    id: 'son_la',
    name: 'Son La Northwest Valley (Mai Son & Thuan Chau)',
    nameVi: 'Thung lũng Sơn La (Mai Sơn & Thuận Châu)',
    isKeyRegion: false,
    macroRegion: 'northwest',
    province: 'Son La',
    lat: 21.3256,
    lng: 103.9189,
    zoomLevel: 9,
    polygonCoords: [
      [21.65, 103.60],
      [21.60, 104.30],
      [21.05, 104.25],
      [20.90, 103.65]
    ],
    avgElevation: 1100,
    primaryVariety: 'Specialty Catimor (High-Altitude Washed Arabica)',
    coopCount: 5,
    farmerCount: 760,
    forestBaseline2020: 'Zero Deforestation Verified by Northern Forest Cadastre',
    satellitePassDate: '11 Aug 2026 (Sentinel-2A)',
    description: 'Northwestern mountain terraces producing washed specialty Arabica with bright acidity and floral notes.',
    descriptionVi: 'Vùng đồi dốc Tây Bắc với giống Arabica Catimor chế biến ướt, hương hoa quả sáng và chua thanh.',
    signatureColor: '#06b6d4',
    signatureBorderColor: '#22d3ee',
    signatureFillColor: '#0891b2',
    badgeTitleVi: 'SƠN LA • ARABICA TÂY BẮC',
    badgeTitleEn: 'SON LA • NORTHWEST ARABICA',
    badgeSubtitleVi: 'Đồi Dốc 1.100m • 760 Nông Hộ',
    badgeSubtitleEn: 'Mountain Terraces • 760 Smallholders',
    badgeType: 'general'
  },
  {
    id: 'dak_nong',
    name: 'Dak Nong Biosphere (Gia Nghia & Dak Mil)',
    nameVi: 'Khu Dự trữ Sinh quyển Đắk Nông (Gia Nghĩa)',
    isKeyRegion: false,
    macroRegion: 'central_highlands',
    province: 'Dak Nong',
    lat: 12.0022,
    lng: 107.6914,
    zoomLevel: 9,
    polygonCoords: [
      [12.45, 107.40],
      [12.35, 108.05],
      [11.75, 107.90],
      [11.70, 107.35]
    ],
    avgElevation: 690,
    primaryVariety: 'Fine Robusta & Excelsa',
    coopCount: 4,
    farmerCount: 650,
    forestBaseline2020: 'Buffer Zone Protected Canopy Pass',
    satellitePassDate: '09 Aug 2026 (Copernicus L2A)',
    description: 'UNESCO Global Geopark watershed zone. Smallholder sustainable intercropping models.',
    descriptionVi: 'Vùng đệm công viên địa chất toàn cầu UNESCO, mô hình xen canh cà phê bền vững.',
    signatureColor: '#14b8a6',
    signatureBorderColor: '#2dd4bf',
    signatureFillColor: '#0d9488',
    badgeTitleVi: 'ĐẮ́K NÔNG • SINH QUYỂN UNESCO',
    badgeTitleEn: 'DAK NONG • UNESCO BIOSPHERE',
    badgeSubtitleVi: 'Vùng Đệm Geopark • 650 Nông Hộ',
    badgeSubtitleEn: 'Geopark Buffer • 650 Smallholders',
    badgeType: 'general'
  }
];

// Logistics Port Gateways
const EXPORT_PORTS = [
  {
    id: 'cat_lai_port',
    name: 'Cat Lai Export Terminal (HCMC)',
    nameVi: 'Cảng Quốc Tế Cát Lái (TP.HCM)',
    code: 'VNSGN',
    lat: 10.7615,
    lng: 106.7865,
    role: 'Southern Deepsea Gateway (Hamburg, Rotterdam, Genoa)',
    roleVi: 'Cửa ngõ xuất khẩu chính đi Hamburg, Rotterdam, Genoa',
    status: 'GPS E-Seals Active'
  },
  {
    id: 'hai_phong_port',
    name: 'Hai Phong Gateway Port',
    nameVi: 'Cụm Cảng Quốc Tế Hải Phòng',
    code: 'VNHPH',
    lat: 20.8651,
    lng: 106.6838,
    role: 'Northern Export Gateway (Trieste & Mediterranean)',
    roleVi: 'Cửa ngõ xuất khẩu miền Bắc đi Trieste & Địa Trung Hải',
    status: 'Operational'
  }
];

// National Major Hubs & Sovereign Islands
const VIETNAM_LANDMARKS = [
  {
    name: 'Thủ đô Hà Nội',
    nameEn: 'Hanoi Capital City',
    lat: 21.0285,
    lng: 105.8542,
    type: 'capital',
    desc: 'Trung tâm Quản lý & Chứng nhận Nông nghiệp NPPO'
  },
  {
    name: 'TP. Hồ Chí Minh',
    nameEn: 'Ho Chi Minh City',
    lat: 10.8231,
    lng: 106.6297,
    type: 'commercial_hub',
    desc: 'Trung tâm Thương mại & Logistics Cà phê Xuất khẩu'
  },
  {
    name: 'TP. Đà Nẵng',
    nameEn: 'Da Nang City',
    lat: 16.0544,
    lng: 108.2022,
    type: 'hub',
    desc: 'Trung tâm Đầu mối Miền Trung'
  },
  {
    name: 'Quần đảo Hoàng Sa (Việt Nam)',
    nameEn: 'Hoang Sa Archipelago (Vietnam)',
    lat: 16.5367,
    lng: 112.0357,
    type: 'island',
    desc: 'Chủ quyền Lãnh thổ Việt Nam'
  },
  {
    name: 'Quần đảo Trường Sa (Việt Nam)',
    nameEn: 'Truong Sa Archipelago (Vietnam)',
    lat: 8.6433,
    lng: 111.9183,
    type: 'island',
    desc: 'Chủ quyền Lãnh thổ Việt Nam'
  },
  {
    name: 'Đảo Phú Quốc (Kiên Giang)',
    nameEn: 'Phu Quoc Island',
    lat: 10.2899,
    lng: 103.9840,
    type: 'island',
    desc: 'Vùng biển Tây Nam Việt Nam'
  }
];

export const GeographicOriginMap: React.FC<GeographicOriginMapProps> = ({
  shipments,
  onSelectShipment,
  darkMode,
}) => {
  const { language } = useLanguage();
  const isVi = language === 'vi';

  const [displayMode, setDisplayMode] = useState<MapDisplayMode>('interactive_map');
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>('dak_lak');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showLogisticsRoutes, setShowLogisticsRoutes] = useState<boolean>(true);
  const [showFarmPolygons, setShowFarmPolygons] = useState<boolean>(true);
  const [showVietnamBoundary, setShowVietnamBoundary] = useState<boolean>(true);
  const [showMacroBelts, setShowMacroBelts] = useState<boolean>(true);
  const [showKeyRegionBadges, setShowKeyRegionBadges] = useState<boolean>(true);
  const [tileTheme, setTileTheme] = useState<TileLayerTheme>('satellite');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Calculate Aggregated Metrics per Region
  const regionStats = useMemo(() => {
    return REGION_METADATA.map((reg) => {
      const regShipments = shipments.filter(
        (s) =>
          s.province.toLowerCase().includes(reg.province.toLowerCase()) ||
          s.region.toLowerCase().includes(reg.province.toLowerCase()) ||
          s.cooperative.toLowerCase().includes(reg.province.toLowerCase())
      );

      const totalVolumeKg = regShipments.reduce((acc, s) => acc + s.volumeKg, 0);
      const totalBags = regShipments.reduce((acc, s) => acc + s.bagsCount, 0);
      const totalPlots = regShipments.reduce((acc, s) => acc + (s.farmPlotsCount || 10), 0);
      const verifiedCount = regShipments.filter((s) => s.status === 'Verified' || s.status === 'Sent to Buyer').length;
      const missingCount = regShipments.filter((s) => s.status === 'Missing Documents').length;
      const pendingCount = regShipments.filter((s) => s.status === 'Pending Verification').length;

      const avgCupping = regShipments.length > 0
        ? (regShipments.reduce((acc, s) => acc + (s.cuppingScore || 84), 0) / regShipments.length).toFixed(1)
        : '84.0';

      return {
        ...reg,
        shipments: regShipments,
        shipmentCount: regShipments.length,
        totalVolumeKg,
        totalVolumeTons: (totalVolumeKg / 1000).toFixed(1),
        totalBags,
        totalPlots,
        verifiedCount,
        missingCount,
        pendingCount,
        avgCupping,
        isCompliant: missingCount === 0 && regShipments.length > 0,
      };
    });
  }, [shipments]);

  // Overall totals
  const totalMappedKg = regionStats.reduce((acc, r) => acc + r.totalVolumeKg, 0);
  const totalFarmers = regionStats.reduce((acc, r) => acc + r.farmerCount, 0);
  const totalCoops = regionStats.reduce((acc, r) => acc + r.coopCount, 0);
  
  const keyRegionsStats = regionStats.filter(r => r.isKeyRegion);
  const activeRegion = regionStats.find((r) => r.id === selectedRegionId) || regionStats[0];

  // Helper to build SVG Icons for Key Regions
  const getKeyRegionSvgIcon = (type: string, color: string) => {
    if (type === 'robusta') {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>`;
    } else if (type === 'arabica') {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>`;
    } else if (type === 'agroforestry') {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7l-3.3-4.4a1 1 0 0 0-1.4 0L9 7.3"/></svg>`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;
  };

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (displayMode !== 'interactive_map' || !mapContainerRef.current) return;

    // Check if map already exists
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: VIETNAM_CENTER,
        zoom: DEFAULT_ZOOM,
        minZoom: 5,
        maxZoom: 16,
        zoomControl: false,
        attributionControl: false
      });

      // Add Zoom Control at top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Attribution control at bottom right
      L.control.attribution({ position: 'bottomright', prefix: 'AgriTrust Vietnam GIS' }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    // Update Tile Layer
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    let tileAttribution = '&copy; Esri World Imagery & Copernicus Sentinel-2';

    if (tileTheme === 'street') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      tileAttribution = '&copy; OpenStreetMap contributors';
    } else if (tileTheme === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      tileAttribution = '&copy; CARTO & OpenStreetMap';
    }

    const newTileLayer = L.tileLayer(tileUrl, {
      maxZoom: 18,
      attribution: tileAttribution
    }).addTo(map);

    tileLayerRef.current = newTileLayer;

    // Clear previous markers/polygons
    if (layerGroupRef.current) {
      layerGroupRef.current.clearLayers();
    }
    const layerGroup = layerGroupRef.current || L.layerGroup().addTo(map);

    // 1. VIETNAM MAINLAND SOVEREIGN BOUNDARY HIGHLIGHT
    if (showVietnamBoundary) {
      // Golden outer halo
      L.polyline(VIETNAM_MAINLAND_OUTLINE, {
        color: '#f59e0b',
        weight: 3.5,
        opacity: 0.75,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(layerGroup);

      // Inner crisp boundary
      L.polyline(VIETNAM_MAINLAND_OUTLINE, {
        color: '#ffffff',
        weight: 1.2,
        opacity: 0.9,
        dashArray: '8, 4',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(layerGroup);
    }

    // 2. MACRO COFFEE BELT POLUGONS (Tây Nguyên & Tây Bắc)
    if (showMacroBelts) {
      MACRO_COFFEE_BELTS.forEach((belt) => {
        const beltPoly = L.polygon(belt.coords as [number, number][], {
          color: belt.color,
          weight: 1.5,
          opacity: 0.7,
          fillColor: belt.fillColor,
          fillOpacity: 0.08,
          dashArray: '6, 6'
        }).addTo(layerGroup);

        beltPoly.bindTooltip(`
          <div class="px-2 py-1 bg-slate-900/95 text-white border border-emerald-500 rounded text-xs">
            <strong class="text-emerald-400 block">${belt.name}</strong>
            <span class="text-[10px] text-slate-300">${belt.desc}</span>
          </div>
        `, { sticky: true });
      });
    }

    // 3. VIETNAM MAJOR HUBS & SOVEREIGN ISLANDS (Hoàng Sa, Trường Sa, Hà Nội, TP.HCM)
    VIETNAM_LANDMARKS.forEach((lm) => {
      if (lm.type === 'island') {
        const islandIcon = L.divIcon({
          className: 'custom-island-marker',
          html: `
            <div class="px-2 py-0.5 rounded-md bg-slate-950/90 text-amber-300 border border-amber-400/80 text-[10px] font-semibold tracking-wide shadow-md whitespace-nowrap backdrop-blur-xs flex items-center gap-1.5 transform -translate-x-1/2 -translate-y-1/2 hover:scale-105 transition-transform">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
              <span class="font-sans">${isVi ? lm.name : lm.nameEn}</span>
            </div>
          `,
          iconSize: [180, 22],
          iconAnchor: [90, 11]
        });
        const m = L.marker([lm.lat, lm.lng], { icon: islandIcon }).addTo(layerGroup);
        m.bindPopup(`
          <div class="p-2 space-y-1 text-slate-800 text-xs">
            <strong class="text-amber-700 font-bold block">${isVi ? lm.name : lm.nameEn}</strong>
            <p class="text-slate-600 text-[11px]">${isVi ? lm.desc : 'Territory of Vietnam'}</p>
          </div>
        `);
      } else if (lm.type === 'capital') {
        const capitalIcon = L.divIcon({
          className: 'custom-capital-marker',
          html: `
            <div class="group cursor-pointer text-center transform -translate-x-1/2 -translate-y-1/2">
              <div class="w-5 h-5 rounded-full bg-red-600 border border-amber-300 shadow-md flex items-center justify-center text-amber-200 font-bold text-[10px] mx-auto">
                ★
              </div>
              <div class="mt-0.5 px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[9.5px] font-medium text-slate-200 whitespace-nowrap shadow-sm">
                ${isVi ? lm.name : lm.nameEn}
              </div>
            </div>
          `,
          iconSize: [60, 28],
          iconAnchor: [30, 10]
        });
        const m = L.marker([lm.lat, lm.lng], { icon: capitalIcon }).addTo(layerGroup);
        m.bindPopup(`
          <div class="p-2 text-xs">
            <strong class="text-red-700 block">${isVi ? lm.name : lm.nameEn}</strong>
            <p class="text-slate-600 text-[11px]">${lm.desc}</p>
          </div>
        `);
      }
    });

    // Helper to generate interactive live summary tooltip HTML for region polygons and markers
    const generateRegionTooltipHtml = (reg: typeof regionStats[0]) => {
      const pendingDocsTotal = reg.missingCount + reg.pendingCount;
      
      const pendingBadgeClass = reg.missingCount > 0 
        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50' 
        : (reg.pendingCount > 0 ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40');

      const pendingStatusText = reg.missingCount > 0
        ? `${reg.missingCount} ${isVi ? 'Hồ sơ thiếu' : 'Missing Docs'}`
        : (reg.pendingCount > 0 
            ? `${reg.pendingCount} ${isVi ? 'Đang duyệt' : 'In Verification'}` 
            : `${isVi ? '0 Hồ sơ chờ (100% Đạt)' : '0 Pending (All Verified)'}`);

      return `
        <div class="region-tooltip-card" style="--tooltip-border-color: ${reg.signatureBorderColor}; --tooltip-glow-color: ${reg.signatureColor}66;">
          <!-- Header Bar with Region Identity -->
          <div class="flex items-center justify-between gap-2 pb-2 border-b border-slate-700/80 mb-2.5">
            <div class="flex items-center gap-1.5 min-w-0">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${reg.signatureColor};"></span>
              <span class="font-bold text-xs text-white uppercase tracking-wider truncate font-sans">
                ${isVi ? reg.nameVi.split('(')[0] : reg.name.split('(')[0]}
              </span>
            </div>
            <span class="shrink-0 text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              ${reg.avgElevation}m ALT
            </span>
          </div>

          <!-- 2x2 Interactive Live Metrics Grid -->
          <div class="grid grid-cols-2 gap-2 text-[11px] mb-2.5">
            
            <!-- 1. Number of Active Plots -->
            <div class="p-2 rounded-lg bg-slate-800/90 border border-slate-700/70 hover:border-emerald-500/50 transition-colors">
              <span class="text-[9.5px] text-slate-400 block font-medium uppercase tracking-tight">
                ${isVi ? 'Mảnh Vườn Hoạt Động' : 'Active Farm Plots'}
              </span>
              <div class="flex items-center gap-1.5 mt-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span class="text-xs font-bold font-mono text-emerald-300">
                  ${reg.totalPlots} ${isVi ? 'Mảnh' : 'Plots'}
                </span>
              </div>
            </div>

            <!-- 2. Total Pending Docs -->
            <div class="p-2 rounded-lg bg-slate-800/90 border border-slate-700/70 hover:border-amber-500/50 transition-colors">
              <span class="text-[9.5px] text-slate-400 block font-medium uppercase tracking-tight">
                ${isVi ? 'Hồ Sơ Cần Xử Lý' : 'Pending Docs'}
              </span>
              <span class="text-[10px] font-semibold font-mono px-1.5 py-0.5 rounded border inline-flex items-center gap-1 mt-1 ${pendingBadgeClass}">
                ${pendingStatusText}
              </span>
            </div>

            <!-- 3. Sourced Volume & Lots -->
            <div class="p-2 rounded-lg bg-slate-800/90 border border-slate-700/70">
              <span class="text-[9.5px] text-slate-400 block font-medium uppercase tracking-tight">
                ${isVi ? 'Sản Lượng Tiếp Cận' : 'Sourced Volume'}
              </span>
              <span class="text-xs font-bold font-mono text-amber-300 block mt-0.5">
                ${reg.totalVolumeTons} MT <span class="text-[9.5px] text-slate-400 font-normal">(${reg.shipmentCount} ${isVi ? 'Lô' : 'Lots'})</span>
              </span>
            </div>

            <!-- 4. Registered Smallholders & Cooperatives -->
            <div class="p-2 rounded-lg bg-slate-800/90 border border-slate-700/70">
              <span class="text-[9.5px] text-slate-400 block font-medium uppercase tracking-tight">
                ${isVi ? 'Nông Hộ & Hợp Tác Xã' : 'Smallholders & Coops'}
              </span>
              <span class="text-xs font-bold font-mono text-sky-300 block mt-0.5">
                ${reg.farmerCount.toLocaleString()} ${isVi ? 'Hộ' : 'Farmers'} • ${reg.coopCount} HTX
              </span>
            </div>

          </div>

          <!-- EUDR Compliance & Quick Navigation Hint -->
          <div class="pt-2 border-t border-slate-700/70 flex items-center justify-between text-[10px]">
            <span class="text-emerald-400 font-semibold flex items-center gap-1">
              <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
              <span>${isVi ? 'EUDR: 0.0% Phá Rừng' : 'EUDR: Zero Deforestation'}</span>
            </span>
            <span class="text-slate-400 italic text-[9.5px]">
              ${isVi ? 'Nhấp để chọn vùng →' : 'Click to inspect →'}
            </span>
          </div>
        </div>
      `;
    };

    // 4. ADD EXPLICITLY STYLED & DISTINCT POLYGONS FOR COFFEE GROWING REGIONS (Focus: Dak Lak, Lam Dong, Gia Lai)
    if (showFarmPolygons) {
      regionStats.forEach((reg) => {
        const isSelected = selectedRegionId === reg.id;
        const isKey = reg.isKeyRegion;
        
        let polyClass = '';
        if (reg.id === 'dak_lak') polyClass = 'key-region-polygon-daklak';
        else if (reg.id === 'lam_dong') polyClass = 'key-region-polygon-lamdong';
        else if (reg.id === 'gia_lai') polyClass = 'key-region-polygon-gialai';

        const polygon = L.polygon(reg.polygonCoords, {
          color: isSelected ? '#ffffff' : reg.signatureBorderColor,
          weight: isSelected ? 3.5 : (isKey ? 2.5 : 1.5),
          opacity: isKey ? 0.95 : 0.75,
          fillColor: reg.signatureFillColor,
          fillOpacity: isSelected ? 0.45 : (isKey ? 0.32 : 0.18),
          dashArray: isSelected ? undefined : (isKey ? undefined : '4, 4'),
          className: polyClass
        });

        // Interactive Live Summary Tooltip on Region Polygon Hover
        polygon.bindTooltip(generateRegionTooltipHtml(reg), {
          sticky: true,
          direction: 'auto',
          className: 'custom-region-leaflet-tooltip',
          opacity: 1
        });

        // Dynamic Interactive Hover Highlight
        polygon.on('mouseover', (e) => {
          const layer = e.target;
          layer.setStyle({
            weight: isKey ? 3.5 : 2.5,
            color: '#ffffff',
            opacity: 1,
            fillOpacity: isKey ? 0.48 : 0.35
          });
          layer.bringToFront();
        });

        polygon.on('mouseout', (e) => {
          const layer = e.target;
          layer.setStyle({
            color: isSelected ? '#ffffff' : reg.signatureBorderColor,
            weight: isSelected ? 3.5 : (isKey ? 2.5 : 1.5),
            opacity: isKey ? 0.95 : 0.75,
            fillOpacity: isSelected ? 0.45 : (isKey ? 0.32 : 0.18)
          });
        });

        polygon.on('click', () => {
          setSelectedRegionId(reg.id);
          map.flyTo([reg.lat, reg.lng], reg.zoomLevel, { duration: 1.0 });
          if (reg.shipments.length > 0) {
            onSelectShipment(reg.shipments[0].id);
          }
        });

        polygon.addTo(layerGroup);
      });
    }

    // 5. ADD LOGISTICS PORT CORRIDORS (Supply Flow to Export Terminals)
    if (showLogisticsRoutes) {
      // Dak Lak to Cat Lai Port
      L.polyline([[12.6683, 108.0383], [11.8, 107.5], [10.7615, 106.7865]], {
        color: '#10b981',
        weight: 2.2,
        opacity: 0.8,
        className: 'logistics-corridor-line'
      }).addTo(layerGroup);

      // Lam Dong to Cat Lai Port
      L.polyline([[11.9404, 108.4583], [11.3, 107.8], [10.7615, 106.7865]], {
        color: '#a855f7',
        weight: 2.2,
        opacity: 0.8,
        className: 'logistics-corridor-line'
      }).addTo(layerGroup);

      // Gia Lai to Cat Lai Port
      L.polyline([[13.9833, 108.0000], [12.6683, 108.0383], [10.7615, 106.7865]], {
        color: '#0ea5e9',
        weight: 2.2,
        opacity: 0.8,
        className: 'logistics-corridor-line'
      }).addTo(layerGroup);

      // Son La to Hai Phong Port
      L.polyline([[21.3256, 103.9189], [21.0, 105.8], [20.8651, 106.6838]], {
        color: '#06b6d4',
        weight: 2.2,
        opacity: 0.8,
        className: 'logistics-corridor-line'
      }).addTo(layerGroup);
    }

    // 6. ADD EXPORT PORTS MARKERS (Cát Lái & Hải Phòng)
    EXPORT_PORTS.forEach((port) => {
      const portIcon = L.divIcon({
        className: 'custom-port-marker',
        html: `
          <div class="group cursor-pointer text-center transform -translate-x-1/2 -translate-y-1/2">
            <div class="w-6 h-6 rounded-full bg-blue-600 border border-white shadow-md flex items-center justify-center text-white mx-auto hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>
            </div>
            <div class="mt-0.5 px-1.5 py-0.5 rounded bg-slate-900/90 border border-blue-400/60 text-[9px] font-mono font-medium text-blue-200 whitespace-nowrap shadow-sm">
              ⚓ ${port.code}
            </div>
          </div>
        `,
        iconSize: [50, 30],
        iconAnchor: [25, 12]
      });

      const marker = L.marker([port.lat, port.lng], { icon: portIcon }).addTo(layerGroup);
      marker.bindPopup(`
        <div class="p-2 space-y-1 text-slate-800 text-xs font-sans">
          <strong class="text-blue-700 text-sm block">${isVi ? port.nameVi : port.name}</strong>
          <p class="text-slate-600 text-[11px]">${isVi ? port.roleVi : port.role}</p>
          <div class="pt-1 text-[10px] font-mono text-emerald-700 font-bold">✓ ${port.status}</div>
        </div>
      `);
    });

    // 7. ADD SLEEK, COMPACT LABELED BADGES DIRECTLY ON KEY REGIONS (Dak Lak, Lam Dong, Gia Lai)
    if (showKeyRegionBadges) {
      regionStats.forEach((reg) => {
        // Apply status filter if set
        if (statusFilter === 'Verified' && reg.missingCount > 0 && reg.verifiedCount === 0) return;
        if (statusFilter === 'Missing Documents' && reg.missingCount === 0) return;

        const isSelected = selectedRegionId === reg.id;
        const isKey = reg.isKeyRegion;

        let labelClass = 'key-region-label-daklak';
        if (reg.id === 'lam_dong') {
          labelClass = 'key-region-label-lamdong';
        } else if (reg.id === 'gia_lai') {
          labelClass = 'key-region-label-gialai';
        }

        const iconSvg = getKeyRegionSvgIcon(reg.badgeType, '#ffffff');

        // Render Sleek Compact Badge for Key Regions vs standard marker for others
        if (isKey) {
          const keyRegionOverlayIcon = L.divIcon({
            className: 'key-region-custom-overlay',
            html: `
              <div class="relative group cursor-pointer text-center transform -translate-x-1/2 -translate-y-1/2 key-region-badge-compact">
                <!-- Sleek Minimalist Pill Badge -->
                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white shadow-md ${labelClass} ${isSelected ? 'ring-2 ring-white scale-105' : 'hover:scale-105'} transition-all">
                  <div class="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    ${iconSvg}
                  </div>
                  <div class="flex items-center gap-1 text-[11px] font-bold whitespace-nowrap leading-none">
                    <span>${reg.province}</span>
                    <span class="text-[9.5px] font-mono opacity-90 px-1 py-0.5 bg-black/30 rounded font-normal">${reg.totalVolumeTons} MT</span>
                  </div>
                </div>
              </div>
            `,
            iconSize: [130, 26],
            iconAnchor: [65, 13]
          });

          const marker = L.marker([reg.lat, reg.lng], { icon: keyRegionOverlayIcon, zIndexOffset: 1000 }).addTo(layerGroup);

          // Interactive live summary tooltip on hover
          marker.bindTooltip(generateRegionTooltipHtml(reg), {
            direction: 'top',
            offset: [0, -16],
            className: 'custom-region-leaflet-tooltip',
            opacity: 1
          });

          marker.bindPopup(`
            <div class="p-3 space-y-2 text-slate-800 text-xs font-sans min-w-[250px]">
              <div class="border-b border-slate-200 pb-2">
                <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white font-mono" style="background-color: ${reg.signatureFillColor};">
                  ${isVi ? 'VÙNG TRỒNG TRỌNG ĐIỂM' : 'KEY COFFEE REGION'}
                </span>
                <h4 class="font-bold text-sm text-slate-900 mt-1">${isVi ? reg.nameVi : reg.name}</h4>
              </div>
              <div class="space-y-1.5 text-[11px] text-slate-600">
                <div class="flex justify-between">
                  <span>${isVi ? 'Giống đặc trưng:' : 'Variety:'}</span>
                  <strong class="font-sans text-slate-900">${reg.primaryVariety}</strong>
                </div>
                <div class="flex justify-between">
                  <span>${isVi ? 'Quy mô vùng trồng:' : 'Capacity:'}</span>
                  <strong class="font-mono text-slate-900 font-bold">${reg.coopCount} HTX • ${reg.farmerCount} Hộ</strong>
                </div>
                <div class="flex justify-between">
                  <span>${isVi ? 'Sản lượng tiếp cận:' : 'Sourced Volume:'}</span>
                  <strong class="font-mono text-emerald-700 font-bold">${reg.totalVolumeKg.toLocaleString()} kg (${reg.totalVolumeTons} MT)</strong>
                </div>
                <div class="flex justify-between">
                  <span>${isVi ? 'Độ cao thổ nhưỡng:' : 'Elevation:'}</span>
                  <strong class="font-mono text-slate-900">${reg.avgElevation}m ALT</strong>
                </div>
                <div class="flex justify-between">
                  <span>${isVi ? 'Tuân thủ EUDR 2020:' : 'EUDR Status:'}</span>
                  <strong class="font-mono text-emerald-700 font-bold">100% Zero Deforestation</strong>
                </div>
              </div>
              <div class="pt-2 border-t border-slate-100 text-right">
                <span class="text-[10px] text-emerald-600 font-bold italic">${isVi ? 'Nhấp để xem lô hàng bên phải →' : 'Click to inspect lots →'}</span>
              </div>
            </div>
          `);

          marker.on('click', () => {
            setSelectedRegionId(reg.id);
            if (reg.shipments.length > 0) {
              onSelectShipment(reg.shipments[0].id);
            }
          });
        } else {
          // Standard marker for other regions
          const standardPinIcon = L.divIcon({
            className: 'custom-coffee-pin',
            html: `
              <div class="relative group cursor-pointer text-center transform -translate-x-1/2 -translate-y-1/2">
                <div class="relative inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border shadow-sm font-semibold text-[10.5px] bg-slate-900/90 text-slate-200 border-cyan-500/70 ${isSelected ? 'ring-2 ring-white scale-105' : 'hover:scale-105'} transition-all">
                  <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span class="font-sans">${reg.province}</span>
                </div>
              </div>
            `,
            iconSize: [80, 22],
            iconAnchor: [40, 11]
          });

          const marker = L.marker([reg.lat, reg.lng], { icon: standardPinIcon }).addTo(layerGroup);
          
          // Interactive live summary tooltip on hover
          marker.bindTooltip(generateRegionTooltipHtml(reg), {
            direction: 'top',
            offset: [0, -14],
            className: 'custom-region-leaflet-tooltip',
            opacity: 1
          });

          marker.on('click', () => {
            setSelectedRegionId(reg.id);
            if (reg.shipments.length > 0) {
              onSelectShipment(reg.shipments[0].id);
            }
          });
        }
      });
    }

    // Invalidate size to avoid grey tiles when mounted
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

  }, [
    displayMode, 
    tileTheme, 
    showFarmPolygons, 
    showLogisticsRoutes, 
    showVietnamBoundary,
    showMacroBelts,
    showKeyRegionBadges,
    statusFilter, 
    selectedRegionId, 
    regionStats, 
    isVi
  ]);

  // Handler to fly to region on map
  const handleFlyToRegion = (region: RegionOriginMeta) => {
    setSelectedRegionId(region.id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([region.lat, region.lng], region.zoomLevel, { duration: 1.2 });
    }
    if (regionStats.find(r => r.id === region.id)?.shipments.length) {
      const target = regionStats.find(r => r.id === region.id);
      if (target && target.shipments.length > 0) {
        onSelectShipment(target.shipments[0].id);
      }
    }
  };

  const handleFlyToMacroBelt = (macro: 'central_highlands' | 'northwest') => {
    if (!mapInstanceRef.current) return;
    if (macro === 'central_highlands') {
      mapInstanceRef.current.flyTo([12.8, 108.1], 7.5, { duration: 1.2 });
    } else {
      mapInstanceRef.current.flyTo([21.3, 104.0], 8, { duration: 1.2 });
    }
  };

  const handleResetVietnamView = () => {
    setSelectedRegionId(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(VIETNAM_CENTER, DEFAULT_ZOOM, { duration: 1.2 });
    }
  };

  return (
    <div 
      id="geographic-origin-density-map"
      className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden transition-all"
    >
      {/* 1. Header Bar with Mode Toggles & Summary Stats */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/80 dark:bg-slate-900/70">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-600/10 dark:bg-emerald-400/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-white flex items-center gap-2">
                  <span>{isVi ? 'Bản Đồ Vùng Trồng Cà Phê Việt Nam & Vùng Trọng Điểm EUDR' : 'Vietnam Coffee Origin & Key Growing Regions Map (EUDR)'}</span>
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>{isVi ? '3 Vùng Chủ Lực' : '3 Key Regions'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isVi
                  ? 'Nổi bật biên giới lãnh thổ Việt Nam & phủ bóng rõ rệt 3 vùng trồng trọng điểm: Đắk Lắk (Robusta), Lâm Đồng (Specialty Arabica), Gia Lai (Nông lâm hữu cơ).'
                  : 'Featuring Vietnam territory boundary with distinct SVG & GeoJSON polygon highlights for key origins: Dak Lak, Lam Dong, Gia Lai.'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls / View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Display Mode Tabs */}
          <div className="flex items-center p-1 rounded-lg bg-slate-200/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              id="map-view-interactive-btn"
              type="button"
              onClick={() => setDisplayMode('interactive_map')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                displayMode === 'interactive_map'
                  ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass size={13} />
              <span>{isVi ? 'Bản Đồ GIS Trực Quan' : 'Vietnam GIS Map'}</span>
            </button>

            <button
              id="map-view-grid-btn"
              type="button"
              onClick={() => setDisplayMode('density_grid')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                displayMode === 'density_grid'
                  ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers size={13} />
              <span>{isVi ? 'Ma Trận Vùng Trồng' : 'Origin Matrix'}</span>
            </button>

            <button
              id="map-view-satellite-btn"
              type="button"
              onClick={() => setDisplayMode('satellite_layers')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                displayMode === 'satellite_layers'
                  ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Trees size={13} />
              <span>{isVi ? 'Vệ Tinh Sentinel-2' : 'Sentinel-2 Audit'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Regions Highlight Card Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-700">
        
        {/* Dak Lak Focus Card */}
        <div 
          onClick={() => {
            const reg = regionStats.find(r => r.id === 'dak_lak');
            if (reg) handleFlyToRegion(reg);
          }}
          className={`p-3.5 sm:px-5 sm:py-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 cursor-pointer hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40 transition-colors border-l-4 border-emerald-500 flex items-center justify-between ${
            selectedRegionId === 'dak_lak' ? 'ring-2 ring-emerald-500 bg-emerald-100/90 dark:bg-emerald-900/50' : ''
          }`}
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                {isVi ? 'VÙNG TRỌNG ĐIỂM #1' : 'KEY REGION #1'}
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Coffee size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>{isVi ? 'Đắk Lắk (Buôn Ma Thuột)' : 'Dak Lak (Robusta Capital)'}</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isVi ? '2.850 hộ • 14 HTX • Fine Robusta G1' : '2,850 farmers • 14 Coops • Fine Robusta'}
            </p>
          </div>
          <div className="text-right font-mono">
            <span className="text-base font-black text-emerald-700 dark:text-emerald-300">
              {regionStats.find(r => r.id === 'dak_lak')?.totalVolumeTons || '0.0'} MT
            </span>
            <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">620m ALT</span>
          </div>
        </div>

        {/* Lam Dong Focus Card */}
        <div 
          onClick={() => {
            const reg = regionStats.find(r => r.id === 'lam_dong');
            if (reg) handleFlyToRegion(reg);
          }}
          className={`p-3.5 sm:px-5 sm:py-3.5 bg-purple-50/70 dark:bg-purple-950/30 cursor-pointer hover:bg-purple-100/70 dark:hover:bg-purple-900/40 transition-colors border-l-4 border-purple-500 flex items-center justify-between ${
            selectedRegionId === 'lam_dong' ? 'ring-2 ring-purple-500 bg-purple-100/90 dark:bg-purple-900/50' : ''
          }`}
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                {isVi ? 'VÙNG TRỌNG ĐIỂM #2' : 'KEY REGION #2'}
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Mountain size={14} className="text-purple-600 dark:text-purple-400" />
              <span>{isVi ? 'Lâm Đồng (Đà Lạt & Cầu Đất)' : 'Lam Dong (Specialty Arabica)'}</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isVi ? '1.420 hộ • Bourbon, Typica & Catimor' : '1,420 farmers • Bourbon, Typica'}
            </p>
          </div>
          <div className="text-right font-mono">
            <span className="text-base font-black text-purple-700 dark:text-purple-300">
              {regionStats.find(r => r.id === 'lam_dong')?.totalVolumeTons || '0.0'} MT
            </span>
            <span className="block text-[10px] text-purple-600 dark:text-purple-400 font-bold">1.480m ALT</span>
          </div>
        </div>

        {/* Gia Lai Focus Card */}
        <div 
          onClick={() => {
            const reg = regionStats.find(r => r.id === 'gia_lai');
            if (reg) handleFlyToRegion(reg);
          }}
          className={`p-3.5 sm:px-5 sm:py-3.5 bg-sky-50/70 dark:bg-sky-950/30 cursor-pointer hover:bg-sky-100/70 dark:hover:bg-sky-900/40 transition-colors border-l-4 border-sky-500 flex items-center justify-between ${
            selectedRegionId === 'gia_lai' ? 'ring-2 ring-sky-500 bg-sky-100/90 dark:bg-sky-900/50' : ''
          }`}
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                {isVi ? 'VÙNG TRỌNG ĐIỂM #3' : 'KEY REGION #3'}
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Trees size={14} className="text-sky-600 dark:text-sky-400" />
              <span>{isVi ? 'Gia Lai (Pleiku & Chư Prông)' : 'Gia Lai (Agroforestry)'}</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isVi ? '980 hộ • Nông lâm kết hợp hữu cơ' : '980 farmers • Organic Agroforestry'}
            </p>
          </div>
          <div className="text-right font-mono">
            <span className="text-base font-black text-sky-700 dark:text-sky-300">
              {regionStats.find(r => r.id === 'gia_lai')?.totalVolumeTons || '0.0'} MT
            </span>
            <span className="block text-[10px] text-sky-600 dark:text-sky-400 font-bold">780m ALT</span>
          </div>
        </div>

      </div>

      {/* 3. Main Interactive Vietnam Map & Density Section */}
      {displayMode === 'interactive_map' && (
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left 7-Cols: Interactive Leaflet Map of Vietnam */}
          <div className="lg:col-span-7 space-y-3">
            
            {/* Map Canvas Header Tools */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              {/* Quick Fly-to Navigation Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleResetVietnamView}
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs cursor-pointer inline-flex items-center gap-1 transition-colors"
                >
                  <RotateCcw size={11} />
                  <span>{isVi ? 'Toàn Cảnh VN' : 'Vietnam Full'}</span>
                </button>

                {/* Specific Focus for Key Regions */}
                <button
                  type="button"
                  onClick={() => {
                    const reg = regionStats.find(r => r.id === 'dak_lak');
                    if (reg) handleFlyToRegion(reg);
                  }}
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer inline-flex items-center gap-1 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>Đắk Lắk</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const reg = regionStats.find(r => r.id === 'lam_dong');
                    if (reg) handleFlyToRegion(reg);
                  }}
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs cursor-pointer inline-flex items-center gap-1 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>Lâm Đồng</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const reg = regionStats.find(r => r.id === 'gia_lai');
                    if (reg) handleFlyToRegion(reg);
                  }}
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-xs cursor-pointer inline-flex items-center gap-1 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>Gia Lai</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleFlyToMacroBelt('northwest')}
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 cursor-pointer inline-flex items-center gap-1 transition-colors"
                >
                  <span>Sơn La (Tây Bắc)</span>
                </button>
              </div>

              {/* Map Layer & Tile Switcher */}
              <div className="flex items-center gap-2">
                <div className="flex items-center p-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setTileTheme('satellite')}
                    className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-all ${
                      tileTheme === 'satellite' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {isVi ? 'Vệ Tinh' : 'Satellite'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTileTheme('street')}
                    className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-all ${
                      tileTheme === 'street' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {isVi ? 'Địa Hình' : 'Street'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTileTheme('dark')}
                    className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-all ${
                      tileTheme === 'dark' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {isVi ? 'Tối' : 'Dark'}
                  </button>
                </div>
              </div>
            </div>

            {/* Layer Filter Toggles Toolbar */}
            <div className="flex flex-wrap items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-100/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-[11px]">
              <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                {isVi ? 'Lớp Hiển Thị:' : 'Layers:'}
              </span>

              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none text-slate-700 dark:text-slate-300 font-medium">
                <input
                  type="checkbox"
                  checked={showKeyRegionBadges}
                  onChange={(e) => setShowKeyRegionBadges(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">{isVi ? 'Thẻ 3 Vùng Trọng Điểm' : 'Key Region Badges'}</span>
              </label>

              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none text-slate-700 dark:text-slate-300 font-medium">
                <input
                  type="checkbox"
                  checked={showVietnamBoundary}
                  onChange={(e) => setShowVietnamBoundary(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-amber-600 dark:text-amber-400 font-bold">{isVi ? 'Biên Giới Việt Nam' : 'Vietnam Border'}</span>
              </label>

              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none text-slate-700 dark:text-slate-300 font-medium">
                <input
                  type="checkbox"
                  checked={showFarmPolygons}
                  onChange={(e) => setShowFarmPolygons(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span>{isVi ? 'Đa Giác Vùng Trồng' : 'Farm Polygons'}</span>
              </label>

              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none text-slate-700 dark:text-slate-300 font-medium">
                <input
                  type="checkbox"
                  checked={showLogisticsRoutes}
                  onChange={(e) => setShowLogisticsRoutes(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-blue-600 dark:text-blue-400">{isVi ? 'Tuyến Vận Tải Cảng' : 'Port Corridors'}</span>
              </label>
            </div>

            {/* Interactive Leaflet Map Container */}
            <div className="relative w-full h-[520px] sm:h-[580px] rounded-xl border-2 border-slate-300 dark:border-slate-700 overflow-hidden shadow-inner bg-slate-950">
              <div 
                ref={mapContainerRef} 
                className="w-full h-full z-10"
              />

              {/* Sovereign Territory Header HUD */}
              <div className="absolute top-3 left-3 px-3 py-2 rounded-lg bg-slate-950/90 border border-amber-500/60 backdrop-blur-xs text-[10px] font-mono text-slate-200 space-y-0.5 z-20 pointer-events-none shadow-xl">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                  <Radio size={12} />
                  <span>VIỆT NAM • NGUỒN GỐC CÀ PHÊ & 3 VÙNG TRỌNG ĐIỂM EUDR</span>
                </div>
                <div className="text-slate-300 flex items-center gap-2 pt-0.5">
                  <span>Trọng Điểm: <strong className="text-emerald-400">Đắk Lắk</strong> • <strong className="text-purple-400">Lâm Đồng</strong> • <strong className="text-sky-400">Gia Lai</strong></span>
                  <span>•</span>
                  <span>100% 0.0% Rủi Ro</span>
                </div>
              </div>

              {/* Map Legend Overlay with Key Region Distinct Color Palette */}
              <div className="absolute bottom-3 left-3 p-3 rounded-lg bg-slate-950/95 border border-slate-700/80 backdrop-blur-xs text-[10px] text-slate-200 space-y-1.5 font-medium z-20 shadow-2xl max-w-xs">
                <div className="font-bold text-[11px] text-white border-b border-slate-800 pb-1 flex items-center justify-between">
                  <span>{isVi ? 'Chú Dẫn Bản Đồ Vùng Trồng' : 'Map Origin Legend'}</span>
                  <span className="text-emerald-400 font-mono">EUDR 2020</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-500 border border-emerald-300 shadow-xs flex items-center justify-center text-[7px] text-black font-bold">1</span>
                  <span className="font-bold text-emerald-300">{isVi ? 'Đắk Lắk (Thủ phủ Robusta Thế Giới)' : 'Dak Lak (World Robusta Capital)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-purple-500 border border-purple-300 shadow-xs flex items-center justify-center text-[7px] text-white font-bold">2</span>
                  <span className="font-bold text-purple-300">{isVi ? 'Lâm Đồng (Specialty Arabica Cầu Đất)' : 'Lam Dong (Specialty Arabica)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-sky-500 border border-sky-300 shadow-xs flex items-center justify-center text-[7px] text-black font-bold">3</span>
                  <span className="font-bold text-sky-300">{isVi ? 'Gia Lai (Nông Lâm Kết Hợp Hữu Cơ)' : 'Gia Lai (Organic Agroforestry)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-1.5 rounded-full bg-amber-400 border border-amber-300 shadow-xs" />
                  <span className="text-amber-300">{isVi ? 'Biên Giới Lãnh Thổ Việt Nam (Hoàng Sa & Trường Sa)' : 'Vietnam Sovereign Territory Border'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-xs" />
                  <span>{isVi ? 'Cảng Biển Xuất Khẩu (Cát Lái & Hải Phòng)' : 'Export Deepsea Terminals'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5-Cols: Active Region Inspector & Smallholder Traceability Dossier */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Selected Region Detailed Card */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs">
              <div className="flex items-start justify-between gap-2 border-b border-slate-200 dark:border-slate-700/80 pb-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span 
                      className="px-2 py-0.5 rounded text-[9.5px] font-mono font-bold text-white uppercase shadow-xs inline-flex items-center gap-1"
                      style={{ backgroundColor: activeRegion.signatureFillColor }}
                    >
                      <ShieldCheck size={11} />
                      <span>{activeRegion.isKeyRegion ? (isVi ? 'VÙNG TRỌNG ĐIỂM QUỐC GIA' : 'KEY SOURCING REGION') : (isVi ? 'VÙNG LIÊN KẾT' : 'AFFILIATE REGION')}</span>
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white mt-1">
                    {isVi ? activeRegion.nameVi : activeRegion.name}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => handleFlyToRegion(activeRegion)}
                  className="px-2.5 py-1 rounded text-xs font-mono font-bold text-white shadow-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                  style={{ backgroundColor: activeRegion.signatureFillColor }}
                >
                  <ZoomIn size={12} />
                  <span>{activeRegion.avgElevation}m ALT</span>
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isVi ? activeRegion.descriptionVi : activeRegion.description}
              </p>

              {/* Sourcing Detailed Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">{isVi ? 'Giống Cà Phê Đặc Trưng' : 'Primary Variety'}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{activeRegion.primaryVariety}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">{isVi ? 'Quy Mô Nông Hộ Tiếp Cận' : 'Smallholders Indexed'}</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {activeRegion.coopCount} HTX • {activeRegion.farmerCount} Nông hộ
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">{isVi ? 'Sản Lượng Đang Tiếp Cận' : 'Active Volume'}</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                    {activeRegion.totalVolumeKg.toLocaleString()} kg ({activeRegion.totalVolumeTons} MT)
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">{isVi ? 'Đối Soát Vệ Tinh Sentinel-2' : 'Satellite Audit'}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle size={13} />
                    <span>0.0% Phá Rừng</span>
                  </span>
                </div>
              </div>

              {/* Active Shipments in this Region */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>{isVi ? 'Danh Sách Lô Hàng Xuất Khẩu Tại Vùng' : 'Active Export Lots in Region'}</span>
                  <span className="text-[11px] font-mono text-slate-400 font-normal">({activeRegion.shipments.length} {isVi ? 'lô' : 'lots'})</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activeRegion.shipments.map((s) => {
                    const isMissing = s.status === 'Missing Documents';
                    return (
                      <div
                        key={s.id}
                        onClick={() => onSelectShipment(s.id)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
                          isMissing
                            ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 hover:bg-amber-100/60'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-slate-900 dark:text-white">{s.id}</span>
                            <span className="text-[10px] font-mono text-slate-400">({s.lotCode})</span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate max-w-xs">{s.cooperative} • {s.targetBuyer}</p>
                        </div>

                        <div className="text-right flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            {(s.volumeKg / 1000).toFixed(1)} MT
                          </span>
                          <ArrowRight size={14} className="text-slate-400 group-hover:text-emerald-500" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Key 3 Regions Switcher Pills */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  {isVi ? '3 Vùng Trồng Cà Phê Trọng Điểm Việt Nam:' : 'Key Vietnamese Coffee Origins:'}
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {keyRegionsStats.reduce((acc, r) => acc + r.farmerCount, 0).toLocaleString()} {isVi ? 'nông hộ' : 'farmers'}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {keyRegionsStats.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleFlyToRegion(r)}
                    className={`p-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left border ${
                      selectedRegionId === r.id
                        ? 'text-white shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                    style={selectedRegionId === r.id ? { backgroundColor: r.signatureFillColor, borderColor: r.signatureBorderColor } : {}}
                  >
                    <div className="font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedRegionId === r.id ? '#ffffff' : r.signatureFillColor }}></span>
                      <span>{r.province}</span>
                    </div>
                    <div className="text-[10px] font-mono opacity-85 mt-0.5">{r.totalVolumeTons} MT</div>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 4. Density Grid / Origin Matrix View */}
      {displayMode === 'density_grid' && (
        <div className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regionStats.map((reg) => {
              const hasMissing = reg.missingCount > 0;
              const isKey = reg.isKeyRegion;
              return (
                <div
                  key={reg.id}
                  className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                    isKey ? 'border-2' : ''
                  } ${
                    hasMissing
                      ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                  style={isKey ? { borderColor: reg.signatureBorderColor } : {}}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white font-mono"
                            style={{ backgroundColor: reg.signatureFillColor }}
                          >
                            {isKey ? (isVi ? 'VÙNG TRỌNG ĐIỂM' : 'KEY ORIGIN') : (isVi ? 'VÙNG TIẾP CẬN' : 'AFFILIATE')}
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white mt-1">{isVi ? reg.nameVi : reg.name}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {reg.avgElevation}m
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {isVi ? reg.descriptionVi : reg.description}
                    </p>

                    {/* Progress density bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">{isVi ? 'Tỷ trọng xuất khẩu' : 'Export Share'}</span>
                        <strong className="text-slate-800 dark:text-slate-100">
                          {totalMappedKg > 0 ? Math.round((reg.totalVolumeKg / totalMappedKg) * 100) : 0}%
                        </strong>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ 
                            width: `${totalMappedKg > 0 ? Math.round((reg.totalVolumeKg / totalMappedKg) * 100) : 0}%`,
                            backgroundColor: reg.signatureFillColor
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{isVi ? 'Sản Lượng' : 'Volume'}</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{reg.totalVolumeTons} MT</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{isVi ? 'Nông Hộ Liên Kết' : 'Smallholders'}</span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{reg.farmerCount} hộ</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-mono">
                      {reg.shipmentCount} {isVi ? 'lô hàng active' : 'active lots'}
                    </span>
                    {reg.shipments.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectShipment(reg.shipments[0].id);
                        }}
                        className="px-3 py-1.5 rounded-lg text-white font-bold text-xs shadow-xs transition-all cursor-pointer inline-flex items-center gap-1"
                        style={{ backgroundColor: reg.signatureFillColor }}
                      >
                        <span>{isVi ? 'Xem Lô Hàng' : 'Inspect Lots'}</span>
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Satellite Layers & Deforestation Cutoff View */}
      {displayMode === 'satellite_layers' && (
        <div className="p-4 sm:p-6 space-y-4">
          <div className="rounded-xl bg-slate-900 text-white p-5 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <Trees size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">
                    {isVi ? 'Dữ Liệu Vệ Tinh Copernicus Sentinel-2 & Mốc 31/12/2020' : 'Copernicus Sentinel-2 Satellite EUDR Canopy Baseline'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isVi
                      ? 'Đối soát toàn bộ 100% tọa độ nông hộ tại Đắk Lắk, Lâm Đồng, Gia Lai và các vùng tiếp cận với ảnh viễn thám EU Deforestation Regulation.'
                      : 'Audit-ready multi-spectral satellite reflectance imagery verified against Dec 31, 2020 zero-deforestation cutoff date.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono text-xs font-bold">
                  0.0% DEFORESTATION DETECTED
                </span>
              </div>
            </div>

            {/* Satellite Grid Stream Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                    <th className="py-2.5 px-3">{isVi ? 'Khu Vực & Tọa Độ' : 'Region & GPS Center'}</th>
                    <th className="py-2.5 px-3">{isVi ? 'Phân Loại' : 'Category'}</th>
                    <th className="py-2.5 px-3">{isVi ? 'Cảm Biến / Quỹ Đạo' : 'Sensor / Orbit'}</th>
                    <th className="py-2.5 px-3">{isVi ? 'Ngày Quét Gần Nhất' : 'Last Satellite Pass'}</th>
                    <th className="py-2.5 px-3">{isVi ? 'Chỉ Số Thực Vật NDVI' : 'NDVI Canopy Index'}</th>
                    <th className="py-2.5 px-3">{isVi ? 'Đánh Giá EUDR' : 'EUDR Cutoff Audit'}</th>
                    <th className="py-2.5 px-3 text-right">{isVi ? 'Hành Động' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                  {regionStats.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-sans font-bold text-white flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: reg.signatureFillColor }}></span>
                          <span>{isVi ? reg.nameVi : reg.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{reg.lat.toFixed(4)}°N, {reg.lng.toFixed(4)}°E</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: `${reg.signatureFillColor}33`, color: reg.signatureBorderColor }}>
                          {reg.isKeyRegion ? (isVi ? 'Trọng Điểm' : 'Key Origin') : (isVi ? 'Tiếp Cận' : 'Affiliate')}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 text-[11px]">
                          Sentinel-2 MSI (10m L2A)
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {reg.satellitePassDate}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-emerald-400 font-bold">0.82 (High Forest Density)</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700 text-emerald-300 font-bold text-[10px]">
                          <ShieldCheck size={11} />
                          <span>100% Compliant</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setDisplayMode('interactive_map');
                            handleFlyToRegion(reg);
                          }}
                          className="px-2.5 py-1 rounded text-white text-[11px] font-sans font-semibold transition-colors cursor-pointer"
                          style={{ backgroundColor: reg.signatureFillColor }}
                        >
                          {isVi ? 'Xem Bản Đồ' : 'Locate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
