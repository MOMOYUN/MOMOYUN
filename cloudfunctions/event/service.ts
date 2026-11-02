const clone=<T>(value:T):T=>JSON.parse(JSON.stringify(value));
import {createEvent, startDraw, stopDraw, nextDraw} from '../../packages/lottery-core/index.ts';
import type {EventState, Rules} from '../../packages/shared-types/index.ts';

export interface StoredEvent { owner:string; state:EventState; requests:Record<string,{action:string; version:number; result:EventState}> }
// The CloudBase adapter must implement an atomic transaction, never a read + write pair.
export interface Repository {
  insert(record:StoredEvent):Promise<string>;
  transaction<T>(id:string, fn:(record:StoredEvent)=>T):Promise<T>;
}
export function eventService(repo:Repository, random:()=>number) {
  return {
    async settle(owner:string,id:string,now=Date.now()) {
      if(!owner)throw new Error('UNAUTHENTICATED');
      return repo.transaction(id,record=>{
        if(record.owner!==owner)throw new Error('FORBIDDEN');
        if(record.state.phase==='running'&&record.state.rules.stopMode==='auto'&&now>=(record.state.stopAfter??Infinity)){
          record.state=stopDraw(record.state,random,now);record.requests={};
        }
        return clone(record.state);
      });
    },
    async create(owner:string, rules:Rules) {
      if(!owner) throw new Error('UNAUTHENTICATED');
      return repo.insert({owner,state:createEvent(rules),requests:{}});
    },
    async command(owner:string, id:string, action:'start'|'stop'|'next', version:number, requestId:string) {
      if(!owner) throw new Error('UNAUTHENTICATED');
      if(!/^[a-zA-Z0-9-]{8,80}$/.test(requestId)) throw new Error('INVALID_REQUEST_ID');
      return repo.transaction(id, record=>{
        if(record.owner!==owner) throw new Error('FORBIDDEN');
        const cached=Object.hasOwn(record.requests,requestId)?record.requests[requestId]:undefined;
        if(cached){
          if(cached.action!==action||cached.version!==version) throw new Error('REQUEST_ID_REUSED');
          return clone(cached.result);
        }
        if(record.state.version!==version) throw new Error('VERSION_CONFLICT');
        let result:EventState;
        if(action==='start') result=startDraw(record.state);
        else if(action==='stop') result=stopDraw(record.state,random);
        else if(action==='next') result=nextDraw(record.state);
        else throw new Error('INVALID_ACTION');
        record.state=result;
        // Keep only the most recent response. Older retries fail the version check,
        // so they cannot redraw, while document size remains bounded.
        record.requests={};
        record.requests[requestId]={action,version,result:clone(result)};
        return clone(result);
      });
    }
  };
}
