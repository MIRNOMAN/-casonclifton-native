import { DocumentsScreen } from '@/components/documents/DocumentsScreen';
import { useAppSelector } from '@/redux/store';
import React from 'react';

export default function HomeTabScreen() {
  const authToken = useAppSelector((state) => state.auth.token);
  console.log({ authToken });
  return <DocumentsScreen mode="home" />;
}
