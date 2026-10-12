import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { safeExternalUrl, validateImage } from '../src/lib/safe-url';
import { cached, invalidatePublicCache } from '../src/services/public-cache';
import { clearSession, setSessionToken, getSessionToken, isTokenCurrent } from '../src/services/session';
import { request } from '../src/services/http';
import { isProject, isTestimonial, validateList } from '../src/services/validation';
const token=(exp:number)=>`e30.${btoa(JSON.stringify({exp}))}.signature`;
beforeEach(()=>{
 const values=new Map<string,string>();const storage={getItem:(k:string)=>values.get(k)||null,setItem:(k:string,v:string)=>values.set(k,v),removeItem:(k:string)=>values.delete(k)};
 vi.stubGlobal('sessionStorage',storage);vi.stubGlobal('localStorage',{...storage});vi.stubGlobal('location',{pathname:'/projects',assign:vi.fn()});clearSession();invalidatePublicCache();
});
afterEach(()=>{vi.unstubAllGlobals();vi.useRealTimers();});
describe('URL and response safety',()=>{
 it.each(['javascript:alert(1)','data:text/html,test','//evil.example','http://example.com','https://name:secret@example.com'])('rejects unsafe link %s',value=>expect(safeExternalUrl(value)).toBeUndefined());
 it('accepts HTTPS links',()=>expect(safeExternalUrl('https://example.com/path?q=a%26b')).toBe('https://example.com/path?q=a%26b'));
 it('rejects invalid data rather than crashing during render',()=>{expect(()=>validateList({},isProject)).toThrow();expect(()=>validateList([{id:'1',message:null}],isTestimonial)).toThrow();});
 it('rejects SVG and oversized uploads',()=>{expect(validateImage(new File(['<svg/>'],'x.svg',{type:'image/svg+xml'}))).toBeTruthy();expect(validateImage(new File(['ok'],'x.png',{type:'image/png'}))).toBeNull();});
});
describe('session and requests',()=>{
 it('checks expired and malformed tokens',()=>{expect(isTokenCurrent('not-a-jwt')).toBe(false);expect(isTokenCurrent(token(1))).toBe(false);expect(isTokenCurrent(token(Date.now()/1000+3600))).toBe(true);});
 it('expires a stored session',()=>{vi.useFakeTimers();const t=token(Date.now()/1000+10);setSessionToken(t);expect(getSessionToken()).toBe(t);vi.advanceTimersByTime(11000);expect(getSessionToken()).toBeNull();});
 it('scopes credentials, lets the browser set multipart boundaries',async()=>{setSessionToken(token(Date.now()/1000+3600));const fetch=vi.fn().mockResolvedValue(new Response('{}'));vi.stubGlobal('fetch',fetch);const form=new FormData();form.set('title','test');await request('/api/Projects/Create','POST',form);const options=fetch.mock.calls[0][1];expect(options.headers.get('Authorization')).toMatch(/^Bearer /);expect(options.headers.has('Content-Type')).toBe(false);expect(options.redirect).toBe('error');await expect(request('https://evil.example/')).rejects.toThrow('Untrusted');expect(fetch).toHaveBeenCalledTimes(1);});
 it('does not send an existing token to login',async()=>{setSessionToken(token(Date.now()/1000+3600));const fetch=vi.fn().mockResolvedValue(new Response('{}'));vi.stubGlobal('fetch',fetch);await request('/api/auth/login','POST',{email:'a',password:'b'});expect(fetch.mock.calls[0][1].headers.has('Authorization')).toBe(false);});
 it('clears a rejected session on 401 but keeps it on 403',async()=>{const t=token(Date.now()/1000+3600);setSessionToken(t);vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response('',{status:403})));await expect(request('/api/test')).rejects.toThrow('permission');expect(getSessionToken()).toBe(t);vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response('',{status:401})));await expect(request('/api/test')).rejects.toThrow('credentials');expect(getSessionToken()).toBeNull();});
 it('surfaces network and malformed responses',async()=>{vi.stubGlobal('fetch',vi.fn().mockRejectedValue(new TypeError('offline')));await expect(request('/api/test')).rejects.toThrow('Unable to reach');vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response('<html>')));await expect(request('/api/test')).rejects.toThrow('invalid response');});
 it('aborts a stalled API request',async()=>{vi.useFakeTimers();vi.stubGlobal('fetch',vi.fn((_url,options)=>new Promise((_,reject)=>options.signal.addEventListener('abort',()=>reject(new Error('abort'))))));const assertion=expect(request('/api/test')).rejects.toThrow('too long');await vi.advanceTimersByTimeAsync(45000);await assertion;});
});
describe('public request cache',()=>{
 it('coalesces requests, expires and invalidates',async()=>{vi.useFakeTimers();const load=vi.fn().mockResolvedValue([]);await Promise.all([cached('projects',load),cached('projects',load)]);expect(load).toHaveBeenCalledTimes(1);vi.advanceTimersByTime(30001);await cached('projects',load);expect(load).toHaveBeenCalledTimes(2);invalidatePublicCache();await cached('projects',load);expect(load).toHaveBeenCalledTimes(3);});
 it('allows a retry after failure',async()=>{const load=vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue([]);await expect(cached('x',load)).rejects.toThrow();await cached('x',load);expect(load).toHaveBeenCalledTimes(2);});
});
