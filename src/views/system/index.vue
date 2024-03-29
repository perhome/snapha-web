<script setup lang="tsx">
import { ElSpace, ElDivider } from 'element-plus'
import { BaseButton } from '@/components/Button'
import { useRouter } from 'vue-router'
const { push } = useRouter()
</script>

<template>
  <el-divider content-position="left"> 系统设置 </el-divider>
  <el-space>
    <base-button type="primary" @click="push('/')"> 基本设置 </base-button>
  </el-space>
  <el-divider content-position="left"> 公司设置 </el-divider>
  <el-space>
    <base-button type="primary" @click="push('/system/user')"> 部门设置 </base-button>
    <base-button type="primary" @click="push('/system/user')"> 岗位设置 </base-button>
    <base-button type="primary" @click="push('/system/user')"> 用户组别 </base-button>
  </el-space>
  <el-divider content-position="left"> 流程设置 </el-divider>
  <el-space>
    <base-button type="primary" @click="push('/')"> 基本设置 </base-button>
    <base-button type="primary" @click="push('/')"> 流程定义 </base-button>
    <base-button type="primary" @click="push('/')"> 流程管理 </base-button>
  </el-space>
</template>
