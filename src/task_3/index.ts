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
import { BankOffice, IBankUser, ICard} from '../task_2';
import { Currency } from '../enums';

export class UserSettingsModule {
    private _bankOffice: BankOffice;
    private _user: IBankUser;

    public set user(user: IBankUser) {
        this._user = user;
    }

    public get user() {
        return this._user;
    }

    constructor(initialBankOffice: BankOffice) {
        this._bankOffice = initialBankOffice;
    }

    private changeUserName(newName: string): boolean {
        if (this.user && this.user.name !== newName) {
            this.user.name = newName;

            return true;
        }
        
        return false;
    }

    private changeUserSurname(newSurname: string): boolean {
        if (this._user.surname === newSurname){
            return false;
        } else{
            this._user.surname = newSurname;
            
            return true;
        }
    }

    private registerForUserNewCard(newCardId: string, currencyNewCard?: Currency, pinNewCard?: string): boolean {
        const BankHaveCard = this._bankOffice.getCardById(newCardId);
        if (BankHaveCard === undefined || this._bankOffice.isCardTiedToUser(newCardId)) {
            return false;
        }
        const newCard: ICard = {
            id : newCardId,
            balance: 0,
            currency: currencyNewCard,
            pin: pinNewCard
        }

        //Нужно еще запросить ввести currency и pin
        
        this.user.cards.push(newCard);

        return true;
    }

    public changeUserSettings(option: UserSettingOptions, argsForChangeFunction: string): boolean {
        if (option === UserSettingOptions.name)	{
            return this.changeUserName(argsForChangeFunction);
        } else if (option === UserSettingOptions.surname) {
            return this.changeUserSurname(argsForChangeFunction);
        } else {
            return this.registerForUserNewCard(argsForChangeFunction);
        }
    }
}