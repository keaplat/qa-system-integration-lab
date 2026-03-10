export type Product = {
  id: string;
  name: string;
  price: number;
};

export type CreateOrderPayload = {
  email: string;
  productId: string;
  quantity: number;
};

export type OrderRecord = {
  created_at: string;
  email: string;
  id: number;
  product_id: string;
  product_name: string;
  quantity: number;
  status: string;
  total: number;
  unit_price: number;
};
