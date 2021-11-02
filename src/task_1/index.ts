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
    private _repository: Array<IMoneyUnit>;

    constructor(initialRepository: Array<IMoneyUnit>) {
        this._repository = initialRepository;
    }

    public giveOutMoney(count: number, currency: Currency): boolean {
        this._repository.sort((x,y) => parseInt(y.moneyInfo.denomination) - parseInt(x.moneyInfo.denomination)); 
        for (const unit of this._repository) {
            const denomination: number = parseInt(unit.moneyInfo.denomination);
            const ost: number = count/denomination;

            if (unit.moneyInfo.currency === currency && denomination <= count && unit.count !== 0) {
                if (ost > unit.count) {
                    count -= unit.count * denomination;
                    unit.count = 0;
                } else {
                    count -= ost * denomination;
                    unit.count -= ost;
                }
            }
        }

        return count === 0;
    }

    public takeMoney(moneyUnits: IMoneyUnit[]): void {
        moneyUnits.forEach(moneyUnits => {
            this._repository.find(unit => unit.moneyInfo.currency === moneyUnits.moneyInfo.currency 
                && unit.moneyInfo.denomination === moneyUnits.moneyInfo.denomination).count += moneyUnits.count;
        });
    }
}