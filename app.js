// Values are illustrative reference estimates per selected serving.
// Recipe values vary; users should prefer verified recipe or package data when available.
const foods = [
  {id:"idli",name:"Idli",serving:"1 medium piece",unit:"piece",amount:1,mg:55,category:"South Indian breakfast"},
  {id:"dosa",name:"Plain dosa",serving:"1 medium dosa",unit:"dosa",amount:1,mg:90,category:"South Indian breakfast"},
  {id:"rava-dosa",name:"Rava dosa",serving:"1 medium dosa",unit:"dosa",amount:1,mg:105,category:"South Indian breakfast"},
  {id:"uthappam",name:"Vegetable uthappam",serving:"1 medium uthappam",unit:"piece",amount:1,mg:180,category:"South Indian breakfast"},
  {id:"pongal",name:"Ven pongal",serving:"1 cup",unit:"cup",amount:1,mg:180,category:"South Indian breakfast"},
  {id:"paniyaram",name:"Kuzhi paniyaram",serving:"2 pieces",unit:"2 pieces",amount:1,mg:95,category:"South Indian breakfast"},
  {id:"sambar",name:"Sambar",serving:"1 cup",unit:"cup",amount:1,mg:350,category:"South Indian sides"},
  {id:"rasam",name:"Rasam",serving:"1 cup",unit:"cup",amount:1,mg:180,category:"South Indian sides"},
  {id:"coconut-chutney",name:"Coconut chutney",serving:"2 tbsp",unit:"2 tbsp",amount:1,mg:85,category:"South Indian sides"},
  {id:"tomato-chutney",name:"Tomato chutney",serving:"2 tbsp",unit:"2 tbsp",amount:1,mg:70,category:"South Indian sides"},
  {id:"curd-rice",name:"Curd rice",serving:"1 cup",unit:"cup",amount:1,mg:180,category:"Rice dishes"},
  {id:"lemon-rice",name:"Lemon rice",serving:"1 cup",unit:"cup",amount:1,mg:160,category:"Rice dishes"},
  {id:"tomato-rice",name:"Tomato rice",serving:"1 cup",unit:"cup",amount:1,mg:230,category:"Rice dishes"},
  {id:"veg-pulao",name:"Vegetable pulao",serving:"1 cup",unit:"cup",amount:1,mg:220,category:"Rice dishes"},
  {id:"white-rice",name:"Cooked white rice",serving:"1 cup",unit:"cup",amount:1,mg:55,category:"Rice dishes"},
  {id:"banana",name:"Banana",serving:"1 medium banana",unit:"piece",amount:1,mg:422,category:"Fruits"},
  {id:"apple",name:"Apple",serving:"1 medium apple",unit:"piece",amount:1,mg:195,category:"Fruits"},
  {id:"orange",name:"Orange",serving:"1 medium orange",unit:"piece",amount:1,mg:237,category:"Fruits"},
  {id:"papaya",name:"Papaya",serving:"1 cup cubes",unit:"cup",amount:1,mg:264,category:"Fruits"},
  {id:"guava",name:"Guava",serving:"1 medium guava",unit:"piece",amount:1,mg:250,category:"Fruits"},
  {id:"potato",name:"Boiled potato",serving:"100 g",unit:"100 g",amount:1,mg:379,category:"Vegetables"},
  {id:"tomato",name:"Tomato",serving:"1 medium tomato",unit:"piece",amount:1,mg:292,category:"Vegetables"},
  {id:"spinach",name:"Cooked spinach",serving:"½ cup",unit:"½ cup",amount:1,mg:420,category:"Vegetables"},
  {id:"carrot",name:"Carrot",serving:"1 medium carrot",unit:"piece",amount:1,mg:195,category:"Vegetables"},
  {id:"dal",name:"Cooked toor dal",serving:"½ cup",unit:"½ cup",amount:1,mg:260,category:"Pulses"},
  {id:"chickpeas",name:"Cooked chickpeas",serving:"½ cup",unit:"½ cup",amount:1,mg:240,category:"Pulses"},
  {id:"milk",name:"Cow's milk",serving:"1 cup (240 ml)",unit:"cup",amount:1,mg:360,category:"Dairy"},
  {id:"yogurt",name:"Plain yogurt/curd",serving:"1 cup",unit:"cup",amount:1,mg:380,category:"Dairy"},
  {id:"egg",name:"Boiled egg",serving:"1 large egg",unit:"piece",amount:1,mg:63,category:"Other foods"},
  {id:"chicken",name:"Cooked chicken",serving:"100 g",unit:"100 g",amount:1,mg:256,category:"Other foods"}
];

const STORAGE_KEY = "kPotassiumTrackerEntriesV1";
const CUSTOM_FOODS_KEY = "kPotassiumTrackerCustomFoodsV1";
const $ = (id) => document.getElementById(id);
const todayISO = () => {
  const d = new Date(); const local = new Date(d.getTime()-d.getTimezoneOffset()*60000);
  return local.toISOString().slice(0,10);
};
let entries = loadEntries();
let customFoods = loadCustomFoods();
function loadCustomFoods(){try{const a=JSON.parse(localStorage.getItem(CUSTOM_FOODS_KEY)||"[]");return Array.isArray(a)?a:[]}catch{return [];}}
function saveCustomFoods(){localStorage.setItem(CUSTOM_FOODS_KEY,JSON.stringify(customFoods));}
function allFoods(){return foods.concat(customFoods);}

const BP_KEY="kPotassiumTrackerBPV1", SUGAR_KEY="kPotassiumTrackerSugarV1", FLUID_KEY="kPotassiumTrackerFluidV1";
let bpReadings=loadHealthList(BP_KEY), sugarReadings=loadHealthList(SUGAR_KEY), fluidReadings=loadHealthList(FLUID_KEY);
function loadHealthList(k){try{const a=JSON.parse(localStorage.getItem(k)||"[]");return Array.isArray(a)?a:[]}catch{return []}}
function saveHealth(){localStorage.setItem(BP_KEY,JSON.stringify(bpReadings));localStorage.setItem(SUGAR_KEY,JSON.stringify(sugarReadings));localStorage.setItem(FLUID_KEY,JSON.stringify(fluidReadings))}
function nowLocalInput(){const d=new Date(),l=new Date(d.getTime()-d.getTimezoneOffset()*60000);return l.toISOString().slice(0,16)}
function prettyDate(v){const d=new Date(v);return isNaN(d)?v:d.toLocaleString()}


function loadEntries(){
  try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); return Array.isArray(value) ? value : []; }
  catch { return []; }
}
function saveEntries(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); }
function fmt(value){ return Number(value).toLocaleString(undefined,{maximumFractionDigits:1}); }
function currentDate(){ return $("diary-date").value || todayISO(); }
function foodById(id){ return allFoods().find(f=>f.id===id); }
function showMessage(text){ $("message").textContent=text; }

function populateFoodSelect(){
  $("food-select").innerHTML = '<option value="">Choose a food...</option>' + allFoods().map(f =>
    `<option value="${f.id}">${f.name} — ${f.serving}</option>`).join("");
  updateFoodHint();
}
function updateFoodHint(){
  const f=foodById($("food-select").value);
  if(!f){$("unit-label").textContent="serving";$("food-hint").textContent="Choose a food to see its estimated potassium per serving.";return;}
  $("unit-label").textContent=f.unit;
  $("food-hint").textContent=`Estimated ${fmt(f.mg)} mg potassium per ${f.serving}. Quantity is counted in this serving unit.`;
}
function renderDiary(){
  const date=currentDate();
  const todays=entries.filter(e=>e.date===date);
  const total=todays.reduce((s,e)=>s+e.mg,0);
  $("daily-total").textContent=fmt(total);
  $("entry-count").textContent=`${todays.length} item(s)`;
  const meals=["Breakfast","Lunch","Snacks","Dinner"];
  $("meal-totals").innerHTML=meals.map(m=>{
    const sum=todays.filter(e=>e.meal===m).reduce((s,e)=>s+e.mg,0);
    return `<div class="meal-chip"><span>${m}</span><strong>${fmt(sum)} mg</strong></div>`;
  }).join("");
  if(!todays.length){$("entries-area").innerHTML='<div class="empty"><strong>No foods recorded for this date</strong><p>Add your first food above to estimate potassium intake.</p></div>';return;}
  $("entries-area").innerHTML=`<div class="table-wrap"><table><thead><tr><th>Food</th><th>Meal</th><th>Quantity</th><th>Potassium</th><th></th></tr></thead><tbody>${todays.slice().reverse().map(e=>`<tr><td class="food-name">${escapeHTML(e.name)}</td><td><span class="meal-tag">${escapeHTML(e.meal)}</span></td><td>${fmt(e.quantity)} ${escapeHTML(e.unit)}</td><td class="mg">${fmt(e.mg)} mg</td><td><button class="delete-btn" data-delete="${e.id}" aria-label="Delete entry">×</button></td></tr>`).join("")}</tbody></table></div>`;
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

$("entry-form").addEventListener("submit",e=>{
  e.preventDefault();
  const food=foodById($("food-select").value), quantity=Number($("quantity").value);
  if(!food || !Number.isFinite(quantity) || quantity<=0){showMessage("Please select a food and enter a quantity greater than zero.");return;}
  const entry={id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()+Math.random())),foodId:food.id,name:food.name,quantity,unit:food.unit,mg:food.mg*quantity,meal:$("meal-select").value,date:currentDate()};
  entries.push(entry);saveEntries();renderDiary();$("quantity").value="";showMessage("Food entry added to your diary.");
});
$("entries-area").addEventListener("click",e=>{
  const btn=e.target.closest("[data-delete]");if(!btn)return;
  entries=entries.filter(item=>item.id!==btn.dataset.delete);saveEntries();renderDiary();showMessage("Food entry deleted.");
});
$("diary-date").addEventListener("change",renderDiary);
$("food-select").addEventListener("change",updateFoodHint);

function renderFoods(filter=""){
  const list=allFoods().filter(f=>(f.name+" "+f.category).toLowerCase().includes(filter.toLowerCase()));
  $("food-table").innerHTML=`<div class="table-wrap"><table><thead><tr><th>Food</th><th>Serving</th><th>Estimated potassium</th></tr></thead><tbody>${list.map(f=>`<tr><td class="food-name">${f.name}</td><td>${f.serving}</td><td class="mg">${fmt(f.mg)} mg</td></tr>`).join("")}</tbody></table></div>`;
}
$("food-search").addEventListener("input",e=>renderFoods(e.target.value));

function renderWeekly(){
  const days=[];
  for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const local=new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10);days.push(local);}
  const values=days.map(date=>({date,total:entries.filter(e=>e.date===date).reduce((s,e)=>s+e.mg,0)}));
  const max=Math.max(1,...values.map(v=>v.total));
  $("weekly-report").innerHTML=values.map(v=>`<div class="report-row"><span>${new Date(v.date+"T12:00:00").toLocaleDateString(undefined,{weekday:"short",day:"numeric",month:"short"})}</span><div class="bar-track"><div class="bar" style="width:${(v.total/max)*100}%"></div></div><span class="report-value">${fmt(v.total)} mg</span></div>`).join("")+`<p class="muted small">Weekly total: <strong>${fmt(values.reduce((s,v)=>s+v.total,0))} mg</strong> · Daily average: <strong>${fmt(values.reduce((s,v)=>s+v.total,0)/7)} mg</strong></p>`;
}


const fluidCategories={intake:["Water","Milk","Tea","Coffee","Juice","Coconut water","Other drink"],output:["Urine","Other measured fluid output"]};
function updateFluidCategories(){const t=$("fluid-type").value;$("fluid-category").innerHTML=fluidCategories[t].map(v=>`<option>${v}</option>`).join("");}
function renderFluid(){
 const date=currentDate(),day=fluidReadings.filter(r=>r.datetime.slice(0,10)===date);
 const intake=day.filter(r=>r.type==="intake").reduce((s,r)=>s+r.amount,0),output=day.filter(r=>r.type==="output").reduce((s,r)=>s+r.amount,0);
 $("fluid-intake-total").textContent=`${fmt(intake)} ml`;$("fluid-output-total").textContent=`${fmt(output)} ml`;$("fluid-net").textContent=fmt(intake-output);
 $("fluid-count").textContent=`${day.length} entr${day.length===1?"y":"ies"}`;
 const sorted=day.slice().sort((a,b)=>b.datetime.localeCompare(a.datetime));
 $("fluid-history").innerHTML=sorted.length?`<div class="table-wrap"><table><thead><tr><th>Date & time</th><th>Type</th><th>Category</th><th>Amount</th><th></th></tr></thead><tbody>${sorted.map(r=>`<tr><td>${escapeHTML(prettyDate(r.datetime))}</td><td><span class="meal-tag">${r.type==="intake"?"Intake (+)":"Output (−)"}</span></td><td>${escapeHTML(r.category)}</td><td class="mg">${fmt(r.amount)} ml</td><td><button class="delete-btn" data-fluid-del="${r.id}">×</button></td></tr>`).join("")}</tbody></table></div>`:'<div class="history-empty">No fluid records for this date yet.</div>';
}
$("fluid-type").addEventListener("change",updateFluidCategories);
$("fluid-form").addEventListener("submit",e=>{e.preventDefault();const type=$("fluid-type").value,category=$("fluid-category").value,amount=Number($("fluid-amount").value),datetime=$("fluid-datetime").value;if(!["intake","output"].includes(type)||!category||!Number.isInteger(amount)||amount<1||amount>20000||!datetime){$("fluid-message").textContent="Please enter a valid amount and date/time.";return;}fluidReadings.push({id:String(Date.now()+Math.random()),type,category,amount,datetime});saveHealth();renderFluid();e.target.reset();$("fluid-datetime").value=nowLocalInput();updateFluidCategories();$("fluid-message").textContent="Fluid measurement saved.";});
$("fluid-history").addEventListener("click",e=>{const b=e.target.closest("[data-fluid-del]");if(!b)return;fluidReadings=fluidReadings.filter(r=>r.id!==b.dataset.fluidDel);saveHealth();renderFluid();});

function renderHealth(){
 $("bp-count").textContent=`${bpReadings.length} reading(s)`;$("sugar-count").textContent=`${sugarReadings.length} reading(s)`;
 const bp=bpReadings.slice().sort((a,b)=>b.datetime.localeCompare(a.datetime)),sg=sugarReadings.slice().sort((a,b)=>b.datetime.localeCompare(a.datetime));
 $("bp-history").innerHTML=bp.length?`<div class="table-wrap"><table><thead><tr><th>Date & time</th><th>BP mmHg</th><th>Pulse</th><th></th></tr></thead><tbody>${bp.map(r=>`<tr><td>${escapeHTML(prettyDate(r.datetime))}</td><td class="mg">${fmt(r.systolic)}/${fmt(r.diastolic)}</td><td>${r.pulse?fmt(r.pulse)+" bpm":"—"}</td><td><button class="delete-btn" data-bp-del="${r.id}">×</button></td></tr>`).join("")}</tbody></table></div>`:'<div class="history-empty">No BP readings saved yet.</div>';
 $("sugar-history").innerHTML=sg.length?`<div class="table-wrap"><table><thead><tr><th>Date & time</th><th>Blood sugar</th><th>Context</th><th></th></tr></thead><tbody>${sg.map(r=>`<tr><td>${escapeHTML(prettyDate(r.datetime))}</td><td class="mg">${fmt(r.value)} ${escapeHTML(r.unit)}</td><td>${escapeHTML(r.context)}</td><td><button class="delete-btn" data-sugar-del="${r.id}">×</button></td></tr>`).join("")}</tbody></table></div>`:'<div class="history-empty">No blood sugar readings saved yet.</div>';
}
$("bp-form").addEventListener("submit",e=>{e.preventDefault();const s=Number($("bp-systolic").value),d=Number($("bp-diastolic").value),p=$("bp-pulse").value?Number($("bp-pulse").value):null,t=$("bp-datetime").value;if(!Number.isInteger(s)||!Number.isInteger(d)||s<40||s>300||d<20||d>200||(p!==null&&(!Number.isInteger(p)||p<20||p>250))||!t){$("bp-message").textContent="Check the values and date/time.";return;}bpReadings.push({id:String(Date.now()+Math.random()),systolic:s,diastolic:d,pulse:p,datetime:t});saveHealth();renderHealth();e.target.reset();$("bp-datetime").value=nowLocalInput();$("bp-message").textContent="BP reading saved.";});
$("sugar-form").addEventListener("submit",e=>{e.preventDefault();const v=Number($("sugar-value").value),u=$("sugar-unit").value,c=$("sugar-context").value,t=$("sugar-datetime").value;if(!Number.isFinite(v)||v<=0||v>2000||!t){$("sugar-message").textContent="Enter a valid reading and date/time.";return;}sugarReadings.push({id:String(Date.now()+Math.random()),value:v,unit:u,context:c,datetime:t});saveHealth();renderHealth();e.target.reset();$("sugar-datetime").value=nowLocalInput();$("sugar-message").textContent="Blood sugar reading saved.";});
$("bp-history").addEventListener("click",e=>{const b=e.target.closest("[data-bp-del]");if(!b)return;bpReadings=bpReadings.filter(r=>r.id!==b.dataset.bpDel);saveHealth();renderHealth()});
$("sugar-history").addEventListener("click",e=>{const b=e.target.closest("[data-sugar-del]");if(!b)return;sugarReadings=sugarReadings.filter(r=>r.id!==b.dataset.sugarDel);saveHealth();renderHealth()});


function renderStorageOverview(){
 $("store-food").textContent=entries.length;$("store-custom-foods").textContent=customFoods.length;
 $("store-bp").textContent=bpReadings.length;$("store-sugar").textContent=sugarReadings.length;$("store-fluid").textContent=fluidReadings.length;
 let bytes=0;
 for(const key of [STORAGE_KEY,BP_KEY,SUGAR_KEY,FLUID_KEY,CUSTOM_FOODS_KEY]){const value=localStorage.getItem(key)||"";bytes+=new Blob([value]).size;}
 $("store-size").textContent=bytes<1024?`${bytes} B`:`${(bytes/1024).toFixed(1)} KB`;
 $("custom-food-count").textContent=`${customFoods.length} food(s)`;
 $("custom-food-list").innerHTML=customFoods.length?customFoods.map(f=>`<div class="custom-food-row"><div><strong>${escapeHTML(f.name)}</strong><div class="muted small">${escapeHTML(f.serving)} · ${fmt(f.mg)} mg potassium</div></div><div class="custom-food-actions"><button class="small-btn" data-edit-food="${f.id}">Edit</button><button class="small-btn delete" data-delete-food="${f.id}">Delete</button></div></div>`).join(""):'<div class="history-empty">No custom foods added yet.</div>';
}
function exportFullBackup(){
 const backup={format:"k-potassium-tracker-backup-v4",exportedAt:new Date().toISOString(),entries,bpReadings,sugarReadings,fluidReadings,customFoods};
 const blob=new Blob([JSON.stringify(backup,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="k-potassium-tracker-full-backup.json";a.click();URL.revokeObjectURL(url);
}
$("custom-food-form").addEventListener("submit",e=>{
 e.preventDefault();
 const name=$("custom-food-name").value.trim(),serving=$("custom-food-serving").value.trim(),unit=$("custom-food-unit").value.trim(),mg=Number($("custom-food-potassium").value);
 if(!name||!serving||!unit||!Number.isFinite(mg)||mg<0||mg>10000){$("custom-food-message").textContent="Please enter valid food details and a potassium estimate.";return;}
 if(allFoods().some(f=>f.name.toLowerCase()===name.toLowerCase())){$("custom-food-message").textContent="A food with this name already exists.";return;}
 customFoods.push({id:"custom-"+Date.now(),name,serving,unit,amount:1,mg,category:"Custom food"});
 saveCustomFoods();populateFoodSelect();renderFoods($("food-search").value);renderStorageOverview();e.target.reset();$("custom-food-message").textContent="Custom food added to your database.";
});
$("custom-food-list").addEventListener("click",e=>{
 const del=e.target.closest("[data-delete-food]"),edit=e.target.closest("[data-edit-food]");
 if(del){const id=del.dataset.deleteFood;if(!confirm("Delete this custom food from the selectable food database? Existing diary records will remain."))return;customFoods=customFoods.filter(f=>f.id!==id);saveCustomFoods();populateFoodSelect();renderFoods($("food-search").value);renderStorageOverview();}
 if(edit){const f=customFoods.find(x=>x.id===edit.dataset.editFood);if(!f)return;
  const name=prompt("Food name:",f.name);if(name===null)return;
  const serving=prompt("Serving description:",f.serving);if(serving===null)return;
  const unit=prompt("Quantity unit label:",f.unit);if(unit===null)return;
  const mgText=prompt("Potassium per serving (mg):",String(f.mg));if(mgText===null)return;
  const mg=Number(mgText);if(!name.trim()||!serving.trim()||!unit.trim()||!Number.isFinite(mg)||mg<0||mg>10000){alert("Invalid food details. No changes saved.");return;}
  f.name=name.trim();f.serving=serving.trim();f.unit=unit.trim();f.mg=mg;saveCustomFoods();populateFoodSelect();renderFoods($("food-search").value);renderStorageOverview();
 }
});
$("manage-export").addEventListener("click",exportFullBackup);
$("manage-import").addEventListener("change",async e=>{
 const file=e.target.files[0];if(!file)return;
 if(!confirm("Restore this backup? Current app records will be replaced.")){e.target.value="";return;}
 try{
  const data=JSON.parse(await file.text());if(!data||!Array.isArray(data.entries))throw new Error("Invalid backup");
  entries=data.entries.filter(x=>x&&typeof x.name==="string"&&Number.isFinite(Number(x.mg))&&typeof x.date==="string");
  bpReadings=Array.isArray(data.bpReadings)?data.bpReadings:[];sugarReadings=Array.isArray(data.sugarReadings)?data.sugarReadings:[];fluidReadings=Array.isArray(data.fluidReadings)?data.fluidReadings:[];
  customFoods=Array.isArray(data.customFoods)?data.customFoods:[];saveEntries();saveHealth();saveCustomFoods();
  populateFoodSelect();renderDiary();renderWeekly();renderHealth();renderFluid();renderFoods($("food-search").value);renderStorageOverview();
  $("backup-message").textContent="Backup restored successfully.";
 }catch{$("backup-message").textContent="Could not restore. Please select a valid tracker backup.";}
 e.target.value="";
});
$("refresh-storage").addEventListener("click",renderStorageOverview);
$("reset-food").addEventListener("click",()=>{if(confirm("Delete all food diary entries?")){entries=[];saveEntries();renderDiary();renderWeekly();renderStorageOverview();$("reset-message").textContent="Food diary deleted.";}});
$("reset-bp-sugar").addEventListener("click",()=>{if(confirm("Delete all blood pressure and blood sugar readings?")){bpReadings=[];sugarReadings=[];saveHealth();renderHealth();renderStorageOverview();$("reset-message").textContent="BP and blood sugar records deleted.";}});
$("reset-fluid").addEventListener("click",()=>{if(confirm("Delete all fluid records?")){fluidReadings=[];saveHealth();renderFluid();renderStorageOverview();$("reset-message").textContent="Fluid records deleted.";}});
$("reset-custom-foods").addEventListener("click",()=>{if(confirm("Delete all custom foods? Built-in foods will remain. Existing diary entries will remain.")){customFoods=[];saveCustomFoods();populateFoodSelect();renderFoods($("food-search").value);renderStorageOverview();$("reset-message").textContent="Custom foods deleted.";}});
$("reset-all").addEventListener("click",()=>{if(confirm("RESET EVERYTHING? This permanently deletes all diary, custom food, BP, sugar and fluid records from this browser. Export a backup first.")){entries=[];bpReadings=[];sugarReadings=[];fluidReadings=[];customFoods=[];saveEntries();saveHealth();saveCustomFoods();populateFoodSelect();renderDiary();renderWeekly();renderHealth();renderFluid();renderFoods("");renderStorageOverview();$("reset-message").textContent="All app data has been reset. Built-in food reference data remains available.";}});

function showPage(name){
  document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));
  $(`${name}-page`).classList.remove("hidden");
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.page===name));
  if(name==="reports")renderWeekly();
  if(name==="health")renderHealth();
  if(name==="fluid")renderFluid();
  if(name==="manage")renderStorageOverview();
  if(name==="foods")renderFoods($("food-search").value);
}
document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));

$("export-btn").addEventListener("click",()=>{
  const blob=new Blob([JSON.stringify({format:"k-potassium-tracker-backup-v3",exportedAt:new Date().toISOString(),entries,bpReadings,sugarReadings,fluidReadings,customFoods},null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="potassium-diary-backup.json";a.click();URL.revokeObjectURL(url);
});
$("import-file").addEventListener("change",async e=>{
  const file=e.target.files[0];if(!file)return;
  try{
    const data=JSON.parse(await file.text());
    if(!data || !Array.isArray(data.entries))throw new Error("Invalid backup");
    const valid=data.entries.filter(x=>x && typeof x.name==="string" && Number.isFinite(Number(x.mg)) && Number(x.mg)>=0 && typeof x.date==="string");
    entries=valid.map(x=>({...x,id:x.id||String(Date.now()+Math.random())}));
    bpReadings=Array.isArray(data.bpReadings)?data.bpReadings.filter(x=>x&&Number.isFinite(Number(x.systolic))&&Number.isFinite(Number(x.diastolic))&&typeof x.datetime==="string"):[];
    sugarReadings=Array.isArray(data.sugarReadings)?data.sugarReadings.filter(x=>x&&Number.isFinite(Number(x.value))&&typeof x.datetime==="string"&&["mg/dL","mmol/L"].includes(x.unit)):[];
    fluidReadings=Array.isArray(data.fluidReadings)?data.fluidReadings.filter(x=>x&&["intake","output"].includes(x.type)&&Number.isFinite(Number(x.amount))&&Number(x.amount)>0&&typeof x.datetime==="string"):[];
    customFoods=Array.isArray(data.customFoods)?data.customFoods.filter(x=>x&&typeof x.id==="string"&&typeof x.name==="string"&&Number.isFinite(Number(x.mg))&&Number(x.mg)>=0):[];
    saveCustomFoods();
    saveEntries();saveHealth();renderDiary();renderWeekly();renderHealth();renderFluid();showMessage(`Imported ${valid.length} food entries and health/fluid records.`);
  }catch{showMessage("Could not import this file. Please choose a valid tracker backup.");}
  e.target.value="";
});
$("clear-btn").addEventListener("click",()=>{
  if(confirm("Delete every saved food diary entry from this browser? Export a backup first if you need one.")){entries=[];bpReadings=[];sugarReadings=[];fluidReadings=[];saveEntries();saveHealth();renderDiary();renderWeekly();renderHealth();renderFluid();showMessage("All saved food, health and fluid entries cleared.");}
});

$("diary-date").value=todayISO();
populateFoodSelect();renderDiary();renderStorageOverview();$("bp-datetime").value=nowLocalInput();$("sugar-datetime").value=nowLocalInput();$("fluid-datetime").value=nowLocalInput();updateFluidCategories();renderHealth();renderFluid();


// Supabase cloud backup: manual upload/download, protected by per-user RLS.
const SUPABASE_URL = "https://cdbdtyinfephcscfwcok.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_uDCfgrpK1lRca5aV8FuT1A_pK4AOMMm";
let cloudClient = null;
let cloudUser = null;
function cloudMessage(text){ const el=$("cloud-message"); if(el) el.textContent=text; }
function setCloudUI(user){
  cloudUser=user||null;
  const status=$("cloud-status");
  if(status) status.textContent=cloudUser ? `Signed in: ${cloudUser.email||"account"}` : "Not signed in";
  ["cloud-upload","cloud-download","cloud-signout"].forEach(id=>{const el=$(id);if(el)el.disabled=!cloudUser;});
  const authForm=$("cloud-auth-form");
  if(authForm) authForm.classList.toggle("hidden",!!cloudUser);
}
function getLocalBackup(){
  return {format:"k-potassium-tracker-cloud-v1",savedAt:new Date().toISOString(),entries,bpReadings,sugarReadings,fluidReadings,customFoods};
}
function applyCloudBackup(data){
  if(!data||!Array.isArray(data.entries)) throw new Error("The cloud backup format is not recognised.");
  entries=Array.isArray(data.entries)?data.entries:[];
  bpReadings=Array.isArray(data.bpReadings)?data.bpReadings:[];
  sugarReadings=Array.isArray(data.sugarReadings)?data.sugarReadings:[];
  fluidReadings=Array.isArray(data.fluidReadings)?data.fluidReadings:[];
  customFoods=Array.isArray(data.customFoods)?data.customFoods:[];
  saveEntries();saveHealth();saveCustomFoods();
  populateFoodSelect();renderDiary();renderWeekly();renderHealth();renderFluid();renderFoods($("food-search").value);renderStorageOverview();
}
async function initCloud(){
  if(!window.supabase||!window.supabase.createClient){cloudMessage("Cloud library could not load. Check your internet connection and refresh.");return;}
  cloudClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
  const {data,error}=await cloudClient.auth.getSession();
  if(error){cloudMessage(error.message);return;}
  setCloudUI(data.session?.user||null);
  cloudClient.auth.onAuthStateChange((_event,session)=>setCloudUI(session?.user||null));
}
$("cloud-auth-form").addEventListener("submit",async e=>{
  e.preventDefault(); if(!cloudClient){cloudMessage("Cloud service is not ready. Refresh while online.");return;}
  const email=$("cloud-email").value.trim(),password=$("cloud-password").value;
  cloudMessage("Signing in...");
  const {data,error}=await cloudClient.auth.signInWithPassword({email,password});
  if(error){cloudMessage(error.message);return;}
  setCloudUI(data.user);$("cloud-password").value="";cloudMessage("Signed in successfully.");
});
$("cloud-signup").addEventListener("click",async()=>{
  if(!cloudClient){cloudMessage("Cloud service is not ready. Refresh while online.");return;}
  const email=$("cloud-email").value.trim(),password=$("cloud-password").value;
  if(!email||password.length<8){cloudMessage("Enter your email and a password with at least 8 characters.");return;}
  cloudMessage("Creating account...");
  const {data,error}=await cloudClient.auth.signUp({email,password});
  if(error){cloudMessage(error.message);return;}
  if(data.session){setCloudUI(data.user);cloudMessage("Account created and signed in.");}
  else cloudMessage("Account created. Check your email for the confirmation link, then return here and sign in.");
});
$("cloud-signout").addEventListener("click",async()=>{
  if(!cloudClient)return; const {error}=await cloudClient.auth.signOut();
  if(error){cloudMessage(error.message);return;}setCloudUI(null);cloudMessage("Signed out. Local records remain on this device.");
});
$("cloud-upload").addEventListener("click",async()=>{
  if(!cloudClient||!cloudUser)return;
  if(!confirm("Upload and replace the cloud backup for this account with ALL records on this device? This includes BP, blood sugar and fluid records."))return;
  cloudMessage("Uploading backup...");
  const payload={user_id:cloudUser.id,backup_data:getLocalBackup(),updated_at:new Date().toISOString()};
  const {error}=await cloudClient.from("tracker_backups").upsert(payload,{onConflict:"user_id"});
  if(error){cloudMessage("Upload failed: "+error.message);return;}
  cloudMessage("Cloud backup uploaded successfully.");
});
$("cloud-download").addEventListener("click",async()=>{
  if(!cloudClient||!cloudUser)return;
  if(!confirm("Download the cloud backup and REPLACE all records on this device? Export a local backup first if needed."))return;
  cloudMessage("Checking cloud backup...");
  const {data,error}=await cloudClient.from("tracker_backups").select("backup_data,updated_at").eq("user_id",cloudUser.id).maybeSingle();
  if(error){cloudMessage("Download failed: "+error.message);return;}
  if(!data){cloudMessage("No cloud backup exists yet. Upload this device first.");return;}
  try{applyCloudBackup(data.backup_data);cloudMessage("Cloud backup restored. Last saved: "+new Date(data.updated_at).toLocaleString());}
  catch(err){cloudMessage("Could not restore backup: "+err.message);}
});
initCloud();
