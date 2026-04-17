type Props = {
  url?: string;
  onGenerate: () => void;
};

const InviteLink = ({ url, onGenerate }: Props) => {
  return (
    <section>
      <button onClick={onGenerate}>
        {url ? "Generate new invite link" : "Generate invite link"}
      </button>
      {url && (
        <div>
          <p>{url}</p>
          <button onClick={() => navigator.clipboard.writeText(url)}>
            Copy
          </button>
        </div>
      )}
    </section>
  );
};

export { InviteLink };
