import { persistor, store } from '@/redux/store';
import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'sonner-native';
import './../styles/global.css';
const _Layout = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar barStyle={'dark-content'} />
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
            <Toaster position="top-center" richColors />
          </PersistGate>
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default _Layout;
