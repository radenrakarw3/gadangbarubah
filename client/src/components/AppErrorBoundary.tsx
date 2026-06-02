import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[AppErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[100svh] flex-col items-center justify-center gap-4 bg-[#300505] px-6 text-center text-white">
          <p className="font-heroCta text-lg">Gagal memuat halaman.</p>
          <p className="max-w-sm text-sm text-white/70">
            Periksa koneksi internet Anda, lalu muat ulang halaman.
          </p>
          <button
            type="button"
            className="rounded-lg bg-[rgba(89,0,0,0.95)] px-6 py-2.5 font-heroCta text-sm font-semibold italic text-[#F0E6E6] hover:bg-[#6a0000]"
            onClick={() => window.location.reload()}
          >
            Muat ulang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
