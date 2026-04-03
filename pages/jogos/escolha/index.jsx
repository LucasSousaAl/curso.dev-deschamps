import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel+Decorative:wght@700;900&family=Rajdhani:wght@300;400;600;700&family=Crimson+Pro:ital,wght@1,300;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  #njroot {
    background: #080808; color: #f0e8df;
    font-family: 'Rajdhani', sans-serif; min-height: 100vh; position: relative;
  }
  #njroot::before {
    content:''; position:fixed; inset:0; pointer-events:none; z-index:9990;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    opacity:.5;
  }
  @keyframes nj-fdDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes nj-fdUp   { from{opacity:0;transform:translateY(28px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes nj-pop    { 0%{transform:scale(1)} 45%{transform:scale(1.45)} 100%{transform:scale(1)} }
  @keyframes nj-shake  { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px) rotate(-1.5deg)} 40%{transform:translateX(10px) rotate(1.5deg)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
  @keyframes nj-bounce { from{transform:translateY(0)} to{transform:translateY(-9px)} }
  @keyframes nj-pulseR { 0%,100%{box-shadow:0 0 0 2px #c0392b,0 0 20px rgba(192,57,43,.3)} 50%{box-shadow:0 0 0 3px #e74c3c,0 0 50px rgba(192,57,43,.65)} }
  @keyframes nj-confet { 0%{transform:translateY(-10px) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }
  @keyframes nj-glowG  { 0%,100%{filter:drop-shadow(0 0 20px rgba(243,156,18,.5))} 50%{filter:drop-shadow(0 0 55px rgba(243,156,18,.9))} }
  @keyframes nj-spin   { to{transform:rotate(360deg)} }
  .nj-confetti-p { position:fixed; pointer-events:none; z-index:9800; animation:nj-confet linear both; }
  .nj-spinner    { border:2px solid rgba(192,57,43,.25); border-top-color:#c0392b; border-radius:50%; animation:nj-spin .75s linear infinite; }
  .nj-vnum-pop   { animation:nj-pop .22s ease both; }
  .nj-winner-ttl { animation:nj-glowG 2s ease infinite; }
  .nj-search-input {
    width:100%; background:#0c0c0c; border:1px solid rgba(192,57,43,.35);
    color:#f0e8df; font-family:'Rajdhani',sans-serif; font-size:1rem;
    letter-spacing:.04em; padding:12px 44px 12px 16px; border-radius:4px;
    outline:none; transition:border-color .2s,box-shadow .2s;
  }
  .nj-search-input:focus { border-color:#c0392b; box-shadow:0 0 0 2px rgba(192,57,43,.18); }
  .nj-search-input::placeholder { color:#3a3a3a; }
  .nj-dropdown {
    position:absolute; top:calc(100% + 6px); left:0; right:0; z-index:200;
    background:#0f0f0f; border:1px solid rgba(192,57,43,.4); border-radius:4px;
    overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,.85);
    animation:nj-fdUp .22s ease both; max-height:360px; overflow-y:auto;
  }
  .nj-dd-item {
    display:flex; align-items:center; gap:12px; padding:10px 14px;
    cursor:pointer; transition:background .14s; border-bottom:1px solid rgba(255,255,255,.04);
  }
  .nj-dd-item:hover { background:rgba(192,57,43,.12); }
  .nj-dd-thumb { width:72px; height:34px; object-fit:cover; border-radius:2px; flex-shrink:0; background:#1a1a1a; }
`;

/* ─────────────────────────────────────────────────
   TAG COLOR MAP
───────────────────────────────────────────────── */
const TAG_MAP = {
  "Ação":          ["rgba(192,57,43,.2)","#e74c3c","rgba(192,57,43,.5)"],
  "Terror":        ["rgba(192,57,43,.2)","#e74c3c","rgba(192,57,43,.5)"],
  "Cooperativo":   ["rgba(46,204,113,.15)","#2ecc71","rgba(46,204,113,.4)"],
  "Sobrevivência": ["rgba(243,156,18,.13)","#f39c12","rgba(243,156,18,.4)"],
  "RPG":           ["rgba(155,89,182,.2)","#b880f5","rgba(155,89,182,.45)"],
  "Estratégia":    ["rgba(52,152,219,.15)","#74b9ff","rgba(52,152,219,.4)"],
  "Multijogador":  ["rgba(46,204,113,.15)","#2ecc71","rgba(46,204,113,.4)"],
  "Indie":         ["rgba(230,126,34,.15)","#e67e22","rgba(230,126,34,.45)"],
  "Aventura":      ["rgba(52,152,219,.15)","#74b9ff","rgba(52,152,219,.4)"],
  "Simulação":     ["rgba(26,188,156,.15)","#1abc9c","rgba(26,188,156,.4)"],
};
const TAG_DEF = ["rgba(255,255,255,.07)","#aaa","rgba(255,255,255,.14)"];
function tagStyle(t){ const s=TAG_MAP[t]||TAG_DEF; return {background:s[0],color:s[1],border:`1px solid ${s[2]}`}; }

/* ─────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────── */
function launchConfetti(){
  const C=["#f39c12","#e74c3c","#c0392b","#fff","#f0a500","#ffd166","#ff6b6b"];
  for(let i=0;i<75;i++) setTimeout(()=>{
    const el=document.createElement("div"); el.className="nj-confetti-p";
    const sz=5+Math.random()*9;
    el.style.cssText=`left:${5+Math.random()*90}vw;top:-14px;background:${C[Math.floor(Math.random()*C.length)]};width:${sz}px;height:${sz}px;border-radius:${Math.random()>.5?"50%":"2px"};animation-duration:${1.4+Math.random()*1.6}s;`;
    document.body.appendChild(el); setTimeout(()=>el.remove(),4000);
  },i*20);
}

/* ─────────────────────────────────────────────────
   CLAUDE API — Steam search
───────────────────────────────────────────────── */
async function searchSteamGames(query) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      system: `You are a Steam game lookup assistant. Search Steam for the requested game and return ONLY a raw JSON array (no markdown, no backticks, no preamble, no explanation). Each item must have exactly:
{
  "appid": number,
  "name": string,
  "short_description": string (1-2 sentences in Portuguese pt-BR),
  "header_image": "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/APPID/header.jpg",
  "genres": string[] (2-4 from: Ação, Terror, Cooperativo, Sobrevivência, RPG, Estratégia, Multijogador, Indie, Aventura, Simulação),
  "players": string (e.g. "1–4 jogadores" or "Multijogador")
}
Return up to 6 results. Output ONLY the JSON array.`,
      messages: [{ role: "user", content: `Search Steam for: "${query}"` }],
    }),
  });
  const data = await res.json();
  const text = data.content.filter(b=>b.type==="text").map(b=>b.text).join("");
  const clean = text.replace(/```json|```/g,"").trim();
  const s=clean.indexOf("["), e=clean.lastIndexOf("]");
  if(s===-1) return [];
  return JSON.parse(clean.slice(s,e+1));
}

/* ─────────────────────────────────────────────────
   TAG BADGE
───────────────────────────────────────────────── */
function TagBadge({label}){
  const s=tagStyle(label);
  return <span style={{fontSize:".6rem",letterSpacing:".12em",textTransform:"uppercase",
    padding:"3px 8px",borderRadius:2,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,...s,whiteSpace:"nowrap"}}>
    {label}
  </span>;
}

/* ─────────────────────────────────────────────────
   VOTE OVERLAY
───────────────────────────────────────────────── */
function VoteOverlay({gameId,count,onVote}){
  const [pop,setPop]=useState(false);
  function vote(d,e){
    e.stopPropagation(); onVote(gameId,d);
    if(d>0){setPop(true);setTimeout(()=>setPop(false),230);}
  }
  return <div style={{position:"absolute",inset:0,zIndex:10,display:"flex",flexDirection:"column",
    alignItems:"center",justifyContent:"center",gap:10,background:"rgba(5,5,5,.62)",backdropFilter:"blur(1px)"}}>
    <div className={pop?"nj-vnum-pop":""}
      style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"3.8rem",lineHeight:1,
        color:count>0?"#e74c3c":"#fff",textShadow:"0 2px 20px rgba(0,0,0,.9)",transition:"color .2s"}}>
      {count}
    </div>
    <div style={{display:"flex",gap:10}}>
      {[{d:1,l:"+",bg:"#c0392b",fg:"#fff",border:"none"},{d:-1,l:"−",bg:"rgba(255,255,255,.1)",fg:"#aaa",border:"1px solid rgba(255,255,255,.15)"}].map(({d,l,bg,fg,border})=>(
        <button key={d} onClick={e=>vote(d,e)} style={{width:46,height:46,borderRadius:"50%",
          border,cursor:"pointer",background:bg,color:fg,fontSize:"1.6rem",
          display:"flex",alignItems:"center",justifyContent:"center",transition:"all .16s",
          fontFamily:"'Bebas Neue',sans-serif"}}>{l}</button>
      ))}
    </div>
  </div>;
}

/* ─────────────────────────────────────────────────
   GAME CARD
───────────────────────────────────────────────── */
function GameCard({game,isSelected,isEliminated,isLeader,votingMode,voteCount,onToggle,onVote,onRemove,animClass}){
  const [hov,setHov]=useState(false);
  const [imgOk,setImgOk]=useState(true);

  const bord = isLeader&&votingMode?"#c0392b" : isSelected&&!votingMode?"#f0a500" : "rgba(192,57,43,.28)";
  const shad = isLeader&&votingMode?"0 0 0 2px #c0392b,0 0 45px rgba(192,57,43,.5)"
             : isSelected&&!votingMode?"0 0 0 2px #f0a500,0 0 40px rgba(243,156,18,.3)"
             : hov&&!votingMode?"0 18px 60px rgba(0,0,0,.7),0 0 28px rgba(192,57,43,.55)":"none";

  return <article
    className={animClass||""}
    onClick={()=>!votingMode&&!isEliminated&&onToggle()}
    onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
    style={{background:"#111",borderRadius:4,overflow:"hidden",
      cursor:votingMode||isEliminated?"default":"pointer",position:"relative",
      border:`1px solid ${bord}`,boxShadow:shad,
      transition:"transform .35s cubic-bezier(.22,1,.36,1),box-shadow .3s,opacity .6s,border-color .25s",
      transform:hov&&!votingMode&&!isEliminated?"translateY(-6px) scale(1.014)":"none",
      opacity:isEliminated?0:1,pointerEvents:isEliminated?"none":"all",
      animation:"nj-fdUp .55s ease both",
      ...(isLeader&&votingMode?{animationName:"nj-pulseR",animationDuration:"1.5s",animationIterationCount:"infinite"}:{})}}>

    {/* remove btn */}
    {!votingMode&&!isEliminated&&<button onClick={e=>{e.stopPropagation();onRemove(game.id);}}
      style={{position:"absolute",top:8,right:8,zIndex:20,width:24,height:24,borderRadius:"50%",
        border:"1px solid rgba(255,255,255,.18)",background:"rgba(0,0,0,.72)",color:"#777",
        cursor:"pointer",fontSize:".72rem",display:"flex",alignItems:"center",justifyContent:"center",
        transition:"all .18s"}}
      onMouseEnter={e=>{e.currentTarget.style.background="rgba(192,57,43,.75)";e.currentTarget.style.color="#fff";}}
      onMouseLeave={e=>{e.currentTarget.style.background="rgba(0,0,0,.72)";e.currentTarget.style.color="#777";}}>
      ✕
    </button>}

    {/* thumb */}
    <div style={{width:"100%",height:190,overflow:"hidden",position:"relative"}}>
      {imgOk
        ? <img src={game.header_image} alt={game.name} onError={()=>setImgOk(false)}
            style={{width:"100%",height:"100%",objectFit:"cover",display:"block",
              transition:"transform .6s cubic-bezier(.22,1,.36,1),filter .4s",
              transform:hov&&!votingMode?"scale(1.07)":"scale(1)",
              filter:hov&&!votingMode?"brightness(1) saturate(1.1)":"brightness(.8) saturate(.9)"}}/>
        : <div style={{width:"100%",height:"100%",background:"#181818",display:"flex",
            alignItems:"center",justifyContent:"center",color:"#333",
            fontFamily:"'Bebas Neue',sans-serif",fontSize:"1rem",letterSpacing:".1em"}}>SEM IMAGEM</div>
      }
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(8,8,8,1) 0%,rgba(8,8,8,.06) 55%,transparent 100%)"}}/>
      <div style={{position:"absolute",top:8,left:8,display:"flex",gap:4,flexWrap:"wrap",maxWidth:"70%"}}>
        {(game.genres||[]).slice(0,3).map(g=><TagBadge key={g} label={g}/>)}
      </div>
      {!votingMode&&<div style={{position:"absolute",bottom:9,right:9,background:"rgba(0,0,0,.75)",
        border:"1px solid rgba(255,255,255,.12)",borderRadius:2,padding:"2px 9px",
        fontSize:".67rem",letterSpacing:".05em",fontFamily:"'Rajdhani',sans-serif",color:"#ccc"}}>
        👥 {game.players}
      </div>}
      {!votingMode&&isSelected&&<div style={{position:"absolute",top:8,right:8,width:26,height:26,
        background:"#f0a500",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:".8rem",zIndex:15,animation:"nj-pop .3s cubic-bezier(.34,1.56,.64,1) both"}}>✓</div>}
      {votingMode&&!isEliminated&&<VoteOverlay gameId={game.id} count={voteCount} onVote={onVote}/>}
    </div>

    {/* body */}
    <div style={{padding:"16px 18px 18px"}}>
      <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.65rem",letterSpacing:".06em",
        color:"#fff",lineHeight:1,marginBottom:7}}>{game.name}</h2>
      <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:".97rem",
        lineHeight:1.65,color:"#bbb"}}>{game.short_description}</p>
    </div>
  </article>;
}

/* ─────────────────────────────────────────────────
   SEARCH BAR
───────────────────────────────────────────────── */
function SearchBar({onAdd,existingIds}){
  const [q,setQ]=useState("");
  const [res,setRes]=useState([]);
  const [loading,setLoading]=useState(false);
  const [open,setOpen]=useState(false);
  const [err,setErr]=useState("");
  const timer=useRef(null);
  const wrap=useRef(null);

  useEffect(()=>{
    function h(e){if(wrap.current&&!wrap.current.contains(e.target))setOpen(false);}
    document.addEventListener("mousedown",h);
    return ()=>document.removeEventListener("mousedown",h);
  },[]);

  useEffect(()=>{
    clearTimeout(timer.current);
    if(q.trim().length<2){setRes([]);setOpen(false);return;}
    timer.current=setTimeout(async()=>{
      setLoading(true);setErr("");setOpen(true);
      try{ const r=await searchSteamGames(q.trim()); setRes(r); }
      catch(e){ setErr("Erro ao buscar. Tente novamente."); setRes([]); }
      setLoading(false);
    },700);
    return ()=>clearTimeout(timer.current);
  },[q]);

  function pick(game){
    if(existingIds.has(game.appid))return;
    onAdd({...game,id:String(game.appid)});
    setQ("");setRes([]);setOpen(false);
  }

  return <div ref={wrap} style={{position:"relative"}}>
    <div style={{position:"relative"}}>
      <input className="nj-search-input" value={q} onChange={e=>setQ(e.target.value)}
        placeholder="🔍  Buscar jogo na Steam..." autoComplete="off"/>
      {loading&&<div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)"}}>
        <div className="nj-spinner" style={{width:22,height:22}}/>
      </div>}
      {!loading&&q&&<button onClick={()=>{setQ("");setRes([]);setOpen(false);}}
        style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
          background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:"1rem"}}>✕</button>}
    </div>

    {open&&<div className="nj-dropdown">
      {err&&<div style={{padding:"14px 16px",color:"#e74c3c",fontSize:".88rem"}}>{err}</div>}
      {!err&&!loading&&res.length===0&&<div style={{padding:"14px 16px",color:"#555",fontSize:".88rem"}}>Nenhum resultado.</div>}
      {loading&&<div style={{padding:"16px",color:"#555",fontSize:".88rem",display:"flex",gap:10,alignItems:"center"}}>
        <div className="nj-spinner" style={{width:16,height:16}}/> Buscando na Steam...
      </div>}
      {res.map(g=>{
        const already=existingIds.has(g.appid);
        return <div key={g.appid} className="nj-dd-item"
          onClick={()=>!already&&pick(g)}
          style={{opacity:already?.45:1,cursor:already?"not-allowed":"pointer"}}>
          <img className="nj-dd-thumb" src={g.header_image} alt={g.name}
            onError={e=>{e.target.style.background="#1a1a1a";e.target.src="";}}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:".95rem",color:"#f0e8df"}}>{g.name}</div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:3}}>
              {(g.genres||[]).slice(0,3).map(t=>(
                <span key={t} style={{background:"rgba(255,255,255,.07)",padding:"1px 6px",
                  borderRadius:2,fontSize:".62rem",letterSpacing:".07em",color:"#888"}}>{t}</span>
              ))}
            </div>
          </div>
          {already&&<span style={{fontSize:".65rem",color:"#f0a500",letterSpacing:".08em",whiteSpace:"nowrap"}}>ADICIONADO</span>}
        </div>;
      })}
    </div>}
  </div>;
}

/* ─────────────────────────────────────────────────
   MODAL
───────────────────────────────────────────────── */
function Modal({show,onClose,bord="rgba(192,57,43,.4)",glow="rgba(192,57,43,.3)",children}){
  if(!show)return null;
  return <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.9)",
    display:"flex",alignItems:"center",justifyContent:"center",zIndex:900,
    backdropFilter:"blur(10px)",animation:"nj-fdDown .3s ease both"}}>
    <div onClick={e=>e.stopPropagation()} style={{background:"#111",border:`1px solid ${bord}`,
      borderRadius:4,padding:"42px 48px",maxWidth:520,width:"92vw",textAlign:"center",
      boxShadow:`0 0 80px ${glow}`,animation:"nj-fdUp .4s cubic-bezier(.34,1.56,.64,1) both"}}>
      {children}
    </div>
  </div>;
}

/* ─────────────────────────────────────────────────
   SORTEIO MODAL
───────────────────────────────────────────────── */
function SorteioModal({show,games,onClose}){
  const [phase,setPhase]=useState("idle");
  const [reel,setReel]=useState("");
  const [winner,setWinner]=useState(null);
  const t=useRef(null);

  function spin(){
    clearTimeout(t.current);
    if(!games.length)return;
    setPhase("spinning");setWinner(null);
    const w=games[Math.floor(Math.random()*games.length)];
    const TOTAL=26+Math.floor(Math.random()*10);
    let step=0,delay=42;
    function tick(){
      setReel(games[Math.floor(Math.random()*games.length)].name);
      step++;
      if(step<TOTAL){
        if(step/TOTAL>0.6)delay=Math.min(delay+28,340);
        t.current=setTimeout(tick,delay);
      }else{
        setReel(w.name);
        t.current=setTimeout(()=>{setWinner(w);setPhase("result");},420);
      }
    }
    tick();
  }
  function close(){clearTimeout(t.current);setPhase("idle");setWinner(null);onClose();}
  useEffect(()=>{if(show)spin();},[show]);
  useEffect(()=>()=>clearTimeout(t.current),[]);

  return <Modal show={show} onClose={close} bord="rgba(243,156,18,.4)" glow="rgba(243,156,18,.25)">
    {phase!=="result"
      ? <>
          <div style={{fontSize:".68rem",letterSpacing:".35em",textTransform:"uppercase",color:"#f0a500",marginBottom:18}}>🎲 Sorteando...</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"2.5rem",letterSpacing:".06em",
            color:"#f0a500",minHeight:64,display:"flex",alignItems:"center",justifyContent:"center",
            textShadow:"0 0 30px rgba(240,165,0,.7)"}}>{reel||"..."}</div>
        </>
      : <>
          <div style={{fontSize:".68rem",letterSpacing:".35em",textTransform:"uppercase",color:"#f0a500",marginBottom:12}}>🎯 O jogo sorteado é</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"2.6rem",letterSpacing:".06em",color:"#fff",lineHeight:1,marginBottom:14}}>{winner.name}</div>
          <img src={winner.header_image} alt={winner.name}
            style={{width:"100%",borderRadius:3,marginBottom:14,border:"1px solid rgba(243,156,18,.35)",boxShadow:"0 0 40px rgba(243,156,18,.2)"}}/>
          <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",color:"#bbb",lineHeight:1.68,marginBottom:24,fontSize:".97rem"}}>{winner.short_description}</p>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <Btn col="gold" onClick={spin}>🎲 De Novo</Btn>
            <Btn col="ghost" onClick={close}>Fechar</Btn>
          </div>
        </>
    }
  </Modal>;
}

/* ─────────────────────────────────────────────────
   BUTTON PRIMITIVE
───────────────────────────────────────────────── */
const BTN_STYLES={
  primary:{ bg:"#c0392b",color:"#fff",border:"none" },
  outline:{ bg:"none",color:"#c0392b",border:"2px solid #c0392b" },
  gold:   { bg:"none",color:"#f0a500",border:"2px solid #f0a500" },
  ghost:  { bg:"none",color:"#666",border:"1px solid #333" },
  red:    { bg:"none",color:"#c0392b",border:"1px solid rgba(192,57,43,.4)" },
};
function Btn({col="primary",onClick,children,style:ex={}}){
  const s=BTN_STYLES[col]||BTN_STYLES.primary;
  return <button onClick={onClick} style={{fontFamily:"'Bebas Neue',sans-serif",letterSpacing:".14em",
    borderRadius:2,cursor:"pointer",padding:"11px 28px",fontSize:"1.1rem",transition:"all .2s",
    background:s.bg,color:s.color,border:s.border,...ex}}>{children}</button>;
}

/* ─────────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────────── */
export default function App(){
  useEffect(()=>{
    const s=document.createElement("style");
    s.id="nj-css";
    if(!document.getElementById("nj-css")){s.textContent=GLOBAL_CSS;document.head.appendChild(s);}
    return()=>document.getElementById("nj-css")?.remove();
  },[]);

  const [games,setGames]=useState([]);
  const [selected,setSelected]=useState(new Set());
  const [voting,setVoting]=useState(false);
  const [votes,setVotes]=useState({});
  const [eliminated,setEliminated]=useState(new Set());
  const [animId,setAnimId]=useState(null);
  const [round,setRound]=useState(1);
  const [modals,setModals]=useState({confirm:false,elim:null,winner:null,sorteio:false});
  const bannerRef=useRef(null);

  const activeGames=games.filter(g=>!eliminated.has(g.id));
  const maxV=Math.max(0,...activeGames.map(g=>votes[g.id]||0));
  const leaderId=maxV>0?activeGames.find(g=>(votes[g.id]||0)===maxV)?.id:null;
  const existingIds=new Set(games.map(g=>Number(g.appid||g.id)));

  function addGame(game){
    setGames(p=>{if(p.find(x=>x.id===game.id))return p;return[...p,game];});
  }
  function removeGame(id){
    setGames(p=>p.filter(g=>g.id!==id));
    setSelected(p=>{const n=new Set(p);n.delete(id);return n;});
  }
  function toggleSelect(id){
    setSelected(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});
  }

  function startVoting(){
    if(activeGames.length<2){alert("Adicione pelo menos 2 jogos para votar!");return;}
    setVotes({});setEliminated(new Set());setRound(1);setVoting(true);
    setTimeout(()=>bannerRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),100);
  }
  function stopVoting(){setVoting(false);setVotes({});}
  function handleVote(id,d){setVotes(p=>({...p,[id]:Math.max(0,(p[id]||0)+d)}));}

  function tryEliminate(){
    if(activeGames.length<=1)return;
    if(maxV===0){alert("Ninguém votou ainda! Use os botões + para votar.");return;}
    const top=activeGames.find(g=>(votes[g.id]||0)===maxV);
    if(top)setModals(m=>({...m,elim:top}));
  }

  function confirmElim(){
    const game=modals.elim;if(!game)return;
    setModals(m=>({...m,elim:null}));setAnimId(game.id);
    setTimeout(()=>{
      setEliminated(p=>{const n=new Set(p);n.add(game.id);return n;});
      setAnimId(null);setVotes({});setRound(r=>r+1);
      const remaining=games.filter(g=>!eliminated.has(g.id)&&g.id!==game.id);
      if(remaining.length===1){
        setTimeout(()=>{setVoting(false);setModals(m=>({...m,winner:remaining[0]}));launchConfetti();},700);
      }
    },460);
  }

  const selectedGames=[...selected].map(id=>games.find(g=>g.id===id)).filter(Boolean);

  return <div id="njroot">

    {/* HERO */}
    <section style={{textAlign:"center",padding:"72px 20px 44px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 100%,rgba(192,57,43,.18) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <p style={{fontFamily:"'Rajdhani',sans-serif",fontSize:".85rem",letterSpacing:".44em",
        textTransform:"uppercase",color:"#c0392b",marginBottom:16,animation:"nj-fdDown .8s ease both"}}>
        ⚔ Votação da Noite ⚔
      </p>
      <h1 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:"clamp(2rem,6vw,4.6rem)",lineHeight:1.06,
        background:"linear-gradient(135deg,#fff 20%,#f0a500 55%,#e74c3c 90%)",
        WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
        filter:"drop-shadow(0 0 40px rgba(192,57,43,.5))",animation:"nj-fdDown .9s .1s ease both"}}>
        Noite de Jogos
      </h1>
      <p style={{marginTop:16,fontSize:"1.05rem",color:"#555",letterSpacing:".08em",animation:"nj-fdDown .9s .2s ease both"}}>
        Busque jogos na Steam e monte sua lista da noite
      </p>
      <div style={{margin:"28px auto 0",width:160,height:1,background:"linear-gradient(90deg,transparent,#c0392b,transparent)",animation:"nj-fdDown .9s .3s ease both"}}/>
    </section>

    {/* SEARCH */}
    {!voting&&<div style={{maxWidth:600,margin:"0 auto",padding:"0 24px 36px"}}>
      <SearchBar onAdd={addGame} existingIds={existingIds}/>
      {games.length===0&&<p style={{textAlign:"center",color:"#2a2a2a",marginTop:20,fontSize:".85rem",
        letterSpacing:".12em",textTransform:"uppercase",fontFamily:"'Rajdhani',sans-serif"}}>
        Digite o nome de qualquer jogo para começar
      </p>}
    </div>}

    {/* VOTING BANNER */}
    {voting&&<div ref={bannerRef} style={{position:"sticky",top:0,zIndex:80,background:"rgba(5,5,5,.97)",
      borderBottom:"2px solid #c0392b",backdropFilter:"blur(14px)",padding:"11px 26px",
      display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap",
      animation:"nj-fdDown .35s ease both"}}>
      <div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.4rem",letterSpacing:".1em"}}>
          ☠ RODADA <span style={{color:"#c0392b"}}>{round}</span> — ELIMINAÇÃO
        </div>
        <div style={{fontSize:".7rem",letterSpacing:".13em",textTransform:"uppercase",color:"#444",marginTop:2}}>
          + para votar · O mais votado é desclassificado
        </div>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <Btn col="ghost" onClick={()=>setVotes({})} ex={{fontSize:"1rem",padding:"8px 14px"}}>↺ Zerar</Btn>
        <Btn col="primary" onClick={tryEliminate} ex={{fontSize:"1rem",padding:"8px 20px"}}>💀 Eliminar Mais Votado</Btn>
        <Btn col="ghost" onClick={stopVoting} ex={{fontSize:"1rem",padding:"8px 14px",color:"#444",borderColor:"#222"}}>✕ Sair</Btn>
      </div>
    </div>}

    {/* GRID */}
    {games.length>0&&<main style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",
      gap:24,maxWidth:1380,margin:"0 auto",padding:"0 24px 80px"}}>
      {games.map(game=>(
        <GameCard key={game.id} game={game}
          isSelected={selected.has(game.id)}
          isEliminated={eliminated.has(game.id)}
          isLeader={voting&&game.id===leaderId}
          votingMode={voting}
          voteCount={votes[game.id]||0}
          onToggle={()=>toggleSelect(game.id)}
          onVote={handleVote}
          onRemove={removeGame}
          animClass={animId===game.id?"nj-eliminating":""}
        />
      ))}
    </main>}

    {/* FOOTER */}
    {games.length>0&&!voting&&<section style={{textAlign:"center",padding:"0 20px 70px"}}>
      <div style={{display:"inline-block",background:"#111",border:"1px solid rgba(192,57,43,.28)",
        borderRadius:4,padding:"16px 32px",marginBottom:24}}>
        <h3 style={{fontFamily:"'Bebas Neue',sans-serif",letterSpacing:".12em",fontSize:"1rem",
          color:"#c0392b",marginBottom:10}}>🎯 Jogos Selecionados</h3>
        <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:".97rem"}}>
          {selectedGames.length===0
            ? <span style={{color:"#3a3a3a",fontStyle:"italic",fontSize:".87rem"}}>Nenhum selecionado — clique nas cartas!</span>
            : selectedGames.map(g=>(
                <span key={g.id} style={{display:"inline-block",background:"rgba(243,156,18,.1)",
                  border:"1px solid rgba(243,156,18,.28)",color:"#f0a500",
                  padding:"3px 12px",borderRadius:2,margin:3,fontWeight:600}}>{g.name}</span>
              ))}
        </div>
      </div>
      <br/>
      <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
        <Btn col="primary" ex={{fontSize:"1.3rem",padding:"13px 40px"}}
          onClick={()=>selectedGames.length?setModals(m=>({...m,confirm:true})):alert("Selecione pelo menos um jogo!")}>
          ⚡ Confirmar Escolha
        </Btn>
        <Btn col="outline" ex={{fontSize:"1.3rem",padding:"13px 40px"}} onClick={startVoting}>☠ Modo Votação</Btn>
        <Btn col="gold" ex={{fontSize:"1.3rem",padding:"13px 40px"}}
          onClick={()=>games.length?setModals(m=>({...m,sorteio:true})):alert("Adicione jogos primeiro!")}>
          🎲 Sortear Jogo
        </Btn>
      </div>
    </section>}

    {/* MODAL CONFIRMAR */}
    <Modal show={modals.confirm} onClose={()=>setModals(m=>({...m,confirm:false}))}>
      <div style={{fontSize:"2.6rem",marginBottom:14}}>🎮</div>
      <h2 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:"1.4rem",marginBottom:14,color:"#f0a500"}}>Que comecem os jogos!</h2>
      <p style={{color:"#aaa",lineHeight:1.7,marginBottom:16}}>Os jogos escolhidos foram:</p>
      <p style={{fontWeight:700,color:"#f0e8df",fontSize:"1.02rem",marginBottom:28}}>{selectedGames.map(g=>g.name).join(" · ")}</p>
      <Btn col="ghost" onClick={()=>setModals(m=>({...m,confirm:false}))}>Voltar</Btn>
    </Modal>

    {/* MODAL ELIMINAÇÃO */}
    <Modal show={!!modals.elim} onClose={()=>setModals(m=>({...m,elim:null}))}>
      {modals.elim&&<>
        <div style={{fontSize:"2.2rem",marginBottom:10}}>💀</div>
        <div style={{fontSize:".7rem",letterSpacing:".3em",textTransform:"uppercase",color:"#c0392b",marginBottom:8,fontFamily:"'Rajdhani',sans-serif"}}>Jogo Mais Votado</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"2.4rem",letterSpacing:".06em",color:"#fff",lineHeight:1,marginBottom:8}}>{modals.elim.name}</div>
        <div style={{fontSize:".8rem",letterSpacing:".15em",textTransform:"uppercase",color:"#c0392b",marginBottom:18}}>{votes[modals.elim.id]||0} {(votes[modals.elim.id]||0)===1?"VOTO":"VOTOS"}</div>
        <img src={modals.elim.header_image} alt={modals.elim.name}
          style={{width:"100%",borderRadius:3,marginBottom:22,opacity:.4,filter:"grayscale(1) brightness(.4)",border:"1px solid rgba(192,57,43,.3)"}}/>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <Btn col="primary" onClick={confirmElim}>✔ Confirmar Eliminação</Btn>
          <Btn col="ghost" onClick={()=>setModals(m=>({...m,elim:null}))}>Cancelar</Btn>
        </div>
      </>}
    </Modal>

    {/* MODAL VENCEDOR */}
    <Modal show={!!modals.winner} onClose={()=>setModals(m=>({...m,winner:null}))} bord="rgba(243,156,18,.5)" glow="rgba(243,156,18,.35)">
      {modals.winner&&<>
        <div style={{fontSize:"2.8rem",marginBottom:10,display:"inline-block",animation:"nj-bounce .6s ease infinite alternate"}}>🏆</div>
        <div style={{fontSize:".7rem",letterSpacing:".35em",textTransform:"uppercase",color:"#f0a500",marginBottom:10,fontFamily:"'Rajdhani',sans-serif"}}>⚔ Jogo da Noite ⚔</div>
        <div className="nj-winner-ttl" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"2.7rem",letterSpacing:".06em",color:"#fff",lineHeight:1,marginBottom:16}}>{modals.winner.name}</div>
        <img src={modals.winner.header_image} alt={modals.winner.name}
          style={{width:"100%",borderRadius:3,marginBottom:18,border:"1px solid rgba(243,156,18,.4)",boxShadow:"0 0 40px rgba(243,156,18,.2)"}}/>
        <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",color:"#bbb",lineHeight:1.7,marginBottom:26,fontSize:".97rem"}}>{modals.winner.short_description}</p>
        <Btn col="primary" ex={{fontSize:"1.3rem",padding:"13px 40px"}} onClick={()=>setModals(m=>({...m,winner:null}))}>🎮 Vamos Jogar!</Btn>
      </>}
    </Modal>

    {/* SORTEIO */}
    <SorteioModal show={modals.sorteio} games={activeGames} onClose={()=>setModals(m=>({...m,sorteio:false}))}/>

  </div>;
}