import { Express, RequestHandler } from "express";
const routes: IRoutes[] = [];

export function GET(route: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        routes.push({
            function: descriptor.value,
            type: "GET",
            route
        });
    }
}

export function PUT(route: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        routes.push({
            function: descriptor.value,
            type: "PUT",
            route
        });
    }
}

export function PATCH(route: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        routes.push({
            function: descriptor.value,
            type: "PATCH",
            route
        });
    }
}

export function DEL(route: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        routes.push({
            function: descriptor.value,
            type: "DEL",
            route
        });
    }
}

export function POST(route: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        routes.push({
            function: descriptor.value,
            type: "POST",
            route
        });
    }
}

export function AllRoute(route: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        routes.push({
            function: descriptor.value,
            type: "ALL",
            route
        });
    }
}

export function setupRoutes(app: Express) {
    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        console.log(route)
        switch (route.type) {
            case "ALL":
                app.all("/" + route.route, route.function)
                break;
            case "POST":
                app.post("/" + route.route, route.function)
                break;
            case "PATCH":
                app.patch("/" + route.route, route.function)
                break;
            case "DEL":
                app.delete("/" + route.route, route.function)
                break;
            case "PUT":
                app.put("/" + route.route, route.function)
                break;
            case "GET":
                app.get("/" + route.route, route.function)
                break;

            default:
                break;
        }
    }
}

interface IRoutes {
    route: string,
    type: string,
    function: RequestHandler
}