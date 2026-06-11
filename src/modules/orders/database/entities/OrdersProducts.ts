import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Product } from "@modules/products/database/entities/Product";
import { Order } from "./Order";

@Entity("orders_products")
class OrdersProducts {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Order, (order) => order.order_products)
  @JoinColumn({ name: "order_id" })
  order!: Order;

  @Column()
  order_id!: string;

  @ManyToOne(() => Product, (product) => product.order_products)
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @Column()
  product_id!: string;

  @Column("decimal")
  price!: number;

  @Column("int")
  quantity!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}

export default OrdersProducts;
