export interface Person { id:string; name:string }
export interface Prize { id:string; name:string; batches:number[]; weights?:Record<string,number>; icon?:string; image?:string }
export interface Rules { name:string; participants:Person[]; prizes:Prize[] }
export interface Result { prizeId:string; batch:number; winners:Person[]; at:number }
export interface EventState { rules:Rules; phase:'ready'|'running'|'revealed'|'complete'; prize:number; batch:number; results:Result[]; version:number }
