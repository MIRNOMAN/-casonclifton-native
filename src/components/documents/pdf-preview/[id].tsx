import React from 'react';
import { ActivityIndicator, StyleSheet, View, Text, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useGetDocumentPreviewQuery } from '@/redux/api/documentsApi';
import Pdf from 'react-native-pdf';

export default function DocumentPreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useGetDocumentPreviewQuery(id || '');
  const fileUrl = data?.data?.fileUrl;
  const [error, setError] = React.useState(false);
  const [pdfLoading, setPdfLoading] = React.useState(true);

  React.useEffect(() => {
    // Reset error/loading when id or fileUrl changes
    setError(false);
    setPdfLoading(true);
  }, [id, fileUrl]);

  // Show spinner while fetching API or PDF is loading
  if (isLoading || pdfLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#12D7CC" />
      </View>
    );
  }

  if (!fileUrl || error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#fff', fontSize: 16 }}>
          Document not found or cannot be previewed.
        </Text>
      </View>
    );
  }

  return (
    <Pdf
      source={{ uri: fileUrl, cache: true }}
      style={styles.pdf}
      onError={() => setError(true)}
      onLoadComplete={() => setPdfLoading(false)}
      onLoadProgress={() => setPdfLoading(true)}
      trustAllCerts={false}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000E26',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#000E26',
  },
});
