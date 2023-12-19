import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom"
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaLogin } from "./validation/validation";
import style from "./Login.module.css";
import { LoginData } from "./constans/types";
import { loginUser } from "../api/api";
import { useUserContext } from "../context/UserContext";
import { ConfirmButton, SubmitButton } from "./common/Buttons";
import { InputField } from "./common/Inputs";
import { buttonData } from "./constans/constans";
import { useNotificationContext } from "../context/NotificationContext";

export const Login = () => {
    const { toggleAlertSuccess, toggleAlertError } = useNotificationContext();
    const navigate = useNavigate();
    const { setToken, setId }=useUserContext();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
        defaultValues: {
          email: '',
          password: '',
        },
        resolver: yupResolver(schemaLogin)
      });
      const onSubmit = (data: LoginData) => {
        loginUser(data, toggleAlertSuccess, toggleAlertError).then((data)=>{
            setToken(data?.session.access_token);
            setId(data?.user.id);
            navigate('/');
        });
      }

      const inputData = {
        emailData: {
          type: "text",
          text: "E-mail",
          register: {...register("email")}
        },
        passwordData: {
          type: "password",
          text: "Password",
          register: {...register("password")}
        }
      }

    return (
        <>
            <Link to={"/signup"}>
                <ConfirmButton value={buttonData.signupButton} />
            </Link>
            <h2>Sign in</h2>
            <section className={style.loginForm}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h3>E-mail</h3>
                    <InputField value={inputData.emailData} />
                    <p>{errors.email?.message}</p>
                    <h3>Password</h3>
                    <InputField value={inputData.passwordData} />
                    <p>{errors.password?.message}</p>
                    <SubmitButton value={buttonData.signinButton} />
                </form>
            </section>
        </>
    )
}
