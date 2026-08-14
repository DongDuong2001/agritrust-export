import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PitchGuideBar } from './components/PitchGuideBar';
import { Sidebar } from './components/Sidebar';
import { ExporterDashboard } from './components/ExporterDashboard';
import { ShipmentDetail } from './components/ShipmentDetail';
import { CompliancePassport } from './components/CompliancePassport';
import { BuyerPortal } from './components/BuyerPortal';
import { ExporterOnboarding } from './components/ExporterOnboarding';
import { NewShipmentModal } from './components/NewShipmentModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { BatchAutoVerifyModal } from './components/BatchAutoVerifyModal';
import { Toast, ToastMessage } from './components/Toast';
import { INITIAL_SHIPMENTS, BUYER_COMPANIES, INITIAL_AUDIT_LOGS, INITIAL_NOTIFICATIONS } from './data/mockData';
import { CoffeeShipment, ActiveView, NavTab, ExporterProfile, AuditActivityLog, AppNotification } from './types';
import { 
  CheckCircle, 
  FileCheck, 
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [shipments, setShipments] = useState<CoffeeShipment[]>(INITIAL_SHIPMENTS);
  const [activityLogs, setActivityLogs] = useState<AuditActivityLog[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const [isBatchVerifyModalOpen, setIsBatchVerifyModalOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>('VN-EXP-2026-9014');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showPitchGuide, setShowPitchGuide] = useState<boolean>(true);
  const [isNewShipmentModalOpen, setIsNewShipmentModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addToast = (type: 'success' | 'warning' | 'info', title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addLiveAuditLog = (log: Omit<AuditActivityLog, 'id' | 'timestamp' | 'isoTime'>) => {
    const newLog: AuditActivityLog = {
      id: `ACT-LIVE-${Date.now().toString(36)}`,
      timestamp: 'Just now',
      isoTime: new Date().toISOString(),
      ...log
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const handleSelectShipment = (id: string) => {
    setSelectedShipmentId(id);
    setActiveView('shipment-detail');
  };

  const handleRequestDocument = (shipmentId: string, itemName: string) => {
    const ship = shipments.find(s => s.id === shipmentId);
    addLiveAuditLog({
      actionType: 'doc_requested',
      title: `Action Required: Document Requested for ${shipmentId}`,
      titleVi: `Yêu Cầu Hành Động: Đã Gửi Yêu Cầu Bổ Sung Hồ Sơ Cho ${shipmentId}`,
      description: `Dispatched request for ${itemName} to ${ship?.cooperative || 'Cooperative'} via Zalo & AgriTrust Portal.`,
      descriptionVi: `Đã gửi yêu cầu nộp ${itemName} tới ${ship?.cooperative || 'Hợp tác xã'} qua Zalo và Cổng AgriTrust.`,
      shipmentId,
      lotCode: ship?.lotCode,
      cooperative: ship?.cooperative,
      actor: 'Nguyen Van Hai',
      actorRole: 'AgriTrust Exporter Compliance',
      status: 'warning'
    });

    addToast(
      'success',
      'Request sent to cooperative.',
      `Notification dispatched via Zalo & AgriTrust Portal to Buon Ma Thuot Robusta Co-op.`
    );
  };

  const handleSimulateCoopUpload = (shipmentId: string) => {
    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === shipmentId) {
          const updatedChecklist = s.checklist.map((item) =>
            item.status === 'missing'
              ? {
                  ...item,
                  status: 'complete' as const,
                  summary: 'Phytosanitary & Rainforest Alliance Certificate uploaded by Co-op',
                  details: 'NPPO Phytosanitary Seal #VN-NPPO-2026-9014 verified by Buon Ma Thuot Co-op Quality Manager.',
                  evidenceType: 'NPPO Digital Seal & RA Batch Cert',
                  updatedAt: 'Just now (Co-op Live Sync)',
                  referenceCode: 'CERT-RA-2026-BMT-9014',
                }
              : item
          );

          const updatedSignatures = s.signatures.map((sig) =>
            sig.role === 'Cooperative Manager'
              ? {
                  ...sig,
                  status: 'Signed ✓' as const,
                  timestamp: 'Just now (Digitally Signed)',
                  keySignature: '0x99a12...b441 (Co-op PKI Verified)',
                }
              : sig.role === 'AgriTrust Exporter'
              ? {
                  ...sig,
                  status: 'Signed ✓' as const,
                  timestamp: 'Just now (Auditor Verified)',
                  keySignature: '0x8f3a9...e21c (AgriTrust Master Validator)',
                }
              : sig
          );

          return {
            ...s,
            status: 'Verified' as const,
            completenessPercent: 100,
            checklist: updatedChecklist,
            signatures: updatedSignatures,
          };
        }
        return s;
      })
    );

    const ship = shipments.find(s => s.id === shipmentId);
    addLiveAuditLog({
      actionType: 'coop_upload',
      title: `Co-op Upload: NPPO Phytosanitary & RA Certs Uploaded`,
      titleVi: `HTX Tải Lên: Đã Nộp Chứng Nhận KDTV & Rainforest Alliance`,
      description: `Buon Ma Thuot Robusta Co-op Quality Manager uploaded digital cert #VN-NPPO-2026-9014 with cryptographic signature.`,
      descriptionVi: `Giám đốc chất lượng HTX Buôn Ma Thuột đã tải lên chứng nhận #VN-NPPO-2026-9014 với chữ ký mật mã.`,
      shipmentId,
      lotCode: ship?.lotCode,
      cooperative: ship?.cooperative || 'Buon Ma Thuot Robusta Co-op',
      actor: 'Y Krong Nie (Co-op Director)',
      actorRole: 'Cooperative Manager',
      txHash: '0x99a12cf8832a881e19488a0914f66ba981014e21b8441cd883901488102a1492',
      status: 'verified'
    });

    addToast(
      'success',
      'Co-op Upload Simulated!',
      'Certificate verified on ledger. Shipment is now 100% EUDR Compliant!'
    );
  };

  const handleGeneratePassport = (shipmentId: string) => {
    setSelectedShipmentId(shipmentId);
    setActiveView('passport');

    const ship = shipments.find(s => s.id === shipmentId);
    addLiveAuditLog({
      actionType: 'passport_generated',
      title: `EUDR Digital Compliance Passport Generated & Sealed`,
      titleVi: `Hộ Chiếu Tuân Thủ EUDR Kỹ Thuật Số Đã Tạo & Niêm Phong`,
      description: `Immutable cryptographic proof committed to AgriTrust ledger block #4891025 with zero-deforestation certification.`,
      descriptionVi: `Bằng chứng mật mã bất biến đã ghi vào khối #4891025 trên sổ cái AgriTrust kèm xác nhận không phá rừng.`,
      shipmentId,
      lotCode: ship?.lotCode,
      cooperative: ship?.cooperative,
      actor: 'AgriTrust Master Validator',
      actorRole: 'Certified EUDR Auditor',
      txHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
      status: 'verified'
    });

    addToast(
      'info',
      'Compliance Passport Generated',
      `Immutable cryptographic seal recorded on AgriTrust ledger.`
    );
  };

  const handleSendToBuyer = (shipmentId: string) => {
    setShipments((prev) =>
      prev.map((s) => (s.id === shipmentId ? { ...s, status: 'Sent to Buyer' as const } : s))
    );

    const ship = shipments.find((s) => s.id === shipmentId);
    addLiveAuditLog({
      actionType: 'sent_to_buyer',
      title: `Passport Dispatched to ${ship?.targetBuyer || 'EU Buyer'}`,
      titleVi: `Hộ Chiếu Đã Chuyển Tới Nhà Mua ${ship?.targetBuyer || 'EU Buyer'}`,
      description: `Encrypted EUDR Passport link transmitted to ${ship?.targetBuyer || 'EU Buyer'} procurement desk via TRACES-NT gateway.`,
      descriptionVi: `Liên kết mã hóa Hộ chiếu EUDR đã truyền sang phòng thu mua ${ship?.targetBuyer || 'EU Buyer'} qua cổng TRACES-NT.`,
      shipmentId,
      lotCode: ship?.lotCode,
      cooperative: ship?.cooperative,
      actor: 'AgriTrust Dispatcher',
      actorRole: 'Automated Gateway',
      txHash: `0x33b48${Math.random().toString(16).substring(2)}`,
      status: 'verified'
    });

    addToast(
      'success',
      'Passport Sent to Buyer',
      `Cryptographic link transmitted to ${ship?.targetBuyer || 'EU Buyer'} procurement desk.`
    );
  };

  const handleOpenBuyerPortal = (shipmentId?: string) => {
    if (shipmentId) setSelectedShipmentId(shipmentId);
    setActiveView('buyer-portal');
  };

  const handleResetDemo = () => {
    setShipments(INITIAL_SHIPMENTS);
    setActivityLogs(INITIAL_AUDIT_LOGS);
    setSelectedShipmentId('VN-EXP-2026-9014');
    setActiveView('dashboard');
    setCurrentTab('dashboard');
    addToast('info', 'Demo Reset', 'All shipments and audit records reset to initial state.');
  };

  const handleSyncSatellite = () => {
    addLiveAuditLog({
      actionType: 'satellite_audit',
      title: 'Copernicus Sentinel-2 Satellite Multi-Polygon Rescan Completed',
      titleVi: 'Quét Lại Đa Giác Nông Hộ Vệ Tinh Copernicus Sentinel-2 Hoàn Tất',
      description: 'Automated 10m L2A multispectral analysis verified all 6 export cooperatives against Dec 31, 2020 baseline. 0.00% deforestation detected.',
      descriptionVi: 'Phân tích quang phổ đa kênh 10m L2A tự động đã xác minh toàn bộ 6 HTX so với mốc 31/12/2020. Tỷ lệ phá rừng đạt chuẩn 0.00%.',
      shipmentId: 'ALL-ACTIVE-PLOTS',
      actor: 'Copernicus Sentinel-2 Oracle',
      actorRole: 'Automated Earth Observation Engine',
      txHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
      status: 'verified'
    });

    addToast(
      'success',
      'Satellite Sync Complete',
      '142 smallholder plots audited via Sentinel-2 L2A. 0.00% forest canopy loss confirmed.'
    );
  };

  const handleBatchRemindCoops = () => {
    const missing = shipments.filter(s => s.status === 'Missing Documents');
    
    addLiveAuditLog({
      actionType: 'doc_requested',
      title: `Batch Co-op Document Submission Reminders Dispatched (${missing.length} lots)`,
      titleVi: `Đã Gửi Nhắc Nhở Nộp Hồ Sơ Tới Các HTX Còn Thiếu (${missing.length} lô hàng)`,
      description: `Dispatched automated Zalo notifications with secure upload links to ${missing.map(m => m.cooperative).join(', ') || 'cooperatives'}.`,
      descriptionVi: `Đã gửi thông báo Zalo kèm liên kết tải hồ sơ bảo mật tới các HTX: ${missing.map(m => m.cooperative).join(', ') || 'HTX'}.`,
      shipmentId: missing[0]?.id || 'VN-EXP-2026-9014',
      actor: 'AgriTrust Automated Dispatcher',
      actorRole: 'Co-op Notification Bot',
      status: 'warning'
    });

    addToast(
      'info',
      'Batch Co-op Reminders Dispatched',
      `Zalo & SMS notifications sent to ${missing.length || 1} cooperatives with pending certificates.`
    );
  };

  const handleTestTracesGateway = () => {
    addToast(
      'success',
      'TRACES-NT Gateway Active',
      'EU Customs DG ENV API endpoint connected (Brussels Hub • Latency: ~82ms • HTTP 200 OK).'
    );
  };

  const handleExecuteBatchAutoVerify = () => {
    const missingShipments = shipments.filter(s => s.status === 'Missing Documents');
    if (missingShipments.length === 0) {
      addToast('info', 'All Shipments Verified', 'Every export lot in the pipeline is already 100% EUDR compliant.');
      return;
    }

    // 1. Update all missing shipments to 'Verified' with full completed checklists and signatures
    setShipments((prev) =>
      prev.map((s) => {
        if (s.status === 'Missing Documents') {
          const updatedChecklist = s.checklist.map((item) =>
            item.status === 'missing' || item.status === 'in_review'
              ? {
                  ...item,
                  status: 'complete' as const,
                  summary: 'Phytosanitary & Rainforest Alliance Certificate auto-verified via AgriTrust Batch Engine',
                  details: 'NPPO Phytosanitary Seal & RA Batch Cert validated against national database and cryptographically stamped.',
                  evidenceType: 'NPPO Digital Seal & RA Batch Cert (Auto-Verified)',
                  updatedAt: 'Just now (Batch Auto-Verification)',
                  referenceCode: item.referenceCode || `CERT-EUDR-2026-${s.lotCode}`,
                }
              : item
          );

          const updatedSignatures = s.signatures.map((sig) =>
            sig.role === 'Cooperative Manager'
              ? {
                  ...sig,
                  status: 'Signed ✓' as const,
                  timestamp: 'Just now (PKI Stamped)',
                  keySignature: '0x99a12...b441 (Co-op PKI Verified)',
                }
              : sig.role === 'AgriTrust Exporter'
              ? {
                  ...sig,
                  status: 'Signed ✓' as const,
                  timestamp: 'Just now (AgriTrust Master Validator)',
                  keySignature: '0x8f3a9...e21c (Batch Auto-Stamping)',
                }
              : sig
          );

          return {
            ...s,
            status: 'Verified' as const,
            completenessPercent: 100,
            checklist: updatedChecklist,
            signatures: updatedSignatures,
          };
        }
        return s;
      })
    );

    // 2. Generate immutable cryptographic master audit log
    const batchTxHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const missingIds = missingShipments.map(s => s.id).join(', ');

    addLiveAuditLog({
      actionType: 'batch_auto_verify',
      title: `Batch Auto-Verification: ${missingShipments.length} Missing Lots Verified`,
      titleVi: `Thẩm Định Tự Động Hàng Loạt: Đã Phê Duyệt ${missingShipments.length} Lô Hàng`,
      description: `AgriTrust AI Multi-Document Engine & PKI Validator simultaneously resolved missing Phytosanitary & RA credentials for ${missingShipments.length} shipment(s) [${missingIds}]. 100% EUDR Compliant.`,
      descriptionVi: `Công cụ AgriTrust AI & Bộ kiểm thực PKI đã thẩm định đồng thời chứng nhận KDTV & Rainforest Alliance cho ${missingShipments.length} lô hàng [${missingIds}]. Đạt chuẩn EUDR 100%.`,
      shipmentId: missingShipments[0]?.id || 'BATCH-ALL',
      lotCode: missingShipments.map(s => s.lotCode).join(' • '),
      cooperative: 'Multi-Cooperative Central Highlands Network',
      actor: 'AgriTrust Batch Auto-Validator Oracle',
      actorRole: 'Automated EUDR Compliance Engine',
      txHash: batchTxHash,
      status: 'verified'
    });

    // 3. Also add individual verification log entries for each verified lot
    missingShipments.forEach((s) => {
      addLiveAuditLog({
        actionType: 'coop_upload',
        title: `Auto-Verified: ${s.id} Certified Deforestation-Free`,
        titleVi: `Thẩm Định Tự Động: ${s.id} Đạt Chuẩn Không Phá Rừng`,
        description: `NPPO Phytosanitary & RA Certs verified for ${s.cooperative} (${s.province}). Cryptographic seal attached.`,
        descriptionVi: `Chứng chỉ KDTV & RA đã thẩm định cho ${s.cooperative} (${s.province}). Đã gắn niêm phong mật mã.`,
        shipmentId: s.id,
        lotCode: s.lotCode,
        cooperative: s.cooperative,
        actor: 'AgriTrust Master Validator',
        actorRole: 'Certified EUDR Auditor',
        txHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
        status: 'verified'
      });
    });

    // 4. Add notification
    const newNotification: AppNotification = {
      id: `notif-batch-${Date.now()}`,
      source: 'system',
      channel: 'agritrust_cloud',
      title: `Batch Auto-Verification Succeeded (${missingShipments.length} lots)`,
      titleVi: `Thẩm Định Hàng Loạt Thành Công (${missingShipments.length} lô hàng)`,
      message: `All missing documents across ${missingShipments.length} export batches have been authenticated and cryptographically committed to ledger.`,
      messageVi: `Toàn bộ hồ sơ còn thiếu của ${missingShipments.length} lô xuất khẩu đã được chứng thực và ghi vào sổ cái mật mã.`,
      timestamp: 'Just now',
      timeAgo: 'Just now',
      timeAgoVi: 'Vừa xong',
      isRead: false,
      priority: 'normal',
      shipmentId: missingShipments[0]?.id,
      lotCode: missingShipments[0]?.lotCode,
      actionType: 'view_shipment'
    };
    setNotifications(prev => [newNotification, ...prev]);

    // 5. Toast
    addToast(
      'success',
      'Batch Auto-Verification Complete!',
      `Successfully verified ${missingShipments.length} shipment(s). Pipeline is now 100% EUDR Compliant.`
    );
  };

  const handleAddShipment = (newShipment: CoffeeShipment) => {
    setShipments((prev) => [newShipment, ...prev]);
    setSelectedShipmentId(newShipment.id);
    setActiveView('shipment-detail');

    addLiveAuditLog({
      actionType: 'shipment_created',
      title: `New Export Lot Registered: ${newShipment.id}`,
      titleVi: `Đăng Ký Lô Xuất Khẩu Mới: ${newShipment.id}`,
      description: `Registered ${(newShipment.volumeKg / 1000).toFixed(1)} MT from ${newShipment.cooperative} (${newShipment.variety}) with 0.0% deforestation check.`,
      descriptionVi: `Đã khởi tạo lô hàng ${(newShipment.volumeKg / 1000).toFixed(1)} tấn từ ${newShipment.cooperative} (${newShipment.variety}) với kiểm tra phá rừng 0.0%.`,
      shipmentId: newShipment.id,
      lotCode: newShipment.lotCode,
      cooperative: newShipment.cooperative,
      actor: 'Nguyen Van Hai',
      actorRole: 'AgriTrust Exporter Compliance',
      txHash: newShipment.documentHash,
      status: 'verified'
    });

    addToast(
      'success',
      'New Shipment Registered',
      `${newShipment.id} created with 0.0% deforestation check.`
    );
  };

  const handleOpenOnboarding = () => {
    setActiveView('onboarding');
    setCurrentTab('onboarding');
  };

  const handleCompleteOnboarding = (profile: ExporterProfile) => {
    addToast(
      'success',
      'Exporter Profile & EUDR Setup Complete!',
      `${profile.companyName} is fully verified with ${profile.connectedCoops.length} cooperatives & digital PKI key active.`
    );
    setActiveView('dashboard');
    setCurrentTab('dashboard');
  };

  // Notification Center Handlers
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleToggleNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast(
      'info',
      'Đã đánh dấu đã đọc',
      'Toàn bộ thông báo trong hàng đợi đã được cập nhật thành đã đọc.'
    );
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    addToast(
      'info',
      'Đã xóa nhật ký thông báo',
      'Toàn bộ lịch sử thông báo đã được dọn dẹp sạch sẽ.'
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleRestoreDefaultNotifications = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
    addToast(
      'success',
      'Đã khôi phục cảnh báo mẫu',
      'Danh sách thông báo mẫu Zalo OA và Cổng EUDR đã được phục hồi.'
    );
  };

  const handleSimulateZaloAlert = () => {
    const scenarios = [
      {
        name: 'HTX Cà phê Buôn Ma Thuột',
        sender: 'Nguyễn Văn Hùng',
        role: 'Chủ nhiệm HTX',
        lot: 'LOT-BMT-2026-088',
        shipId: 'VN-EXP-2026-9014',
        avatar: 'NVH',
        title: 'Zalo OA: HTX Buôn Ma Thuột uploaded Batch Weighbridge Ticket',
        titleVi: 'Zalo OA: HTX Buôn Ma Thuột vừa tải lên Phiếu cân điện tử lô hàng',
        msg: 'Nguyen Van Hung confirmed 19,200 kg specialty cherry intake completed from 18 registered smallholders.',
        msgVi: 'Nguyễn Văn Hùng xác nhận đã hoàn tất thu mua 19.200 kg quả tươi từ 18 nông hộ liên kết có định vị GPS.',
      },
      {
        name: 'Liên minh Arabica Cầu Đất Lâm Đồng',
        sender: 'Trần Thị Bích',
        role: 'Cán bộ Kỹ thuật HTX',
        lot: 'LOT-LD-2026-112',
        shipId: 'VN-EXP-2026-9015',
        avatar: 'TTB',
        title: 'Zalo Mini App: Lam Dong Arabica Co-op Signed Phytosanitary Form',
        titleVi: 'Zalo Mini App: HTX Lâm Đồng đã ký số Tờ khai Kiểm dịch thực vật',
        msg: 'Digital NPPO phytosanitary compliance certificate stamped with PKI signature.',
        msgVi: 'Chứng thư kiểm dịch thực vật NPPO đã được đóng dấu chứng thực khóa số PKI thành công.',
      },
      {
        name: 'HTX Nông nghiệp Chư Prông Gia Lai',
        sender: 'Ksor Y Đen',
        role: 'Đội trưởng Thu mua',
        lot: 'LOT-GL-2026-045',
        shipId: 'VN-EXP-2026-9016',
        avatar: 'KYD',
        title: 'Zalo OA: Gia Lai Co-op Updated 12 Farm GIS Polygon Coordinates',
        titleVi: 'Zalo OA: HTX Gia Lai cập nhật 12 tọa độ đa giác GIS nông hộ',
        msg: 'Field agronomist verified farm boundaries against Sentinel-2 2020 forest baseline cutoff.',
        msgVi: 'Cán bộ hiện trường đã đối soát ranh giới vườn cây với mốc rừng vệ tinh Sentinel-2 năm 2020.',
      },
    ];

    const pick = scenarios[Math.floor(Math.random() * scenarios.length)];
    const now = new Date();
    const timeStr = `${now.toLocaleDateString('vi-VN')} ${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ICT`;

    const newNotif: AppNotification = {
      id: `NOTIF-ZALO-${Date.now().toString(36)}`,
      source: 'zalo',
      channel: 'zalo_oa',
      title: pick.title,
      titleVi: pick.titleVi,
      message: pick.msg,
      messageVi: pick.msgVi,
      timestamp: timeStr,
      timeAgo: 'Just now',
      timeAgoVi: 'Vừa xong',
      isRead: false,
      priority: 'urgent',
      shipmentId: pick.shipId,
      lotCode: pick.lot,
      sender: {
        name: pick.sender,
        role: pick.role,
        organization: pick.name,
        avatarText: pick.avatar,
      },
      actionType: 'view_shipment',
    };

    setNotifications((prev) => [newNotif, ...prev]);
    addToast(
      'info',
      `💬 Zalo: ${pick.sender} (${pick.name})`,
      pick.msgVi
    );
  };

  const selectedShipment =
    shipments.find((s) => s.id === selectedShipmentId) || shipments[0];

  const missingCount = shipments.filter((s) => s.status === 'Missing Documents').length;
  const verifiedCount = shipments.filter((s) => s.status === 'Verified' || s.status === 'Sent to Buyer').length;
  const totalVolumeKg = shipments.reduce((acc, s) => acc + s.volumeKg, 0);
  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className={`h-screen max-h-screen flex flex-col font-sans overflow-hidden transition-colors duration-200 ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#f9f9fc] text-[#1a1c1e]'
    }`}>
      
      {/* Top Navigation Bar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onResetDemo={handleResetDemo}
        showPitchGuide={showPitchGuide}
        setShowPitchGuide={setShowPitchGuide}
        onOpenNewShipmentModal={() => setIsNewShipmentModalOpen(true)}
        onOpenNotificationCenter={() => setIsNotificationCenterOpen(true)}
        unreadNotificationsCount={unreadNotifCount}
      />

      {/* Presenter Pitch Narrative Helper Bar */}
      {showPitchGuide && (
        <PitchGuideBar
          activeView={activeView}
          selectedShipmentId={selectedShipmentId}
          onSelectShipment={handleSelectShipment}
          onOpenPassport={handleGeneratePassport}
          onOpenBuyerPortal={() => setActiveView('buyer-portal')}
          onOpenOnboarding={handleOpenOnboarding}
          onBatchAutoVerify={() => setIsBatchVerifyModalOpen(true)}
          onClose={() => setShowPitchGuide(false)}
          darkMode={darkMode}
        />
      )}

      {/* Main App Layout */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* Sidebar (shown only when in exporter view modes) */}
        {activeView !== 'buyer-portal' && (
          <Sidebar
            currentTab={currentTab}
            setCurrentTab={(tab) => {
              setCurrentTab(tab);
              if (tab === 'onboarding') {
                setActiveView('onboarding');
              } else if (activeView === 'onboarding') {
                setActiveView('dashboard');
              }
            }}
            missingCount={missingCount}
            verifiedCount={verifiedCount}
            totalVolumeKg={totalVolumeKg}
            darkMode={darkMode}
            onNavigateToDashboard={() => setActiveView('dashboard')}
            onOpenOnboarding={handleOpenOnboarding}
          />
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          
          {/* 0. Exporter Onboarding View */}
          {activeView === 'onboarding' && (
            <ExporterOnboarding
              onComplete={handleCompleteOnboarding}
              onLaunchNewLot={() => {
                setActiveView('dashboard');
                setCurrentTab('dashboard');
                setIsNewShipmentModalOpen(true);
              }}
              onBackToDashboard={() => {
                setActiveView('dashboard');
                setCurrentTab('dashboard');
              }}
              darkMode={darkMode}
            />
          )}

          {/* 1. Exporter Dashboard */}
          {activeView === 'dashboard' && currentTab === 'dashboard' && (
            <ExporterDashboard
              shipments={shipments}
              activityLogs={activityLogs}
              onSelectShipment={handleSelectShipment}
              onOpenNewShipmentModal={() => setIsNewShipmentModalOpen(true)}
              onOpenOnboarding={handleOpenOnboarding}
              onSyncSatellite={handleSyncSatellite}
              onBatchRemindCoops={handleBatchRemindCoops}
              onTestTracesGateway={handleTestTracesGateway}
              onBatchAutoVerify={() => setIsBatchVerifyModalOpen(true)}
              darkMode={darkMode}
            />
          )}

          {/* 2 & 3. Shipment Detail View (Missing Docs / Verified cases) */}
          {activeView === 'shipment-detail' && (
            <ShipmentDetail
              shipment={selectedShipment}
              onBack={() => setActiveView('dashboard')}
              onRequestDocument={handleRequestDocument}
              onSimulateCoopUpload={handleSimulateCoopUpload}
              onGeneratePassport={handleGeneratePassport}
              darkMode={darkMode}
            />
          )}

          {/* 4. Compliance Passport Screen */}
          {activeView === 'passport' && (
            <CompliancePassport
              shipment={selectedShipment}
              onBack={() => setActiveView('shipment-detail')}
              onSendToBuyer={handleSendToBuyer}
              onOpenBuyerPortal={handleOpenBuyerPortal}
              darkMode={darkMode}
            />
          )}

          {/* 5. EU Buyer Portal */}
          {activeView === 'buyer-portal' && (
            <BuyerPortal
              shipments={shipments}
              initialShipmentId={selectedShipmentId}
              onReturnToExporter={() => setActiveView('dashboard')}
              darkMode={darkMode}
            />
          )}

          {/* Supplementary Tabs for realism (Shipments tab / Compliance Documents tab / EU Buyers tab / Settings) */}
          {activeView === 'dashboard' && currentTab === 'shipments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    All Export Shipments & Lots
                  </h1>
                  <p className="text-sm text-slate-500">
                    Filter by cooperative, harvest season, and destination port
                  </p>
                </div>
                <button
                  onClick={() => setIsNewShipmentModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-sm font-bold"
                >
                  + New Lot
                </button>
              </div>

              <ExporterDashboard
                shipments={shipments}
                onSelectShipment={handleSelectShipment}
                onOpenNewShipmentModal={() => setIsNewShipmentModalOpen(true)}
                darkMode={darkMode}
              />
            </div>
          )}

          {activeView === 'dashboard' && currentTab === 'compliance' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  EUDR Compliance Documents Repository
                </h1>
                <p className="text-sm text-slate-500">
                  Regulation (EU) 2023/1115 statutory evidentiary packages & satellite polygons
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
                    <CheckCircle size={20} className="flex-shrink-0" />
                    <span>Sentinel-2 Satellite Forest Baseline Records</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Copernicus satellite polygon shapefiles for 76 registered smallholder coffee farm plots across Dak Lak, Lam Dong, Gia Lai, and Son La.
                  </p>
                  <div className="text-xs font-mono text-slate-500">
                    Cutoff verification: Dec 31, 2020 • Deforestation Risk: 0.0%
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold">
                    <FileCheck size={20} className="flex-shrink-0" />
                    <span>Vinacontrol Laboratory Audits & MRL Reports</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    ISO/IEC 17025 accredited laboratory assays covering pesticide residue, ochratoxin A, moisture stabilization, and screen sizing.
                  </p>
                  <div className="text-xs font-mono text-slate-500">
                    Eurofins / Vinacontrol Double Certified
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between text-xs sm:text-sm">
                <span className="font-bold text-emerald-900 dark:text-emerald-300">
                  Ready to inspect a live shipment?
                </span>
                <button
                  onClick={() => {
                    setCurrentTab('dashboard');
                    handleSelectShipment('VN-EXP-2026-9014');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold cursor-pointer whitespace-nowrap flex-shrink-0"
                >
                  Inspect VN-EXP-2026-9014
                </button>
              </div>
            </div>
          )}

          {activeView === 'dashboard' && currentTab === 'buyers' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Active EU Buyers & Importer Profiles
                </h1>
                <p className="text-sm text-slate-500">
                  Direct cryptographic integration with European green coffee procurement desks
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {BUYER_COMPANIES.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                        {b.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                        {b.country}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 space-y-1">
                      <div><span className="font-semibold text-slate-700 dark:text-slate-300">Destination:</span> {b.port}</div>
                      <div><span className="font-semibold text-slate-700 dark:text-slate-300">Key Contact:</span> {b.buyerContact}</div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-xs text-emerald-600 font-bold">API Verified</span>
                      <button
                        onClick={() => setActiveView('buyer-portal')}
                        className="text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap flex-shrink-0"
                      >
                        <span>View Portal</span>
                        <ArrowRight size={12} className="flex-shrink-0" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'dashboard' && currentTab === 'settings' && (
            <div className="max-w-2xl space-y-6 animate-in fade-in duration-150">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  AgriTrust Platform Settings
                </h1>
                <p className="text-sm text-slate-500">
                  EUDR compliance configuration, API keys, and notification channels
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4 text-xs sm:text-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Copernicus Sentinel-2 Satellite Sync</div>
                    <div className="text-xs text-slate-500">Automatic polygon deforestation overlay checks</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    Active (Daily)
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Zalo / SMS Co-op Dispatch Channel</div>
                    <div className="text-xs text-slate-500">Instant notification for missing certificates</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    Connected
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">AgriTrust Decentralized Ledger</div>
                    <div className="text-xs text-slate-500">EVM Merkle Tree root stamping for export passports</div>
                  </div>
                  <span className="font-mono text-xs text-teal-600 font-bold">
                    Block #4891024
                  </span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* New Shipment Modal */}
      <NewShipmentModal
        isOpen={isNewShipmentModalOpen}
        onClose={() => setIsNewShipmentModalOpen(false)}
        onAddShipment={handleAddShipment}
        darkMode={darkMode}
      />

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onToggleReadStatus={handleToggleNotificationRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onClearLog={handleClearNotifications}
        onDeleteNotification={handleDeleteNotification}
        onRestoreDefaultNotifications={handleRestoreDefaultNotifications}
        onSimulateZaloAlert={handleSimulateZaloAlert}
        onSelectShipment={handleSelectShipment}
        onViewPassport={handleGeneratePassport}
        darkMode={darkMode}
      />

      {/* Batch Auto-Verify Simulation Modal */}
      <BatchAutoVerifyModal
        isOpen={isBatchVerifyModalOpen}
        onClose={() => setIsBatchVerifyModalOpen(false)}
        shipments={shipments}
        onConfirmBatchVerify={handleExecuteBatchAutoVerify}
        onSelectShipment={handleSelectShipment}
        darkMode={darkMode}
      />

      {/* Floating Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}
