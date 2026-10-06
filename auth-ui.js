const modal=document.getElementById("account-modal");
const statusEl=document.getElementById("cloud-status");
const form=document.getElementById("auth-form");
const signOut=document.getElementById("sign-out");
const accountBtn=document.getElementById("account-btn");
async function refreshAccount(){
 const s=await cloudStatus();
 if(!s.configured){statusEl.textContent="Cloud account is not connected yet. Add the Supabase project URL and publishable/anon key to supabase-config.js.";form.classList.add("hidden");signOut.classList.add("hidden");accountBtn.textContent="Account";return}
 if(s.user){statusEl.textContent="Signed in as "+s.user.email;form.classList.add("hidden");signOut.classList.remove("hidden");accountBtn.textContent="Account ✓"}
 else{statusEl.textContent="Supabase is connected. Sign in or create an account.";form.classList.remove("hidden");signOut.classList.add("hidden");accountBtn.textContent="Account"}
}
accountBtn.onclick=function(){modal.classList.remove("hidden");refreshAccount()};
document.getElementById("account-close").onclick=function(){modal.classList.add("hidden")};
modal.addEventListener("click",function(e){if(e.target===modal)modal.classList.add("hidden")});
async function authAction(mode){
 try{
  var email=document.getElementById("auth-email").value.trim(),password=document.getElementById("auth-password").value;
  if(!email||password.length<6)throw new Error("Enter an email and a password with at least 6 characters.");
  var result=mode==="signup"?await cloudSignUp(email,password):await cloudSignIn(email,password);
  if(result.user)await migrateLocalData(result.user);
  await refreshAccount();
  if(window.novaRefreshCloud)await window.novaRefreshCloud();
  alert(mode==="signup"?"Account created. Check your email if confirmation is enabled.":"Signed in successfully.");
 }catch(e){alert(e.message||"Authentication failed.")}
}
document.getElementById("sign-in").onclick=function(){authAction("signin")};
document.getElementById("sign-up").onclick=function(){authAction("signup")};
signOut.onclick=async function(){await cloudSignOut();window.location.reload()};
refreshAccount();