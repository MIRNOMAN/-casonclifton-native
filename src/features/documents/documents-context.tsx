import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { DocumentItem, INITIAL_DOCUMENTS } from './documents-data';

type DocumentsContextValue = {
  documents: DocumentItem[];
  toggleFavorite: (id: string) => void;
};

const DocumentsContext = createContext<DocumentsContextValue | null>(null);

export function DocumentsProvider({ children }: PropsWithChildren) {
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);

  const value = useMemo(
    () => ({
      documents,
      toggleFavorite: (id: string) => {
        setDocuments((currentDocuments) =>
          currentDocuments.map((document) =>
            document.id === id ? { ...document, isFavorite: !document.isFavorite } : document
          )
        );
      },
    }),
    [documents]
  );

  return <DocumentsContext.Provider value={value}>{children}</DocumentsContext.Provider>;
}

export function useDocuments() {
  const context = useContext(DocumentsContext);

  if (!context) {
    throw new Error('useDocuments must be used within a DocumentsProvider');
  }

  return context;
}
