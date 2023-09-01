"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entities = void 0;
const order_item_entity_1 = require("./orderItem/entities/order-item.entity");
const category_entity_1 = require("./category/entities/category.entity");
const product_entity_1 = require("./product/entities/product.entity");
const order_entity_1 = require("./order/entities/order.entity");
const user_entity_1 = require("./user/entities/user.entity");
const role_entity_1 = require("./role/entities/role.entity");
exports.entities = [user_entity_1.User, role_entity_1.Role, category_entity_1.Category, product_entity_1.Product, order_entity_1.Order, order_item_entity_1.OrderItem];
//# sourceMappingURL=entities.js.map