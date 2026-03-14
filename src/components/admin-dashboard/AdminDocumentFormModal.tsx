import * as DocumentPicker from 'expo-document-picker';
import { Upload, X } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { DocumentCategory } from '@/features/documents/documents-data';
import { AdminSelectField } from './AdminSelectField';
import { AdminDocument, AdminFormMode, AdminFormPayload, AdminTab } from './types';

type AdminDocumentFormModalProps = {
  visible: boolean;
  mode: AdminFormMode;
  defaultTab: AdminTab;
  initialDocument?: AdminDocument;
  onClose: () => void;
  onSubmit: (payload: AdminFormPayload) => void;
};

const CATEGORY_OPTIONS: Array<{ label: string; value: DocumentCategory }> = [
  { label: 'Safety Procedures', value: 'Safety Procedures' },
  { label: 'Technical Manuals', value: 'Technical Manuals' },
];
const VERSION_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'V1', value: 'V1' },
  { label: 'V2', value: 'V2' },
  { label: 'V3', value: 'V3' },
];

export function AdminDocumentFormModal({
  visible,
  mode,
  defaultTab,
  initialDocument,
  onClose,
  onSubmit,
}: AdminDocumentFormModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Safety Procedures');
  const [version, setVersion] = useState('V1');
  const [fileName, setFileName] = useState<string | undefined>();
  const [fileUri, setFileUri] = useState<string | undefined>();

  useEffect(() => {
    if (!visible) return;

    if (mode === 'edit' && initialDocument) {
      setTitle(initialDocument.title);
      setCategory(initialDocument.category);
      setVersion(initialDocument.version || 'V1');
      setFileName(initialDocument.fileName);
      setFileUri(initialDocument.fileUri);
      return;
    }

    setTitle('');
    setCategory('Safety Procedures');
    setVersion('V1');
    setFileName(undefined);
    setFileUri(undefined);
  }, [initialDocument, mode, visible]);

  const heading = useMemo(() => (mode === 'upload' ? 'Upload PDF' : 'Edit Document'), [mode]);
  const actionLabel = useMemo(
    () => (mode === 'upload' ? 'Upload Document' : 'Save Changes'),
    [mode]
  );

  const submitDisabled = useMemo(() => {
    if (!title.trim()) return true;
    if (mode === 'upload' && !fileUri) return true;
    return false;
  }, [fileUri, mode, title]);

  const handlePickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled || result.assets.length === 0) {
        return;
      }

      const [asset] = result.assets;
      setFileName(asset.name || 'document.pdf');
      setFileUri(asset.uri);
    } catch {
      setFileName(undefined);
      setFileUri(undefined);
    }
  };

  const handleSubmit = () => {
    if (submitDisabled) return;

    onSubmit({
      title: title.trim(),
      category,
      version,
      fileName,
      fileUri,
      tab: mode === 'edit' && initialDocument ? initialDocument.tab : defaultTab,
    });
    onClose();
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.heading}>{heading}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <X size={18} color="#FFFFFF" />
            </Pressable>
          </View>

          <Text style={styles.label}>Document Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholder="Enter title.."
            placeholderTextColor="#77849D"
          />

          <Text style={styles.label}>Category</Text>
          <AdminSelectField value={category} options={CATEGORY_OPTIONS} onChange={setCategory} />

          <Text style={styles.label}>Version</Text>
          <AdminSelectField value={version} options={VERSION_OPTIONS} onChange={setVersion} />

          <Text style={styles.label}>PDF File</Text>
          <Pressable style={styles.uploadBox} onPress={handlePickPdf}>
            <Upload size={16} color="#AAB5C9" />
            <Text style={styles.uploadTitle}>Click to upload</Text>
            <Text style={styles.uploadSub}>{fileName ? fileName : 'PDF files up to 20MB'}</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, submitDisabled && styles.actionButtonDisabled]}
            onPress={handleSubmit}>
            <Text style={styles.actionText}>{actionLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#01091BCC',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  container: {
    backgroundColor: '#060F24',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1F2A44',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '700',
  },
  label: {
    color: '#E5EAF5',
    fontSize: 14,
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    height: 44,
    borderRadius: 9,
    backgroundColor: '#172338',
    borderWidth: 1,
    borderColor: '#2A3A53',
    color: '#FFFFFF',
    paddingHorizontal: 12,
    fontSize: 15,
  },
  uploadBox: {
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#2A3A53',
    minHeight: 96,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  uploadTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  uploadSub: {
    color: '#7D8AA4',
    fontSize: 12,
  },
  actionButton: {
    height: 46,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
});
