<script setup lang="ts">
import { ref } from 'vue'

import request from '@/axios'
import { ElTreeSelect } from 'element-plus'
import { SN } from '@/constants/dict'

const workspaceIds = defineModel<String[] | null>({ default: [] })
const parentSn = defineModel<String | undefined>('parentSn', { default: SN.Farmland })
const workspaceList = ref<any>([])

const getWorkspaceList = async () => {
  const res = await request.get({
    url: 'api/v1/workspace/tree',
    params: {
      parentSn: parentSn.value
    }
  })
  workspaceList.value = res.data
}
getWorkspaceList()
</script>

<template>
  <div>
    <el-tree-select
      v-model="workspaceIds"
      placeholder="请选择"
      :data="workspaceList"
      multiple
      show-checkbox
      node-key="wid"
      :props="{
        label: 'name',
        value: 'wid',
        class: 'pb-5px pt-5px'
      }"
      filterable
      clearable
    />
    <slot name="footer">
      <base-button type="primary" @click="$emit('create')">新建地块</base-button>
    </slot>
  </div>
</template>
