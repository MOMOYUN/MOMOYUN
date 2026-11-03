export type Tool='wheel'|'draw'|'group'|'sort'|'number'|'dice'|'seat'|'pair'|'coin';
export interface ToolConfig {mode:Tool;name:string;items:string[];count:number;min:number;max:number;rows:number;cols:number;unique:boolean}
export function shuffle<T>(items:T[],random= Math.random):T[]{const a=[...items];for(let i=a.length-1;i>0;i--){const r=random();if(r<0||r>=1||!Number.isFinite(r))throw Error('随机源异常');const j=Math.floor(r*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const integer=(n:number,min:number,max:number)=>{if(!Number.isSafeInteger(n)||n<min||n>max)throw Error(`请输入 ${min}–${max} 的整数`)};
export function runTool(c:ToolConfig,random=Math.random):string[][]{
 const choose=(n:number)=>{const r=random();if(!Number.isFinite(r)||r<0||r>=1)throw Error('随机源异常');return Math.floor(r*n)};
 if(c.mode==='coin')return [[choose(2)?'反面':'正面']];
 if(c.mode==='dice'){integer(c.count,1,3);return [Array.from({length:c.count},()=>String(1+choose(6)))]}
 if(c.mode==='number'){integer(c.min,-1000000,1000000);integer(c.max,c.min,1000000);integer(c.count,1,100);const size=c.max-c.min+1;if(c.unique&&c.count>size)throw Error('不重复数量超过范围');const a:number[]=[];const swaps=new Map<number,number>();for(let i=0;i<c.count;i++){if(!c.unique)a.push(c.min+choose(size));else{const left=size-i;const j=choose(left);a.push(c.min+(swaps.get(j)??j));swaps.set(j,swaps.get(left-1)??left-1)}}return [a.map(String)]}
 if(!c.items.length||c.items.length>500)throw Error('请输入1–500个选项');
 if(c.items.some(x=>!x.trim()))throw Error('选项不能为空');
 if(c.mode==='wheel'){integer(c.items.length,2,50);return [[c.items[choose(c.items.length)]]]}
 const a=shuffle(c.items,random);
 if(c.mode==='draw'){integer(c.count,1,a.length);return [a.slice(0,c.count)]}
 if(c.mode==='sort')return [a];
 if(c.mode==='group'){integer(c.count,1,Math.min(a.length,50));const groups:string[][]=Array.from({length:c.count},()=>[]);a.forEach((x,i)=>groups[i%c.count].push(x));return groups}
 if(c.mode==='pair'){const pairs:string[][]=[];for(let i=0;i<a.length;i+=2)pairs.push(a.slice(i,i+2));return pairs}
 if(c.mode==='seat'){integer(c.rows,1,50);integer(c.cols,1,50);if(c.rows*c.cols<a.length||c.rows*c.cols>500)throw Error('座位容量需覆盖人数且不超过500');return Array.from({length:c.rows},(_,r)=>Array.from({length:c.cols},(_,k)=>a[r*c.cols+k]||'空座'))}
 throw Error('未知工具');
}
