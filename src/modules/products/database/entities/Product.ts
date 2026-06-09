import OrdersProducts from "@modules/orders/database/entities/OrdersProducts";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id!: string;

  @OneToMany(() => OrdersProducts, (order_products) => order_products.product)
  order_products?: OrdersProducts[];

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "decimal" })
  price!: number;

  @Column({ type: "int" })
  quantity!: number;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;
}
