import { Reflector } from "@nestjs/core";
import { UserRole } from "src/utils/enum";

export const Roles = Reflector.createDecorator<UserRole[]>()