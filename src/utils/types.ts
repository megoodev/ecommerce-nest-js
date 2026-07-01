import { UserRole } from './enum';

export type JwtPayloadType = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
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
