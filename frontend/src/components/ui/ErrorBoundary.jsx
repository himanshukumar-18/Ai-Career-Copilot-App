import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="border border-red-500/40 bg-red-500/5 p-6 my-4 text-center font-mono">
                    <AlertTriangle size={32} className="mx-auto text-red-400 mb-3" />
                    <h3 className="text-base font-bold text-white uppercase tracking-wider mb-2">
                        Something Went Wrong
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto mb-4 leading-relaxed">
                        {this.state.error?.message || "A UI rendering error occurred in this section."}
                    </p>
                    <button
                        onClick={this.handleReset}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white text-xs uppercase tracking-wider hover:bg-[var(--accent-light)] transition-all"
                    >
                        <RefreshCw size={14} />
                        <span>Reload Component</span>
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
