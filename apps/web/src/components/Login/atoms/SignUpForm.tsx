import { useState } from "react";
import styles from "../Login.module.css";
import Input from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button/Button";
import { EyeIcon } from "@phosphor-icons/react/dist/csr/Eye";
import { EyeSlashIcon } from "@phosphor-icons/react/dist/csr/EyeSlash";

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
        aria-label="Sign up form"
        className={styles.form}
      >
        <Input
          label="Name:"
          id="name"
          type="text"
          value={name}
          name="name"
          onChange={onChange}
          onBlur={onBlur}
          required
          placeholder="John Smith"
          error={fieldErrors.name}
        />
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
          error={fieldErrors.password}
          rightElement={rightElement}
        />
        <Button
          variant="raised"
          color="primary"
          type="submit"
          className={styles.submitButton}
        >
          Sign Up
        </Button>
      </form>
      <div className={styles.switch}>
        Already have an account?{" "}
        <Button
          variant="ghost"
          color="secondary"
          type="button"
          onClick={onChangeMode}
          data-testid="change-mode"
        >
          Sign in
        </Button>
      </div>
    </div>
  );
};

export { SignUpForm };
