import React, { useState, useRef } from "react";

// Theme Tokens - updated to teal dominant
const THEME_TOKENS: Record<string, React.CSSProperties> = {
  smkn13: {
    "--brand-primary": "#14b8a6",
    "--brand-primaryText": "#ffffff",
    "--brand-accent": "#f59e0b",
    "--brand-bg": "#0a0a0a",
    "--brand-surface": "rgba(24,24,27,0.8)",
    "--brand-surfaceText": "#f3f4f6",
    "--brand-subtle": "#27272a",
    "--brand-pop": "#3b82f6",
  },
};

// Apply theme
document.documentElement.style.cssText = Object.entries(THEME_TOKENS.smkn13).map(([k, v]) => `${k}: ${v};`).join('');

// Utility: clsx
const clsx = (...args: Array<string | false | null | undefined>): string =>
  args.filter(Boolean).join(" ");

// Mini Icons
const Icon = ({ label }: { label: string }) => (
  <span
    aria-hidden
    className="inline-block align-middle select-none"
    style={{ width: 16, display: "inline-flex", justifyContent: "center" }}
  >
    {label}
  </span>
);
const ISave = () => <Icon label="💾" />;

// Utility Components
interface FieldProps {
  label?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

const Field: React.FC<FieldProps> = ({ label, hint, children, className }) => (
  <label className={clsx("block", className)}>
    {label && (
      <div className="mb-1 text-xs font-medium text-white">{label}</div>
    )}
    {children}
    {hint && <div className="mt-1 text-[10px] text-teal-200/50">{hint}</div>}
  </label>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input: React.FC<InputProps> = ({ className, ...props }) => (
  <input
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20",
      className
    )}
  />
);

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ className, ...props }) => (
  <textarea
    {...props}
    className={clsx(
      "w-full rounded-xl border border-white/20 bg-white/20 px-3 py-2 text-sm text-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20",
      className
    )}
  />
);

interface ImageUploadProps {
  value?: string;
  onChange: (dataUrl: string) => void;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = "Unggah Gambar",
}) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result || ""));
    reader.readAsDataURL(f);
  };
  return (
    <div className="rounded-xl bg-white/20 border border-white/20 p-3">
      <div className="mb-2 text-xs font-medium text-white">{label}</div>
      <div className="flex items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onPick}
          className="text-xs text-white"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-teal-500/20"
        >
          Pilih File
        </button>
      </div>
      {value && (
        <div className="mt-3">
          <img
            src={value}
            alt="preview"
            className="max-h-36 rounded-lg border border-white/20"
          />
        </div>
      )}
    </div>
  );
};

// Data Interfaces
interface Sambutan {
  name: string;
  tenure: string;
  photo: string;
  text: string;
  bullets: string[];
}

// Default Data
const DEFAULT_SAMBUTAN: Sambutan = {
  name: "Drs. Deky Noviar, M.M",
  tenure: "2024–sekarang",
  photo: "",
  text: "Assalamu'alaikum warahmatullahi wabarakatuh. Selamat datang di website resmi SMKN 13 Jakarta.",
  bullets: [
    "Penguatan teaching factory & kelas industri",
    "Sertifikasi kompetensi (BNSP/industri)",
    "PKL terpadu & penempatan kerja",
    "Budaya sekolah aman & anti-perundungan",
  ],
};

// List Editor
interface ListEditorProps {
  items: string[];
  onChange: (list: string[]) => void;
  placeholder?: string;
}

const ListEditor: React.FC<ListEditorProps> = ({
  items,
  onChange,
  placeholder = "Teks...",
}) => {
  const setAt = (index: number, value: string) => {
    const copy = [...items];
    copy[index] = value;
    onChange(copy);
  };

  const add = () => onChange([...items, ""]);
  const del = (index: number) => onChange(items.filter((_, idx) => idx !== index));
  const up = (index: number) => {
    if (index <= 0) return;
    const copy = [...items];
    [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
    onChange(copy);
  };
  const down = (index: number) => {
    if (index >= items.length - 1) return;
    const copy = [...items];
    [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]];
    onChange(copy);
  };

  return (
    <div className="space-y-4">
      {items.map((text, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={text}
            onChange={(e) => setAt(index, e.target.value)}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => up(index)}
            className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs text-white hover:bg-teal-500/20"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => down(index)}
            className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs text-white hover:bg-teal-500/20"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => del(index)}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-300 hover:bg-red-500/20"
          >
            Hapus
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-teal-500/20"
      >
        Tambah
      </button>
    </div>
  );
};

export function Sambutan() {
  const [local, setLocal] = useState<Sambutan>(DEFAULT_SAMBUTAN);

  const touch = (patch: Partial<Sambutan>) => {
    setLocal({ ...local, ...patch });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sambutan data saved:", local);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 mb-10 rounded-2xl border border-white/20"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nama Kepala Sekolah">
          <Input
            value={local.name}
            onChange={(e) => touch({ name: e.target.value })}
          />
        </Field>
        <Field label="Masa Jabatan">
          <Input
            value={local.tenure}
            onChange={(e) => touch({ tenure: e.target.value })}
          />
        </Field>
        {/* <br /> */}
        <Field label="Foto (Data URL)">
          <ImageUpload
            value={local.photo}
            onChange={(dataUrl) => touch({ photo: dataUrl })}
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Teks Sambutan">
            <TextArea
              rows={5}
              value={local.text}
              onChange={(e) => touch({ text: e.target.value })}
            />
          </Field>
        </div>
      </div>
      <div>
        <div className="mb-2 text-sm font-medium text-white">Prioritas</div>
        <ListEditor
          items={local.bullets}
          onChange={(list) => touch({ bullets: list })}
          placeholder="Prioritas..."
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-teal-500/90 px-4 py-2 text-sm font-semibold hover:bg-teal-500 text-white transition-shadow"
        >
          <ISave className="h-4 w-4" /> Simpan Sambutan
        </button>
      </div>
    </form>
  );
}