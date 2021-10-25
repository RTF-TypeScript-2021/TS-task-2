import { BankOffice } from '../src/task_2/index';
import { Currency } from '../src/enums';


const bank: BankOffice = new BankOffice(
    [
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
            name: "Oleg",
            surname: "Goodwork",
            cards: [
                {
                    id: "004",
                    balance: 31,
                    currency: Currency.USD,
                    pin: "3030"
                }
            ]
        }
    ],
    [
        {
            id: "002",
            balance: 0,
            currency: Currency.USD,
            pin: "1488"
        }
    ]
)

test('Authorize works correct', () => {
    expect(bank.authorize("1", "001", "0000")).toBe(true);
    expect(bank.authorize("1", "003", "0000")).toBe(true);
    expect(bank.authorize("2", "001", "0000")).toBe(false);
    expect(bank.authorize("2", "002", "1488")).toBe(false);
});

test('getCardById works correct', () => {
    expect(JSON.stringify(bank.getCardById("002"))).toEqual("{\"id\":\"002\",\"balance\":0,\"currency\":1,\"pin\":\"1488\"}")
});

test('isCardTiedToUser works correct', () => {
    expect(bank.isCardTiedToUser("001")).toBe(true);
    expect(bank.isCardTiedToUser("002")).toBe(false);
});