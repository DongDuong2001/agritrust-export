import { CoffeeShipment, AuditActivityLog, AppNotification } from '../types';

export const INITIAL_SHIPMENTS: CoffeeShipment[] = [
  {
    id: 'VN-EXP-2026-9014',
    lotCode: 'LOT-BMT-2026-088',
    cooperative: 'Buon Ma Thuot Robusta Co-op',
    region: 'Central Highlands',
    province: 'Dak Lak',
    variety: 'Fine Robusta (Specialty Grade 1)',
    process: 'Anaerobic Natural Sun-Dried',
    volumeKg: 19200, // 1 standard 20ft container (320 bags x 60kg)
    bagsCount: 320,
    targetBuyer: 'Tchibo GmbH',
    destinationPort: 'Hamburg Port, Germany',
    status: 'Missing Documents',
    completenessPercent: 75,
    gpsCoordinates: '12.6683° N, 108.0383° E (Polygon Plot #412)',
    elevationMeters: 620,
    harvestPeriod: 'Dec 2025 – Jan 2026',
    farmPlotsCount: 18,
    deforestationRiskScore: '0.0% (Zero Risk - Verified Satellite Sentinel-2)',
    moisturePercent: 11.8,
    cuppingScore: 84.0,
    screenSize: 'Grade 1 Screen 18 (7.1mm)',
    documentHash: '0x8f3a9b72c418e21c8409aa67f2e15bc3901b8e4d2719a9108a9f4e2b0289e21c',
    blockNumber: 4891024,
    ledgerTimestamp: '2026-08-11 14:32:10 UTC',
    eudrReference: 'EU-DDS-2026-VN-09412',
    createdDate: '2026-08-01',
    targetShipDate: '2026-08-25',
    buyerEmail: 'procurement.vietnam@tchibo.de',
    checklist: [
      {
        id: 'chk-1',
        name: 'Plot Geolocation & Polygon Mapping',
        category: 'geolocation',
        status: 'complete',
        summary: '18 smallholder plots mapped with Sentinel-2 satellite boundaries',
        details: 'Full polygon GIS shapefiles verified against Copernicus EU Deforestation cutoff date (Dec 31, 2020). Zero deforestation risk detected.',
        evidenceType: 'GIS GeoJSON & Sentinel-2 Overlay',
        updatedAt: '2026-08-02 09:15 ICT',
        referenceCode: 'GIS-BMT-POLYGON-412'
      },
      {
        id: 'chk-2',
        name: 'Chain-of-Custody & Batch Traceability',
        category: 'custody',
        status: 'complete',
        summary: 'Digital weighbridge tickets linked from farm gate to dry mill',
        details: 'Batch ledger tracks cherry collection from 18 registered smallholder farmers through wet fermentation to Buon Ma Thuot central warehouse.',
        evidenceType: 'Automated Mill Weighbridge Log',
        updatedAt: '2026-08-04 15:30 ICT',
        referenceCode: 'COC-VN-2026-7781'
      },
      {
        id: 'chk-3',
        name: 'Phytosanitary & Rainforest Alliance Certification',
        category: 'certification',
        status: 'missing',
        summary: 'Batch phytosanitary inspection audit certificate pending from Cooperative',
        details: 'Cooperative has not yet attached the final signed Phytosanitary batch stamp and current season Rainforest Alliance audit certificate RA-2026-BMT.',
        evidenceType: 'National Plant Protection Org (NPPO) Certificate',
        updatedAt: 'Action Required',
        referenceCode: 'PENDING_UPLOAD'
      },
      {
        id: 'chk-4',
        name: 'Evidence Freshness & EU Due Diligence Statement',
        category: 'freshness',
        status: 'complete',
        summary: 'All audit timestamps and lab certificates refreshed within 14 days',
        details: 'Moisture level, aflatoxin testing, and soil health records verified under accredited ISO/IEC 17025 lab guidelines.',
        evidenceType: 'Vinacontrol Lab Audit Report #VN-2026-90',
        updatedAt: '2026-08-09 11:00 ICT',
        referenceCode: 'DDS-REF-2026-08-14'
      }
    ],
    signatures: [
      {
        role: 'Farmer / Plot Owner',
        partyName: 'Pham Van Duc & 17 Smallholders',
        organization: 'Cu M\'gar Highland Producer Group',
        status: 'Signed ✓',
        timestamp: '2026-08-02 08:30 ICT',
        location: 'Cu M\'gar, Dak Lak (12.67°N, 108.04°E)',
        keySignature: '0x3c99f...8a1e (EVM Verified Key)'
      },
      {
        role: 'Cooperative Manager',
        partyName: 'Nguyen Van Hung (Chief Quality Officer)',
        organization: 'Buon Ma Thuot Robusta Co-op',
        status: 'Pending',
        timestamp: 'Awaiting Document Upload',
        location: 'Buon Ma Thuot Central Facility',
        keySignature: 'Pending signature verification'
      },
      {
        role: 'Testing Lab & Quality',
        partyName: 'Dr. Le Thi Mai (Lead Agronomist)',
        organization: 'Vinacontrol Quality Assurance Lab',
        status: 'Signed ✓',
        timestamp: '2026-08-06 10:45 ICT',
        location: 'Ho Chi Minh Testing Center',
        keySignature: '0x71ba2...33cd (ISO/IEC 17025 Certified)'
      },
      {
        role: 'Logistics & Cat Lai Customs',
        partyName: 'Tran Minh Tuan (Export Logistics)',
        organization: 'Saigon Port Logistics & Customs Hub',
        status: 'Signed ✓',
        timestamp: '2026-08-09 16:20 ICT',
        location: 'Cat Lai Port, Ho Chi Minh City',
        keySignature: '0x99e01...fa4b (Customs E-Seal Verified)'
      },
      {
        role: 'AgriTrust Exporter',
        partyName: 'Vo Thi Lan (Head of EU Compliance)',
        organization: 'AgriTrust Export Vietnam Ltd.',
        status: 'Pending',
        timestamp: 'Pending Final Co-op Upload',
        location: 'Hanoi Export HQ',
        keySignature: 'Awaiting complete batch seal'
      }
    ],
    timeline: [
      {
        step: 1,
        stage: 'Farm Origin & Plot Geolocation',
        title: 'Smallholder Cherry Harvest & Polygon Mapping',
        location: 'Cu M\'gar, Dak Lak, Vietnam (12.6683° N, 108.0383° E)',
        date: '2026-01-14',
        details: 'Harvested from 18 registered smallholder plots at 620m elevation. Deforestation-free satellite check verified (0.0% risk score).',
        status: 'verified',
        meta: {
          coordinates: '12.6683° N, 108.0383° E',
          deforestationRisk: '0.0% (Zero Risk - Copernicus Satellite EUDR Pass)'
        }
      },
      {
        step: 2,
        stage: 'Cooperative Milling & Processing',
        title: 'Controlled Anaerobic Fermentation & Sun-Drying',
        location: 'Buon Ma Thuot Central Dry Mill',
        date: '2026-01-28',
        details: 'Graded to Screen 18, moisture settled at 11.8%. Digital weighbridge logged 19,200 kg gross export green bean.',
        status: 'verified',
        meta: {
          certNumber: 'MILL-BATCH-2026-088'
        }
      },
      {
        step: 3,
        stage: 'Compliance & Phytosanitary Audit',
        title: 'National Plant Health & Rainforest Alliance Audit',
        location: 'Dak Lak Sub-Department of Crop Production',
        date: '2026-08-11',
        details: 'Phytosanitary inspection document awaiting final digital upload signature from cooperative administration.',
        status: 'in_progress',
        meta: {
          certNumber: 'Pending Co-op Upload'
        }
      },
      {
        step: 4,
        stage: 'Inland Transport & Port Arrival',
        title: 'Secured E-Seal Container Staging',
        location: 'Cat Lai Port, Ho Chi Minh City',
        date: '2026-08-12',
        details: 'Pre-manifest staged for Container #CMAU-882910. Customs smart seal pre-assigned.',
        status: 'pending',
        meta: {
          containerNo: 'CMAU-882910',
          vessel: 'CMA CGM Palais Royal'
        }
      },
      {
        step: 5,
        stage: 'EU Customs & Import Clearance',
        title: 'Hamburg Port EUDR Due Diligence Filing',
        location: 'Hamburg Port, Germany (Customs Terminal Altenwerder)',
        date: 'Estimated Sept 2026',
        details: 'EU Deforestation Regulation (EUDR) Article 4 Due Diligence Statement submission pending passport generation.',
        status: 'pending'
      }
    ]
  },
  {
    id: 'VN-EXP-2026-8842',
    lotCode: 'LOT-LD-2026-042',
    cooperative: 'Da Lat Arabica Highlands Co-op',
    region: 'Lang Biang Plateau',
    province: 'Lam Dong',
    variety: 'Specialty Arabica (Catimor & Yellow Bourbon)',
    process: 'Fully Washed Double Fermentation',
    volumeKg: 24000, // 400 bags x 60kg
    bagsCount: 400,
    targetBuyer: 'Hamburg Coffee Company AG',
    destinationPort: 'Hamburg Port, Germany',
    status: 'Verified',
    completenessPercent: 100,
    gpsCoordinates: '11.9404° N, 108.4583° E (Polygon Plot #109)',
    elevationMeters: 1480,
    harvestPeriod: 'Dec 2025 – Feb 2026',
    farmPlotsCount: 12,
    deforestationRiskScore: '0.0% (Zero Risk - 100% Forest Canopy Preserved)',
    moisturePercent: 11.2,
    cuppingScore: 86.5,
    screenSize: 'Specialty Grade 1 (Screen 18+)',
    documentHash: '0x3e49c8112afb990145ef01a93b482e90c8831f2982d61749ba7c1409ab430e88',
    blockNumber: 4890850,
    ledgerTimestamp: '2026-08-10 09:14:22 UTC',
    eudrReference: 'EU-DDS-2026-VN-08842',
    createdDate: '2026-07-28',
    targetShipDate: '2026-08-20',
    buyerEmail: 'customs-compliance@hamburgcoffee.de',
    checklist: [
      {
        id: 'chk-88-1',
        name: 'Plot Geolocation & Polygon Mapping',
        category: 'geolocation',
        status: 'complete',
        summary: '12 high-altitude plots polygon-mapped with precision RTK-GPS',
        details: 'Verified by European Space Agency Sentinel-2 imagery. Full land title and zero deforestation compliance since Jan 2020.',
        evidenceType: 'GeoJSON Polygon Boundary + ESA Land Cover',
        updatedAt: '2026-08-01 10:00 ICT',
        referenceCode: 'GIS-LAMDONG-109'
      },
      {
        id: 'chk-88-2',
        name: 'Chain-of-Custody & Batch Traceability',
        category: 'custody',
        status: 'complete',
        summary: '100% uninterrupted batch tracking from cherry picking to bagging',
        details: 'QR-coded hermetic GrainPro bags sealed with cryptographic tamper-evident tags at Da Lat highland washing station.',
        evidenceType: 'ERP Batch Trace #DL-2026-ARB-042',
        updatedAt: '2026-08-03 14:20 ICT',
        referenceCode: 'COC-VN-2026-8842'
      },
      {
        id: 'chk-88-3',
        name: 'Phytosanitary & Rainforest Alliance Certification',
        category: 'certification',
        status: 'complete',
        summary: 'Rainforest Alliance & National Phytosanitary Certificate Verified',
        details: 'Certificate RA-2026-DL-8821 verified valid through Dec 2026. Phytosanitary Certificate #VN-NPPO-2026-0419 issued and e-signed.',
        evidenceType: 'RA Certified + NPPO Official Digital Seal',
        updatedAt: '2026-08-06 09:30 ICT',
        referenceCode: 'CERT-RA-2026-DL-8821'
      },
      {
        id: 'chk-88-4',
        name: 'Evidence Freshness & EU Due Diligence Statement',
        category: 'freshness',
        status: 'complete',
        summary: 'EU Deforestation Regulation (EUDR) Article 4 statement generated',
        details: 'Laboratory tests confirm zero pesticide residues (MRL compliant with EU Reg 396/2005). Moisture content 11.2%, ochratoxin A < 5 ppb.',
        evidenceType: 'Eurofins / Vinacontrol Double-Checked Lab Assay',
        updatedAt: '2026-08-08 16:45 ICT',
        referenceCode: 'EU-DDS-2026-VN-08842'
      }
    ],
    signatures: [
      {
        role: 'Farmer / Plot Owner',
        partyName: 'K\'Brieng & Lam Dong Highlands Group',
        organization: 'Lac Duong Specialty Grower Network',
        status: 'Signed ✓',
        timestamp: '2026-08-01 08:15 ICT',
        location: 'Lac Duong, Lam Dong (11.94°N, 108.46°E)',
        keySignature: '0x4f12d...91c0 (EVM Verified Key)'
      },
      {
        role: 'Cooperative Manager',
        partyName: 'Nguyen Thi Hong (Director)',
        organization: 'Da Lat Arabica Highlands Co-op',
        status: 'Signed ✓',
        timestamp: '2026-08-03 11:30 ICT',
        location: 'Da Lat Wet Mill & Cupping Lab',
        keySignature: '0x88ea3...b901 (PKI Digital Signature)'
      },
      {
        role: 'Testing Lab & Quality',
        partyName: 'Hoang Van Bach (Senior Quality Chemist)',
        organization: 'Vinacontrol ISO/IEC 17025 Center',
        status: 'Signed ✓',
        timestamp: '2026-08-05 14:00 ICT',
        location: 'Vinacontrol Central Lab HCMC',
        keySignature: '0x19ca4...e72f (ISO Audit Verified)'
      },
      {
        role: 'Logistics & Cat Lai Customs',
        partyName: 'Doan Quoc Bao (Port Operations Lead)',
        organization: 'Saigon Newport & Customs E-Gate',
        status: 'Signed ✓',
        timestamp: '2026-08-08 10:15 ICT',
        location: 'Cat Lai Port Terminal 2',
        keySignature: '0x62da9...55ee (Customs E-Seal Verified)'
      },
      {
        role: 'AgriTrust Exporter',
        partyName: 'Pham Xuan Truong (Managing Director)',
        organization: 'AgriTrust Export Vietnam Ltd.',
        status: 'Signed ✓',
        timestamp: '2026-08-10 09:14 ICT',
        location: 'Ho Chi Minh Headquarters',
        keySignature: '0x3e49c...0e88 (AgriTrust Master Validator)'
      }
    ],
    timeline: [
      {
        step: 1,
        stage: 'Farm Origin & Plot Geolocation',
        title: 'Highland Arabica Picking & Geolocation Validation',
        location: 'Lac Duong, Lam Dong (11.9404° N, 108.4583° E)',
        date: '2026-01-18',
        details: 'Selective hand-picking at 1,480m elevation. Sentinel-2 verification proves 100% shaded forest canopy preserved without deforestation.',
        status: 'verified',
        meta: {
          coordinates: '11.9404° N, 108.4583° E',
          deforestationRisk: '0.0% (Zero Risk - Forest Canopy Intact)'
        }
      },
      {
        step: 2,
        stage: 'Certification & Laboratory Assay',
        title: 'Rainforest Alliance Audit & EU MRL Lab Clearance',
        location: 'Vinacontrol Lab & RA Certifying Body',
        date: '2026-02-04',
        details: 'Rainforest Alliance Certificate #CERT-RA-2026-DL-8821 verified. Zero pesticide residues, moisture 11.2%, cupping score 86.5 pts.',
        status: 'verified',
        meta: {
          certNumber: 'RA-2026-DL-8821'
        }
      },
      {
        step: 3,
        stage: 'Processing & Batch Packaging',
        title: 'Hermetic Bagging with Tamper-Proof Cryptographic QR Seals',
        location: 'Da Lat Central Processing Facility',
        date: '2026-02-12',
        details: '400 GrainPro bags sealed with digital tamper-evident IDs. Batch weight 24,000 kg registered on AgriTrust immutable ledger.',
        status: 'verified',
        meta: {
          certNumber: 'BATCH-DL-ARB-400'
        }
      },
      {
        step: 4,
        stage: 'Inland Transport & Port Sealing',
        title: 'Container Loading & Cat Lai Customs Clearance',
        location: 'Cat Lai Port, Ho Chi Minh City',
        date: '2026-08-08',
        details: 'Loaded into Container #MSCU-902144. GPS container tracker activated; green customs export manifest stamped.',
        status: 'verified',
        meta: {
          containerNo: 'MSCU-902144',
          vessel: 'MSC Amsterdam'
        }
      },
      {
        step: 5,
        stage: 'EU Customs & Import Ready',
        title: 'EU Deforestation Regulation (EUDR) Due Diligence Ready',
        location: 'Hamburg Port, Germany (Target Clearance)',
        date: '2026-08-10',
        details: 'Cryptographic compliance passport validated on AgriTrust Ledger. Fully compliant with EUDR Regulation (EU) 2023/1115.',
        status: 'verified'
      }
    ]
  },
  {
    id: 'VN-EXP-2026-7731',
    lotCode: 'LOT-GL-2026-019',
    cooperative: 'Pleiku Organic Coffee Alliance',
    region: 'Gia Lai Highlands',
    province: 'Gia Lai',
    variety: 'Organic Robusta & Liberica Blend',
    process: 'Honey Processed',
    volumeKg: 18000,
    bagsCount: 300,
    targetBuyer: 'Lavazza SpA',
    destinationPort: 'Genoa Port, Italy',
    status: 'Sent to Buyer',
    completenessPercent: 100,
    gpsCoordinates: '13.9833° N, 108.0000° E (Polygon Plot #88)',
    elevationMeters: 780,
    harvestPeriod: 'Dec 2025 – Jan 2026',
    farmPlotsCount: 22,
    deforestationRiskScore: '0.0% (Zero Deforestation)',
    moisturePercent: 11.5,
    cuppingScore: 83.0,
    screenSize: 'Grade 1 Screen 18',
    documentHash: '0x12a8bc944710ef992147acb88210398bbfa741982a39c091bcda488102a01f99',
    blockNumber: 4889210,
    ledgerTimestamp: '2026-08-05 11:20:00 UTC',
    eudrReference: 'EU-DDS-2026-VN-07731',
    createdDate: '2026-07-20',
    targetShipDate: '2026-08-15',
    buyerEmail: 'sourcing.italy@lavazza.com',
    checklist: [
      {
        id: 'chk-77-1',
        name: 'Plot Geolocation & Polygon Mapping',
        category: 'geolocation',
        status: 'complete',
        summary: '22 certified organic smallholder plots mapped',
        details: 'Cadastral registry matched with Copernicus EUDR satellite portal.',
        evidenceType: 'GIS GeoJSON Data',
        updatedAt: '2026-07-22 09:00 ICT',
        referenceCode: 'GIS-GIALAI-088'
      },
      {
        id: 'chk-77-2',
        name: 'Chain-of-Custody & Batch Traceability',
        category: 'custody',
        status: 'complete',
        summary: 'Direct farm-to-mill chain of custody verified',
        details: 'Organic segregation protocol verified by Control Union.',
        evidenceType: 'Organic Segregation Log',
        updatedAt: '2026-07-25 14:00 ICT',
        referenceCode: 'COC-GL-2026-019'
      },
      {
        id: 'chk-77-3',
        name: 'Phytosanitary & EU Organic Certification',
        category: 'certification',
        status: 'complete',
        summary: 'EU Organic Certification #CU-88412-VN',
        details: 'Control Union inspected and certified for EU Organic standard Reg (EU) 2018/848.',
        evidenceType: 'Control Union Organic Cert',
        updatedAt: '2026-07-28 10:30 ICT',
        referenceCode: 'CERT-CU-88412-VN'
      },
      {
        id: 'chk-77-4',
        name: 'Evidence Freshness & EU Due Diligence Statement',
        category: 'freshness',
        status: 'complete',
        summary: 'Full EUDR Due Diligence statement confirmed and sent to importer',
        details: 'Verified and cryptographically dispatched to Lavazza SpA procurement team.',
        evidenceType: 'EUDR Final Dispatch Manifest',
        updatedAt: '2026-08-05 11:20 ICT',
        referenceCode: 'EU-DDS-2026-VN-07731'
      }
    ],
    signatures: [
      {
        role: 'Farmer / Plot Owner',
        partyName: 'Ro Cham H\'Nga & Alliance Farmers',
        organization: 'Gia Lai Organic Group',
        status: 'Signed ✓',
        timestamp: '2026-07-22 08:00 ICT',
        location: 'Pleiku, Gia Lai (13.98°N, 108.00°E)',
        keySignature: '0x9923a...11ef'
      },
      {
        role: 'Cooperative Manager',
        partyName: 'Vo Thanh Lam',
        organization: 'Pleiku Organic Coffee Alliance',
        status: 'Signed ✓',
        timestamp: '2026-07-25 13:40 ICT',
        location: 'Pleiku Processing Hub',
        keySignature: '0x4488c...aa71'
      },
      {
        role: 'Testing Lab & Quality',
        partyName: 'Control Union Vietnam Lab',
        organization: 'Control Union Inspections',
        status: 'Signed ✓',
        timestamp: '2026-07-28 11:15 ICT',
        location: 'Ho Chi Minh City',
        keySignature: '0x3310b...9022'
      },
      {
        role: 'Logistics & Cat Lai Customs',
        partyName: 'Saigon Newport Customs Authority',
        organization: 'Cat Lai Port Export Team',
        status: 'Signed ✓',
        timestamp: '2026-08-02 15:50 ICT',
        location: 'Cat Lai Port',
        keySignature: '0x88bc0...fa11'
      },
      {
        role: 'AgriTrust Exporter',
        partyName: 'AgriTrust Automated Dispatcher',
        organization: 'AgriTrust Export Vietnam',
        status: 'Signed ✓',
        timestamp: '2026-08-05 11:20 ICT',
        location: 'Hanoi HQ',
        keySignature: '0x12a8b...01f99'
      }
    ],
    timeline: [
      {
        step: 1,
        stage: 'Farm Origin & Plot Geolocation',
        title: 'Organic Certified Plot Harvesting',
        location: 'Pleiku, Gia Lai (13.9833° N, 108.0000° E)',
        date: '2026-01-10',
        details: '22 organic plots harvested. Zero deforestation verified.',
        status: 'verified'
      },
      {
        step: 2,
        stage: 'Certification & Processing',
        title: 'Control Union Organic Audit Certification',
        location: 'Gia Lai Processing Hub',
        date: '2026-01-25',
        details: 'Honey processed green beans tested at 11.5% moisture.',
        status: 'verified'
      },
      {
        step: 3,
        stage: 'Port Inspection & Sealing',
        title: 'Cat Lai Port Logistics Sealing',
        location: 'Cat Lai Port, Ho Chi Minh City',
        date: '2026-08-02',
        details: 'Container #HLCU-440192 loaded and customs cleared.',
        status: 'verified'
      },
      {
        step: 4,
        stage: 'EU Importer Notification',
        title: 'Passport Dispatched to Lavazza SpA Portal',
        location: 'Genoa Port / Turin HQ, Italy',
        date: '2026-08-05',
        details: 'Compliance passport validated and acknowledged by Lavazza customs team.',
        status: 'verified'
      }
    ]
  },
  {
    id: 'VN-EXP-2026-6420',
    lotCode: 'LOT-SL-2026-031',
    cooperative: 'Son La Arabica Cooperative',
    region: 'Northwest Mountains',
    province: 'Son La',
    variety: 'Specialty Catimor (High-Altitude Shade Grown)',
    process: 'Washed Process',
    volumeKg: 12000,
    bagsCount: 200,
    targetBuyer: 'Illycaffè S.p.A.',
    destinationPort: 'Trieste Port, Italy',
    status: 'Pending Verification',
    completenessPercent: 85,
    gpsCoordinates: '21.3256° N, 103.9189° E (Polygon Plot #54)',
    elevationMeters: 1100,
    harvestPeriod: 'Dec 2025 – Jan 2026',
    farmPlotsCount: 10,
    deforestationRiskScore: '0.0% (Zero Risk)',
    moisturePercent: 11.4,
    cuppingScore: 85.0,
    screenSize: 'Grade 1 Screen 18',
    documentHash: '0x99201a44e881029c771fa1b20993e8a1029841bb029381ea99201488102a9910',
    blockNumber: 4891100,
    ledgerTimestamp: '2026-08-12 04:10:00 UTC',
    eudrReference: 'EU-DDS-2026-VN-06420',
    createdDate: '2026-08-05',
    targetShipDate: '2026-08-30',
    buyerEmail: 'quality.import@illy.com',
    checklist: [
      {
        id: 'chk-64-1',
        name: 'Plot Geolocation & Polygon Mapping',
        category: 'geolocation',
        status: 'complete',
        summary: '10 mountain hillside plots mapped with polygon GIS',
        details: 'Satellite verification confirmed no forest boundary encroachment.',
        evidenceType: 'GIS GeoJSON Boundary',
        updatedAt: '2026-08-06 14:00 ICT',
        referenceCode: 'GIS-SONLA-054'
      },
      {
        id: 'chk-64-2',
        name: 'Chain-of-Custody & Batch Traceability',
        category: 'custody',
        status: 'complete',
        summary: 'Son La highland collection center batch record complete',
        details: 'Traceability tags attached to 200 bags of washed Catimor.',
        evidenceType: 'Son La Mill Batch Ticket',
        updatedAt: '2026-08-08 09:30 ICT',
        referenceCode: 'COC-SL-2026-031'
      },
      {
        id: 'chk-64-3',
        name: 'Phytosanitary & Rainforest Alliance Certification',
        category: 'certification',
        status: 'complete',
        summary: '4C & Fairtrade Certificate attached',
        details: 'Fairtrade ID #FT-VN-2026-904 active and audited.',
        evidenceType: 'Fairtrade International Certificate',
        updatedAt: '2026-08-10 11:00 ICT',
        referenceCode: 'CERT-FT-VN-2026-904'
      },
      {
        id: 'chk-64-4',
        name: 'Evidence Freshness & EU Due Diligence Statement',
        category: 'freshness',
        status: 'in_review',
        summary: 'Vinacontrol laboratory heavy metal & moisture assay in final review',
        details: 'Lab testing report generated; awaiting final signature signoff.',
        evidenceType: 'Vinacontrol Lab Assay (In Review)',
        updatedAt: '2026-08-12 16:00 ICT',
        referenceCode: 'DDS-SL-2026-INREV'
      }
    ],
    signatures: [
      {
        role: 'Farmer / Plot Owner',
        partyName: 'Lo Van Muon & Son La Growers',
        organization: 'Son La Shade-Grown Alliance',
        status: 'Signed ✓',
        timestamp: '2026-08-06 11:00 ICT',
        location: 'Mai Son, Son La (21.33°N, 103.92°E)',
        keySignature: '0x1818a...2299'
      },
      {
        role: 'Cooperative Manager',
        partyName: 'Quang Van Minh',
        organization: 'Son La Arabica Cooperative',
        status: 'Signed ✓',
        timestamp: '2026-08-08 14:15 ICT',
        location: 'Son La Processing Center',
        keySignature: '0x7701b...cc33'
      },
      {
        role: 'Testing Lab & Quality',
        partyName: 'Vinacontrol Northern Lab',
        organization: 'Vinacontrol Hanoi',
        status: 'Pending',
        timestamp: 'Assay Signoff in Review',
        location: 'Hanoi Laboratory',
        keySignature: 'Awaiting lab digital key'
      },
      {
        role: 'Logistics & Cat Lai Customs',
        partyName: 'Hai Phong Export Gateway',
        organization: 'Hai Phong Port Authority',
        status: 'Pending',
        timestamp: 'Staged for Transport',
        location: 'Hai Phong Port',
        keySignature: 'Pending customs seal'
      },
      {
        role: 'AgriTrust Exporter',
        partyName: 'Vo Thi Lan',
        organization: 'AgriTrust Export Vietnam',
        status: 'Pending',
        timestamp: 'Pending Final Verification',
        location: 'Hanoi HQ',
        keySignature: 'Awaiting completion'
      }
    ],
    timeline: [
      {
        step: 1,
        stage: 'Farm Origin & Plot Geolocation',
        title: 'High Altitude Shade-Grown Harvest',
        location: 'Son La, Vietnam (21.3256° N, 103.9189° E)',
        date: '2026-01-08',
        details: 'Hand-picked shade-grown Arabica. Zero deforestation risk verified.',
        status: 'verified'
      },
      {
        step: 2,
        stage: 'Washing & Milling',
        title: 'Wet Milling & Moisture Stabilization',
        location: 'Son La Arabica Mill',
        date: '2026-01-20',
        details: 'Moisture 11.4%, cupping score 85.0 points.',
        status: 'verified'
      },
      {
        step: 3,
        stage: 'Lab Assay Verification',
        title: 'Vinacontrol Quality Clearance in Final Review',
        location: 'Vinacontrol Hanoi Lab',
        date: '2026-08-12',
        details: 'Quality review pending final auditor signature.',
        status: 'in_progress'
      },
      {
        step: 4,
        stage: 'Export Dispatch',
        title: 'Port Gateway Transport',
        location: 'Hai Phong Port, Vietnam',
        date: 'Scheduled 2026-08-30',
        details: 'Staged for Trieste Port, Italy.',
        status: 'pending'
      }
    ]
  },
  {
    id: 'VN-EXP-2026-5199',
    lotCode: 'LOT-DLK-2026-112',
    cooperative: 'Ea Kiet Fairtrade Cooperative',
    region: 'Cu M\'gar Highlands',
    province: 'Dak Lak',
    variety: 'Specialty Robusta Honey Process',
    process: 'Honey Process',
    volumeKg: 19200,
    bagsCount: 320,
    targetBuyer: 'Neumann Kaffee Gruppe (NKG)',
    destinationPort: 'Rotterdam Port, Netherlands',
    status: 'Verified',
    completenessPercent: 100,
    gpsCoordinates: '12.8942° N, 108.1250° E (Polygon Plot #204)',
    elevationMeters: 590,
    harvestPeriod: 'Dec 2025 – Jan 2026',
    farmPlotsCount: 16,
    deforestationRiskScore: '0.0% (Zero Deforestation)',
    moisturePercent: 11.9,
    cuppingScore: 84.5,
    screenSize: 'Grade 1 Screen 18',
    documentHash: '0x5c778901beea1499201abcf899120e774019aebc7719401abde88102a99104fa',
    blockNumber: 4890120,
    ledgerTimestamp: '2026-08-08 13:45:00 UTC',
    eudrReference: 'EU-DDS-2026-VN-05199',
    createdDate: '2026-07-29',
    targetShipDate: '2026-08-22',
    buyerEmail: 'trade.compliance@nkg.net',
    checklist: [
      {
        id: 'chk-51-1',
        name: 'Plot Geolocation & Polygon Mapping',
        category: 'geolocation',
        status: 'complete',
        summary: '16 smallholder plots mapped and verified',
        details: 'All farm plots verified against EUDR cutoff baseline.',
        evidenceType: 'GIS GeoJSON + Sentinel-2',
        updatedAt: '2026-08-01 08:00 ICT',
        referenceCode: 'GIS-EAKIET-204'
      },
      {
        id: 'chk-51-2',
        name: 'Chain-of-Custody & Batch Traceability',
        category: 'custody',
        status: 'complete',
        summary: 'Digital weighbridge lot tracing complete',
        details: 'Traceability tags verified across all 320 bags.',
        evidenceType: 'Weighbridge Batch Log',
        updatedAt: '2026-08-03 10:15 ICT',
        referenceCode: 'COC-EK-2026-112'
      },
      {
        id: 'chk-51-3',
        name: 'Phytosanitary & Fairtrade Certification',
        category: 'certification',
        status: 'complete',
        summary: 'Fairtrade & Rainforest Alliance certified',
        details: 'All certifications signed and attached to cryptographic block.',
        evidenceType: 'Fairtrade + NPPO Digital Seal',
        updatedAt: '2026-08-05 15:30 ICT',
        referenceCode: 'CERT-FT-RA-EK204'
      },
      {
        id: 'chk-51-4',
        name: 'Evidence Freshness & EU Due Diligence Statement',
        category: 'freshness',
        status: 'complete',
        summary: 'EUDR Compliance Statement generated and ready',
        details: 'Eurofins lab assay confirmed 100% compliant with EU MRL standards.',
        evidenceType: 'Eurofins Quality Lab Report',
        updatedAt: '2026-08-08 13:45 ICT',
        referenceCode: 'EU-DDS-2026-VN-05199'
      }
    ],
    signatures: [
      {
        role: 'Farmer / Plot Owner',
        partyName: 'Y-Duan Nie & Ea Kiet Farmers',
        organization: 'Ea Kiet Fairtrade Network',
        status: 'Signed ✓',
        timestamp: '2026-08-01 08:00 ICT',
        location: 'Cu M\'gar, Dak Lak (12.89°N, 108.13°E)',
        keySignature: '0x8891a...3310'
      },
      {
        role: 'Cooperative Manager',
        partyName: 'Nguyen Khac Lam',
        organization: 'Ea Kiet Fairtrade Co-op',
        status: 'Signed ✓',
        timestamp: '2026-08-03 10:15 ICT',
        location: 'Ea Kiet Processing Mill',
        keySignature: '0x5512c...aa99'
      },
      {
        role: 'Testing Lab & Quality',
        partyName: 'Vinacontrol QA Division',
        organization: 'Vinacontrol Lab',
        status: 'Signed ✓',
        timestamp: '2026-08-05 15:30 ICT',
        location: 'Ho Chi Minh Testing Lab',
        keySignature: '0x2290f...ee44'
      },
      {
        role: 'Logistics & Cat Lai Customs',
        partyName: 'Cat Lai Port Logistics Gateway',
        organization: 'Saigon Newport Corp',
        status: 'Signed ✓',
        timestamp: '2026-08-07 14:00 ICT',
        location: 'Cat Lai Terminal 1',
        keySignature: '0x9910d...bb77'
      },
      {
        role: 'AgriTrust Exporter',
        partyName: 'Pham Xuan Truong',
        organization: 'AgriTrust Export Vietnam',
        status: 'Signed ✓',
        timestamp: '2026-08-08 13:45 ICT',
        location: 'Ho Chi Minh HQ',
        keySignature: '0x5c778...04fa'
      }
    ],
    timeline: [
      {
        step: 1,
        stage: 'Farm Origin & Plot Geolocation',
        title: 'Fairtrade Cherry Harvest',
        location: 'Ea Kiet, Dak Lak (12.8942° N, 108.1250° E)',
        date: '2026-01-12',
        details: 'Hand-picked honey process cherry. Zero deforestation risk verified.',
        status: 'verified'
      },
      {
        step: 2,
        stage: 'Certification & Quality Testing',
        title: 'Fairtrade Audit & Laboratory MRL Assay',
        location: 'Vinacontrol QA Lab',
        date: '2026-01-26',
        details: 'Quality passed at 11.9% moisture, 84.5 cupping score.',
        status: 'verified'
      },
      {
        step: 3,
        stage: 'Port Container Staging',
        title: 'Cat Lai Port Customs E-Seal Staging',
        location: 'Cat Lai Port, Ho Chi Minh City',
        date: '2026-08-07',
        details: 'Container #MSKU-881209 sealed with digital GPS customs tracker.',
        status: 'verified'
      },
      {
        step: 4,
        stage: 'EUDR Passport Ready',
        title: 'Compliance Passport Ready for Importer Verification',
        location: 'Rotterdam Port, Netherlands',
        date: '2026-08-08',
        details: 'Ready for instant EU customs clearance upon vessel docking.',
        status: 'verified'
      }
    ]
  }
];

export const BUYER_COMPANIES = [
  { name: 'Tchibo GmbH', country: 'Germany', port: 'Hamburg Port', buyerContact: 'Christian Weber (Lead Green Coffee Buyer)' },
  { name: 'Hamburg Coffee Company AG', country: 'Germany', port: 'Hamburg Port', buyerContact: 'Klaus Lindner (Head of Traceability & Compliance)' },
  { name: 'Lavazza SpA', country: 'Italy', port: 'Genoa Port', buyerContact: 'Matteo Rossi (Sustainable Sourcing Director)' },
  { name: 'Illycaffè S.p.A.', country: 'Italy', port: 'Trieste Port', buyerContact: 'Elena Moretti (Quality & Origin Verification)' },
  { name: 'Neumann Kaffee Gruppe (NKG)', country: 'Germany / Global', port: 'Rotterdam Port', buyerContact: 'Jan van Houten (EUDR Project Lead)' }
];

export const INITIAL_AUDIT_LOGS: AuditActivityLog[] = [
  {
    id: 'ACT-2026-0814-01',
    actionType: 'passport_generated',
    title: 'EUDR Digital Compliance Passport Generated & Sealed',
    titleVi: 'Hộ Chiếu Tuân Thủ EUDR Kỹ Thuật Số Đã Tạo & Niêm Phong',
    description: 'Immutable cryptographic proof committed to AgriTrust ledger block #4891024 with zero-deforestation certification.',
    descriptionVi: 'Bằng chứng mật mã bất biến đã ghi vào khối #4891024 trên sổ cái AgriTrust kèm xác nhận không phá rừng.',
    shipmentId: 'VN-EXP-2026-9015',
    lotCode: 'LOT-LD-2026-112',
    cooperative: 'Lam Dong Arabica Union',
    actor: 'AgriTrust Master Validator',
    actorRole: 'Certified EUDR Auditor',
    timestamp: '8 mins ago',
    isoTime: '2026-08-14T07:06:00Z',
    txHash: '0x8f3a9b72c418e21c8409aa67f2e15bc3901b8e4d2719a9108a9f4e2b0289e21c',
    status: 'verified'
  },
  {
    id: 'ACT-2026-0814-02',
    actionType: 'coop_upload',
    title: 'Co-op Upload: NPPO Phytosanitary & RA Certs Uploaded',
    titleVi: 'HTX Tải Lên: Đã Nộp Chứng Nhận KDTV & Rainforest Alliance',
    description: 'Cu M\'gar Quality Director uploaded NPPO inspection cert #VN-NPPO-2026-9016 with digital timestamp signature.',
    descriptionVi: 'Giám đốc chất lượng Cư M\'gar đã tải lên chứng nhận kiểm dịch #VN-NPPO-2026-9016 với chữ ký điện tử PKI.',
    shipmentId: 'VN-EXP-2026-9016',
    lotCode: 'LOT-GL-2026-045',
    cooperative: 'Gia Lai Specialty Union',
    actor: 'Pham Van Duc (HTX Lead)',
    actorRole: 'Cooperative Manager',
    timestamp: '24 mins ago',
    isoTime: '2026-08-14T06:50:00Z',
    txHash: '0x99a12cf8832a881e19488a0914f66ba981014e21b8441cd883901488102a1492',
    status: 'verified'
  },
  {
    id: 'ACT-2026-0814-03',
    actionType: 'sent_to_buyer',
    title: 'Passport Dispatched to EU Importer Portal',
    titleVi: 'Hộ Chiếu Đã Chuyển Tới Cổng Kiểm Tra Của Nhà Mua EU',
    description: 'Encrypted EUDR Passport link transmitted to Hamburg Coffee Company AG procurement desk via TRACES-NT gateway.',
    descriptionVi: 'Liên kết mã hóa Hộ chiếu EUDR đã truyền sang phòng thu mua Hamburg Coffee Company AG qua cổng TRACES-NT.',
    shipmentId: 'VN-EXP-2026-9015',
    lotCode: 'LOT-LD-2026-112',
    cooperative: 'Lam Dong Arabica Union',
    actor: 'AgriTrust Dispatcher',
    actorRole: 'Automated Gateway',
    timestamp: '42 mins ago',
    isoTime: '2026-08-14T06:32:00Z',
    txHash: '0x33b48f9021dae448102941baef990148201a4e219084bc9102834019a8201b44',
    status: 'verified'
  },
  {
    id: 'ACT-2026-0814-04',
    actionType: 'satellite_audit',
    title: 'Copernicus Sentinel-2 Satellite Multi-Polygon Validation',
    titleVi: 'Kiểm Tra Vệ Tinh Đa Giác Copernicus Sentinel-2 Hoàn Tất',
    description: '18 smallholder farm plot boundary coordinates scanned against Dec 31, 2020 baseline. 0.0% forest canopy disturbance.',
    descriptionVi: '18 tọa độ đa giác nông hộ được đối soát mốc 31/12/2020. Tỷ lệ biến động độ che phủ rừng đạt chuẩn 0.0%.',
    shipmentId: 'VN-EXP-2026-9014',
    lotCode: 'LOT-BMT-2026-088',
    cooperative: 'Buon Ma Thuot Robusta Co-op',
    actor: 'AgriTrust GIS Engine',
    actorRole: 'Satellite Oracle',
    timestamp: '1 hour ago',
    isoTime: '2026-08-14T06:14:00Z',
    txHash: '0x12f490a88b49102c9a10294e10289b4f9901a2380129bc48019488a091240182',
    status: 'verified'
  },
  {
    id: 'ACT-2026-0814-05',
    actionType: 'customs_seal',
    title: 'Cat Lai Terminal Smart Container GPS E-Seal Staged',
    titleVi: 'Container Thông Minh Được Kẹp Chì Điện Tử GPS Tại Cảng Cát Lái',
    description: 'Container #MSKU-881209 sealed with cryptographic tamper-evident GPS beacon. Temp: 22.4°C, Humidity: 64%.',
    descriptionVi: 'Container #MSKU-881209 đã kẹp seal điện tử định vị GPS chống can thiệp. Nhiệt độ 22.4°C, độ ẩm 64%.',
    shipmentId: 'VN-EXP-2026-9017',
    lotCode: 'LOT-SL-2026-009',
    cooperative: 'Son La Specialty Arabica Co-op',
    actor: 'Cat Lai Port Authority',
    actorRole: 'Logistics Validator',
    timestamp: '2 hours ago',
    isoTime: '2026-08-14T05:10:00Z',
    txHash: '0x77c91024a819b4e09102948a1092834b990192841029384a09128340192834ab',
    status: 'info'
  },
  {
    id: 'ACT-2026-0814-06',
    actionType: 'doc_requested',
    title: 'Action Required: Co-op Document Request Dispatched',
    titleVi: 'Yêu Cầu Hành Động: Đã Gửi Thông Báo Bổ Sung Chứng Từ HTX',
    description: 'Notification dispatched via Zalo & AgriTrust Portal to Buon Ma Thuot Robusta Co-op for Rainforest Alliance certificate.',
    descriptionVi: 'Thông báo đã gửi qua Zalo & Cổng AgriTrust tới HTX Cà phê Buôn Ma Thuột để bổ sung chứng nhận Rainforest Alliance.',
    shipmentId: 'VN-EXP-2026-9014',
    lotCode: 'LOT-BMT-2026-088',
    cooperative: 'Buon Ma Thuot Robusta Co-op',
    actor: 'Nguyen Van Hai',
    actorRole: 'AgriTrust Exporter Compliance',
    timestamp: '3 hours ago',
    isoTime: '2026-08-14T04:00:00Z',
    status: 'warning'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOTIF-ZALO-001',
    source: 'zalo',
    channel: 'zalo_oa',
    title: 'Zalo OA: Farm Batch #88 Signed by Smallholder Group',
    titleVi: 'Zalo OA: Nhóm Nông Hộ Đã Ký Số Bàn Giao Lô #88',
    message: 'Cooperative representative Nguyen Van Hung confirmed 18 smallholder farmers in Cu M\'gar completed GPS weight verification on Zalo OA.',
    messageVi: 'Đại diện HTX Nguyễn Văn Hùng xác nhận 18 hộ nông dân Cư M\'gar đã hoàn thành xác thực cân định vị GPS qua Zalo OA.',
    timestamp: '14/08/2026 14:12 ICT',
    timeAgo: '12 mins ago',
    timeAgoVi: '12 phút trước',
    isRead: false,
    priority: 'urgent',
    shipmentId: 'VN-EXP-2026-9014',
    lotCode: 'LOT-BMT-2026-088',
    sender: {
      name: 'Nguyễn Văn Hùng',
      role: 'Chủ nhiệm HTX Buôn Ma Thuột',
      organization: 'Buon Ma Thuot Robusta Co-op',
      avatarText: 'NVH'
    },
    actionType: 'view_shipment'
  },
  {
    id: 'NOTIF-SYS-002',
    source: 'satellite',
    channel: 'agritrust_cloud',
    title: 'Copernicus Satellite: Zero Deforestation Cleared',
    titleVi: 'Vệ Tinh Copernicus: Xác Nhận Không Phá Rừng (0.0%)',
    message: 'Sentinel-2 automated overlay scanned 18 farm polygon coordinates for Lot LOT-BMT-2026-088 against the Dec 31, 2020 EUDR cutoff.',
    messageVi: 'Lớp phủ Sentinel-2 tự động quét 18 đa giác nông hộ cho Lô LOT-BMT-2026-088 đối soát mốc 31/12/2020. Tỷ lệ rủi ro 0.0%.',
    timestamp: '14/08/2026 13:45 ICT',
    timeAgo: '45 mins ago',
    timeAgoVi: '45 phút trước',
    isRead: false,
    priority: 'normal',
    shipmentId: 'VN-EXP-2026-9014',
    lotCode: 'LOT-BMT-2026-088',
    sender: {
      name: 'AgriTrust GIS Oracle',
      role: 'Automated Satellite Engine',
      organization: 'ESA Copernicus Sentinel Hub',
      avatarText: 'GIS'
    },
    actionType: 'view_passport'
  },
  {
    id: 'NOTIF-ZALO-003',
    source: 'zalo',
    channel: 'zalo_mini_app',
    title: 'Zalo Mini App: Lam Dong Arabica Co-op Uploaded Phytosanitary Stamp',
    titleVi: 'Zalo Mini App: HTX Lâm Đồng Tải Lên Con Dấu Kiểm Dịch Thực Vật',
    message: 'Lam Dong Arabica Union uploaded official NPPO inspection document #NPPO-LD-2026-09 via AgriTrust Zalo Mini App.',
    messageVi: 'Liên minh Cà phê Arabica Lâm Đồng đã gửi file chứng thư kiểm dịch NPPO #NPPO-LD-2026-09 qua Zalo Mini App AgriTrust.',
    timestamp: '14/08/2026 12:30 ICT',
    timeAgo: '2 hours ago',
    timeAgoVi: '2 giờ trước',
    isRead: false,
    priority: 'normal',
    shipmentId: 'VN-EXP-2026-9015',
    lotCode: 'LOT-LD-2026-112',
    sender: {
      name: 'Trần Thị Bích',
      role: 'Quản lý Hồ sơ HTX',
      organization: 'Lam Dong Arabica Union',
      avatarText: 'TTB'
    },
    actionType: 'view_shipment'
  },
  {
    id: 'NOTIF-SYS-004',
    source: 'customs',
    channel: 'traces_eu',
    title: 'EU TRACES-NT: DDS Receipt Acknowledged by Hamburg Coffee Company',
    titleVi: 'EU TRACES-NT: Hamburg Coffee Company Đã Tiếp Nhận Hồ Sơ DDS',
    message: 'Due Diligence Statement reference EU-DDS-2026-VN-09413 successfully verified on EU Deforestation Registry (TRACES-NT Gateway).',
    messageVi: 'Mã hồ sơ thẩm định trách nhiệm EU-DDS-2026-VN-09413 đã được xác thực thành công trên Cổng TRACES-NT Hải quan Châu Âu.',
    timestamp: '14/08/2026 11:15 ICT',
    timeAgo: '3 hours ago',
    timeAgoVi: '3 giờ trước',
    isRead: true,
    priority: 'normal',
    shipmentId: 'VN-EXP-2026-9015',
    lotCode: 'LOT-LD-2026-112',
    sender: {
      name: 'EU TRACES Gateway',
      role: 'DG Environment Customs Relay',
      organization: 'European Commission',
      avatarText: 'EU'
    },
    actionType: 'view_passport'
  },
  {
    id: 'NOTIF-ZALO-005',
    source: 'zalo',
    channel: 'zalo_oa',
    title: 'Zalo Bot: Quality Lab Cup Score 84.0/100 Recorded',
    titleVi: 'Zalo Bot: Đã Ghi Nhận Điểm Cupping Thử Nếm 84.0/100',
    message: 'Dr. Le Thi Mai submitted accredited ISO 17025 laboratory moisture (11.8%) and sensory cupping certificates for LOT-BMT-2026-088.',
    messageVi: 'TS. Lê Thị Mai đã gửi kết quả đo độ ẩm chuẩn ISO 17025 (11.8%) và biên bản thử nếm hương vị đạt 84.0 điểm cho Lô LOT-BMT-2026-088.',
    timestamp: '14/08/2026 09:30 ICT',
    timeAgo: '5 hours ago',
    timeAgoVi: '5 giờ trước',
    isRead: true,
    priority: 'normal',
    shipmentId: 'VN-EXP-2026-9014',
    lotCode: 'LOT-BMT-2026-088',
    sender: {
      name: 'TS. Lê Thị Mai',
      role: 'Chuyên gia Giám định Chất lượng',
      organization: 'Vinacontrol Dak Lak Lab',
      avatarText: 'LTM'
    },
    actionType: 'view_shipment'
  },
  {
    id: 'NOTIF-SYS-006',
    source: 'system',
    channel: 'agritrust_cloud',
    title: 'Cat Lai Port: GPS Smart E-Seal Beacon Active',
    titleVi: 'Cảng Cát Lái: Kẹp Chì Điện Tử GPS Thông Minh Đã Kích Hoạt',
    message: 'Container #MSKU-881209 sealed for export to Hamburg. Real-time temperature (22.4°C) and humidity (64%) sensors streaming.',
    messageVi: 'Container #MSKU-881209 xuất khẩu đi Hamburg đã kẹp chì seal điện tử. Cảm biến nhiệt độ (22.4°C) & độ ẩm (64%) đang hoạt động.',
    timestamp: '14/08/2026 07:15 ICT',
    timeAgo: '7 hours ago',
    timeAgoVi: '7 giờ trước',
    isRead: true,
    priority: 'low',
    shipmentId: 'VN-EXP-2026-9017',
    lotCode: 'LOT-SL-2026-009',
    sender: {
      name: 'Cat Lai Port Logistics',
      role: 'Smart Container Oracle',
      organization: 'Saigon Newport Corporation',
      avatarText: 'SNP'
    },
    actionType: 'view_shipment'
  }
];


