// Terminal Of 25 Confessions - script.js
const output = document.getElementById('output');
const input = document.getElementById('input');
const tpl = document.getElementById('tpl-line');

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
  "Confession_16":"Sometimes I’m scared of losing what we have… not because it’s fragile, but because it’s precious to me.",
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

// helpers
function printLine(text, cls){
  const node = document.createElement('div');
  node.className = 'line';
  if(cls) node.classList.add(cls);
  node.textContent = text;
  output.appendChild(node);
  output.scrollTop = output.scrollHeight;
}
function echoCmd(cmd){
  const node = tpl.content.cloneNode(true);
  node.querySelector('.cmdline').textContent = cmd;
  output.appendChild(node);
  output.scrollTop = output.scrollHeight;
}

// commands
function cmd_help(){
  printLine("Available commands:");
  printLine(" help                 - show this help");
  printLine(" about                - about this terminal");
  printLine(" decrypt <id>         - read a confession (e.g., decrypt Confession_1)");
  printLine(" show_confessions     - list confession status (locked/unlocked)");
  printLine(" hint <id>            - show a hint for a confession");
  printLine(" gift                 - special gift message");
  printLine(" run surprise         - run a tiny animation");
  printLine(" clear                - clear the terminal");
  printLine(" thanks               - show birthday note and begin");
}
function cmd_about(){
  printLine("Terminal Of 25 Confessions — made with care and love.");
  printLine("Built for a private, intimate experience.");
}
function cmd_show_confessions(){
  for(const k of Object.keys(confessions)){
    const n = k.split("_")[1];
    const unlocked = localStorage.getItem('unlocked_'+n) === '1' ? 'unlocked' : 'locked';
    printLine(k + " → " + unlocked);
  }
}
function cmd_decrypt(raw){
  if(!raw){ printLine("Usage: decrypt <Confession_X>", "error"); return; }
  const id = raw.trim();
  if(!(id in confessions)){ printLine("No message with id: " + id, "error"); return; }
  const n = id.split("_")[1];
  if(localStorage.getItem('unlocked_'+n) !== '1'){ printLine("That confession is locked. Try earlier confessions first.", "error"); return; }
  printLine("Decrypted ("+id+"):"); printLine(confessions[id], "success");
  // unlock next
  const next = Number(n) + 1;
  if(confessions['Confession_'+next]){ localStorage.setItem('unlocked_'+next, '1'); printLine("Confession_"+next+" has been unlocked.", "small"); }
}
const hints = {
  "Confession_1":"Answer honestly — it is your wish for us.",
  "Confession_5":"A memory tied to a special date.",
  "Confession_7":"Think of the day things shifted between you."
};
function cmd_hint(id){ if(!id){ printLine("Usage: hint <Confession_X>", "small"); return; } if(hints[id]) printLine("Hint: "+hints[id], "small"); else printLine("No hint found for: "+id, "small"); }
function cmd_gift(){ printLine("Gift unlocked, now check your wallet.", "success"); }
function cmd_run_surprise(){ printLine("Running surprise..."); const anim=["[=     ]","[==    ]","[====  ]","[======]","[ DONE ]"]; let i=0; const t=setInterval(()=>{ if(i>4){ clearInterval(t); printLine("Surprise complete.","success"); return; } printLine(anim[i]); i++; },300); }

// birthday flow
function start_birthday_flow(){
  printLine("Happy Birthday! 🎉");
  printLine("This is my small, private gift — a journey through 25 confessions.", "small");
  if(localStorage.getItem('unlocked_1') !== '1'){
    printLine('To unlock my first confession to you, answer this:');
    printLine('"What do you wish for us?"');
    localStorage.setItem('awaiting_first_answer', '1');
  } else {
    printLine("Confession_1 is already unlocked on this device. Type decrypt Confession_1 to read it.");
  }
}

// process input
function processCommand(line){
  if(!line || !line.trim()) return;
  echoCmd(line);
  const parts = line.trim().split(/\\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  if(localStorage.getItem('awaiting_first_answer') === '1'){
    const answer = line.trim();
    if(answer.length>0){
      localStorage.setItem('first_answer', answer);
      localStorage.setItem('unlocked_1','1');
      localStorage.removeItem('awaiting_first_answer');
      printLine("Your answer has been saved.", "success");
      printLine("My confession is now unlocked for you.", "success");
      printLine("Type: decrypt Confession_1", "small");
      return;
    } else {
      printLine("Please type something to unlock.", "small");
      return;
    }
  }

  switch(cmd){
    case "help": cmd_help(); break;
    case "about": cmd_about(); break;
    case "decrypt": cmd_decrypt(args.join("_") || args[0]); break;
    case "show_confessions": cmd_show_confessions(); break;
    case "hint": cmd_hint(args.join("_") || args[0]); break;
    case "gift": cmd_gift(); break;
    case "run": if(args[0]==="surprise") cmd_run_surprise(); else printLine("Unknown run target", "error"); break;
    case "clear": output.innerHTML=""; printLine("Cleared."); break;
    case "thanks": start_birthday_flow(); break;
    case "whoami": printLine("You are loved."); break;
    default: printLine("Command not found. Type help.", "error");
  }
}

// keyboard handler
input.addEventListener('keydown', (e)=>{ if(e.key === 'Enter'){ const val = input.value; processCommand(val); input.value = ''; } else if(e.key === 'c' && (e.ctrlKey || e.metaKey)){ input.value = ''; } });
window.addEventListener('load', ()=>{ input.focus(); printLine("Type 'help' to see available commands.", "small"); });
