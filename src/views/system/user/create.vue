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
const userForm = {
  name: '',
  usn: '',
  phone: '',
  presetPassword: '',
  departmentId: '',
  roles: ['USER']
}
const form = reactive({ ...userForm })

const roles = ref<any>([])
const getRolesApi = async () => {
  const { data } = await request.get({
    url: 'api/v1/user/role'
  })
  if (data) {
    Object.keys(data).forEach((key) => {
      roles.value.push({ label: key, value: key })
    })
  }
}
const getDepartmentApi = async () => {
  const { data } = await request.get({
    url: 'api/v1/system/department'
  })
  let options: any = []
  if (data) {
    data.forEach((item: any) => {
      options.push({
        label: item.name,
        value: item.did
      })
    })
  }
  return options
}
getRolesApi()

const formSchema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '姓名',
    component: 'Input',
    formItemProps: {
      rules: [required()]
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'usn',
    label: '编号',
    component: 'Input',
    formItemProps: {
      rules: [required()]
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'phone',
    label: '电话',
    component: 'Input',
    formItemProps: {},
    colProps: {
      span: 6
    }
  },
  {
    field: 'departmentId',
    label: '部门',
    component: 'Select',
    componentProps: {
      options: []
    },
    // 远程加载option
    optionApi: async () => {
      return await getDepartmentApi()
    },
    formItemProps: {},
    colProps: {
      span: 6
    }
  },
  {
    field: 'presetPassword',
    label: '密码',
    component: 'InputPassword',
    formItemProps: {},
    colProps: {
      span: 24
    }
  },
  {
    field: 'roles',
    label: '权限',
    component: 'CheckboxGroup',
    componentProps: {
      options: roles
    },
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
      url: 'api/v1/user',
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
