import { AddExpenseData, AddMonthData, LoginData, SignupData } from "../components/constans/types";
import { calculateDateForEachMonth } from "../components/utils/utils";
import { supabase } from "../supabaseClient";

export const addUser = async (values:SignupData, toggleAlertSuccess: { (alert: string): void; (arg0: string): void; }, toggleAlertError: { (alert: string): void; (arg0: string): void; }) => {
    const { name, email, password } = values;
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    })
    if (error) throw error;
    if (data && data.user) {
        const { data:userData, error } = await supabase
        .from('users')
        .insert([
          { id: data.user?.id, name, email }
        ])
        if (error != null) {
            toggleAlertError('User already exist.')
            throw error;
        };
        if (userData === null) toggleAlertSuccess('Success! Account created!');
    }
}

export const loginUser = async (values:LoginData, toggleAlertSuccess: { (alert: string): void; (arg0: string): void; }, toggleAlertError: { (alert: string): void; (arg0: string): void; }) => {
    const { email, password } = values;
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })
    if (error) toggleAlertError(`Login error: ${error}`);
    if (data.user && data) {
        toggleAlertSuccess(`Hello ${email}!`);
        return data
    }
}

export const fetchDataByRow = async (userId: string) => {
    const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('id', userId)
    if (error) throw error;
    if (data) {
        return data
    }
}

export const fetchUserData = async (userId:string) => {
    const { data, error } = await supabase
    .from('income')
    .select('*')
    .eq('id', userId)
    if (error) throw error;
    if (data) {
        return data
    }
}

export const addMonth = async (values:AddMonthData, userId: string, toggleAlertSuccess: { (alert: string): void; (arg0: string): void; }, toggleAlertError: { (alert: string): void; (arg0: string): void; }) => {
    const dbData: (string | string[])[] = [];
    const valuesData = values.month.concat((values.year).toString());
    const { data, error } = await supabase
    .from('income')
    .select('incomeId, monthName, year')
    if (error) throw error;
    data.map(async (el: { monthName: string; year: number; })=>{
        dbData.push((el.monthName).concat(el.year.toString()));
    })
    const check = dbData.includes(valuesData);
    if (check) {
        toggleAlertError('Month already exist!');
        return
    } else {
        const { data:data2, error:error2 } = await supabase
            .from('income')
            .insert([
              { id: userId, incomeId: data.length+1, monthIncome: values.income, monthName: values.month, year: values.year }
            ])
            if (error2) throw error2;
            toggleAlertSuccess('Month added!');
            return data2;
    }
}

export const addExpense = async (values:AddExpenseData, userId: string, idFormat: string | undefined, productLabel: string, toggleAlertSuccess: { (alert: string): void; (alert: string): void; (arg0: string): void; }, toggleAlertError: { (alert: string): void; (alert: string): void; (arg0: string): any; }) => {
    const { data, error } = await supabase
    .from('expenses')
    .insert({ id: userId, productCategory: values.expense, productPrice: values.price, created_at: calculateDateForEachMonth(idFormat), productLabel: productLabel })
    .select()
    if (error) throw toggleAlertError(`Some error occured: ${error}. Please contact with administrator.`);
    if (data) {
        toggleAlertSuccess('Expense added!');
        return data;
    }
}

export const updateExpense = async (values: AddExpenseData, id: string | undefined, toggleAlertSuccess: { (alert: string): void; (arg0: string): void; }, toggleAlertError: { (alert: string): void; (arg0: string): any; }) => {
    const { data, error } = await supabase
    .from('expenses')
    .update({ productCategory: values.expense, productPrice: values.price })
    .eq('productLabel', id)
    .select()
    if (error) throw toggleAlertError(`Some error occured: ${error}. Please contact with administrator.`);
    toggleAlertSuccess('Data updated!')
    return data;
}

export const handleDelete = async (productLabel: string, toggleAlertSuccess: { (alert: string): void; (alert: string): void; (arg0: string): void; }, toggleAlertError: { (alert: string): void; (alert: string): void; (arg0: string): any; }) => {    
    const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('productLabel', productLabel)
    if (error) {
        throw toggleAlertError(`Some error occured: ${error}. Please contact with administrator.`);
    } else {
        toggleAlertSuccess('Expense removed!');
    }
}