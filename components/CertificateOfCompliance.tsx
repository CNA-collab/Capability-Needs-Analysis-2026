import React, { useMemo } from 'react';
import type { JSX } from 'react'; 
import { XIcon, HomeIcon, PrinterIcon } from './icons';
import { ExportMenu } from './ExportMenu';
import { exportToDocx, ReportData } from '../utils/export';
import { exportOfficialReport } from '../utils/pdfExport';
import { OfficerRecord } from '../types';

interface ReportProps {
    data: OfficerRecord[];
    agencyName: string;
    onClose: () => void;
}

const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
};

const GoldSeal: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`relative shrink-0 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-24 h-24 md:w-28 md:h-28 drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="goldFoil" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style={{ stopColor: '#FFF4CC' }} />
                    <stop offset="60%" style={{ stopColor: '#D4AF37' }} />
                    <stop offset="100%" style={{ stopColor: '#996515' }} />
                </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#goldFoil)" stroke="#8B4513" strokeWidth="0.5" />
            <text x="50" y="52" textAnchor="middle" fill="#5C4033" fontSize="7" fontWeight="900" className="uppercase tracking-[0.2em] font-serif">Official</text>
            <text x="50" y="62" textAnchor="middle" fill="#5C4033" fontSize="9" fontWeight="900" className="uppercase tracking-widest font-serif">Seal</text>
        </svg>
    </div>
);

export const CertificateOfCompliance: React.FC<ReportProps> = ({ data, agencyName, onClose }) => {
    
    const issuanceDateString = useMemo(() => {
        const now = new Date();
        const day = now.getDate();
        const month = now.toLocaleString('en-GB', { month: 'long' });
        const year = now.getFullYear();
        const suffix = getOrdinalSuffix(day);
        return `${day}${suffix} ${month} ${year}`;
    }, []);

    const certificateId = useMemo(() => {
        return `CNA-AUTH-${Math.random().toString(36).substr(2, 6).toUpperCase()}-2026`;
    }, []);

    const handleExport = async (format: string) => {
        if (format === 'pdf' || format === 'print') {
            await exportOfficialReport('certificate-a4-frame', 'Certificate_of_Compliance');
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-100 z-[100] flex flex-col items-center overflow-auto animate-fade-in font-['Inter']">
            
            <header className="w-full flex justify-between items-center p-4 bg-white border-b border-slate-200 shrink-0 no-print sticky top-0 z-[60]">
                <div className="flex items-center gap-6">
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-all rounded-lg hover:bg-slate-100">
                        <HomeIcon className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-slate-900 text-sm font-black uppercase tracking-widest leading-none">Compliance Terminal</h1>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Manual Signatory Mode</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => handleExport('pdf')} className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg">
                        <PrinterIcon className="w-4 h-4" /> Download Printable PDF
                    </button>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-600 transition-all">
                        <XIcon className="w-7 h-7" />
                    </button>
                </div>
            </header>

            <main className="flex-1 w-full flex items-start justify-center p-12 bg-slate-100 print:bg-white print:p-0">
                <div id="certificate-a4-frame" 
                     className="relative bg-white overflow-hidden shadow-2xl" 
                     style={{ width: '1123px', height: '794px', minWidth: '1123px', minHeight: '794px' }}>
                    
                    {/* 1. SECURITY DESIGN: TILED WATERMARKS */}
                    <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-2 p-4 opacity-[0.03] pointer-events-none">
                        {Array.from({ length: 48 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-center">
                                <img src="/Logo/PNG Crest.png" alt="" className="w-12 h-12 grayscale" />
                            </div>
                        ))}
                    </div>

                    {/* 2. SECURITY BORDER: SMALL CRESTS AT EDGES */}
                    <div className="absolute inset-0 border-[20px] border-white z-30 pointer-events-none shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]">
                        {/* Top Edge */}
                        <div className="absolute top-[-14px] left-0 w-full flex justify-around opacity-25 px-8">
                            {Array.from({ length: 15 }).map((_, i) => <img key={i} src="/Logo/PNG Crest.png" className="w-5 h-5 grayscale" alt=""/>)}
                        </div>
                        {/* Bottom Edge */}
                        <div className="absolute bottom-[-14px] left-0 w-full flex justify-around opacity-25 px-8">
                            {Array.from({ length: 15 }).map((_, i) => <img key={i} src="/Logo/PNG Crest.png" className="w-5 h-5 grayscale" alt=""/>)}
                        </div>
                    </div>

                    {/* 3. LARGE CENTRAL WATERMARK */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                        <img src="/Logo/PNG Crest.png" alt="" className="w-[60%] object-contain opacity-[0.04]" />
                    </div>

                    {/* 4. MAIN CONTENT LAYER */}
                    <div className="flex flex-col h-full justify-between items-center p-[25mm] relative z-40 text-center">
                        
                        {/* HEADER SECTION */}
                        <div className="w-full flex flex-col items-center">
                            <img src="/Logo/PNG Crest.png" alt="PNG National Crest" className="w-24 h-24 object-contain mb-4" />
                            <h3 className="font-serif text-slate-800 uppercase tracking-[0.4em] text-[10pt] font-bold">
                                Independent State of Papua New Guinea
                            </h3>
                            <h4 className="font-black text-slate-900 uppercase tracking-[0.15em] text-[12pt] border-b border-slate-200 pb-2">
                                Department of Personnel Management
                            </h4>
                        </div>

                        {/* CORE BODY */}
                        <div className="w-full flex-1 flex flex-col justify-center">
                            <h1 className="font-serif font-black text-slate-900 tracking-tight uppercase border-b-[4px] border-slate-900 pb-3 px-16 mb-8 text-[40pt] inline-block mx-auto">
                                Certificate of Compliance
                            </h1>
                            <p className="font-serif italic text-slate-700 text-[18pt] leading-relaxed max-w-2xl mx-auto mb-10">
                                This strategic credential is formally presented to the Agency for complying with the Capability Needs Analysis (CNA) requirements.
                            </p>
                            <h2 className="text-slate-900 uppercase tracking-tight font-black" style={{ fontSize: '38pt' }}>
                                {agencyName}
                            </h2>
                        </div>

                        {/* MANUAL SIGNATURE SECTION */}
                        <div className="w-full flex flex-col items-center mb-4">
                            <div className="w-80 h-24 flex items-end justify-center mb-2">
                                {/* BLANK SPACE FOR MANUAL PEN SIGNATURE */}
                                <div className="w-full border-b border-slate-400 border-dashed"></div>
                            </div>
                            <p className="font-black text-slate-900 uppercase tracking-[0.2em] text-[12pt]">Ms. Taies Sansan</p>
                            <p className="text-[9pt] text-slate-500 font-bold uppercase tracking-widest">Secretary, Department of Personnel Management</p>
                            <p className="text-[10pt] font-serif italic text-slate-800 mt-6">
                                Issued under my hand this {issuanceDateString}
                            </p>
                        </div>

                        {/* FOOTER STRIPE */}
                        <div className="w-full mt-8 pt-4 border-t border-slate-100 flex justify-between items-end text-[7pt] font-bold text-slate-400 tracking-[0.3em] uppercase">
                            <div>ID: {certificateId}</div>
                            <div className="text-center">National Personnel Matrix Authentication</div>
                            <div>CNA System Validated</div>
                        </div>

                        {/* GOLD SEAL */}
                        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4">
                            <GoldSeal />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};