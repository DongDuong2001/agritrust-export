import React, { useState } from 'react';
import { 
  Building, 
  Location, 
  ShieldCheck, 
  Key, 
  Award, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  Layers, 
  Globe, 
  File, 
  Printer, 
  Download, 
  Sparkles, 
  Check, 
  Lock, 
  Satellite, 
  AlertCircle, 
  FileCheck,
  Plus,
  Trash2,
  Link,
  Shield,
  Clock,
  Briefcase
} from 'reicon-react';
import { ExporterProfile, CoffeeShipment } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { AgriTrustLogo } from './AgriTrustLogo';

interface ExporterOnboardingProps {
  onComplete: (profile: ExporterProfile) => void;
  onLaunchNewLot?: () => void;
  onBackToDashboard: () => void;
  darkMode?: boolean;
}

export const ExporterOnboarding: React.FC<ExporterOnboardingProps> = ({
  onComplete,
  onLaunchNewLot,
  onBackToDashboard,
  darkMode = false,
}) => {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isGeneratingKey, setIsGeneratingKey] = useState<boolean>(false);
  const [isVerifyingTraces, setIsVerifyingTraces] = useState<boolean>(false);
  const [isSimulatingPolygonUpload, setIsSimulatingPolygonUpload] = useState<boolean>(false);

  // Form State
  const [companyName, setCompanyName] = useState<string>('Simexco Daklak Export Import JSC');
  const [tradingName, setTradingName] = useState<string>('Simexco Coffee Vietnam');
  const [taxId, setTaxId] = useState<string>('6000175892');
  const [eoriNumber, setEoriNumber] = useState<string>('VN6000175892EORI');
  const [vicofaMemberNo, setVicofaMemberNo] = useState<string>('VICOFA-DL-088');
  const [representativeName, setRepresentativeName] = useState<string>('Nguyen Tien Dung');
  const [email, setEmail] = useState<string>('export@simexcodl.com.vn');
  const [phone, setPhone] = useState<string>('+84 262 385 2144');
  const [headOfficeAddress, setHeadOfficeAddress] = useState<string>('23 Ngo Quyen, Buon Ma Thuot City');
  const [province, setProvince] = useState<string>('Dak Lak');
  const [establishedYear, setEstablishedYear] = useState<number>(1993);

  // Cooperatives
  const [connectedCoops, setConnectedCoops] = useState<ExporterProfile['connectedCoops']>([
    {
      id: 'COOP-DL-01',
      name: language === 'vi' ? 'HTX Cà Phê Krông Ana (Đắk Lắk)' : 'Krong Ana Fine Robusta Alliance',
      province: 'Dak Lak',
      membersCount: 142,
      areaHectares: 320.5,
      status: 'connected',
      gpsCentroid: '12.6683° N, 108.0383° E'
    },
    {
      id: 'COOP-LD-02',
      name: language === 'vi' ? 'HTX Arabica Cầu Đất (Lâm Đồng)' : 'Cau Dat Arabica High-Altitude Co-op',
      province: 'Lam Dong',
      membersCount: 88,
      areaHectares: 175.2,
      status: 'connected',
      gpsCentroid: '11.9404° N, 108.4583° E'
    },
    {
      id: 'COOP-GL-03',
      name: language === 'vi' ? 'Liên Minh Hữu Cơ Chư Sê (Gia Lai)' : 'Chu Se Organic Robusta Group',
      province: 'Gia Lai',
      membersCount: 65,
      areaHectares: 140.0,
      status: 'connected',
      gpsCentroid: '13.7917° N, 108.0083° E'
    }
  ]);

  // Certifications
  const [certifications, setCertifications] = useState<ExporterProfile['certifications']>([
    {
      id: 'CERT-RA-2026',
      type: 'Rainforest Alliance',
      certNumber: 'RA-Cert-VN-2026-99124',
      expiryDate: '2027-12-31',
      status: 'verified',
      documentName: 'RA_MultiSite_Audit_2026.pdf'
    },
    {
      id: 'CERT-NPPO-2026',
      type: 'NPPO Phytosanitary',
      certNumber: 'NPPO-VN-EXP-2026-088',
      expiryDate: '2026-11-30',
      status: 'verified',
      documentName: 'NPPO_Phyto_Sanitary_Approval.pdf'
    },
    {
      id: 'CERT-FT-2026',
      type: 'Fairtrade',
      certNumber: 'FLO-ID-39812-VN',
      expiryDate: '2027-06-30',
      status: 'verified',
      documentName: 'Fairtrade_Flo_Cert_2026.pdf'
    }
  ]);

  // PKI & TRACES State
  const [signerKeyId, setSignerKeyId] = useState<string>('0x8f3a9b72c418e21c8409aa67f2e15bc3901b8e4d');
  const [pkiAlgorithm, setPkiAlgorithm] = useState<string>('Ed25519-Dilithium Hybrid (EUDR EU-EIDAS compliant)');
  const [tracesGatewayStatus, setTracesGatewayStatus] = useState<'connected' | 'testing'>('connected');
  const [eudrAccountReference, setEudrAccountReference] = useState<string>('EU-TRACES-VN-EXP-6000175892');

  // Preset Switcher
  const loadPreset = (preset: 'simexco' | 'intimex' | 'phucsinh') => {
    if (preset === 'simexco') {
      setCompanyName('Simexco Daklak Export Import JSC');
      setTradingName('Simexco Coffee Vietnam');
      setTaxId('6000175892');
      setEoriNumber('VN6000175892EORI');
      setVicofaMemberNo('VICOFA-DL-088');
      setRepresentativeName('Nguyen Tien Dung');
      setEmail('export@simexcodl.com.vn');
      setPhone('+84 262 385 2144');
      setHeadOfficeAddress('23 Ngo Quyen, Buon Ma Thuot City');
      setProvince('Dak Lak');
      setEstablishedYear(1993);
      setSignerKeyId('0x8f3a9b72c418e21c8409aa67f2e15bc3901b8e4d');
      setEudrAccountReference('EU-TRACES-VN-EXP-6000175892');
    } else if (preset === 'intimex') {
      setCompanyName('Intimex Group Joint Stock Company');
      setTradingName('Intimex Coffee Exporters');
      setTaxId('0304387291');
      setEoriNumber('VN0304387291EORI');
      setVicofaMemberNo('VICOFA-HCM-012');
      setRepresentativeName('Do Ha Nam');
      setEmail('coffee@intimexgroup.com');
      setPhone('+84 28 3820 1754');
      setHeadOfficeAddress('61 Nguyen Van Giai, District 1, Ho Chi Minh City');
      setProvince('Ho Chi Minh');
      setEstablishedYear(1995);
      setSignerKeyId('0x3b1c9472e819a12c4409bb17f3e25dc4901b7a2e');
      setEudrAccountReference('EU-TRACES-VN-EXP-0304387291');
    } else {
      setCompanyName('Phuc Sinh Corporation');
      setTradingName('K-Coffee & Blue Son La Export');
      setTaxId('0302489110');
      setEoriNumber('VN0302489110EORI');
      setVicofaMemberNo('VICOFA-PS-045');
      setRepresentativeName('Phan Minh Thong');
      setEmail('trade@phucsinh.com');
      setPhone('+84 28 3914 1799');
      setHeadOfficeAddress('139 Pasteur, District 3, Ho Chi Minh City');
      setProvince('Lam Dong');
      setEstablishedYear(2001);
      setSignerKeyId('0x7a2d8199b418c31e9409cc57f4e15ba2901c9b3f');
      setEudrAccountReference('EU-TRACES-VN-EXP-0302489110');
    }
  };

  const handleGeneratePKI = () => {
    setIsGeneratingKey(true);
    setTimeout(() => {
      const randomKey = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setSignerKeyId(randomKey);
      setIsGeneratingKey(false);
    }, 900);
  };

  const handleTestTraces = () => {
    setIsVerifyingTraces(true);
    setTimeout(() => {
      setTracesGatewayStatus('connected');
      setIsVerifyingTraces(false);
    }, 1100);
  };

  const handleSimulateGISUpload = () => {
    setIsSimulatingPolygonUpload(true);
    setTimeout(() => {
      setConnectedCoops(prev => [
        ...prev,
        {
          id: `COOP-NEW-${Date.now().toString().slice(-4)}`,
          name: language === 'vi' ? 'HTX Cà Phê Huyện Cư M\'gar (Đắk Lắk)' : 'Cu Mgar Fairtrade Alliance',
          province: 'Dak Lak',
          membersCount: 110,
          areaHectares: 245.0,
          status: 'connected',
          gpsCentroid: '12.8012° N, 108.0834° E'
        }
      ]);
      setIsSimulatingPolygonUpload(false);
    }, 900);
  };

  const totalSmallholders = connectedCoops.reduce((acc, c) => acc + c.membersCount, 0);
  const totalHectares = connectedCoops.reduce((acc, c) => acc + c.areaHectares, 0);

  const handleFinish = () => {
    const profile: ExporterProfile = {
      companyName,
      tradingName,
      taxId,
      eoriNumber,
      vicofaMemberNo,
      representativeName,
      email,
      phone,
      headOfficeAddress,
      province,
      establishedYear,
      connectedCoops,
      totalSmallholders,
      totalHectaresMapped: totalHectares,
      certifications,
      satelliteAuditStatus: 'verified',
      baselineYear: 2020,
      signerKeyId,
      pkiAlgorithm,
      tracesGatewayStatus,
      eudrAccountReference,
      onboardingStatus: 'completed'
    };
    onComplete(profile);
  };

  const steps = [
    { num: 1, title: t('step1Title'), desc: t('step1Desc'), icon: Building },
    { num: 2, title: t('step2Title'), desc: t('step2Desc'), icon: Location },
    { num: 3, title: t('step3Title'), desc: t('step3Desc'), icon: Award },
    { num: 4, title: t('step4Title'), desc: t('step4Desc'), icon: Key },
    { num: 5, title: t('step5Title'), desc: t('step5Desc'), icon: ShieldCheck }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* Top Breadcrumb & Header Banner (Design.md Corporate Modern) */}
      <div className="rounded-xl bg-[#012d1d] text-white p-6 shadow-xs border border-[#1b4332] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AgriTrustLogo size="sm" darkMode={true} />
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1b4332] text-emerald-200 border border-emerald-700/60 uppercase tracking-wider">
                {t('onboardingHeaderBadge')}
              </span>
              <span className="text-[11px] text-emerald-300 font-mono">
                EU Regulation 2023/1115
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
              {t('onboardingTitle')}
            </h1>
            <p className="text-xs text-emerald-100/90 max-w-2xl">
              {t('onboardingSub')}
            </p>
          </div>

          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer w-fit self-start sm:self-auto"
          >
            <span>{language === 'vi' ? '← Quay lại Bảng điều khiển' : '← Return to Dashboard'}</span>
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div className="pt-2 border-t border-emerald-800/60 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] text-emerald-200/80 font-medium">{t('presetEnterprise')}</span>
          <button
            type="button"
            onClick={() => loadPreset('simexco')}
            className="px-2.5 py-1 rounded bg-white/15 hover:bg-white/25 text-emerald-100 text-xs font-semibold border border-white/15 transition-all cursor-pointer"
          >
            {t('presetSimexco')}
          </button>
          <button
            type="button"
            onClick={() => loadPreset('intimex')}
            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-emerald-100 text-xs font-semibold border border-white/10 transition-all cursor-pointer"
          >
            {t('presetIntimex')}
          </button>
          <button
            type="button"
            onClick={() => loadPreset('phucsinh')}
            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-emerald-100 text-xs font-semibold border border-white/10 transition-all cursor-pointer"
          >
            {t('presetPhucSinh')}
          </button>
        </div>
      </div>

      {/* 5-Step Progress Bar & Stepper */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-[#e0e7e4] dark:border-slate-800 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`p-3 rounded-lg text-left transition-all border cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-[#1b4332] dark:border-emerald-500 shadow-xs'
                    : isCompleted
                    ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    : 'bg-transparent border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                      isCurrent
                        ? 'bg-[#1b4332] text-white'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.num}
                  </span>
                  <span className="text-[11px] font-bold font-mono text-slate-400">
                    Step {s.num}
                  </span>
                </div>
                <div className={`text-xs font-bold truncate ${isCurrent ? 'text-[#012d1d] dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'}`}>
                  {s.title.split('. ')[1] || s.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP CONTENT CONTAINER */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 sm:p-7 border border-[#e0e7e4] dark:border-slate-800 shadow-xs space-y-6">
        
        {/* STEP 1: Enterprise Profile & Tax / EORI */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <Building size={20} className="text-[#1b4332] dark:text-emerald-400 flex-shrink-0" />
                <span>{t('step1Title')}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('step1Desc')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'vi' ? 'Tên Pháp Nhân Đầy Đủ (Legal Corporate Name)' : 'Legal Corporate Name'}
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#1b4332] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'vi' ? 'Tên Giao Dịch Quốc Tế (Trading / Brand Name)' : 'Trading / Brand Name'}
                </label>
                <input
                  type="text"
                  value={tradingName}
                  onChange={(e) => setTradingName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#1b4332] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'vi' ? 'Mã Số Thuế Doanh Nghiệp (Tax ID / MST)' : 'Tax ID (Vietnam MST)'}
                </label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-[#1b4332] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1 flex items-center justify-between">
                  <span>{language === 'vi' ? 'Mã Định Danh Hải Quan EU (EORI Identifier)' : 'EU Customs EORI Number'}</span>
                  <span className="text-[#0a2472] dark:text-blue-400 font-mono text-[10px]">EU Customs Registered</span>
                </label>
                <input
                  type="text"
                  value={eoriNumber}
                  onChange={(e) => setEoriNumber(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-[#1b4332] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'vi' ? 'Mã Hội Viên Hiệp Hội Cà Phê Ca Cao (VICOFA ID)' : 'VICOFA Membership ID'}
                </label>
                <input
                  type="text"
                  value={vicofaMemberNo}
                  onChange={(e) => setVicofaMemberNo(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-[#1b4332] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'vi' ? 'Đại Diện Pháp Luật / Người Phụ Trách' : 'Authorized Representative'}
                </label>
                <input
                  type="text"
                  value={representativeName}
                  onChange={(e) => setRepresentativeName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#1b4332] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'vi' ? 'Email Tiếp Nhận Hồ Sơ EUDR' : 'Compliance Official Email'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#1b4332] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'vi' ? 'Số Điện Thoại Liên Hệ / Hotline' : 'Phone / Dispatch Hotline'}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-[#1b4332] outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'vi' ? 'Địa Chỉ Trụ Sở Chính & Kho Cảng Xuất Khẩu' : 'Head Office & Export Processing Facility Address'}
                </label>
                <input
                  type="text"
                  value={headOfficeAddress}
                  onChange={(e) => setHeadOfficeAddress(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#1b4332] outline-hidden"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#1b4332] dark:text-emerald-400" />
                <span className="text-slate-700 dark:text-slate-300">
                  {language === 'vi' ? 'Dữ liệu doanh nghiệp được mã hóa và xác minh qua cổng Hải Quan Quốc Gia & EU DG AGRI' : 'Enterprise credentials cryptographically hashed for EU DG AGRI & National Customs Gateway'}
                </span>
              </div>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">
                Status: Validated ✓
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: Cooperatives & GIS Polygon Mapping */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                  <Location size={20} className="text-[#1b4332] dark:text-emerald-400 flex-shrink-0" />
                  <span>{t('step2Title')}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t('step2Desc')}
                </p>
              </div>

              <button
                type="button"
                onClick={handleSimulateGISUpload}
                disabled={isSimulatingPolygonUpload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1b4332] hover:bg-[#012d1d] text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap flex-shrink-0"
              >
                <Upload size={14} className="flex-shrink-0" />
                <span>{isSimulatingPolygonUpload ? (language === 'vi' ? 'Đang nạp GeoJSON...' : 'Importing GIS...') : (language === 'vi' ? '+ Nhập Thêm HTX / GeoJSON' : '+ Import GeoJSON Shapefile')}</span>
              </button>
            </div>

            {/* Metrics Overview Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400">{t('activeCoopsCount')}</div>
                <div className="text-lg font-bold font-heading text-slate-900 dark:text-white mt-0.5">{connectedCoops.length} {language === 'vi' ? 'Hợp Tác Xã' : 'Cooperatives'}</div>
                <div className="text-[11px] text-slate-500">Đắk Lắk, Lâm Đồng, Gia Lai</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400">{t('smallholdersMapped')}</div>
                <div className="text-lg font-bold font-heading text-slate-900 dark:text-white mt-0.5">{totalSmallholders} {language === 'vi' ? 'Hộ Nông Dân' : 'Smallholders'}</div>
                <div className="text-[11px] text-slate-500">100% Sentinel-2 GIS Polygons</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400">{language === 'vi' ? 'Tổng Diện Tích Vùng Trồng' : 'Total Mapped Area'}</div>
                <div className="text-lg font-bold font-heading text-slate-900 dark:text-white mt-0.5">{totalHectares.toLocaleString()} ha</div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">0.0% Deforestation Risk</div>
              </div>
            </div>

            {/* Connected Cooperatives Table */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">{language === 'vi' ? 'Hợp Tác Xã / Vùng Trồng' : 'Cooperative / Farm Alliance'}</th>
                    <th className="p-3">{language === 'vi' ? 'Tỉnh Thành' : 'Province'}</th>
                    <th className="p-3">{language === 'vi' ? 'Số Nông Hộ' : 'Members'}</th>
                    <th className="p-3">{language === 'vi' ? 'Diện Tích' : 'Area (ha)'}</th>
                    <th className="p-3">{language === 'vi' ? 'Tọa Độ GPS Trọng Tâm' : 'Centroid GPS'}</th>
                    <th className="p-3 text-right">{language === 'vi' ? 'Trạng Thái' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {connectedCoops.map((coop) => (
                    <tr key={coop.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#1b4332] dark:text-emerald-400" />
                          <span>{coop.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{coop.id}</span>
                      </td>
                      <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{coop.province}</td>
                      <td className="p-3 font-mono">{coop.membersCount} {language === 'vi' ? 'nông hộ' : 'farms'}</td>
                      <td className="p-3 font-mono font-bold">{coop.areaHectares} ha</td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{coop.gpsCentroid}</td>
                      <td className="p-3 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{language === 'vi' ? 'Đã Kết Nối' : 'Connected'}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Satellite Forest Baseline Box */}
            <div className="p-4 rounded-lg bg-slate-900 text-white space-y-2 border border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Satellite className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold">{t('baselineCutoffAudit')}</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                  Cutoff: 31 Dec 2020 (EUDR Art. 3)
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {language === 'vi' 
                  ? 'Toàn bộ tọa độ đa giác của 295 nông hộ được đối soát trực tiếp với dữ liệu viễn thám Copernicus Sentinel-2. Không có diện tích cà phê nào lấn chiếm rừng tự nhiên sau thời điểm 31/12/2020.'
                  : 'All farm polygons have been matched against historical Copernicus Sentinel-2 satellite imagery. 0.0 ha forest loss detected post December 31, 2020.'}
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Due Diligence & Certifications */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <Award size={20} className="text-[#1b4332] dark:text-emerald-400 flex-shrink-0" />
                <span>{t('step3Title')}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('step3Desc')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      {cert.type}
                    </span>
                    <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                      <CheckCircle size={14} className="flex-shrink-0" />
                      <span>{language === 'vi' ? 'Hợp lệ' : 'Verified'}</span>
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      {cert.certNumber}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {language === 'vi' ? 'Hạn hiệu lực:' : 'Valid until:'} {cert.expiryDate}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                    <File size={14} className="text-slate-400 flex-shrink-0" />
                    <span className="truncate">{cert.documentName}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center p-6 space-y-2">
              <Upload size={32} className="mx-auto text-[#1b4332] dark:text-emerald-400 flex-shrink-0" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {language === 'vi' ? 'Tải Lên Thêm Chứng Chỉ Hợp Chuẩn (4C, Organic EU, BRC, ISO 22000)' : 'Upload Additional Compliance Certifications (4C, Organic EU, ISO 22000)'}
              </div>
              <p className="text-[11px] text-slate-500">
                {language === 'vi' ? 'Hỗ trợ định dạng PDF, XML, JSON có chữ ký số xác thực của tổ chức cấp chứng chỉ' : 'Supports PDF, XML, JSON with verifiable digital issuer signatures'}
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: Cryptographic PKI & TRACES-NT Key */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <Key size={20} className="text-[#1b4332] dark:text-emerald-400 flex-shrink-0" />
                <span>{t('step4Title')}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('step4Desc')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* PKI Keypair Container */}
              <div className="p-4 rounded-xl bg-slate-950 text-white border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Lock size={14} className="flex-shrink-0" />
                    <span>Enterprise Digital PKI Stamp</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">eIDAS Level 3</span>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Public Key / Verifier Address
                  </label>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-300 break-all select-all">
                    {signerKeyId}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1">
                  <div><span className="font-semibold text-slate-300">Algorithm:</span> {pkiAlgorithm}</div>
                  <div><span className="font-semibold text-slate-300">Role:</span> AgriTrust Master Exporter Validator</div>
                </div>

                <button
                  type="button"
                  onClick={handleGeneratePKI}
                  disabled={isGeneratingKey}
                  className="w-full py-2 rounded-lg bg-[#1b4332] hover:bg-[#012d1d] text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap flex-shrink-0"
                >
                  {isGeneratingKey ? (language === 'vi' ? 'Đang tạo cặp khóa...' : 'Generating Keypair...') : (language === 'vi' ? 'Tạo Lại Cặp Khóa Mật Mã Mới' : 'Regenerate Digital Signature Key')}
                </button>
              </div>

              {/* EU TRACES Gateway */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0a2472] dark:text-blue-400 flex items-center gap-1.5">
                    <Globe size={14} className="flex-shrink-0" />
                    <span>EU TRACES-NT Gateway</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {tracesGatewayStatus === 'connected' ? 'Connected ✓' : 'Testing'}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    EU Due Diligence Account ID
                  </label>
                  <input
                    type="text"
                    value={eudrAccountReference}
                    onChange={(e) => setEudrAccountReference(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  {language === 'vi'
                    ? 'Liên kết tự động truyền dữ liệu Tờ khai Trách nhiệm Giải trình (DDS) sang hệ thống Hải Quan EU tại Rotterdam, Hamburg, Antwerp.'
                    : 'Enables automatic digital transmission of Article 4 statements to European port authorities.'}
                </p>

                <button
                  type="button"
                  onClick={handleTestTraces}
                  disabled={isVerifyingTraces}
                  className="w-full py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap flex-shrink-0"
                >
                  {isVerifyingTraces ? (language === 'vi' ? 'Đang kiểm tra kết nối...' : 'Testing Ping...') : (language === 'vi' ? 'Kiểm Tra Kết Nối Cổng TRACES-NT' : 'Test TRACES-NT Handshake')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Activation & Institutional Certificate */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-600 flex-shrink-0" />
                <span>{t('step5Title')}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('step5Desc')}
              </p>
            </div>

            {/* Official Certificate Card (Design.md High-Trust Layout) */}
            <div className="p-6 sm:p-8 rounded-xl bg-white dark:bg-slate-950 border-2 border-[#1b4332] dark:border-emerald-600 shadow-sm space-y-6 text-slate-900 dark:text-white relative overflow-hidden">
              
              {/* Top Watermark & Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <AgriTrustLogo size="md" />
                  <div>
                    <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#1b4332] dark:text-emerald-400">
                      AGRITRUST EXPORT • INSTITUTIONAL CERTIFICATION
                    </div>
                    <div className="text-lg sm:text-xl font-extrabold font-heading">
                      EUDR Verified Exporter Certificate
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-400">Certificate Reference</div>
                  <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    CERT-EUDR-VN-2026-088
                  </div>
                </div>
              </div>

              {/* Company Verified Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Certified Exporter</span>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{companyName}</span>
                  <div className="text-[11px] text-slate-500">MST: {taxId} • EORI: {eoriNumber}</div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Sourcing Network</span>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{connectedCoops.length} Cooperatives ({totalSmallholders} Farmers)</span>
                  <div className="text-[11px] text-slate-500">{totalHectares} ha mapped (0.0% Deforestation)</div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">EU TRACES Account</span>
                  <span className="font-bold text-sm text-emerald-700 dark:text-emerald-400 font-mono">{eudrAccountReference}</span>
                  <div className="text-[11px] text-slate-500">eIDAS PKI Key: {signerKeyId.slice(0, 16)}...</div>
                </div>
              </div>

              {/* 4 Compliance Stamps */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle size={16} className="mx-auto text-emerald-600 mb-1 flex-shrink-0" />
                  <div className="font-bold text-emerald-900 dark:text-emerald-200 text-[11px]">EUDR Art. 3 Deforestation</div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400">Zero Risk 2020</div>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle size={16} className="mx-auto text-emerald-600 mb-1 flex-shrink-0" />
                  <div className="font-bold text-emerald-900 dark:text-emerald-200 text-[11px]">VICOFA Member</div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400">{vicofaMemberNo}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle size={16} className="mx-auto text-emerald-600 mb-1 flex-shrink-0" />
                  <div className="font-bold text-emerald-900 dark:text-emerald-200 text-[11px]">NPPO Phytosanitary</div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400">Audited & Sealed</div>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle size={16} className="mx-auto text-emerald-600 mb-1 flex-shrink-0" />
                  <div className="font-bold text-emerald-900 dark:text-emerald-200 text-[11px]">Cryptographic PKI</div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400">5-Party Ledger Active</div>
                </div>
              </div>

              {/* Action Buttons inside certificate */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500 font-mono">
                  Issuer: AgriTrust Decentralized Oracle • Node #VN-DL-01
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold cursor-pointer whitespace-nowrap flex-shrink-0"
                  >
                    <Printer size={14} className="flex-shrink-0" />
                    <span>{language === 'vi' ? 'In Chứng Thư' : 'Print Certificate'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleFinish}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#1b4332] hover:bg-[#012d1d] text-white text-xs font-bold shadow-xs cursor-pointer whitespace-nowrap flex-shrink-0"
                  >
                    <Check size={14} className="flex-shrink-0" />
                    <span>{t('btnCompleteOnboarding')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP NAVIGATION BUTTONS (FOOTER) */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              <ArrowLeft size={16} className="flex-shrink-0" />
              <span>{t('btnPrevStep')}</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#1b4332] hover:bg-[#012d1d] transition-all cursor-pointer shadow-xs whitespace-nowrap flex-shrink-0"
            >
              <span>{t('btnNextStep')}</span>
              <ArrowRight size={16} className="flex-shrink-0" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                handleFinish();
                if (onLaunchNewLot) onLaunchNewLot();
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer shadow-xs whitespace-nowrap flex-shrink-0"
            >
              <Sparkles size={16} className="text-slate-950 flex-shrink-0" />
              <span>{t('btnLaunchFirstLot')}</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
