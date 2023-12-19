import moment from "moment";
import { AddExpenseData, ExpensesData } from "../constans/types";
import { monthsListed } from "../constans/constans";
import { addExpense } from "../../api/api";

export const formatDate = (data:ExpensesData[]) => {
    const dateArr: number[] = [];
    data.map((el: { created_at: string; })=>{
        const date = moment(el.created_at).utc().format('YYYY-MM-DD');
        const newDate = new Date(date);
        dateArr.push(newDate.getFullYear());
    })
    const removeDuplicateDates = [...new Set(dateArr)];
    return removeDuplicateDates
}

export const expensesGetYear = (data:any) => {
    data.forEach((el: { created_at: moment.MomentInput; }) => {
        el.created_at = moment(el.created_at).month(moment(el.created_at).month()).format("MMMM Do YYYY");
        
    });
    return data
}

export const todayDate = new Date().getFullYear();

export const calculateDateForEachMonth = (idFormat: string | undefined) => {
    const todayDate = new Date();
    const separateDate = idFormat?.split(" ");
    separateDate[0] = monthsListed.indexOf(separateDate[0]);
    todayDate.setMonth(separateDate[0]);
    todayDate.setFullYear(Number(separateDate[1]));
    return todayDate.toISOString();
}

export const createPureMonthAndYearDataFormat = (exp: ExpensesData) => {
    const sliced = (exp.created_at).split(" ");
    return sliced[0] + " " + sliced[2];
}

export const productArrayFiltered = (expenses: ExpensesData[], idFormat: string) => {
    return expenses.filter((exp:ExpensesData)=>{
        return (createPureMonthAndYearDataFormat(exp)).includes(idFormat);
    })
}

export const addExpenseIfLabelIsUnique = (data: AddExpenseData, expenses: ExpensesData[], idFormat: string | undefined, id: string | undefined, userId: string, toggleAlertSuccess: (alert: string) => void, toggleAlertError: (alert: string) => void) => {
    const productArrayFilteredOnlyAccurateData = productArrayFiltered(expenses, idFormat);
    if (productArrayFilteredOnlyAccurateData.length === 0) {
        const firstProductLabel = id + "-" + "1"; // jeśli tablica jest równa 0 czyli nie ma jeszcze wydatków, to zawsze productLabel będzie z wartością 1 (np. January-2023-1)
        return addExpense(data, userId, idFormat, firstProductLabel, toggleAlertSuccess, toggleAlertError);
    } else {
        productArrayFilteredOnlyAccurateData.sort((a,b)=> (a.productLabel).localeCompare(b.productLabel, undefined, { numeric: true })); // sortowanie expenses po productLabel, używam ostatniego (czyli nawiększego) aby zwiększyć wartość dodawanego elementu o +1
        const lastElement = productArrayFilteredOnlyAccurateData[productArrayFilteredOnlyAccurateData.length-1];
        const lastElementSplited = lastElement.productLabel.split('-');
        lastElementSplited[2] = (Number(lastElementSplited[2])+1).toString();
        const lastElementSplitedJoinedToLabelFormat = lastElementSplited.join('-'); // format productLabel to Month-Year-Id (np. February-2022-2, February-2022-3)
        return addExpense(data, userId, idFormat, lastElementSplitedJoinedToLabelFormat, toggleAlertSuccess, toggleAlertError);
    };
}