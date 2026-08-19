import { Navigate, Route, Routes } from 'react-router-dom';
import { StorefrontLayout } from '@/components/StorefrontLayout';
import { HomePage } from '@/features/catalog/HomePage';
import { ProductPage } from '@/features/catalog/ProductPage';
import { CartPage } from '@/features/cart/CartPage';
import { CheckoutPage } from '@/features/checkout/CheckoutPage';
import { OrderConfirmationPage } from '@/features/checkout/OrderConfirmationPage';
import { AuthProvider } from '@/features/admin/AuthContext';
import { RequireAdmin } from '@/features/admin/RequireAdmin';
import { LoginPage } from '@/features/admin/LoginPage';
import { AdminLayout } from '@/features/admin/AdminLayout';
import { DashboardPage } from '@/features/admin/DashboardPage';
import { ProductListPage } from '@/features/admin/products/ProductListPage';
import { NewProductPage } from '@/features/admin/products/NewProductPage';
import { EditProductPage } from '@/features/admin/products/EditProductPage';
import { CategoryListPage } from '@/features/admin/categories/CategoryListPage';
import { OrderListPage } from '@/features/admin/orders/OrderListPage';
import { OrderDetailPage } from '@/features/admin/orders/OrderDetailPage';

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:ref" element={<OrderConfirmationPage />} />
        </Route>

        <Route path="/admin/login" element={<LoginPage />} />
        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductListPage />} />
            <Route path="products/new" element={<NewProductPage />} />
            <Route path="products/:id/edit" element={<EditProductPage />} />
            <Route path="categories" element={<CategoryListPage />} />
            <Route path="orders" element={<OrderListPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
