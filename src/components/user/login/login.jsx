import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../user/InputField";
import { ButtonMediumFullWide } from "../../ui/Buttons";
import LoadingSpinner from "../../ui/LoadingSpinner";
import {
  useEmailValidator,
  usePasswordValidator,
} from "../../../hooks/input-sanitizers/useAuthValidators";
import { AuthContext } from "../../../context/AuthProvider";
import { kAPI_URL } from '../../../api/utils/constants';

const Login = ({ userType, toggle }) => {
  const [username, setUsername] = useState("");
  const {
    value: emailValue,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    markAsTouched: emailMarkAsTouched,
    inputReset: emailInputReset,
  } = useEmailValidator();

  const {
    value: passwordValue,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    markAsTouched: passwordMarkAsTouched,
    inputReset: passwordInputReset,
  } = usePasswordValidator();

  const { setIsLoggedIn, fetchUserData } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (userType === "admin") {
      emailMarkAsTouched();
      if (emailHasError) {
        setError("Invalid email address. Please try again.");
        setSuccess(null);
        return;
      }
    } else {
      if (!username.trim()) {
        setError("Please enter your username.");
        setSuccess(null);
        return;
      }
    }

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const endpoint = userType === "admin" 
        ? `${kAPI_URL}/users/login`
        : `${kAPI_URL}/respondents/login`;

      const loginData = userType === "admin"
        ? {
            email: emailValue.trim(),
            password: passwordValue,
          }
        : {
            username: username.trim(),
            password: passwordValue,
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", userType);
      setIsLoggedIn(true);
      await fetchUserData();
      setError(null);
      setUsername("");
      emailInputReset();
      passwordInputReset();
      setSuccess("Login successful!");
      setIsLoading(false);
      setTimeout(() => {
        document.getElementById(`${userType}_login_modal`).close();
        navigate("/dataanalyst");
        setSuccess(null);
        setIsLoading(false);
      }, 2000);
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
      setSuccess(null);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <h2 className="card-title">{userType === "admin" ? "Admin Login" : "Respondent Login"}</h2>

      {/* Show different input fields based on user type */}
      {userType === "admin" ? (
        <InputField
          label="Email"
          type="text"
          placeholder="Please enter your email address"
          value={emailValue}
          onChange={emailChangeHandler}
          onBlur={emailMarkAsTouched}
          hasError={emailHasError}
          errorMessage="Please enter a valid email address."
        />
      ) : (
        <InputField
          label="Username"
          type="text"
          placeholder="Please enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          hasError={false}
        />
      )}

      {/* Input field for password */}
      <InputField
        label="Password"
        type="password"
        placeholder="Please enter your password"
        value={passwordValue}
        onChange={passwordChangeHandler}
        onBlur={passwordMarkAsTouched}
        onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
      />
      {/* Login button */}
      <div className="form-control mt-6">
        <ButtonMediumFullWide
          onClick={handleLogin}
          textColor={"text-primary-content"}
        >
          {isLoading ? <LoadingSpinner /> : "Login"}
        </ButtonMediumFullWide>
      </div>
      {/* Error and success messages */}
      {error && <div className="pt-3 text-error">{error}</div>}
      {success && <div className="pt-3 text-success">{success}</div>}

      {userType === "admin" && (
        <p className="mt-4">
          Don't have an account?{" "}
          <button className="text-info hover:underline" onClick={toggle}>
            Register here
          </button>
        </p>
      )}
    </div>
  );
};

export default Login;
