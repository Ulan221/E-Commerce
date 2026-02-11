import {useRouter} from "expo-router";
import {ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View} from "react-native";
import {useCallback, useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import SearchInput from "@/components/search-input";
import {useProductStore} from "@/app/store/use-product-store";
import {Product} from "@/constants/types";


export default function HomeScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [isRefresh, setIsRefresh] = useState(false);

    const {products, isLoading, fetchProducts} = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const onRefresh = useCallback(async () => {
        setIsRefresh(true);
        await fetchProducts();
        setIsRefresh(false);
    }, [fetchProducts]);

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const renderProduct = ({item}: { item: Product }) => (
        <Pressable
            style={styles.card}
            onPress={() => router.push({pathname: '/details/[id]', params: {id: item.id}})}
        >
            <Image source={{uri: item.thumbnail}}
                   style={styles.image}
                   resizeMode="contain"/>

            <View style={styles.contentContainer}>
                <Text style={styles.categoryTag}>{item.category}</Text>

                <View style={styles.info}>
                    <View style={{flex: 1}}>
                        <Text style={styles.name} numberOfLines={1}>
                            {item.brand} {item.title}
                        </Text>
                        <Text style={styles.ratingText}>⭐ {item.rating}</Text>
                    </View>

                    <View style={styles.priceBadge}>
                        <Text style={styles.price}>${item.price}</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );

    if (isLoading && !isRefresh) {
        return <ActivityIndicator style={{flex: 1}} size="large"/>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery("")}/>
            <FlatList
                data={filteredProducts}
                renderItem={renderProduct}
                keyExtractor={item => item.id.toString()}
                onRefresh={onRefresh}
                refreshing={isRefresh}
                contentContainerStyle={{padding: 16}}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#010100'},
    contentContainer: {padding: 12},
    priceContainer: {backgroundColor: '#989898', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)',},
    card: {backgroundColor: '#242424', borderRadius: 32, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', marginBottom: 15, overflow: 'hidden'},
    image: {width: '100%', height: 300},
    info: {backgroundColor: '#333333', padding: 12, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', flex: 1, flexDirection: 'row', justifyContent: 'space-between'},
    name: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
    ratingText: {color: '#FFD700', fontSize: 14, marginTop: 2,},
    categoryTag: {color: '#808080', fontSize: 12, textTransform: 'uppercase', marginBottom: 4, fontWeight: '600',},
    priceBadge: {backgroundColor: '#1e88e5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, marginLeft: 8,},
    price: {color: '#FFFFFF', fontSize: 16, marginTop: 4},
    button: {height: 40, width: 100, margin: 20, borderRadius: 15, backgroundColor: "#0866ff", justifyContent: "center", alignItems: "center"},
    buttonText: {color: '#fff', fontSize: 14, fontWeight: 'bold'}
});
