import React from 'react';
import { QrCode, Trees, ShieldCheck, Check, MapPin, Scale } from 'lucide-react';
import { CoffeeShipment } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ThermalLabelPrintViewProps {
  shipment: CoffeeShipment;
  isHighContrast?: boolean;
}

export const ThermalLabelPrintView: React.FC<ThermalLabelPrintViewProps> = ({
  shipment,
  isHighContrast = true
}) => {
  const { language } = useLanguage();

  return (
    <div className="print-thermal-target bg-white text-black mx-auto w-[384px] min-h-[576px] p-4 shadow-xl border-2 border-black font-mono select-text flex flex-col justify-between">
      
      {/* Label Top Bar: Header & Regulatory Stamp */}
      <div>
        <div className="border-b-2 border-black pb-2 flex items-center justify-between">
          <div>
            <div className="text-[14px] font-black tracking-tighter uppercase font-sans">
              VIETNAM GREEN COFFEE
            </div>
            <div className="text-[9px] font-bold tracking-tight">
              EU REGULATION 2023/1115 COMPLIANT
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block px-1.5 py-0.5 bg-black text-white text-[9px] font-black tracking-wider">
              EUDR-PASSPORT
            </span>
          </div>
        </div>

        {/* Big Lot Identifier & Barcode */}
        <div className="my-2.5 text-center bg-black text-white p-2">
          <div className="text-[10px] uppercase font-bold tracking-widest text-slate-200">
            EXPORT LOT IDENTIFIER
          </div>
          <div className="text-xl font-black tracking-tight font-sans">
            {shipment.id}
          </div>
          <div className="text-[11px] font-mono tracking-widest text-slate-200">
            *{shipment.lotCode}*
          </div>
        </div>

        {/* Barcode Strip Graphic (CSS Bars) */}
        <div className="flex flex-col items-center my-2">
          <div className="flex items-center justify-center gap-[2px] h-8 w-full px-2 overflow-hidden">
            {[4,2,3,1,5,2,1,4,3,2,1,5,3,2,4,1,2,4,3,1,2,5,3,1,4,2,3,1,4,2,5,1,3,2,4,1,3,2,4,1,5,2,3,1].map((w, i) => (
              <div 
                key={i} 
                className="bg-black h-full" 
                style={{ width: `${w * 1.5}px` }} 
              />
            ))}
          </div>
          <span className="text-[8px] tracking-widest mt-0.5 font-bold">
            {shipment.eudrReference}
          </span>
        </div>

        {/* Granular Commodity & Origin Breakdown */}
        <div className="border-2 border-black divide-y-2 divide-black text-[10px] my-2 font-sans font-bold">
          <div className="p-1.5 flex justify-between bg-slate-50">
            <span className="uppercase text-slate-600">COOPERATIVE:</span>
            <span className="text-right font-black">{shipment.cooperative}</span>
          </div>

          <div className="p-1.5 flex justify-between">
            <span className="uppercase text-slate-600">PROVINCE / ALT:</span>
            <span className="text-right">{shipment.province} • {shipment.elevationMeters}M</span>
          </div>

          <div className="p-1.5 flex justify-between bg-slate-50">
            <span className="uppercase text-slate-600">VARIETY / GRADE:</span>
            <span className="text-right font-black">{shipment.variety}</span>
          </div>

          <div className="p-1.5 flex justify-between">
            <span className="uppercase text-slate-600">NET MASS / BAGS:</span>
            <span className="text-right font-black text-sm">
              {shipment.volumeKg.toLocaleString()} KG ({shipment.bagsCount} BAGS)
            </span>
          </div>

          <div className="p-1.5 flex justify-between bg-slate-50">
            <span className="uppercase text-slate-600">TARGET BUYER:</span>
            <span className="text-right truncate max-w-[200px]">{shipment.targetBuyer}</span>
          </div>
        </div>

        {/* GPS Coordinates & Satellite Check */}
        <div className="p-1.5 border border-black text-[9px] space-y-1 mb-2 bg-white">
          <div className="flex justify-between font-mono">
            <span className="font-bold">GPS POLYGON:</span>
            <span className="font-bold">{shipment.gpsCoordinates}</span>
          </div>
          <div className="flex justify-between font-mono">
            <span>RAINFOREST ALLIANCE:</span>
            <span className="font-bold">{shipment.rainforestAllianceNumber}</span>
          </div>
          <div className="flex justify-between text-black font-bold">
            <span>DEFORESTATION LOSS (2020 BASELINE):</span>
            <span className="bg-black text-white px-1">0.00% PASS</span>
          </div>
        </div>
      </div>

      {/* Label Bottom: 2D QR Code & Cryptographic Merkle Root */}
      <div>
        <div className="border-t-2 border-black pt-2 flex items-center justify-between gap-2">
          {/* QR Code */}
          <div className="w-18 h-18 border-2 border-black p-1 flex items-center justify-center flex-shrink-0 bg-white">
            <QrCode className="w-14 h-14 text-black" />
          </div>

          {/* Cryptographic hash and customs notice */}
          <div className="text-[8px] leading-tight space-y-1 flex-1 font-mono">
            <div className="font-bold uppercase tracking-tight">
              EVM LEDGER ROOT HASH:
            </div>
            <div className="break-all font-bold p-1 bg-slate-100 border border-slate-300 text-[7.5px]">
              {shipment.documentHash}
            </div>
            <div className="text-[7.5px] font-sans font-bold flex items-center justify-between text-slate-700">
              <span>SCAN FOR CUSTOMS CLEARANCE</span>
              <span>BLOCK #{shipment.blockNumber}</span>
            </div>
          </div>
        </div>

        {/* Bag Label Footer Warning */}
        <div className="mt-2 text-center text-[8px] font-black uppercase tracking-wider bg-black text-white py-1">
          ★ DO NOT DETACH FROM JUTE SACK UNTIL FINAL EU DESTINATION ★
        </div>
      </div>

    </div>
  );
};
