import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '../../../hooks/use-color-scheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const insets = useSafeAreaInsets();
    const activeColor = '#6d28d9';

    const extraBottomInset = insets.bottom > 0 ? insets.bottom : 0;
    const tabHeight = Platform.OS === 'ios' ? (extraBottomInset > 0 ? 92 : 74) : (74 + extraBottomInset);

    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: activeColor,
            tabBarInactiveTintColor: '#64748b',
            headerShown: false,
            tabBarStyle: {
                borderTopWidth: 1,
                borderTopColor: colorScheme === 'dark' ? '#2d3135' : '#e5e7eb',
                height: tabHeight,
                paddingBottom: extraBottomInset > 0 ? extraBottomInset + 12 : 14,
                paddingTop: 4,
                backgroundColor: colorScheme === 'dark' ? '#151718' : '#ffffff',
            },
            tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: '600',
                marginTop: -2,
                marginBottom: 2,
            },
            tabBarItemStyle: {
                justifyContent: 'center',
                alignItems: 'center',
            },
        }}>
      <Tabs.Screen name="index" options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? 'grid' : 'grid-outline'} size={22} color={color}/>),
        }}/>
      <Tabs.Screen name="new-survey" options={{
            title: 'New Survey',
            tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={22} color={color}/>),
        }}/>
      <Tabs.Screen name="history" options={{
            title: 'History',
            tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? 'time' : 'time-outline'} size={22} color={color}/>),
        }}/>
      <Tabs.Screen name="profile" options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color}/>),
        }}/>
    </Tabs>);
}

