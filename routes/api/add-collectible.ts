import { Router } from "express";
const router = Router();
import User from "../../models/user";
import shop from "../../models/shop";
import { decrypt } from "../../functions/encryption";
import io from "../../websocket/websocket";

router.put("/", async (req, res) => {
    const userId = decrypt(String(req.headers.user));
    const collectible = req.query.item;

    try {
        const user = await User.findOne({ userId: userId }).exec();

        const itemData = await shop.findOne({ id: collectible }).exec();

        user!.collectibles.push({ name: itemData!.id, amount: 1 });

        const currentUserValue = user!.value;
        const itemValue: number = Number(itemData!.value);

        await User.updateOne({ userId: userId }, { collectibles: user!.collectibles, value: currentUserValue + itemValue });

        io.emit("userUpdate", {
            userId: userId,
            type: "add",
            collectibles: collectible,
            value: user!.value
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
            user: user!.userId,
            collectible: itemData!.id,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Connecting to database failed!'
        });
    }
});

export default router;