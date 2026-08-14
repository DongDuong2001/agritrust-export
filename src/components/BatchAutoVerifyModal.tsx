import React, { useState, useEffect } from 'react';
import { 
  X, 
  Zap, 
  CheckCircle, 
  ShieldCheck, 
  FileCheck, 
  AlertTriangle, 
  Loader2, 
  Cpu, 
  Satellite, 
  Lock, 
  ArrowRight,
  Database,
  Check,
  Copy,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { CoffeeShipment } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface BatchAutoVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipments: CoffeeShipment[];
  onConfirmBatchVerify: () => void;
  onSelectShipment?: (id: string) => void;
}

export const BatchAutoVerifyModal: React.FC<BatchAutoVerifyModalProps> = ({
  isOpen,
  onClose,
  shipments,
  onConfirmBatchVerify,
  onSelectShipment
}) => {
  const { language, t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<number>(0); // 0: Review, 1: Connecting, 2: AI Verify, 3: PKI Sign, 4: Blockchain, 5: Completed
  const [progress, setProgress] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [copiedTxHash, setCopiedTxHash] = useState<boolean>(false);
  const [generatedTxHash, setGeneratedTxHash] = useState<string>('');

  const missingShipments = shipments.filter(s => s.status === 'Missing Documents');

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setProgress(0);
      setIsVerifying(false);
      setCopiedTxHash(false);
      setGeneratedTxHash(
        '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartSimulation = () => {
    if (isVerifying) return;
    setIsVerifying(true);
    setCurrentStep(1);
    setProgress(15);

    // Step 1 -> Step 2
    setTimeout(() => {
      setCurrentStep(2);
      setProgress(45);
    }, 700);

    // Step 2 -> Step 3
    setTimeout(() => {
      setCurrentStep(3);
      setProgress(75);
    }, 1400);

    // Step 3 -> Step 4
    setTimeout(() => {
      setCurrentStep(4);
      setProgress(92);
    }, 2000);

    // Step 4 -> Complete
    setTimeout(() => {
      setCurrentStep(5);
      setProgress(100);
      setIsVerifying(false);
      onConfirmBatchVerify();
    }, 2600);
  };

  const handleCopyHash = () => {
    if (navigator.clipboard && generatedTxHash) {
      navigator.clipboard.writeText(generatedTxHash);
      setCopiedTxHash(true);
      setTimeout(() => setCopiedTxHash(false), 2500);
    }
  };

  const stepsList = [
    {
      id: 1,
      title: language === 'vi' ? 'Đồng bộ Dữ liệu HTX & Hồ sơ Số' : 'Co-op Sync & Document Intake',
      desc: language === 'vi' ? 'Thu thập chứng chỉ KDTV & Rainforest Alliance từ nút cơ sở Buôn Ma Thuột' : 'Pulling NPPO Phytosanitary & RA certs from cooperative nodes',
      icon: <Database className="w-4 h-4 text-sky-500" />
    },
    {
      id: 2,
      title: language === 'vi' ? 'Kiểm toán AI & Đối soát Vệ tinh Sentinel-2' : 'AI Validation & Sentinel-2 GIS Audit',
      desc: language === 'vi' ? 'Đối chiếu 100% tọa độ đa giác nông hộ với mốc chuẩn rừng 31/12/2020 (0.00% Phá rừng)' : 'Verifying farm GPS polygons against Dec 31, 2020 forest baseline (0.00% Deforestation)',
      icon: <Satellite className="w-4 h-4 text-indigo-500" />
    },
    {
      id: 3,
      title: language === 'vi' ? 'Đóng Dấu Chữ Ký Số Mật Mã PKI' : 'Cryptographic PKI Stamping',
      desc: language === 'vi' ? 'Gắn chữ ký số Giám đốc HTX & Chứng thư kiểm định viên AgriTrust Master Validator' : 'Affixing Cooperative Director PKI stamp & AgriTrust Master Validator endorsement',
      icon: <Lock className="w-4 h-4 text-amber-500" />
    },
    {
      id: 4,
      title: language === 'vi' ? 'Ghi Bằng Chứng Bất Biến Vào Sổ Cái' : 'Blockchain Ledger Commitment',
      desc: language === 'vi' ? 'Ghi nhận giao dịch kiểm toán vào Sổ cái AgriTrust v2.1 với mã băm mật mã độc bản' : 'Committing immutable audit transaction to AgriTrust blockchain ledger block #4891028',
      icon: <Cpu className="w-4 h-4 text-emerald-500" />
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        id="batch-auto-verify-modal-content"
        className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-2xl w-full overflow-hidden my-6 transition-all"
      >
        {/* Top Header Banner */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-transparent border-b border-slate-200 dark:border-slate-700 relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 dark:bg-amber-500/30 border border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0 shadow-xs">
                <Zap className="w-6 h-6 fill-amber-500/30 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white font-heading">
                    {language === 'vi' ? 'Thẩm Định Tự Động Hàng Loạt' : 'Batch Auto-Verification Engine'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    AI + PKI Stamping
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {language === 'vi' 
                    ? 'Tự động giải quyết toàn bộ hồ sơ thiếu, xác thực chứng từ hợp tác xã và ghi nhật ký kiểm toán bất biến.'
                    : 'Simultaneously resolve missing documents across all export lots, attach verified certificates, and record audit trail.'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isVerifying}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Target Shipments Status Banner */}
          {missingShipments.length > 0 ? (
            <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {missingShipments.length} {language === 'vi' ? 'lô hàng đang thiếu chứng từ' : 'shipment(s) with missing documents'}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 ml-1.5 font-mono text-[11px]">
                    ({missingShipments.map(s => s.id).join(', ')})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 self-start sm:self-auto bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Sẵn sàng thẩm định 100%' : 'Ready for auto-verification'}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <span className="font-bold block text-sm">
                  {language === 'vi' ? 'Tất Cả Lô Hàng Đều Đã Đạt Chuẩn 100%!' : 'All Shipments Are Already 100% Verified!'}
                </span>
                <span>
                  {language === 'vi' 
                    ? 'Không có lô hàng nào cần bổ sung chứng từ. Bạn có thể xuất Hộ chiếu EUDR hoặc chuyển cho Nhà mua EU.' 
                    : 'No pending documentation actions required. All export lots are deforestation-free and verified on ledger.'}
                </span>
              </div>
            </div>
          )}

          {/* List of Shipments being processed */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'vi' ? 'Danh Sách Lô Hàng Sẽ Thẩm Định' : 'Target Export Batches'}
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-700/60 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden max-h-40 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/40 text-xs">
              {(missingShipments.length > 0 ? missingShipments : shipments.slice(0, 3)).map((s) => (
                <div key={s.id} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{s.id}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({s.lotCode})</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{s.cooperative} • {s.province}</p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    {currentStep === 5 || s.status === 'Verified' || s.status === 'Sent to Buyer' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                        <Check className="w-3 h-3" />
                        <span>{language === 'vi' ? 'Đã Thẩm Định' : 'Verified'}</span>
                      </span>
                    ) : isVerifying ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>{language === 'vi' ? 'Đang Xử Lý...' : 'Processing...'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                        {language === 'vi' ? 'Thiếu Chứng Chỉ' : 'Missing Cert'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress & Live Step Execution */}
          {(isVerifying || currentStep > 0) && (
            <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-700 space-y-3.5 animate-fade-in shadow-inner">
              
              {/* Progress Bar Header */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-2 text-emerald-400">
                  {isVerifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                  <span>{currentStep === 5 ? (language === 'vi' ? 'Hoàn tất thẩm định 100%' : 'Batch Verification Succeeded') : (language === 'vi' ? 'Đang thực thi chuỗi thẩm định AI...' : 'Executing Multi-Step Pipeline...')}</span>
                </span>
                <span className="font-mono font-bold text-amber-400">{progress}%</span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-emerald-400 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Steps List */}
              <div className="space-y-2 pt-1 text-xs">
                {stepsList.map((step) => {
                  const isDone = currentStep > step.id || currentStep === 5;
                  const isCurrent = currentStep === step.id;

                  return (
                    <div 
                      key={step.id}
                      className={`p-2.5 rounded-lg border transition-all flex items-start gap-2.5 ${
                        isDone 
                          ? 'bg-emerald-950/40 border-emerald-800 text-slate-200' 
                          : isCurrent 
                          ? 'bg-amber-950/40 border-amber-700/90 text-white shadow-xs' 
                          : 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-60'
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {isDone ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 animate-pulse">
                            <Loader2 size={12} className="animate-spin" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-[10px] font-mono">
                            {step.id}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-bold flex items-center justify-between">
                          <span className={isDone ? 'text-emerald-300' : isCurrent ? 'text-amber-300' : 'text-slate-400'}>
                            {step.title}
                          </span>
                          {isDone && <span className="text-[10px] text-emerald-400 font-mono">OK ✓</span>}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Blockchain Transaction Hash Seal */}
              {currentStep === 5 && (
                <div className="mt-3 p-3 rounded-lg bg-slate-950/90 border border-emerald-500/50 space-y-1.5 animate-fade-in">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <ShieldCheck size={14} />
                      <span>{language === 'vi' ? 'Mã Băm Sổ Cái Bất Biến (Ledger TxHash)' : 'Immutable Blockchain Tx Hash'}</span>
                    </span>
                    <button
                      onClick={handleCopyHash}
                      className="inline-flex items-center gap-1 text-slate-300 hover:text-white text-[10px] font-mono bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded transition-colors cursor-pointer"
                    >
                      {copiedTxHash ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                      <span>{copiedTxHash ? (language === 'vi' ? 'Đã chép!' : 'Copied!') : (language === 'vi' ? 'Sao chép' : 'Copy')}</span>
                    </button>
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 break-all select-all">
                    {generatedTxHash}
                  </p>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {language === 'vi' 
                ? 'Tự động đồng bộ với cơ chế ghi sổ cái kiểm toán EUDR.' 
                : 'Automatically updates status, attaches digital signatures & logs audit trail.'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isVerifying}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {currentStep === 5 ? (language === 'vi' ? 'Đóng' : 'Close') : (language === 'vi' ? 'Hủy Bỏ' : 'Cancel')}
            </button>

            {currentStep === 5 ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onSelectShipment && missingShipments[0]) {
                    onSelectShipment(missingShipments[0].id);
                  }
                }}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <span>{language === 'vi' ? 'Xem Chi Tiết Lô Hàng →' : 'Inspect Verified Lots →'}</span>
              </button>
            ) : (
              <button
                type="button"
                id="modal-start-batch-verify-btn"
                onClick={handleStartSimulation}
                disabled={isVerifying || missingShipments.length === 0}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <>
                    <Loader2 size={15} className="animate-spin text-slate-950" />
                    <span>{language === 'vi' ? 'Đang Thẩm Định...' : 'Verifying All Lots...'}</span>
                  </>
                ) : (
                  <>
                    <Zap size={15} className="fill-slate-950" />
                    <span>
                      {language === 'vi' 
                        ? `Bắt Đầu Thẩm Định Hàng Loạt (${missingShipments.length})` 
                        : `Run Batch Auto-Verify (${missingShipments.length})`}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
