import { MoneyRepository } from '../src/task_1/index';
import { Currency } from '../src/enums';


test('Give and take money methods are correct', () => {
    const rep: MoneyRepository = new MoneyRepository([
        { moneyInfo: { denomination: "50", currency: Currency.RUB }, count: 1 },
        { moneyInfo: { denomination: "200", currency: Currency.RUB }, count: 1 },
        { moneyInfo: { denomination: "1000", currency: Currency.RUB }, count: 1 },
        { moneyInfo: { denomination: "100", currency: Currency.RUB }, count: 1 },
    ]);

    expect(rep.giveOutMoney(1350, Currency.RUB)).toBe(true);
    expect(rep.giveOutMoney(100, Currency.RUB)).toBe(false);
    rep.takeMoney([{ moneyInfo: { denomination: "50", currency: Currency.RUB }, count: 2 }]);
    expect(rep.giveOutMoney(50, Currency.RUB)).toBe(true);
});