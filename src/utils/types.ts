import { UserRole } from './enum';

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
  data: T;
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
