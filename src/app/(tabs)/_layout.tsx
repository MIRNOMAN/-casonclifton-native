import { Tabs } from 'expo-router';
import { Easing } from 'react-native';
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
          animation: 'shift',
          transitionSpec: {
            animation: 'timing',
            config: {
              duration: 280,
              easing: Easing.out(Easing.cubic),
            },
          },
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
