<script setup lang="tsx">
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
const cfrProductForm = {
  name: null,
  productId: null,
  workspaceIds: [],
  hitDate: null,
  cfrSn: null
}
const form = reactive({ ...cfrProductForm })

const formSchema = reactive<FormSchema[]>([
  {
    field: 'productId',
    label: '产品',
    component: 'Product',
    formItemProps: {
      rules: [required()]
    },
    colProps: {
      span: 12
    }
  },
  {
    field: 'hitDate',
    label: '创建日期',
    component: 'DatePicker',
    componentProps: { valueFormat: 'YYYY-MM-DD' },
    formItemProps: {
      rules: [required()]
    },
    colProps: {
      span: 12
    }
  },
  {
    field: 'cfrSn',
    label: '编号',
    component: 'Input',
    formItemProps: {},
    colProps: {
      span: 12
    }
  },
  {
    field: 'areaYield',
    label: '预计产量',
    component: 'InputNumber',
    colProps: {
      span: 12
    }
  },
  {
    field: 'workspaceIds',
    label: '地块',
    component: 'WorkspaceMultiple',
    formItemProps: {
      rules: [required()]
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'startDate',
    label: '开始日期',
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD'
    },
    formItemProps: {
      rules: [required()]
    },
    colProps: {
      span: 8
    }
  },
  {
    field: 'harvestDate',
    label: '收获日期',
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD'
    },
    formItemProps: {
      rules: [required()]
    },
    colProps: {
      span: 8
    }
  },
  {
    field: 'endDate',
    label: '结束日期',
    componentProps: {
      valueFormat: 'YYYY-MM-DD'
    },
    component: 'DatePicker',
    formItemProps: {
      rules: [required()]
    },
    colProps: {
      span: 8
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
      url: 'api/v1/farmland/cfr-product',
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
  <ContentDetailWrap title="新建" @back="push('/farmland/cfr-workspace')" v-loading="loading">
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
