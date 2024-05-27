import{r,j as e,z as A,y as F,F as u,A as E,f as l,T as k,B as I,a5 as O,h as w,C as z}from"./index-31ef6bc7.js";import{B as N}from"./index-569ad940.js";import{I as D,b as M,c as P,F as R,C,B as Y}from"./react-toastify.esm-efe85912.js";import{a as X,N as H,F as U,b as $}from"./index-c7b0ac51.js";import{A as B,T as q}from"./index-b30d531f.js";import{A as G}from"./index-428f9962.js";import"./generateCategoricalChart-20c88768.js";import"./Popover-7333ae0b.js";import"./useSlotProps-8fec50db.js";import"./InfoIcon-52eb573f.js";import"./index.esm-75403a40.js";import"./NoFilterResultIcon-7cac6435.js";import"./index-152f7d12.js";import"./index-888b82dd.js";import"./PlusIcon-89a1a4f9.js";import"./CheckIcon-8cfe41fb.js";import"./index-47639cdd.js";import"./Popper-5d750d0b.js";const J=({selectedType:t,setSelectedType:c})=>{const[p,d]=r.useState([]);r.useEffect(()=>{(async()=>{try{const{data:x}=await A();d(x.edge_types)}catch(x){console.warn(x)}})()},[d]);const i=o=>({label:o,value:o}),h=o=>{c((o==null?void 0:o.value)||"")};return e.jsx(B,{onSelect:h,options:p.map(i),selectedValue:t?i(t):null})},K=({onSelect:t,selectedValue:c,topicId:p})=>{const[d,i]=r.useState([]),[h,o]=r.useState(!1),x=r.useMemo(()=>{const s=async b=>{const a={is_muted:"False",sort_by:G,search:b,skip:"0",limit:"1000"};o(!0);try{const T=(await E(a.search)).data.filter(y=>(y==null?void 0:y.ref_id)!==p);i(T)}catch{i([])}finally{o(!1)}};return F.debounce(s,300)},[p]),g=s=>{if(!s){i([]);return}s.length>2&&x(s)},j=s=>{const b=s?d.find(a=>a.ref_id===s.value):null;t(b||null)},n=s=>({label:s.search_value,value:s.ref_id,type:s.node_type}),S=s=>s.map(n);return c?e.jsxs(u,{align:"center",basis:"100%",direction:"row",grow:1,shrink:1,children:[e.jsx("span",{children:c.search_value}),e.jsx(D,{onClick:()=>t(null),size:"small",children:e.jsx(M,{})})]}):e.jsx(B,{handleInputChange:g,isLoading:h,onSelect:j,options:S(d)||X,selectedValue:c?n(c):null})},Q=({from:t,onSelect:c,selectedType:p,setSelectedType:d,selectedToNode:i,setIsSwapped:h,isSwapped:o})=>{const x=()=>{h()},g=t&&("search_value"in t?t.search_value:t.name);return e.jsxs(u,{mb:20,children:[e.jsx(u,{align:"center",direction:"row",justify:"space-between",mb:18,children:e.jsx(u,{align:"center",direction:"row",children:e.jsx(W,{children:"Add Edge"})})}),e.jsxs(Z,{swap:o,children:[e.jsx(u,{children:e.jsx(ee,{disabled:!0,label:o?"To":"From",swap:o,value:g})}),e.jsxs(u,{my:16,children:[e.jsx(oe,{children:"Type"}),e.jsx(J,{selectedType:p,setSelectedType:d})]}),e.jsx(u,{children:e.jsxs(te,{children:[e.jsx(se,{children:o?"From":"To"}),e.jsx(K,{onSelect:c,selectedValue:i,topicId:t==null?void 0:t.ref_id})]})}),e.jsxs(V,{children:[e.jsx(ne,{children:e.jsx(H,{})}),e.jsx(ie,{onClick:x,children:e.jsx(U,{})}),e.jsx(ae,{children:e.jsx($,{})})]})]})]})},V=l.div`
  position: absolute;
  top: 26px;
  bottom: 26px;
  left: 4px;
  width: 35px;
  border-left: 1.5px solid #6b7a8d4d;
  border-top: 1.5px solid #6b7a8d4d;
  border-bottom: 1.5px solid #6b7a8d4d;
  border-radius: 12px 0 0 12px;
`,W=l(k)`
  font-size: 22px;
  font-weight: 600;
`,Z=l.div`
  position: relative;
  color: white;
  font-family: 'Barlow';
  display: flex;
  flex-direction: ${t=>t.swap?"column-reverse":"column"};
  margin-bottom: 10px;
  padding-left: 38px;
`,ee=l(q)`
  position: relative;
  width: 100%;
  padding: 16px;
  gap: 10px;
  border-radius: 6px;
  border: 1px solid #6b7a8d4d;
  opacity: 0px;
  display: flex;
`,te=l.div`
  position: relative;
  width: 100%;
  padding: 15px;
  gap: 10px;
  border-radius: 6px;
  border: 1.4px solid #6b7a8d4d;
  opacity: 0px;
  display: flex;
  align-items: center;
`,oe=l.label`
  color: #bac1c6;
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0.01em;
  text-align: left;
  margin-bottom: 6px;
`,se=l.label`
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
`,ne=l.div`
  position: absolute;
  top: 0;
  right: 0;
  transform: translateY(-50%) translateX(50%);
  color: #23252f;
`,ie=l.div`
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
`,ae=l.div`
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translateY(10px) translateX(3px);
  color: #6b7a8d;
  line-height: 1;
`,re=()=>{const{close:t}=I("addEdgeToNode"),c=P({mode:"onChange"}),[p,d]=r.useState(!1),[i,h]=r.useState(""),[o,x]=r.useState(!1),[g,j]=r.useState(!1),[n,S]=r.useState(null),[s,b]=r.useState(),a=O();r.useEffect(()=>{(async()=>{if(a){j(!0);try{if(a.type==="topic"){const{data:m}=await E(a==null?void 0:a.name,{exact_match:"true",node_type:"topic"}),_=m.find(L=>L.node_type==="topic");b(_)}}catch(m){console.log(m)}finally{j(!1)}}})()},[a]);const v=()=>{t()},T=async()=>{const f=s||a;if(!(!n||!(f!=null&&f.ref_id))){d(!0);try{await z({relationship:i,...o?{to:f.ref_id,from:n==null?void 0:n.ref_id}:{from:f.ref_id,to:n==null?void 0:n.ref_id}});const{ref_id:m}=f,{ref_id:_}=n;console.log(m,_),v()}catch(m){console.warn(m)}finally{d(!1)}}},y=p||!n||!i;return e.jsxs(R,{...c,children:[g?e.jsx(u,{align:"center",my:24,children:e.jsx(C,{color:w.BLUE_PRESS_STATE,size:24})}):e.jsx(Q,{from:s??a,isSwapped:o,onSelect:S,selectedToNode:n,selectedType:i,setIsSwapped:()=>x(!o),setSelectedType:h}),e.jsxs(le,{color:"secondary",disabled:y,onClick:T,size:"large",variant:"contained",children:["Confirm",p&&e.jsx(C,{color:w.BLUE_PRESS_STATE,size:10})]})]})},le=l(Y)`
  width: 293px !important;
  margin: 0 0 10px auto !important;
`,Ee=()=>{const{close:t}=I("addEdgeToNode");return e.jsx(N,{id:"addEdgeToNode",kind:"small",onClose:t,preventOutsideClose:!0,children:e.jsx(re,{})})};export{Ee as AddNodeEdgeModal};