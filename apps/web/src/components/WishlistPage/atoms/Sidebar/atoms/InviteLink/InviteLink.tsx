import styles from "./InviteLink.module.css";
import { Button } from "../../../../../ui/Button/Button";
import { CopyIcon } from "@phosphor-icons/react/dist/csr/Copy";

type Props = {
  url?: string;
  onGenerate: () => void;
};

const InviteLink = ({ url, onGenerate }: Props) => {
  return (
    <section className={styles.container}>
      <h3>Invite Link</h3>
      <Button onClick={onGenerate} variant="flat" color="primary">
        {url ? "Generate new invite link" : "Generate invite link"}
      </Button>
      {url && (
        <div>
          <button
            onClick={() => navigator.clipboard.writeText(url)}
            className={styles.button}
            aria-label="Copy invite link"
          >
            <CopyIcon size={16} className={styles.icon} />
            <span className={styles.url}>{url}</span>
          </button>
        </div>
      )}
    </section>
  );
};

export { InviteLink };
