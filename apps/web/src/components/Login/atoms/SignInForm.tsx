type Props = {
  email: string;
  password: string;
  fieldErrors: {
    email: string;
    password: string;
  };
  onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChangeMode: () => void;
};

const SignInForm = ({
  email,
  password,
  fieldErrors,
  onSubmit,
  onChange,
  onBlur,
  onChangeMode,
}: Props) => {
  return (
    <>
      <form onSubmit={(event) => onSubmit(event)} aria-label="Sign in form">
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
            type="password"
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
          {fieldErrors.password && (
            <span id="password-error" role="alert">
              {fieldErrors.password}
            </span>
          )}
        </label>
        <button type="submit">Sign In</button>
      </form>
      <a href="#" data-testid="change-password">
        Forgot password?
      </a>
      <p>
        Don't have account?{" "}
        <button type="button" onClick={onChangeMode} data-testid="change-mode">
          Sign up
        </button>
      </p>
    </>
  );
};

export { SignInForm };
