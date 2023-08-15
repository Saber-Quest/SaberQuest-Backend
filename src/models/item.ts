export class Item {
    id: string;
    value: number;
    image: string;
}

export class ItemShop {
    id: string;
    price: number | undefined | null;
    item: Item;
    item_id: string;
}