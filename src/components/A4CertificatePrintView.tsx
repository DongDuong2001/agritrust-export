import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  Lock, 
  QrCode, 
  MapPin, 
  Building2, 
  Calendar, 
  Award,
  Trees,
  Check
} from 'lucide-react';
import { CoffeeShipment } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { AgriTrustLogo } from './AgriTrustLogo';

interface A4CertificatePrintViewProps {
  shipment: CoffeeShipment;
  isMonochrome?: boolean;
}

export const A4CertificatePrintView: React.FC<A4CertificatePrintViewProps> = ({
  shipment,
  isMonochrome = false
}) => {
  const { language } = useLanguage();

  const printDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className={`print-a4-target bg-white text-slate-900 mx-auto w-full max-w-[800px] min-h-[1050px] p-8 sm:p-10 shadow-lg border ${isMonochrome ? 'border-black' : 'border-emerald-800/40'} rounded-lg font-sans relative select-text`}>
      
      {/* Decorative Outer Border */}
      <div className={`absolute inset-3 border-2 ${isMonochrome ? 'border-black' : 'border-emerald-800'} pointer-events-none`} />
      <div className={`absolute inset-4 border ${isMonochrome ? 'border-black' : 'border-emerald-600/50'} pointer-events-none`} />

      {/* Top Header */}
      <div className="relative z-10 text-center pb-5 border-b-2 border-slate-900 space-y-2">
        <div className="flex items-center justify-between px-2">
          <AgriTrustLogo size="md" darkMode={false} />
          
          <div className="text-right">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-600">
              EUDR REGULATION (EU) 2023/1115
            </div>
            <div className="text-xs font-mono font-bold text-slate-900">
              STATEMENT ID: DDS-VN-{shipment.id}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight uppercase text-slate-900">
            {language === 'vi' 
              ? 'Chứng Thư Hộ Chiếu Số Tuân Thủ EUDR' 
              : 'Certificate of EUDR Compliance & Traceability'}
          </h1>
          <p className="text-xs font-medium text-slate-600 max-w-xl mx-auto mt-1">
            {language === 'vi'
              ? 'Xác nhận lô hàng cà phê không gây mất rừng, hợp pháp và truy xuất nguồn gốc đầy đủ theo Quy định (EU) 2023/1115'
              : 'Official Due Diligence Statement verifying zero deforestation and complete supply chain custody'}
          </p>
        </div>
      </div>

      {/* Verification Seal Banner */}
      <div className="relative z-10 my-4 p-3 bg-slate-50 border border-slate-300 rounded flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <div>
            <span className="font-bold text-slate-900">DEFORESTATION RISK: 0.00% (NEGLIGIBLE)</span>
            <div className="text-[11px] text-slate-600">
              Sentinel-2 Satellite Cutoff Baseline: 31 December 2020 • Verified Legality
            </div>
          </div>
        </div>

        <div className="text-right font-mono text-[11px]">
          <div className="font-bold text-emerald-800">STATUS: APPROVED FOR EU CUSTOMS</div>
          <div className="text-slate-500">Block #{shipment.blockNumber} • Ed25519-SHA256</div>
        </div>
      </div>

      {/* Shipment & Origin Specifications (2-Column Grid) */}
      <div className="relative z-10 grid grid-cols-2 gap-4 my-4 text-xs">
        
        {/* Left Column: Origin & Plantation */}
        <div className="border border-slate-300 rounded p-3 space-y-2 bg-white">
          <div className="font-bold text-[11px] uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>{language === 'vi' ? '1. Nguồn Gốc & Hợp Tác Xã' : '1. Origin & Smallholder Cooperative'}</span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">{language === 'vi' ? 'Hợp tác xã:' : 'Cooperative:'}</span>
              <span className="font-bold text-slate-900">{shipment.cooperative}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{language === 'vi' ? 'Tỉnh thành:' : 'Province/Region:'}</span>
              <span className="font-semibold text-slate-800">{shipment.province}, {shipment.region}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{language === 'vi' ? 'Tọa độ GPS đa giác:' : 'Centroid GPS Coordinates:'}</span>
              <span className="font-mono font-semibold text-slate-800">{shipment.gpsCoordinates}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{language === 'vi' ? 'Độ cao nông trại:' : 'Farm Elevation:'}</span>
              <span className="font-semibold text-slate-800">{shipment.elevationMeters}m MSL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{language === 'vi' ? 'Chứng nhận Rainforest:' : 'Rainforest Alliance ID:'}</span>
              <span className="font-mono font-semibold text-slate-800">{shipment.rainforestAllianceNumber}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Commodity & Consignment */}
        <div className="border border-slate-300 rounded p-3 space-y-2 bg-white">
          <div className="font-bold text-[11px] uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-700" />
            <span>{language === 'vi' ? '2. Thông Số Lô Hàng & Xuất Khẩu' : '2. Commodity & Consignment Specs'}</span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">{language === 'vi' ? 'Mã lô nội bộ:' : 'Internal Lot Code:'}</span>
              <span className="font-mono font-bold text-slate-900">{shipment.lotCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{language === 'vi' ? 'Chủng loại cà phê:' : 'Variety & Grade:'}</span>
              <span className="font-bold text-slate-800">{shipment.variety}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{language === 'vi' ? 'Tổng khối lượng tịnh:' : 'Net Export Mass:'}</span>
              <span className="font-mono font-bold text-slate-900">{(shipment.volumeKg).toLocaleString()} KG ({shipment.bagsCount} Bags)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{language === 'vi' ? 'Nhà mua EU tiếp nhận:' : 'Target EU Importer:'}</span>
              <span className="font-bold text-slate-800">{shipment.targetBuyer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{language === 'vi' ? 'Cảng nhập cảnh EU:' : 'EU Entry Port:'}</span>
              <span className="font-semibold text-slate-800">{shipment.destinationPort}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Section 3: 5-Party Cryptographic Signatures Table */}
      <div className="relative z-10 my-4 border border-slate-300 rounded p-3 bg-white">
        <div className="font-bold text-[11px] uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>3. Multi-Party Cryptographic Signatures (Article 4 Validation)</span>
          </span>
          <span className="text-[10px] font-bold text-emerald-800">5 / 5 VERIFIED ON-CHAIN</span>
        </div>

        <table className="w-full text-left text-[10px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-1">Stakeholder Role</th>
              <th className="py-1">Signatory & Organization</th>
              <th className="py-1">Location</th>
              <th className="py-1">Cryptographic Key ID</th>
              <th className="py-1 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {shipment.signatures.map((sig, idx) => (
              <tr key={idx} className="text-slate-800">
                <td className="py-1.5 font-bold">{sig.role}</td>
                <td className="py-1.5">{sig.partyName} ({sig.organization})</td>
                <td className="py-1.5 text-slate-600">{sig.location}</td>
                <td className="py-1.5 font-mono text-[9px] text-slate-500">{sig.keySignature}</td>
                <td className="py-1.5 text-right font-bold text-emerald-800">✓ Signed</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section 4: Merkle Root & Customs QR Scan Block */}
      <div className="relative z-10 my-4 p-3.5 border-2 border-slate-800 rounded bg-slate-50 flex items-center justify-between gap-4">
        <div className="space-y-1 text-xs">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600">
            DECENTRALIZED MERKLE TREE ROOT HASH
          </div>
          <div className="font-mono text-xs font-bold text-slate-900 break-all select-all">
            {shipment.documentHash}
          </div>
          <div className="text-[10px] text-slate-600 font-mono flex items-center gap-3 pt-1">
            <span>Ledger: AgriTrust EUDR Permissioned EVM</span>
            <span>•</span>
            <span>Recorded: {shipment.ledgerTimestamp}</span>
          </div>
        </div>

        {/* QR Code Graphic for Customs Scanners */}
        <div className="flex-shrink-0 text-center p-2 bg-white border border-slate-300 rounded shadow-xs">
          <div className="w-18 h-18 bg-slate-900 text-white flex flex-col items-center justify-center p-1 rounded font-mono text-[8px] leading-tight">
            <QrCode className="w-12 h-12 text-white" />
          </div>
          <span className="text-[8px] font-mono font-bold text-slate-600 block mt-1">
            EU CUSTOMS QR
          </span>
        </div>
      </div>

      {/* Certificate Footer Signatures & Official Stamp */}
      <div className="relative z-10 pt-6 mt-6 border-t border-slate-300 flex items-end justify-between text-xs text-slate-700">
        <div className="space-y-1">
          <div className="font-bold text-slate-900">AGRITRUST COMPLIANCE CONSORTIUM</div>
          <div className="text-[11px] text-slate-500">Cat Lai Port Logistics Zone, Ho Chi Minh City, Vietnam</div>
          <div className="text-[10px] text-slate-400 font-mono">Verified under EU TRACES-NT Direct Gateway API</div>
        </div>

        {/* Official Embossed Seal Stamp Mock */}
        <div className="text-center p-2 border-2 border-dashed border-emerald-800 rounded-full w-28 h-28 flex flex-col items-center justify-center rotate-[-4deg] bg-emerald-50/50">
          <ShieldCheck className="w-6 h-6 text-emerald-800" />
          <span className="text-[8px] font-bold tracking-tighter text-emerald-900 uppercase mt-0.5">
            AGRITRUST SEAL
          </span>
          <span className="text-[7px] font-mono text-emerald-800">
            EUDR-2023/1115
          </span>
          <span className="text-[7px] text-emerald-700 font-bold">
            0.0% DEFORESTATION
          </span>
        </div>

        <div className="text-right space-y-1">
          <div className="text-[11px] text-slate-500">Authorized Compliance Officer:</div>
          <div className="font-serif italic text-base font-bold text-slate-900">Nguyen Van Hai</div>
          <div className="text-[10px] text-slate-500 font-mono">Date Issued: {printDate}</div>
        </div>
      </div>

    </div>
  );
};
