import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/use-color-scheme';
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const unstable_settings = {
    initialRouteName: 'auth',
};


export default function RootLayout() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const colorScheme = useColorScheme();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await AsyncStorage.getItem('@user_data');
                if (data !== null) {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                alert("Пользователя нет в системе");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        void checkAuth();

    }, []);

    if (isLoading) return null;

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack
                screenOptions={{
                    contentStyle: { backgroundColor: '#010100' },
                    headerStyle: { backgroundColor: '#010100' },
                    headerTintColor: '#fff',
                    headerShadowVisible: false,
                }}
            >
                {!isAuthenticated ? (
                    <Stack.Screen name="auth/auth" options={{headerShown: false}}/>
                ) : (
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                )}

                <Stack.Screen name="details/[id]" options={{ title: '' }} />

                <Stack.Screen name="modal" options={{presentation: 'modal', title: 'Modal'}}/>
            </Stack>
            <StatusBar style="light" translucent={false} backgroundColor="#010100" />
        </ThemeProvider>
    );
}