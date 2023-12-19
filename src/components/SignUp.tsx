import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import "./Signup.module.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaSignup } from "./validation/validation";
import { addUser } from "../api/api";
import { SignupData } from "./constans/types";
import { BackButton, SubmitButton } from "./common/Buttons";
import { InputField } from "./common/Inputs";
import { buttonData } from "./constans/constans";
import { useNotificationContext } from "../context/NotificationContext";

const SignUp = () => {
    const { toggleAlertSuccess, toggleAlertError } = useNotificationContext();
    const { register, handleSubmit, formState: { errors } } = useForm<SignupData>({
        defaultValues: {
          name: '',
          email: '',
          password: '',
          confirm: ''
        },
        resolver: yupResolver(schemaSignup)
      });
      const onSubmit = (data: SignupData) => {
        addUser(data, toggleAlertSuccess, toggleAlertError);
      }

      const inputData = {
        nameData: {
          type: "text",
          text: "Name",
          register: {...register("name")}
        },
        emailData: {
          type: "text",
          text: "E-mail",
          register: {...register("email")}
        },
        passwordData: {
          type: "password",
          text: "Password",
          register: {...register("password")}
        },
        confirmData: {
          type: "password",
          text: "Repeat password",
          register: {...register("confirm")}
        }
      }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Sign up</h2>
            <InputField value={inputData.nameData} />
            <p>{errors.name?.message}</p>
            <InputField value={inputData.emailData} />
            <p>{errors.email?.message}</p>
            <InputField value={inputData.passwordData} />
            <p>{errors.password?.message}</p>
            <InputField value={inputData.confirmData} />
            <p>{errors.confirm?.message}</p>
            <SubmitButton value={buttonData.signupButton} />
            <Link to={'/'}>
                <BackButton value={buttonData.backButton} />
            </Link>
        </form>
    )
}

export default SignUp