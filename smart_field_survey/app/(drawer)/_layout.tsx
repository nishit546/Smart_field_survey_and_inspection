import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const state = props.state;
  
  // Find current active route
  const currentRoute = state.routes[state.index];
  const currentRouteName = currentRoute.name;

  // Check if drawer item is active
  const isTabActive = (tabIndex: number) => {
    if (currentRouteName !== '(tabs)') return false;
    const tabState = currentRoute.state;
    if (!tabState) {
      // Default to index 0 on startup
      return tabIndex === 0;
    }
    return tabState.index === tabIndex;
  };

  const isScreenActive = (screenName: string) => {
    return currentRouteName === screenName;
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>NS</Text>
        </View>
        <Text style={styles.name}>Nishit</Text>
        <Text style={styles.role}>Lead Field Inspector</Text>
        <Text style={styles.idText}>Student ID: SF-2026-99</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.menuItems}>
        <DrawerItem
          label="Dashboard"
          icon={({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={isTabActive(0) ? '#0a7ea4' : color} />
          )}
          focused={isTabActive(0)}
          activeTintColor="#0a7ea4"
          activeBackgroundColor="#e0f2fe"
          onPress={() => router.push('/(drawer)/(tabs)')}
        />
        <DrawerItem
          label="Survey"
          icon={({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={isTabActive(1) ? '#0a7ea4' : color} />
          )}
          focused={isTabActive(1)}
          activeTintColor="#0a7ea4"
          activeBackgroundColor="#e0f2fe"
          onPress={() => router.push('/(drawer)/(tabs)/new-survey')}
        />
        <DrawerItem
          label="Camera"
          icon={({ color, size }) => (
            <Ionicons name="camera-outline" size={size} color={isScreenActive('camera') ? '#0a7ea4' : color} />
          )}
          focused={isScreenActive('camera')}
          activeTintColor="#0a7ea4"
          activeBackgroundColor="#e0f2fe"
          onPress={() => router.push('/(drawer)/camera')}
        />
        <DrawerItem
          label="Contacts"
          icon={({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={isScreenActive('contacts') ? '#0a7ea4' : color} />
          )}
          focused={isScreenActive('contacts')}
          activeTintColor="#0a7ea4"
          activeBackgroundColor="#e0f2fe"
          onPress={() => router.push('/(drawer)/contacts')}
        />
        <DrawerItem
          label="Location"
          icon={({ color, size }) => (
            <Ionicons name="location-outline" size={size} color={isScreenActive('location') ? '#0a7ea4' : color} />
          )}
          focused={isScreenActive('location')}
          activeTintColor="#0a7ea4"
          activeBackgroundColor="#e0f2fe"
          onPress={() => router.push('/(drawer)/location')}
        />
        <DrawerItem
          label="Clipboard"
          icon={({ color, size }) => (
            <Ionicons name="clipboard-outline" size={size} color={isScreenActive('clipboard') ? '#0a7ea4' : color} />
          )}
          focused={isScreenActive('clipboard')}
          activeTintColor="#0a7ea4"
          activeBackgroundColor="#e0f2fe"
          onPress={() => router.push('/(drawer)/clipboard')}
        />
        <DrawerItem
          label="Settings"
          icon={({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={isScreenActive('settings') ? '#0a7ea4' : color} />
          )}
          focused={isScreenActive('settings')}
          activeTintColor="#0a7ea4"
          activeBackgroundColor="#e0f2fe"
          onPress={() => router.push('/(drawer)/settings')}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Smart Field Survey v1.0.0</Text>
        <Text style={styles.footerSubText}>Developed by Nishit</Text>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: 280,
          },
        }}
      >
        <Drawer.Screen name="(tabs)" options={{ drawerLabel: 'Dashboard' }} />
        <Drawer.Screen name="camera" options={{ drawerLabel: 'Camera' }} />
        <Drawer.Screen name="contacts" options={{ drawerLabel: 'Contacts' }} />
        <Drawer.Screen name="location" options={{ drawerLabel: 'Location' }} />
        <Drawer.Screen name="clipboard" options={{ drawerLabel: 'Clipboard' }} />
        <Drawer.Screen name="settings" options={{ drawerLabel: 'Settings' }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'flex-start',
    backgroundColor: '#0a7ea4',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarText: {
    color: '#0a7ea4',
    fontSize: 24,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  role: {
    fontSize: 13,
    color: '#e0f2fe',
    marginTop: 2,
  },
  idText: {
    fontSize: 11,
    color: '#bae6fd',
    marginTop: 2,
    fontFamily: 'monospace',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 10,
  },
  menuItems: {
    flex: 1,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  footerSubText: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 2,
  },
});
