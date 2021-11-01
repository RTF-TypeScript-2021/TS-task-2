import { Currency } from '../enums';

interface IDictionary<T> {
    [Key: string]: T;
}

interface IMoneyInfo {
    denomination: string;
    currency: Currency;
}

export interface IMoneyUnit {
    moneyInfo: IMoneyInfo;
    count: number;
}

class MoneyValue {
    private readonly linkedUnit: IMoneyUnit;
    public get count(): number {
        return this.linkedUnit.count;
    }
    public set count(value: number) {
        this.linkedUnit.count = value;
    }
    public get denomination(): number {
        return parseInt(this.linkedUnit.moneyInfo.denomination);
    }

    constructor(linkedUnit: IMoneyUnit) {
        this.linkedUnit = linkedUnit;
    }

    public clone(): MoneyValue {
        return new MoneyValue({...this.linkedUnit});
    }
}

export class MoneyRepository {
    private static readonly _denominations: Array<string> = ["1", "5", "10", "50", "100", "200", "500", "1000", "2000", "5000"];
    private _repository: IDictionary<Array<MoneyValue>> = {};
    private _balance: IDictionary<number> = {};

    constructor(initialRepository: Array<IMoneyUnit>) {
        if (initialRepository.some(unit => 
            !MoneyRepository._denominations.includes(unit.moneyInfo.denomination))
        ) { 
            throw new Error("Invalid denomination received");
        }

        this.takeMoney(initialRepository);   
    }

    public giveOutMoney(count: number, currency: Currency): boolean {
        if (count < this._balance[currency] || !(currency in this._balance)) {
            return false;
        }

        const currencyRep = {...this._repository}[currency]
            .sort((x, y) => x.denomination - y.denomination)
            .map(x => x.clone())
        for (const value of currencyRep) {
            while (count > 0 && value.denomination <= count && value.count > 0){
                count -= value.denomination;
                value.count -= 1;
            }
        }
        if (count === 0) { 
            this._repository[currency] = currencyRep.filter(value => value.count !== 0);
        }

        return count === 0;
    }

    public takeMoney(moneyUnits: Array<IMoneyUnit>): boolean {
        for (const unit of moneyUnits) {
            if (!(unit.moneyInfo.currency in this._repository)) {
                this._repository[unit.moneyInfo.currency] = [];
            }
            this._repository[unit.moneyInfo.currency].push(new MoneyValue(unit));
            this._balance[unit.moneyInfo.currency] += unit.count * parseInt(unit.moneyInfo.denomination);
        }
        
        return true;
    }
}