import { useState } from "react";
import InputField from "../InputField";
import { ButtonMediumFullWide } from "../../ui/Buttons";
import LoadingSpinner from "../../ui/LoadingSpinner";
import {
  useEmailValidator,
  usePasswordValidator,
  useNameValidator,
} from "../../../hooks/input-sanitizers/useAuthValidators";
import { kAPI_URL } from '../../../api/utils/constants';

function Register({ toggle }) {
  const {
    value: firstName,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    markAsTouched: firstNameMarkAsTouched,
    inputReset: firstNameInputReset,
  } = useNameValidator();

  const {
    value: lastName,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    markAsTouched: lastNameMarkAsTouched,
    inputReset: lastNameInputReset,
  } = useNameValidator();

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

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // 验证所有字段
    firstNameMarkAsTouched();
    lastNameMarkAsTouched();
    emailMarkAsTouched();
    passwordMarkAsTouched();

    if (firstNameHasError || lastNameHasError || emailHasError || passwordHasError) {
      setError("Please fill in all fields correctly.");
      return;
    }

    try {
      // 清除之前的消息
      setError(null);
      setSuccess(null);
      // 显示加载状态
      setIsLoading(true);

      const response = await fetch(`${kAPI_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailValue,
          password: passwordValue,
          firstName,
          lastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // 重置表单
      firstNameInputReset();
      lastNameInputReset();
      emailInputReset();
      passwordInputReset();

      // 显示成功消息
      setSuccess("Registration successful!");
      
      // 延迟关闭模态框
      setTimeout(() => {
        document.getElementById("admin_login_modal").close();
        setSuccess(null);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <h2 className="card-title">Register</h2>

      <InputField
        label="First Name"
        type="text"
        placeholder="Please enter your first name"
        value={firstName}
        onChange={firstNameChangeHandler}
        onBlur={firstNameMarkAsTouched}
        hasError={firstNameHasError}
        errorMessage="Please enter your first name."
      />

      <InputField
        label="Last Name"
        type="text"
        placeholder="Please enter your last name"
        value={lastName}
        onChange={lastNameChangeHandler}
        onBlur={lastNameMarkAsTouched}
        hasError={lastNameHasError}
        errorMessage="Please enter your last name."
      />

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

      <InputField
        label="Password"
        type="password"
        placeholder="Please enter your password"
        value={passwordValue}
        onChange={passwordChangeHandler}
        onBlur={passwordMarkAsTouched}
        hasError={passwordHasError}
        errorMessage="Please enter a valid password."
      />

      <div className="form-control mt-6">
        <ButtonMediumFullWide
          onClick={handleRegister}
          textColor={"text-primary-content"}
        >
          {isLoading ? <LoadingSpinner /> : "Register"}
        </ButtonMediumFullWide>
      </div>

      {error && <div className="pt-3 text-error">{error}</div>}
      {success && <div className="pt-3 text-success">{success}</div>}

      <p className="mt-4">
        Already have an account?{" "}
        <button className="text-info hover:underline" onClick={toggle}>
          Login here
        </button>
      </p>
    </div>
  );
}

export default Register;
