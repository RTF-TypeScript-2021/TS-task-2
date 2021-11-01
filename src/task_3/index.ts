/** Задача 3 - UserSettingsModule
 * Имеется класс UserSettingsModule. Который должен отвечать за
 * изменение настроек пользователя.
 * Требуется:
 * 1) Реализовать классу UserSettingsModule 4 метода:
 * 		1.1) changeUserName - метод, заменяющий имя пользователя на переданное в аргументе
 * 			 возвращает true, если операция удалась и false в ином случае
 * 		1.2) changeUserSurname - метод, заменяющий фамилию пользователя на переданную в аргументе
 * 			 возвращает true, если операция удалась и false в ином случае
 * 		1.3) registerForUserNewCard - метод, привязывающий пользователю банковскую
 * 			 Карта считается успешно привязанной, если она существует и она не привязана ни к одному пользователю
 * 			 возвращает true, если операция удалась и false в ином случае
 * 		1.4) changeUserSettings - управляющий метод
 * 			 который возвращает результат работы одного из методов из 1.1 - 1.3
 * 			 на основе переданных аргументов
 * 2) Типизировать все свойства и методы класса UserSettingsModule,
 * 	  пользуясь уже предоставленными интерфейсами (избавиться от всех any типов)
*/

import {UserSettingOptions} from '../enums';
import {BankOffice, IBankUser, ICard} from "../task_2";

export class UserSettingsModule {
	private _bankOffice: BankOffice;
	private _user: IBankUser;

	public set user(user: IBankUser) {
		this._user = user;
	}

	constructor(initialBankOffice: BankOffice) {
		this._bankOffice = initialBankOffice;
	}

	private changeUserName(newName: string): boolean {
		let oldName: string = this._user?.name;
		if (!this._user || this._user.name === newName) {
			return false;
		}

		this._user.name = newName;
		return oldName !== newName;
	}

	private changeUserSurname(newSurname: string): boolean {
		let oldSurname: string = this._user?.surname;
		if (!this._user || this._user.surname === newSurname) {
			return false;
		}

		this._user.surname = newSurname;
		return oldSurname !== newSurname;
	}

	private registerForUserNewCard(newCardId: string): boolean {
		let card: ICard = this._bankOffice.getCardById(newCardId);
		if (card !== undefined && !this._bankOffice.isCardTiedToUser(newCardId)) {
			this._user.cards.push(card);
			return true;
		}

		return false;
	}

	public changeUserSettings(option: UserSettingOptions, argsForChangeFunction: string): boolean {
		return option === UserSettingOptions.name ? this.changeUserName(argsForChangeFunction)
			: (option === UserSettingOptions.surname ? this.changeUserSurname(argsForChangeFunction)
			: option === UserSettingOptions.newCard ? this.registerForUserNewCard(argsForChangeFunction)
					: false);
	}
}