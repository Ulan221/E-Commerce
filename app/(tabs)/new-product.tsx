import { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { useProductStore } from "@/app/store/use-product-store";

export default function NewProduct() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");

    const addProduct = useProductStore((state) => state.addProduct);
    const isLoading = useProductStore((state) => state.isLoading);

    const handleAdd = async () => {
        if (!title || !price) return alert("Заполни поля!");

        await addProduct(title, price);
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Новый товар</Text>
            <TextInput style={styles.input} placeholder="Модель" placeholderTextColor="#666" value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="Цена" placeholderTextColor="#666" value={price} onChangeText={setPrice} keyboardType="numeric" />

            <TouchableOpacity style={styles.button} onPress={handleAdd} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Добавить</Text>}
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', padding: 20 },
    header: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
    input: { backgroundColor: '#1e1e1e', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15 },
    button: { backgroundColor: '#1e88e5', padding: 18, borderRadius: 10, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold' }
});
