import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from "react-redux";
import { StatusBar } from 'react-native';
import './../styles/global.css';
import { store,persistor } from '@/redux/store';
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
