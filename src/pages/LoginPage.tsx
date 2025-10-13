import "../styles/login.css";
import LoginForm from "../components/LoginForm";
import logo from "../assets/logo.png";

export const Login = () => {
    return (
        <div
        className="flex md:flex-row h-screen w-screen items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${logo})` }}
        >
        <div className="absolute inset-0 bg-black/60"></div>

        <LoginForm />
        </div>
    );
};
