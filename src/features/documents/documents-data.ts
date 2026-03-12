export type DocumentCategory = 'Safety Procedures' | 'Technical Manuals';

export type DocumentSection = {
  title: string;
  body: string;
  bullets?: string[];
};

export type DocumentItem = {
  id: string;
  title: string;
  category: DocumentCategory;
  updatedAt: string;
  pages: number;
  isFavorite: boolean;
  version: string;
  effectiveDate: string;
  preparedBy: string;
  sections: DocumentSection[];
};

export const DOCUMENT_CATEGORIES = ['All', 'Safety Procedures', 'Technical Manuals'] as const;

export type DocumentCategoryFilter = (typeof DOCUMENT_CATEGORIES)[number];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'field-safety-protocol',
    title: 'Field Safety Protocol v3.2',
    category: 'Safety Procedures',
    updatedAt: '2 hours ago',
    pages: 24,
    isFavorite: false,
    version: '1.0',
    effectiveDate: '12/05/2026',
    preparedBy: 'google',
    sections: [
      {
        title: '1. Purpose',
        body: 'The purpose of this Field Safety Protocol is to ensure the safety of all personnel working in the field. This document outlines the required safety procedures, responsibilities, and guidelines to minimize risks and prevent accidents during field operations.',
      },
      {
        title: '2. Scope',
        body: 'This protocol applies to all employees, contractors, and personnel who access or work at field locations. All individuals must follow these safety procedures before, during, and after performing field tasks.',
      },
      {
        title: '3. General Safety Rules',
        body: 'All field personnel must follow these general safety rules:',
        bullets: [
          'Always follow company safety policies and procedures.',
          'Be aware of surroundings and potential hazards.',
          'Never perform tasks you are not trained for.',
          'Report any unsafe condition immediately to a supervisor.',
          'Follow all posted warning signs and safety instructions.',
        ],
      },
      {
        title: '4. Personal Protective Equipment (PPE)',
        body: 'Appropriate PPE must be worn at all times while on site, including helmets, safety boots, eye protection, and gloves where applicable.',
      },
    ],
  },
  {
    id: 'equipment-calibration-manual',
    title: 'Equipment Calibration Manual',
    category: 'Technical Manuals',
    updatedAt: '3 days ago',
    pages: 24,
    isFavorite: true,
    version: '2.1',
    effectiveDate: '09/16/2026',
    preparedBy: 'crestcon',
    sections: [
      {
        title: '1. Overview',
        body: 'This manual describes the calibration workflow, quality checkpoints, and sign-off requirements for operational measuring equipment.',
      },
      {
        title: '2. Calibration Interval',
        body: 'All critical devices must be calibrated according to the maintenance matrix and before redeployment to field staff.',
      },
      {
        title: '3. Validation',
        body: 'Validation readings must be recorded and signed by the responsible technician after each calibration cycle.',
      },
    ],
  },
  {
    id: 'incident-response-guide',
    title: 'Incident Response Guide',
    category: 'Safety Procedures',
    updatedAt: '5 days ago',
    pages: 18,
    isFavorite: false,
    version: '1.3',
    effectiveDate: '07/28/2026',
    preparedBy: 'safety team',
    sections: [
      {
        title: '1. Incident Prioritization',
        body: 'All reported incidents must be classified according to severity, affected area, and response urgency.',
      },
      {
        title: '2. Escalation Steps',
        body: 'Escalation must follow the incident chain of command, with immediate response for personnel safety or environmental impact.',
      },
      {
        title: '3. Post-Incident Review',
        body: 'A documented post-incident review is mandatory after resolution to identify root cause and preventive actions.',
      },
    ],
  },
];

export const getDocumentById = (id: string) =>
  INITIAL_DOCUMENTS.find((document) => document.id === id);
