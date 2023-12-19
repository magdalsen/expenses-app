
export interface SignupData {
    name: string;
    email: string;
    password: string;
    confirm: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface IncomeData {
    id: string;
    monthIncome: number;
    monthName: string;
    year: number;
}

export interface ExpensesData {
    created_at: string;
    id: string;
    productCategory: string;
    productPrice: number;
    productLabel: string;
}

export interface AddMonthData {
    month: string;
    income: number;
    year: number;
}

export interface AddExpenseData {
    expense: string;
    price: number;
}