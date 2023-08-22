import mongoose from "mongoose";

export class RecentItem {
    itemId: mongoose.Schema.Types.ObjectId
    imageSource: string
    name: string
}