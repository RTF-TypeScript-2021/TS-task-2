/** Задача 5 - BankTerminal
 * Имеется класс BankTerminal. Класс представляет банковский терминал.
 * Требуется:
  * 1) Реализовать классу BankTerminal 5 методов:
 * 		1.1) authorize - позволяет авторизовать пользователя c помощью авторизации в BankOffice
 * 		1.2) takeUsersMoney - позволяет авторизованному пользователю положить денежные единицы
 * 			 в хранилище и пополнить свой баланс на карте
 *		1.3) giveOutUsersMoney - позволяет авторизованному пользователю снять денежные единицы
 * 			 с карты и получить их наличными из хранилища
 *		1.4) changeAuthorizedUserSettings - позволяет авторизованному пользователю изменить свои
 * 			 настройки с помощью методов UserSettingsModule
 *		1.5) convertMoneyUnits - позволяет авторизованному пользователю конвертировать валюту
 *			 с помощью методов CurrencyConverterModule
 * 2) Типизировать все свойства и методы класса BankTerminal,
 * 	  пользуясь уже предоставленными интерфейсами (избавиться от всех any типов)
*/

import { Currency, UserSettingOptions } from '../enums';
import {IMoneyUnit, MoneyRepository} from '../task_1';
import {BankOffice, IBankUser, ICard} from '../task_2';
import { UserSettingsModule } from '../task_3';
import { CurrencyConverterModule } from '../task_4';

export class BankTerminal {
	private readonly _bankOffice: BankOffice;
	private readonly _moneyRepository: MoneyRepository;
	private readonly _userSettingsModule: UserSettingsModule;
	private readonly _currencyConverterModule: CurrencyConverterModule;
	private _authorizedUser: IBankUser;
	private _authorizedCard: ICard;

	constructor(initBankOffice: BankOffice, initMoneyRepository: MoneyRepository) {
	    this._moneyRepository = initMoneyRepository;
	    this._bankOffice = initBankOffice;
	    this._userSettingsModule = new UserSettingsModule(initBankOffice);
	    this._currencyConverterModule = new CurrencyConverterModule(initMoneyRepository);
	}

	public authorizeUser(user: IBankUser, card: ICard, cardPin: string): boolean {
	    const isAuthorizedUser = this._bankOffice.authorize(user.id, card.id, cardPin);
	    if (isAuthorizedUser){
	        this._authorizedUser = user;
	        this._userSettingsModule.user = user;
	        this._authorizedCard = card;
	    }

	    return isAuthorizedUser;

	}

	public takeUsersMoney(moneyUnits: IMoneyUnit[]): boolean {
	    if (!this._authorizedUser || !this._authorizedCard){
	        return false;
	    }

	    this._moneyRepository.takeMoney(moneyUnits);
	    moneyUnits.forEach(moneyUnit => {
	        if (this._authorizedCard.currency === moneyUnit.moneyInfo.currency){
	            this._authorizedCard.balance += moneyUnit.count * parseInt(moneyUnit.moneyInfo.denomination);
	        } else {
	            this._authorizedCard.balance += this.convertMoneyUnits(moneyUnit.moneyInfo.currency, this._authorizedCard.currency, moneyUnit);
	        }
	    });

	    return true;
	}

	public giveOutUsersMoney(count: number): boolean {
	    if (!this._authorizedUser || !this._authorizedCard || count > this._authorizedCard.balance){
	        return false;
	    }

	    const isGiven: boolean = this._moneyRepository.giveOutMoney(count, this._authorizedCard.currency)
	    if (isGiven){
	        this._authorizedCard.balance -= count;
	    }

	    return isGiven;
	}

	public changeAuthorizedUserSettings(option: UserSettingOptions, argsForChangeFunction: string): boolean {
	    return this._userSettingsModule.changeUserSettings(option, argsForChangeFunction);
	}

	public convertMoneyUnits(fromCurrency: Currency, toCurrency: Currency, moneyUnits: IMoneyUnit): number {
	    return this._currencyConverterModule.convertMoneyUnits(fromCurrency, toCurrency, moneyUnits);
	}
}