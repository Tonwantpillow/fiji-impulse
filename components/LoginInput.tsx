export default function LoginInput({
  prompt,
  value,
  onChange,
  type = "text",
  disabled = false,
  name,
  className = "text-white"
}: {
  prompt: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
  name?: string;
  className?: string;
}) {
  return (
    <div>
      <p className={className}>{prompt}</p>
      <input
        type={type}
        name={name}
        placeholder={prompt}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full bg-white px-[16px] py-[12px] rounded-[8px] border border-gray-300 disabled:opacity-50"
      />
    </div>
  );
}
