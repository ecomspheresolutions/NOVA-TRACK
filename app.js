const data=JSON.parse(localStorage.getItem("novaTrackData")||'{"goals":[],"habits":[],"sessions":[],"timeline":[]}');
const state={view:"dashboard",seconds:1500,running:false,timer:null};

function save(){localStorage.setItem("novaTrackData",JSON.stringify(data))}
function today(){return new Date().toISOString().slice(0,10)}
function timeNow(){return new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
function esc(v){return String(v).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function formatTime(s){return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")}
function log(text){data.timeline.push({date:today(),time:timeNow(),text});save()}
function focusMinutes(date=today()){return data.sessions.filter(s=>s.date===date).reduce((a,s)=>a+(s.minutes||0),0)}
function completedGoals(){return data.goals.filter(g=>g.done).length}
function completedHabitsToday(){return data.habits.filter(h=>h.last===today()).length}
function productivityScore(){
  const focus=Math.min(focusMinutes(),120)/120*50;
  const goals=data.goals.length?completedGoals()/data.goals.length*30:0;
  const habits=data.habits.length?completedHabitsToday()/data.habits.length*20:0;
  return Math.round(focus+goals+habits);
}
function dashboard(){
  const focus=focusMinutes(),done=completedGoals(),streak=Math.max(0,...data.habits.map(h=>h.streak||0)),score=productivityScore();
  const progress=score;
  const entries=data.timeline.filter(x=>x.date===today()).slice(-8).reverse();
  return `<div class="grid">
    <div class="card"><div class="metric-label">FOCUS TODAY</div><div class="metric">${Math.floor(focus/60)}h ${String(focus%60).padStart(2,"0")}m</div><span class="muted">${focus?"Focus time recorded":"Start a focus session"}</span></div>
    <div class="card"><div class="metric-label">GOALS</div><div class="metric">${done} / ${data.goals.length}</div><span class="muted">Completed outcomes</span></div>
    <div class="card"><div class="metric-label">HABIT STREAK</div><div class="metric">${streak} days</div><span class="muted">Best current streak</span></div>
    <div class="card"><div class="metric-label">PRODUCTIVITY</div><div class="metric">${score}/100</div><span class="muted">V1 daily score</span></div>
    <div class="card wide"><h2 class="section-title">Today's timeline</h2><div class="empty">${entries.map(x=>`<div>${esc(x.time)} — ${esc(x.text)}</div>`).join("")||"No activity recorded yet."}</div></div>
    <div class="card wide"><h2 class="section-title">Daily progress</h2><p class="muted">Focus 50% · Goals 30% · Habits 20%</p><div class="bar"><span style="width:${progress}%"></span></div><p class="muted">${score}% productivity score</p></div>
  </div>`
}
function goals(){return `<div class="card"><div class="cards-title"><div><h2 class="section-title">Goals</h2><span class="muted">Create and track outcomes that matter.</span></div><button class="btn" id="add-goal">Add goal</button></div><div class="list">${data.goals.map((g,i)=>`<div class="list-row"><span>${g.done?"✓ ":""}${esc(g.title)}</span><span><button class="btn secondary" data-goal="${i}">${g.done?"Undo":"Done"}</button> <button class="btn secondary" data-delete-goal="${i}">Delete</button></span></div>`).join("")||'<div class="empty">No goals yet. Add your first goal.</div>'}</div></div>`}
function habits(){return `<div class="card"><div class="cards-title"><div><h2 class="section-title">Habits</h2><span class="muted">Build consistency through repeatable actions.</span></div><button class="btn" id="add-habit">Add habit</button></div><div class="list">${data.habits.map((h,i)=>`<div class="list-row"><span>${esc(h.title)} <small class="muted">(${h.streak||0} day streak)</small></span><span><button class="btn secondary" data-habit="${i}">Complete today</button> <button class="btn secondary" data-delete-habit="${i}">Delete</button></span></div>`).join("")||'<div class="empty">No habits yet. Add your first habit.</div>'}</div></div>`}
const views={
 dashboard,goals,habits,
 focus:()=>`<div class="card timer"><div class="metric-label">FOCUS SESSION</div><div class="timer-value" id="timer">${formatTime(state.seconds)}</div><button class="btn" id="timer-btn">${state.running?"Pause":"Start focus"}</button> <button class="btn secondary" id="reset-btn">Reset</button></div>`,
 analytics:()=>`<div class="grid"><div class="card"><div class="metric-label">TODAY'S SCORE</div><div class="metric">${productivityScore()}/100</div></div><div class="card"><div class="metric-label">FOCUS MINUTES</div><div class="metric">${focusMinutes()}</div></div><div class="card"><div class="metric-label">GOALS DONE</div><div class="metric">${completedGoals()}/${data.goals.length}</div></div><div class="card"><div class="metric-label">HABITS DONE</div><div class="metric">${completedHabitsToday()}/${data.habits.length}</div></div><div class="card wide"><h2 class="section-title">How the score works</h2><div class="empty">Focus time contributes up to 50 points. Completed goals contribute up to 30 points. Habits completed today contribute up to 20 points.</div></div></div>`,
 achievements:()=>`<div class="card"><h2 class="section-title">Achievements</h2><div class="empty">${data.sessions.length?"✓ First focus session unlocked":"Complete your first focus session to unlock an achievement."}${completedGoals()?"<br>✓ Goal progress started":""}${Math.max(0,...data.habits.map(h=>h.streak||0))>=3?"<br>✓ 3-day habit streak":""}</div></div>`,
 settings:()=>`<div class="card"><h2 class="section-title">Settings</h2><div class="empty">V1 data is stored locally in this browser.</div></div>`
};
function render(){document.getElementById("view").innerHTML=views[state.view]();document.getElementById("page-title").textContent=state.view[0].toUpperCase()+state.view.slice(1);document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===state.view));bindView()}
function bindView(){
  document.getElementById("add-goal")?.addEventListener("click",()=>{const title=prompt("Goal name:");if(title?.trim()){data.goals.push({title:title.trim(),done:false});log("Created goal: "+title.trim());render()}});
  document.querySelectorAll("[data-goal]").forEach(b=>b.onclick=()=>{const g=data.goals[+b.dataset.goal];g.done=!g.done;log((g.done?"Completed goal: ":"Reopened goal: ")+g.title);render()});
  document.querySelectorAll("[data-delete-goal]").forEach(b=>b.onclick=()=>{const g=data.goals.splice(+b.dataset.deleteGoal,1)[0];log("Deleted goal: "+g.title);render()});
  document.getElementById("add-habit")?.addEventListener("click",()=>{const title=prompt("Habit name:");if(title?.trim()){data.habits.push({title:title.trim(),streak:0,last:null});log("Created habit: "+title.trim());render()}});
  document.querySelectorAll("[data-habit]").forEach(b=>b.onclick=()=>{const h=data.habits[+b.dataset.habit];if(h.last!==today()){h.streak=(h.streak||0)+1;h.last=today();log("Completed habit: "+h.title);render()}else alert("This habit is already completed today.")});
  document.querySelectorAll("[data-delete-habit]").forEach(b=>b.onclick=()=>{const h=data.habits.splice(+b.dataset.deleteHabit,1)[0];log("Deleted habit: "+h.title);render()});
  if(state.view==="focus")bindTimer()
}
function bindTimer(){
  const b=document.getElementById("timer-btn"),r=document.getElementById("reset-btn");
  b.onclick=()=>{if(state.running){clearInterval(state.timer);state.running=false;log("Paused focus session");render();return}state.running=true;log("Started focus session");clearInterval(state.timer);state.timer=setInterval(()=>{if(state.seconds>0){state.seconds--;const el=document.getElementById("timer");if(el)el.textContent=formatTime(state.seconds)}else{clearInterval(state.timer);state.running=false;data.sessions.push({date:today(),minutes:25});log("Completed 25-minute focus session");state.seconds=1500;render()}},1000);render()};
  r.onclick=()=>{clearInterval(state.timer);state.running=false;state.seconds=1500;log("Reset focus session");render()}
}
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>{state.view=b.dataset.view;render()}));
document.getElementById("today").textContent=new Intl.DateTimeFormat(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"}).format(new Date());
render();