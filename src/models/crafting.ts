export class Crafting {
    item1_id: string;
    item2_id: string;
    crafted_id: string;
    constructor(item1_id: string, item2_id: string, crafted_id: string) {
        this.item1_id = item1_id;
        this.item2_id = item2_id;
        this.crafted_id = crafted_id;
    }
}