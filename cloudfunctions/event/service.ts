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
    async create(owner:string, rules:Rules) {
      if(!owner) throw new Error('UNAUTHENTICATED');
      return repo.insert({owner,state:createEvent(rules),requests:{}});
    },
    async command(owner:string, id:string, action:'start'|'stop'|'next', version:number, requestId:string) {
      if(!owner) throw new Error('UNAUTHENTICATED');
      if(!/^[a-zA-Z0-9-]{8,80}$/.test(requestId)) throw new Error('INVALID_REQUEST_ID');
      return repo.transaction(id, record=>{
        if(record.owner!==owner) throw new Error('FORBIDDEN');
        const cached=record.requests[requestId];
        if(cached){
          if(cached.action!==action||cached.version!==version) throw new Error('REQUEST_ID_REUSED');
          return structuredClone(cached.result);
        }
        if(record.state.version!==version) throw new Error('VERSION_CONFLICT');
        let result:EventState;
        if(action==='start') result=startDraw(record.state);
        else if(action==='stop') result=stopDraw(record.state,random);
        else if(action==='next') result=nextDraw(record.state);
        else throw new Error('INVALID_ACTION');
        record.state=result;
        record.requests[requestId]={action,version,result:structuredClone(result)};
        return structuredClone(result);
      });
    }
  };
}
