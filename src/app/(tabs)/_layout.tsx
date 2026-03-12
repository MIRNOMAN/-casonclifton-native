import { Tabs } from 'expo-router';
import { CustomTabBar } from '@/components/documents/CustomTabBar';
import { DocumentsProvider } from '@/features/documents/documents-context';

export default function TabLayout() {
  return (
    <DocumentsProvider>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: '#000E26' },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Favorite',
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
          }}
        />
      </Tabs>
    </DocumentsProvider>
  );
}
