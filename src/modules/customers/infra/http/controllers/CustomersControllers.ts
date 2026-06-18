import { Request, Response } from "express";

import CreateCustomerService from "../../../services/CreateCustomerService";
import DeleteCustomerService from "../../../services/DeleteCustomerService";
import ShowCustomerService from "../../../services/ShowCustomerService";
import UpdateCustomerService from "../../../services/UpdateCustomerService";
import ListCustomerService from "../../../services/ListCustomerService";

import CustomersRepository from "../../../infra/database/repositories/CustomerRepositories";

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
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;

    const customersRepository = new CustomersRepository();

    const listCustomers = new ListCustomerService(customersRepository);

    const customers = await listCustomers.execute(page, limit);

    return response.json(customers);
  };

  show = async (
    request: Request<{ id: string }>,
    response: Response,
  ): Promise<Response> => {
    const id = Number(request.params.id);

    const customersRepository = new CustomersRepository();

    const showCustomer = new ShowCustomerService(customersRepository);

    const customer = await showCustomer.execute({
      id,
    });

    return response.json(customer);
  };

  create = async (
    request: Request<object, object, CreateCustomerBody>,
    response: Response,
  ): Promise<Response> => {
    const { name, email } = request.body;

    const customersRepository = new CustomersRepository();

    const createCustomer = new CreateCustomerService(customersRepository);

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

    const id = Number(request.params.id);

    const customersRepository = new CustomersRepository();

    const updateCustomer = new UpdateCustomerService(customersRepository);

    const customer = await updateCustomer.execute({
      id,
      name,
      email,
    });

    return response.json(customer);
  };

  delete = async (
    request: Request<{ id: string }>,
    response: Response,
  ): Promise<Response> => {
    const id = Number(request.params.id);

    const customersRepository = new CustomersRepository();

    const deleteCustomer = new DeleteCustomerService(customersRepository);

    await deleteCustomer.execute({
      id,
    });

    return response.status(204).send();
  };
}
