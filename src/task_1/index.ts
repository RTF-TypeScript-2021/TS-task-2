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

export class MoneyRepository {
    private _repository: IMoneyUnit[];

    constructor(initialRepository: IMoneyUnit[]) {
        this._repository = initialRepository;
    }

    public giveOutMoney(count: number, currency: Currency): boolean {
        this._repository.sort((prev, next) => {
            if (Number(prev.moneyInfo.denomination) < Number(next.moneyInfo.denomination))
                return -1;
            if (Number(prev.moneyInfo.denomination) < Number(next.moneyInfo.denomination))
                return 1;
        }).reverse();

        let sum = this.sumMoney(currency);
        if (sum < count) {
            return false;
        }

        sum = 0;

        for (let i = 0; i < this._repository.length; i++) {
            for (let curCount = this._repository[i]?.count; curCount > 0; curCount--) {
                const denomination = Number(this._repository[i].moneyInfo.denomination);
                if (denomination * curCount > count || currency !== this._repository[i].moneyInfo.currency)
                    continue;

                sum += denomination * curCount;
                if (this._repository[i].count === curCount) {
                    delete this._repository[i];
                } else {
                    this._repository[i].count--;
                }
            }
        }

        return sum === count;
    }

    public takeMoney(moneyUnits: IMoneyUnit[]) {
        for (let i = 0; i < moneyUnits.length; i++) {
            let curMoneyUnit = this._repository.find(moneyUnit =>
                moneyUnit?.moneyInfo.denomination === moneyUnits[i].moneyInfo.denomination
            && moneyUnit?.moneyInfo.currency === moneyUnits[i].moneyInfo.currency)
            if (curMoneyUnit !== undefined)
                curMoneyUnit.count += moneyUnits[i].count;
            else
                this._repository.push(moneyUnits[i]);
        }
    }

    private sumMoney(currency: Currency) {
        let sum = 0;
        for (let i = 0; i < this._repository.length; i++) {
            if (this._repository[i]?.moneyInfo.currency !== currency)
                continue;
            sum += Number(this._repository[i]?.moneyInfo.denomination) * this._repository[i]?.count;
        }

        return sum;
    }
}