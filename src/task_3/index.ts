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
 * 			 который возвращает резльтат работы одного из методов из 1.1 - 1.3
 * 			 на основе переданных аргументов
 * 2) Типизировать все свойства и методы класса UserSettingsModule,
 * 	  пользуясь уже предоставленными интерфейсами (избавиться от всех any типов)
*/

import { UserSettingOptions } from '../enums';
import {BankOffice, IBankUser} from "../task_2";

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
		if(this._user === undefined){
			return false;
		}
		let name = this._user.name;
		this._user.name = newName;
		return name != newName;
	}

	private changeUserSurname(newSurname: string): boolean {
		let surname = this._user.surname;
		this._user.surname = newSurname;
		return surname != newSurname;
	}

	private registerForUserNewCard(newCardId: string): boolean {
		let card = this._bankOffice.getCardById(newCardId)
		if (card !== undefined && !this._bankOffice.isCardTiedToUser(newCardId)){
			this._user.cards.push(card);
			return true;
		}
		return false;
	}

	public changeUserSettings(option: UserSettingOptions, argsForChangeFunction: string): boolean {
		if (option == 0){
			return this.changeUserName(argsForChangeFunction);
		} else if (option == 1){
			return this.changeUserSurname(argsForChangeFunction);
		} else if (option == 2){
			return this.registerForUserNewCard(argsForChangeFunction);
		} else {
			return false;
		}
	}
}