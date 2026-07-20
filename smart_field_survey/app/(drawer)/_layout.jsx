import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const ACCENT = '#6d28d9';
const BG = '#ffffff';
const ITEM_ACTIVE_BG = '#ede9fe';
const ITEM_INACTIVE = '#64748b';
const LABEL_COLOR = '#94a3b8';
const mainNav = [
    { label: 'Dashboard', icon: 'grid-outline', route: '/(drawer)/(tabs)' },
    { label: 'New Survey', icon: 'document-text-outline', route: '/(drawer)/(tabs)/new-survey' },
    { label: 'History', icon: 'time-outline', route: '/(drawer)/(tabs)/history' },
];
const toolsNav = [
    { label: 'Camera', icon: 'camera-outline', route: '/(drawer)/camera' },
    { label: 'Location', icon: 'location-outline', route: '/(drawer)/location' },
    { label: 'Contacts', icon: 'people-outline', route: '/(drawer)/contacts' },
    { label: 'Clipboard', icon: 'clipboard-outline', route: '/(drawer)/clipboard' },
];
function CustomDrawerContent(props) {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const state = props.state;
    const currentRoute = state.routes[state.index];
    const currentRouteName = currentRoute.name;
    const isActive = (route) => {
        if (route === '/(drawer)/(tabs)') {
            if (currentRouteName !== '(tabs)')
                return false;
            const tabState = currentRoute.state;
            return !tabState || tabState.index === 0;
        }
        if (route === '/(drawer)/(tabs)/new-survey') {
            if (currentRouteName !== '(tabs)')
                return false;
            const tabState = currentRoute.state;
            return tabState?.index === 1;
        }
        if (route === '/(drawer)/(tabs)/history') {
            if (currentRouteName !== '(tabs)')
                return false;
            const tabState = currentRoute.state;
            return tabState?.index === 2;
        }
        return currentRouteName === route.replace('/(drawer)/', '');
    };
    const NavRow = ({ item }) => {
        const active = isActive(item.route);
        return (<Pressable style={[styles.navItem, active && styles.navItemActive]} onPress={() => router.push(item.route)}>
        <Ionicons name={item.icon} size={20} color={active ? ACCENT : ITEM_INACTIVE}/>
        <Text style={[styles.navLabel, active && styles.navLabelActive]}>
          {item.label}
        </Text>
        {active && <View style={styles.activePill}/>}
      </Pressable>);
    };
    const SectionLabel = ({ title }) => (<Text style={styles.sectionLabel}>{title}</Text>);
    return (<View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarText}>ND</Text>
        </View>
        <View>
          <Text style={styles.name}>Nishit</Text>
          <Text style={styles.role}>Lead Field Inspector</Text>
          <Text style={styles.idBadge}>SF-2026-99</Text>
        </View>
      </View>

      <View style={styles.divider}/>

      {/* Navigation */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <SectionLabel title="MAIN"/>
        {mainNav.map(item => <NavRow key={item.route} item={item}/>)}

        <View style={styles.divider}/>

        <SectionLabel title="TOOLS"/>
        {toolsNav.map(item => <NavRow key={item.route} item={item}/>)}


      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Text style={styles.footerText}>Smart Field Survey v1.0.0</Text>
        <Text style={styles.footerSub}>by Nishit Suthar</Text>
      </View>
    </View>);
}
export default function DrawerLayout() {
    return (<GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={(props) => <CustomDrawerContent {...props}/>} screenOptions={{
            headerShown: false,
            drawerStyle: { width: 270, backgroundColor: BG },
        }}>
        <Drawer.Screen name="(tabs)" options={{ drawerLabel: 'Dashboard' }}/>
        <Drawer.Screen name="camera" options={{ drawerLabel: 'Camera' }}/>
        <Drawer.Screen name="contacts" options={{ drawerLabel: 'Contacts' }}/>
        <Drawer.Screen name="location" options={{ drawerLabel: 'Location' }}/>
        <Drawer.Screen name="clipboard" options={{ drawerLabel: 'Clipboard' }}/>

      </Drawer>
    </GestureHandlerRootView>);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    avatarBox: {
        width: 52,
        height: 52,
        borderRadius: 14,
        backgroundColor: '#ede9fe',
        borderWidth: 1.5,
        borderColor: ACCENT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: ACCENT,
        fontSize: 18,
        fontWeight: '800',
    },
    name: {
        color: '#1e293b',
        fontSize: 16,
        fontWeight: '700',
    },
    role: {
        color: '#94a3b8',
        fontSize: 12,
        marginTop: 1,
    },
    idBadge: {
        color: ACCENT,
        fontSize: 10,
        fontWeight: '600',
        marginTop: 3,
        fontFamily: 'monospace',
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginHorizontal: 16,
        marginVertical: 6,
    },
    scroll: {
        flex: 1,
        paddingTop: 4,
    },
    sectionLabel: {
        color: LABEL_COLOR,
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.2,
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginTop: 4,
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginHorizontal: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 2,
    },
    navItemActive: {
        backgroundColor: ITEM_ACTIVE_BG,
    },
    navLabel: {
        flex: 1,
        color: ITEM_INACTIVE,
        fontSize: 14,
        fontWeight: '500',
    },
    navLabelActive: {
        color: '#1e293b',
        fontWeight: '700',
    },
    activePill: {
        width: 4,
        height: 16,
        borderRadius: 2,
        backgroundColor: ACCENT,
    },
    footer: {
        paddingHorizontal: 20,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    footerText: {
        color: '#64748b',
        fontSize: 11,
        fontWeight: '600',
    },
    footerSub: {
        color: '#94a3b8',
        fontSize: 10,
        marginTop: 2,
    },
});
