const messages: Record<string, string> = {
  "auth/invalid-credential": "ACCESS DENIED — identidade ou chave não reconhecida.",
  "auth/email-already-in-use": "PLAYER ID UNAVAILABLE — escolha outra identificação.",
  "auth/weak-password": "ACCESS KEY REJECTED — use ao menos seis caracteres.",
  "auth/too-many-requests": "CHANNEL LOCKED — aguarde antes de tentar novamente.",
  "auth/network-request-failed": "LINK INTERRUPTED — verifique sua conexão.",
};
export function translateAuthError(error: unknown): string {
  if (typeof error === "object" && error && "code" in error && typeof error.code === "string") return messages[error.code] ?? "SYSTEM ERROR — não foi possível concluir a conexão.";
  return "SYSTEM ERROR — não foi possível concluir a conexão.";
}
