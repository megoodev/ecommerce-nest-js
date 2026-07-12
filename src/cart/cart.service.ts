import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { DatabaseService } from 'src/database/database.service';
import { AppResponse, cartIncloudeRelations } from 'src/utils/types';
import { type UUID } from 'crypto';
import { Cart, CartItem } from 'generated/prisma/client';

@Injectable()
export class CartService {
  constructor(private readonly databaseSercice: DatabaseService) {}

  async create(userId: string, createCartDto: CreateCartDto) {
    return await this.databaseSercice.$transaction(async (tx) => {
      // check of product find or not
      const product = await tx.product.findUnique({
        where: { id: createCartDto.productId },
      });
      if (!product) throw new NotFoundException('Product not found');

      // check of quanitiy

      if (product.quantity == 0)
        throw new ConflictException('Quantity not enough');
      // if cart found else create new cart
      let cart = await tx.cart.upsert({
        where: { userId },
        create: { userId },
        update: {},
      });
      const exItem = await tx.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: createCartDto.productId,
          },
        },
      });
      if (exItem) {
        throw new BadRequestException(
          'Item already find in items, use patch route to increment or decrement',
        );
      }
      await tx.cartItem.create({
        data: {
          cartId: cart.id,
          productId: createCartDto.productId,
        },
      });
      const { data: finalCart } = await this.find(userId);

      await this.updateTotalPrice(userId as UUID, tx, finalCart);
      return {
        status: 201,
        message: 'Cart updated successfully',
        data: finalCart,
      };
    });
  }
  async apllayCoupon(name: string, userId: string) {
    return await this.databaseSercice.$transaction(async (tx) => {
      const coupon = await tx.coupon.findUnique({
        where: { name },
      });
      if (!coupon) throw new NotFoundException('Coupon not found');
      if (new Date(coupon.expireDate) < new Date())
        throw new BadRequestException('Invalid coupon');
      // const cart = await this.databaseSercice.cart.findUnique({
      //   where: { userId },
      //   include: { items: { include: { product: true } } },
      // });
      const cart = await tx.cart.update({
        where: {
          userId,
        },
        data: {
          coupons: {
            set: coupon,
          },
        },
        include: {
          items: {
            include: { product: true },
          },
          coupons: true,
        },
      });
      await this.updateTotalPrice(userId as UUID, tx, cart);
    });
  }
  async updateTotalPrice(userId: UUID, tx: any, cart: cartIncloudeRelations) {
    const totalPrice =
      cart.items.reduce(
        (sum, item) =>
          sum +
          (Number(item.product.price) - item.product.priceAfterDiscount) *
            item.quantity,
        0,
      ) + cart.coupons.reduce((sum, coupon) => sum + coupon.discount, 0) || 0;

    await tx.cart.update({
      where: { userId },
      data: { totalPrice },
    });
  }

  async find(
    userId: string,
  ): Promise<AppResponse<cartIncloudeRelations> & { cartItem?: number }> {
    const cart = await this.databaseSercice.cart.findUnique({
      where: {
        userId: userId,
      },
      include: {
        coupons: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!cart) throw new NotFoundException("user has't cart");
    return {
      status: 200,
      message: 'Cart found',
      cartItem: cart.items.reduce(
        (sum: number, item: CartItem) => sum + item.quantity,
        0,
      ),
      data: cart,
    };
  }

  async update(
    id: string,
    userId: string,
    updateCartDto: UpdateCartDto,
  ): Promise<AppResponse<Cart>> {
    if (
      updateCartDto.adjustment === undefined &&
      updateCartDto.quantity === undefined
    ) {
      throw new BadRequestException(
        'You must provide either quantity or adjustment',
      );
    }
    return await this.databaseSercice.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({ where: { userId } });
      if (!cart) throw new BadRequestException('Cart not found');

      const product = await tx.product.findUnique({ where: { id } });
      if (!product) throw new NotFoundException('Product not found');

      let updateData: any = {};
      if (updateCartDto.adjustment !== undefined) {
        updateData.quantity = { increment: updateCartDto.adjustment };
      } else if (updateCartDto.quantity !== undefined) {
        updateData.quantity = { set: updateCartDto.quantity };
      }

      const updatedItem = await tx.cartItem.update({
        where: {
          cartId_productId: { cartId: cart.id, productId: id },
        },
        data: updateData,
      });
      if (updatedItem.quantity > product.quantity) {
        throw new ConflictException('Quantity exceeds available stock');
      }

      if (updatedItem.quantity <= 0) {
        await tx.cartItem.delete({
          where: { id: updatedItem.id },
        });
      }
      const finalCart = await tx.cart.findUnique({
        where: { id: cart.id },
        include: {
          coupons: true,
          items: {
            include: { product: true },
          },
        },
      });

      await this.updateTotalPrice(userId as UUID, tx, finalCart);

      return {
        status: 200,
        message: 'Cart updated successfully',
        isEmpty: finalCart.items.length === 0,
        length: finalCart.items.length,
        data: finalCart,
      };
    });
  }

  async remove(
    id: UUID,
    userId: string,
  ): Promise<AppResponse<Cart> & { cartItem?: number }> {
    return await this.databaseSercice.$transaction(async (tx) => {
      const { data: cart } = await this.find(userId);

      const itemIndex = cart.items.findIndex((item) => item.productId === id);
      if (itemIndex === -1)
        throw new BadRequestException('Product not found in cart');
      await tx.cartItem.delete({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: id,
          },
        },
      });
      const { data: finalCart } = await this.find(userId);
      await this.updateTotalPrice(userId as UUID, tx, finalCart);

      return {
        status: 200,
        message: 'Item deleted successfully',
        length: finalCart.items.reduce((sum, item) => sum + item.quantity, 0),
        data: finalCart,
      };
    });
  }

  // ========== admin routes ==========
  async findAll(id: string): Promise<AppResponse<Cart[]>> {
    const carts = await this.databaseSercice.cart.findMany({
      ...(id && { where: { userId: id } }),
    });

    return {
      status: 200,
      message: 'Carts find',
      isEmpty: carts.length === 0,
      length: carts.length,
      data: carts,
    };
  }
  async findByUser(userId: string): Promise<AppResponse<Cart>> {
    const cart = await this.databaseSercice.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    if (!cart) throw new NotFoundException("This user has't cart");
    return {
      status: 200,
      message: 'User cart found',
      isEmpty: cart.items.length == 0,
      length: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      data: cart,
    };
  }
  // ========== admin routes ==========
}
