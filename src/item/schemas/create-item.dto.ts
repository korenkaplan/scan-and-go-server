import { Category, Color, Fabric, Gender, Season } from "src/global/global.enum";

export class CreateItemDto {
    name: string;
    category: Category;
    price: number;
    imageSource: string;
    fabric: Fabric;
    gender: Gender;
    season: Season;
    colors: Color[]
}