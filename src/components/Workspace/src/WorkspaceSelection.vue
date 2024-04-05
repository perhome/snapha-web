<script setup lang="ts">
import { ref } from 'vue'

import request from '@/axios'
import { ElTreeSelect } from 'element-plus'

const workspaceId = defineModel<string | null>({ default: null })
const parentSn = defineModel<string | null>('parentSn', { default: 'F' })
const showCheckbox = defineModel<boolean>('showCheckbox', { default: false })
const checkStrictly = defineModel<boolean>('checkStrictly', { default: true })
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
  <el-tree-select
    v-model="workspaceId"
    placeholder="请选择"
    :data="workspaceList"
    :props="{
      children: 'children',
      label: 'name',
      value: 'wid'
    }"
    :show-checkbox="showCheckbox"
    :check-strictly="checkStrictly"
    filterable
    clearable
  />
</template>
