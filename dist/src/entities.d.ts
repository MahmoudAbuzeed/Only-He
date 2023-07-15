import { User } from "./user/entities/user.entity";
import { Role } from "./role/entities/role.entity";
import { Category } from "./category/entities/category.entity";
import { Product } from "./product/entities/product.entity";
export declare const entities: (typeof Product | typeof Category | typeof User | typeof Role)[];
