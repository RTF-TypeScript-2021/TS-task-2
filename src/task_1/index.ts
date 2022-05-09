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
 
     public giveOutMoney(count: number, currency: Currency): boolean  {
         const moneyUnits = this._repository.filter(x => x.moneyInfo.currency === currency)
             .sort((b, a) => {
                 const l = a.moneyInfo.denomination.length - b.moneyInfo.denomination.length;
 
                 return l !== 0 ? l : a.moneyInfo.denomination.localeCompare(b.moneyInfo.denomination);
             });
         
         moneyUnits.forEach(moneyUnit =>{
             const denomination: number = parseInt(moneyUnit.moneyInfo.denomination);
             if (count >= denomination){
                 const billNumber = Math.min(Math.floor(count / denomination), moneyUnit.count);
                 moneyUnit.count -= billNumber;
                 count -= billNumber * denomination;
             }
         });
         
         return count === 0;
     }
 
     public takeMoney(moneyUnits: IMoneyUnit[]): void {
         moneyUnits.forEach(moneyUnit => {
             this._repository.find(x => x.moneyInfo.currency === moneyUnit.moneyInfo.currency 
                 && x.moneyInfo.denomination === moneyUnit.moneyInfo.denomination).count += moneyUnit.count;
         });
     }
 }
