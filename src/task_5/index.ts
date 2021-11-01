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

	constructor(initBankOffice: BankOffice, initMoneyRepository: MoneyRepository) {
		this._moneyRepository = initMoneyRepository;
		this._bankOffice = initBankOffice;
		this._userSettingsModule = new UserSettingsModule(initBankOffice);
		this._currencyConverterModule = new CurrencyConverterModule(initMoneyRepository);
	}

	public authorizeUser(user: IBankUser, card: ICard, cardPin: string): boolean {
		if (this._bankOffice.authorize(user.id, card.id, cardPin)) {
			this._authorizedUser = user;
			this._userSettingsModule.user = user;

			return true;
		}

		return false;
	}

	public takeUsersMoney(moneyUnits: Array<IMoneyUnit>): boolean {
		return this._moneyRepository.takeMoney(moneyUnits);
	}

	public giveOutUsersMoney(count: number): boolean {
		return this._moneyRepository.giveOutMoney(count, Currency.RUB);
	}

	public changeAuthorizedUserSettings(option: UserSettingOptions, argsForChangeFunction: string): boolean {
		return this._userSettingsModule.changeUserSettings(option, argsForChangeFunction);
	}

	public convertMoneyUnits(fromCurrency: Currency, toCurrency: Currency, moneyUnits: IMoneyUnit): number {
		return this._currencyConverterModule.convertMoneyUnits(fromCurrency, toCurrency, moneyUnits);
	}
}
