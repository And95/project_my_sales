import CreateProductService from "@modules/products/services/CreateProductServices";
import UpdateProductService from "@modules/products/services/UpdateProductServices";
import DeleteProductService from "@modules/products/services/DeleteProductServices";
import ShowProductService from "@modules/products/services/ShowProductServices";
import ListProductService from "@modules/products/services/ListProductServices";
import { Request, Response } from "express";
import { container } from "tsyringe";

interface IProductBody {
  name: string;
  price: number;
  quantity: number;
}

interface IListProductQuery {
  page?: string;
  skip?: string;
  take?: string;
}

export default class ProductsController {
  public async index(request: Request, response: Response) {
    const query = request.query as IListProductQuery;
    const { page = "1", skip = "0", take = "10" } = query;
    const listProductsService = container.resolve(ListProductService);
    const products = await listProductsService.execute({
      page: Number(page),
      skip: Number(skip),
      take: Number(take),
    });

    return response.json(products);
  }

  public async show(request: Request, response: Response) {
    const { id } = request.params as { id: string };
    const showProductService = container.resolve(ShowProductService);
    const product = await showProductService.execute({ id });
    return response.json(product);
  }

  public async create(request: Request, response: Response) {
    const { name, price, quantity } = request.body as IProductBody;
    const createProductService = container.resolve(CreateProductService);
    const product = await createProductService.execute({
      name,
      price,
      quantity,
    });

    return response.status(201).json(product);
  }

  public async update(request: Request, response: Response) {
    const { id } = request.params as { id: string };
    const { name, price, quantity } = request.body as IProductBody;
    const updateProductService = container.resolve(UpdateProductService);
    const product = await updateProductService.execute({
      id,
      name,
      price,
      quantity,
    });

    return response.json(product);
  }

  public async delete(request: Request, response: Response) {
    const { id } = request.params as { id: string };
    const deleteProductService = container.resolve(DeleteProductService);
    await deleteProductService.execute({ id });
    return response.status(204).send();
  }
}
