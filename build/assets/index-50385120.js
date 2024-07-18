import{Q as n,j as e,U as r,ar as b,a5 as a,S as i,ad as w,r as m,ax as j}from"./index-e4762fbc.js";import{aK as C,B as S,af as y,aG as k,ag as v}from"./index-bc07c55e.js";import{S as F}from"./index-f23bae54.js";const B=({allowNextStep:t})=>e.jsxs(r,{p:12,children:[e.jsx(r,{align:"center",direction:"row",justify:"space-between",mb:25,children:e.jsx(r,{align:"center",direction:"row",children:e.jsx(E,{children:"Feedback"})})}),e.jsx(r,{mb:30,children:e.jsx(C,{id:"feedback-message",isTextArea:!0,maxLength:500,name:"message",placeholder:"Leave your feedback here ...",rules:b})}),e.jsx(r,{children:e.jsx(S,{color:"secondary","data-testid":"submit-feedback-btn",disabled:!t,size:"large",type:"submit",variant:"contained",children:"Submit"})})]}),E=n(a)`
  font-size: 22px;
  font-weight: 600;
  font-family: 'Barlow';
`,M=t=>e.jsxs("svg",{width:"1em",height:"1em",viewBox:"0 0 50 40",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",children:[e.jsx("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M39.6982 23.8981C38.314 33.2849 30.2251 40.4893 20.4536 40.4893C17.5648 40.4893 14.8231 39.8596 12.3582 38.7301L1.90313 41.3438C1.44763 41.4577 1.03503 41.0451 1.14891 40.5896L3.60474 30.7663C1.94817 27.904 1 24.5806 1 21.0357C1 10.2917 9.70969 1.58203 20.4536 1.58203C22.4575 1.58203 24.3907 1.88502 26.2097 2.44769C24.8111 4.62659 24 7.21857 24 10C24 12.0989 24.4619 14.0899 25.2895 15.877H13.2863C12.1553 15.877 11.2385 16.7938 11.2385 17.9247C11.2385 19.0556 12.1553 19.9725 13.2863 19.9725H27.6205C27.7906 19.9725 27.9557 19.9517 28.1137 19.9127C30.6462 22.4384 34.1407 24 38 24C38.5748 24 39.1415 23.9654 39.6982 23.8981ZM13.2863 24.0664C12.1553 24.0664 11.2385 24.9832 11.2385 26.1142C11.2385 27.2451 12.1553 28.1619 13.2863 28.1619H21.4773C22.6082 28.1619 23.525 27.2451 23.525 26.1142C23.525 24.9832 22.6082 24.0664 21.4773 24.0664H13.2863Z",fill:"currentColor"}),e.jsx("circle",{cx:"38",cy:"10",r:"10",fill:"currentColor"}),e.jsx("path",{d:"M34 9.5L37 12.5L42.5 7",stroke:"#23252F","stroke-width":"2.5","stroke-linecap":"round","stroke-linejoin":"round"})]}),T=()=>e.jsxs(r,{align:"center",direction:"column",justify:"center",p:40,children:[e.jsx(L,{children:e.jsx(M,{})}),e.jsx(z,{children:"We've Got Your Feedback"}),e.jsx(H,{children:"Thank you for sharing your thoughts with us! We value your input."})]}),L=n.div`
  margin-bottom: 20px;
  width: 50px;
  height: 50px;

  svg {
    width: 100%;
    height: 100%;
    color: ${i.white};
    fill: none;
  }

  circle {
    color: ${i.SUCESS};
  }
`,z=n(a)`
  font-size: 22px;
  font-weight: 700;
  font-family: 'Barlow';
  text-align: center;
  margin-bottom: 10px;
`,H=n(a)`
  font-size: 16px;
  font-family: 'Barlow';
  text-align: center;
  margin-bottom: 20px;
  font-weight: 400;
  color: ${i.GRAY6};
  padding-top: 10px;
`,$=async t=>{try{const s=await j.post("/prediction/feedback",JSON.stringify(t));if(s.error){const{message:o}=s.error;throw new Error(o)}}catch(s){throw new Error(s.message||"Error submitting feedback")}},R=()=>{const{close:t,visible:s}=w("feedback"),o=y({mode:"onChange"}),{watch:x,reset:c}=o,[h,l]=m.useState(!1);m.useEffect(()=>()=>{l(!1),c()},[s,c]);const d=x("message"),u=!!d&&d.trim().length>0,f=o.handleSubmit(async p=>{try{await $(p),F("Feedback Submitted"),l(!0)}catch(g){console.error(g.message)}});return e.jsx(k,{id:"feedback",kind:"small",onClose:t,preventOutsideClose:!0,children:e.jsx(v,{...o,children:e.jsx("form",{id:"feedback-form",onSubmit:f,children:h?e.jsx(T,{}):e.jsx(B,{allowNextStep:u})})})})};export{R as UserFeedBackModal};
