import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
const particles=Array.from({length:20},(_,i)=>({size:5+(i*7%10),left:`${i*37%100}%`,top:`${i*23%100}%`,travel:-50-i*13%100,duration:10+i*7%20,delay:i*.2}));
export const FloatingParticles=memo(function FloatingParticles(){
  const reduce=useReducedMotion();
  return <div aria-hidden="true" className="absolute inset-0 pointer-events-none">{particles.map((p,i)=><motion.div key={i} className="absolute rounded-full bg-primary/20" style={{width:p.size,height:p.size,left:p.left,top:p.top}} animate={reduce?{opacity:.15}:{y:[0,p.travel],opacity:[0,.5,0]}} transition={reduce?{duration:0}:{duration:p.duration,repeat:Infinity,delay:p.delay}} />)}</div>;
});
