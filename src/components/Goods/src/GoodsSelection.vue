<script setup lang="ts">
import { ref, watch } from 'vue'
import request from '@/axios'
import { ElSelect, ElOption } from 'element-plus'

const goodsId = defineModel<String | undefined>({ default: undefined })
const goodsList = ref<any>([])

const getGoodsList = async (keyword: String) => {
  if (keyword.length < 2) return
  const { data } = await request.get({
    url: 'api/v1/goods',
    params: {
      keyword: keyword
    }
  })
  goodsList.value = data.records
}

watch(
  goodsId,
  (val) => {
    if (!val) return
  },
  {
    immediate: true
  }
)
const init = () => {
  if (goodsId.value) {
    getGoodsList(goodsId.value)
  }
}
init()
</script>

<template>
  <el-select
    v-model="goodsId"
    placeholder="请输入物料"
    filterable
    remote
    :remote-method="getGoodsList"
    clearable
  >
    <el-option v-for="item in goodsList" :key="item.gid" :label="item.name" :value="item.gid" />
  </el-select>
</template>
