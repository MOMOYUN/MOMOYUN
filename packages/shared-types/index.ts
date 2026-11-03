export interface Person { id:string; name:string }
export interface Prize { id:string; name:string; batches:number[]; weights?:Record<string,number>; icon?:string; image?:string }
export interface Rules { name:string; subtitle?:string; theme?:string; logo?:string; participants:Person[]; prizes:Prize[]; stopMode?:'manual'|'auto'; countdownSeconds?:number; rollingSeconds?:number }
export interface Result { prizeId:string; batch:number; winners:Person[]; at:number }
export interface EventState { rules:Rules; phase:'ready'|'running'|'revealed'|'complete'; prize:number; batch:number; results:Result[]; version:number; revealAfter?:number; stopAfter?:number }
