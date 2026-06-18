import { ICustumer } from "@modules/custumers/domain/models/ICustumer";
import { ICreateOrderProducts } from "./ICreateOrderProducts";

export interface ICreateOrder {
  customer: ICustumer;
  products: ICreateOrderProducts[];
}
