export class Item {
    id: string;
    name_id: string;
    name: string;
    value: number;
    image: string;
    rarity: string;
}

export class ItemShop {
    id: string;
    price: number | undefined | null;
    item: Item;
    name_id: string;
}