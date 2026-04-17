import { useState } from "react";
import { signIn, signUp } from "../../lib/auth-client";
import { SignInForm } from "./atoms/SignInForm";
import { SignUpForm } from "./atoms/SignUpForm";
import { useNavigate } from "@tanstack/react-router";
import styles from "./Login.module.css";

type MessageType = "error" | "success" | "info";

type Message = {
  type: MessageType;
  text: string;
} | null;

const Login = () => {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [message, setMessage] = useState<Message>(null);
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
    name: "",
  });

  const navigate = useNavigate();

  const hasErrors = () => {
    const errors = {
      email: !formData.email
        ? "Email is required"
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
          ? "Invalid email format"
          : "",
      password: !formData.password
        ? "Password is required"
        : formData.password.length < 8
          ? "Password must be at least 8 characters"
          : "",
      name: mode === "sign-up" && !formData.name ? "Name is required" : "",
    };
    setFieldErrors(errors);
    return Object.values(errors).some(Boolean);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (hasErrors()) return;

    if (mode === "sign-in") {
      const { error } = await signIn.email({
        email: formData.email,
        password: formData.password,
      });
      if (error)
        setMessage({
          type: "error",
          text: error.message ?? "Failed to sign in",
        });
      else navigate({ to: "/dashboard" });
    }

    if (mode === "sign-up") {
      const { error } = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });
      if (error)
        setMessage({
          type: "error",
          text: error.message ?? "Failed to sign up",
        });
      else {
        setMode("sign-in");
        setFormData((prev) => ({ ...prev, password: "" }));
        setFieldErrors({ email: "", password: "", name: "" });
        setMessage({
          type: "success",
          text: "Account created! Please sign in.",
        });
      }
    }
  };

  const hanldeChangeMode = () => {
    if (mode === "sign-in") setMode("sign-up");
    if (mode === "sign-up") setMode("sign-in");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    switch (name) {
      case "email":
        if (!value)
          setFieldErrors((prev) => ({ ...prev, email: "Email is required" }));
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          setFieldErrors((prev) => ({
            ...prev,
            email: "Invalid email format",
          }));
        else setFieldErrors((prev) => ({ ...prev, email: "" }));
        break;

      case "password":
        if (!value)
          setFieldErrors((prev) => ({
            ...prev,
            password: "Password is required",
          }));
        else if (value.length < 8)
          setFieldErrors((prev) => ({
            ...prev,
            password: "Password must be at least 8 characters",
          }));
        else setFieldErrors((prev) => ({ ...prev, password: "" }));
        break;

      case "name":
        if (!value)
          setFieldErrors((prev) => ({ ...prev, name: "Name is required" }));
        else setFieldErrors((prev) => ({ ...prev, name: "" }));
        break;
    }
  };

  return (
    <>
      <h1>Login</h1>
      {mode === "sign-in" ? (
        <SignInForm
          email={formData.email}
          password={formData.password}
          fieldErrors={fieldErrors}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onBlur={handleBlur}
          onChangeMode={hanldeChangeMode}
        />
      ) : (
        <SignUpForm
          email={formData.email}
          password={formData.password}
          name={formData.name}
          fieldErrors={fieldErrors}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onBlur={handleBlur}
          onChangeMode={hanldeChangeMode}
        />
      )}
      {message && <div className={styles[message.type]}>{message.text}</div>}
    </>
  );
};

export { Login };
