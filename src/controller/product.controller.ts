import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProduct } from "../service/product.service";
import type { IProduct } from "../product.type";
import { parseBody } from "../utility/parseBody";

export const productController = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  // console.log("Request",req);

  const url = req.url;
  const method = req.method;

  // /products => /product/1 =>
  const urlParts = url?.split("/");
  // console.log(urlParts);
  const id =
    urlParts && urlParts[1] === "products" ? Number(urlParts[2]) : null;
  // console.log(id);

  //Get all products
  if (url === "/products" && method === "GET") {
    const products = readProduct();

    res.writeHead(200, { "Content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products retrived successfully",
        data: products,
      }),
    );
  } else if (method === "GET" && id != null) {
    const products = readProduct();
    const product = products.find((p: IProduct) => p.id === id);
    // console.log(product);

    res.writeHead(200, { "Content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product retrived successfully",
        data: product,
      }),
    );
  } else if (method === "POST" && url === "/products") {
    const body = await parseBody(req);
    // console.log("Body : ",body);

    const products = readProduct();
    const newProduct = {
      id: Date.now(),
      ...body,
    };
    // console.log(newProduct);

    products.push(newProduct);
    // console.log(products);
    insertProduct(products);

    res.writeHead(200, { "Content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product created successfully",
        data: newProduct,
      }),
    );
  } else if (method === "PUT" && id !== null) {
    const body = await parseBody(req);
    const products = readProduct();
    const index = products.findIndex((p: IProduct) => p.id === id);
    // console.log("Index of product", index);
    if (index < 0) {
      res.writeHead(200, { "Content-type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Product Not Found ",
          data: null,
        }),
      );
    }

    // console.log(products[index]);
    products[index] = { id: products[index].id, ...body };

    insertProduct(products);


    res.writeHead(200, { "Content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product Updated successfully",
        data: products[index],
      }),
    );
  }


};
