import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    console.error('[TK MANAGEMENT ERROR BOUNDARY]', error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0C10] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="max-w-md w-full p-8 border border-white/10 bg-[#111319] shadow-2xl">
            <h1 className="text-xl sm:text-2xl font-display font-black tracking-widest text-white mb-6 uppercase">
              TK MANAGEMENT
            </h1>
            <p className="text-sm sm:text-base text-gray-300 font-medium mb-2 break-keep">
              페이지를 불러오는 중 문제가 발생했습니다.
            </p>
            <p className="text-xs sm:text-sm text-gray-400 font-light mb-8 break-keep">
              잠시 후 다시 시도해주세요.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null });
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-white text-black text-xs font-semibold tracking-widest uppercase hover:bg-slate-200 transition-colors cursor-pointer"
            >
              다시 시도
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
