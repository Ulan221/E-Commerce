import { Tabs } from 'expo-router';
import React, { ComponentProps } from 'react';
import { MotiView } from 'moti';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';

type IconName = ComponentProps<typeof IconSymbol>['name'];

const AnimatedIcon = ({ focused, name, color }: { focused: boolean, name: IconName, color: string }) => {
    return (
        <MotiView
            animate={{ scale: focused ? 1.5 : 1 }}
            transition={{
                type: 'spring',
                damping: 12,
            } as any}
        >
            <IconSymbol size={28} name={name} color={color} />
        </MotiView>
    );
};

export default function TabLayout() {
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
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Главная',
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedIcon focused={focused} name="house.fill" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="new-product"
                options={{
                    title: 'Добавить',
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedIcon focused={focused} name="plus.circle.fill" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Профиль',
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedIcon focused={focused} name="person.fill" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
