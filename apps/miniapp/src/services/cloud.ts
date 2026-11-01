import {CLOUD_ENV_ID} from '../config/cloud';
declare const wx: {
  cloud?: {
    init(options:{env:string;traceUser:boolean}):void;
    callFunction(options:{name:string;data?:unknown}):Promise<{result?:unknown}>;
  };
};
let initialized=false;
export async function callEvent(data:unknown):Promise<{id:string;state:import('../../../../packages/shared-types/index').EventState}> {
  // #ifdef MP-WEIXIN
  initializeCloud();const response=await wx.cloud!.callFunction({name:'event',data});
  const result=response.result as {ok:boolean;error?:string;id:string;state:import('../../../../packages/shared-types/index').EventState};
  if(!result?.ok)throw new Error(result?.error||'云服务响应异常');return result;
  // #endif
  // #ifndef MP-WEIXIN
  throw new Error('请在微信小程序中操作活动');
  // #endif
}
export function initializeCloud():void {
  // #ifdef MP-WEIXIN
  if(!wx.cloud) throw new Error('请升级微信后重试');
  if(!initialized){wx.cloud.init({env:CLOUD_ENV_ID,traceUser:false});initialized=true;}
  // #endif
}
export async function checkCloud():Promise<void> {
  // #ifdef MP-WEIXIN
  initializeCloud();
  const response=await wx.cloud!.callFunction({name:'health'});
  const result=response.result as {ok?:boolean;service?:string}|undefined;
  if(result?.ok!==true||result.service!=='random-app') throw new Error('云服务响应异常');
  return;
  // #endif
  // #ifndef MP-WEIXIN
  throw new Error('请在微信小程序中检查云服务');
  // #endif
}
