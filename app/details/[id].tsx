import {Stack, useLocalSearchParams} from 'expo-router';
import {Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useCallback, useEffect, useState} from "react";
import {useCartStore} from "@/app/store/use-cart-store";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Product {
    id: number;
    brand: string;
    title: string;
    price: number;
    thumbnail: string;
    description: string;
}

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

export default function DetailsScreen() {
    const insets = useSafeAreaInsets();
    const {id} = useLocalSearchParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);

    const [product, setProduct] = useState<Product | null>(null);
    const carts = useCartStore();


    useEffect(() => {
        const loadProduct = async () => {
            try {
                const response = await fetch(`https://dummyjson.com/products/${id}`);
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error("Ошибка загрузки:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadProduct();
    }, [id]);

    const handleToggleLike = useCallback(() => {
        setIsLiked((prev) => !prev);
    }, []);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <Text style={styles.text}>Загрузка характеристик...</Text>
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.center}>
                <Text style={styles.text}>Товар не найден 404</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: insets.bottom + 20,
            }}
            >
            <Stack.Screen
                options={{
                    title: `${product.brand} ${product.title}`
                }}/>

            <Image
                source={{uri: product.thumbnail}}
                style={styles.mainImage}
                resizeMode="contain"/>

            <View style={styles.infoWrapper}>
                <View style={styles.headerRow}>
                    <Text style={styles.productTitle}>{product.brand} {product.title}</Text>
                    <Pressable onPress={handleToggleLike}>
                        <Text style={{fontSize: 28}}>{isLiked ? "❤️" : "🤍"}</Text>
                    </Pressable>
                </View>

                <Text style={styles.price}>${product.price.toLocaleString()}</Text>

                <View style={styles.divider}/>

                <Text style={styles.descriptionTitle}>Описание</Text>
                <Text style={styles.descriptionText}>{product.description}</Text>

                <TouchableOpacity
                    style={styles.buyButton}
                    onPress={() => {
                        carts.addToCart({...product, quantity: 1});
                        alert("Добавлено!");
                    }}
                >
                    <Text style={styles.buyButtonText}>Купить товар</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#010100'},
    center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    mainImage: {width: '100%', height: SCREEN_HEIGHT * 0.45},
    infoWrapper: {padding: 20},
    headerRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    productTitle: {flex: 1, flexShrink: 1, fontSize: 28, fontWeight: 'bold', color: '#ffffff'},
    price: {fontSize: 22, color: '#007AFF', fontWeight: '600', marginTop: 5},
    divider: {height: 1, backgroundColor: '#333', marginVertical: 20},
    descriptionTitle: {fontSize: 18, color: '#A0A0A0', fontWeight: 'bold', marginBottom: 10},
    descriptionText: {fontSize: 16, color: '#A0A0A0', lineHeight: 24},
    buyButton: {backgroundColor: '#007AFF', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 30},
    buyButtonText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
    text: {fontSize: 18, color: '#666'}
});