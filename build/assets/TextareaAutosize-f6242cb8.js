import{r as o,G as _,Y as G,Z as T,j as v,N as b,a0 as I}from"./index-4e60c9e2.js";import{y as F,G as Z}from"./index-af5a3f81.js";const D=["onChange","maxRows","minRows","style","value"];function m(r){return parseInt(r,10)||0}const P={shadow:{visibility:"hidden",position:"absolute",overflow:"hidden",height:0,top:0,left:0,transform:"translateZ(0)"}};function M(r){return r==null||Object.keys(r).length===0||r.outerHeightStyle===0&&!r.overflow}const Y=o.forwardRef(function(l,N){const{onChange:R,maxRows:y,minRows:h=1,style:S,value:x}=l,O=_(l,D),{current:k}=o.useRef(x!=null),p=o.useRef(null),A=G(N,p),H=o.useRef(null),c=o.useRef(0),[z,E]=o.useState({outerHeightStyle:0}),f=o.useCallback(()=>{const e=p.current,n=F(e).getComputedStyle(e);if(n.width==="0px")return{outerHeightStyle:0};const t=H.current;t.style.width=n.width,t.value=e.value||l.placeholder||"x",t.value.slice(-1)===`
`&&(t.value+=" ");const g=n.boxSizing,w=m(n.paddingBottom)+m(n.paddingTop),a=m(n.borderBottomWidth)+m(n.borderTopWidth),u=t.scrollHeight;t.value="x";const d=t.scrollHeight;let s=u;h&&(s=Math.max(Number(h)*d,s)),y&&(s=Math.min(Number(y)*d,s)),s=Math.max(s,d);const B=s+(g==="border-box"?w+a:0),L=Math.abs(s-u)<=1;return{outerHeightStyle:B,overflow:L}},[y,h,l.placeholder]),C=(e,i)=>{const{outerHeightStyle:n,overflow:t}=i;return c.current<20&&(n>0&&Math.abs((e.outerHeightStyle||0)-n)>1||e.overflow!==t)?(c.current+=1,{overflow:t,outerHeightStyle:n}):e},W=o.useCallback(()=>{const e=f();M(e)||E(i=>C(i,e))},[f]);T(()=>{const e=()=>{const u=f();M(u)||I.flushSync(()=>{E(d=>C(d,u))})},i=()=>{c.current=0,e()};let n;const t=Z(i),g=p.current,w=F(g);w.addEventListener("resize",t);let a;return typeof ResizeObserver<"u"&&(a=new ResizeObserver(i),a.observe(g)),()=>{t.clear(),cancelAnimationFrame(n),w.removeEventListener("resize",t),a&&a.disconnect()}},[f]),T(()=>{W()}),o.useEffect(()=>{c.current=0},[x]);const j=e=>{c.current=0,k||W(),R&&R(e)};return v.jsxs(o.Fragment,{children:[v.jsx("textarea",b({value:x,onChange:j,ref:A,rows:h,style:b({height:z.outerHeightStyle,overflow:z.overflow?"hidden":void 0},S)},O)),v.jsx("textarea",{"aria-hidden":!0,className:l.className,readOnly:!0,ref:H,tabIndex:-1,style:b({},P.shadow,S,{paddingTop:0,paddingBottom:0})})]})});export{Y as T};