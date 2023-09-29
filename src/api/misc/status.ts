import { GET } from "../../router";
import { Request, Response } from "express";

export class Status {
    @GET("status")
    async get(req: Request, res: Response) {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor(uptime / 3600) % 24;
        const minutes = Math.floor(uptime / 60) % 60;
        const seconds = Math.floor(uptime % 60);

        const memUsage = process.memoryUsage();

        // Get the CPU usage in percentage since the last call
        const cpuUsage = process.cpuUsage();

        const cpuUsagePercent = Math.round(
            (cpuUsage.user + cpuUsage.system) / 1000 / 1000 / uptime
        );

        const JsonResponse = {
            uptime: `${days}d ${hours}h ${minutes}m ${seconds}s`,
            uptimeSeconds: uptime,
            cpuUsage: cpuUsagePercent,
            memUsage: parseFloat((memUsage.heapUsed / 1000000).toFixed(2)),
        };

        return res.status(200).json(JsonResponse);
    }
}