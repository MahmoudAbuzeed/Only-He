"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modules = void 0;
const user_module_1 = require("./user/user.module");
const role_module_1 = require("./role/role.module");
const category_module_1 = require("./category/category.module");
const product_module_1 = require("./product/product.module");
const order_module_1 = require("./order/order.module");
const order_item_module_1 = require("./orderItem/order-item.module");
exports.modules = [user_module_1.UserModule, role_module_1.RoleModule, category_module_1.CategoryModule, product_module_1.ProductModule, order_module_1.OrderModule, order_item_module_1.OrderItemModule];
//# sourceMappingURL=modules.js.map