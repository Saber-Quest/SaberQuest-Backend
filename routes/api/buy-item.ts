import { Router } from "express";
const router = Router();
import { decrypt } from "../../functions/encryption";
import User from "../../models/user";
import shop from "../../models/shop";
import io from "../../websocket/websocket";

router.post("/", async (req, res) => {
    const token = req.headers.user;
    const item = req.headers.item

    const id = decrypt(String(token));

    const user = await User.findOne({ userId: id }).exec();

    if (!user) return res.status(404).json({ message: "User not found" });

    const itemData = await shop.findOne({ id: item }).exec();

    const price = Number(itemData!.price);

    if (user.qp >= price) {
        let collectibles = user.collectibles;

        const collectible = collectibles.find(collectible => collectible.name === itemData!.id);

        if (collectible) {
            collectible.amount += 1;
        } else {
            collectibles.push({ name: itemData!.id, amount: 1 });
        }

        user.qp -= price;

        await User.updateOne({ userId: id }, { qp: user.qp, collectibles: collectibles, value: user.value + Number(itemData!.value) });

        io.emit("itemBought", {
            userId: id,
            item: itemData!.id,
            qp: user.qp,
            value: user.value + Number(itemData!.value),
            price: price
        });

        const people = await User.find().exec();

        people.sort((a, b) => b.value - a.value);
        people.forEach((person, index) => {
            person.r = index + 1;
            person.save();
        });

        res.status(200).json({
            success: true,
            message: "User updated successfully!",
            user: user.userId,
            qp: user.qp,
            item: itemData!.id,
        });
    } else {
        res.status(200).json({
            message: "User does not have enough QP to buy this item"
        });
    }
});

export default router;