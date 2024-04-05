<script setup lang="tsx">
import { ElSpace, ElDivider } from 'element-plus'
import { BaseButton } from '@/components/Button'
import { useRouter } from 'vue-router'
const { push } = useRouter()
</script>

<template>
  <el-divider content-position="left"> 计划 </el-divider>
  <el-space>
    <base-button type="primary" @click="push('/')"> 轮作计划 </base-button>
    <base-button type="primary" @click="push('/')"> 种植计划 </base-button>
  </el-space>
  <el-divider content-position="left"> 物料 </el-divider>
  <el-space>
    <base-button type="primary" @click="push('/')"> 茬口档案 </base-button>
    <base-button type="primary" @click="push('/')"> 物料历史 </base-button>
    <base-button type="primary" @click="push('/')"> 物料统计 </base-button>
  </el-space>
  <el-divider content-position="left"> 流程 </el-divider>
  <el-space>
    <base-button type="primary" @click="push('/')"> 人员管理 </base-button>
    <base-button type="primary" @click="push('/')"> 流程审核 </base-button>
  </el-space>
</template>
