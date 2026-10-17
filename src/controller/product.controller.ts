import type { IncomingMessage, ServerResponse } from "http";
import { readProduct } from "../service/product.service";
import type { IProduct } from "../product.type";
import { parseBody } from "../utility/parseBody";

export const productController = async(req: IncomingMessage, res: ServerResponse) => {

    // console.log("Request",req);

    const url = req.url;
    const method = req.method;

    // /products => /product/1 =>
    const urlParts = url?.split('/');
    // console.log(urlParts);
    const id = urlParts && urlParts[1] === 'products' ? Number(urlParts[2]) : null;
    // console.log(id);

    //Get all products
    if (url === "/products" && method === "GET") {

        const products = readProduct();

        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify({
            message: "Products retrived successfully",
            data: products
        }));
    } else if (method === "GET" && id != null) {
        const products = readProduct();
        const product = products.find((p: IProduct) => p.id === id);
        // console.log(product);

        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify({
            message: "Product retrived successfully",
            data: product
        }));
    } else if (method === "POST" && url === '/products') {

        const body = await parseBody(req);
        console.log("Body : ",body)

        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify({
            message: "Product created successfully",
            // data: product
        }));
    }
}