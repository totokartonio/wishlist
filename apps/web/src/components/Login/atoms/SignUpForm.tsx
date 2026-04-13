import { useState } from "react";

type Props = {
  email: string;
  password: string;
  name: string;
  fieldErrors: {
    email: string;
    password: string;
    name: string;
  };
  onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChangeMode: () => void;
};

const SignUpForm = ({
  email,
  password,
  name,
  fieldErrors,
  onSubmit,
  onChange,
  onBlur,
  onChangeMode,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <form onSubmit={(event) => onSubmit(event)} aria-label="Sign up form">
        <label htmlFor="name">
          Name:
          <input
            id="name"
            type="text"
            value={name}
            name="name"
            onChange={onChange}
            onBlur={onBlur}
            required
            placeholder="John Smith"
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
          />
          {fieldErrors.name && (
            <span id="name-error" role="alert">
              {fieldErrors.name}
            </span>
          )}
        </label>
        <label htmlFor="email">
          Email:
          <input
            id="email"
            type="email"
            placeholder="your@mail.com"
            value={email}
            name="email"
            onChange={onChange}
            onBlur={onBlur}
            required
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
          />
          {fieldErrors.email && (
            <span id="email-error" role="alert">
              {fieldErrors.email}
            </span>
          )}
        </label>
        <label htmlFor="password">
          Password:
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            name="password"
            onChange={onChange}
            onBlur={onBlur}
            required
            aria-describedby={
              fieldErrors.password ? "password-error" : undefined
            }
            data-testid="password-input"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            data-testid="show-password"
          >
            Show password
          </button>
          {fieldErrors.password && (
            <span id="password-error" role="alert">
              {fieldErrors.password}
            </span>
          )}
        </label>
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account?{" "}
        <button type="button" onClick={onChangeMode} data-testid="change-mode">
          Sign in
        </button>
      </p>
    </>
  );
};

export { SignUpForm };
