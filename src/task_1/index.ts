/** Задача 1 - MoneyRepository
 * Имеется класс денежного хранилища - MoneyRepository.
 * Который должен хранить денежные единицы
 * разных валют, разного номинала и в разном количестве.
 * Требуется:
 * 1) Реализовать классу MoneyRepository 2 метода:
 *        1.1) giveOutMoney - позволяет достать денежные единицы из хранилища по принципу жадного алгоритма:
 *             сумма 1350RUB будет выдана
 *             одной купюрой номиналом 1000RUB,
 *             одной купюрой номиналом 200RUB,
 *             одной купюрой номиналом 100RUB,
 *             одной купюрой номиналом 50RUB
 *             с учетом, что все эти купюры будут находится в хранилище.
 *             Принимает аргументы count - сумма, требуемая к выдаче, currency - валюта
 *             Если сумма была собрана и выдана, то метод возвращает true, иначе false
 *        1.2) takeMoney - позволяет положить в хранилище денежные единицы разных номиналов и разного количества
 * 2) Типизировать все свойства и методы класса MoneyRepository,
 *      пользуясь уже предоставленными интерфейсами (избавиться от всех any типов)
 */

import { Currency } from '../enums';

interface IMoneyInfo {
    denomination: string;
    currency: Currency;
}

export interface IMoneyUnit {
    moneyInfo: IMoneyInfo;
    count: number;
}

export class MoneyRepository{
    private moneyUnits: IMoneyUnit[];

    constructor(moneyUnits: IMoneyUnit[]) {
        this.moneyUnits = moneyUnits;
    }

    public giveOutMoney(count: number, currency: Currency): boolean {
        const units :IMoneyUnit[] = this.moneyUnits
            .filter(x => x.moneyInfo.currency === currency)
            .sort((x, y) => Number(y.moneyInfo.denomination)- Number(x.moneyInfo.denomination));

            units.forEach(unit => {
            const denomination: number = Number(unit.moneyInfo.denomination);
            if (count >= denomination) {
                const billCount = Math.min(Math.floor(count / denomination), unit.count);
                count -= billCount * denomination;
                unit.count -= billCount;
            }
        });

        return count === 0;
    }

    public takeMoney(moneyUnits: IMoneyUnit[]): void {
        moneyUnits.forEach(unit => this.moneyUnits.push(unit));
    }
}

/*currency: {
      {5000: 2},
      {45, 5},
      {23, 1}
 }*/