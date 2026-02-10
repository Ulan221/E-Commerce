import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../auth/auth";
import { useCartStore } from "@/app/store/use-cart-store";

export default function ProfileScreen() {
    const [user, setUser] = useState<User | null>(null);

    const cart = useCartStore((state) => state.carts);
    const { increaseQuantity, decreaseQuantity } = useCartStore();

    useEffect(() => {
        const getProfile = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('@user_data');
                if (jsonValue !== null) {
                    setUser(JSON.parse(jsonValue));
                }
            } catch (error) {
                console.error(error);
            }
        };
        void getProfile();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/* 1. Карточка профиля */}
            <View style={styles.profileCard}>
                <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarLetter}>
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                    </Text>
                </View>
                <Text style={styles.title}>{user?.name || "Пользователь"}</Text>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>ID: #{user?.id || "—"}</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Корзина покупок</Text>

            {/* 2. Список корзины */}
            <FlatList
                data={cart}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 40 }}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>В корзине пока пусто 🛒</Text>
                }
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                        <Image source={{ uri: item.thumbnail }} style={styles.cartImage} />

                        <View style={styles.cartInfo}>
                            <Text style={styles.cartName} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.cartPrice}>${item.price * (item.quantity || 1)}</Text>
                        </View>

                        <View style={styles.counter}>
                            <TouchableOpacity
                                style={styles.countBtn}
                                onPress={() => decreaseQuantity(item.id)}
                            >
                                <Text style={styles.countBtnText}>-</Text>
                            </TouchableOpacity>

                            <Text style={styles.countText}>{item.quantity || 1}</Text>

                            <TouchableOpacity
                                style={styles.countBtn}
                                onPress={() => increaseQuantity(item.id)}
                            >
                                <Text style={styles.countBtnText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', paddingHorizontal: 20 },
    profileCard: {
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: '#1e1e1e',
        borderRadius: 25,
        padding: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    avatarPlaceholder: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: '#1e88e5', justifyContent: 'center', alignItems: 'center',
        marginBottom: 10,
    },
    avatarLetter: { fontSize: 30, color: '#fff', fontWeight: 'bold' },
    title: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
    infoRow: { width: '100%', alignItems: 'center' },
    label: { fontSize: 14, color: '#888' },

    sectionTitle: {
        fontSize: 22, fontWeight: 'bold', color: '#fff',
        marginTop: 30, marginBottom: 15
    },

    // Стили корзины
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#1e1e1e',
        borderRadius: 15,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
    },
    cartImage: { width: 60, height: 60, borderRadius: 10, backgroundColor: '#333' },
    cartInfo: { flex: 1, marginLeft: 15 },
    cartName: { color: '#fff', fontSize: 16, fontWeight: '600' },
    cartPrice: { color: '#1e88e5', fontSize: 14, marginTop: 4 },

    counter: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2c2c2c',
        borderRadius: 10,
        padding: 4
    },
    countBtn: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
    countBtnText: { color: '#1e88e5', fontSize: 20, fontWeight: 'bold' },
    countText: { color: '#fff', fontSize: 16, marginHorizontal: 10, fontWeight: 'bold' },
    emptyText: { color: '#888', textAlign: 'center', marginTop: 50, fontSize: 16 }
});