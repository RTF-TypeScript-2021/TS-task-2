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
        this._repository.sort(compareFunction)

        function compareFunction(x: IMoneyUnit, y: IMoneyUnit) : number {
            if (Number(x.moneyInfo.denomination) > Number(y.moneyInfo.denomination)) {
                return -1;
            } else if (Number(x.moneyInfo.denomination) === Number(y.moneyInfo.denomination)) {
                return 0;
            } else {
                return 1;
            }
        }

        outerLoop: for (const i of this._repository){
            if (i.moneyInfo.currency === currency){
                for(let j = i.count; j != 0; j--){
                    if (Number(i.moneyInfo.denomination) <= count){
                        count -= Number(i.moneyInfo.denomination);
                        i.count -= 1;
                        if(count === 0){
                            break outerLoop;
                        }
                    }
                }
            }
        }

        return count == 0;
    }

    public takeMoney(moneyUnits: IMoneyUnit[]): void {
        for (const moneyUnit of moneyUnits){
            const denomination = this._repository.findIndex((x) =>
                x.moneyInfo.denomination === moneyUnit.moneyInfo.denomination &&
                x.moneyInfo.currency === moneyUnit.moneyInfo.currency);
            if (denomination !== -1){
                this._repository[denomination].count += moneyUnit.count
            } else {
                this._repository.concat(moneyUnits)
            }
        }
    }
}