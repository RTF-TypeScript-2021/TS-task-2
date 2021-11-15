/** Задача 1 - BankOffice
 * Имеется класс BankOffice. Который должен хранить пользователей и банковские карты.
 * Пользователи банка могу иметь карту, а могут не иметь.
 * Карты могут иметь своего владельца, а могут не иметь.
 * Требуется:
 * 1) Реализовать классу BankOffice 3 метода:
 * 		1.1) authorize - позволяет авторизировать пользователя:
 * 			 Пользователь считается авторизованым, если карта принадлежит ему и пин-код введен корректно
 * 			 Принимает аргументы userId - id пользователя, cardId - id банковской карты, cardPin - пин-код карты
 * 			 Если пользователь был успешно авторизован, то метод возвращает true, иначе false
 * 		1.2) getCardById - позволяет получить объект банковской карты из хранилища по id карты
 *		1.3) isCardTiedToUser - позволяет по id карты узнать, привзяана ли карта к какому-нибудь пользователю
 *			 возвращает true - если карта привязана к какому-нибудь пользователю, false в ином случае
 * 2) Типизировать все свойства и методы класса MoneyRepository,
 * 	  пользуясь уже предоставленными интерфейсами (избавиться от всех any типов)
*/

import { Currency } from '../enums';

export interface ICard {
	id: string;
	balance: number;
	currency: Currency,
	pin: string,
}

export interface IBankUser {
	id: string;
	name: string;
	surname: string;
	cards: Array<ICard>;
}

export class BankOffice {
	private _users: IBankUser[];
	private _cards: ICard[];

	constructor(users: IBankUser[], cards: ICard[]) {
     this._users = users;
     this._cards = cards;
	}

	public authorize(userId: string, cardId: string, cardPin: string): boolean {
		const id = this._users.findIndex((user: IBankUser) => user.id === userId);
		if (id !== -1) {
			return this._users[id].cards.filter((card: ICard) => card.id === cardId && card.pin === cardPin).length > 0;
		}
		return false;
     }


	 public getCardById(cardId: string): ICard {
		if (!this.contains(cardId, this._cards.map(x => x.id))) {
			const cards: ICard[] = [];
			this._users.forEach((user: IBankUser) => {
				user.cards.forEach((card: ICard) => {
					cards.push(card);
				})
			});
			return cards[cards.findIndex((card: ICard) => card.id === cardId)]
		}

		return this._cards[
			this._cards.findIndex((card: ICard) => card.id === cardId)
		];
	}
	public isCardTiedToUser(cardId: string): boolean {
		return this._users.findIndex((user: IBankUser) => this.contains(cardId, user.cards.map(x => x.id))) !== -1
	}

	private contains(item: string, items: string[]): boolean {
		const index = items.findIndex(x => x === item);
		return index !== -1;
	}
} 