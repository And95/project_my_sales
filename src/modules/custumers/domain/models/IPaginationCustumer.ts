import { ICustumer } from "./ICustumer";

export interface IPaginateCustomer {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  total_pages: number;
  prev_page: number | null;
  next_page: number | null;
  data: ICustumer[];
}
