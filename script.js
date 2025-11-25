// ===== Terminal of 25 Confessions — NEON PURPLE Romantic UPGRADE ===== //
// Features:
// - Neon purple romantic theme (auto-injected CSS)
// - Soft typing sound + success chime (WebAudio; toggleable)
// - Hidden easter eggs (secret commands)
// - ASCII animations & moving heart
// - Better ZIP structure (/Confessions, /Extras/hints.txt, /message.txt)
// - Confession unlock animation (progress bar) and unlocking chaining
// - Title screen animation on load
// - "iloveyou" mode: glowing heart + special reveal
// - Commands: help, about, decrypt, show_confessions, hint, zip/download_zip, thanks, iloveyou, theme, sound, motivate, art, secret ones...

/* ----------------- CONFIG & UI HOOKS ----------------- */
const output = document.getElementById('output');
const input = document.getElementById('input');
const tpl = document.getElementById('tpl-line'); // optional template for echoing command

/* ----------------- INJECT THEME CSS ----------------- */
(function injectCSS(){
  const css = `
  :root{
    --bg:#0b0010;
    --panel:#0f0018;
    --neon:#b57cff; /* neon purple */
    --muted:#cbbde6;
    --accent:#ff9cd6;
    --success:#9ef7c1;
    --error:#ff7f9b;
    --mono: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  }
  body { background: linear-gradient(180deg, #050007, var(--bg)); color:var(--muted); font-family:var(--mono); }
  #terminal { background: radial-gradient(ellipse at top left, rgba(181,124,255,0.06), transparent), var(--panel); border: 1px solid rgba(181,124,255,0.12); box-shadow: 0 10px 30px rgba(11,0,16,0.7); padding:16px; border-radius:12px; }
  .line{ white-space:pre-wrap; margin:6px 0; font-size:14px; line-height:1.35;}
  .cmdline{ color:var(--neon); }
  .small{ color:#b9a7d9; font-size:13px; }
  .success{ color:var(--success); font-weight:600; }
  .error{ color:var(--error); font-weight:600; }
  .glow { text-shadow: 0 0 12px rgba(181,124,255,0.42), 0 0 30px rgba(255,156,214,0.06); color:var(--accent); }
  .neon-heart { font-size:28px; filter: drop-shadow(0 4px 16px rgba(181,124,255,0.18)); color:var(--accent); text-align:center; }
  .progress-bar { width: 100%; height: 10px; background: rgba(255,255,255,0.03); border-radius: 6px; overflow: hidden; margin:6px 0; }
  .progress-fill { height: 100%; width: 0%; background: linear-gradient(90deg, var(--neon), var(--accent)); transition: width 150ms linear; }
  .title { font-weight:700; font-size:16px; color:var(--neon); margin-bottom:6px; }
  .muted { color: #9f8fbf; }
  input#input { background: transparent; border: none; outline: none; color:var(--muted); width:100%; font-family:var(--mono); font-size:14px; }
  /* small responsive */
  @media (max-width:520px){ .line{ font-size:13px } .neon-heart{ font-size:22px } }
  `;
  const s = document.createElement('style');
  s.innerText = css;
  document.head.appendChild(s);
})();

/* ----------------- SOUNDS (WebAudio) ----------------- */
const audioState = {
  enabled: localStorage.getItem('terminal_sound') !== 'off' // default on
};
const audioCtx = (typeof AudioContext !== 'undefined') ? new AudioContext() : null;

function playSoftClick(){
  if(!audioState.enabled || !audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = 'sine';
  o.frequency.value = 950 + Math.random()*80;
  g.gain.value = 0.0025;
  o.connect(g); g.connect(audioCtx.destination);
  o.start();
  o.frequency.exponentialRampToValueAtTime(1600, audioCtx.currentTime + 0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);
  o.stop(audioCtx.currentTime + 0.14);
}

function playChime(){
  if(!audioState.enabled || !audioCtx) return;
  const now = audioCtx.currentTime;
  const o1 = audioCtx.createOscillator();
  const o2 = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o1.type = 'sine'; o2.type = 'sine';
  o1.frequency.value = 720; o2.frequency.value = 1080;
  g.gain.value = 0.0008;
  o1.connect(g); o2.connect(g); g.connect(audioCtx.destination);
  o1.start(now); o2.start(now);
  g.gain.linearRampToValueAtTime(0.0012, now + 0.06);
  g.gain.linearRampToValueAtTime(0.00001, now + 0.5);
  o1.stop(now + 0.6); o2.stop(now + 0.6);
}

/* ----------------- CONFESSIONS ----------------- */
const confessions = {
  "Confession_1":"As you step into another year, I want you to know this… you are the part of my life I’m most grateful for.",
  "Confession_2":"I may not tell you every day that you mean the world to me… but you do.",
  "Confession_3":"Sometimes I pause and think about how lucky I am… that our paths crossed the way they did.",
  "Confession_4":"Every day, in small ways, you remind me why you matter so much to me.",
  "Confession_5":"I still remember our first kiss…\n30th April 2024 will always be one of the most special memories of us.",
  "Confession_6":"And that little pillow fight on my bed…\nit became even more memorable because of how you laughed when my roll-on fragrance got mixed into the moment.",
  "Confession_7":"The way you came closer every time we met…\nit did something to me.\nAnd on 19th July, without even realizing it,\nI let myself feel you more deeply than ever before.",
  "Confession_8":"You don’t even realize how effortlessly you make me melt when you’re close.",
  "Confession_9":"When you lean in a little too close…\nmy thoughts stop working for a moment.",
  "Confession_10":"The closer you get, the softer I become… it’s a side of me only you bring out.",
  "Confession_11":"There’s something about the way you come close… it’s like my whole body already knows you’re about to touch me.",
  "Confession_12":"There are moments when you’re close… and I swear you feel exactly where my mind goes.",
  "Confession_13":"I remember the exact moment you started to mean more than ‘someone’… it still feels like yesterday.",
  "Confession_14":"Sometimes I think about our old moments… and it hits me how naturally everything fell into place with you.",
  "Confession_15":"I know I’m not perfect, but I honestly try my best with you… because you matter to me more than I show.",
  "Confession_16":"Sometimes I’m scared of losing what we have… not because it’s fragile, but because it's precious to me.",
  "Confession_17":"I don’t always say it, but your presence makes life feel a little easier… a little softer.",
  "Confession_18":"I don’t want to admit it, but yes… I like when you talk dirty or say things that aren’t innocent at all.",
  "Confession_19":"I’m sorry for the wrong decisions I made… I never meant to hurt you, even for a second.",
  "Confession_20":"I like how you scold me sometimes… not angrily, just in that tone where I know you actually care.",
  "Confession_21":"You bring out a version of me I actually like… calmer, softer, and a little more real.",
  "Confession_22":"No matter how my day goes, talking to you always makes it feel a bit better.",
  "Confession_23":"I don’t say it often, but I genuinely appreciate how you stay… even when I’m not the easiest person.",
  "Confession_24":"I like how you spoil me, care for me, treat me with love, stay active for dirty talks but still bring me food and small things… I love all of it.",
  "Confession_25":"I love you truly, and wanna be with you forever, as your special one with whom you can be soft, vulnerable, and honest."
};

/* ----------------- HINTS / EXTRAS ----------------- */
const hints = {
  "Confession_1":"It’s your wish for us.",
  "Confession_5":"A memory tied to 30th April.",
  "Confession_7":"A moment when things shifted."
};

const extras = {
  "message.txt":"This ZIP contains 25 confessions made with love. Open them slowly. 💜",
  "hints.txt": Object.entries(hints).map(([k,v])=>`${k}: ${v}`).join("\n")
};

/* ----------------- HELPERS (printing + typing + progress) ----------------- */
let isPrinting = false;

function appendNode(node){
  output.appendChild(node);
  output.scrollTop = output.scrollHeight;
}

function echoCmd(cmd){
  // use template if present
  let node;
  if(tpl && tpl.content){
    node = tpl.content.cloneNode(true);
    const el = node.querySelector('.cmdline');
    if(el) el.textContent = cmd;
    output.appendChild(node);
  } else {
    node = document.createElement('div'); node.className='line cmdline'; node.textContent = '> '+cmd;
    appendNode(node);
  }
}

/* typing printer plays soft clicks per char, but keeps it soft */
function printLineTyped(text, cls, speed = 18){
  return new Promise(async (resolve)=>{
    isPrinting = true;
    const node = document.createElement('div');
    node.className = 'line';
    if(cls) node.classList.add(cls);
    appendNode(node);

    let i = 0;
    // small throttling so long lines don't blow up sound
    const playEvery = 2 + Math.floor(Math.random()*3);

    function step(){
      const chunk = text.slice(i, i+1);
      node.textContent += chunk;
      i++;
      if(i % playEvery === 0) playSoftClick();
      output.scrollTop = output.scrollHeight;
      if(i < text.length){
        setTimeout(step, speed + Math.random()*8);
      } else {
        isPrinting = false;
        resolve();
        // small success chime if class success
        if(cls === 'success') setTimeout(()=>playChime(), 80);
      }
    }
    step();
  });
}

async function printLine(text, cls){
  // if text includes newlines, split to lines and type each with slight delay
  const parts = String(text).split('\n');
  for(let i=0;i<parts.length;i++){
    await printLineTyped(parts[i], cls);
    if(i < parts.length-1) await new Promise(r=>setTimeout(r,120));
  }
}

/* Progress bar for unlocking animation */
function showProgressBar(duration = 1600){
  return new Promise(resolve=>{
    const wrapper = document.createElement('div'); wrapper.className='progress-bar';
    const fill = document.createElement('div'); fill.className='progress-fill';
    wrapper.appendChild(fill);
    appendNode(wrapper);
    const start = Date.now();
    const t = setInterval(()=>{
      const pct = Math.min(100, ((Date.now()-start)/duration)*100);
      fill.style.width = pct + '%';
      if(pct >= 100){ clearInterval(t); resolve(); }
    }, 60);
  });
}

/* ----------------- EASTER EGGS ----------------- */
const easterEggs = {
  'love': ()=>{ printLine("You found a secret: I kept all my best lines for you.", "glow"); },
  'secret': ()=>{ printLine("shh… the best confessions hide in silence.", "small"); },
  'memory': ()=>{ printLine("A tiny memory: 30/04/2024 — a kiss, a laugh, a forever.", "small"); },
  'heart': ()=>{ showAsciiHeart(); }
};

/* ----------------- ASCII / ART ----------------- */
function showAsciiHeart(){
  const art = [
    "  .:::.   .:::.  ",
    " :::::::.::::::: ",
    " ::::::::::::::: ",
    " ':::::::::::::' ",
    "   ':::::::::'   ",
    "     ':::::'     ",
    "       ':'       "
  ];
  art.forEach(line=> printLine(line, 'neon-heart'));
}

/* floating heart animation for iloveyou mode */
async function iloveyouMode(){
  printLine("Entering I LOVE YOU mode...", "glow");
  // small ASCII animation
  for(let i=0;i<4;i++){
    printLine("   💜   ", 'neon-heart'); await new Promise(r=>setTimeout(r,220));
    printLine("  💜💜  ", 'neon-heart'); await new Promise(r=>setTimeout(r,220));
    printLine(" 💜💜💜 ", 'neon-heart'); await new Promise(r=>setTimeout(r,220));
  }
  await printLine("I love you truly — always.", "success");
  playChime();
}

/* ----------------- ZIP (better structure) ----------------- */
async function cmd_create_zip(){
  printLine("Preparing structured ZIP file...", "small");
  const zip = new JSZip();

  const confFolder = zip.folder("Confessions");
  for(const [key,value] of Object.entries(confessions)){
    confFolder.file(`${key}.txt`, value);
  }

  const extrasFolder = zip.folder("Extras");
  extrasFolder.file("hints.txt", extras.hints.txt || extras["hints.txt"]);
  zip.file("message.txt", extras["message.txt"]);

  const blob = await zip.generateAsync({ type: "blob" });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = "terminal_25_confessions_structured.zip";
  a.click();

  printLine("ZIP downloaded: terminal_25_confessions_structured.zip", "success");
}

/* ----------------- COMMANDS ----------------- */

function cmd_help(){
  printLine("Available commands:");
  printLine(" help                 - show help");
  printLine(" about                - about this terminal");
  printLine(" decrypt <id>         - read a confession (e.g., decrypt Confession_1)");
  printLine(" show_confessions     - list confession lock status");
  printLine(" hint <id>            - show a hint for a confession");
  printLine(" zip / download_zip   - download structured ZIP (Confessions + Extras)");
  printLine(" thanks               - birthday flow");
  printLine(" iloveyou             - secret romantic mode");
  printLine(" theme neon_purple    - apply neon purple romantic theme");
  printLine(" sound on/off         - toggle sounds");
  printLine(" motivate             - gentle motivational line");
  printLine(" art                  - display ASCII heart");
  printLine(" secret commands: love, secret, memory, heart");
}

function cmd_about(){
  printLine("Terminal Of 25 Confessions — Neon Purple edition. Built with care.");
}

function cmd_show_confessions(){
  for(const k of Object.keys(confessions)){
    const n = k.split("_")[1];
    const unlocked = localStorage.getItem('unlocked_'+n) === '1' ? 'unlocked' : 'locked';
    printLine(`${k} → ${unlocked}`);
  }
}

/* Confession decrypt with unlock animation + chaining */
async function cmd_decrypt(raw){
  if(!raw){ printLine("Usage: decrypt <Confession_X>", "error"); return; }
  const id = raw.trim();
  if(!(id in confessions)){ printLine("No message with id: " + id, "error"); return; }
  const n = id.split("_")[1];

  if(localStorage.getItem('unlocked_'+n) !== '1'){
    // locked — show gentle message
    printLine("That confession is locked. Try earlier confessions first.", "error");
    return;
  }

  // show unlocking animation for this confession (even if unlocked — ephemeral reveal)
  printLine(`Decrypting ${id}...`, "small");
  await showProgressBar(900 + Math.random()*700);
  await printLine("Decrypted ("+id+"):", "title");
  await printLine(confessions[id], "success");

  // unlock next with chain animation
  const next = Number(n) + 1;
  if(confessions['Confession_'+next] && localStorage.getItem('unlocked_'+next) !== '1'){
    printLine(`Unlocking Confession_${next}...`);
    await showProgressBar(900);
    localStorage.setItem('unlocked_'+next, '1');
    printLine(`Confession_${next} unlocked.`, "small");
    playChime();
  }
}

/* Hint command */
function cmd_hint(id){
  if(!id){ printLine("Usage: hint <Confession_X>", "small"); return; }
  if(hints[id]) printLine("Hint: "+hints[id], "small");
  else printLine("No hint found for: "+id, "small");
}

/* Birthday flow (thanks) */
function start_birthday_flow(){
  printLine("Happy Birthday! 🎉", "glow");
  printLine("A private gift: 25 confessions written for you.", "small");
  if(localStorage.getItem('unlocked_1') !== '1'){
    printLine('To unlock Confession_1, answer this:');
    printLine('"What do you wish for us?"');
    localStorage.setItem('awaiting_first_answer','1');
  } else {
    printLine("Confession_1 already unlocked. Type: decrypt Confession_1");
  }
}

/* More small utilities */
const niceLines = [
  "You’re doing better than you think.",
  "Someone out there is proud of you.",
  "You matter more than you know.",
  "The world is softer because of you."
];

function cmd_motivate(){ printLine(niceLines[Math.floor(Math.random()*niceLines.length)], "success"); }

/* ASCII art quick */
function cmd_art(){ showAsciiHeart(); }

/* Sound toggle */
function cmd_sound(arg){
  if(arg === 'on'){ audioState.enabled = true; localStorage.setItem('terminal_sound','on'); printLine("Sound enabled.", "small"); }
  else if(arg === 'off'){ audioState.enabled = false; localStorage.setItem('terminal_sound','off'); printLine("Sound disabled.", "small"); }
  else printLine("Usage: sound on | sound off", "small");
}

/* theme set */
function cmd_theme(name){
  if(name === 'neon_purple'){ printLine("Neon purple romantic theme active.", "small"); /* CSS already injected */ }
  else printLine("Unknown theme. Try: theme neon_purple", "small");
}

/* ----------------- PROCESS COMMAND ----------------- */
async function processCommand(line){
  if(!line || !line.trim()) return;
  echoCmd(line);
  // fulfill pending birthday input
  if(localStorage.getItem('awaiting_first_answer') === '1'){
    const answer = line.trim();
    if(answer.length > 0){
      localStorage.setItem('first_answer', answer);
      localStorage.setItem('unlocked_1','1');
      localStorage.removeItem('awaiting_first_answer');
      await printLine("Your answer has been saved. Confession_1 unlocked.", "success");
      playChime();
      return;
    } else {
      await printLine("Please type something to unlock.", "small");
      return;
    }
  }

  const parts = line.trim().split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  // Easter eggs quick dispatch
  if(easterEggs[cmd]){ easterEggs[cmd](); return; }

  switch(cmd){
    case "help": cmd_help(); break;
    case "about": cmd_about(); break;
    case "decrypt": await cmd_decrypt(args.join("_") || args[0]); break;
    case "show_confessions": cmd_show_confessions(); break;
    case "hint": cmd_hint(args.join("_") || args[0]); break;
    case "zip":
    case "download_zip": await cmd_create_zip(); break;
    case "thanks": start_birthday_flow(); break;
    case "iloveyou": await iloveyouMode(); break;
    case "motivate": cmd_motivate(); break;
    case "art": cmd_art(); break;
    case "sound": cmd_sound(args[0]); break;
    case "theme": cmd_theme(args[0]); break;
    case "clear": output.innerHTML = ''; break;
    default: printLine("Command not found. Type help.", "error");
  }
}

/* ----------------- KEYBIND & INIT (title animation) ----------------- */

input.addEventListener('keydown', async (e)=>{
  if(e.key === 'Enter'){
    const val = input.value;
    input.value = '';
    await processCommand(val);
  } else if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'){
    // clear quick
    output.innerHTML=''; await printLine("Cleared.");
  }
});

/* Title screen animation & initial hints */
async function titleAnimation(){
  // quick "boot" sequence
  await printLine("Initializing terminal...", "muted");
  await new Promise(r=>setTimeout(r,250));
  await printLine("Loading emotions...", "muted");
  await new Promise(r=>setTimeout(r,350));
  await printLine("Warming heart memory...", "muted");
  await new Promise(r=>setTimeout(r,420));
  await printLine("Ready. Type 'help' to begin.", "title");
  // gentle heart hint
  printLine("Tip: type 'thanks' to start birthday flow.", "small");
  playChime();
}

/* On load */
window.addEventListener('load', async ()=>{
  // focus input
  if(input) input.focus();
  // ensure first-run state: keep confessions locked except unlocked keys
  // (do not auto-unlock anything)
  await titleAnimation();
});

/* expose quick helper to window for debugging if needed */
window._terminal = {
  confessions,
  unlockAll: ()=>{
    for(const k of Object.keys(confessions)){
      const n = k.split("_")[1];
      localStorage.setItem('unlocked_'+n,'1');
    }
    printLine("All confessions unlocked (dev).", "small");
  },
  lockAll: ()=>{
    for(const k of Object.keys(confessions)){
      const n = k.split("_")[1];
      localStorage.removeItem('unlocked_'+n);
    }
    printLine("All confessions locked (dev).", "small");
  }
};
