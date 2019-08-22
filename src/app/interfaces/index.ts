export interface MealInterface {
    id: string;
    name: string;
    price: number;
    quantity: string;
    quantityText: string;
}

export interface SupplyInterface {
    id: string;
    name: string;
    price: number;
    balance: number;
    type: number;
}

export interface TableInterface {
    order_id: string;
    order_time: string;
    name: string;
    note: string;
    meals: string;
    sale_off: number;
    extra_cost: number;
    status: number;
    paid: number;
}

export interface CostInterface {
    id: string;
    log_date: string;
    name: string;
    value: number;
    status: number;
}