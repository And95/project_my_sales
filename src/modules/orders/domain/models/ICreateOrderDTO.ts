export interface ICreateOrderDTO {
  customer_id: string;

  products: {
    product_id: string;
    quantity: number;
  }[];
}
