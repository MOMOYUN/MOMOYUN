<script setup lang="ts">
import {ref,computed,onUnmounted} from 'vue';import {onLoad} from '@dcloudio/uni-app';import {callEvent} from '../../services/cloud';import type {EventState,Rules} from '../../../../../packages/shared-types/index';
const name=ref<string>(uni.getStorageSync('recentName')||'我的活动'),names=ref<string>(uni.getStorageSync('recentNames')||'张三\n李四\n王五'),prizes=ref<string>(uni.getStorageSync('recentPrizes')||'一等奖|1|🏆\n二等奖|2|🎁');
const busy=ref(false),error=ref(''),state=ref<EventState|null>(null),id=ref(uni.getStorageSync('activeEvent')||''),tick=ref(0);
const timer=setInterval(()=>tick.value++,150);onUnmounted(()=>clearInterval(timer));
const current=computed(()=>state.value?.rules.prizes[state.value.prize]);
const nextLabel=computed(()=>{const s=state.value;if(!s)return "";if(s.batch+1<s.rules.prizes[s.prize].batches.length)return "下一批";return s.prize+1<s.rules.prizes.length?"下一奖项":"完成本场"});
const roll=computed(()=>{const s=state.value;if(!s)return '';const used=new Set(s.results.flatMap(r=>r.winners.map(w=>w.id)));const pool=s.rules.participants.filter(p=>!used.has(p.id));return pool[tick.value%pool.length]?.name||''});
const requestId=()=>Date.now().toString(36)+'-'+Math.random().toString(36).slice(2); // request identity only, not lottery randomness
async function run(fn:()=>Promise<void>){if(busy.value)return;busy.value=true;error.value='';try{await fn()}catch(e){const x=e as {message?:string;errMsg?:string};const text=x.message||x.errMsg||'操作失败';const friendly:Record<string,string>={VERSION_CONFLICT:'状态已变化，请先刷新云端状态',FORBIDDEN:'你没有操作这场活动的权限',UNAUTHENTICATED:'请确认已登录微信',NOT_FOUND:'未找到该活动'};error.value=friendly[text]||text}finally{busy.value=false}}
function rules():Rules {
 const rows=names.value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);if(!name.value.trim()||!rows.length)throw new Error('请填写活动名称和名单');const weights:Record<string,number>={};
 const participants=rows.map((row,i)=>{const [label,w]=row.split('|');const key=String(i+1);if(w!==undefined){const v=Number(w);if(!Number.isFinite(v)||v<=0)throw new Error('权重必须是正数');weights[key]=v}return {id:key,name:label.trim()}});
 const awards=prizes.value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean).map((line,i)=>{const [label,batches,icon]=line.split('|');return {id:String(i+1),name:label.trim(),batches:(batches||'').split(',').map(Number),icon:icon||'🎁',weights}});return {name:name.value.trim(),participants,prizes:awards};
}
function accept(r:{id:string;state:EventState}){id.value=r.id;state.value=r.state;uni.setStorageSync('activeEvent',r.id)}
async function create(){await run(async()=>{const config=rules();uni.setStorageSync('recentName',name.value);uni.setStorageSync('recentNames',names.value);uni.setStorageSync('recentPrizes',prizes.value);const payload=JSON.stringify(config);let pending=uni.getStorageSync('pendingCreate');if(!pending||pending.payload!==payload){pending={payload,requestId:requestId()};uni.setStorageSync('pendingCreate',pending)}accept(await callEvent({action:'create',rules:config,requestId:pending.requestId}));uni.removeStorageSync('pendingCreate')})}
async function refresh(){if(id.value)await run(async()=>accept(await callEvent({action:'get',id:id.value})))}
async function command(action:'start'|'stop'|'next'){await run(async()=>{if(!state.value)return;const version=state.value.version;let pending=uni.getStorageSync('pendingCommand');if(!pending||pending.id!==id.value||pending.version!==version||pending.action!==action){pending={id:id.value,version,action,requestId:requestId()};uni.setStorageSync('pendingCommand',pending)}accept(await callEvent(pending));uni.removeStorageSync('pendingCommand')})}
function newEvent(){state.value=null;id.value='';uni.removeStorageSync('activeEvent')}
onLoad(()=>{if(id.value)refresh()});
</script>
<template><view class="page">
<template v-if="!state"><view class="card"><text class="heading">创建活动</text><input v-model="name" placeholder="活动名称" maxlength="100"/><text class="muted">每行一个名字，可填写 姓名|权重</text><textarea v-model="names" maxlength="12000"/><text class="muted">每行 奖项名称|各批人数|图标</text><textarea v-model="prizes" maxlength="3000"/><view class="muted">例如“二等奖|2,3|🎁”分两批抽2名、3名。名单权重应用于所有奖项，默认1；抽取后概率随剩余名单变化。</view></view><button :disabled="busy" @click="create">创建并锁定规则</button><button v-if="id" :disabled="busy" @click="refresh">恢复上次活动</button></template>
<template v-else><view class="card"><text class="heading">{{state.rules.name}}</text><view class="muted">{{state.rules.participants.length}} 人 · 跨奖项不重复 · 手动停止</view><view class="muted">本场名单、奖项和权重已锁定。</view></view>
<view v-if="current" class="stage"><view class="gift">{{current.icon}}</view><view class="heading">{{current.name}} · 第 {{state.batch+1}} 批</view><view>本批 {{current.batches[state.batch]}} 名</view><view v-if="state.phase==='running'" class="rolling">{{roll}}</view></view>
<button v-if="state.phase==='ready'" :disabled="busy" @click="command('start')">开始开奖</button><button v-if="state.phase==='running'" :disabled="busy" @click="command('stop')">停止并揭晓</button><button v-if="state.phase==='revealed'" :disabled="busy" @click="command('next')">{{nextLabel}}</button><view v-if="state.phase==='complete'" class="card">本场已完成<button @click="newEvent">创建新活动</button></view>
<view v-for="(r,i) in state.results" :key="i" class="card"><view class="muted">{{state.rules.prizes.find(p=>p.id===r.prizeId)?.name}} · 第 {{r.batch+1}} 批</view><view class="winners">{{r.winners.map(w=>w.name).join('、')}}</view></view><button :disabled="busy" @click="refresh">刷新云端状态</button></template>
<view v-if="busy" class="muted">正在处理…</view><view v-if="error" class="error">{{error}}<view>网络异常可重试；状态变化时请先刷新云端状态。</view></view>
</view></template>
<style scoped>.heading{font-size:22px;font-weight:700}.stage{text-align:center;background:#382460;color:white;padding:30px 16px;border-radius:22px}.gift{font-size:60px}.rolling{font-size:34px;padding:24px}.winners{font-size:24px;font-weight:700;margin-top:12px}.error{padding:18px;background:#fff0ed;color:#9b3025;border-radius:14px;line-height:1.6}</style>
