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
 *        1.2) takeMoney - позволяет положить в хранил ище денежные единицы разных номиналов и разного количества
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
        //tmpCurrCount - временное отображение состояния repository для одного из видов монет
        const availableCurrencies:Array<IMoneyUnit> = this._repository.filter(unit => 
            unit.moneyInfo.currency === currency
        );
        const tmpCurrCount: {[key: string] : number} = {};
        availableCurrencies.forEach(unit => {
            tmpCurrCount[unit.moneyInfo.denomination] = unit.count; 
        });

        //сортируем доступный номинал
        const denomination:Array<string> = Object.keys(tmpCurrCount).sort((a,b)=>Number(b) - Number(a));
        
        const remainderOfCoins:number = denomination.reduce((count, coin) => {
            if (Number(coin) > count || count <= 0) {
                return count;
            } else if (Number(coin)*tmpCurrCount[coin] > count) {
                tmpCurrCount[coin] -= Math.floor(count / Number(coin));
                count = count % Number(coin);
            } else {
                count = count - Number(coin)*tmpCurrCount[coin];
                tmpCurrCount[coin] = 0;
            }

            return count;
        }, count)
        
        if (remainderOfCoins === 0) {
            //обновляем состояние repository
            denomination.forEach(item => {
                availableCurrencies.find(unit => 
                    unit.moneyInfo.denomination === item
                ).count = tmpCurrCount[item]
            })

            return true;
        }

        return false;
    }

    public takeMoney(moneyUnits: Array<IMoneyUnit>): void {
        moneyUnits.forEach(unit =>{ 
            const index = this._repository.findIndex(item => (
                item.moneyInfo.denomination === unit.moneyInfo.denomination 
                && item.moneyInfo.currency === unit.moneyInfo.currency
            ));
            if(index === -1) {
                this._repository.push(unit);
            } else {
                this._repository[index].count += unit.count;
            }
        })
    }
}