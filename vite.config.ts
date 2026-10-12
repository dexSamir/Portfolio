import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { publicPages, pageMetadata } from './src/config/seo';
const escape = (value:string) => value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));
export default defineConfig(({mode}) => {
  const env=loadEnv(mode,process.cwd(),'');
  const site=env.VITE_SITE_URL?.replace(/\/$/,'') || '';
  if(process.env.REQUIRE_SITE_URL === '1' && !site) throw new Error('Set VITE_SITE_URL before a release build.');
  if(site && (new URL(site).protocol !== 'https:' || new URL(site).pathname !== '/')) throw new Error('VITE_SITE_URL must be an HTTPS origin without a path.');
  const metaHtml = (route:string) => {
    const {title,description}=pageMetadata(route);
    const indexable=!!site && !!publicPages[route];
    return `<title>${escape(title)}</title><meta name="description" content="${escape(description)}"><meta name="robots" content="${indexable ? 'index,follow' : 'noindex,nofollow'}"><meta property="og:type" content="website"><meta property="og:site_name" content="Samir Habibov"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}">${site ? `<meta property="og:image" content="${site}/imgs/me.webp"><meta property="og:image:alt" content="Samir Habibov"><meta name="twitter:image" content="${site}/imgs/me.webp">` : ''}${indexable ? `<link rel="canonical" href="${site}${route}"><meta property="og:url" content="${site}${route}">` : ''}`;
  };
  const seo:Plugin={name:'portfolio-seo', enforce:'post', transformIndexHtml:html=>html.replace('<!-- page-meta -->',metaHtml('/')), generateBundle(_,bundle){
    const html=String((bundle['index.html'] as {source:string})?.source || '');
    for(const route of [...Object.keys(publicPages).filter(p=>p!='/'),'/login','/403','/404','/admin','/admin/create']) {
      this.emitFile({type:'asset',fileName:route==='/404'?'404.html':route.slice(1)+'/index.html',source:html.replace(metaHtml('/'),metaHtml(route))});
    }
    this.emitFile({type:'asset',fileName:'robots.txt',source:site?`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /login\nSitemap: ${site}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n'});
    this.emitFile({type:'asset',fileName:'sitemap.xml',source:`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${site?Object.keys(publicPages).map(route=>`<url><loc>${escape(site+route)}</loc></url>`).join(''):''}</urlset>`});
  }};
  return {plugins:[react(),seo],resolve:{alias:{'@':path.resolve(process.cwd(),'src')}},esbuild:{drop:mode==='production'?['console','debugger']:[]}};
});
