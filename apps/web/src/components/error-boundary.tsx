'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // This method is called when an error is caught by the error boundary
    // We don't need to do anything here as we handle the error in getDerivedStateFromError
  }

  private readonly handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private readonly handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto max-w-md px-4 py-16">
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-red-900">
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-red-700 text-sm">
                We encountered an unexpected error. This has been logged and our
                team will investigate.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left">
                  <summary className="cursor-pointer text-red-600 text-xs">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 overflow-auto whitespace-pre-wrap rounded bg-red-100 p-2 text-red-800 text-xs">
                    {this.state.error.message}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button onClick={this.handleRetry} size="sm" variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button onClick={this.handleReload} size="sm">
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
