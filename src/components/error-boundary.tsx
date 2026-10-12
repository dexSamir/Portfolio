import { Component, type ReactNode } from 'react';
export class ErrorBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state = {failed:false};
  static getDerivedStateFromError() {return {failed:true};}
  render() {
    if(this.state.failed) return <div className="gradient-bg min-h-screen flex items-center justify-center p-6"><div role="alert" className="glass-card rounded-xl p-8 max-w-lg"><h1 className="text-2xl font-bold mb-4">This page could not load</h1><p className="text-gray-300">Please reload the page. Your connection may have been interrupted or the site may have been updated.</p><button className="mt-6 bg-primary text-black px-6 py-3 rounded-full" onClick={()=>location.reload()}>Reload page</button><a className="ml-4 text-primary" href="/">Go home</a></div></div>;
    return this.props.children;
  }
}
