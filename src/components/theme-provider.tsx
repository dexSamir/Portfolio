import { useEffect, useMemo, useState, type ReactNode } from 'react';
type Theme = 'dark' | 'light' | 'system';
import { ThemeContext } from './theme-context';
export function ThemeProvider({children,defaultTheme='dark',storageKey='vite-ui-theme'}:{children:ReactNode;defaultTheme?:Theme;storageKey?:string}) {
  const [theme,setTheme]=useState<Theme>(()=>{
    try {const value=localStorage.getItem(storageKey);return value==='dark'||value==='light'||value==='system'?value:defaultTheme;} catch {return defaultTheme;}
  });
  useEffect(()=>{
    const media=matchMedia('(prefers-color-scheme: dark)');
    const apply=()=>{document.documentElement.classList.remove('dark','light');document.documentElement.classList.add(theme==='system'?(media.matches?'dark':'light'):theme);};
    apply();media.addEventListener('change',apply);
    return ()=>media.removeEventListener('change',apply);
  },[theme]);
  const value=useMemo(()=>({theme,setTheme:(value:Theme)=>{setTheme(value);try{localStorage.setItem(storageKey,value);}catch{/* Theme still works without storage. */}}}),[theme,storageKey]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
