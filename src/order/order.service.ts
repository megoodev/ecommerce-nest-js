import Stripe from 'stripe';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RawBodyRequest,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { DatabaseService } from 'src/database/database.service';

import { AppResponse } from 'src/utils/types';
import { Request } from 'express';

@Injectable()
export class OrderService {
  private stripe: Stripe;
  constructor(private readonly databaseService: DatabaseService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-06-24.dahlia', // Use the latest API version
    });
  }
  async create(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<AppResponse> {
    return await this.databaseService.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user.address && !createOrderDto.shippingAddress)
        throw new BadRequestException('Address is required');

      const cart = await tx.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: true } } },
      });
      if (!cart || cart.items.length === 0)
        throw new NotFoundException('Cart is empty');

      const taxs = (await tx.tax.findFirst()) || { taxPrice: 0, shipingTax: 0 };

      const totalPriceAfterDiscount =
        cart.totalDiscount != 0 && cart.totalPrice * 0.1 < cart.totalDiscount
          ? cart.totalPrice
          : cart.totalPrice - cart.totalDiscount;
      const order = await tx.order.create({
        data: {
          userId,
          shippingAddress: createOrderDto.shippingAddress || user.address,
          taxPrice: taxs.taxPrice + taxs.shipingTax,
          totalOrderPrice: totalPriceAfterDiscount,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              productName: item.product.title,
              productPrice: item.product.price,
              quantity: item.quantity,
              totalPrice: item.product.price * item.quantity,
            })),
          },
        },
      });
      const thirtyMinutesFromNow = Math.floor(Date.now() / 1000) + 30 * 60;
      const session = await this.stripe.checkout.sessions.create({
        success_url: createOrderDto.success_url,
        cancel_url: createOrderDto.cancel_url,
        payment_method_types: ['card'],

        line_items: cart.items.map(({ color, product, quantity }, i) => ({
          price_data: {
            currency: 'egp',
            unit_amount: Math.round(
              (product.price +
                taxs.shipingTax +
                taxs.taxPrice -
                (i == 0 ? cart.totalDiscount : 0)) *
                100,
            ),
            product_data: {
              name: ` # ${product.title}`,
              description: `- ${product.description}`,

              images: [product.imageCover],
              metadata: {
                color: color,
              },
            },
          },
          quantity,
        })),
        automatic_tax: {
          enabled: true,
        },
        expires_at: thirtyMinutesFromNow,
        mode: 'payment',
        client_reference_id: userId,
        metadata: {
          cart: cart.id,
          orderId: order.id,
        },
      });

      return {
        status: 200,
        message: 'Order created successfully',
        data: {
          sessionId: session.id,
          totalPrice: cart.totalPrice,
          totalAfterDiscount: cart.totalPrice - totalPriceAfterDiscount,
          sessionUrl: session.url,
        },
      };
    });
  }
  async webHook(req: RawBodyRequest<Request>, signature: string) {
    let event: Stripe.Event;
    const raw = req.rawBody;
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    if (!raw) {
      throw new BadRequestException(
        'Webhook signature verification failed: missing raw body',
      );
    }
    try {
      event = this.stripe.webhooks.constructEvent(
        raw,
        signature.toString(),
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      throw new BadRequestException(`Webhook Error: ${error}`);
    }
    await this.processEvent(event);

    return { received: true };
  }
  private async processEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        session.client_reference_id;
        console.log(session.metadata.orderId);
        await this.databaseService.order.update({
          where: {
            id: session.metadata.orderId,
          },
          data: {
            isPaid: true,
            paidAt: new Date(),
            isDeliverd: true,
            deliverAt: new Date(),
          },
        });
        await this.databaseService.cart.delete({
          where: {
            id: session.metadata.cartId,
          },
        });
        break;
      case 'checkout.session.expired':
      case 'payment_intent.canceled':
        const paymentMethod = event.data.object;
        await this.databaseService.order.delete({
          where: {
            id: paymentMethod.metadata.orderId,
          },
        });
        break;
      default:
    }
  }
}
