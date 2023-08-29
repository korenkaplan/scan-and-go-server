import mongoose from "mongoose";

export class RecentItem {
    itemId: mongoose.Types.ObjectId
    imageSource: string
    name: string
}