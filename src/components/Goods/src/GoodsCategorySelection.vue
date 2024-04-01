<script setup lang="ts">
import { ref } from 'vue'
import request from '@/axios'
import { ElTreeSelect } from 'element-plus'

const goodsCategoryList = ref([])
const goodsCategoryId = defineModel<String | undefined>({ default: '' })

const getGoodsCategoryList = async () => {
  const res = await request.get({
    url: 'api/v1/goods-category/tree'
  })
  goodsCategoryList.value = res.data
}

getGoodsCategoryList()
</script>

<template>
  <el-tree-select
    v-model="goodsCategoryId"
    :data="goodsCategoryList"
    :render-after-expand="false"
    :default-expand-all="true"
    placeholder="请选择物料分类"
    clearable
    :props="{
      label: 'name',
      value: 'gcid',
      class: 'pb-5px pt-5px'
    }"
  />
</template>
