import path from 'node:path';

import express from 'express';
import { z } from 'zod';

import { initializeDatabase, query } from '@app/db';
import { products } from '@app/products';
import type { CreateOrderPayload, OrderRecord } from '@app/types';

const orderSchema = z.object({
  email: z.string().email(),
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(5)
});

async function bootstrap(): Promise<void> {
  await initializeDatabase();

  const app = express();
  const frontendDir = path.resolve(process.cwd(), 'src/frontend');

  app.use(express.json());
  app.use(express.static(frontendDir));

  app.get('/api/health', (_request, response) => {
    response.status(200).json({
      service: 'qa-system-integration-lab',
      status: 'ok'
    });
  });

  app.get('/api/products', (_request, response) => {
    response.status(200).json(products);
  });

  app.post('/api/orders', async (request, response) => {
    const parsed = orderSchema.safeParse(request.body);

    if (!parsed.success) {
      response.status(400).json({
        error: 'ValidationError',
        details: parsed.error.flatten()
      });
      return;
    }

    const payload = parsed.data as CreateOrderPayload;
    const product = products.find((item) => item.id === payload.productId);

    if (!product) {
      response.status(404).json({
        error: 'ProductNotFound',
        message: 'Product does not exist.'
      });
      return;
    }

    const total = product.price * payload.quantity;

    const inserted = await query<OrderRecord>(
      `INSERT INTO orders (email, product_id, product_name, quantity, unit_price, total)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [payload.email, product.id, product.name, payload.quantity, product.price, total]
    );

    const order = inserted[0];

    response.status(201).json({
      email: order.email,
      orderId: order.id,
      productName: order.product_name,
      quantity: order.quantity,
      status: order.status,
      total: order.total
    });
  });

  app.get('/api/admin/orders/:id', async (request, response) => {
    const rows = await query<OrderRecord>('SELECT * FROM orders WHERE id = $1', [request.params.id]);
    const order = rows[0];

    if (!order) {
      response.status(404).json({
        error: 'NotFound',
        message: 'Order not found.'
      });
      return;
    }

    response.status(200).json(order);
  });

  app.use((_request, response) => {
    response.sendFile(path.join(frontendDir, 'index.html'));
  });

  const port = Number(process.env.PORT ?? 3000);
  app.listen(port, '0.0.0.0', () => {
    console.log(`Integration lab available at http://0.0.0.0:${port}`);
  });
}

void bootstrap();
