import { Request, Response } from "express";
import ShowProductService from "../services/ShowProductServices";
import UpdateProductService from "../services/UpdateProductServices";
import DeleteProductService from "../services/DeleteProductServices";
import ListProductService from "../services/ListProductServices";
import { CreateProductService } from "../services/CreateProductServices";

export default class ProductsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProductsService = new ListProductService();
    const products = await listProductsService.execute();

    return response.json(products);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const id = request.params.id as string;
    const showProductService = new ShowProductService();
    const product = await showProductService.execute({ id });

    return response.json(product);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, price, quantity } = request.body as {
      name: string;
      price: number;
      quantity: number;
    };
    const createProductService = new CreateProductService();
    const product = await createProductService.execute({
      name,
      price,
      quantity,
    });

    return response.json(product);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const id = request.params.id as string;
    const { name, price, quantity } = request.body as {
      name: string;
      price: number;
      quantity: number;
    };
    const updateProductService = new UpdateProductService();
    const product = await updateProductService.execute({
      id,
      name,
      price,
      quantity,
    });

    return response.json(product);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const id = request.params.id as string;
    const deleteProductService = new DeleteProductService();
    await deleteProductService.execute({ id });
    return response.status(204).send();
  }
}
