import {useEffect, useState} from "react"; // Добавили useEffect
import {SafeAreaView} from "react-native-safe-area-context";
import {StyleSheet, Text, TextInput, TouchableOpacity} from "react-native";
import {useRouter} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

export interface User {
    id: string;
    name: string;
    password: string;
}

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const myRedirectUri = "https://auth.expo.io/@220195ulan/lesson-expo-router";


    // 1. Инициализируем запрос Google
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: "407626885675-scq7cndecg299nn47li9tvf9j02p5fur.apps.googleusercontent.com",
        webClientId: "407626885675-000g1r4qfv196130c3c4go99bpuk45bk.apps.googleusercontent.com",
        redirectUri: "https://auth.expo.io/@220195ulan/lesson-expo-router",
    });
    console.log("ОТПРАВЛЯЕМ В GOOGLE:", myRedirectUri);

    useEffect(() => {
        WebBrowser.warmUpAsync();
        return () => { WebBrowser.coolDownAsync(); };
    }, []);

    // 2. Слушаем ответ (EventListener)
    useEffect(() => {
        if (response?.type === 'success') {
            const {authentication} = response;
            console.log("Token:", authentication?.accessToken);
            saveUserAndGo(authentication?.accessToken);
        }
    }, [response]);

    const saveUserAndGo = async (token: any) => {
        await AsyncStorage.setItem('@user_data', JSON.stringify({name: "Google User", token}));
        router.replace('/(tabs)');
    }

    const handleLogin = async () => {
        // Твоя старая логика для обычного входа
        if (name.length === 0 || password.length === 0) {
            return alert("Заполните все поля");
        }
        await AsyncStorage.setItem('@user_data', JSON.stringify({name, password}));
        router.replace('/(tabs)');
    }

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.name}
                placeholder={"Введите имя:"}
                placeholderTextColor="#666"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.password}
                secureTextEntry={true}
                placeholder={"Введите пароль"}
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Войти (Обычный)</Text>
            </TouchableOpacity>

            {/* ДОБАВИЛИ КНОПКУ GOOGLE */}
            <TouchableOpacity
                style={[styles.button, {backgroundColor: '#db4437', marginTop: 20}]}
                disabled={!request}
                onPress={() => promptAsync()}
            >
                <Text style={styles.buttonText}>Войти через Google</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        justifyContent: 'center',
    },

    button: {
        backgroundColor: '#1e88e5',
        padding: 18,
        borderRadius: 15,
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: '800',
        fontSize: 16,
        textTransform: 'uppercase',
    },
    name: {
        height: 55,
        backgroundColor: '#1e1e1e',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginHorizontal: 20,
        marginBottom: 15,
        fontSize: 16,
        color: '#ffffff',
        borderWidth: 1,
        borderColor: '#333',
    },
    password: {
        height: 55,
        backgroundColor: '#1e1e1e',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginHorizontal: 20,
        marginBottom: 20,
        fontSize: 16,
        color: '#ffffff',
        borderWidth: 1,
        borderColor: '#333',
    },
});

export class User {
}