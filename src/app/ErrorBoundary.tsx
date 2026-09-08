import { Component, type ErrorInfo, type ReactNode } from "react";
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { if (import.meta.env.DEV) console.error("System boundary", error, info); }
  render() { return this.state.failed ? <main className="fatal" role="alert"><p className="kicker">SYSTEM INTERRUPTION</p><h1>O vínculo foi interrompido.</h1><p>Recarregue o terminal para restabelecer o acesso.</p><button onClick={() => window.location.reload()}>REINITIALIZE</button></main> : this.props.children; }
}
