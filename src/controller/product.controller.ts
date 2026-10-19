import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProduct } from "../service/product.service";
import type { IProduct } from "../product.type";
import { parseBody } from "../utility/parseBody";
import { sendResponse } from "../utility/sendResponse";

export const productController = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const url = req.url;
  const method = req.method;

  const urlParts = url?.split("/");
  const id =
    urlParts && urlParts[1] === "products" ? Number(urlParts[2]) : null;

  //Get all products---------------------------------------------------
  if (url === "/products" && method === "GET") {
    try {
      const products = readProduct();
      return sendResponse(
        res,
        200,
        true,
        "Products retrieved successfully",
        products,
      );
    } catch (error) {
      return sendResponse(res, 500, false, "Something went wrong", null);
    }
  }

  //Get Single Product---------------------------------------------------
  else if (method === "GET" && id != null) {
    try {
      const products = readProduct();
      const product = products.find((p: IProduct) => p.id === id);
      if (!product) {
        return sendResponse(res, 404, false, "Product not found", null);
      }
      return sendResponse(
        res,
        200,
        true,
        "Product retrieved successfully",
        product,
      );
    } catch (error) {
      return sendResponse(res, 500, false, "Something went wrong", null);
    }
  }

  // Create Product---------------------------------------------------
  else if (method === "POST" && url === "/products") {
    try {
      const body = await parseBody(req);

      const products = readProduct();
      const newProduct = {
        id: Date.now(),
        ...body,
      };

      products.push(newProduct);
      insertProduct(products);
      return sendResponse(
        res,
        200,
        true,
        "Product created successfully",
        newProduct,
      );
    } catch (error) {
      return sendResponse(res, 500, false, "Something went wrong", null);
    }
  }

  // Update Product---------------------------------------------------
  else if (method === "PUT" && id !== null) {
    try {
      const body = await parseBody(req);
      const products = readProduct();
      const index = products.findIndex((p: IProduct) => p.id === id);

      if (index < 0) {
        return sendResponse(res, 404, false, "Product not found", null);
      }

      products[index] = { id: products[index].id, ...body };
      insertProduct(products);
      return sendResponse(
        res,
        200,
        true,
        "Product updated successfully",
        products[index],
      );
    } catch (error) {
      return sendResponse(res, 500, false, "Something went wrong", null);
    }
  }

  // Delete Product---------------------------------------------------
  else if (method === "DELETE" && id !== null) {
    try {
      const products = readProduct();
      const index = products.findIndex((p: IProduct) => p.id === id);

      if (index < 0) {
        return sendResponse(res, 404, false, "Product not found", null);
      }

      products.splice(index, 1);
      insertProduct(products);
      return sendResponse(res, 200, true, "Product deleted successfully", null);
    } catch (error) {
      return sendResponse(res, 500, false, "Something went wrong", null);
    }
  }
};
