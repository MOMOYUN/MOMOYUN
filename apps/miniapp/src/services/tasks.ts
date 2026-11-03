import type {ToolConfig} from '../../../../packages/lottery-core/tools';
export interface SavedTask {id:string;config:ToolConfig;at:number}
export const labels:Record<string,string>={wheel:'转盘',draw:'抽一个',group:'随机分组',sort:'随机排序',number:'随机数字',dice:'骰子',seat:'随机座位',pair:'随机配对',coin:'硬币'};
export function remember(config:ToolConfig){const task={config,id:String(Date.now()),at:Date.now()};uni.setStorageSync('lastTool',task);uni.setStorageSync('tool-'+config.mode,config)}
export function pin(config:ToolConfig){const items:SavedTask[]=uni.getStorageSync('pinnedTools')||[];if(items.length>=50)throw Error('最多固定50份名单');items.unshift({config,id:String(Date.now()),at:Date.now()});uni.setStorageSync('pinnedTools',items)}
