<script setup lang="ts">
import { ref } from 'vue'
import request from '@/axios'
import { ElTreeSelect } from 'element-plus'

const productCategoryList = ref([])
const productCategoryId = defineModel({ type: String, default: '' })

const getProductCategoryList = async () => {
  const res = await request.get({
    url: 'api/v1/product-category/tree'
  })
  productCategoryList.value = res.data
}

getProductCategoryList()
</script>

<template>
  <el-tree-select
    v-model="productCategoryId"
    :data="productCategoryList"
    :render-after-expand="false"
    :default-expand-all="true"
    placeholder="请选择产品分类"
    clearable
    :props="{
      label: 'name',
      value: 'pcid',
      class: 'pb-5px pt-5px'
    }"
  />
</template>
