<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElSelect, ElOption } from 'element-plus'

import request from '@/axios'

interface unitScheme {
  uid: string
  name: string
  usn: string
}

const unitId = defineModel<String | String[] | undefined>({ default: undefined })
const unitName = defineModel<String | undefined>('unitName', { default: undefined })
const multiple = defineModel<boolean | undefined>('multiple', { default: false })

watch(unitId, (val) => {
  const unit = unitList.value.find((i: unitScheme) => i.uid == val)
  unitName.value = unit?.name
})

const unitList = ref<unitScheme[]>([])

const getUnitList = async () => {
  const res = await request.get({
    url: 'api/v1/unit/list'
  })
  unitList.value = res.data
}

getUnitList()
</script>

<template>
  <el-select v-model="unitId" :multiple="multiple" placeholder="请选择" filterable clearable>
    <el-option v-for="item in unitList" :key="item.uid" :label="item.name" :value="item.uid" />
  </el-select>
</template>
