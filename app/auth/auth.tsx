import {useEffect} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useRouter} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import {Formik} from 'formik';
import * as Yup from 'yup';


const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Неверный формат email')
        .required('Email нужен'),
    password: Yup.string()
        .min(6, 'Минимум 6 символов')
        .matches(/\d/, 'Пароль должен содержать хотя бы одну цифру')
        .required('Пароль нужен'),
})

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const router = useRouter();

    const myRedirectUri = "https://auth.expo.io/@220195ulan/lesson-expo-router";


    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: "407626885675-scq7cndecg299nn47li9tvf9j02p5fur.apps.googleusercontent.com",
        webClientId: "407626885675-000g1r4qfv196130c3c4go99bpuk45bk.apps.googleusercontent.com",
        redirectUri: "https://auth.expo.io/@220195ulan/lesson-expo-router",
    });
    console.log("ОТПРАВЛЯЕМ В GOOGLE:", myRedirectUri);


    useEffect(() => {
        WebBrowser.warmUpAsync().catch(err => console.log("Warmup error:", err));

        return () => {
            WebBrowser.coolDownAsync().catch(err => console.log("Cooldown error:", err));
        };
    }, []);

    useEffect(() => {
        if (response?.type === 'success') {
            const {authentication} = response;
            saveUserAndGo(authentication?.accessToken)
                .catch(error => console.error("Ошибка при сохранении:", error));
        }
    }, [response]);

    const saveUserAndGo = async (token: any) => {
        await AsyncStorage.setItem('@user_data', JSON.stringify({name: "Google User", token}));
        router.replace('/(tabs)');
    }

    return (
        <SafeAreaView style={styles.container}>
            <Formik
                initialValues={{email: '', password: ''}}
                validationSchema={LoginSchema}
                onSubmit={async (values) => {
                    await AsyncStorage.setItem('@user_data', JSON.stringify(values));
                    router.replace('/(tabs)');
                }}
            >
                {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                    <View>
                        <TextInput
                            style={styles.email}
                            placeholder="Email"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                        />
                        {errors.email && touched.email &&
                            <Text style={{color: 'red', marginLeft: 20}}>{errors.email}</Text>}

                        <TextInput
                            style={styles.password}
                            secureTextEntry
                            placeholder="Пароль"
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                        />
                        {errors.password && touched.password &&
                            <Text style={{color: 'red', marginLeft: 20}}>{errors.password}</Text>}

                        <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
                            <Text style={styles.buttonText}>Войти (через Formik)</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>

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
    email: {
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
