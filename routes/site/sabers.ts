import { Router } from "express";
const router = Router();
import * as fs from "node:fs";

let file = String(fs.readFileSync("./public/html/sabers.html", "utf8"));

router.get("/", (req, res) => {
    res.send(file);
});

export default router;