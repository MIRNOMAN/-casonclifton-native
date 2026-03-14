import { DocumentCategory, DocumentItem } from '@/features/documents/documents-data';

export type AdminTab = 'Documents' | 'NDA';

export type AdminDocument = DocumentItem & {
  tab: AdminTab;
  fileName?: string;
  fileUri?: string;
};

export type AdminFormMode = 'upload' | 'edit';

export type AdminFormPayload = {
  title: string;
  category: DocumentCategory;
  version: string;
  fileName?: string;
  fileUri?: string;
  tab: AdminTab;
};
