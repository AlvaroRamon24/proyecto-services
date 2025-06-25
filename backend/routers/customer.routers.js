import { Router } from "express";
import { verifyToken } from "../config/verify.js";
import * as customerController from "../controllers/customer.controller.js";

const customerRouter = Router();

customerRouter.get("/", verifyToken, customerController.getCustomerAll);
customerRouter.get("/:id", customerController.getCustomerById);
customerRouter.put("/update/:id", customerController.updateCustomer);
customerRouter.delete("/delete/:id", verifyToken,  customerController.deleteCustomer);

export default customerRouter;
