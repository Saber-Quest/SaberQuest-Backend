import { Router } from "express";
const router = Router();

router.get("/", async (req, res) => {
    const url = String(req.query.link);

    const response = await fetch(url).then(res => res.json());

    res.json(response);
});

export default router;