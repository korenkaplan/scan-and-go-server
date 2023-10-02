import mongoose from "mongoose"

export class GetPaidItemDto {
    nfcTagCode: string
    itemId: mongoose.Types.ObjectId
}
export class CreatePaidItemDto {
    nfcTagCode: string
    itemId: mongoose.Types.ObjectId
    itemName: string
}