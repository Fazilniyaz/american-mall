export default function HostAnEventLoading() {
  return (
    <div style={{position:"fixed",inset:0,background:"#050402",display:"grid",gridTemplateColumns:"1fr 1fr",overflow:"hidden",fontFamily:"'Montserrat',sans-serif"}}>
      <div style={{position:"relative",display:"flex",flexDirection:"column",justifyContent:"center",padding:"clamp(1.8rem,5vh,3.5rem) clamp(1.6rem,4vw,3.5rem) clamp(4rem,8vh,5rem)",gap:"clamp(0.8rem,1.8vh,1.4rem)",borderRight:"1px solid rgba(201,168,76,0.1)",zIndex:10}}>
        <div style={{position:"absolute",left:0,top:"12%",bottom:"12%",width:"3px",background:"linear-gradient(to bottom,transparent,rgba(201,168,76,0.15),transparent)"}} />
        <div style={{height:"0.66rem",width:"35%",background:"rgba(201,168,76,0.1)",borderRadius:2}} />
        <div style={{height:"clamp(1.65rem,3vw,2.9rem)",width:"80%",background:"rgba(255,255,255,0.06)",borderRadius:2}} />
        <div style={{height:"clamp(1.65rem,3vw,2.9rem)",width:"60%",background:"rgba(201,168,76,0.12)",borderRadius:2}} />
        <div style={{display:"flex",flexDirection:"column",gap:"0.4rem"}}>
          {[95,90,78].map((w,i) => <div key={i} style={{height:"0.84rem",width:`${w}%`,background:"rgba(255,255,255,0.04)",borderRadius:2}} />)}
        </div>
        <div style={{width:"52px",height:"2px",background:"linear-gradient(to right,rgba(201,168,76,0.2),transparent)"}} />
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",border:"1px solid rgba(201,168,76,0.12)"}}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{padding:"clamp(0.55rem,1.1vh,0.9rem)",borderRight:i<3?"1px solid rgba(201,168,76,0.12)":"none"}}>
              <div style={{height:"clamp(0.95rem,1.7vw,1.5rem)",width:"55%",background:"rgba(201,168,76,0.1)",borderRadius:2}} />
              <div style={{height:"0.56rem",width:"75%",background:"rgba(255,255,255,0.05)",borderRadius:2,marginTop:"0.4rem"}} />
            </div>
          ))}
        </div>
        <div style={{height:"0.58rem",width:"28%",background:"rgba(255,255,255,0.04)",borderRadius:2}} />
        <div style={{border:"1px solid rgba(201,168,76,0.12)",height:"20vh",background:"rgba(255,255,255,0.01)"}} />
        <div style={{display:"flex",gap:"0.75rem"}}>
          <div style={{height:"clamp(2rem,4vh,2.8rem)",width:"200px",background:"rgba(201,168,76,0.15)",borderRadius:2}} />
          <div style={{height:"clamp(2rem,4vh,2.8rem)",width:"150px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:2}} />
        </div>
      </div>
      <div style={{position:"relative",overflow:"hidden",background:"#0a0805"}} />
      <style>{`
        @media(max-width:700px){
          div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important;grid-template-rows:48vh 1fr!important}
          div[style*="background: #0a0805"]{grid-row:1!important}
        }
      `}</style>
    </div>
  );
}
