import { RequestHandler } from "express";

export interface IRoutes {
    route: string,
    type: string,
    function: RequestHandler
}