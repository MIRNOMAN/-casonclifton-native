import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const DocumentPreview = ({ fileUrl }: { fileUrl: string }) => {
  // Your specific Google Docs Publish Link
  const docUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;

  const customHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          body, html { 
            margin: 0; 
            padding: 0; 
            height: 100%; 
            width: 100%;
            display: flex;
            justify-content: center;
            background-color: #f0f0f0; /* Slight gray background for the 'viewer' feel */
          }
          .container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;

          }
          iframe { 
            border: none; 
            width: 100%; 
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <iframe 
            src="${docUrl}"
            allow="autoplay">
          </iframe>
        </div>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: customHtml }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true}
        // Force mobile view rendering
        userAgent="Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webview: {
    flex: 1,
  },
});

export default DocumentPreview;
