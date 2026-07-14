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
      const finalCart = await tx.cart.update({
        where: { userId },
        data: {
          totalPrice: {
            increment: product.price,
          },
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
      const exCart = await tx.cart.findUnique({
        where: {
          userId,
        },
        include: {
          coupons: true,
        },
      });
      const exCoupon = exCart.coupons.find(
        (coupon) => coupon.name.toLowerCase() === name.toLowerCase(),
      );
      if (exCoupon) {
        throw new BadRequestException('Coupon already applayed');
      }
      const cart = await tx.cart.update({
        where: {
          userId,
        },
        data: {
          coupons: {
            set: coupon,
          },
          totalDiscount: {
            increment: coupon.discount,
          },
        },
        include: {
          items: {
            include: { product: true },
          },
          coupons: true,
        },
      });
      return {
        status: 201,
        message: 'apllay coupon successfully',
        data: cart,
      };
    });
  }

  async updateTotalPrice(userId: UUID, tx: any, cart: cartIncloudeRelations) {
    const totalPrice =
      cart.items.reduce(
        (sum, item) =>
          sum +
          (Number(item.product.price) - item.product.discound) * item.quantity,
        0,
      ) + cart.coupons.reduce((sum, coupon) => sum + coupon.discount, 0);

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
    if (!updateCartDto.adjustment && !updateCartDto.quantity) {
      throw new BadRequestException(
        'You must provide either quantity or adjustment',
      );
    }
    return await this.databaseSercice.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: true } } },
      });
      if (!cart) throw new BadRequestException('Cart not found');
      const item = await tx.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: id,
          },
        },
        include: {
          product: true,
        },
      });
      if (!item) {
        throw new BadRequestException('item not found');
      }

      let quantityUpdate: any;

      if (updateCartDto?.quantity) {
        quantityUpdate = { set: updateCartDto.quantity };
      } else if (updateCartDto.adjustment) {
        if (updateCartDto.adjustment === -1) {
          quantityUpdate = { decrement: 1 };
        } else {
          quantityUpdate = { increment: 1 };
        }
      }

      if (
        (updateCartDto.adjustment &&
          updateCartDto.adjustment == -1 &&
          item.quantity == 1) ||
        (updateCartDto.quantity && updateCartDto.quantity === 0)
      ) {
        const cartAfterDeleted = await tx.cart.update({
          where: {
            id: cart.id,
          },
          data: {
            totalPrice: { decrement: item.product.price },
            items: {
              delete: {
                id: item.id,
              },
            },
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
        return {
          status: 200,
          message: 'item deleted successfully',
          data: cartAfterDeleted,
        };
      }
      const totalPrice = cart.totalPrice;
      const oldprice = item.product.price * item.quantity;
      const newPrice = item.product.price * updateCartDto.quantity;

      const updatedCart = await tx.cart.update({
        where: {
          userId,
        },
        data: {
          ...(updateCartDto.quantity && {
            totalPrice: { set: totalPrice - oldprice + newPrice },
          }),
          ...(updateCartDto.adjustment && {
            totalPrice: {
              ...(updateCartDto.adjustment == 1
                ? { increment: item.product.price }
                : { decrement: item.product.price }),
            },
          }),

          items: {
            update: {
              where: {
                cartId_productId: {
                  cartId: cart.id,
                  productId: item.product.id,
                },
              },
              data: {
                quantity: quantityUpdate,
              },
            },
          },
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

      return {
        status: 200,
        message: 'Cart updated successfully',
        data: updatedCart,
      };
    });
  }

  async remove(
    id: string,
    userId: string,
  ): Promise<AppResponse<Cart> & { cartItem?: number }> {
    return await this.databaseSercice.$transaction(async (tx) => {
      const { data: cart } = await this.find(userId);

      const item = cart.items.find((item) => item.productId === id);
      if (!item) throw new BadRequestException('Product not found in cart');

      const finalCart = await tx.cart.update({
        where: {
          userId,
        },
        data: {
          totalPrice: {
            decrement: item.product.price * item.quantity,
          },
          items: {
            delete: {
              cartId_productId: {
                cartId: cart.id,
                productId: id,
              },
            },
          },
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
