import { Types } from "mongoose"

export class ItemInCart {
    itemId: Types.ObjectId
    nfcTagCode: string
}