import {useRouter} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useProductStore} from "@/app/store/use-product-store";
import * as Yup from 'yup';
import {Formik} from "formik";
import * as ImagePicker from 'expo-image-picker';


const NewProductSchema = Yup.object().shape({
    title: Yup.string()
        .required('Заполните поле'),
    price: Yup.number()
        .min(50000)
        .required('Заполните поле'),
    description: Yup.string()
        .required('Заполните поле'),
    thumbnail: Yup.string().required('Заполните поле'),
    brand: Yup.string().required('Заполните поле'),
})

export default function NewProduct() {
    const router = useRouter();

    const addProduct = useProductStore((state) => state.addProduct);
    const isLoading = useProductStore((state) => state.isLoading);


    return (

        <SafeAreaView style={styles.container}>
            <Formik
                initialValues={{title: '', description: '', price: '', thumbnail: '', brand: ''}}
                validationSchema={NewProductSchema}
                onSubmit={async (values) => {
                    await addProduct({
                        ...values,
                        price: Number(values.price)
                    });
                    router.back();
                }}
            >
                {({handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue}) => (
                    <View>
                        <Text style={styles.header}>Новый товар</Text>
                        <TextInput style={styles.input}
                                   placeholder="Модель"
                                   placeholderTextColor="#666"
                                   value={values.title}
                                   onBlur={handleBlur('title')}
                                   onChangeText={handleChange('title')}/>

                        {errors.title && touched.title &&
                            <Text style={{color: 'red', marginLeft: 20}}>{errors.title}</Text>}

                        <TextInput style={styles.input}
                                   placeholder="Цена"
                                   placeholderTextColor="#666"
                                   value={values.price}
                                   onChangeText={handleChange('price')}
                                   onBlur={handleBlur('price')}
                                   keyboardType="numeric"/>

                        {errors.price && touched.price &&
                            <Text style={{color: 'red', marginLeft: 20}}>{errors.price}</Text>}



                        <TextInput style={styles.input}
                                   placeholder="Описание"
                                   placeholderTextColor="#666"
                                   value={values.description}
                                   onBlur={handleBlur('description')}
                                   onChangeText={handleChange('description')}/>

                        {errors.description && touched.description &&
                            <Text style={{color: 'red', marginLeft: 20}}>{errors.description}</Text>}

                        <TextInput style={styles.input} placeholder="Бренд" placeholderTextColor="#666"
                                   value={values.brand}
                                   onChangeText={handleChange('brand')}
                                   onBlur={handleBlur('brand')}/>

                        {errors.brand && touched.brand &&
                            <Text style={{color: 'red', marginLeft: 20}}>{errors.brand}</Text>}

                        <TouchableOpacity
                            style={[styles.input, {
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderStyle: 'dashed',
                                borderWidth: 1,
                                borderColor: errors.thumbnail && touched.thumbnail ? 'red' : '#666'
                            }]}
                            onPress={async () => {
                                // 2. Логика выбора фото
                                const result = await ImagePicker.launchImageLibraryAsync({
                                    mediaTypes: ['images'],
                                    allowsEditing: false,
                                    quality: 1,
                                });

                                if (!result.canceled) {

                                    setFieldValue('thumbnail', result.assets[0].uri);
                                }
                            }}
                        >
                            <Text style={{color: '#666'}}>
                                {values.thumbnail ? "Фото выбрано ✅" : "Нажмите, чтобы выбрать фото"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={() => handleSubmit()} disabled={isLoading}>
                            {isLoading ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Добавить</Text>}
                        </TouchableOpacity>
                    </View>
                )}

            </Formik>



        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#121212', padding: 20},
    header: {color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 20},
    input: {backgroundColor: '#1e1e1e', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15},
    button: {backgroundColor: '#1e88e5', padding: 18, borderRadius: 10, alignItems: 'center'},
    buttonText: {color: '#fff', fontWeight: 'bold'}
});
