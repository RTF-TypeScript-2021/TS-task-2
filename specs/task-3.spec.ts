import { UserSettingsModule } from '../src/task_3/index';
import { Currency, UserSettingOptions } from '../src/enums';
import { BankOffice, IBankUser, ICard } from '../src/task_2/index';

const users: IBankUser[] = [
    {
        id: "1",
        name: "Max",
        surname: "Maximov",
        cards: [
            {
                id: "001",
                balance: 4021,
                currency: Currency.RUB,
                pin: "0000",
            },
            {
                id: "003",
                balance: 1000,
                currency: Currency.USD,
                pin: "0000",
            }
        ]
    }
]

const cards: ICard[] = [
    {
        id: "002",
        balance: 0,
        currency: Currency.USD,
        pin: "1488"
    }
]

const bank: BankOffice = new BankOffice(users, cards)

test('changeUserName works correct', () => {
    const userSettingsModule: UserSettingsModule = new UserSettingsModule(bank);
    userSettingsModule.user = users[0];
    expect(userSettingsModule.changeUserSettings(UserSettingOptions.name, "Dima")).toBe(true);
});

test('changeUserName works correct', () => {
    const userSettingsModule: UserSettingsModule = new UserSettingsModule(bank);
    userSettingsModule.user = users[0];
    expect(userSettingsModule.changeUserSettings(UserSettingOptions.surname, "Maximov")).toBe(false);
    expect(userSettingsModule.changeUserSettings(UserSettingOptions.surname, "Ivanov")).toBe(true);
});

test('registerForUserNewCard works correct', () => {
    const userSettingsModule: UserSettingsModule = new UserSettingsModule(bank);
    userSettingsModule.user = users[0];
    expect(userSettingsModule.changeUserSettings(UserSettingOptions.newCard, "002")).toBe(true);
    expect(userSettingsModule.changeUserSettings(UserSettingOptions.newCard, "001")).toBe(false);
    expect(userSettingsModule.changeUserSettings(UserSettingOptions.newCard, "005")).toBe(false);
});