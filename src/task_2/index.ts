/** Задача 1 - BankOffice
 * Имеется класс BankOffice, который должен хранить пользователей и банковские карты.
 * Пользователи банка могу иметь карту, а могут не иметь.
 * Карты могут иметь своего владельца, а могут не иметь.
 * Требуется:
 * 1) Реализовать классу BankOffice 3 метода:
 * 		1.1) authorize - позволяет авторизовать пользователя:
 * 			 Пользователь считается авторизованным, если карта принадлежит ему и пин-код введен корректно.
 * 			 Принимает аргументы userId - id пользователя, cardId - id банковской карты, cardPin - пин-код карты.
 * 			 Если пользователь был успешно авторизован, то метод возвращает true, иначе false.
 * 		1.2) getCardById - позволяет получить объект банковской карты из хранилища по id карты.
 *		1.3) isCardTiedToUser - позволяет по id карты узнать, привязана ли карта к какому-нибудь пользователю
 *			 возвращает true - если карта привязана к какому-нибудь пользователю, false в ином случае.
 * 2) Типизировать все свойства и методы класса MoneyRepository,
 * 	  пользуясь уже предоставленными интерфейсами (избавиться от всех any типов).
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
		let user = this._users.find(user => user.id === userId);
		let card = user.cards.find(card => card.id === cardId);

		return user.cards.indexOf(card) !== -1 && card.pin === cardPin;
	}

	public getCardById(cardId: string): ICard {
		let notLinkedCard = this._cards.find(card => card.id === cardId);
		if (notLinkedCard === undefined)
			return this._users.find(user => user.cards.find(card => card.id === cardId))
			.cards.find(card => card.id === cardId);
		return notLinkedCard;
	}

	public isCardTiedToUser(cardId: string): boolean {
		return this._users.find(
			user => user.cards.find(
				card => card.id === cardId)) !== undefined;
	}
}