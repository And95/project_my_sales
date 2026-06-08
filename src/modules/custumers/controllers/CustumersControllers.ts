import { Request, Response } from "express";
import CreateCustomerService from "../services/CreateCustumerService";
import DeleteCustomerService from "../services/DeleteCustumerService";
import ShowCustomerService from "../services/ShowCustumerService";
import UpdateCustomerService from "../services/UpdateCustumerService";
import ListCustomerService from "../services/ListCustumerService";

interface CreateCustomerBody {
  name: string;
  email: string;
}

interface UpdateCustomerBody {
  name: string;
  email: string;
}

export default class CustomersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listCustomers = new ListCustomerService();
    const customers = await listCustomers.execute();
    return response.json(customers);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const id = Number(request.params.id);
    const showCustomer = new ShowCustomerService();
    const customer = await showCustomer.execute({ id });
    return response.json(customer);
  }

  public async create(
    request: Request<object, object, CreateCustomerBody>,
    response: Response,
  ): Promise<Response> {
    const { name, email } = request.body;
    const createCustomer = new CreateCustomerService();
    const customer = await createCustomer.execute({
      name,
      email,
    });
    return response.json(customer);
  }

  public async update(
    request: Request<{ id: string }, object, UpdateCustomerBody>,
    response: Response,
  ): Promise<Response> {
    const { name, email } = request.body;
    const id = Number(request.params.id);
    const updateCustomer = new UpdateCustomerService();
    const customer = await updateCustomer.execute({
      id,
      name,
      email,
    });
    return response.json(customer);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const id = Number(request.params.id);
    const deleteCustomer = new DeleteCustomerService();
    await deleteCustomer.execute({ id });
    return response.json([]);
  }
}
