import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '../hooks/use-color-scheme';
export default function CustomHeader({ title }) {
    const navigation = useNavigation();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const toggleDrawer = () => {
        navigation.dispatch(DrawerActions.toggleDrawer());
    };
    const goToProfile = () => {
        router.push('/(drawer)/(tabs)/profile');
    };
    const isDark = colorScheme === 'dark';
    return (<View style={[
            styles.headerContainer,
            {
                paddingTop: insets.top + 10,
                backgroundColor: isDark ? '#151718' : '#ffffff',
                borderBottomColor: isDark ? '#2d3135' : '#e5e7eb'
            }
        ]}>
      <Pressable onPress={toggleDrawer} style={styles.iconButton}>
        <Ionicons name="menu-outline" size={28} color={isDark ? '#ecf0f1' : '#2c3e50'}/>
      </Pressable>

      <Text style={[styles.title, { color: isDark ? '#ecf0f1' : '#2c3e50' }]}>
        {title}
      </Text>

      <Pressable onPress={goToProfile} style={styles.avatarButton}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>ND</Text>
        </View>
      </Pressable>
    </View>);
}
const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    iconButton: {
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
    avatarButton: {
        padding: 2,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#6d28d9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
