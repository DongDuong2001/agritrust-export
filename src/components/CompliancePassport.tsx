import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Copy, 
  Check, 
  Send, 
  CheckCircle, 
  Link, 
  Globe, 
  Lock, 
  Printer,
  Download,
  FileCheck,
  Eye,
  Layers,
  Sparkles,
  Tag,
  FileText,
  SlidersHorizontal
} from 'lucide-react';
import { CoffeeShipment } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { AgriTrustLogo } from './AgriTrustLogo';
import { A4CertificatePrintView } from './A4CertificatePrintView';
import { ThermalLabelPrintView } from './ThermalLabelPrintView';

interface CompliancePassportProps {
  shipment: CoffeeShipment;
  onBack: () => void;
  onSendToBuyer: (shipmentId: string) => void;
  onOpenBuyerPortal: (shipmentId?: string) => void;
  darkMode: boolean;
}

export type PassportViewMode = 'interactive' | 'a4_preview' | 'thermal_preview';

export const CompliancePassport: React.FC<CompliancePassportProps> = ({
  shipment,
  onBack,
  onSendToBuyer,
  onOpenBuyerPortal,
  darkMode,
}) => {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [isSent, setIsSent] = useState(shipment.status === 'Sent to Buyer');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [viewMode, setViewMode] = useState<PassportViewMode>('interactive');
  const [isMonochrome, setIsMonochrome] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(shipment.documentHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmSend = () => {
    setIsSent(true);
    setShowSendModal(false);
    onSendToBuyer(shipment.id);
  };

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      setIsGeneratingPdf(false);
      window.print();
    }, 400);
  };

  return (
    <div className="space-y-5">
      
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Left: Back Button & Mode Indicator */}
        <div className="flex items-center gap-3">
          <button
            id="passport-back-btn"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer w-fit whitespace-nowrap flex-shrink-0"
          >
            <ArrowLeft size={14} className="flex-shrink-0" />
            <span>{language === 'vi' ? '← Chi tiết Lô' : '← Back to Lot'}</span>
          </button>

          {/* Mode Selector Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('interactive')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'interactive'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Eye size={12} className="text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'vi' ? 'Giao Diện Chuẩn' : 'Interactive View'}</span>
            </button>

            <button
              onClick={() => setViewMode('a4_preview')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'a4_preview'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileText size={12} className="text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'vi' ? 'Xem Trước In A4' : 'A4 Certificate'}</span>
            </button>

            <button
              onClick={() => setViewMode('thermal_preview')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'thermal_preview'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Tag size={12} className="text-amber-600 dark:text-amber-400" />
              <span>{language === 'vi' ? 'Nhãn Nhiệt 4"×6"' : '4"×6" Thermal Label'}</span>
            </button>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Download PDF / Print Button */}
          <button
            id="download-pdf-btn"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-emerald-500 transition-all cursor-pointer shadow-2xs whitespace-nowrap flex-shrink-0"
            title={language === 'vi' ? 'Tải / In Bản PDF Hộ Chiếu' : 'Download / Print PDF Certificate'}
          >
            <Download size={14} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>{isGeneratingPdf ? (language === 'vi' ? 'Đang chuẩn bị PDF...' : 'Preparing PDF...') : (language === 'vi' ? 'Tải Hộ Chiếu PDF' : 'Download PDF')}</span>
          </button>

          <button
            id="view-in-buyer-portal-btn"
            onClick={() => onOpenBuyerPortal(shipment.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs whitespace-nowrap flex-shrink-0"
          >
            <Globe size={14} className="text-teal-600 dark:text-teal-400 flex-shrink-0" />
            <span className="hidden sm:inline">{language === 'vi' ? 'Cổng Nhà Mua EU' : 'EU Buyer Portal'}</span>
            <Link size={12} className="text-slate-400 flex-shrink-0" />
          </button>

          <button
            id="send-to-buyer-btn"
            onClick={() => setShowSendModal(true)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
              isSent
                ? 'bg-blue-700 hover:bg-blue-800'
                : 'bg-emerald-700 hover:bg-emerald-800'
            }`}
          >
            <Send size={14} className="flex-shrink-0" />
            <span>{isSent ? (language === 'vi' ? 'Gửi lại' : 'Resend') : (language === 'vi' ? 'Gửi Nhà Mua' : 'Send')}</span>
          </button>
        </div>
      </div>

      {/* PRINT PREVIEW CONTROLS BAR (Shown when preview mode is active) */}
      {viewMode !== 'interactive' && (
        <div id="preview-controls-bar" className="p-3.5 bg-slate-900 text-white rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Printer size={16} />
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>
                  {viewMode === 'a4_preview' ? t('a4Certificate') : t('thermalLabel')}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  {viewMode === 'a4_preview' ? 'A4 300 DPI' : '4"×6" (100×150mm) 203 DPI'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {viewMode === 'a4_preview' ? t('a4CertDesc') : t('thermalLabelDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Monochrome / High Contrast Toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white text-xs select-none">
              <input
                type="checkbox"
                checked={isMonochrome}
                onChange={(e) => setIsMonochrome(e.target.checked)}
                className="w-3.5 h-3.5 accent-emerald-600 rounded cursor-pointer"
              />
              <span>{language === 'vi' ? 'Độ tương phản cao (Đen/Trắng)' : 'High Contrast Monochrome'}</span>
            </label>

            {/* Direct Print Button */}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              <Printer size={14} />
              <span>{t('printThisLayout')}</span>
            </button>

            {/* Exit Preview Button */}
            <button
              onClick={() => setViewMode('interactive')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors cursor-pointer"
            >
              {t('exitPrintPreview')}
            </button>
          </div>
        </div>
      )}

      {/* VIEW RENDERER BASED ON SELECTED MODE */}
      {viewMode === 'a4_preview' ? (
        <div className="py-4 bg-slate-200/60 dark:bg-slate-950/80 rounded-2xl p-4 sm:p-8 flex justify-center overflow-x-auto border border-slate-300 dark:border-slate-800">
          <A4CertificatePrintView shipment={shipment} isMonochrome={isMonochrome} />
        </div>
      ) : viewMode === 'thermal_preview' ? (
        <div className="py-4 bg-slate-200/60 dark:bg-slate-950/80 rounded-2xl p-4 sm:p-8 flex justify-center overflow-x-auto border border-slate-300 dark:border-slate-800">
          <ThermalLabelPrintView shipment={shipment} isHighContrast={isMonochrome} />
        </div>
      ) : (
        /* Standard Interactive View */
        <div className="passport-certificate-card max-w-4xl mx-auto rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden relative">
          
          {/* Certificate Decorative Top Border */}
          <div className="h-1.5 bg-[#064E3B]" />

          <div className="p-5 sm:p-7 space-y-6">
            
            {/* Certificate Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <AgriTrustLogo size="sm" darkMode={darkMode} />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                    EUDR Article 4 Due Diligence
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Ref #{shipment.eudrReference}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {language === 'vi' ? 'Hộ Chiếu Số Tuân Thủ EUDR Cà Phê Xuất Khẩu' : 'Cryptographic Coffee Compliance Passport'}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'vi' 
                    ? 'Bằng chứng số xác thực không gây mất rừng và truy xuất chuỗi hành trình nguồn gốc xuất xứ theo Quy định EU 2023/1115.' 
                    : 'Official verifiable proof of zero deforestation and complete supply chain custody.'}
                </p>
              </div>

              {/* Blockchain Verification Badge / Seal */}
              <div className="flex-shrink-0 flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="w-9 h-9 rounded-lg bg-[#064E3B] text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck size={20} className="flex-shrink-0" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    AgriTrust Ledger
                  </div>
                  <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <span>{language === 'vi' ? 'Đã Xác Thực EUDR' : 'EUDR Verified'}</span>
                    <CheckCircle size={14} className="text-emerald-600 flex-shrink-0" />
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {language === 'vi' ? 'Khối' : 'Block'} #{shipment.blockNumber}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 1: Coffee Origin & Spec Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 text-xs">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t('colId')}
                </div>
                <div className="font-mono font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                  {shipment.id}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">{shipment.lotCode}</div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {language === 'vi' ? 'Hợp Tác Xã & Vùng Trồng' : 'Origin & Cooperative'}
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-xs mt-0.5">
                  {shipment.cooperative}
                </div>
                <div className="text-[11px] text-slate-500">{shipment.province}, Vietnam ({shipment.elevationMeters}m)</div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {language === 'vi' ? 'Giống & Khối Lượng' : 'Variety & Volume'}
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-xs mt-0.5">
                  {shipment.variety}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">{shipment.volumeKg.toLocaleString()} kg ({shipment.bagsCount} {t('metricBags')})</div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t('colBuyer')}
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-xs mt-0.5">
                  {shipment.targetBuyer}
                </div>
                <div className="text-[11px] text-slate-500">{shipment.destinationPort}</div>
              </div>
            </div>

            {/* Section 2: Mock Document Hash & Cryptographic Proof */}
            <div className="p-3.5 rounded-lg bg-slate-900 text-slate-100 dark:bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                    {language === 'vi' ? 'Mã Băm Mật Mã Tài Liệu Bất Biến' : 'Immutable Cryptographic Document Hash'}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 font-mono">
                  SHA-256 Merkle Root • EVM Polygon
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 p-2 rounded bg-slate-950/90 border border-slate-800 font-mono text-xs text-emerald-300 break-all">
                <span>{shipment.documentHash}</span>
                <button
                  id="copy-hash-btn"
                  onClick={handleCopyHash}
                  className="flex-shrink-0 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                  title="Copy Hash"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-0.5 gap-2">
                <span>{language === 'vi' ? 'Tọa độ đa giác GPS' : 'GPS Polygon Plot'}: {shipment.gpsCoordinates}</span>
                <span>{language === 'vi' ? 'Thời gian ghi sổ cái' : 'Ledger Timestamp'}: {shipment.ledgerTimestamp}</span>
              </div>
            </div>

            {/* Section 3: 5 Stakeholder Digital Signatures */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <span>{language === 'vi' ? 'Chữ Ký Số Mã Hóa 5 Bên Liên Quan' : 'Multi-Party Cryptographic Signatures'}</span>
                  <span className="font-normal text-slate-500">({language === 'vi' ? '5/5 Đã Xác Thực' : '5 of 5 Verified'})</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  100% {language === 'vi' ? 'Hoàn Tất' : 'Complete'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {shipment.signatures.map((sig, idx) => (
                  <div
                    key={idx}
                    id={`signature-row-${idx}`}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    
                    {/* Left: Role and Name */}
                    <div className="flex items-start sm:items-center space-x-2.5">
                      <div className="w-6 h-6 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {sig.role}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            • {sig.partyName} ({sig.organization})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                          <span>{sig.location}</span>
                          <span>•</span>
                          <span>Key: {sig.keySignature}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Signature Badge & Timestamp */}
                    <div className="flex-shrink-0 flex items-center gap-2 self-end sm:self-center">
                      <div className="text-right">
                        <div className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 text-xs">
                          <CheckCircle size={14} className="text-emerald-600 flex-shrink-0" />
                          <span>{language === 'vi' ? 'Đã Ký Số' : 'Signed'}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {sig.timestamp}
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Certificate Footer Stamp & Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>EUDR Immutable Ledger ID: AGRI-VN-2026-EU-PASS</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 font-semibold cursor-pointer shadow-2xs whitespace-nowrap flex-shrink-0"
                >
                  <Download size={13} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>{language === 'vi' ? 'Tải PDF' : 'Download PDF'}</span>
                </button>

                <button
                  onClick={() => setViewMode('a4_preview')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-semibold cursor-pointer whitespace-nowrap flex-shrink-0"
                >
                  <Printer size={13} className="flex-shrink-0" />
                  <span>{language === 'vi' ? 'Xem Trước In' : 'Print Preview'}</span>
                </button>

                <button
                  onClick={() => setShowSendModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold cursor-pointer shadow-xs whitespace-nowrap flex-shrink-0"
                >
                  <Send size={13} className="flex-shrink-0" />
                  <span>{language === 'vi' ? 'Gửi Nhà Mua' : 'Send to Buyer'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Send to Buyer Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-100">
            
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {language === 'vi' ? 'Chuyển Giao Hộ Chiếu Số Cho Nhà Mua EU' : 'Dispatch Passport to EU Buyer'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {language === 'vi' ? 'Truyền dữ liệu mã hóa mật mã bảo mật' : 'Secure cryptographic link transmission'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  {language === 'vi' ? 'Đơn Vị Tiếp Nhận & Nhà Nhập Khẩu EU' : 'Target Recipient & EU Importer'}
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${shipment.targetBuyer} (${shipment.buyerEmail || 'compliance@importer.eu'})`}
                  className="w-full mt-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  {language === 'vi' ? 'Gói Hồ Sơ Thẩm Định Kèm Theo' : 'Included Verification Package'}
                </label>
                <div className="mt-1 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1 text-slate-700 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>✓ {language === 'vi' ? 'Ranh giới tọa độ đa giác GPS Sentinel-2' : 'GPS Sentinel-2 Polygon GIS Boundaries'}</span>
                    <span className="text-emerald-600 font-bold">{language === 'vi' ? 'Đã Xác Thực' : 'Verified'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>✓ {language === 'vi' ? 'Con dấu Kiểm dịch & Rainforest Alliance' : 'Rainforest Alliance & Phytosanitary Seal'}</span>
                    <span className="text-emerald-600 font-bold">{language === 'vi' ? 'Đã Đính Kèm' : 'Attached'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>✓ {language === 'vi' ? 'Tờ khai Trách nhiệm Giải trình Điều 4 (JSON/XML)' : 'Article 4 Due Diligence Statement (JSON/XML)'}</span>
                    <span className="text-emerald-600 font-bold">{language === 'vi' ? 'Đã Khởi Tạo' : 'Generated'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>✓ {language === 'vi' ? 'Chữ ký số mật mã 5 bên' : '5-Party Cryptographic Signatures'}</span>
                    <span className="text-emerald-600 font-bold">{language === 'vi' ? 'Đã Ký' : 'Signed'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSendModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer whitespace-nowrap flex-shrink-0"
              >
                {t('btnCancel')}
              </button>
              <button
                id="confirm-send-buyer-btn"
                onClick={handleConfirmSend}
                className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer whitespace-nowrap flex-shrink-0"
              >
                {language === 'vi' ? 'Xác Nhận & Gửi Đi' : 'Confirm & Dispatch'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

