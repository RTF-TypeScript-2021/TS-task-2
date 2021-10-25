import { MoneyRepository, IMoneyUnit } from '../src/task_1';
import { Currency } from '../src/enums';
import { CurrencyConverterModule } from '../src/task_4';

const rubMoneyUnit: IMoneyUnit = { moneyInfo: { denomination: "10", currency: Currency.RUB }, count: 7 };
const usdMoneyUnit: IMoneyUnit = { moneyInfo: { denomination: "1", currency: Currency.USD }, count: 1 };


const rep: MoneyRepository = new MoneyRepository(
    [
        rubMoneyUnit,
        usdMoneyUnit
    ]
)

test('convert from rub to usd works correct', () => {
    const currencyConverterModule: CurrencyConverterModule = new CurrencyConverterModule(rep);
    expect(currencyConverterModule.convertMoneyUnits(Currency.RUB, Currency.USD, rubMoneyUnit)).toBe(1);
});

test('convert from usd to rub works correct', () => {
    const currencyConverterModule: CurrencyConverterModule = new CurrencyConverterModule(rep);
    expect(currencyConverterModule.convertMoneyUnits(Currency.USD, Currency.RUB, usdMoneyUnit)).toBe(70);
});

test('convert from rub to rub works correct', () => {
    const currencyConverterModule: CurrencyConverterModule = new CurrencyConverterModule(rep);
    expect(currencyConverterModule.convertMoneyUnits(Currency.RUB, Currency.RUB, rubMoneyUnit)).toBe(0);
});

test('convert from usd to usd works correct', () => {
    const currencyConverterModule: CurrencyConverterModule = new CurrencyConverterModule(rep);
    expect(currencyConverterModule.convertMoneyUnits(Currency.USD, Currency.USD, usdMoneyUnit)).toBe(0);
});