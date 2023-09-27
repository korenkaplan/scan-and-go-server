import { Category, ClothingGender, Color, Fabric,  Season } from "src/global/global.enum";

export class CreateItemDto {
    name: string;
    category: Category;
    price: number;
    imageSource: string;
    fabric: Fabric;
    gender: ClothingGender;
    season: Season;
    colors: Color[]
}