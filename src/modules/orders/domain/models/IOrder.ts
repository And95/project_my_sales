import { ICustumer } from "@modules/custumers/domain/models/ICustumer";
import { ICreateOrderProducts } from "./ICreateOrderProducts";

export interface IOrder {
  id: string;
  order?: number;
  customer: ICustumer;
  order_products: ICreateOrderProducts[];
  created_at: Date;
  updated_at: Date;
}
