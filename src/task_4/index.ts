import { Currency } from '../enums';
import { IMoneyUnit, MoneyRepository } from '../task_1';

export class CurrencyConverterModule {
	private _moneyRepository: MoneyRepository;
	private static readonly _usdRubCoef = 70;

	constructor(initialMoneyRepository: MoneyRepository) {
		this._moneyRepository = initialMoneyRepository;
	}

	public convertMoneyUnits(fromCurrency: Currency, toCurrency: Currency, moneyUnits: IMoneyUnit): number {
		switch (toCurrency) {
			case (fromCurrency):
				return 0;
			case (Currency.RUB):
				return parseInt(moneyUnits.moneyInfo.denomination) * moneyUnits.count * CurrencyConverterModule._usdRubCoef;
			case (Currency.USD):
				return parseInt(moneyUnits.moneyInfo.denomination) * moneyUnits.count / CurrencyConverterModule._usdRubCoef;
		}
	}
}