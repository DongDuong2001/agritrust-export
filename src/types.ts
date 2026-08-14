export type ShipmentStatus = 'Missing Documents' | 'Pending Verification' | 'Verified' | 'Sent to Buyer';

export interface ComplianceItem {
  id: string;
  name: string;
  category: 'geolocation' | 'custody' | 'certification' | 'freshness';
  status: 'complete' | 'missing' | 'in_review';
  summary: string;
  details: string;
  evidenceType?: string;
  updatedAt?: string;
  referenceCode?: string;
}

export interface SignatureParty {
  role: 'Farmer / Plot Owner' | 'Cooperative Manager' | 'Testing Lab & Quality' | 'Logistics & Cat Lai Customs' | 'AgriTrust Exporter';
  partyName: string;
  organization: string;
  status: 'Signed ✓' | 'Pending';
  timestamp: string;
  location: string;
  keySignature: string;
}

export interface TimelineEvent {
  step: number;
  stage: string;
  title: string;
  location: string;
  date: string;
  details: string;
  status: 'verified' | 'pending' | 'in_progress';
  meta?: {
    coordinates?: string;
    certNumber?: string;
    vessel?: string;
    containerNo?: string;
    deforestationRisk?: string;
  };
}

export interface CoffeeShipment {
  id: string; // e.g. VN-EXP-2026-9014
  lotCode: string;
  cooperative: string;
  region: string; // Dak Lak, Lam Dong, Gia Lai, Son La
  province: string;
  variety: string; // Fine Robusta, Yellow Bourbon, Catimor, Arabica Typica
  process: string; // Wet-hulled, Natural Sun-Dried, Fully Washed, Honey Process
  volumeKg: number;
  bagsCount: number; // e.g. 320 bags (60kg each)
  targetBuyer: string; // e.g. Hamburg Coffee Company, Tchibo GmbH, Lavazza SpA, Illycaffe
  destinationPort: string; // Hamburg, Rotterdam, Antwerp, Le Havre, Genoa
  status: ShipmentStatus;
  completenessPercent: number;
  
  // Geolocation & Farm Data
  gpsCoordinates: string; // e.g. 12.6683° N, 108.0383° E
  elevationMeters: number; // e.g. 650m
  harvestPeriod: string; // e.g. Nov 2025 - Jan 2026
  farmPlotsCount: number; // e.g. 14 smallholder farms
  deforestationRiskScore: string; // 0.0% (Zero Risk since 2020 cutoff)
  
  // Quality metrics
  moisturePercent: number; // 12.0%
  cuppingScore: number; // 83.5
  screenSize: string; // Screen 18 / 16
  
  // Crypto & Ledger
  documentHash: string; // 0x8f3a9b72c418e21c8409aa67f2e15bc3901b8e4d2719a9108a9f4e2b0289e21c
  blockNumber: number;
  ledgerTimestamp: string;
  eudrReference: string; // EU-DDS-2026-VN-09412
  
  // Checklist & Signatures
  checklist: ComplianceItem[];
  signatures: SignatureParty[];
  timeline: TimelineEvent[];
  
  // Meta
  createdDate: string;
  targetShipDate: string;
  buyerEmail?: string;
}

export type ActiveView = 'dashboard' | 'shipment-detail' | 'passport' | 'buyer-portal' | 'onboarding';
export type NavTab = 'dashboard' | 'shipments' | 'compliance' | 'buyers' | 'onboarding' | 'settings';

export interface ExporterProfile {
  companyName: string;
  tradingName: string;
  taxId: string;
  eoriNumber: string;
  vicofaMemberNo: string;
  representativeName: string;
  email: string;
  phone: string;
  headOfficeAddress: string;
  province: string;
  establishedYear: number;
  
  // Sourcing & Co-ops
  connectedCoops: Array<{
    id: string;
    name: string;
    province: string;
    membersCount: number;
    areaHectares: number;
    status: 'connected' | 'pending';
    gpsCentroid: string;
  }>;
  totalSmallholders: number;
  totalHectaresMapped: number;

  // Due Diligence & Certifications
  certifications: Array<{
    id: string;
    type: 'Rainforest Alliance' | 'Fairtrade' | 'Organic EU' | '4C' | 'NPPO Phytosanitary';
    certNumber: string;
    expiryDate: string;
    status: 'verified' | 'pending';
    documentName: string;
  }>;
  satelliteAuditStatus: 'verified' | 'in_progress' | 'pending';
  baselineYear: number; // 2020 EUDR cutoff

  // Cryptographic PKI
  signerKeyId: string;
  pkiAlgorithm: string;
  tracesGatewayStatus: 'connected' | 'testing';
  eudrAccountReference: string;
  onboardingStatus: 'completed' | 'in_progress';
}

export type ActivityActionType = 
  | 'passport_generated' 
  | 'coop_upload' 
  | 'shipment_created' 
  | 'sent_to_buyer' 
  | 'customs_seal' 
  | 'satellite_audit' 
  | 'doc_requested'
  | 'batch_auto_verify';

export interface AuditActivityLog {
  id: string;
  actionType: ActivityActionType;
  title: string;
  titleVi?: string;
  description: string;
  descriptionVi?: string;
  shipmentId: string;
  lotCode?: string;
  cooperative?: string;
  actor: string;
  actorRole: string;
  timestamp: string;
  isoTime?: string;
  txHash?: string;
  status: 'verified' | 'pending' | 'warning' | 'info';
}

export type NotificationSource = 'zalo' | 'system' | 'satellite' | 'customs';
export type NotificationPriority = 'urgent' | 'normal' | 'low';
export type NotificationChannel = 'zalo_oa' | 'zalo_mini_app' | 'agritrust_cloud' | 'traces_eu';

export interface AppNotification {
  id: string;
  source: NotificationSource;
  channel: NotificationChannel;
  title: string;
  titleVi: string;
  message: string;
  messageVi: string;
  timestamp: string;
  timeAgo: string;
  timeAgoVi: string;
  isRead: boolean;
  priority: NotificationPriority;
  shipmentId?: string;
  lotCode?: string;
  sender?: {
    name: string;
    role: string;
    avatarText?: string;
    organization?: string;
  };
  actionType?: 'view_shipment' | 'view_passport' | 'open_zalo' | 'download_dossier';
}

