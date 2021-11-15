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

    constructor(initialRepository: IMoneyUnit[]) {
        this._repository = initialRepository;
    }

    public giveOutMoney(count: any, currency: any): any {
        if (this._repository.length === 0) {
            return false;
        }

        let monetaryUnits: Array<IMoneyUnit> = [];

        for (const unit of this._repository) {
            monetaryUnits.push(Object.assign({}, unit));
        }

        monetaryUnits = this._repository.filter( x => x.moneyInfo.currency === currency)
        monetaryUnits = monetaryUnits.sort(function(x, y) {
            const a = Number(x.moneyInfo.denomination);
            const b = Number(y.moneyInfo.denomination);

            return b > a? 1: b < a ? -1: 0;
        })

        monetaryUnits.forEach(monetaryUnit => {
            const money = Number(monetaryUnit.moneyInfo.denomination)
            const valueCount = Math.floor(count/money);
            const rightCount = valueCount < monetaryUnit.count? valueCount: monetaryUnit.count;
            count -= money * rightCount;  
            monetaryUnit.count -= rightCount;
        });

        if (count !== 0) {
            this._repository = monetaryUnits;

            return false;   
        } 

        return true;
    }

    public takeMoney(monetaryUnits: IMoneyUnit[]): void {
        for (const monetaryUnit of monetaryUnits) {
            this._repository.push(monetaryUnit);
        }
    }
}