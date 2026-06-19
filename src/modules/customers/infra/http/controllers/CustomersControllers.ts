import UpdateCustomerService from "@modules/customers/services/UpdateCustomerService";
import CreateCustomerService from "@modules/customers/services/CreateCustomerService";
import DeleteCustomerService from "@modules/customers/services/DeleteCustomerService";
import ShowCustomerService from "@modules/customers/services/ShowCustomerService";
import ListCustomerService from "@modules/customers/services/ListCustomerService";
import { Request, Response } from "express";
import { container } from "tsyringe";

interface CreateCustomerBody {
  name: string;
  email: string;
}

interface UpdateCustomerBody {
  name: string;
  email: string;
}

export default class CustomersController {
  index = async (request: Request, response: Response): Promise<Response> => {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 10;
    const listCustomers = container.resolve(ListCustomerService);
    const customers = await listCustomers.execute(page, limit);
    return response.json(customers);
  };

  show = async (
    request: Request<{ id: string }>,
    response: Response,
  ): Promise<Response> => {
    const { id } = request.params;
    const showCustomer = container.resolve(ShowCustomerService);
    const customer = await showCustomer.execute({ id: Number(id) });
    return response.json(customer);
  };

  create = async (
    request: Request<object, object, CreateCustomerBody>,
    response: Response,
  ): Promise<Response> => {
    const { name, email } = request.body;
    const createCustomer = container.resolve(CreateCustomerService);
    const customer = await createCustomer.execute({
      name,
      email,
    });

    return response.status(201).json(customer);
  };

  update = async (
    request: Request<{ id: string }, object, UpdateCustomerBody>,
    response: Response,
  ): Promise<Response> => {
    const { name, email } = request.body;
    const { id } = request.params;
    const updateCustomer = container.resolve(UpdateCustomerService);
    const customer = await updateCustomer.execute({
      id: Number(id),
      name,
      email,
    });

    return response.json(customer);
  };

  delete = async (
    request: Request<{ id: string }>,
    response: Response,
  ): Promise<Response> => {
    const { id } = request.params;
    const deleteCustomer = container.resolve(DeleteCustomerService);
    await deleteCustomer.execute({ id: Number(id) });
    return response.json([]);
  };
}
