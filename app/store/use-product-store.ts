import { create } from "zustand";
import axios from "axios";
import {Product} from "@/constants/types";

export const api = axios.create({
    baseURL: 'https://dummyjson.com',
});

interface ProductStore {
    products: Product[];
    isLoading: boolean;
    fetchProducts: () => Promise<void>;
    addProduct: (newProduct: Pick<Product, 'title' | 'price' | 'description' | 'brand' | 'thumbnail'>) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
    products: [],
    isLoading: false,

    fetchProducts: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/products/category/smartphones');
            set({ products: response.data.products });
        } catch (error) {
            console.error("Ошибка загрузки:", error);
        } finally {
            set({ isLoading: false });
        }
    },



    addProduct: async (newProduct) => {
        set({ isLoading: true });
        try {
            const response = await api.post('/products/add', newProduct);

            const createdProduct = response.data;

            set((state) => ({
                products: [createdProduct, ...state.products],
            }));

            alert(`Товар "${newProduct.title}" успешно добавлен!`);
        } catch (error) {
            console.error("Ошибка добавления:", error);
            alert("Не удалось добавить товар");
        } finally {
            set({ isLoading: false });
        }
    }
}));