import { GET } from "../../router";
import { Request, Response } from "express";

export class Status {
    /**
     * GET /status
     * @summary Get the status of the API
     * @tags Misc
     * @return {object} 200 - Success
     * @return {string} 500 - Internal server error
     * @example response - 200 - Success
     * {
     * "uptime": "0d 0h 0m 0s",
     * "uptimeSeconds": 0,
     * "cpuUsage": 0,
     * "memUsage": 0
     * }
     * @example response - 500 - Internal server error
     * "Internal server error"
     */
    @GET("status")
    async get(req: Request, res: Response) {
        try {
            const uptime = process.uptime();
            const days = Math.floor(uptime / 86400);
            const hours = Math.floor(uptime / 3600) % 24;
            const minutes = Math.floor(uptime / 60) % 60;
            const seconds = Math.floor(uptime % 60);

            const memUsage = process.memoryUsage();
            const cpuUsage = process.cpuUsage();

            const cpuUsagePercent = Math.round((cpuUsage.user + cpuUsage.system) / 1000 / 1000 / uptime);

            const JsonResponse = {
                uptime: `${days}d ${hours}h ${minutes}m ${seconds}s`,
                uptimeSeconds: uptime,
                cpuUsage: cpuUsagePercent,
                memUsage: parseFloat((memUsage.heapUsed / 1000000).toFixed(2)),
            };

            return res.status(200).json(JsonResponse);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }
}