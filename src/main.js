import { observeAuthState } from "./services/auth.js";
import "./styles.css";

const status = document.querySelector("#system-status");

observeAuthState((player) => {
  status.textContent = player
    ? "Sessão de jogador restaurada."
    : "Sistema online. Autenticação necessária.";
});
