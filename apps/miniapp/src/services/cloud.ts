import {CLOUD_ENV_ID} from '../config/cloud';
declare const wx: {
  cloud?: {
    uploadFile(options:{cloudPath:string;filePath:string}):Promise<{fileID:string}>;
    getTempFileURL(options:{fileList:string[]}):Promise<{fileList:{fileID:string;tempFileURL:string;status:number}[]}>;
    init(options:{env:string;traceUser:boolean}):void;
    callFunction(options:{name:string;data?:unknown}):Promise<{result?:unknown}>;
  };
};
let initialized=false;
export async function uploadImage(path:string):Promise<string>{
  // #ifdef MP-WEIXIN
  initializeCloud();return (await wx.cloud!.uploadFile({cloudPath:'activity-assets/'+Date.now()+'-'+Math.random().toString(36).slice(2)+'.jpg',filePath:path})).fileID;
  // #endif
  // #ifndef MP-WEIXIN
  throw new Error('请在微信中上传图片');
  // #endif
}
export async function imageUrls(ids:string[]):Promise<Record<string,string>>{
  // #ifdef MP-WEIXIN
  initializeCloud();if(!ids.length)return {};const response=await wx.cloud!.getTempFileURL({fileList:[...new Set(ids)]});return Object.fromEntries(response.fileList.filter(x=>x.status===0).map(x=>[x.fileID,x.tempFileURL]));
  // #endif
  // #ifndef MP-WEIXIN
  return {};
  // #endif
}
export async function callEvent(data:unknown):Promise<{id:string;serverNow?:number;state:import('../../../../packages/shared-types/index').EventState}> {
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
