import{r as p,i as T,j as e,F as x,C as I,bd as _,bp as L,s as n,T as C,e as A,t as E,aY as F,w as B,a as M,bs as N,B as k}from"./index-f2cb870a.js";import{aE as O,aF as z,aG as D,p as Y}from"./index-d6936fc6.js";import{u as w}from"./index-a583ad56.js";import{S as P,A as R,I as X}from"./constants-fc83fb70.js";import{A as H,T as W}from"./index-d8ea0c8b.js";import{C as G}from"./ClipLoader-83efcb6b.js";import"./Stack-a2ecd800.js";import"./createSvgIcon-968d1259.js";import"./TextareaAutosize-449c264d.js";const U=({topicId:s,onSelect:a,selectedValue:d,dataId:c})=>{const[u,h]=p.useState([]),[m,f]=p.useState(!1),j=p.useMemo(()=>{const o=async i=>{const g={is_muted:"False",sort_by:R,search:i,skip:"0",limit:"1000"};f(!0);try{const v=(await L(g.search)).data.filter(y=>(y==null?void 0:y.ref_id)!==s);h(v)}catch{h([])}finally{f(!1)}};return T.debounce(o,300)},[s]),r=o=>{const i=o.trim();if(!i){h([]);return}i.length>2&&j(o)},b=o=>{const i=o?u.find(g=>g.ref_id===o.value):null;a(i||null)},t=o=>({label:o.search_value,value:o.ref_id,type:o.node_type}),S=o=>o.map(t);return d?e.jsxs(x,{align:"center",basis:"100%",direction:"row",grow:1,shrink:1,children:[e.jsx("span",{children:d.search_value}),e.jsx(P,{onClick:()=>a(null),size:"medium",children:e.jsx(I,{})})]}):e.jsx(H,{dataId:c,handleInputChange:r,isLoading:m,onSelect:b,options:S(u)||_,selectedValue:d?t(d):null})},$=({from:s,onSelect:a,selectedToNode:d,isSwapped:c,setIsSwapped:u})=>e.jsxs(x,{mb:20,children:[e.jsx(x,{align:"center",direction:"row",justify:"space-between",mb:18,children:e.jsx(x,{align:"center",direction:"row",children:e.jsx(q,{children:"Merge topic"})})}),e.jsxs(Q,{swap:c,children:[e.jsx(J,{children:e.jsx(V,{disabled:!0,label:c?"To":"From",swap:c,value:s==null?void 0:s.name})}),e.jsxs(x,{my:16,children:[e.jsx(ee,{children:"Type"}),e.jsx(C,{children:"IS ALIAS"})]}),e.jsx(x,{"data-testid":"to-section-container",children:e.jsxs(Z,{children:[e.jsx(te,{children:c?"From":"To"}),e.jsx(U,{dataId:"to-node",onSelect:a,selectedValue:d,topicId:s==null?void 0:s.ref_id})]})}),e.jsxs(K,{children:[e.jsx(oe,{children:e.jsx(O,{})}),e.jsx(se,{"data-testid":"swap-icon",onClick:u,children:e.jsx(z,{})}),e.jsx(ne,{children:e.jsx(D,{})})]})]})]}),q=n(C)`
  font-size: 22px;
  font-weight: 600;
  font-family: 'Barlow';
`,J=n(x)`
  flex: 1 1 100%;
`,K=n.div`
  position: absolute;
  top: 26px;
  bottom: 26px;
  left: 4px;
  width: 35px;
  border-left: 1.5px solid #6b7a8d4d;
  border-top: 1.5px solid #6b7a8d4d;
  border-bottom: 1.5px solid #6b7a8d4d;
  border-radius: 12px 0 0 12px;
`,Q=n.div`
  position: relative;
  color: white;
  font-family: 'Barlow';
  display: flex;
  flex-direction: ${s=>s.swap?"column-reverse":"column"};
  margin-bottom: 10px;
  padding-left: 38px;
`,V=n(W)`
  position: relative;
  width: 100%;
  padding: 16px;
  gap: 10px;
  border-radius: 6px;
  border: 1px solid #6b7a8d4d;
  opacity: 0px;
  display: flex;
`,Z=n.div`
  position: relative;
  width: 100%;
  padding: 15px;
  gap: 10px;
  border-radius: 6px;
  border: 1.4px solid #6b7a8d4d;
  opacity: 0px;
  display: flex;
  align-items: center;
`,ee=n.label`
  color: #bac1c6;
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0.01em;
  text-align: left;
  margin-bottom: 6px;
`,te=n.label`
  color: #bac1c6;
  background-color: #23252f;
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0.01em;
  text-align: left;
  position: absolute;
  left: 15px;
  top: -10px;
`,oe=n.div`
  position: absolute;
  top: 0;
  right: 0;
  transform: translateY(-50%) translateX(50%);
  color: #23252f;
`,se=n.div`
  position: absolute;
  color: transparent;
  top: 50%;
  left: 0;
  transform: translateY(-50%) translateX(-50%);
  cursor: pointer;
  width: 32px;
  height: 32px;
  background-color: #303342;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`,ne=n.div`
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translateY(10px) translateX(3px);
  color: #6b7a8d;
  line-height: 1;
`,ge=()=>{const{close:s}=A("mergeToNode"),[a,d,c]=w(l=>[l.data,l.ids,l.total]),u=E({mode:"onChange"}),[h,m]=p.useState(!1),[f,j]=p.useState(!1),[r,b]=p.useState(null),[t,S]=p.useState(),o=Y();p.useEffect(()=>{o&&S(o)},[o]);const i=()=>{b(null),s()},g=async()=>{if(!(!r||!a)){m(!0);try{await N({from:t==null?void 0:t.ref_id,to:r==null?void 0:r.ref_id}),t!=null&&t.ref_id&&(a[t==null?void 0:t.ref_id]={...a[t==null?void 0:t.ref_id],edgeList:[X],edgeCount:a[t==null?void 0:t.ref_id].edgeCount-1},w.setState({ids:d.filter(l=>l!==r.ref_id),total:c-1})),i()}catch(l){console.warn(l)}finally{m(!1)}}};return e.jsx(F,{id:"mergeToNode",kind:"small",onClose:i,preventOutsideClose:!0,children:e.jsxs(B,{...u,children:[e.jsx($,{from:t,isSwapped:f,onSelect:b,selectedToNode:r,setIsSwapped:()=>j(!f)}),e.jsxs(ae,{color:"secondary","data-testid":"merge-topics-button",disabled:h||!r,onClick:g,size:"large",variant:"contained",children:["Merge topics",h&&e.jsx(re,{children:e.jsx(G,{color:M.BLUE_PRESS_STATE,size:12})})]})]})})},ae=n(k)`
  width: 293px !important;
  margin: 0 0 10px auto !important;
`,re=n.span`
  margin-top: 2px;
`;export{ge as MergeNodeModal};