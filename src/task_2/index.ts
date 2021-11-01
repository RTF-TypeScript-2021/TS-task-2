/* eslint-disable indent */
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
        const user = this.getUserById(userId);        
        const card = this.getCardById(cardId);
        if (user === undefined || card === undefined || card.pin !== cardPin) {
            return false;
        }
        if (user.cards.includes(card)) {
            return true;
        }

        return false;
	}

    private getUserById(userId: string) : IBankUser {
        return this._users.find(user => user.id === userId);
    }

    public getCardById(cardId: string): ICard {
        for (const card of this._cards) {
            if (card.id === cardId) {
                return card;
            }
        }
        for (const user of this._users) {
            for (const card of user.cards) {
                if (card.id === cardId) {
                    return card;
                }
            }
        }

        return undefined;
	}

	public isCardTiedToUser(cardId: string): boolean {
        for (const user of this._users) {
            for (const card of user.cards) {
                if (card.id === cardId) {
                    return true;
                }
            }
        }

        return false;
	}
}