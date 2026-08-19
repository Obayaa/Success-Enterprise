import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const reference = searchParams.get('reference');

  if (!reference) {
    return NextResponse.redirect(new URL('/checkout?error=missing-reference', origin));
  }

  const order = await prisma.order.findUnique({ where: { id: reference } });
  if (!order) {
    return NextResponse.redirect(new URL('/checkout?error=order-not-found', origin));
  }

  if (order.status === 'PENDING') {
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    const verifyData = await verifyRes.json();

    const paid =
      verifyRes.ok &&
      verifyData?.data?.status === 'success' &&
      verifyData?.data?.amount === order.totalAmount;

    if (!paid) {
      return NextResponse.redirect(new URL('/checkout?error=payment-not-confirmed', origin));
    }

    await prisma.$transaction([
      prisma.order.update({ where: { id: order.id }, data: { status: 'PAID' } }),
      ...(await prisma.orderItem.findMany({ where: { orderId: order.id } })).map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      ),
    ]);
  }

  return NextResponse.redirect(new URL(`/order-confirmation/${reference}`, origin));
}
