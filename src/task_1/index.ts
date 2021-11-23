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
    denomination: string | number;
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
        if(this._repository.length === 0) {
            return false;
        }

        const denominationAll = this._repository.filter(unit => unit.moneyInfo.currency === currency).sort(function(unit, anotherUnit) {
            const a = Number(unit.moneyInfo.denomination);
            const b = Number(anotherUnit.moneyInfo.denomination);

            return b > a ? 1 : b < a ? -1 : 0;
        });

        denominationAll.forEach(moneyUnit => {
            const denominationNumber = Number(moneyUnit.moneyInfo.denomination);
            const checkAvailable = Math.floor(count/denominationNumber);
            if(checkAvailable <= moneyUnit.count){
                count -= denominationNumber * checkAvailable;
                //moneyUnit.count -= checkAvailable;
            } else {
                count -= denominationNumber * moneyUnit.count;
                //moneyUnit.count -= moneyUnit.count;
            }

        })
        
        if (count === 0) {
            return true;
        } else {
            return false;
        }
    }

    public takeMoney(moneyUnits: Array<IMoneyUnit>): void {
        for(const unit of moneyUnits){
            if(!this._repository.find(el => el.moneyInfo.denomination=== unit.moneyInfo.denomination)){
                this._repository.push(unit);
            } else{
                const indexCurrency = this._repository.findIndex(el => el.moneyInfo.currency === unit.moneyInfo.currency);
                this._repository[indexCurrency].count += unit.count;
            }
            
        }
    }
}