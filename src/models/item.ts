export class Item {
    name_id: string;
    name: string;
    value: number;
    image: string;
}

export class ItemShop {
    id: string;
    price: number | undefined | null;
    item: Item;
    name_id: string;
}