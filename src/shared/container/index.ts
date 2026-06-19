import CustomersRepository from "@modules/customers/infra/database/repositories/CustomerRepositories";
import { ICustomersRepository } from "@modules/customers/domain/repositories/ICustomersRepositories";
import { ProductsRepository } from "@modules/products/infra/database/repositories/ProductsRepositories";
import { IProductsRepository } from "@modules/products/domain/repositories/IProductsRepository";
import { OrdersRepository } from "@modules/orders/infra/database/repositories/OrderRepostories";
import { IOrdersRepository } from "@modules/orders/domain/repositories/IOrdersRepository";
import { UsersRepository } from "@modules/users/infra/database/repositories/UsersRepositories";
import { IUsersRepository } from "@modules/users/domain/repositories/IUserRepositories";
import { UserTokensRepository } from "@modules/users/infra/database/repositories/UserTokensRepositories";
import { IUserTokensRepository } from "@modules/users/domain/repositories/IUserTokensRepository";
import { container } from "tsyringe";

container.registerSingleton<ICustomersRepository>(
  "CustomersRepository",
  CustomersRepository,
);

container.registerSingleton<IProductsRepository>(
  "ProductsRepository",
  ProductsRepository,
);

container.registerSingleton<IOrdersRepository>(
  "OrdersRepository",
  OrdersRepository,
);

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  "UserTokensRepository",
  UserTokensRepository,
);
