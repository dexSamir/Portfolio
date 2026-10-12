import { createContext, useContext } from 'react';
type Theme = 'dark' | 'light' | 'system';
export const ThemeContext = createContext<{theme:Theme;setTheme:(theme:Theme)=>void}>({theme:'dark',setTheme:()=>{}});
export const useTheme = () => useContext(ThemeContext);
