import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────── */
const GAMES = [
  {
    id: "YAPYAP", name: "YAPYAP",
    img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3834090/399b7aa5bd9ea359e6d77cec3032758ea27c597b/header.jpg?t=1773851413",
    desc: "Você e mais 5 amigos são mini lacaios invocados por um mago para destruir a torre rival. Use todas as suas magias enquanto evita bestas mágicas e monstros que protegem a torre.",
    tags: ["coop","horror","magic"], players: "Até 6 jogadores",
    tagLabels: [["coop","Cooperativo"],["horror","Terror"],["magic","Magia"]],
  },
  {
    id: "MIMESIS", name: "MIMESIS",
    img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2827200/825cac843c69f16866fdf3bb649eb4d7e666cb2b/header_alt_assets_0.jpg?t=1773306445",
    desc: "Quando a chuva amaldiçoada cai, surgem os Mimesis — criaturas que imitam perfeitamente seus companheiros, criando uma tensão inédita de sobrevivência e terror.",
    tags: ["coop","horror","surv"], players: "Multijogador",
    tagLabels: [["coop","Cooperativo"],["horror","Terror"],["surv","Sobrevivência"]],
  },
  {
    id: "WISE_GUYS", name: "WISE GUYS",
    img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3725630/fb44d7fd57648c2652b2c2cde16b133287b6b750/header.jpg?t=1771622798",
    desc: "Um jogo implacável de dedução social onde a confiança é uma arma e a traição é sobrevivência. Um Delator sabota a equipe enquanto todos correm contra o tempo.",
    tags: ["bluff","social"], players: "Até 8 jogadores",
    tagLabels: [["social","Dedução Social"],["bluff","Traição"]],
  },
  {
    id: "OUTLAST", name: "THE OUTLAST TRIALS",
    img: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1304930/header.jpg",
    desc: "A Red Barrels convida você a experimentar um terror perturbador, desta vez com amigos. Complete as terapias da Murkoff e talvez eles deixem você partir... mas você ainda será o mesmo?",
    tags: ["coop","horror"], players: "1–4 jogadores",
    tagLabels: [["coop","Cooperativo"],["horror","Terror"]],
  },
  {
    id: "SONS", name: "SONS OF THE FOREST",
    img: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1326470/header.jpg",
    desc: "Enviado para encontrar um bilionário desaparecido em uma ilha remota, você se vê em um pesadelo infestado de canibais. Construa, sobreviva e enfrente o horror num open world assustador.",
    tags: ["coop","horror","surv"], players: "1–8 jogadores",
    tagLabels: [["coop","Cooperativo"],["horror","Terror"],["surv","Sobrevivência"]],
  },
  {
    id: "DEVOUR", name: "DEVOUR",
    img: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1274570/header.jpg",
    desc: "Detenha integrantes possuídos por Azazel antes que arrastem você para o inferno. Corra. Grite. Esconda-se. Sobreviva a qualquer custo!",
    tags: ["coop","horror","surv"], players: "1–4 jogadores",
    tagLabels: [["coop","Cooperativo"],["horror","Terror"],["surv","Sobrevivência"]],
  },
  {
    id: "LIARS", name: "LIAR'S BAR",
    img: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3097560/header.jpg",
    desc: "Em um bar suspeito, sente-se e teste suas habilidades em Liar's Dice e Liar's Deck. A mentira e o blefe garantem a vitória — se você tiver coragem.",
    tags: ["bluff","social"], players: "Até 4 jogadores",
    tagLabels: [["bluff","Blefe"],["social","Social"]],
  },
  {
    id: "HEADLINERS", name: "THE HEADLINERS",
    img: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3059070/62f137f87bbbe03ff34fe64f79aec4059532e849/header.jpg?t=1761229580",
    desc: "Você é um jornalista explorando Nova York invadida por criaturas mortais. Capture imagens espetaculares, apareça nas manchetes... e sobreviva para lê-las.",
    tags: ["coop","horror"], players: "1–8 jogadores",
    tagLabels: [["coop","Cooperativo"],["horror","Terror"]],
  },
];

const TAG_STYLES = {
  coop:   { bg: "rgba(46,204,113,.15)",  color: "#2ecc71", border: "rgba(46,204,113,.4)" },
  horror: { bg: "rgba(192,57,43,.2)",    color: "#e74c3c", border: "rgba(192,57,43,.5)" },
  surv:   { bg: "rgba(243,156,18,.13)",  color: "#f39c12", border: "rgba(243,156,18,.4)" },
  bluff:  { bg: "rgba(155,89,182,.2)",   color: "#b880f5", border: "rgba(155,89,182,.45)" },
  social: { bg: "rgba(230,126,34,.15)",  color: "#e67e22", border: "rgba(230,126,34,.45)" },
  magic:  { bg: "rgba(52,152,219,.15)",  color: "#74b9ff", border: "rgba(52,152,219,.4)" },
};

const FILTERS = [
  { key: "todos",  label: "Todos" },
  { key: "coop",   label: "Cooperativo" },
  { key: "horror", label: "Terror" },
  { key: "surv",   label: "Sobrevivência" },
  { key: "bluff",  label: "Blefe / Social" },
];

/* ─────────────────────────────────────────────────
   GLOBAL STYLES (injected once)
───────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel+Decorative:wght@700;900&family=Rajdhani:wght@300;400;600;700&family=Crimson+Pro:ital,wght@1,300;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  #njogos-root {
    background: #080808;
    color: #f0e8df;
    font-family: 'Rajdhani', sans-serif;
    min-height: 100vh;
    position: relative;
  }
  #njogos-root::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 9999;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: .55;
  }

  @keyframes nj-fadeDown  { from { opacity:0; transform:translateY(-16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes nj-fadeUp    { from { opacity:0; transform:translateY(28px);  } to { opacity:1; transform:translateY(0); } }
  @keyframes nj-pop       { 0%{transform:scale(1)} 40%{transform:scale(1.45)} 100%{transform:scale(1)} }
  @keyframes nj-shake     { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px) rotate(-1.5deg)} 40%{transform:translateX(10px) rotate(1.5deg)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
  @keyframes nj-bounce     { from{transform:translateY(0)} to{transform:translateY(-9px)} }
  @keyframes nj-pulse-red  { 0%,100%{box-shadow:0 0 0 2px #c0392b, 0 0 20px rgba(192,57,43,.3)} 50%{box-shadow:0 0 0 3px #e74c3c, 0 0 50px rgba(192,57,43,.65)} }
  @keyframes nj-confetti   { 0%{transform:translateY(-10px) rotate(0deg); opacity:1} 100%{transform:translateY(100vh) rotate(720deg); opacity:0} }
  @keyframes nj-wipe-in    { 0%{transform:scaleX(0);transform-origin:left} 50%{transform:scaleX(1);transform-origin:left} 51%{transform:scaleX(1);transform-origin:right} 100%{transform:scaleX(0);transform-origin:right} }
  @keyframes nj-winner-glow { 0%,100%{filter:drop-shadow(0 0 20px rgba(243,156,18,.5))} 50%{filter:drop-shadow(0 0 55px rgba(243,156,18,.9))} }

  .nj-card-eliminating { animation: nj-shake .4s ease both !important; border-color: #c0392b !important; box-shadow: 0 0 0 3px #c0392b, 0 0 70px rgba(192,57,43,.8) !important; }
  .nj-vote-pop { animation: nj-pop .2s ease both; }
  .nj-winner-name { animation: nj-winner-glow 2s ease infinite; }
  .nj-confetti-piece { position:fixed; pointer-events:none; z-index:9000; border-radius:2px; animation: nj-confetti linear both; }
`;

/* ─────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────── */
function launchConfetti() {
  const colors = ["#f39c12","#e74c3c","#c0392b","#ffffff","#f0a500","#ffd166","#ff6b6b"];
  for (let i = 0; i < 70; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "nj-confetti-piece";
      const size = 5 + Math.random() * 9;
      el.style.cssText = `left:${5+Math.random()*90}vw;top:-14px;background:${colors[Math.floor(Math.random()*colors.length)]};width:${size}px;height:${size}px;border-radius:${Math.random()>.5?"50%":"2px"};animation-duration:${1.4+Math.random()*1.6}s;`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }, i * 22);
  }
}

/* ─────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────── */

function TagBadge({ type, label }) {
  const s = TAG_STYLES[type] || TAG_STYLES.coop;
  return (
    <span style={{ fontSize: ".62rem", letterSpacing: ".12em", textTransform: "uppercase",
      padding: "3px 8px", borderRadius: 2, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700,
      background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {label}
    </span>
  );
}

function GameCard({ game, isSelected, isEliminated, isLeader, votingMode, votes, onToggle, onVote, animating }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className={animating === "eliminating" ? "nj-card-eliminating" : ""}
      onClick={() => !votingMode && !isEliminated && onToggle()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#111", borderRadius: 4, overflow: "hidden", cursor: votingMode || isEliminated ? "default" : "pointer",
        position: "relative", transition: "transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s, opacity .6s, border-color .25s",
        border: isLeader && votingMode ? "1px solid #c0392b"
              : isSelected && !votingMode ? "1px solid #f0a500"
              : "1px solid rgba(192,57,43,.3)",
        boxShadow: isLeader && votingMode ? "0 0 0 2px #c0392b, 0 0 45px rgba(192,57,43,.5)"
                 : isSelected && !votingMode ? "0 0 0 2px #f0a500, 0 0 40px rgba(243,156,18,.3)"
                 : hovered && !votingMode ? "0 18px 60px rgba(0,0,0,.7), 0 0 28px rgba(192,57,43,.6)" : "none",
        transform: hovered && !votingMode && !isEliminated ? "translateY(-6px) scale(1.015)" : "none",
        opacity: isEliminated ? 0 : 1,
        animation: animating === "eliminating" ? undefined : "nj-fadeUp .7s ease both",
        animation: "nj-fadeUp .7s ease both",
        ...(isLeader && votingMode ? { animationName: "nj-pulse-red", animationDuration: "1.5s", animationIterationCount: "infinite" } : {}),
        pointerEvents: isEliminated ? "none" : "all",
      }}
    >
      {/* Thumbnail */}
      <div style={{ width: "100%", height: 200, overflow: "hidden", position: "relative" }}>
        <img
          src={game.img} alt={game.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block",
            transition: "transform .6s cubic-bezier(.22,1,.36,1), filter .4s",
            transform: hovered && !votingMode ? "scale(1.07)" : "scale(1)",
            filter: hovered && !votingMode ? "brightness(1) saturate(1.1)" : "brightness(.82) saturate(.9)" }}
        />
        {/* gradient */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,8,1) 0%, rgba(8,8,8,.08) 55%, transparent 100%)" }} />

        {/* tags */}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 5, flexWrap: "wrap" }}>
          {game.tagLabels.map(([type, label]) => <TagBadge key={type} type={type} label={label} />)}
        </div>

        {/* players badge */}
        {!votingMode && (
          <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,.75)",
            border: "1px solid rgba(255,255,255,.14)", borderRadius: 2, padding: "3px 10px",
            fontSize: ".7rem", letterSpacing: ".06em", fontFamily: "'Rajdhani',sans-serif", color: "#ccc" }}>
            👥 {game.players}
          </div>
        )}

        {/* selected check */}
        {!votingMode && isSelected && (
          <div style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28,
            background: "#f0a500", borderRadius: "50%", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: ".85rem", zIndex: 2, animation: "nj-pop .3s cubic-bezier(.34,1.56,.64,1) both" }}>
            ✓
          </div>
        )}

        {/* VOTE OVERLAY */}
        {votingMode && !isEliminated && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 10,
            background: "rgba(6,6,6,.62)", backdropFilter: "blur(1px)", zIndex: 10 }}>
            <VoteCounter gameId={game.id} count={votes} onVote={onVote} />
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "18px 20px 20px" }}>
        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.75rem", letterSpacing: ".06em",
          color: "#fff", lineHeight: 1, marginBottom: 8 }}>
          {game.name}
        </h2>
        <p style={{ fontFamily: "'Crimson Pro',serif", fontStyle: "italic", fontSize: "1rem",
          lineHeight: 1.65, color: "#bbb" }}>
          {game.desc}
        </p>
      </div>
    </article>
  );
}

function VoteCounter({ gameId, count, onVote }) {
  const [pop, setPop] = useState(false);

  function handleVote(delta, e) {
    e.stopPropagation();
    onVote(gameId, delta);
    if (delta > 0) { setPop(true); setTimeout(() => setPop(false), 220); }
  }

  return (
    <>
      <div className={pop ? "nj-vote-pop" : ""}
        style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "3.8rem", lineHeight: 1,
          color: count > 0 ? "#e74c3c" : "#fff", textShadow: "0 2px 20px rgba(0,0,0,.9)",
          transition: "color .2s" }}>
        {count}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={e => handleVote(1,e)}
          style={{ width: 46, height: 46, borderRadius: "50%", border: "none", cursor: "pointer",
            background: "#c0392b", color: "#fff", fontSize: "1.6rem", display: "flex",
            alignItems: "center", justifyContent: "center", transition: "all .16s",
            fontFamily: "'Bebas Neue',sans-serif" }}>+</button>
        <button onClick={e => handleVote(-1,e)}
          style={{ width: 46, height: 46, borderRadius: "50%", border: "1px solid rgba(255,255,255,.15)",
            cursor: "pointer", background: "rgba(255,255,255,.1)", color: "#aaa",
            fontSize: "1.3rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .16s" }}>−</button>
      </div>
    </>
  );
}

/* ── Modal backdrop ── */
function ModalBg({ show, onClose, children }) {
  if (!show) return null;
  return (
    <div onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.9)", display: "flex",
        alignItems: "center", justifyContent: "center", zIndex: 800,
        backdropFilter: "blur(10px)", animation: "nj-fadeDown .3s ease both" }}>
      <div onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ModalBox({ children, borderColor = "rgba(192,57,43,.35)", glowColor = "rgba(192,57,43,.3)" }) {
  return (
    <div style={{ background: "#111", border: `1px solid ${borderColor}`, borderRadius: 4,
      padding: "44px 50px", maxWidth: 520, width: "92vw", textAlign: "center",
      boxShadow: `0 0 80px ${glowColor}`,
      animation: "nj-fadeUp .4s cubic-bezier(.34,1.56,.64,1) both" }}>
      {children}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", disabled = false, style: extraStyle = {} }) {
  const base = { fontFamily: "'Bebas Neue',sans-serif", letterSpacing: ".15em",
    borderRadius: 2, cursor: disabled ? "not-allowed" : "pointer", border: "none",
    padding: "12px 32px", fontSize: "1.15rem", transition: "all .22s",
    opacity: disabled ? .4 : 1, position: "relative", overflow: "hidden" };

  const variants = {
    primary:  { background: "#c0392b", color: "#fff" },
    outline:  { background: "none", color: "#c0392b", border: "2px solid #c0392b" },
    gold:     { background: "none", color: "#f0a500", border: "2px solid #f0a500" },
    ghost:    { background: "none", color: "#666", border: "1px solid #333" },
    confirm:  { background: "#c0392b", color: "#fff", padding: "14px 48px", fontSize: "1.35rem" },
  };
  return <button onClick={!disabled ? onClick : undefined} style={{ ...base, ...variants[variant], ...extraStyle }}>{children}</button>;
}

/* ─────────────────────────────────────────────────
   SORTEIO MODAL
───────────────────────────────────────────────── */
function SorteioModal({ show, onClose }) {
  const [phase, setPhase] = useState("idle"); // idle | spinning | result
  const [reelText, setReelText] = useState("");
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);

  function startSpin() {
    clearTimeout(timerRef.current);
    setPhase("spinning");
    setResult(null);
    const winner = GAMES[Math.floor(Math.random() * GAMES.length)];
    const TOTAL = 28 + Math.floor(Math.random() * 10);
    let step = 0;
    let delay = 45;

    function tick() {
      const g = GAMES[Math.floor(Math.random() * GAMES.length)];
      setReelText(g.name);
      step++;
      if (step < TOTAL) {
        const prog = step / TOTAL;
        if (prog > 0.6) delay = Math.min(delay + 30, 340);
        timerRef.current = setTimeout(tick, delay);
      } else {
        setReelText(winner.name);
        timerRef.current = setTimeout(() => { setResult(winner); setPhase("result"); }, 420);
      }
    }
    tick();
  }

  function handleClose() {
    clearTimeout(timerRef.current);
    setPhase("idle");
    setResult(null);
    onClose();
  }

  useEffect(() => { if (show && phase === "idle") startSpin(); }, [show]);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  if (!show) return null;
  return (
    <ModalBg show onClose={handleClose}>
      <ModalBox borderColor="rgba(243,156,18,.35)" glowColor="rgba(243,156,18,.25)">
        {phase !== "result" ? (
          <>
            <div style={{ fontSize: ".7rem", letterSpacing: ".35em", textTransform: "uppercase",
              color: "#f0a500", marginBottom: 20 }}>🎲 Sorteando...</div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2.6rem",
              letterSpacing: ".06em", color: "#f0a500", minHeight: 70, display: "flex",
              alignItems: "center", justifyContent: "center",
              textShadow: "0 0 30px rgba(240,165,0,.7)", animation: "nj-fadeUp .1s ease both" }}>
              {reelText || "..."}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: ".7rem", letterSpacing: ".35em", textTransform: "uppercase",
              color: "#f0a500", marginBottom: 12 }}>🎯 O jogo sorteado é</div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2.8rem", letterSpacing: ".06em",
              color: "#fff", lineHeight: 1, marginBottom: 16 }}>{result.name}</div>
            <img src={result.img} alt={result.name}
              style={{ width: "100%", borderRadius: 3, marginBottom: 16,
                border: "1px solid rgba(243,156,18,.35)", boxShadow: "0 0 40px rgba(243,156,18,.2)" }} />
            <p style={{ fontFamily: "'Crimson Pro',serif", fontStyle: "italic", color: "#bbb",
              lineHeight: 1.68, marginBottom: 26, fontSize: "1rem" }}>{result.desc}</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <Btn variant="gold" onClick={startSpin}>🎲 Sortear De Novo</Btn>
              <Btn variant="ghost" onClick={handleClose}>Fechar</Btn>
            </div>
          </>
        )}
      </ModalBox>
    </ModalBg>
  );
}

/* ─────────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────────── */
export default function App() {
  // style injection
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = GLOBAL_CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const [filter,      setFilter]      = useState("todos");
  const [selected,    setSelected]    = useState(new Set());
  const [votingMode,  setVotingMode]  = useState(false);
  const [votes,       setVotes]       = useState({});        // { id: count }
  const [eliminated,  setEliminated]  = useState(new Set());
  const [animating,   setAnimating]   = useState(null);      // id being animated
  const [round,       setRound]       = useState(1);
  const [elimModal,   setElimModal]   = useState(null);      // game object
  const [winnerModal, setWinnerModal] = useState(null);
  const [confirmModal,setConfirmModal]= useState(false);
  const [sorteioModal,setSorteioModal]= useState(false);
  const bannerRef = useRef(null);

  const visibleGames = GAMES.filter(g =>
    !eliminated.has(g.id) && (filter === "todos" || g.tags.includes(filter))
  );

  const maxVotes = Math.max(0, ...Object.values(votes));
  const leaderId = maxVotes > 0
    ? Object.entries(votes).find(([,v]) => v === maxVotes)?.[0]
    : null;

  /* ── SELECTION ── */
  function toggleSelect(id) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  /* ── VOTING ── */
  function startVoting() {
    setVotes({});
    setEliminated(new Set());
    setRound(1);
    setVotingMode(true);
    setTimeout(() => bannerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  function stopVoting() {
    setVotingMode(false);
    setVotes({});
  }

  function handleVote(gameId, delta) {
    setVotes(prev => ({ ...prev, [gameId]: Math.max(0, (prev[gameId] || 0) + delta) }));
  }

  function resetVotes() { setVotes({}); }

  function tryEliminate() {
    const active = GAMES.filter(g => !eliminated.has(g.id));
    if (active.length <= 1) return;
    if (maxVotes === 0) { alert("Ninguém votou ainda! Use os botões + para votar."); return; }
    const winner = active.find(g => (votes[g.id] || 0) === maxVotes);
    if (winner) setElimModal(winner);
  }

  function confirmElim() {
    if (!elimModal) return;
    setElimModal(null);
    const id = elimModal.id;
    setAnimating(id);

    setTimeout(() => {
      setEliminated(prev => { const n = new Set(prev); n.add(id); return n; });
      setAnimating(null);
      setVotes({});
      setRound(r => r + 1);

      const remaining = GAMES.filter(g => !eliminated.has(g.id) && g.id !== id);
      if (remaining.length === 1) {
        setTimeout(() => {
          setVotingMode(false);
          setWinnerModal(remaining[0]);
          launchConfetti();
        }, 700);
      }
    }, 450);
  }

  /* ── RENDER ── */
  const selectedArr = [...selected];

  return (
    <div id="njogos-root">

      {/* ── HERO ── */}
      <section style={{ textAlign: "center", padding: "80px 20px 50px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 100%, rgba(192,57,43,.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: ".88rem", letterSpacing: ".42em",
          textTransform: "uppercase", color: "#c0392b", marginBottom: 18,
          animation: "nj-fadeDown .8s ease both" }}>
          ⚔ Votação da Noite ⚔
        </p>
        <h1 style={{ fontFamily: "'Cinzel Decorative',serif",
          fontSize: "clamp(2.2rem, 6vw, 4.8rem)", lineHeight: 1.08,
          background: "linear-gradient(135deg, #fff 20%, #f0a500 55%, #e74c3c 90%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          filter: "drop-shadow(0 0 40px rgba(192,57,43,.5))",
          animation: "nj-fadeDown .9s .1s ease both" }}>
          Noite de Jogos
        </h1>
        <p style={{ marginTop: 18, fontSize: "1.1rem", color: "#888", letterSpacing: ".08em",
          animation: "nj-fadeDown .9s .2s ease both" }}>
          Escolha os jogos que você quer jogar hoje
        </p>
        <div style={{ margin: "32px auto 0", width: 180, height: 1,
          background: "linear-gradient(90deg, transparent, #c0392b, transparent)",
          animation: "nj-fadeDown .9s .3s ease both" }} />
      </section>

      {/* ── FILTER BAR ── */}
      <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap",
        padding: "16px 20px 0", animation: "nj-fadeDown .9s .4s ease both" }}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            style={{ background: filter === f.key ? "rgba(192,57,43,.12)" : "none",
              border: `1px solid ${filter === f.key ? "#c0392b" : "rgba(192,57,43,.3)"}`,
              color: filter === f.key ? "#f0e8df" : "#888",
              fontFamily: "'Rajdhani',sans-serif", fontSize: ".82rem", letterSpacing: ".12em",
              textTransform: "uppercase", padding: "8px 20px", cursor: "pointer", borderRadius: 2,
              transition: "all .22s" }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* ── VOTING BANNER ── */}
      {votingMode && (
        <div ref={bannerRef}
          style={{ position: "sticky", top: 0, zIndex: 80, background: "rgba(6,6,6,.97)",
            borderBottom: "2px solid #c0392b", backdropFilter: "blur(14px)",
            padding: "12px 28px", display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: 12, flexWrap: "wrap",
            animation: "nj-fadeDown .35s ease both" }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.4rem", letterSpacing: ".1em" }}>
              ☠ RODADA <span style={{ color: "#c0392b" }}>{round}</span> — ELIMINAÇÃO
            </div>
            <div style={{ fontSize: ".72rem", letterSpacing: ".14em", textTransform: "uppercase", color: "#666" }}>
              Use + para votar em eliminar · O mais votado é desclassificado
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <Btn variant="ghost" onClick={resetVotes} style={{ fontSize: "1rem", padding: "8px 16px" }}>↺ Zerar</Btn>
            <Btn variant="primary" onClick={tryEliminate} style={{ fontSize: "1rem", padding: "8px 22px" }}>💀 Eliminar Mais Votado</Btn>
            <Btn variant="ghost" onClick={stopVoting} style={{ fontSize: "1rem", padding: "8px 16px", color: "#555", borderColor: "#333" }}>✕ Sair</Btn>
          </div>
        </div>
      )}

      {/* ── GRID ── */}
      <main style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px,1fr))",
        gap: 26, maxWidth: 1380, margin: "46px auto 0", padding: "0 26px 80px" }}>
        {GAMES.filter(g => filter === "todos" || g.tags.includes(filter)).map(game => (
          <GameCard
            key={game.id}
            game={game}
            isSelected={selected.has(game.id)}
            isEliminated={eliminated.has(game.id)}
            isLeader={votingMode && game.id === leaderId}
            votingMode={votingMode}
            votes={votes[game.id] || 0}
            onToggle={() => toggleSelect(game.id)}
            onVote={handleVote}
            animating={animating === game.id ? "eliminating" : null}
          />
        ))}
      </main>

      {/* ── FOOTER ── */}
      <section style={{ textAlign: "center", padding: "0 20px 70px" }}>
        {/* tally */}
        {!votingMode && (
          <div style={{ display: "inline-block", background: "#111",
            border: "1px solid rgba(192,57,43,.3)", borderRadius: 4,
            padding: "18px 36px", marginBottom: 26 }}>
            <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", letterSpacing: ".12em",
              fontSize: "1.05rem", color: "#c0392b", marginBottom: 10 }}>
              🎯 Jogos Selecionados
            </h3>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "1rem" }}>
              {selectedArr.length === 0
                ? <span style={{ color: "#666", fontStyle: "italic", fontSize: ".9rem" }}>Nenhum selecionado — clique nas cartas!</span>
                : selectedArr.map(id => {
                    const g = GAMES.find(x => x.id === id);
                    return (
                      <span key={id} style={{ display: "inline-block", background: "rgba(243,156,18,.1)",
                        border: "1px solid rgba(243,156,18,.3)", color: "#f0a500",
                        padding: "3px 12px", borderRadius: 2, margin: 3, fontWeight: 600 }}>
                        {g?.name}
                      </span>
                    );
                  })}
            </div>
          </div>
        )}

        {!votingMode && (
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn variant="confirm" onClick={() => selectedArr.length ? setConfirmModal(true) : alert("Selecione pelo menos um jogo!")}>
              ⚡ Confirmar Escolha
            </Btn>
            <Btn variant="outline" onClick={startVoting}>☠ Modo Votação</Btn>
            <Btn variant="gold" onClick={() => setSorteioModal(true)}>🎲 Sortear Jogo</Btn>
          </div>
        )}
      </section>

      {/* ── MODAL CONFIRMAR SELEÇÃO ── */}
      <ModalBg show={confirmModal} onClose={() => setConfirmModal(false)}>
        <ModalBox>
          <div style={{ fontSize: "2.6rem", marginBottom: 14 }}>🎮</div>
          <h2 style={{ fontFamily: "'Cinzel Decorative',serif", fontSize: "1.45rem",
            marginBottom: 14, color: "#f0a500" }}>Que comecem os jogos!</h2>
          <p style={{ color: "#aaa", lineHeight: 1.7, marginBottom: 18 }}>Os jogos escolhidos para a noite foram:</p>
          <p style={{ fontWeight: 700, color: "#f0e8df", fontSize: "1.05rem", marginBottom: 28 }}>
            {selectedArr.map(id => GAMES.find(g => g.id === id)?.name).join(" · ")}
          </p>
          <Btn variant="ghost" onClick={() => setConfirmModal(false)}>Voltar</Btn>
        </ModalBox>
      </ModalBg>

      {/* ── MODAL ELIMINAÇÃO ── */}
      <ModalBg show={!!elimModal} onClose={() => setElimModal(null)}>
        {elimModal && (
          <ModalBox>
            <div style={{ fontSize: "2.4rem", marginBottom: 10 }}>💀</div>
            <div style={{ fontSize: ".72rem", letterSpacing: ".3em", textTransform: "uppercase",
              color: "#c0392b", marginBottom: 8, fontFamily: "'Rajdhani',sans-serif" }}>
              Jogo Mais Votado
            </div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2.6rem",
              letterSpacing: ".06em", color: "#fff", lineHeight: 1, marginBottom: 8 }}>
              {elimModal.name}
            </div>
            <div style={{ fontSize: ".82rem", letterSpacing: ".15em", textTransform: "uppercase",
              color: "#c0392b", marginBottom: 18 }}>
              {votes[elimModal.id] || 0} {(votes[elimModal.id] || 0) === 1 ? "VOTO" : "VOTOS"}
            </div>
            <img src={elimModal.img} alt={elimModal.name}
              style={{ width: "100%", borderRadius: 3, marginBottom: 22, opacity: .45,
                filter: "grayscale(1) brightness(.45)", border: "1px solid rgba(192,57,43,.3)" }} />
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <Btn variant="primary" onClick={confirmElim}>✔ Confirmar Eliminação</Btn>
              <Btn variant="ghost" onClick={() => setElimModal(null)}>Cancelar</Btn>
            </div>
          </ModalBox>
        )}
      </ModalBg>

      {/* ── MODAL VENCEDOR ── */}
      <ModalBg show={!!winnerModal} onClose={() => setWinnerModal(null)}>
        {winnerModal && (
          <ModalBox borderColor="rgba(243,156,18,.5)" glowColor="rgba(243,156,18,.35)">
            <div style={{ fontSize: "2.8rem", marginBottom: 10, display: "inline-block",
              animation: "nj-bounce .6s ease infinite alternate" }}>🏆</div>
            <div style={{ fontSize: ".72rem", letterSpacing: ".35em", textTransform: "uppercase",
              color: "#f0a500", marginBottom: 10, fontFamily: "'Rajdhani',sans-serif" }}>
              ⚔ Jogo da Noite ⚔
            </div>
            <div className="nj-winner-name"
              style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2.8rem", letterSpacing: ".06em",
                color: "#fff", lineHeight: 1, marginBottom: 16 }}>
              {winnerModal.name}
            </div>
            <img src={winnerModal.img} alt={winnerModal.name}
              style={{ width: "100%", borderRadius: 3, marginBottom: 18,
                border: "1px solid rgba(243,156,18,.4)", boxShadow: "0 0 40px rgba(243,156,18,.2)" }} />
            <p style={{ fontFamily: "'Crimson Pro',serif", fontStyle: "italic", color: "#bbb",
              lineHeight: 1.7, marginBottom: 26, fontSize: "1.02rem" }}>
              {winnerModal.desc}
            </p>
            <Btn variant="confirm" onClick={() => setWinnerModal(null)}>🎮 Vamos Jogar!</Btn>
          </ModalBox>
        )}
      </ModalBg>

      {/* ── SORTEIO MODAL ── */}
      <SorteioModal show={sorteioModal} onClose={() => setSorteioModal(false)} />

    </div>
  );
}