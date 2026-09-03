export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_pesewas: number;
  compare_at_price_pesewas: number | null;
  stock: number;
  images: string[];
  published: boolean;
  category_id: string;
  created_at: string;
  updated_at: string;
};

export type ProductWithCategory = Product & { category: Category };

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered';

export const ORDER_STATUSES: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered'];

export type Order = {
  id: string;
  customer_name: string;
  phone: string;
  email: string;
  address: string;
  status: OrderStatus;
  total_pesewas: number;
  paystack_ref: string | null;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_pesewas: number;
};

export type OrderItemWithProduct = OrderItem & { product: Pick<Product, 'name' | 'slug'> };

export type OrderWithItems = Order & { items: OrderItemWithProduct[] };
