export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    brand: string;
    thumbnail: string;
    category?: string;
    stock?: number;
    rating?: number;
    images?: string[];
    discountPercentage?: number;
}

export interface CartItem extends Product {
    quantity: number;
}
