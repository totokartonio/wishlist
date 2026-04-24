import styles from "./InviteLink.module.css";
import { Button } from "../../../../../ui/Button/Button";
import { CopyIcon } from "@phosphor-icons/react/dist/csr/Copy";
import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import { useState } from "react";

type Props = {
  url?: string;
  onGenerate: () => void;
};

const InviteLink = ({ url, onGenerate }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className={styles.container}>
      <h3>Invite Link</h3>
      <Button onClick={onGenerate} variant="flat" color="primary">
        {url ? "Generate new invite link" : "Generate invite link"}
      </Button>
      {url && (
        <div>
          <button
            onClick={handleCopy}
            className={styles.button}
            aria-label="Copy invite link"
          >
            {copied ? (
              <CheckIcon size={16} className={styles.icon} />
            ) : (
              <CopyIcon size={16} className={styles.icon} />
            )}
            <span className={styles.url}>{url}</span>
          </button>
        </div>
      )}
    </section>
  );
};

export { InviteLink };
