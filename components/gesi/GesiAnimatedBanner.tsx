import React from 'react';

export const GesiAnimatedBanner: React.FC = () => {
    return (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-8">
            <div className="max-w-[1400px] mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-black uppercase tracking-wider">
                            Gender Equity & Social Inclusion
                        </h2>
                        <p className="text-sm opacity-90">
                            Building inclusive workplaces for sustainable development
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold uppercase tracking-wider">
                            National Public Service
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
