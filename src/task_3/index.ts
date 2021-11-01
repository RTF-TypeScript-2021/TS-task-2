import { UserSettingOptions } from '../enums';
import { BankOffice, IBankUser} from '../task_2';

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
		if (this._user === undefined || this._user.name === newName) {
			return false;
		}
		this._user.name = newName;

		return true;
	}

	private changeUserSurname(newSurname: string): boolean {
		if (this._user === undefined || this._user.surname === newSurname) {
			return false;
		}
		this._user.surname = newSurname;
		
		return true;
	}

	private registerForUserNewCard(newCardId: string): boolean {
		if (this._bankOffice.isCardTiedToUser(newCardId) || this._bankOffice.getCardById(newCardId) === undefined) {
			return false;
		}
		this._user.cards.push(this._bankOffice.getCardById(newCardId));

		return true;
	}

	public changeUserSettings(option: UserSettingOptions, argsForChangeFunction: string): boolean {
		switch(option) {
			case UserSettingOptions.name:
				return this.changeUserName(argsForChangeFunction);
			case UserSettingOptions.newCard:
				return this.registerForUserNewCard(argsForChangeFunction);
			case UserSettingOptions.surname:
				return this.changeUserSurname(argsForChangeFunction);			
			}
		}
}
