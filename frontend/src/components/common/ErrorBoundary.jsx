import { Component } from "react";
import { FaExclamationTriangle, FaRedo } from "react-icons/fa";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("UI error caught by ErrorBoundary:", error, info);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="retro-canvas grid min-h-screen place-items-center px-4 py-20">
        <section className="retro-window max-w-xl p-8 text-center">
          <div className="retro-dither mx-auto grid h-24 w-24 place-items-center border-2 border-[#281712] shadow-[4px_4px_0_#281712]">
            <FaExclamationTriangle className="text-4xl text-[#aa3000]" />
          </div>
          <p className="retro-system-copy mt-8 text-[#aa3000]">System error</p>
          <h1 className="retro-headline mt-3 text-4xl text-[#281712]">Tampilan gagal dimuat.</h1>
          <p className="mx-auto mt-4 max-w-sm leading-7 text-[#5c4037]">
            Ada komponen yang bermasalah, tapi aplikasi tidak dibuat blank lagi.
          </p>
          {this.state.error?.message && (
            <pre className="mt-5 overflow-auto border-2 border-[#281712] bg-[#fff1ed] p-3 text-left text-xs text-[#281712]">
              {this.state.error.message}
            </pre>
          )}
          <button
            type="button"
            onClick={this.handleReload}
            className="retro-button retro-button-primary retro-press mt-7 px-5 py-3"
          >
            Muat Ulang <FaRedo />
          </button>
        </section>
      </main>
    );
  }
}

export default ErrorBoundary;
