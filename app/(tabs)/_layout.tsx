    import { Tabs } from 'expo-router';
    import React from 'react';
    
    import { HapticTab } from '@/components/haptic-tab';
    import { IconSymbol } from '@/components/ui/icon-symbol';
    import { useColorScheme } from '@/hooks/use-color-scheme';
    
    export default function TabLayout() {
        const colorScheme = useColorScheme();
        const activeColor = '#0866ff';
        const inactiveColor = '#65676b';
        const bgColor = '#010100';
    
        return (
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: activeColor,
                    tabBarInactiveTintColor: inactiveColor,
                    headerShown: false,
                    tabBarButton: HapticTab,
                    sceneStyle: { backgroundColor: bgColor },
                    tabBarStyle: {
                        backgroundColor: bgColor,
                        borderTopWidth: 0,
                        height: 70,
                        paddingBottom: 12,
                        paddingTop: 8,
                        elevation: 0,
                        shadowOpacity: 0,  
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '500',
                    }
                }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Главная',
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="new-product"
                    options={{
                        title: 'Добавить товар',
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.circle.fill" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Профиль',
                        tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
                    }}
                />
            </Tabs>
        );
    }
