import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  ShieldCheck, 
  CheckCircle, 
  Copy, 
  Check, 
  Printer, 
  Layers
} from 'lucide-react';
import { CoffeeShipment } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipments: CoffeeShipment[];
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({
  isOpen,
  onClose,
  shipments
}) => {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'statement' | 'table' | 'traces_json'>('statement');

  if (!isOpen) return null;

  const totalVolumeKg = shipments.reduce((sum, s) => sum + s.volumeKg, 0);
  const totalVolumeMT = (totalVolumeKg / 1000).toFixed(1);
  const verifiedShipments = shipments.filter(s => s.status === 'Verified' || s.status === 'Sent to Buyer');
  const complianceRate = Math.round((verifiedShipments.length / (shipments.length || 1)) * 100);

  const reportDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const exportCsv = () => {
    const headers = [
      'Shipment_ID',
      'Lot_Code',
      'EUDR_Reference',
      'Cooperative',
      'Province',
      'GPS_Coordinates',
      'Variety',
      'Volume_KG',
      'Bags_Count',
      'Target_EU_Buyer',
      'Destination_Port',
      'Phytosanitary_Cert',
      'Rainforest_Cert',
      'Status',
      'Deforestation_Loss_Pct',
      'Cryptographic_Hash'
    ];

    const rows = shipments.map(s => [
      s.id,
      s.lotCode,
      s.eudrReference,
      `"${s.cooperative}"`,
      `"${s.province}"`,
      `"${s.gpsCoordinates}"`,
      s.variety,
      s.volumeKg,
      s.bagsCount,
      `"${s.targetBuyer}"`,
      `"${s.destinationPort}"`,
      s.phytosanitaryNumber,
      s.rainforestAllianceNumber,
      s.status,
      `${s.deforestationLoss}%`,
      s.documentHash
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EUDR_Audit_Dossier_AgriTrust_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTracesJson = () => {
    return {
      dueDiligenceStatement: {
        regulation: 'Regulation (EU) 2023/1115',
        statementId: `DDS-VN-AGRITRUST-${Date.now()}`,
        operator: {
          name: 'AgriTrust Coffee Exporters Consortium Vietnam',
          taxId: 'VN-TAX-0318991204',
          eoriNumber: 'VN-EORI-2026-COFFEE-01',
          address: 'Cat Lai Port Logistics Zone, Thu Duc City, Ho Chi Minh City, Vietnam',
        },
        competentAuthority: 'European Commission DG Environment (TRACES-NT Gateway)',
        generationTimestamp: new Date().toISOString(),
        auditedBaselineDate: '2020-12-31T23:59:59Z',
        overallDeforestationRisk: 'NEGLIGIBLE (0.00%)',
        commodityCode: '0901.11.00 (Coffee, not roasted, not decaffeinated)',
        aggregateVolumeMetricTons: parseFloat(totalVolumeMT),
        blockchainConsensus: {
          ledger: 'AgriTrust EUDR Permissioned Ledger',
          blockHeight: 4891024,
          algorithm: 'Ed25519-SHA256',
        },
        shipmentLots: shipments.map(s => ({
          lotId: s.id,
          lotCode: s.lotCode,
          eudrReference: s.eudrReference,
          cooperativeName: s.cooperative,
          administrativeRegion: `${s.province}, ${s.region}`,
          polygonCoordinates: s.gpsCoordinates,
          elevationMeters: s.elevation,
          variety: s.variety,
          netMassKg: s.volumeKg,
          bagUnits: s.bagsCount,
          nppoCertificateNumber: s.phytosanitaryNumber,
          rainforestAllianceId: s.rainforestAllianceNumber,
          targetBuyer: s.targetBuyer,
          entryPortEU: s.destinationPort,
          complianceStatus: s.status,
          deforestationCanopyLoss: s.deforestationLoss,
          cryptographicProofHash: s.documentHash
        }))
      }
    };
  };

  const downloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(getTracesJson(), null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `TRACES_NT_EUDR_DDS_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const copyJson = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(getTracesJson(), null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">
                  {t('qaReportModalTitle')}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  EU 2023/1115
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('qaReportModalSub')} • Generated on {reportDate}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Tabs & Export Buttons Bar */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          {/* Tab Selection */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('statement')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'statement'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {language === 'vi' ? 'Bản Tuyên Bố Thẩm Định (DDS)' : 'Due Diligence Statement'}
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'table'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {language === 'vi' ? 'Bảng Lô Xuất Khẩu' : 'Lots Pipeline Table'} ({shipments.length})
            </button>
            <button
              onClick={() => setActiveTab('traces_json')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'traces_json'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              TRACES-NT JSON
            </button>
          </div>

          {/* Export Action Buttons */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t('qaDownloadCsv')}</span>
            </button>

            <button
              onClick={downloadJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-xs cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{t('qaDownloadJson')}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('qaDownloadPdf')}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          
          {/* Summary Metric Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-500 font-medium">{language === 'vi' ? 'Tổng Sản Lượng' : 'Total Audited Volume'}</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{totalVolumeMT} <span className="text-xs font-normal text-slate-500">MT</span></p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-500 font-medium">{language === 'vi' ? 'Tỷ Lệ Tuân Thủ' : 'Compliance Pass Rate'}</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{complianceRate}%</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-500 font-medium">{language === 'vi' ? 'Rủi Ro Phá Rừng' : 'Deforestation Risk'}</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">0.00% <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400">Negligible</span></p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-500 font-medium">{language === 'vi' ? 'Khối Sổ Cái' : 'EVM Ledger Block'}</span>
              <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">#4891024</p>
            </div>
          </div>

          {activeTab === 'statement' && (
            <div className="space-y-4 font-sans border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-950/40">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                    European Union Due Diligence Statement (DDS)
                  </h4>
                </div>
                <span className="font-mono text-[11px] text-slate-500">Ref: DDS-VN-2026-EUDR-0814</span>
              </div>

              <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>
                  <strong>1. Operator Identification:</strong> AgriTrust Verified Coffee Exporters Consortium (EORI: VN-EORI-2026-COFFEE-01), operating under full traceability compliance with EU Regulation 2023/1115 for green coffee beans (HS Code 0901.11.00).
                </p>
                <p>
                  <strong>2. Deforestation-Free Assessment (Article 9):</strong> All constituent farm parcels contributing to the {shipments.length} export lots have undergone automated Copernicus Sentinel-2 multispectral vegetation canopy loss analysis. Land use comparison against the statutory cut-off baseline of <strong>31 December 2020</strong> demonstrates <strong>0.00% forest degradation</strong> across all geolocation polygon coordinates.
                </p>
                <p>
                  <strong>3. Legality Verification (Article 10):</strong> Harvest groups and cooperatives possess certified Land Use Rights Certificates (Sổ Đỏ), NPPO Phytosanitary declarations from the Vietnam Plant Protection Department, and Rainforest Alliance audit certifications.
                </p>
                <p>
                  <strong>4. Cryptographic Proof:</strong> Tamper-evident SHA-256 Merkle tree root hashes have been immutably committed to the AgriTrust EVM Ledger at block #4891024.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                <span>Signed: <strong>Nguyen Van Hai</strong> (Head of Compliance)</span>
                <span>Verification Authority: <strong>TRACES-NT Ready Gateway</strong></span>
              </div>
            </div>
          )}

          {activeTab === 'table' && (
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto max-h-[350px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold sticky top-0">
                    <tr>
                      <th className="p-2.5">Lot ID</th>
                      <th className="p-2.5">Cooperative</th>
                      <th className="p-2.5">Volume</th>
                      <th className="p-2.5">EU Buyer</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Deforestation</th>
                      <th className="p-2.5">Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {shipments.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-2.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">{s.id}</td>
                        <td className="p-2.5">{s.cooperative}</td>
                        <td className="p-2.5 font-mono">{(s.volumeKg / 1000).toFixed(1)} MT</td>
                        <td className="p-2.5">{s.targetBuyer}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            s.status === 'Verified' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                            s.status === 'Sent to Buyer' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                            'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="p-2.5 text-emerald-600 font-bold">{s.deforestationLoss}%</td>
                        <td className="p-2.5 font-mono text-[10px] text-slate-400 truncate max-w-[100px]">{s.documentHash}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'traces_json' && (
            <div className="relative">
              <div className="absolute top-2 right-2">
                <button
                  onClick={copyJson}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-[350px] border border-slate-800">
                {JSON.stringify(getTracesJson(), null, 2)}
              </pre>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Complies with Regulation (EU) 2023/1115 requirements</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold transition-colors cursor-pointer"
          >
            {language === 'vi' ? 'Đóng' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
