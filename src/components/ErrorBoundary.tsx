import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorTime: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorTime: '',
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorTime: new Date().toISOString(),
    };
  }

  public override componentDidMount() {
    // Capture any uncaught window errors or unhandled promise rejections
    window.addEventListener('error', this.handleWindowError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  public override componentWillUnmount() {
    window.removeEventListener('error', this.handleWindowError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  private handleWindowError = (event: ErrorEvent) => {
    console.error('[TK MANAGEMENT WINDOW ERROR]', event.error || event.message);
    if (!this.state.hasError && event.error instanceof Error) {
      this.setState({
        hasError: true,
        error: event.error,
        errorTime: new Date().toISOString(),
      });
    }
  };

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    console.error('[TK MANAGEMENT UNHANDLED REJECTION]', event.reason);
    if (!this.state.hasError) {
      const err = event.reason instanceof Error ? event.reason : new Error(String(event.reason || 'Unhandled Promise Rejection'));
      this.setState({
        hasError: true,
        error: err,
        errorTime: new Date().toISOString(),
      });
    }
  };

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      errorInfo,
      errorTime: new Date().toISOString(),
    });
    console.error('[TK MANAGEMENT RUNTIME ERROR]', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorTime: '',
    });
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorTime } = this.state;
      return (
        <div className="min-h-screen bg-[#0B0C10] text-white flex flex-col items-center justify-center p-4 sm:p-8 font-sans select-text">
          <div className="max-w-3xl w-full p-6 sm:p-10 border border-red-500/40 bg-[#111319] shadow-2xl rounded-sm">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/10">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-display font-black tracking-wider text-red-400 uppercase">
                TK MANAGEMENT RUNTIME ERROR
              </h1>
            </div>

            <div className="space-y-4 text-left font-mono text-xs text-gray-300">
              <div className="p-4 bg-[#181B26] border border-white/10 rounded">
                <span className="text-sky-400 font-bold block mb-1">Runtime Error:</span>
                <span className="text-white text-sm break-all font-semibold">
                  {error?.name || 'Error'}: {error?.message || '알 수 없는 런타임 오류가 발생했습니다.'}
                </span>
              </div>

              {error?.stack && (
                <div className="p-4 bg-[#0E1017] border border-white/5 rounded max-h-48 overflow-y-auto text-[11px] text-gray-400 whitespace-pre-wrap break-all leading-relaxed">
                  <span className="text-amber-400 font-bold block mb-1">Stack:</span>
                  {error.stack}
                </div>
              )}

              {errorInfo?.componentStack && (
                <div className="p-4 bg-[#0E1017] border border-white/5 rounded max-h-40 overflow-y-auto text-[11px] text-gray-400 whitespace-pre-wrap break-all leading-relaxed">
                  <span className="text-emerald-400 font-bold block mb-1">Component Stack:</span>
                  {errorInfo.componentStack}
                </div>
              )}

              <div className="text-[11px] text-gray-500 flex justify-between items-center pt-2">
                <span>Time: {errorTime || new Date().toISOString()}</span>
                <span>Environment: Production Diagnostic</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-4 justify-between items-center">
              <p className="text-xs text-gray-400">
                페이지를 새로고침하거나 관리자에게 문의하세요.
              </p>
              <button
                type="button"
                onClick={this.handleReload}
                className="px-6 py-2.5 bg-white text-black text-xs font-bold tracking-widest uppercase hover:bg-slate-200 transition-colors cursor-pointer"
              >
                다시 시도 (RELOAD)
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
