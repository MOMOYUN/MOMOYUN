import {test} from 'node:test';
import assert from 'node:assert/strict';
import {eventService} from '../cloudfunctions/event/service.ts';
import type {StoredEvent,Repository} from '../cloudfunctions/event/service.ts';
const rules={name:'测试活动',participants:[{id:'1',name:'甲'},{id:'2',name:'乙'}],prizes:[{id:'a',name:'一等奖',batches:[1]}]};
function fixture(){
  let saved:StoredEvent;
  const repo:Repository={async insert(r){saved=structuredClone(r);return 'event'},async transaction(_id,fn){const copy=structuredClone(saved);const result=fn(copy);saved=copy;return result}};
  let calls=0;
  return {service:eventService(repo,()=>{calls++;return 0}),calls:()=>calls};
}
test('拒绝未登录和非所有者，拒绝过期版本',async()=>{
 const {service}=fixture();await assert.rejects(service.create('',rules),/UNAUTHENTICATED/);
 await service.create('owner',rules);
 await assert.rejects(service.command('other','event','start',0,'request-1'),/FORBIDDEN/);
 await assert.rejects(service.command('owner','event','start',1,'request-1'),/VERSION_CONFLICT/);
 assert.equal((await service.command('owner','event','start',0,'request-1')).version,1);
});
test('停止重试返回原始结果且只抽取一次；另一个停止请求被拒绝',async()=>{
 const {service,calls}=fixture();await service.create('owner',rules);
 await service.command('owner','event','start',0,'request-1');
 const result=await service.command('owner','event','stop',1,'request-2');
 assert.deepEqual(await service.command('owner','event','stop',1,'request-2'),result);
 assert.equal(calls(),1);
 await assert.rejects(service.command('owner','event','stop',1,'request-3'),/VERSION_CONFLICT/);
 await assert.rejects(service.command('owner','event','next',2,'request-2'),/REQUEST_ID_REUSED/);
});
