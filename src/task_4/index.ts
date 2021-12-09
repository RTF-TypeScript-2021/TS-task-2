/** Задача 4 - CurrencyConverterModule
 * Имеется класс CurrencyConverterModule. Который должен отвечать за
 * конвертацию валют.
 * Требуется:
 * 1) Реализовать классу CurrencyConverterModule 1 метод - convert
 * 	  метод должен принимать 3 аргумента:
 *		1.1) fromCurrency - валюта, из которой происходит конвертация
 *		1.2) toCurrency - валюта, в которую происходит конвертация
 *		1.3) moneyUnits - денежные единицы, полностью соответствующие валюте,
 *			 из которой происходит конвертация
 *	  Метод должен возвращать набор денежных единиц в той валюте, в которую происходит конвертация
 *	  Для простоты реализации будем считать, что банкомат конвертирует только по курсу
 *	  1USD = 70RUB и кратные курсу суммы (т.е. банкомат не может сконвертировать 100RUB, может только 70, 140 и т.д.)
 * 2) Типизировать все свойства и методы класса UserSettingsModule,
 * 	  пользуясь уже предоставленными интерфейсами (избавиться от всех any типов)
*/

import { Currency } from '../enums';
import { IMoneyUnit, MoneyRepository } from '../task_1';

export class CurrencyConverterModule {
    private _moneyRepository: MoneyRepository;
    private static _exchangeRate: { [key: string]: number } = {
        'USDRUB': 70,
        'RUBUSD': 1 / 70,
    }
    constructor(initialMoneyRepository: MoneyRepository) {
        this._moneyRepository = initialMoneyRepository;
    }

    public convertMoneyUnits(fromCurrency: Currency, toCurrency: Currency, moneyUnits: IMoneyUnit): number {
        if (fromCurrency === toCurrency || moneyUnits.moneyInfo.currency !== fromCurrency) {
            return 0;
        } else {
            const coefficient: number = CurrencyConverterModule
                ._exchangeRate[Currency[fromCurrency] + Currency[toCurrency]];
            const result: string = (coefficient * moneyUnits.count * Number(
                moneyUnits.moneyInfo.denomination)
            ).toFixed(5);

            return parseFloat(result);
        }
    }
}