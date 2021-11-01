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
        this._repository = [];
        this.takeMoney(initialRepository);
    }

    public giveOutMoney(count: number, currency: Currency): boolean {
        let maxInfo: [number, number];
        let currentCheck = 0;
        const toGive = count;
        let forSearch: Array<IMoneyUnit> = this._repository.filter(unit => unit.moneyInfo.currency === currency && unit.count > 0 && parseInt(unit.moneyInfo.denomination) <= count);
        const given: Array<[number, number]> = [];
        while(forSearch.length > 0) {
            if (count <= 0) {
                break;
            }
            maxInfo = this.findMax(forSearch);
            
            if (Math.floor(count / maxInfo[0]) < maxInfo[1]) {
                currentCheck += Math.floor(count / maxInfo[0])*maxInfo[0];
                count -= Math.floor(count / maxInfo[0])*maxInfo[0];
                given.push([maxInfo[0], count / maxInfo[0]])
            } else {
                currentCheck += maxInfo[1]*maxInfo[0];
                count -= maxInfo[1]*maxInfo[0];
                given.push([maxInfo[0], maxInfo[1]])
            }
            if (currentCheck === toGive) {
                this._repository.map(unit => {
                    given.forEach(element => {
                        if (element[0] === parseInt(unit.moneyInfo.denomination)) {
                            unit.count -= element[1];
                        }
                    })
                })

                return true;
            } 
            forSearch = forSearch.filter(unit => parseInt(unit.moneyInfo.denomination) !== maxInfo[0]);      
        }

        return false;
    }

    private findMax(array: IMoneyUnit[]): [number, number] {
        const maxInfo: [number, number] = [0, 0];
        array.forEach(element => {
            if (parseInt(element.moneyInfo.denomination) > maxInfo[0]) {
                maxInfo[0] = parseInt(element.moneyInfo.denomination);
                maxInfo[1] = element.count;
            }
        });

        return maxInfo;
    }

    public takeMoney(moneyUnits: IMoneyUnit[]): void {       
        moneyUnits.forEach(element => {
            let alreadyHave = false;
            this._repository.forEach(element2 => {
                if (element2.moneyInfo.currency === element.moneyInfo.currency && element2.moneyInfo.denomination === element.moneyInfo.denomination) {
                    element2.count += element.count;
                    alreadyHave = true;
                } 
            });
            if(!alreadyHave) {
                this._repository.push({moneyInfo: element.moneyInfo, count: element.count});
            }                
        });
    }
}