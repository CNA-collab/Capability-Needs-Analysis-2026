import React, { useState, useRef, useEffect } from 'react';
import { 
    DocumentIcon, 
    TableCellsIcon, 
    ClipboardIcon, 
    PrinterIcon, 
    ChevronDownIcon,
    ArrowDownTrayIcon 
} from './icons';

interface ExportMenuProps {
    onExport: (format: 'pdf' | 'docx' | 'xlsx' | 'csv' | 'sheets' | 'json' | 'print') => void;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ onExport }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExport = (format: 'pdf' | 'docx' | 'xlsx' | 'csv' | 'sheets' | 'json' | 'print') => {
        setIsOpen(false);
        
        // Add a tiny delay to ensure the menu is fully closed before capture
        // This prevents the menu itself from appearing in the PDF/Screenshot
        setTimeout(() => {
            onExport(format);
        }, 100);
    };

    return (
        <div className="relative inline-block text-left no-print" ref={menuRef}>
            <div>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex items-center justify-center w-full rounded-xl border-2 border-slate-200 shadow-sm px-6 py-2.5 bg-white text-sm font-black text-slate-700 hover:bg-slate-50 hover:border-slate-900 transition-all focus:outline-none uppercase tracking-widest"
                >
                    <ArrowDownTrayIcon className="mr-2 h-4 w-4 text-slate-900" />
                    Export Options
                    <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5 opacity-40" />
                </button>
            </div>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-3 w-64 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] bg-white ring-1 ring-black ring-opacity-5 z-[300] overflow-hidden border border-slate-100">
                    <div className="py-2" role="menu">
                        {/* 1. HIGH FIDELITY SECTION */}
                        <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                            Visual Reports (Exact Look)
                        </div>
                        <button 
                            onClick={() => handleExport('pdf')} 
                            className="w-full group flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-900 hover:text-white transition-colors"
                        >
                            <DocumentIcon className="mr-3 h-5 w-5 text-red-500 group-hover:text-white" /> 
                            <span className="font-bold">Official PDF (.pdf)</span>
                        </button>
                        
                        <button 
                            onClick={() => handleExport('print')} 
                            className="w-full group flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-900 hover:text-white transition-colors"
                        >
                            <PrinterIcon className="mr-3 h-5 w-5 text-slate-500 group-hover:text-white" /> 
                            <span className="font-bold">Direct Print / Save</span>
                        </button>

                        <div className="border-t border-slate-100 my-1"></div>

                        {/* 2. DATA SECTION */}
                        <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                            Data Analysis
                        </div>
                        <button 
                            onClick={() => handleExport('xlsx')} 
                            className="w-full group flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-900 hover:text-white transition-colors"
                        >
                            <TableCellsIcon className="mr-3 h-5 w-5 text-green-600 group-hover:text-white" /> 
                            <span className="font-bold">Excel Workbook (.xlsx)</span>
                        </button>
                        
                        <button 
                            onClick={() => handleExport('csv')} 
                            className="w-full group flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-900 hover:text-white transition-colors"
                        >
                            <DocumentIcon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-white" /> 
                            <span className="font-bold">Comma Separated (.csv)</span>
                        </button>

                        <div className="border-t border-slate-100 my-1"></div>

                        {/* 3. SYSTEM SECTION */}
                        <button 
                            onClick={() => handleExport('json')} 
                            className="w-full group flex items-center px-4 py-3 text-xs text-slate-400 hover:bg-slate-50 transition-colors"
                        >
                            <ClipboardIcon className="mr-3 h-4 w-4" /> 
                            Raw System Data (JSON)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};