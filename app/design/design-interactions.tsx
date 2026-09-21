"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import styles from "./design.module.css";

export type DesignToken = {
  name: string;
  value: string;
  color?: string;
};

function fallbackCopy(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    throw new Error("Clipboard is unavailable");
  }
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  fallbackCopy(value);
}

export function TokenGrid({ tokens }: { tokens: DesignToken[] }) {
  const [result, setResult] = useState<{
    name: string;
    status: "success" | "error";
  } | null>(null);

  async function handleCopy(token: DesignToken) {
    try {
      await copyText(`var(${token.name})`);
      setResult({ name: token.name, status: "success" });
    } catch {
      setResult({ name: token.name, status: "error" });
    }
  }

  const statusMessage = result
    ? result.status === "success"
      ? `${result.name} скопійовано`
      : `Не вдалося скопіювати ${result.name}`
    : "Оберіть токен, щоб скопіювати CSS-змінну";

  return (
    <div>
      <div className={styles.tokenGrid}>
        {tokens.map((token) => {
          const isCopied = result?.status === "success" && result.name === token.name;

          return (
            <button
              key={token.name}
              type="button"
              className={styles.tokenCard}
              onClick={() => handleCopy(token)}
              aria-label={`Скопіювати var(${token.name})`}
            >
              {token.color ? (
                <span
                  className={styles.tokenSwatch}
                  style={{ backgroundColor: token.color }}
                  aria-hidden="true"
                />
              ) : null}
              <span className={styles.tokenMeta}>
                <strong>{token.name}</strong>
                <span>{token.value}</span>
              </span>
              <span className={styles.copyIcon} aria-hidden="true">
                {isCopied ? <Check size={16} /> : <Copy size={16} />}
              </span>
            </button>
          );
        })}
      </div>
      <p className={styles.copyStatus} role="status" aria-live="polite">
        {statusMessage}
      </p>
    </div>
  );
}
