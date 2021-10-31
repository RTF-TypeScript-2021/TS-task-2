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

import {Currency} from '../enums';

interface IMoneyInfo {
    denomination: string;
    currency: Currency;
}

export interface IMoneyUnit {
    moneyInfo: IMoneyInfo;
    count: number;
}

export class MoneyRepository {
    private readonly _repository: Record<number, Record<string, number>>;
    private readonly _balance: Record<number, number>;

    constructor(initialRepository: IMoneyUnit[]) {
        this._repository = {
            [Currency.RUB]: {},
            [Currency.USD]: {}
        }
        this._balance = {
            [Currency.RUB]: 0,
            [Currency.USD]: 0
        };
        this.takeMoney(initialRepository);
    }

    public giveOutMoney(count: number, currency: Currency): boolean {
        if (count > this._balance[currency]) {
            return false;
        }

        this._balance[currency] -= count;
        while (count !== 0) {
            let dif = 1000000000;
            let cur = "";
            for (const m in this._repository[currency]) {
                if (this._repository[currency][m] > 0
                    && dif > count - Number.parseInt(m) && count - Number.parseInt(m) >= 0) {
                    dif = count - Number.parseInt(m);
                    cur = m;
                }
            }
            count -= Number.parseInt(cur);
            this._repository[currency][cur] -= 1;
        }

        return true;
    }

    public takeMoney(moneyUnits: IMoneyUnit[]): void {
        moneyUnits.forEach(m => {
            if ((Object.keys(this._repository[m.moneyInfo.currency])).every(k => k !== m.moneyInfo.denomination)) {
                this._repository[m.moneyInfo.currency][m.moneyInfo.denomination] = 0;
            }
            this._repository[m.moneyInfo.currency][m.moneyInfo.denomination] += m.count;
            this._balance[m.moneyInfo.currency] += Number.parseInt(m.moneyInfo.denomination) * this._repository[m.moneyInfo.currency][m.moneyInfo.denomination];
        });
    }
}