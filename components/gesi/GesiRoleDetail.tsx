import React from 'react';
import { XIcon } from '../icons';

type Role = 'Secretary' | 'Executive' | 'HR' | 'Officer' | 'Focal Point';

interface RoleDetails {
    duties: string[];
    examples: string[];
}

const ROLE_DETAILS: Record<Role, RoleDetails> = {
    'Secretary': {
        duties: [
            'Provide overall leadership and oversight for GESI implementation',
            'Ensure GESI considerations are integrated into departmental policies and plans',
            'Allocate resources for GESI initiatives',
            'Monitor progress and report on GESI achievements'
        ],
        examples: [
            'Review departmental policies for GESI compliance',
            'Chair GESI working groups or committees',
            'Support capacity building for staff on GESI issues'
        ]
    },
    'Executive': {
        duties: [
            'Promote GESI principles in decision-making processes',
            'Ensure equitable resource allocation across gender and social groups',
            'Support the development of inclusive workplace policies',
            'Monitor and evaluate GESI outcomes in their areas of responsibility'
        ],
        examples: [
            'Include GESI criteria in performance evaluations',
            'Advocate for diverse representation in leadership positions',
            'Implement flexible work arrangements to support work-life balance'
        ]
    },
    'HR': {
        duties: [
            'Develop and implement GESI-sensitive HR policies and procedures',
            'Ensure fair recruitment, promotion, and retention practices',
            'Provide training on GESI awareness and unconscious bias',
            'Monitor workplace diversity and inclusion metrics'
        ],
        examples: [
            'Conduct GESI training sessions for all staff',
            'Review job descriptions for gender-neutral language',
            'Establish mentorship programs for underrepresented groups'
        ]
    },
    'Officer': {
        duties: [
            'Apply GESI principles in daily work activities',
            'Treat all colleagues and stakeholders with respect and equity',
            'Report any instances of discrimination or harassment',
            'Participate in GESI awareness and capacity building activities'
        ],
        examples: [
            'Use inclusive language in communications',
            'Support colleagues from diverse backgrounds',
            'Contribute to creating an inclusive work environment'
        ]
    },
    'Focal Point': {
        duties: [
            'Serve as the primary contact for GESI-related matters',
            'Coordinate GESI activities and initiatives',
            'Provide guidance and support to colleagues on GESI issues',
            'Collect and analyze data on GESI implementation'
        ],
        examples: [
            'Organize GESI awareness campaigns',
            'Facilitate GESI training workshops',
            'Prepare reports on GESI progress and challenges'
        ]
    }
};

interface GesiRoleDetailProps {
    role: Role;
    onClose: () => void;
}

export const GesiRoleDetail: React.FC<GesiRoleDetailProps> = ({ role, onClose }) => {
    const details = ROLE_DETAILS[role];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                        {role} Responsibilities
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        aria-label="Close"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                            Key Duties & Responsibilities
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                            {details.duties.map((duty, index) => (
                                <li key={index}>{duty}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                            Practical Examples
                        </h4>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                            {details.examples.map((example, index) => (
                                <li key={index}>{example}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
