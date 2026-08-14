import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  ShieldCheck
} from 'reicon-react';
import { CoffeeShipment } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface NewShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddShipment: (newShipment: CoffeeShipment) => void;
  darkMode: boolean;
}

export const NewShipmentModal: React.FC<NewShipmentModalProps> = ({
  isOpen,
  onClose,
  onAddShipment,
  darkMode,
}) => {
  const { t, language } = useLanguage();
  if (!isOpen) return null;

  const [cooperative, setCooperative] = useState('HTX Cà Phê Buôn Ma Thuột');
  const [province, setProvince] = useState('Dak Lak');
  const [variety, setVariety] = useState('Specialty Robusta Honey Process');
  const [volumeKg, setVolumeKg] = useState<number>(19200);
  const [targetBuyer, setTargetBuyer] = useState('Tchibo GmbH');
  const [destinationPort, setDestinationPort] = useState('Hamburg Port, Germany');
  const [preset, setPreset] = useState<'daklak' | 'lamdong' | 'gialai'>('daklak');

  const applyPreset = (type: 'daklak' | 'lamdong' | 'gialai') => {
    setPreset(type);
    if (type === 'daklak') {
      setCooperative(language === 'vi' ? 'HTX Cà Phê Krông Ana' : 'Krong Ana Fine Robusta Group');
      setProvince('Dak Lak');
      setVariety('Fine Robusta (Specialty Grade 1)');
      setVolumeKg(19200);
      setTargetBuyer('Tchibo GmbH');
      setDestinationPort('Hamburg Port, Germany');
    } else if (type === 'lamdong') {
      setCooperative(language === 'vi' ? 'HTX Arabica Cao Nguyên Lang Biang' : 'Lang Biang Arabica High-Altitude Co-op');
      setProvince('Lam Dong');
      setVariety('Specialty Arabica (Catimor & Bourbon)');
      setVolumeKg(24000);
      setTargetBuyer('Hamburg Coffee Company AG');
      setDestinationPort('Hamburg Port, Germany');
    } else {
      setCooperative(language === 'vi' ? 'Liên Minh Hữu Cơ Chư Sê' : 'Chu Se Organic Alliance');
      setProvince('Gia Lai');
      setVariety('Organic Honey Robusta');
      setVolumeKg(18000);
      setTargetBuyer('Lavazza SpA');
      setDestinationPort('Genoa Port, Italy');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `VN-EXP-2026-${randomSuffix}`;
    const newLot = `LOT-EXP-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newShipment: CoffeeShipment = {
      id: newId,
      lotCode: newLot,
      cooperative,
      region: 'Central Highlands',
      province,
      variety,
      process: 'Controlled Fermentation & Sun-Drying',
      volumeKg: Number(volumeKg),
      bagsCount: Math.round(Number(volumeKg) / 60),
      targetBuyer,
      destinationPort,
      status: 'Verified',
      completenessPercent: 100,
      gpsCoordinates: '12.7120° N, 108.1150° E (Polygon #602)',
      elevationMeters: 680,
      harvestPeriod: 'Jan 2026 – Feb 2026',
      farmPlotsCount: 15,
      deforestationRiskScore: '0.0% (Zero Risk - Copernicus Satellite EUDR Pass)',
      moisturePercent: 11.7,
      cuppingScore: 84.5,
      screenSize: 'Grade 1 Screen 18 (7.1mm)',
      documentHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      blockNumber: 4891250 + Math.floor(Math.random() * 500),
      ledgerTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      eudrReference: `EU-DDS-2026-VN-${randomSuffix}`,
      createdDate: new Date().toISOString().substring(0, 10),
      targetShipDate: '2026-09-10',
      buyerEmail: 'procurement@buyer.eu',
      checklist: [
        {
          id: `chk-new-1`,
          name: 'Plot Geolocation & Polygon Mapping',
          category: 'geolocation',
          status: 'complete',
          summary: '15 smallholder farm polygons mapped with Sentinel-2 GIS boundaries',
          details: 'Verified zero deforestation after 2020 cutoff baseline.',
          evidenceType: 'GIS GeoJSON Boundary',
          updatedAt: 'Just now',
          referenceCode: `GIS-VN-${randomSuffix}`
        },
        {
          id: `chk-new-2`,
          name: 'Chain-of-Custody & Batch Traceability',
          category: 'custody',
          status: 'complete',
          summary: 'Digital weighbridge lot tracing complete from farm gate',
          details: 'Traceability tags active on all hermetic export bags.',
          evidenceType: 'ERP Weighbridge Log',
          updatedAt: 'Just now',
          referenceCode: `COC-VN-${randomSuffix}`
        },
        {
          id: `chk-new-3`,
          name: 'Phytosanitary & Rainforest Alliance Certification',
          category: 'certification',
          status: 'complete',
          summary: 'Phytosanitary Certificate & RA Certified verified',
          details: 'National Plant Protection Organization digital e-seal verified.',
          evidenceType: 'NPPO Digital Certificate',
          updatedAt: 'Just now',
          referenceCode: `CERT-RA-${randomSuffix}`
        },
        {
          id: `chk-new-4`,
          name: 'Evidence Freshness & EU Due Diligence Statement',
          category: 'freshness',
          status: 'complete',
          summary: 'EUDR Article 4 Due Diligence Statement generated',
          details: 'Vinacontrol laboratory test confirmed pesticide residue compliant.',
          evidenceType: 'Vinacontrol Lab Assay',
          updatedAt: 'Just now',
          referenceCode: `DDS-REF-${randomSuffix}`
        }
      ],
      signatures: [
        {
          role: 'Farmer / Plot Owner',
          partyName: 'Highland Producer Network',
          organization: cooperative,
          status: 'Signed ✓',
          timestamp: 'Just now',
          location: `${province}, Vietnam`,
          keySignature: '0x8841a...991c'
        },
        {
          role: 'Cooperative Manager',
          partyName: 'Quality Lead Officer',
          organization: cooperative,
          status: 'Signed ✓',
          timestamp: 'Just now',
          location: `${province} Central Processing`,
          keySignature: '0x3319b...44fa'
        },
        {
          role: 'Testing Lab & Quality',
          partyName: 'Vinacontrol ISO/IEC 17025',
          organization: 'Vinacontrol Testing Center',
          status: 'Signed ✓',
          timestamp: 'Just now',
          location: 'Ho Chi Minh Center',
          keySignature: '0x12bb9...88cd'
        },
        {
          role: 'Logistics & Cat Lai Customs',
          partyName: 'Saigon Port Authority',
          organization: 'Cat Lai Logistics Hub',
          status: 'Signed ✓',
          timestamp: 'Just now',
          location: 'Cat Lai Port',
          keySignature: '0x77ee1...bb44'
        },
        {
          role: 'AgriTrust Exporter',
          partyName: 'AgriTrust Compliance Officer',
          organization: 'AgriTrust Export Vietnam',
          status: 'Signed ✓',
          timestamp: 'Just now',
          location: 'Hanoi HQ',
          keySignature: '0x9920a...33ee'
        }
      ],
      timeline: [
        {
          step: 1,
          stage: 'Farm Origin & Plot Geolocation',
          title: 'Polygon Plot Mapping & Deforestation Check',
          location: `${province}, Vietnam`,
          date: '2026-02-01',
          details: 'Satellite verification confirmed zero deforestation risk score.',
          status: 'verified'
        },
        {
          step: 2,
          stage: 'Processing & Lab Clearance',
          title: 'Wet Milling & Moisture Stabilization',
          location: `${cooperative} Dry Mill`,
          date: '2026-02-15',
          details: 'Moisture settled at 11.7%, graded to Screen 18.',
          status: 'verified'
        },
        {
          step: 3,
          stage: 'Port Inspection & Sealing',
          title: 'Customs Smart E-Seal Staging',
          location: 'Cat Lai Port, Ho Chi Minh City',
          date: '2026-08-12',
          details: 'Export manifest staged for European vessel loading.',
          status: 'verified'
        },
        {
          step: 4,
          stage: 'EUDR Passport Ready',
          title: 'Cryptographic Compliance Passport Validated',
          location: destinationPort,
          date: 'Ready',
          details: 'Ready for EU customs import inspection.',
          status: 'verified'
        }
      ]
    };

    onAddShipment(newShipment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              <Plus size={16} className="flex-shrink-0" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'vi' ? 'Đăng Ký Lô Hàng Cà Phê Xuất Khẩu Mới' : 'Register New Coffee Export Lot'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === 'vi' ? 'Định vị đa giác EUDR & Thẩm định mật mã số' : 'EUDR Polygon Geolocation & Cryptographic Audit'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer flex-shrink-0"
          >
            <X size={16} className="flex-shrink-0" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
            {language === 'vi' ? 'Chọn Mẫu Vùng Trồng Nhanh:' : 'Quick Origin Preset:'}
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'daklak', label: language === 'vi' ? 'Đắk Lắk Robusta' : 'Dak Lak Robusta' },
              { id: 'lamdong', label: language === 'vi' ? 'Lâm Đồng Arabica' : 'Lam Dong Arabica' },
              { id: 'gialai', label: language === 'vi' ? 'Gia Lai Hữu Cơ' : 'Gia Lai Organic' }
            ].map(p => (
              <button
                type="button"
                key={p.id}
                onClick={() => applyPreset(p.id as any)}
                className={`py-1 px-1.5 rounded text-[11px] font-bold transition-all text-center cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  preset === p.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          
          <div>
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
              {language === 'vi' ? 'Tên Hợp Tác Xã / Vùng Trồng' : 'Farm / Cooperative Name'}
            </label>
            <input
              type="text"
              required
              value={cooperative}
              onChange={(e) => setCooperative(e.target.value)}
              className="w-full mt-0.5 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                {language === 'vi' ? 'Tỉnh Thành / Khu Vực' : 'Province / Region'}
              </label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full mt-0.5 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs"
              >
                <option value="Dak Lak">Đắk Lắk (Dak Lak)</option>
                <option value="Lam Dong">Lâm Đồng (Lam Dong)</option>
                <option value="Gia Lai">Gia Lai</option>
                <option value="Son La">Sơn La (Son La)</option>
                <option value="Dak Nong">Đắk Nông (Dak Nong)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                {language === 'vi' ? 'Khối Lượng (kg)' : 'Volume (kg)'}
              </label>
              <input
                type="number"
                required
                step="600"
                value={volumeKg}
                onChange={(e) => setVolumeKg(Number(e.target.value))}
                className="w-full mt-0.5 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
              {language === 'vi' ? 'Giống Cà Phê & Phân Hạng' : 'Coffee Variety & Grade'}
            </label>
            <input
              type="text"
              required
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              className="w-full mt-0.5 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                {language === 'vi' ? 'Nhà Mua / Khách Hàng EU' : 'Target EU Buyer'}
              </label>
              <input
                type="text"
                required
                value={targetBuyer}
                onChange={(e) => setTargetBuyer(e.target.value)}
                className="w-full mt-0.5 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                {language === 'vi' ? 'Cảng Đích Châu Âu' : 'Destination Port'}
              </label>
              <input
                type="text"
                required
                value={destinationPort}
                onChange={(e) => setDestinationPort(e.target.value)}
                className="w-full mt-0.5 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs"
              />
            </div>
          </div>

          {/* EUDR Validation Note */}
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-600 flex-shrink-0" />
            <span>{language === 'vi' ? 'Tự động kiểm tra đa giác Sentinel-2 & tạo bằng chứng mật mã số' : 'Automatic Sentinel-2 polygon check & cryptographic proof enabled'}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              {t('btnCancel')}
            </button>
            <button
              type="submit"
              id="submit-new-shipment-btn"
              className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              {language === 'vi' ? 'Tạo Lô Hàng Thẩm Định' : 'Create Verified Lot'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
