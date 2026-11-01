<script setup lang="ts">
import {ref} from 'vue';import type {EventState} from '../../../../../packages/shared-types/index';
const name=ref(uni.getStorageSync('recentName')||'我的活动'),names=ref(uni.getStorageSync('recentNames')||'张三\n李四\n王五'),busy=ref(false),error=ref(''),state=ref<EventState|null>(null);
async function create(){busy.value=true;error.value='';try{if(!name.value.trim()||!names.value.trim())throw new Error('请填写活动名称与名单');uni.setStorageSync('recentName',name.value);uni.setStorageSync('recentNames',names.value);uni.showToast({title:'已保存本机草稿',icon:'success'})}catch(e){error.value=(e as Error).message}finally{busy.value=false}}
</script><template><view class="page"><view class="card"><text>活动设置</text><input v-model="name" placeholder="活动名称"/><textarea v-model="names" placeholder="每行一名参与人"/><view class="muted">每行一个名字，同名参与人请添加编号。草稿保存在当前设备。</view></view><button :disabled="busy" @click="create">保存本机草稿</button><view class="muted">{{error}}</view></view></template>
