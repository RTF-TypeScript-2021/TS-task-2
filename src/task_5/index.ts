/** Задача 5 - BankTerminal
 * Имеется класс BankTerminal. Класс представляет банковский терминал.
 * Требуется:
  * 1) Реализовать классу BankTerminal 5 методjd:
 * 		1.1) authorize - позволяет авторизировать пользователя c помощью авторизации в BankOffice
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

import {Currency, UserSettingOptions} from '../enums';
import {IMoneyUnit, MoneyRepository} from '../task_1';
import {BankOffice, IBankUser, ICard} from '../task_2';
import {UserSettingsModule} from '../task_3';
import {CurrencyConverterModule} from '../task_4';

export class BankTerminal {
	private _bankOffice: BankOffice;
	private _moneyRepository: MoneyRepository;
	private _userSettingsModule: UserSettingsModule;
	private _currencyConverterModule: CurrencyConverterModule;
	private _authorizedUser: IBankUser;
	private _targetCard: ICard

	constructor(initBankOffice: BankOffice, initMoneyRepository: MoneyRepository) {
		this._moneyRepository = initMoneyRepository;
		this._bankOffice = initBankOffice;
		this._userSettingsModule = new UserSettingsModule(initBankOffice);
		this._currencyConverterModule = new CurrencyConverterModule(initMoneyRepository);
	}

	public authorizeUser(user: IBankUser, card: ICard, cardPin: string): any {
		if(this._bankOffice.authorize(user.id, card.id, cardPin)){
			this._authorizedUser = user
			this._targetCard = card
			this._userSettingsModule.user = user

			return true
		}

		return false
	}

	public takeUsersMoney(moneyUnits: Array<IMoneyUnit>): boolean {
		if (this._authorizedUser) {
			this._targetCard.balance += this._targetCard.currency === Currency.USD? this._currencyConverterModule.calculateSum(moneyUnits, this._targetCard.currency)/70 : this._currencyConverterModule.calculateSum(moneyUnits, this._targetCard.currency)
			return this._moneyRepository.takeMoney(moneyUnits)
		}
	}

	public giveOutUsersMoney(count: number): boolean {
		let buffer: boolean | IMoneyUnit[]
		if(this._authorizedUser || this._targetCard.balance >= count){
			buffer = this._moneyRepository.giveOutMoney(count, this._targetCard.currency,true)
		}
		else return false
		if (typeof (buffer) === 'boolean'){
			return false
		}
		this._targetCard.balance -= this._targetCard.currency === Currency.USD? this._currencyConverterModule.calculateSum(buffer, this._targetCard.currency)/70 : this._currencyConverterModule.calculateSum(buffer, this._targetCard.currency)
		return true
	}

	public changeAuthorizedUserSettings(option: UserSettingOptions, argsForChangeFunction: string): boolean {
		return this._userSettingsModule.changeUserSettings(option, argsForChangeFunction)
	}

	public convertMoneyUnits(fromCurrency: Currency, toCurrency: Currency, moneyUnits: IMoneyUnit): number {
		return this._currencyConverterModule.convertMoneyUnits(fromCurrency, toCurrency, moneyUnits)
	}
}