import { Currency } from '../enums';

interface IDictionary<T> {
    [Key: string]: T;
}

export interface ICard {
	id: string;
	balance: number;
	currency: Currency;
	pin: string;
}

export interface IBankUser {
	id: string;
	name: string;
	surname: string;
	cards: Array<ICard>;
}

export class BankOffice {
    private _users: IDictionary<IBankUser> = {};
	private readonly _usersIds: Array<string> = [];
	private _cards: IDictionary<ICard> = {};

	constructor(users: Array<IBankUser>, cards: Array<ICard>) {
        users.forEach(user => { 
			this._users[user.id] = user;
			this._usersIds.push(user.id);
			user.cards.forEach(card => this._cards[card.id]= card);
		});
		cards.forEach(card => this._cards[card.id] = card);
	}

	public authorize(userId: string, cardId: string, cardPin: string): boolean {
		return this._users[userId].cards.includes(this._cards[cardId]) && this._cards[cardId].pin === cardPin;
	}

	public getCardById(cardId: string): ICard {
		return this._cards[cardId];
	}

	public isCardTiedToUser(cardId: string): boolean {
        return this._usersIds.some(id => this._users[id].cards.find(x => x.id === cardId));
	}
}