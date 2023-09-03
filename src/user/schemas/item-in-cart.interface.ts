import { Types } from "mongoose"
import { Category } from "src/global/global.enum"

export class ItemInCart {
    itemId: Types.ObjectId
    nfcTagCode: string
    name: string
    category: Category
    price: number
    imageSource: string
}