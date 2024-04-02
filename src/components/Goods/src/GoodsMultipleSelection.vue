<script setup lang="ts">
import { ref, watch } from 'vue'
import request from '@/axios'
import { ElSelect, ElOption, ElTag, ElSpace } from 'element-plus'

interface GoodsScheme {
  goodsId: string
  goodsName: string
}

const goodsIds = defineModel<GoodsScheme[]>({ default: [] })
const goodsId = ref<string>('')
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

const handleRemove = (item: GoodsScheme) => {
  goodsIds.value = goodsIds.value?.filter((i) => i.goodsId != item.goodsId)
}

watch(goodsId, (val) => {
  if (!val) return
  goodsIds?.value.push({
    goodsId: val,
    goodsName: goodsList.value.find((i: any) => i.gid == val)?.name
  })
})
</script>

<template>
  <div>
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
    <el-space style="padding: 10px 0">
      <el-tag
        v-for="item in goodsIds"
        :key="item.goodsId"
        closable
        size="large"
        :disable-transitions="false"
        @close="handleRemove(item)"
      >
        {{ item.goodsName }}
      </el-tag>
    </el-space>
  </div>
</template>
