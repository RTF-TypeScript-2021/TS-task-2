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

    public giveOutMoney(amount: number, currency: Currency): boolean {
        const tmpRepository :IMoneyUnit[] = this._repository
            .filter(x=>x.moneyInfo.currency===currency
                && x.count!==0)
            .sort((x,y)=>parseInt(y.moneyInfo.denomination)-parseInt(x.moneyInfo.denomination));

        tmpRepository.forEach(element => {
            const denomination : number = parseInt(element.moneyInfo.denomination);
            if(amount >=  denomination){
                const countAmount = Math.min(Math.floor(amount/denomination),element.count);
                amount-=countAmount*denomination;
                element.count-=countAmount
            }
        });

        return amount===0;
    }

    public takeMoney(moneyUnits: IMoneyUnit[]): boolean {
        moneyUnits.forEach(element=>
            this._repository
                .find(x=>x.moneyInfo.currency===element.moneyInfo.currency
                    && x.moneyInfo.denomination === element.moneyInfo.denomination)
                .count += element.count ?? element.count)

        return true
    }
}
