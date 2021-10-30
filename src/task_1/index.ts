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

interface IDenominationInfo {
    denomination: string,
    count: number
}

export class MoneyRepository {
    private _repository: Array<IMoneyUnit>;

    constructor(initialRepository: Array<IMoneyUnit>) {
        this._repository = initialRepository;
    }

    get repository(){
        return this._repository
    }

    public takeMoney(moneyUnits: Array<IMoneyUnit>): boolean{ //Сначала было void, но пятый таск требует boolean, поэтому испрвил тут, ситуации с неудачей и возратом false не нашёл
        moneyUnits.forEach(moneyUnit => {
            let taken = false
            this._repository.forEach(money =>{
                if(money.moneyInfo.currency === moneyUnit.moneyInfo.currency && money.moneyInfo.denomination === moneyUnit.moneyInfo.denomination){
                    money.count += moneyUnit.count
                    taken = true
                }
            })
            if(!taken){
                this._repository.push({ moneyInfo: { denomination: moneyUnit.moneyInfo.denomination, currency: moneyUnit.moneyInfo.currency }, count: moneyUnit.count })
            }
        })
        return true
    }

    public giveOutMoney(count: number, currency: Currency, terminal? : boolean): boolean | Array<IMoneyUnit>{
        const moneyBuffer: Array<IMoneyUnit> = []
        const currencyInMoneyRepository = this.currencyInfo(currency)
        currencyInMoneyRepository.forEach(money =>{
            const countBill = Math.floor(count/parseInt(money.denomination))
            if(countBill){
                if(countBill >= money.count){
                    this._repository = this._repository.filter(x => x.moneyInfo.denomination !== money.denomination || x.moneyInfo.currency !== currency)
                    moneyBuffer.push({moneyInfo:{denomination: money.denomination, currency: currency}, count: money.count })
                    count -= money.count*parseInt(money.denomination)
                }else{
                    this._repository.find(x => x.moneyInfo.denomination === money.denomination && x.moneyInfo.currency === currency)
                        .count = money.count - countBill
                    moneyBuffer.push({moneyInfo:{denomination: money.denomination, currency: currency}, count: money.count - countBill })
                    count -= countBill*parseInt(money.denomination)
                }
            }
        })

        if(count !== 0){
            this.takeMoney(moneyBuffer)

            return false
        }
        if (terminal){ // для пятой таски
            return moneyBuffer
        }

        return true
    }

    private currencyInfo(currency: Currency): Array<IDenominationInfo>{
        const info: Array<IDenominationInfo> = []
        this._repository.forEach(money => {
            if(money.moneyInfo.currency === currency){
                info.push({ denomination: money.moneyInfo.denomination, count: money.count})
            }
        })
        info.sort((a,b) => parseInt(b.denomination) - parseInt(a.denomination))

        return info
    }
}