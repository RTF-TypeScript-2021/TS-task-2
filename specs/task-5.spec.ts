import { Currency, UserSettingOptions } from '../src/enums';
import { MoneyRepository } from '../src/task_1/index';
import { BankOffice, IBankUser, ICard } from '../src/task_2/index';
import { BankTerminal } from '../src/task_5/index';

const user: IBankUser[] = [
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
    },
    {
        id: "2",
        name: "Nina",
        surname: "Maximova",
        cards: [
            {
                id: "009",
                balance: 1004,
                currency: Currency.USD,
                pin: "0004",
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
];

const rep: MoneyRepository = new MoneyRepository([
    { moneyInfo: { denomination: "50", currency: Currency.RUB }, count: 1 },
    { moneyInfo: { denomination: "200", currency: Currency.RUB }, count: 1 },
    { moneyInfo: { denomination: "1000", currency: Currency.RUB }, count: 1 },
    { moneyInfo: { denomination: "100", currency: Currency.RUB }, count: 1 },
]);

const bank: BankOffice = new BankOffice(user, cards)
const bankTerminal = new BankTerminal(bank, rep);

test('authorize method works correct', () => {
    expect(bankTerminal.authorizeUser(user[0], user[0].cards[0], "0000")).toBe(true);
    expect(bankTerminal.authorizeUser(user[0], cards[0], "1488")).toBe(false);
});

test('takeUsersMoney method works correct', () => {
    bankTerminal.authorizeUser(user[0], user[0].cards[0], "0000");
    expect(bankTerminal.takeUsersMoney([{
        moneyInfo: { denomination: "50", currency: Currency.RUB },
        count: 1
    }])).toBe(true);
});

test('giveOutUsersMoney method works correct', () => {
    bankTerminal.authorizeUser(user[0], user[0].cards[0], "0000");
    expect(bankTerminal.giveOutUsersMoney(100)).toBe(true);
    expect(bankTerminal.giveOutUsersMoney(100500)).toBe(false);
});

test('changeAuthorizedUserSettings method works correct', () => {
    bankTerminal.authorizeUser(user[0], user[0].cards[0], "0000");
    expect(bankTerminal.changeAuthorizedUserSettings(UserSettingOptions.name, "Olga")).toBe(true);
});

test('changeAuthorizedUserSettings method works correct', () => {
    const bankTerminalNotAuth = new BankTerminal(bank, rep);
    expect(bankTerminalNotAuth.changeAuthorizedUserSettings(UserSettingOptions.name, "Valentina")).toBe(false);
});

test('convertMoneyUnits method works correct', () => {
    bankTerminal.authorizeUser(user[0], user[0].cards[0], "0000");
    expect(bankTerminal.convertMoneyUnits(Currency.RUB, Currency.RUB, {
        moneyInfo: {
            denomination: "50",
            currency: Currency.RUB
        }, count: 1
    })).toBe(0);
});