const SUPABASE_READY = Boolean(window.NOVA_SUPABASE_URL && window.NOVA_SUPABASE_ANON_KEY && window.supabase);
const cloud = SUPABASE_READY ? window.supabase.createClient(window.NOVA_SUPABASE_URL, window.NOVA_SUPABASE_ANON_KEY) : null;

async function getUser(){ if(!cloud) return null; const {data}=await cloud.auth.getUser(); return data?.user||null; }

async function cloudSignUp(email,password){
  if(!cloud) throw new Error("Supabase is not configured yet.");
  const {data,error}=await cloud.auth.signUp({email,password});
  if(error) throw error;
  return data;
}
async function cloudSignIn(email,password){
  if(!cloud) throw new Error("Supabase is not configured yet.");
  const {data,error}=await cloud.auth.signInWithPassword({email,password});
  if(error) throw error;
  return data;
}
async function cloudSignOut(){ if(cloud) await cloud.auth.signOut(); }

async function migrateLocalData(user){
  if(!cloud||!user) return;
  const existing=JSON.parse(localStorage.getItem("novaTrackData")||'{"goals":[],"habits":[],"sessions":[],"timeline":[]}');
  const [g,h,f,t]=await Promise.all([
    cloud.from("goals").select("id").eq("user_id",user.id).limit(1),
    cloud.from("habits").select("id").eq("user_id",user.id).limit(1),
    cloud.from("focus_sessions").select("id").eq("user_id",user.id).limit(1),
    cloud.from("timeline_events").select("id").eq("user_id",user.id).limit(1)
  ]);
  const hasCloudData=[g,h,f,t].some(x=>x.data?.length);
  if(hasCloudData) return;
  if(existing.goals.length) await cloud.from("goals").insert(existing.goals.map(x=>({user_id:user.id,title:x.title,done:Boolean(x.done),completed_at:x.done?new Date().toISOString():null})));
  if(existing.habits.length) await cloud.from("habits").insert(existing.habits.map(x=>({user_id:user.id,title:x.title,streak:x.streak||0,last_completed_date:x.last||null})));
  if(existing.sessions.length) await cloud.from("focus_sessions").insert(existing.sessions.map(x=>({user_id:user.id,date:x.date,minutes:x.minutes||25,status:"completed"})));
  if(existing.timeline.length) await cloud.from("timeline_events").insert(existing.timeline.map(x=>({user_id:user.id,date:x.date,time:(x.time||"00:00").slice(0,8),type:"activity",text:x.text,metadata:{}})));
}

async function cloudStatus(){
  const user=await getUser();
  return {configured:SUPABASE_READY,user};
}
