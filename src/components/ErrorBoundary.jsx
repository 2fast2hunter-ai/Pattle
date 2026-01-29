import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(error, errorInfo) { console.error("Uncaught error:", error, errorInfo); }
    render() {
      if (this.state.hasError) {
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-6 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Ups, ein Fehler ist aufgetreten!</h1>
            <p className="text-slate-400 mb-6 text-sm">{this.state.error?.toString()}</p>
            <button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2"><RefreshCw className="w-5 h-5"/> Spiel neu laden</button>
          </div>
        );
      }
      return this.props.children; 
    }
}