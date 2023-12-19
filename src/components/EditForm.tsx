import { useForm } from "react-hook-form";
import { AddExpenseData, ExpensesData } from "./constans/types";
import { yupResolver } from "@hookform/resolvers/yup";
import style from './ExpenseDetails.module.css';
import { schemaAddExpense } from "./validation/validation";
import { fetchDataByRow, handleDelete, updateExpense } from "../api/api";
import { useUserContext } from "../context/UserContext";
import { createPureMonthAndYearDataFormat, expensesGetYear } from "./utils/utils";
import { Button } from "@chakra-ui/react";
import { ConfirmButton, SubmitButton } from "./common/Buttons";
import { buttonData } from "./constans/constans";
import { InputField } from "./common/Inputs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotificationContext } from "../context/NotificationContext";

const EditForm = () => {
    const { toggleAlertSuccess, toggleAlertError } = useNotificationContext();
    const { userId } = useUserContext();
    const queryClient = useQueryClient();
    const {id} = useParams();
    const navigate = useNavigate();
    const idFormat = id?.replace(/-/g, ' ').slice(0,-1).trim();
    const idToDetails = id?.replace(' ', '-').slice(0,-2);

    const { register, handleSubmit } = useForm<AddExpenseData>({
        defaultValues: {
          expense: '',
          price: 0,
        },
        resolver: yupResolver(schemaAddExpense)
      });
    const onEdit = (data: AddExpenseData) => {
        mutation.mutate(data);
      }

      const inputData = {
        expenseData: {
          type: "text",
          text: "Expense",
          register: {...register("expense")}
        },
        priceData: {
            type: "number",
            text: "Price",
            register: {...register("price")}
          }
      }

    const expensesFilter = () => {
        return expenses.filter((exp:ExpensesData)=>{
            return (createPureMonthAndYearDataFormat(exp)).includes(idFormat);
            
        }).map((expens:ExpensesData,i: number)=>{   
            return (
                <>
                        <div>{i+1}</div>
                        <div>{expens.productLabel === id ? <InputField value={inputData.expenseData} /> : expens.productCategory}</div>
                        <div>{expens.productLabel === id ? <><InputField value={inputData.priceData} /></> : expens.productPrice} zł</div>
                        <div>
                            {expens.productLabel === id ? <SubmitButton value={buttonData.saveButton} /> :
                            <Link to={`/expenseDetails/${expens.productLabel}/edit`}>
                                <ConfirmButton value={buttonData.editButton} />
                            </Link>}
                            {/* chciałabym użyć <ConfirmButton value={buttonData.deleteButton} /> czyli zgodnie z moim schematem, ale nie wiem jak przekazać funkcję onClick jako kolejny parametr */}
                            <Button colorScheme="red" type="button" onClick={()=>mutationDelete.mutate(expens.productLabel)} >Delete</Button></div>
                </>
            )
        })
    }

    const { data:expenses, isLoading, error } = useQuery({
        queryKey: ['expenses'],
        queryFn: () => fetchDataByRow(userId).then((data)=>{
            return expensesGetYear(data)
        })
    })
    const mutation = useMutation({
        mutationFn: async (values:AddExpenseData) => {
          await updateExpense(values, id, toggleAlertSuccess, toggleAlertError);
          navigate(`/expenseDetails/${idToDetails}`);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['expenses'] })
        },
        onError: () => {
          throw new Error("Something went wrong :(");
        }
      })

    const mutationDelete = useMutation({
        mutationFn: (value:string) => {
          return handleDelete(value, toggleAlertSuccess, toggleAlertError);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['expenses'] })
        },
        onError: () => {
          throw new Error("Something went wrong :(");
        }
      })

    if (isLoading) {
        return <div>Loading...</div>
      }
    if (error) {
        return <div>Error! Contact with administrator.</div>
    }
    
    return (
        <>
            <h2>Details for {idFormat}</h2>
            <section className={style.expensesBox}>
                <div>
                    <h3>Add expense</h3>
                    <form>
                        <h3>Add expense category:</h3>
                        <InputField value={inputData.expenseData} />
                        <p></p>
                        <h3>Add price:</h3>
                        <InputField value={inputData.priceData} />
                        <p></p>
                        {/* nie wiem jak przekazać funkcję onClick jako parametr */}
                        <Button type='button' colorScheme="green" onClick={()=>toggleAlertError('Firstly finish edit!')}>Add</Button>
                    </form>
                </div>
                <div>
                    <h3>Your expenses</h3>
                    <div>
                        <form onSubmit={handleSubmit(onEdit)} className={style.container}>
                            <div>Id</div>
                            <div>Category</div>
                            <div>Price</div>
                            <div>Buttons</div>
                            {expensesFilter()}
                        </form>
                    </div>
                </div>
            </section>
            <Link to={`/expenseDetails/${idToDetails}`}>
                <ConfirmButton value={buttonData.backButton} />
            </Link>
        </>
    )
}

export default EditForm