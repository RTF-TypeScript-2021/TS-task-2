/* eslint-disable indent */
/* eslint-disable no-mixed-spaces-and-tabs */
/** Задача 5 - BankTerminal
 * Имеется класс BankTerminal. Класс представляет банковский терминал.
 * Требуется:
  * 1) Реализовать классу BankTerminal 5 методов:
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

import { Currency, UserSettingOptions } from '../enums';
import { IMoneyUnit, MoneyRepository } from '../task_1';
import { BankOffice, IBankUser, ICard } from '../task_2';
import { UserSettingsModule } from '../task_3';
import { CurrencyConverterModule } from '../task_4';

export class BankTerminal {
	private _bankOffice: BankOffice;
	private _moneyRepository: MoneyRepository;
	private _userSettingsModule: UserSettingsModule;
	private _currencyConverterModule: CurrencyConverterModule;
	private _authorizedUser: IBankUser;
    private _authorizedUserCard : ICard;

	constructor(initBankOffice: BankOffice, initMoneyRepository: MoneyRepository) {
	    this._moneyRepository = initMoneyRepository;
	    this._bankOffice = initBankOffice;
	    this._userSettingsModule = new UserSettingsModule(initBankOffice);
	    this._currencyConverterModule = new CurrencyConverterModule(initMoneyRepository);
	}

	public authorizeUser(user: IBankUser, card: ICard, cardPin: string): boolean {
        if (this._bankOffice.authorize(user.id, card.id, cardPin)) {
            this._authorizedUser = user;
            this._authorizedUserCard = card;
            this._userSettingsModule.user = user;

            return true;
        }

        return false;
	}

	public takeUsersMoney(moneyUnits: Array<IMoneyUnit>): boolean {
        if (this._authorizedUser !== undefined) {
            this._moneyRepository.takeMoney(moneyUnits);
            let moneySum = 0;
            for (const moneyUnit of moneyUnits) {
                if (moneyUnit.moneyInfo.currency !== this._authorizedUserCard.currency) {
                    throw Error('Вы положили не ту валюту! Выплевываю её обратно!!!');
                }
                moneySum += moneyUnit.count * Number(moneyUnit.moneyInfo.denomination)
            }
            this._authorizedUserCard.balance += moneySum;

            return true
        }

        return false;
	}

	public giveOutUsersMoney(count: number): boolean {
        if (this._authorizedUser !== undefined) {
            const isGivedOut = this._moneyRepository.giveOutMoney(count, this._authorizedUserCard.currency);
            if (isGivedOut) {
                this._authorizedUserCard.balance -= count;

                return true
            }
        }

        return false;
	}

	public changeAuthorizedUserSettings(option: UserSettingOptions, argsForChangeFunction: string): boolean {
		if (this._authorizedUser !== undefined) {
            return this._userSettingsModule.changeUserSettings(option, argsForChangeFunction);
        }

        return false;
	}

	public convertMoneyUnits(fromCurrency: Currency, toCurrency: Currency, moneyUnit: IMoneyUnit): number {
        if (this._authorizedUser !== undefined) {
            return this._currencyConverterModule.convertMoneyUnits(fromCurrency, toCurrency, moneyUnit);
        }

        return 0;
	}
}