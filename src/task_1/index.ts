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
    private readonly _repository: IMoneyUnit[];

    constructor(initialRepository: IMoneyUnit[]) {
        this._repository = initialRepository;
    }
    // https://github.com/codedokode/pasta/blob/master/algorithm/atm.md#алгоритм-на-основе-динамического-программирования
    private isGivenOutMoney(count: number, currency: Currency): [boolean, {[key: number]: IMoneyUnit }]{
        const availableUnits: IMoneyUnit[] = this._repository.filter(unit => unit.moneyInfo.currency === currency && unit.count > 0);
        availableUnits.sort((a, b) => parseInt(b.moneyInfo.denomination) - parseInt(a.moneyInfo.denomination));
        const sums: {[key: number]: IMoneyUnit } = {0: {count:0, moneyInfo: {currency: currency, denomination: "0"}}};

        for(let i = 0; i < availableUnits.length; i++){
            for(let j = 0; j < availableUnits[i].count; j++){
                const newSums: {[key: number]: IMoneyUnit} = {};
                for (const sum in sums){
                    const newSum = parseInt(sum) + parseInt(availableUnits[i].moneyInfo.denomination);
                    if (newSum > count){
                        break;
                    }
                    if (!(newSum in sums)){
                        newSums[newSum] = availableUnits[i];
                    }
                }
                for(const sum in newSums){
                    sums[sum] = newSums[sum];
                }
            }
        }

        return [count in sums, sums];
    }

    public giveOutMoney(count: number, currency: Currency): boolean {
        const [isGivenOutMoney, sums] = this.isGivenOutMoney(count, currency);

        if (isGivenOutMoney){
            let moneyUnit = sums[count];
            while (moneyUnit.count !== 0){
                moneyUnit.count -= 1;
                moneyUnit = sums[count - parseInt(moneyUnit.moneyInfo.denomination)];
            }
        }

        return isGivenOutMoney;
    }

    public takeMoney(moneyUnits: IMoneyUnit[]): void {
        moneyUnits.forEach(newMoneyUnit => {
            const moneyUnitInRepo: IMoneyUnit = this._repository.find(moneyUnitInRepo =>
                moneyUnitInRepo.moneyInfo.denomination === newMoneyUnit.moneyInfo.denomination
                && moneyUnitInRepo.moneyInfo.currency === newMoneyUnit.moneyInfo.currency);

            if (moneyUnitInRepo === undefined){
                this._repository.push(newMoneyUnit);
            } else {
                moneyUnitInRepo.count += newMoneyUnit.count;
            }
        })
    }
}