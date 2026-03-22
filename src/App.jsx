import { useState, useCallback } from "react";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  :root {
    --bg:#f5f4f0; --white:#fff; --panel:#fafaf8;
    --border:#e4e2db; --border2:#d0cec6;
    --accent:#2563eb; --al:#eff4ff; --am:#bfcdfe;
    --green:#16a34a; --gl:#f0fdf4;
    --amber:#d97706; --rl:#fef2f2;
    --t:#111110; --t2:#3d3d3a; --t3:#6b6b66; --t4:#9b9b94;
  }
  body { font-family:'Plus Jakarta Sans',sans-serif; background:var(--bg); color:var(--t); font-size:14px; }
  .app { display:grid; grid-template-rows:64px 1fr; min-height:100vh; }
  header { background:var(--white); border-bottom:1.5px solid var(--border); padding:0 28px; display:flex; align-items:center; justify-content:space-between; box-shadow:0 1px 3px rgba(0,0,0,.04); }
  .logo { font-size:20px; font-weight:800; color:var(--t); letter-spacing:-.03em; }
  .logo span { color:var(--accent); }
  .badge { background:var(--al); border:1.5px solid var(--am); color:var(--accent); font-size:11px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; border-radius:6px; padding:3px 10px; }
  .workspace { display:grid; grid-template-columns:460px 1fr; overflow:hidden; height:calc(100vh - 64px); }
  .left { background:var(--white); border-right:1.5px solid var(--border); padding:24px 24px 40px; display:flex; flex-direction:column; gap:18px; overflow-y:auto; }
  .right { padding:24px 28px 40px; display:flex; flex-direction:column; gap:16px; overflow-y:auto; background:var(--bg); }
  .stitle { font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:.12em; color:var(--t3); margin-bottom:6px; }
  textarea, .ipt { width:100%; background:var(--panel); border:1.5px solid var(--border); border-radius:10px; color:var(--t); font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:500; line-height:1.7; padding:11px 13px; outline:none; resize:none; transition:border-color .15s, box-shadow .15s; }
  textarea:focus, .ipt:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(37,99,235,.09); background:var(--white); }
  textarea::placeholder, .ipt::placeholder { color:var(--t4); font-weight:400; }
  .hint { font-size:11px; font-weight:600; color:var(--t4); text-align:right; margin-top:3px; }
  .hint.warn { color:var(--amber); }
  .sp-tags { display:flex; flex-direction:column; gap:5px; margin-bottom:8px; }
  .sp-tag { display:flex; align-items:center; gap:8px; background:var(--al); border:1.5px solid var(--am); border-radius:10px; padding:8px 12px; transition:border-color .15s; }
  .sp-tag:hover { border-color:var(--accent); }
  .sp-tag.editing { border-color:var(--accent); background:var(--white); box-shadow:0 0 0 3px rgba(37,99,235,.09); }
  .sp-num { width:22px; height:22px; border-radius:6px; background:var(--accent); color:#fff; font-size:10px; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .sp-text { flex:1; font-size:13px; font-weight:600; color:var(--t2); cursor:text; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .sp-ipt-inline { flex:1; background:none; border:none; outline:none; font-family:inherit; font-size:13px; font-weight:600; color:var(--t); padding:0; }
  .sp-del { background:none; border:none; color:var(--t4); cursor:pointer; font-size:16px; line-height:1; padding:0 2px; flex-shrink:0; transition:color .15s; }
  .sp-del:hover { color:#ef4444; }
  .add-sp { background:none; border:1.5px dashed var(--border2); border-radius:8px; color:var(--accent); font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700; padding:7px 13px; cursor:pointer; transition:all .15s; }
  .add-sp:hover { border-color:var(--accent); background:var(--al); }
  .pills { display:flex; gap:6px; flex-wrap:wrap; }
  .pill { background:var(--panel); border:1.5px solid var(--border); border-radius:8px; color:var(--t2); font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700; padding:6px 12px; cursor:pointer; transition:all .15s; }
  .pill:hover { border-color:var(--accent); color:var(--accent); }
  .pill.on { background:var(--accent); border-color:var(--accent); color:#fff; }
  .fmt-cards { display:flex; gap:8px; }
  .fmt-card { flex:1; background:var(--panel); border:1.5px solid var(--border); border-radius:10px; padding:11px 7px; text-align:center; cursor:pointer; transition:all .15s; }
  .fmt-card:hover { border-color:var(--accent); }
  .fmt-card.on { background:var(--al); border-color:var(--accent); }
  .fmt-icon { font-size:18px; display:block; margin-bottom:3px; }
  .fmt-lbl { font-size:11px; font-weight:700; color:var(--t2); line-height:1.3; }
  .fmt-card.on .fmt-lbl { color:var(--accent); }
  .divider { height:1.5px; background:var(--border); }
  .gen-btn { width:100%; background:var(--accent); border:none; border-radius:10px; color:#fff; font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; font-weight:800; padding:14px; cursor:pointer; transition:background .15s,transform .1s,opacity .2s; display:flex; align-items:center; justify-content:center; gap:7px; box-shadow:0 2px 10px rgba(37,99,235,.28); }
  .gen-btn:hover:not(:disabled) { background:#1d4ed8; transform:translateY(-1px); box-shadow:0 4px 16px rgba(37,99,235,.32); }
  .gen-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; box-shadow:none; }
  .empty { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:12px; padding:60px 40px; }
  .empty-icon { width:72px; height:72px; border-radius:20px; background:var(--al); border:2px solid var(--am); display:flex; align-items:center; justify-content:center; font-size:28px; margin-bottom:4px; }
  .empty h3 { font-size:22px; font-weight:800; color:var(--t); letter-spacing:-.02em; }
  .empty p { font-size:14px; font-weight:500; color:var(--t3); line-height:1.7; max-width:300px; }
  .loading { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:18px; }
  .spin { width:44px; height:44px; border-radius:50%; border:3px solid var(--border); border-top-color:var(--accent); animation:spin .7s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }
  .loading-title { font-size:16px; font-weight:800; color:var(--t); }
  .lsteps { display:flex; flex-direction:column; gap:7px; width:240px; }
  .lstep { display:flex; gap:9px; align-items:center; font-size:13px; font-weight:600; color:var(--t4); transition:color .3s; }
  .lstep.on { color:var(--accent); }
  .lstep.done { color:var(--green); }
  .lstep-dot { width:6px; height:6px; border-radius:50%; background:currentColor; flex-shrink:0; }
  .result { display:flex; flex-direction:column; gap:14px; animation:fadeUp .35s ease both; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
  .profile-card { background:var(--white); border:1.5px solid var(--border); border-radius:14px; padding:16px 18px; display:flex; align-items:center; gap:13px; box-shadow:0 1px 4px rgba(0,0,0,.05); }
  .avatar { width:48px; height:48px; border-radius:13px; background:var(--accent); display:flex; align-items:center; justify-content:center; font-size:17px; font-weight:800; color:#fff; flex-shrink:0; }
  .p-name { font-size:16px; font-weight:800; color:var(--t); letter-spacing:-.01em; }
  .p-role { font-size:13px; font-weight:600; color:var(--t3); margin-top:2px; }
  .score-num { font-size:30px; font-weight:800; color:var(--green); letter-spacing:-.03em; line-height:1; text-align:right; }
  .score-lbl { font-size:10px; font-weight:700; color:var(--t4); text-transform:uppercase; letter-spacing:.08em; text-align:right; }
  .insights-card { background:var(--white); border:1.5px solid var(--border); border-radius:14px; padding:16px 18px; box-shadow:0 1px 4px rgba(0,0,0,.05); }
  .card-title { font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:.1em; color:var(--t3); margin-bottom:10px; }
  .insight-row { display:flex; gap:9px; padding:7px 0; border-bottom:1px solid var(--border); font-size:13px; font-weight:600; color:var(--t2); line-height:1.5; }
  .insight-row:last-child { border-bottom:none; }
  .i-arr { color:var(--accent); font-weight:800; flex-shrink:0; margin-top:1px; }
  .msg-card { background:var(--white); border:1.5px solid var(--border); border-radius:14px; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,.05); }
  .msg-top { background:var(--al); border-bottom:1.5px solid var(--am); padding:11px 16px; display:flex; align-items:center; justify-content:space-between; }
  .msg-type { font-size:12px; font-weight:800; color:var(--accent); text-transform:uppercase; letter-spacing:.08em; display:flex; align-items:center; gap:5px; }
  .msg-btns { display:flex; gap:6px; }
  .btn-sm { background:var(--white); border:1.5px solid var(--am); border-radius:7px; color:var(--accent); font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700; padding:5px 11px; cursor:pointer; transition:all .15s; }
  .btn-sm:hover { background:var(--accent); color:#fff; border-color:var(--accent); }
  .btn-sm.copied { background:var(--gl); border-color:#86efac; color:var(--green); }
  .msg-subj { padding:9px 16px; border-bottom:1px solid var(--border); font-size:13px; font-weight:600; color:var(--t3); background:#fafaf8; }
  .msg-subj strong { color:var(--t2); }
  .msg-body { padding:18px 16px; font-size:14px; font-weight:500; color:var(--t); line-height:1.9; white-space:pre-wrap; min-height:140px; }
  .msg-footer { padding:9px 16px; border-top:1px solid var(--border); font-size:11px; font-weight:700; color:var(--t4); background:#fafaf8; display:flex; justify-content:space-between; }
  .cwarn { color:var(--amber); }
  .err { background:var(--rl); border:1.5px solid #fecaca; border-radius:12px; padding:14px 16px; font-size:13px; font-weight:600; color:#dc2626; line-height:1.6; }
  @media(max-width:780px) { .workspace { grid-template-columns:1fr; } .left { border-right:none; border-bottom:1.5px solid var(--border); } }
`;

const DEFAULT_SPS = [
  "High autonomy — no endless approvals, no task police, you own your work",
  "100% remote — worldwide candidates welcome",
  "Direct impact on product — you see results immediately",
  "Fast career growth — based on performance, not tenure",
  "Direct access to C-level, zero bureaucracy",
  "AI-first company — everything is automated to the max",
  "Things move fast — no slow corporate cycles",
  "High-impact scope — you'd own and scale global initiatives",
  "Direct influence on strategic partnerships and negotiations",
  "Data-driven, product-focused — your ideas actually ship",
  "Strong learning culture — top courses, budget for growth",
];

const TONES = [
  { id:"professional", ru:"Профессиональный", uk:"Професійний" },
  { id:"friendly",     ru:"Дружелюбный",      uk:"Дружній" },
  { id:"direct",       ru:"Лаконичный",        uk:"Лаконічний" },
  { id:"inspiring",    ru:"Вдохновляющий",     uk:"Надихаючий" },
];

const FORMATS = [
  { id:"inmail",      icon:"💼", ru:"LinkedIn InMail",  uk:"LinkedIn InMail" },
  { id:"connection",  icon:"🤝", ru:"Connection Note",  uk:"Connection Note" },
  { id:"email",       icon:"✉️", ru:"Email",            uk:"Email" },
];

const LANGS = [
  { id:"ru", label:"🇷🇺 Русский" },
  { id:"uk", label:"🇺🇦 Українська" },
  { id:"en", label:"🇬🇧 English" },
  { id:"auto", label:"Авто" },
];

const STEPS_RU = ["Читаю профиль","Нахожу точки пересечения","Подбираю selling points","Пишу сообщение"];
const STEPS_UK = ["Читаю профіль","Знаходжу точки перетину","Добираю selling points","Пишу повідомлення"];

export default function OutreachAI() {
  const [profileText, setProfileText] = useState("");
  const [vacancyRole, setVacancyRole] = useState("");
  const [vacancyCtx,  setVacancyCtx]  = useState("");
  const [sps, setSps] = useState(DEFAULT_SPS);
  const [editingIdx, setEditingIdx] = useState(-1);
  const [tone,   setTone]   = useState("professional");
  const [format, setFormat] = useState("inmail");
  const [lang,   setLang]   = useState("uk");
  const [state,  setState]  = useState("empty");
  const [step,   setStep]   = useState(-1);
  const [result, setResult] = useState(null);
  const [error,  setError]  = useState("");
  const [copied, setCopied] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const isUk = lang === "uk";
  const t = (ru, uk) => isUk ? uk : ru;

  const updateSP = (i, val) => setSps(prev => prev.map((s,j) => j===i ? val : s));
  const removeSP = (i) => { setSps(prev => prev.filter((_,j) => j!==i)); setEditingIdx(-1); };
  const addSP    = () => { setSps(prev => [...prev, ""]); setEditingIdx(sps.length); };
  const commitSP = (i) => { if (!sps[i].trim()) removeSP(i); else setEditingIdx(-1); };

  const runSteps = useCallback(async () => {
    for (let i = 0; i < 4; i++) {
      setStep(i);
      await new Promise(r => setTimeout(r, 800));
    }
  }, []);

  const generate = async () => {
    if (!apiKey.trim()) { alert(isUk ? "Введіть API ключ Claude" : "Введи API ключ Claude"); return; }
    if (!profileText.trim()) { alert(isUk ? "Вставте текст профілю кандидата" : "Вставь текст профиля кандидата"); return; }
    if (!vacancyRole.trim()) { alert(isUk ? "Вкажіть роль / назву вакансії" : "Укажи роль / название вакансии"); return; }
    setState("loading"); setStep(-1); setResult(null); setError("");
    runSteps();
    const fmtMap = { inmail:"LinkedIn InMail (120-160 words)", connection:"LinkedIn Connection Note (strictly under 280 characters)", email:"Email (120-160 words)" };
    const toneMap = { professional:"professional, respectful", friendly:"friendly and warm", direct:"direct and concise", inspiring:"inspiring and motivating" };
    const langInstr = { ru:"Write the message in Russian.", uk:"Write the message in Ukrainian.", en:"Write the message in English.", auto:"Detect the language from the candidate profile and write in that language." };
    const activeSPs = sps.filter(Boolean);
    const prompt = "You are an experienced recruiter. Analyze the candidate profile and write a personalized outreach message.\n\nCANDIDATE PROFILE:\n" + profileText + "\n\nVACANCY: " + vacancyRole + "\n" + (vacancyCtx ? "Details: " + vacancyCtx + "\n" : "") + "\nSELLING POINTS:\n" + (activeSPs.map((s,i)=>(i+1)+". "+s).join("\n") || "not specified") + "\n\nREQUIREMENTS:\n- Format: " + fmtMap[format] + "\n- Tone: " + toneMap[tone] + "\n- " + langInstr[lang] + "\n- Mention 1-2 specific facts from the profile\n- Weave in 2-3 selling points naturally\n- Do NOT start with Hello my name is\n- " + (format==="connection"?"STRICTLY under 280 characters!":"Length: 120-160 words") + "\n\nReturn ONLY valid JSON without markdown:\n{\n  \"candidateName\": \"name\",\n  \"currentRole\": \"title · company\",\n  \"matchScore\": 85,\n  \"keyInsights\": [\"insight 1\",\"insight 2\",\"insight 3\"],\n  \"subject\": \"subject line\",\n  \"message\": \"full message\"\n}";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-5",max_tokens:1000,system:"Return only valid JSON without markdown or extra text.",messages:[{role:"user",content:prompt}]})
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const raw = data.content.map(b=>b.text||"").join("").replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(raw);
      setResult(parsed); setState("result");
    } catch(e) { setError(e.message); setState("error"); }
  };

  const copyMsg = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.message||"").then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); });
  };

  const fmtLabel = FORMATS.find(f=>f.id===format);
  const stepLabels = isUk ? STEPS_UK : STEPS_RU;
  const initials = result ? (result.candidateName||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() : "";
  const msgLen = result?.message?.length||0;
  const wordCount = result?.message?.split(/\s+/).filter(Boolean).length||0;

  return (
    <>
      <style>{STYLE}</style>
      <div className="app">
        <header>
          <div className="logo">Outreach<span>AI</span></div>
          <div className="badge">InMail Generator</div>
        </header>
        <div className="workspace">
          <div className="left">
            <div>
              <div className="stitle">Claude API Key</div>
              <input className="ipt" type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="sk-ant-..." style={{marginBottom:4}} />
              <div className="hint">Ключ хранится только в браузере, никуда не отправляется</div>
            </div>
            <div className="divider" />
            <div>
              <div className="stitle">{t("Профиль кандидата","Профіль кандидата")}</div>
              <textarea rows={8} value={profileText} onChange={e=>setProfileText(e.target.value)} placeholder={t("Скопируй текст профиля из LinkedIn...","Скопіюй текст профілю з LinkedIn...")} />
              <div className={"hint"+(profileText.length>3000?" warn":"")}>{profileText.length} {t("символов","символів")}</div>
            </div>
            <div className="divider" />
            <div>
              <div className="stitle">{t("Вакансия","Вакансія")}</div>
              <input className="ipt" style={{display:"block",marginBottom:8}} value={vacancyRole} onChange={e=>setVacancyRole(e.target.value)} placeholder="Head of Product · Fintech" />
              <textarea rows={3} value={vacancyCtx} onChange={e=>setVacancyCtx(e.target.value)} placeholder={t("О компании...","Про компанію...")} />
            </div>
            <div className="divider" />
            <div>
              <div className="stitle">Selling points</div>
              <div className="sp-tags">
                {sps.map((sp,i)=>(
                  <div key={i} className={"sp-tag"+(editingIdx===i?" editing":"")} onClick={()=>editingIdx!==i&&setEditingIdx(i)}>
                    <div className="sp-num">{i+1}</div>
                    {editingIdx===i ? (
                      <input className="sp-ipt-inline" value={sp} autoFocus onChange={e=>updateSP(i,e.target.value)} onBlur={()=>commitSP(i)} onKeyDown={e=>{if(e.key==="Enter"||e.key==="Escape")commitSP(i);}} placeholder="Selling point..." />
                    ) : (
                      <span className="sp-text">{sp||"Click to edit..."}</span>
                    )}
                    <button className="sp-del" onClick={e=>{e.stopPropagation();removeSP(i);}}>×</button>
                  </div>
                ))}
              </div>
              <button className="add-sp" onClick={addSP}>+ {t("Добавить","Додати")} selling point</button>
            </div>
            <div className="divider" />
            <div>
              <div className="stitle">{t("Тон","Тон")}</div>
              <div className="pills">
                {TONES.map(to=>(
                  <button key={to.id} className={"pill"+(tone===to.id?" on":"")} onClick={()=>setTone(to.id)}>{isUk?to.uk:to.ru}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="stitle">{t("Формат","Формат")}</div>
              <div className="fmt-cards">
                {FORMATS.map(f=>(
                  <div key={f.id} className={"fmt-card"+(format===f.id?" on":"")} onClick={()=>setFormat(f.id)}>
                    <span className="fmt-icon">{f.icon}</span>
                    <div className="fmt-lbl">{isUk?f.uk:f.ru}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="stitle">{t("Язык","Мова")}</div>
              <div className="pills">
                {LANGS.map(l=>(
                  <button key={l.id} className={"pill"+(lang===l.id?" on":"")} onClick={()=>setLang(l.id)}>{l.label}</button>
                ))}
              </div>
            </div>
            <button className="gen-btn" onClick={generate} disabled={state==="loading"}>
              ✦  {t("Сгенерировать сообщение","Згенерувати повідомлення")}
            </button>
          </div>
          <div className="right">
            {state==="empty"&&(
              <div className="empty">
                <div className="empty-icon">✦</div>
                <h3>{t("Готово к работе","Готово до роботи")}</h3>
                <p>{t("Вставь профиль кандидата и получи персональный InMail за секунды.","Вставте профіль кандидата і отримайте персональний InMail за секунди.")}</p>
              </div>
            )}
            {state==="loading"&&(
              <div className="loading">
                <div className="spin" />
                <div className="loading-title">{t("Анализирую кандидата…","Аналізую кандидата…")}</div>
                <div className="lsteps">
                  {stepLabels.map((s,i)=>(
                    <div key={i} className={"lstep"+(step===i?" on":step>i?" done":"")}>
                      <div className="lstep-dot"/>{s}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {state==="error"&&<div className="err">⚠️ {error}</div>}
            {state==="result"&&result&&(
              <div className="result">
                <div className="profile-card">
                  <div className="avatar">{initials}</div>
                  <div style={{flex:1}}>
                    <div className="p-name">{result.candidateName||"Candidate"}</div>
                    <div className="p-role">{result.currentRole||""}</div>
                  </div>
                  <div>
                    <div className="score-num">{result.matchScore||0}%</div>
                    <div className="score-lbl">match</div>
                  </div>
                </div>
                {result.keyInsights?.length>0&&(
                  <div className="insights-card">
                    <div className="card-title">{t("Ключевые инсайты","Ключові інсайти")}</div>
                    {result.keyInsights.map((ins,i)=>(
                      <div key={i} className="insight-row"><span className="i-arr">→</span>{ins}</div>
                    ))}
                  </div>
                )}
                <div className="msg-card">
                  <div className="msg-top">
                    <div className="msg-type">{fmtLabel?.icon} {isUk?fmtLabel?.uk:fmtLabel?.ru}</div>
                    <div className="msg-btns">
                      <button className="btn-sm" onClick={generate}>↻ {t("Переписать","Переписати")}</button>
                      <button className={"btn-sm"+(copied?" copied":"")} onClick={copyMsg}>
                        {copied?"✓ "+t("Скопировано","Скопійовано"):"📋 "+t("Копировать","Копіювати")}
                      </button>
                    </div>
                  </div>
                  {format!=="connection"&&result.subject&&(
                    <div className="msg-subj"><strong>{t("Тема","Тема")}:</strong> {result.subject}</div>
                  )}
                  <div className="msg-body">{result.message}</div>
                  <div className="msg-footer">
                    <span>{isUk?fmtLabel?.uk:fmtLabel?.ru}</span>
                    {format==="connection"
                      ?<span className={msgLen>280?"cwarn":""}>{msgLen}/280 {t("симв.","симв.")}{msgLen>280?" — "+t("превышен!","перевищено!"):""}</span>
                      :<span>{wordCount} {t("слов","слів")}</span>
                    }
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
