import {create} from "zustand";

export interface CartItem {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    quantity: number;
    brand?: string;
}

interface CartState {
    carts: CartItem[];
    increaseQuantity: (id: number) => void;
    decreaseQuantity: (id: number) => void;
    addToCart(cartItem: CartItem): void;
}

export const useCartStore = create<CartState>((set) => ({
    carts: [],
    addToCart: (item: CartItem) => set((state) => {
        const isExist = state.carts.find(p => p.id === item.id);
        if (isExist) {
            return {
                carts: state.carts.map(p =>
                    p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
                )
            };
        }
        return { carts: [...state.carts, { ...item, quantity: 1 }] };
    }),

    increaseQuantity: (id) => set((state) => ({
        carts: state.carts.map((p) =>
            p.id === id ? { ...p, quantity: p.quantity + 1 } : p
        ),
    })),

    decreaseQuantity: (id) => set((state) => ({
        carts: state.carts
            .map((p) => p.id === id ? { ...p, quantity: p.quantity - 1 } : p)
            .filter((p) => p.quantity > 0),
    })),
}));
