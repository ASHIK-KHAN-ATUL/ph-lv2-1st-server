import type { IncomingMessage, ServerResponse } from "http";
import { productController } from "../controller/product.controller";


export const routeHandler = ( req : IncomingMessage, res: ServerResponse) =>{
     // console.log(req.url); '/', '/users', '/products', '/orders'
    // console.log(req.method); 'GET', 'POST', 'PUT', 'DELETE'

    const url = req.url;
    const method = req.method;

    if(url === "/" && method === "GET") {
        // console.log("This is Root route");
        res.writeHead(200, {"Content-type" : "application/json"});
        res.end(JSON.stringify({message: "This is Root route"}));
    } else if(url?.startsWith('/products')){
        productController(req, res)
    } else{
        res.writeHead(404, {"Content-type" : "application/json"})
        res.end(JSON.stringify({message: "Route not found"}));
    }
}