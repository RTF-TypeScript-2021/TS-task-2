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
    denomination: string; //
    currency: Currency;// валюта (доллар или рубли)
}

export interface IMoneyUnit {
    moneyInfo: IMoneyInfo; // тип денег
    count: number; // номинал
}

export class MoneyRepository {
    private _repository: IMoneyUnit[]; // IMoneyUnit[] - хрен, придумываем другой тип

    constructor(initialRepository: IMoneyUnit[]) {
        this._repository = initialRepository;
    }

    public giveOutMoney(count: number, currency: Currency): boolean { // выдать денег
        this._repository.sort(compareFunction)

        function compareFunction(x: IMoneyUnit, y: IMoneyUnit) : number {
            if (x.count > y.count) {
                return -1;
            } else if (x.count === y.count) {
                return 0;
            } else {
                return 1;
            }
        }

        for (const i of this._repository){
            if (i.moneyInfo.currency === currency){
                const d = Math.floor(count / Number(i.moneyInfo.denomination));
                if (d >= 1) {
                    count -= Number(i.moneyInfo.denomination) * Math.min(d, i.count);
                    i.count -= Math.min(d, i.count);
                }
            }
        }

        return count === 0;
    }

    public takeMoney(moneyUnits: IMoneyUnit[]): void {
        for (const i of moneyUnits){
            const denomination = this._repository.findIndex((x) =>
                x.moneyInfo.denomination === i.moneyInfo.denomination &&
                x.moneyInfo.currency === i.moneyInfo.currency);
            if (denomination !== -1){
                this._repository[denomination].count += i.count
            } else {
                this._repository.concat(moneyUnits)
            }
        }
    }
}