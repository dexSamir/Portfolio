import { useEffect, useRef, type RefObject } from 'react';
export function useModalAccessibility(active:boolean, container:RefObject<HTMLElement | null>, onClose:()=>void) {
  const close = useRef(onClose);
  close.current=onClose;
  useEffect(()=>{
    const root=container.current;
    if(!active || !root) return;
    const previous=document.activeElement as HTMLElement | null;
    const overflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    const focusable=()=>Array.from(root.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex="0"]')).filter(n=>n.getClientRects().length>0);
    focusable()[0]?.focus();
    const key=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){event.preventDefault();close.current();}
      if(event.key==='Tab') {
        const items=focusable(),first=items[0],last=items.at(-1);
        if(!first){event.preventDefault();root.focus();return;}
        if(event.shiftKey && (document.activeElement===first || !root.contains(document.activeElement))){event.preventDefault();last?.focus();}
        else if(!event.shiftKey && (document.activeElement===last || !root.contains(document.activeElement))){event.preventDefault();first.focus();}
      }
    };
    document.addEventListener('keydown',key);
    return ()=>{document.body.style.overflow=overflow;document.removeEventListener('keydown',key);if(previous?.isConnected)previous.focus();};
  },[active,container]);
}
