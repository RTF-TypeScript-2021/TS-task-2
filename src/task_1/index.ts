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

import {Currency} from '../enums';

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
        const banknotes: IMoneyUnit[] = [];
        let denominations: string[];
        if (currency === Currency.RUB) {
            denominations = ["5000", "2000", "1000", "500", "200", "100", "50", "10"];
        } else {
            denominations = ["100", "50", "20", "10", "5", "1"];
        }
        if (!this._canGiveOut(denominations, count)) {
            return false;
        }
        denominations.forEach(denomination => {
            const denInt = parseInt(denomination);
            let i = 0;
            const banknoteObj = this._repository.find(x => x.moneyInfo.denomination === denomination);
            if (banknoteObj !== undefined) {
                while (count >= denInt) {
                    if (i === banknoteObj.count) {
                        break;
                    }
                    i++;
                    count -= denInt;
                    banknoteObj.count--;
                }
            }
            banknotes.push({ moneyInfo: { denomination: denomination, currency: currency }, count: i });
        });
        
        return count === 0;
    }

    public takeMoney(moneyUnits: IMoneyUnit[]): boolean {
        moneyUnits.forEach( unit => {
            const repCell = this._repository.find( x => x.moneyInfo.denomination === unit.moneyInfo.denomination);
            if (repCell === undefined){
                return false;
            }
            repCell.count += unit.count;
        })

        return true;
    }

    private _canGiveOut(denominations: string[], count: number): boolean {
        const allMoney = denominations.reduce( (sum, den) =>{
            const countInRep = this._repository.find(x => x.moneyInfo.denomination === den)?.count
            if (countInRep !== undefined) {
                return sum + parseInt(den) * countInRep;
            }

            return sum;
        }, 0)

        return count <= allMoney;
    }
}