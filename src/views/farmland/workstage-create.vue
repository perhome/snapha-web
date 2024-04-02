<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ContentDetailWrap } from '@/components/ContentDetailWrap'
import { Form, FormSchema } from '@/components/Form'
import { useRouter } from 'vue-router'

import { useForm } from '@/hooks/web/useForm'
import { useValidator } from '@/hooks/web/useValidator'
import request from '@/axios'
import { ElMessage } from 'element-plus'

const { required } = useValidator()

const { push, go } = useRouter()
const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods

const loading = ref(false)
const workstageForm = {
  name: null,
  wsn: null,
  workspace_sn: null,
  goods: []
}
const form = reactive({ ...workstageForm })

const formSchema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    formItemProps: {
      rules: [required()]
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'wsn',
    label: '编号',
    component: 'Input',
    formItemProps: {
      // rules: [required()]
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'price',
    label: '成本',
    component: 'Input',
    formItemProps: {},
    colProps: {
      span: 6
    }
  },
  {
    field: 'goods',
    label: '物料',
    component: 'GoodsMultiple',
    colProps: {
      span: 24
    }
  }
])
const rules = reactive({})

const save = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    loading.value = true
    const formData = await getFormData()
    const res = await request.post({
      url: 'api/v1/farmland/workstage',
      data: formData
    })
    loading.value = false
    if (res) {
      elForm?.resetFields()
      ElMessage.success('提交成功！')
    }
  }
  return false
}
</script>

<template>
  <ContentDetailWrap title="新建" @back="push('/system/user/index')" v-loading="loading">
    <Form :model="form" :rules="rules" @register="formRegister" :schema="formSchema" />
    <template #header>
      <BaseButton @click="go(-1)">返回</BaseButton>
      <BaseButton type="primary" @click="save">保存</BaseButton>
    </template>
    <template #footer>
      <BaseButton @click="go(-1)">返回</BaseButton>
      <BaseButton type="primary" @click="save">保存</BaseButton>
    </template>
  </ContentDetailWrap>
</template>
