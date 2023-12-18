import prismadb from '@/lib/prismadb';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.json();
  const signature = headers().get('Stripe-Signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.log(err);
    return new NextResponse('An Error Occurred', { status: 500 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressString = addressComponents.filter(component => component !== null).join(', ');

  if (event.type === 'checkout.session.completed') {
    const order = await prismadb.order.update({
      where: {
        id: session.metadata?.id
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session.customer_details?.phone || ''
      },
      include: {
        orderItems: true
      }
    });

    const productIds = order.orderItems.map(product => product.id);

    const products = prismadb.product.updateMany({
      where: {
        id: {
          in: productIds
        }
      },
      data: {
        isArchived: true
      }
    });
  }

  return NextResponse.json(null, { status: 200 });
}