import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type CheckoutBody = {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  items: { productId: string; quantity: number }[];
};

export async function POST(request: Request) {
  const body: CheckoutBody = await request.json();

  const itemsValid =
    Array.isArray(body.items) &&
    body.items.length > 0 &&
    body.items.every((i) => typeof i.productId === 'string' && Number.isInteger(i.quantity));

  if (!body.customerName || !body.phone || !body.email || !body.address || !itemsValid) {
    return NextResponse.json({ error: 'Missing or invalid fields.' }, { status: 400 });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: body.items.map((i) => i.productId) }, published: true },
  });

  let totalAmount = 0;
  const orderItemsData: { productId: string; quantity: number; price: number }[] = [];

  for (const item of body.items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return NextResponse.json({ error: 'One of the items is no longer available.' }, { status: 400 });
    }
    if (item.quantity < 1 || item.quantity > product.stock) {
      return NextResponse.json({ error: `Not enough stock for ${product.name}.` }, { status: 400 });
    }
    totalAmount += product.price * item.quantity;
    orderItemsData.push({ productId: product.id, quantity: item.quantity, price: product.price });
  }

  const order = await prisma.order.create({
    data: {
      customerName: body.customerName,
      phone: body.phone,
      email: body.email,
      address: body.address,
      totalAmount,
      items: { create: orderItemsData },
    },
  });

  await prisma.order.update({ where: { id: order.id }, data: { paystackRef: order.id } });

  return NextResponse.json({ orderId: order.id, amount: totalAmount, email: body.email });
}
