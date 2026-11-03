import type {Rules} from '../../../../packages/shared-types/index';
export interface AwardDraft {id:string;name:string;batches:string;icon:string;image:string;weighted:boolean;weights:string}
export const newAward=(i:number):AwardDraft=>({id:'prize-'+i,name:i===1?'一等奖':i===2?'二等奖':'自定义奖项',batches:'1',icon:'🎁',image:'',weighted:false,weights:''});
export function draftRules(name:string,entries:string,awards:AwardDraft[],visual:{subtitle:string;theme:string;logo:string}):Rules{
 const names=[...new Set(entries.split(/\r?\n/).map(x=>x.trim()).filter(Boolean))];const participants=names.map((name,i)=>({id:String(i+1),name}));
 const prizes=awards.map(p=>{const weights:Record<string,number>={};if(p.weighted)for(const line of p.weights.split(/\r?\n/).filter(x=>x.trim())){const [label,value]=line.split('|');const person=participants.find(x=>x.name===label.trim());if(!person)throw Error('权重名单包含未参与人员：'+label);const w=Number(value);if(!Number.isFinite(w)||w<=0)throw Error('权重必须为正数');weights[person.id]=w}return {id:p.id,name:p.name,batches:p.batches.split(/[,，]/).map(Number),icon:p.icon,image:p.image,...(p.weighted?{weights}:{})}});
 return {name:name.trim(),...visual,participants,prizes};
}
