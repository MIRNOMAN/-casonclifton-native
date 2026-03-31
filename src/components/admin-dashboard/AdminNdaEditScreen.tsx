import { HomeHeader } from '@/components/documents/HomeHeader';
import { useGetDocumentNdaQuery, useUpdateDocumentNdaMutation } from '@/redux/api/documentsApi';
import {
  CoreBridge,
  DEFAULT_TOOLBAR_ITEMS,
  RichText,
  Toolbar,
  ten,
  useEditorBridge,
  useKeyboard,
} from '@10play/tentap-editor';
import { router } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function AdminNdaEditScreen() {
  const { data: ndaData, isLoading: isFetching } = useGetDocumentNdaQuery();
  const [updateDocumentNda, { isLoading: isSaving }] = useUpdateDocumentNdaMutation();

  const [title, setTitle] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { isKeyboardUp } = useKeyboard();

  // ── Editor bridge ─────────────────────────────────────────────
  const editor = useEditorBridge({
    autofocus: false,
    avoidIosKeyboard: true,
    initialContent: '',
    bridgeExtensions: [
      ...ten,
      CoreBridge.configureCSS(`
        * { font-family: -apple-system, sans-serif; }
        body {
          background-color: #111E34;
          color: #E3E8F1;
          font-size: 15px;
          line-height: 1.7;
          padding: 8px 4px;
          caret-color: #12D7CC;
        }
        h1, h2, h3 { color: #FFFFFF; }
        p { margin: 4px 0; }
        ul, ol { padding-left: 20px; }
        li { margin: 2px 0; }
        a { color: #12D7CC; }
        ::selection { background: rgba(18,215,204,0.25); }
        .ProseMirror:focus { outline: none; }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: 'Write NDA content here…';
          float: left;
          color: #4A5568;
          pointer-events: none;
          height: 0;
        }
      `),
    ],
  });

  // ── Load NDA from API ─────────────────────────────────────────
  useEffect(() => {
    if (ndaData?.data) {
      setTitle(ndaData.data.title ?? '');
      const content: string = ndaData.data.content ?? '';
      const html = content.startsWith('<')
        ? content
        : `<p>${content.replace(/\n/g, '</p><p>')}</p>`;
      editor.setContent(html);
    }
  }, [ndaData]);

  // ── Save ──────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      const html = await editor.getHTML();
      await updateDocumentNda({ title, content: html }).unwrap();
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        router.back();
      }, 900);
    } catch (err) {
      console.error('NDA update failed:', err);
    }
  };

  // ── Loading ───────────────────────────────────────────────────
  if (isFetching) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator color="#12D7CC" size="large" />
          <Text style={styles.loadingText}>Loading NDA…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <HomeHeader variant="admin" userRole="admin" />

        {/* Tab row */}
        <View style={styles.tabRow}>
          <Pressable style={styles.tabChip} onPress={() => router.back()}>
            <Text style={styles.tabText}>Documents</Text>
          </Pressable>
          <Pressable style={[styles.tabChip, styles.tabChipActive]}>
            <ShieldCheck size={14} color="#12D7CC" />
            <Text style={[styles.tabText, styles.tabTextActive]}>NDA</Text>
          </Pressable>
        </View>

        {/* Title */}
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="NDA Title"
          placeholderTextColor="#4A5568"
          style={styles.titleInput}
        />

        {/* Editor area */}
        <View style={styles.editorWrap}>
          <RichText editor={editor} style={styles.richText} />
        </View>

        {/* Action buttons — hide on Android when keyboard is up */}
        {(!isKeyboardUp || Platform.OS === 'ios') && (
          <View style={styles.actions}>
            <Pressable style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isSaving}>
              {isSaving ? (
                <ActivityIndicator color="#111827" size="small" />
              ) : (
                <Text style={styles.saveText}>{saveSuccess ? '✓ Saved!' : 'Save Changes'}</Text>
              )}
            </Pressable>
          </View>
        )}
      </View>

      {/* ✅ Toolbar: position absolute, bottom 0 — official pattern */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        {/* Wrap with View for custom background/border styling */}
        <View style={styles.toolbarWrapper}>
          <Toolbar
            editor={editor}
            items={DEFAULT_TOOLBAR_ITEMS}
            theme={{
              toolbar: {
                toolbarBody: {
                  backgroundColor: '#0D1B2E',
                  borderTopWidth: 1,
                  borderTopColor: '#1A2B45',
                },
                // icon tint colors via theme
                icon: {
                  tintColor: '#9CA8BE',
                },
                iconSelected: {
                  tintColor: '#12D7CC',
                },
                iconDisabled: {
                  tintColor: '#3A4A60',
                },
              },
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000E26' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: '#9CA8BE', fontSize: 14 },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
    
  },
  tabRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  tabChip: {
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#142038',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  tabChipActive: { backgroundColor: '#11313B' },
  tabText: { color: '#9CA8BE', fontSize: 16, fontWeight: '600' },
  tabTextActive: { color: '#12D7CC' },
  titleInput: {
    height: 46,
    borderRadius: 10,
    backgroundColor: '#111E34',
    paddingHorizontal: 14,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  editorWrap: {
    flex: 1,
    backgroundColor: '#111E34',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  richText: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#41516D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: { color: '#A8B3C7', fontSize: 14, fontWeight: '500' },
  saveButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveText: { color: '#111827', fontSize: 14, fontWeight: '700' },
  // ✅ Toolbar fixed at bottom
  keyboardAvoidingView: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  toolbarWrapper: {
    backgroundColor: '#0D1B2E',
    borderTopWidth: 1,
    borderTopColor: '#1A2B45',
  },
});