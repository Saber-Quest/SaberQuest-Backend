export class Item {
    id: string;
    name_id: string;
    name: string;
    value: number;
    image: string;
    rarity: string;
    price: number | null;
    constructor(name_id: string, name: string, value: number, image: string, rarity: string, price: number | null) {
        this.name_id = name_id;
        this.name = name;
        this.value = value;
        this.image = image;
        this.rarity = rarity;
        this.price = price;
    }
}

export class ItemShop {
    id: string;
    price: number | undefined | null;
    item: Item;
    name_id: string;
}