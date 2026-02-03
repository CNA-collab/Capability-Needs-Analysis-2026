import React from 'react';

interface ReportProps {
    agencyName: string;
    onClose: () => void;
    data?: unknown; 
}

export const CertificateOfCompliance: React.FC<ReportProps> = ({ agencyName, onClose }) => {
    const issueDate = "10th January 2026";
    const certId = "JTH-T81BPA-2026";     

    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm overflow-auto flex justify-center p-10 z-[200] print:p-0">
            
            {/* UI Controls */}
            <div className="absolute top-5 right-5 flex gap-4 no-print">
                <button 
                    onClick={() => globalThis.print()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg"
                >
                    Download / Print
                </button>
                <button 
                    onClick={onClose}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg"
                >
                    ✕
                </button>
            </div>

            {/* A4 LANDSCAPE CANVAS */}
            <div 
                id="certificate-to-download" 
                className="relative bg-white shadow-2xl flex flex-col items-center justify-between p-16 text-center"
                style={{ 
                    width: '1123px', 
                    height: '794px', 
                    minWidth: '1123px', 
                    minHeight: '794px',
                    border: '16px double #e2e8f0'
                }}
            >
                {/* SECURITY WATERMARK LAYER 
                    FIX: Replaced index key with a unique ID string to satisfy rule S6479
                */}
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-5 opacity-[0.04] pointer-events-none p-10">
                    {Array.from({ length: 40 }).map((_, i) => (
                        <div 
                            key={`watermark-${certId}-${i}`} 
                            className="flex items-center justify-center"
                        >
                            <img src="/Logo/PNG Crest.png" className="w-16 h-16 grayscale" alt="" />
                        </div>
                    ))}
                </div>

                {/* OFFICIAL HEADER */}
                <div className="relative z-10 w-full">
                    <img src="/Logo/PNG Crest.png" alt="Crest" className="w-24 h-24 mx-auto mb-4" />
                    <h3 className="text-slate-800 uppercase tracking-[0.4em] text-xs font-bold">
                        Independent State of Papua New Guinea
  </h3>
                    <h4 className="text-slate-900 uppercase tracking-[0.2em] text-base font-black mt-2">
                        Department of Personnel Management
                    </h4>
                </div>

                {/* CERTIFICATE BODY */}
                <div className="relative z-10 w-full">
                    <div className="h-1 w-24 bg-slate-900 mx-auto mb-8"></div>
                    <h1 className="text-[52pt] font-black text-slate-900 uppercase tracking-tight leading-none">
                        Certificate
                    </h1>
                    <h2 className="text-[28pt] font-light text-slate-600 uppercase tracking-[0.4em] mb-8">
                        Of Compliance
                    </h2>
                    <p className="text-[17pt] font-serif italic text-slate-500 max-w-3xl mx-auto leading-relaxed">
                        This strategic credential is formally presented to the Agency <br/>
                        for complying with the Capability Needs Analysis (CNA) requirements.
                    </p>
                </div>

                {/* AGENCY NAME */}
                <div className="relative z-10 w-full">
                    <h2 className="text-[40pt] font-black text-slate-900 uppercase">
                        {agencyName || "RECIPIENT AGENCY"}
                    </h2>
                </div>

                {/* SIGNATORY & AUTHENTICATION */}
                <div className="relative z-10 w-full flex justify-between items-end px-12">
                    <div className="text-left">
                        <p className="text-[9pt] font-mono text-slate-400 uppercase tracking-widest">
                            Validation ID: {certId}
                        </p>
                        <p className="text-[11pt] font-bold text-slate-800">
                            Issued: {issueDate}
                        </p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="w-72 border-b-2 border-slate-900 mb-3"></div>
                        <p className="text-md font-black text-slate-900 uppercase tracking-wider">
                            Ms. Taies Sansan
                        </p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">
                            Secretary, Department of Personnel Management
                        </p>
                    </div>
                </div>

                {/* SYSTEM VALIDATION FOOTER */}
                <div className="relative z-10 w-full pt-4 flex justify-between text-[8pt] font-black text-slate-300 uppercase tracking-[0.3em] border-t border-slate-50">
                    <span>National Personnel Matrix Authentication</span>
                    <span>CNA System Validated</span>
                </div>
            </div>
        </div>
    );
};
