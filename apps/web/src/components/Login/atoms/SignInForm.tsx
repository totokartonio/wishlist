import Input from "../../../components/ui/Input";
import { useState } from "react";
import { Button } from "../../../components/ui/Button/Button";
import styles from "../Login.module.css";
import { EyeIcon } from "@phosphor-icons/react/dist/csr/Eye";
import { EyeSlashIcon } from "@phosphor-icons/react/dist/csr/EyeSlash";

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
  const [showPassword, setShowPassword] = useState(false);

  const rightElement = (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      aria-label={showPassword ? "Hide password" : "Show password"}
      data-testid="show-password"
      className={styles.iconButton}
    >
      {showPassword ? <EyeSlashIcon size={18} /> : <EyeIcon size={18} />}
    </button>
  );

  return (
    <div className={styles.formContainer}>
      <form
        onSubmit={(event) => onSubmit(event)}
        aria-label="Sign in form"
        className={styles.form}
      >
        <Input
          label="Email:"
          id="email"
          type="email"
          placeholder="your@mail.com"
          value={email}
          name="email"
          onChange={onChange}
          onBlur={onBlur}
          required
          error={fieldErrors.email}
        />
        <Input
          label="Password:"
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          name="password"
          onChange={onChange}
          onBlur={onBlur}
          required
          data-testid="password-input"
          error={fieldErrors.password}
          rightElement={rightElement}
        />
        <Button
          variant="raised"
          color="primary"
          type="submit"
          className={styles.submitButton}
        >
          Sign In
        </Button>
      </form>
      <a href="#" data-testid="change-password">
        Forgot password?
      </a>
      <div className={styles.switch}>
        Don't have account?{" "}
        <Button
          variant="ghost"
          color="secondary"
          type="button"
          onClick={onChangeMode}
          data-testid="change-mode"
        >
          Sign up
        </Button>
      </div>
    </div>
  );
};

export { SignInForm };
