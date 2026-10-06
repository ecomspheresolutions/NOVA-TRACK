const SUPABASE_READY=Boolean(window.NOVA_SUPABASE_URL&&window.NOVA_SUPABASE_ANON_KEY&&window.supabase);
const cloud=SUPABASE_READY?window.supabase.createClient(window.NOVA_SUPABASE_URL,window.NOVA_SUPABASE_ANON_KEY):null;

async function getUser(){if(!cloud)return null;const{data,error}=await cloud.auth.getUser();if(error)throw error;return data?.user||null}
async function cloudSignUp(email,password){if(!cloud)throw new Error("Supabase is not configured yet.");const{data,error}=await cloud.auth.signUp({email,password});if(error)throw error;return data}
async function cloudSignIn(email,password){if(!cloud)throw new Error("Supabase is not configured yet.");const{data,error}=await cloud.auth.signInWithPassword({email,password});if(error)throw error;return data}
async function cloudSignOut(){if(cloud)await cloud.auth.signOut()}

async function migrateLocalData(user){
 if(!cloud||!user)return;
 const existing=JSON.parse(localStorage.getItem("novaTrackData")||'{"goals":[],"habits":[],"sessions":[],"timeline":[]}');
 const checks=await Promise.all(["goals","habits","focus_sessions","timeline_events"].map(t=>cloud.from(t).select("id").eq("user_id",user.id).limit(1)));
 if(checks.some(x=>x.error))throw checks.find(x=>x.error).error;
 if(checks.some(x=>x.data?.length))return false;
 if(existing.goals.length)await cloud.from("goals").insert(existing.goals.map(x=>({user_id:user.id,title:x.title,done:Boolean(x.done),completed_at:x.done?new Date().toISOString():null})));
 if(existing.habits.length)await cloud.from("habits").insert(existing.habits.map(x=>({user_id:user.id,title:x.title,streak:x.streak||0,last_completed_date:x.last||null})));
 if(existing.sessions.length)await cloud.from("focus_sessions").insert(existing.sessions.map(x=>({user_id:user.id,date:x.date,minutes:x.minutes||25,status:"completed"})));
 if(existing.timeline.length)await cloud.from("timeline_events").insert(existing.timeline.map(x=>({user_id:user.id,date:x.date,time:(x.time||"00:00").slice(0,8),type:"activity",text:x.text,metadata:{}})));
 return true;
}

async function loadCloudData(user){
 if(!cloud||!user)return null;
 const [g,h,s,t]=await Promise.all([
  cloud.from("goals").select("id,title,done,created_at,completed_at").eq("user_id",user.id).order("created_at"),
  cloud.from("habits").select("id,title,streak,last_completed_date,created_at").eq("user_id",user.id).order("created_at"),
  cloud.from("focus_sessions").select("id,date,started_at,completed_at,minutes,status").eq("user_id",user.id).order("date"),
  cloud.from("timeline_events").select("id,date,time,type,text,metadata").eq("user_id",user.id).order("date").order("time")
 ]);
 const first=[g,h,s,t].find(x=>x.error);if(first)throw first.error;
 return {
  goals:g.data.map(x=>({id:x.id,title:x.title,done:x.done,createdAt:x.created_at,completedAt:x.completed_at})),
  habits:h.data.map(x=>({id:x.id,title:x.title,streak:x.streak,last:x.last_completed_date,createdAt:x.created_at})),
  sessions:s.data.map(x=>({id:x.id,date:x.date,minutes:x.minutes,status:x.status,startedAt:x.started_at,completedAt:x.completed_at})),
  timeline:t.data.map(x=>({id:x.id,date:x.date,time:x.time,text:x.text,type:x.type,metadata:x.metadata}))
 };
}

async function cloudInsert(table,row){if(!cloud)return null;const user=await getUser();if(!user)return null;const{data,error}=await cloud.from(table).insert({...row,user_id:user.id}).select().single();if(error)throw error;return data}
async function cloudUpdate(table,id,changes){if(!cloud)return null;const user=await getUser();if(!user)return null;const{data,error}=await cloud.from(table).update(changes).eq("id",id).eq("user_id",user.id).select().single();if(error)throw error;return data}
async function cloudDelete(table,id){if(!cloud)return null;const user=await getUser();if(!user)return null;const{error}=await cloud.from(table).delete().eq("id",id).eq("user_id",user.id);if(error)throw error}

async function cloudStatus(){const user=await getUser();return{configured:SUPABASE_READY,user}}
