import { Product, ProductsResponse } from '@/types/product';

// Fetch semua produk dari DummyJSON API
export async function getProducts(): Promise<ProductsResponse> {
  try {
    const res = await fetch('https://dummyjson.com/products?limit=30', {
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      throw new Error('Gagal mengambil data dari API DummyJSON');
    }

    const data: ProductsResponse = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Fetch detail produk tunggal berdasarkan ID
export async function getProductById(id: number): Promise<Product | null> {
  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`);

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Gagal mengambil detail produk ID: ${id}`);
    }

    const data: Product = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching product ID ${id}:`, error);
    return null;
  }
}