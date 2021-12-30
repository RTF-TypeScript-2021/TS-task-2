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
    _repository: IMoneyUnit[];

    constructor(initialRepository: IMoneyUnit[]) {
        this._repository = initialRepository;
    }

    public giveOutMoney(count: number, currency: Currency): boolean {
        this._repository.sort((a,b) => parseInt(b.moneyInfo.denomination) - parseInt(a.moneyInfo.denomination))
        for(let i = 0; i < this._repository.length; i++){
            const denomination = parseInt(this._repository[i].moneyInfo.denomination);
            if(this._repository[i].moneyInfo.currency !== currency || denomination > count || this._repository[i].count === 0){
                continue;
            }else{
                const ost = Math.trunc(count/denomination);
                if (ost >= this._repository[i].count){
                    count = count - this._repository[i].count*denomination;
                    this._repository[i].count = 0
                }else{
                    count = count - ost*denomination;
                    this._repository[i].count -= ost
                }
            }
        }

        return count === 0;
    }

    public takeMoney(moneyUnits: IMoneyUnit[]): boolean {
        for (let j = 0; j< moneyUnits.length; j++){
            let canTake = false
            for (let i = 0; i < this._repository.length; i++) {
                if (this._repository[i].moneyInfo.currency === moneyUnits[j].moneyInfo.currency
                    && this._repository[i].moneyInfo.denomination === moneyUnits[j].moneyInfo.denomination) {
                    this._repository[i].count += moneyUnits[j].count
                    canTake = true
                }
            }
            if (!canTake){
                this._repository.push({ moneyInfo: { denomination: moneyUnits[j].moneyInfo.denomination, currency: moneyUnits[j].moneyInfo.currency }, count: moneyUnits[j].count })
            }
        }

        return true
    }
}