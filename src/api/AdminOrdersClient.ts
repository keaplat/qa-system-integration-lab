import type { APIRequestContext, APIResponse } from '@playwright/test';

export class AdminOrdersClient {
  constructor(private readonly request: APIRequestContext) {}

  getProducts(): Promise<APIResponse> {
    return this.request.get('/api/products');
  }

  getOrderById(id: number): Promise<APIResponse> {
    return this.request.get(`/api/admin/orders/${id}`);
  }

  health(): Promise<APIResponse> {
    return this.request.get('/api/health');
  }
}
