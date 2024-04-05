<script setup lang="ts">
import { ref, watch } from 'vue'
import request from '@/axios'
import { ElSelect, ElOption } from 'element-plus'
import { SN } from '@/constants/dict'

const productId = defineModel<string | undefined>({ default: null })
const workspaceSn = defineModel<string | undefined>('workspaceSn', { default: SN.Farmland })
const productList = ref<any>([])

const getProductList = async (keyword: String) => {
  if (keyword.length < 2) return
  const { data } = await request.get({
    url: 'api/v1/product',
    params: {
      workspaceSn: workspaceSn.value,
      keyword: keyword
    }
  })
  productList.value = data.records
}

watch(
  productId,
  (val) => {
    if (!val) return
  },
  {
    immediate: true
  }
)
const init = () => {
  if (productId.value) {
    getProductList(productId.value)
  }
}
init()
</script>

<template>
  <el-select
    v-model="productId"
    placeholder="请输入产品"
    filterable
    remote
    :remote-method="getProductList"
    clearable
  >
    <el-option v-for="item in productList" :key="item.pid" :label="item.name" :value="item.pid" />
  </el-select>
</template>
