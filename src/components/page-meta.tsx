import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageMetadata, publicPages } from '@/config/seo';
import { SITE_URL } from '@/config/environment';
export function PageMeta() {
  const location = useLocation();
  const pathname = location.pathname.replace(/\/+$/, "") || "/";
  useEffect(() => {
    const meta = pageMetadata(pathname);
    document.title = meta.title;
    const set = (key:string, value:string, property=false) => {
      const attr = property ? 'property' : 'name';
      let node = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if(!node) {node=document.createElement('meta');node.setAttribute(attr,key);document.head.append(node);}
      node.content=value;
    };
    set('description',meta.description);
    set('robots',publicPages[pathname] && SITE_URL ? 'index,follow' : 'noindex,nofollow');
    set('og:title',meta.title,true);set('og:description',meta.description,true);
    set('twitter:title',meta.title);set('twitter:description',meta.description);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if(SITE_URL && publicPages[pathname]) {
      if(!canonical) {canonical=document.createElement('link');canonical.rel='canonical';document.head.append(canonical);}
      canonical.href=SITE_URL+pathname;
      set('og:url',canonical.href,true);
    } else {canonical?.remove();document.head.querySelector('meta[property="og:url"]')?.remove();}
  },[pathname]);
  return null;
}
