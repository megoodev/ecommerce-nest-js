import { Prisma, PrismaClient } from 'generated/prisma/client';
import { UserRole } from './enum';
import { PrismaClientExtends } from '@prisma/client/extension';

export type JwtPayloadType = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

/**
 * Generic response type for all API routes
 * @template T - The type of data being returned
 */
export type AppResponse<T = any> = {
  status: number;
  message: string;
  isEmpty?: boolean;
  length?: number;
  data?: T;
};

// ============ DATA TYPES FROM SCHEMA ============

// Brand Data Type
export type BrandData = {
  id: string;
  name: string;
  image: string;
  CreatedAt: Date;
  updatedAt: Date;
};

// Category Data Type
export type CategoryData = {
  id: string;
  name: string;
  image: string;
  subCategories?: SubCategoryData[];
  CreatedAt: Date;
  updatedAt: Date;
};

// SubCategory Data Type
export type SubCategoryData = {
  id: string;
  name: string;
  categoryId?: string;
  category?: CategoryData;
  CreatedAt: Date;
  updatedAt: Date;
};

// Coupon Data Type
export type CouponData = {
  id: string;
  name: string;
  expireDate: Date;
  discount: number;
  CreatedAt: Date;
  updatedAt: Date;
};

// Sublier Data Type
export type SublierData = {
  id: string;
  name: string;
  website: Date;
  CreatedAt: Date;
  updatedAt: Date;
};

// User Data Type
export type UserData = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  Avatar?: string;
  age?: number;
  PhoneNumber?: string;
  address?: string;
  active: boolean;
  VerificationCode?: string;
  gender?: string;
  CreatedAt?: Date;
  updatedAt?: Date;
};
// Requast product data
export type RequestproductData = {
  id: string;
  titleNeed: string;
  detailes: string;
  qauntity?: number;
  category?: string;
  user?: UserData;
};
// Tax data
export type TaxData = {
  id: string;
  taxPrice: number;
  shipingTax: number;
  CreatedAt: Date;
  updatedAt: Date;
};

// 2. Extract the payload type from the args
export type RequestProductWithUser = Prisma.RequestProductGetPayload<{
  select: {
    id: true;
    titleNeed: true;
    detailes: true;
    qauntity: true;
    category: true;
    user: {
      select: {
        id: true;
        name: true;
        email: true;
        role: true;
        active: true;
      };
    };
  };
}>;
export type FormatUserType = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    active: true;
    role: true;
  };
}>;

export type cartIncloudeRelations = Prisma.CartGetPayload<{
  include: {
    coupons: true,
    items: {
      include: {product: true}
    }
  };
}>;
