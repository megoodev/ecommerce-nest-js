import { UserRole } from './enum';

export type JwtPayloadType = {
  name: string;
  role: UserRole;
  email: string;
};
export type UserRes = {
  status: number;
  message: string;
  data:
    | {
        id: string;
        email: string;
        name: string;
        role: UserRole;
        active: boolean;
      }[]
    | {
        id: string;
        email: string;
        name: string;
        role: UserRole;
        active: boolean;
      };
};
