import cloud from 'wx-server-sdk';
import {randomBytes,createHash} from 'node:crypto';
import {eventService} from './service.ts';
import type {StoredEvent,Repository} from './service.ts';
cloud.init({env:cloud.DYNAMIC_CURRENT_ENV});
const db=cloud.database();
const collection='lottery_events';
let collectionReady=false;
function getData(response:any){return Array.isArray(response.data)?response.data[0]:response.data}
async function read(doc:any){try{return getData(await doc.get())}catch(e){if(/document.*(not exist|does not exist)/i.test(String((e as Error).message)))return null;throw e}}
function requireOwner(record:StoredEvent,owner:string){if(!record)throw new Error('NOT_FOUND');if(record.owner!==owner)throw new Error('FORBIDDEN')}
export async function main(input:any){
 try{
  const owner=cloud.getWXContext().OPENID;if(!owner)throw new Error('UNAUTHENTICATED');
  if(!input||!['create','get','start','stop','next'].includes(input.action))throw new Error('INVALID_ACTION');
  if(JSON.stringify(input).length>64000)throw new Error('活动配置过大，请减少名单或奖项');
  const id=input.action==='create'?createHash('sha256').update(owner+':'+String(input.requestId)).digest('hex'):input.id;
  if(typeof id!=='string'||!/^[a-f0-9]{64}$/.test(id))throw new Error('INVALID_EVENT_ID');
  const doc=db.collection(collection).doc(id);
  if(input.action==='create'&&!collectionReady){
   try{await db.createCollection(collection)}catch(e){if(!/already exists|已存在|ResourceExist|COLLECTION_EXIST/i.test((e as Error).message))throw e}
   collectionReady=true;
  }
  const repo:Repository={
   async insert(record){
    if(!/^[a-zA-Z0-9-]{8,80}$/.test(input.requestId||''))throw new Error('INVALID_REQUEST_ID');
    const fingerprint=createHash('sha256').update(JSON.stringify(record.state.rules)).digest('hex');
    await db.runTransaction(async(tx:any)=>{const ref=tx.collection(collection).doc(id);const old=await read(ref);if(old){requireOwner(old,owner);if(old.fingerprint!==fingerprint)throw new Error('REQUEST_ID_REUSED');return;}await ref.set({data:{...record,fingerprint,createdAt:Date.now()}})});
    return id;
   },
   async transaction(eventId,fn){return db.runTransaction(async(tx:any)=>{const ref=tx.collection(collection).doc(eventId);const record=await read(ref);requireOwner(record,owner);const value=fn(record);const {_id,...data}=record;await ref.set({data:{...data,updatedAt:Date.now()}});return value})}
  };
  const service=eventService(repo,()=>randomBytes(6).readUIntBE(0,6)/281474976710656);
  if(input.action==='create')await service.create(owner,input.rules);
  else if(input.action!=='get'){
   if(!Number.isSafeInteger(input.version)||input.version<0)throw new Error('INVALID_VERSION');
   const state=await service.command(owner,id,input.action,input.version,input.requestId);return {ok:true,id,state,serverNow:Date.now()};
  }
  const record=await read(doc);requireOwner(record,owner);
  const state=input.action==='get'&&record.state.phase==='running'&&record.state.rules.stopMode==='auto'&&Date.now()>=(record.state.stopAfter??Infinity)?await service.settle(owner,id):record.state;
  return {ok:true,id,state,serverNow:Date.now()};
 }catch(e){console.error('event operation failed',e);return {ok:false,error:(e as Error).message||'CLOUD_ERROR'}}
}
