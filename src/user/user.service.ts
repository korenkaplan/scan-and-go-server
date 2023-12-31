import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import mongoose, { FilterQuery, Mongoose, Types, UpdateWriteOpResult } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs'
import { GetQueryDto, UpdateQueryDto } from 'src/global/global.dto';
import { GlobalService } from 'src/global/global.service';
import { UpdatePasswordQueryDto } from './dto/update-password.dto';
import { ResetPasswordQueryDto } from './dto/reset-password.dto';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { CreditCard } from './schemas/credit-card.schema';
import { ChangeDefaultCardDto } from './dto/change-default-card.dto';
import { DeleteCreditCardDto } from './dto/delete-credit-card.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ItemInCart } from './schemas/item-in-cart.interface';
import { RemoveItemFromCartDto } from './dto/remove-from-cart.dto';
import { INfcTag, NfcTag } from 'src/nfc_tag/schemas/nfc-tag.schema';
import { Item } from 'src/item/schemas/item.schema';
import { RecentTransaction } from './schemas/recent-transactions.interface';
import { log } from 'console';

@Injectable()
export class UserService {
    private MAX_AMOUNT_OF_CREDIT_CARDS = 5
    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>,
        @InjectModel(Item.name)
        private itemModel: mongoose.Model<Item>,
        @InjectModel(NfcTag.name)
        private nfcModel: mongoose.Model<NfcTag>,
        private globalService: GlobalService,
    ) { }
    //#region password change
    async updatePassword(dto: UpdatePasswordQueryDto): Promise<void> {
        const { oldPassword, newPassword, userId } = dto;

        //find the user with the id
        const user = await this.userModel.findById(userId);

        //if not found throw error
        if (!user) throw new NotFoundException(`No user with id ${userId} found in database`);

        //hash oldPassword and compare to user.password
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

        //if not match  return old password incorrect
        if (!isPasswordMatch) throw new BadRequestException('Old password does not match')

        //hash new password and update user password
        user.password = await this.globalService.hashPassword(newPassword)
        await user.save()
    }
    async resetPassword(dto: ResetPasswordQueryDto): Promise<void> {
        const { newPassword, userId } = dto;

        //find the user with the id
        const user = await this.userModel.findById(userId);

        //if not found throw error
        if (!user) throw new NotFoundException(`No user with id ${userId} found in database`);

        //hash new password and update user password
        user.password = await this.globalService.hashPassword(newPassword)
        await user.save()
    }
    //#endregion
    //#region add remove from cart
    async removeItemFromCart(dto: RemoveItemFromCartDto): Promise<ItemInCart[]> {
        const { userId, nfcTagCode } = dto

        //find the user with the id
        const user = await this.userModel.findById(userId);

        // if not found throw error
        if (!user)
            throw new NotFoundException(`User not found with id ${userId}`);


        const beforeLength = user.cart.length

        // remove item from user cart
        user.cart = user.cart.filter(itemInCart => itemInCart.nfcTagCode != nfcTagCode)

        //compare the lengths before and after the removal
        if (user.cart.length == beforeLength)
            throw new NotFoundException(`Item not found in the cart`);

        //save the updates
        await user.save()

        //return the updated cart
        return user.cart
    }
    async addToCart(dto: AddToCartDto): Promise<ItemInCart[]> {
        const { userId, itemInCart } = dto;

        //find the user with the id
        const user = await this.userModel.findById(userId);

        // if not found throw error
        if (!user)
            throw new NotFoundException(`User not found with id ${userId}`);

        //update the user cart 
        user.cart.push(itemInCart)

        //save the updates
        user.markModified('cart')
        await user.save()

        //return the updated cart
        return user.cart
    }
    //#endregion
    //#region Credit Cards
    async addCreditCard(dto: CreateCreditCardDto): Promise<CreditCard[]> {
        const { userId, creditCard } = dto;
        //find the user
        const user = await this.userModel.findById(userId);

        //throw error if user not exists
        if (!user) throw new NotFoundException(`No user with id ${userId} was found in the database`);

        // check if the limit is reached (MAX_AMOUNT_OF_CREDIT_CARDS)
        if (user.creditCards.length >= this.MAX_AMOUNT_OF_CREDIT_CARDS) throw new BadRequestException(`credit cards limit reached (${this.MAX_AMOUNT_OF_CREDIT_CARDS} cards) can't add this credit card`)

        //validate the credit card 
        if (!this.globalService.validateCreditCart(creditCard)) throw new BadRequestException(`Invalid Credit Card`);

        //encrypt the credit card
        const encryptedCard: CreditCard = await this.encryptCreditCard(creditCard);

        //Add _id to the card
        encryptedCard._id = new mongoose.Types.ObjectId();

        if (user.creditCards.length == 0)
        encryptedCard.isDefault = true;

        //check if default set the other as not default
        if (creditCard.isDefault) {
           user.creditCards = user.creditCards.map((creditCard) =>{
            creditCard.isDefault = false;
            return creditCard;
           })
        }
      

         //update the user credit cards array
         user.creditCards.push(encryptedCard);
         
        user.markModified('creditCards');
        await user.save();
        return this.decryptUserCreditCards(user.creditCards);
    }
    decryptCreditCard(card: CreditCard): CreditCard {
        const decryptCreditCard: CreditCard = {
            cardNumber: this.globalService.decryptText(card.cardNumber),
            expirationDate: this.globalService.decryptText(card.expirationDate),
            cardholderName: this.globalService.decryptText(card.cardholderName),
            cvv: this.globalService.decryptText(card.cvv),
            cardType: this.globalService.decryptText(card.cardType),
            isDefault: card.isDefault,
            _id: card._id
        }
        return decryptCreditCard;
    }
    async encryptCreditCard(card: CreditCard): Promise<CreditCard> {
        const CreditCard: CreditCard = {
            cardNumber: await this.globalService.encryptText(card.cardNumber),
            expirationDate: await this.globalService.encryptText(card.expirationDate),
            cardholderName: await this.globalService.encryptText(card.cardholderName),
            cvv: await this.globalService.encryptText(card.cvv),
            cardType: await this.globalService.encryptText(card.cardType),
            isDefault: card.isDefault,
            _id: new Types.ObjectId()
        }
        return CreditCard
    }
    decryptUserCreditCards(creditCards: CreditCard[]): CreditCard[] {
        const decryptedCreditCards = creditCards.map((card) => {
            return this.decryptCreditCard(card);
        });
        return decryptedCreditCards;
    }
    async setDefaultCard(dto: ChangeDefaultCardDto): Promise<string> {
        const { userId, cardId } = dto;

        const user = await this.userModel.findById(userId);
        if (!user)
            throw new NotFoundException(`No user with id ${userId} was found`);
        const cards = user.creditCards
        user.creditCards = cards.map(card => {

            if (card.isDefault && card._id != cardId) {
                card.isDefault = false;
            }
            else if (card._id == cardId) {
                card.isDefault = true;
            }


            return card;
        })

        user.markModified('creditCards');
        await user.save();
        return 'default card changed successfully'
    }
    async deleteCreditCard(dto: DeleteCreditCardDto): Promise<CreditCard[]> {
        const { userId, cardId } = dto
        //find the user
        const user = await this.userModel.findById(userId)

        if (!user)
            throw new NotFoundException(`User not found with id: ${userId}`);
        //get the length before the removal of the card
        const beforeLength = user.creditCards.length

        //find the card and delete
        user.creditCards = user.creditCards.filter(card => card._id != cardId)

        //compare the lengths before and after the removal
        if (user.creditCards.length == beforeLength)
            throw new NotFoundException(`Credit card not found with id: ${cardId}`);

        //if the removed card is default assign the default to first card on the list
        if(user.creditCards.length > 0)
        {
            const defaultCard = user.creditCards.find(card => card.isDefault == true);
            if(!defaultCard)
                user.creditCards[0].isDefault = true;
        }
        //save the user
       user.markModified('creditCards');
        await user.save()
        return this.decryptUserCreditCards(user.creditCards);
    }
    async addMockItemsToCart(userId: string): Promise<User> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException(`User not found with id: ${userId}`);
        }

        const tags: Types.ObjectId[] = [
             new Types.ObjectId('6513f71567d6d6b0e2a9adfd'),
             new Types.ObjectId('6513f79667d6d6b0e2a9ae00'),
             new Types.ObjectId('6513f80167d6d6b0e2a9ae06'),
        ]

        // Use Promise.all to await all the promises and get an array of ItemInCart objects.
        const cartItems: ItemInCart[] = await Promise.all(
            tags.map(async (tag) => {
                const item = await this.itemModel.findById(tag);
                if (!item) {
                    throw new NotFoundException(`Item not found with id: ${tag}`);
                }

                const itemInCart: ItemInCart = {
                    nfcTagCode: tag.toString(),
                    itemId: tag,
                    name: item.name,
                    imageSource: item.imageSource,
                    price: item.price,
                    category: item.category,
                };
                return itemInCart;
            })
        );

        // Assign the array of ItemInCart objects to user.cart.
        user.cart = cartItems;

        // Mark the 'cart' field as modified and save the user.
        user.markModified('cart');
        await user.save();

        return user;
    }
    //#endregion
    //#region CRUD
    async getMany(dto: GetQueryDto<User>): Promise<User[]> {
        const { query, projection } = dto

        const users = await this.userModel.find(query, projection);
        return users.map((user) => {
            return this.decryptUser(user)
        })
    }
    async getOne(dto: GetQueryDto<User>): Promise<User> {
        const { query, projection } = dto
        const user = await this.userModel.findOne(query, projection);
        return this.decryptUser(user)
    }
    async updateOne(dto: UpdateQueryDto<User>): Promise<User> {
        const { query, updateQuery } = dto
        const user = await this.userModel.findOneAndUpdate(query, updateQuery, { new: true });
        if (!user)
            throw new NotFoundException('the query did\'nt found any user ')

        return this.decryptUser(user)
    }
    async updateMany(dto: UpdateQueryDto<User>): Promise<number> {
        const { query, updateQuery } = dto
        const result: UpdateWriteOpResult = await this.userModel.updateMany(query, updateQuery, { new: true });
        return result.modifiedCount
    }
    async deleteOne(query: FilterQuery<User>): Promise<User> {
        const user = await this.userModel.findOneAndDelete(query);
        if (!user)
            throw new NotFoundException('the query did\'nt found any user ')
        return this.decryptUser(user)
    }
    async deleteMany(query: FilterQuery<User>): Promise<number> {
        return (await this.userModel.deleteMany(query)).deletedCount;

    }
    decryptUser(user: User): User {
        if (user.creditCards && user.creditCards.length > 0)
            user.creditCards = this.decryptUserCreditCards(user.creditCards);
        if (user.recentTransactions && user.recentTransactions.length > 0)
            user.recentTransactions = this.decryptUserRecentTransactions(user.recentTransactions);
        return user;
    }
    decryptUserRecentTransactions(recentTransactions: RecentTransaction[]): RecentTransaction[] {
        const decryptedTransactions = recentTransactions.map(transaction => {
            log('Card Number: ' + JSON.stringify(transaction));

            transaction.cardType = this.globalService.decryptText(transaction.cardType);
            transaction.cardNumber = this.globalService.decryptText(transaction.cardNumber);
            return transaction;
        })
        return decryptedTransactions
    }
    //#endregion
}


