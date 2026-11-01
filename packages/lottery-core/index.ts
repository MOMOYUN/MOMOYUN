const clone=<T>(value:T):T=>JSON.parse(JSON.stringify(value));
import type {Rules, EventState, Person} from '../shared-types/index.ts';
function check(ok:unknown,message:string):asserts ok { if(!ok) throw new Error(message) }
export function createEvent(input:Rules):EventState {
 const rules=clone(input); check(rules.name.trim(),'请填写活动名称');
 check(rules.participants.length>0&&rules.participants.length<=1000,'名单需为1–1000人');
 check(new Set(rules.participants.map(p=>p.id)).size===rules.participants.length,'参与人ID重复');
 check(rules.participants.every(p=>p.id&&p.name.trim()),'参与人不能为空');
 check(rules.prizes.length>0&&new Set(rules.prizes.map(p=>p.id)).size===rules.prizes.length,'奖项不能为空或重复');
 let total=0;
 for(const p of rules.prizes){check(p.id&&p.name.trim()&&p.batches.length>0,'请完善奖项');for(const n of p.batches){check(Number.isSafeInteger(n)&&n>0,'批次数量必须是正整数');total+=n}
 for(const [id,w] of Object.entries(p.weights||{})) check(rules.participants.some(x=>x.id===id)&&Number.isFinite(w)&&w>0&&w<=1000000,'权重必须为正数且不超过1000000');}
 check(total<=rules.participants.length,'总名额超过参与人数');
 return {rules,phase:'ready',prize:0,batch:0,results:[],version:0};
}
export function startDraw(state:EventState):EventState {check(state.phase==='ready','当前不能开始');return {...clone(state),phase:'running',version:state.version+1} }
export function stopDraw(state:EventState,random:()=>number,now=Date.now()):EventState {
 check(state.phase==='running','当前不能停止');const s=clone(state),p=s.rules.prizes[s.prize];
 const used=new Set(s.results.flatMap(r=>r.winners.map(w=>w.id)));let pool=s.rules.participants.filter(x=>!used.has(x.id));const winners:Person[]=[];
 for(let n=0;n<p.batches[s.batch];n++){const total=pool.reduce((a,x)=>a+(p.weights?.[x.id]??1),0);const r=random();check(Number.isFinite(r)&&r>=0&&r<1,'随机源异常');let value=r*total;let i=pool.length-1;for(let j=0;j<pool.length;j++){value-=p.weights?.[pool[j].id]??1;if(value<0){i=j;break}}winners.push(pool.splice(i,1)[0])}
 s.results.push({prizeId:p.id,batch:s.batch,winners,at:now});s.phase='revealed';s.version++;return s;
}
export function nextDraw(state:EventState):EventState {check(state.phase==='revealed','请先完成当前批次');const s=clone(state);if(s.batch+1<s.rules.prizes[s.prize].batches.length)s.batch++;else{s.prize++;s.batch=0} s.phase=s.prize===s.rules.prizes.length?'complete':'ready';s.version++;return s}
