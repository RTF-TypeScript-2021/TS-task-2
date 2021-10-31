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

import { Currency } from "../enums";

interface IMoneyInfo {
  denomination: string;
  currency: Currency;
}

export interface IMoneyUnit {
  moneyInfo: IMoneyInfo;
  count: number;
}

const Denomination = [50, 100, 200, 1000];

type NormalizedMoneyRepository = {
  [currency in Currency]?: {
    [denomination: number]: {
      count: number;
    };
    total: number;
  };
};

export class MoneyRepository {
  private _repository: NormalizedMoneyRepository;

  constructor(initialRepository: IMoneyUnit[]) {
      this._repository = this.normalize(initialRepository);
  }

  private normalize = (repository: IMoneyUnit[]) => {
      const normalize: NormalizedMoneyRepository = {};
      repository.map((unit) => {
          if (!normalize[unit.moneyInfo.currency]) {
              normalize[unit.moneyInfo.currency] = { total: 0 };
          }
          normalize[unit.moneyInfo.currency][+unit.moneyInfo.denomination] = {
              count: unit.count,
          };
          normalize[unit.moneyInfo.currency].total += +unit.moneyInfo.denomination * unit.count;
      });

      return normalize;
  };

  public giveOutMoney(count: number, currency: Currency): boolean {
      if (count > this._repository[currency].total) {
          return false;
      }
      const repositoryCopy = JSON.parse(
          JSON.stringify(this._repository)
      ) as NormalizedMoneyRepository;
      const res = Denomination.reverse().some((denomination) => {
          const denominationCount = repositoryCopy[currency][denomination].count;
          if (denominationCount) {
              const needed = Math.floor(count / denomination);
              const isEnough = needed > denominationCount ? denominationCount : needed;
              count -= denomination * isEnough;
              repositoryCopy[currency][denomination].count -= isEnough;

              return !count;
          }
      });
      if (res) {
          repositoryCopy[currency].total -= count;
          this._repository = repositoryCopy;

          return true;
      }

      return false;
  }

  public takeMoney(moneyUnits: IMoneyUnit[]): boolean {
      moneyUnits.forEach((unit) => {
          this._repository[unit.moneyInfo.currency][
              +unit.moneyInfo.denomination
          ].count = unit.count;
          this._repository[unit.moneyInfo.currency].total +=
        unit.count * +unit.moneyInfo.denomination;
      });

      return true;
  }
}
