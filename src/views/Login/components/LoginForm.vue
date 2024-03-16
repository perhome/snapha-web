<script setup lang="tsx">
import { reactive, ref, watch, onMounted, unref } from 'vue'
import { Form, FormSchema } from '@/components/Form'

import { ElButton, ElCheckbox, ElLink } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'

import { getUserInfoApi, loginApi } from '@/api/login'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import { UserLoginType } from '@/api/login/types'
import { useValidator } from '@/hooks/web/useValidator'
import { useUserStore } from '@/store/modules/user'

const { required } = useValidator()
const emit = defineEmits(['to-register'])

const appStore = useAppStore()
const userStore = useUserStore()
const permissionStore = usePermissionStore()
const { currentRoute, addRoute, push } = useRouter()

const rules = {
  passport: [required()],
  password: [required()]
}

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return <h2 class="text-2xl font-bold text-center w-[100%]">登陆</h2>
        }
      }
    }
  },
  {
    field: 'passport',
    label: '账户',
    value: 'demo',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: '你的账户'
    }
  },
  {
    field: 'password',
    label: '密码',
    value: 'demo',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      placeholder: '你的账户密码'
    }
  },
  {
    field: 'tool',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex justify-between items-center w-[100%]">
                <ElCheckbox v-model={remember.value} label="记住用户" size="small" />
                <ElLink type="primary" underline={false}>
                  忘记密码
                </ElLink>
              </div>
            </>
          )
        }
      }
    }
  },
  {
    field: 'login',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="w-[100%]">
                <ElButton loading={loading.value} type="primary" class="w-[100%]" onClick={signIn}>
                  登陆
                </ElButton>
              </div>
              <div class="w-[100%] mt-15px">
                <ElButton class="w-[100%]" onClick={toRegister}>
                  注册
                </ElButton>
              </div>
            </>
          )
        }
      }
    }
  }
])

const remember = ref(userStore.getRememberMe)

const initLoginInfo = () => {
  const loginInfo = userStore.getLoginInfo
  if (loginInfo) {
    const { passport, password } = loginInfo
    setValues({ passport, password })
  }
}
onMounted(() => {
  initLoginInfo()
})

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose, setValues } = formMethods

const loading = ref(false)

const redirect = ref<string>('')

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)

// 登录
const signIn = async () => {
  const formRef = await getElFormExpose()
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const formData = await getFormData<UserLoginType>()

      try {
        const res = await loginApi(formData)

        if (res) {
          // 是否记住我
          if (unref(remember)) {
            userStore.setLoginInfo({
              passport: formData.passport,
              password: ''
            })
          } else {
            userStore.setLoginInfo(undefined)
          }
          const data = res.data
          userStore.setRememberMe(unref(remember))
          userStore.setAccessToken(data.accessToken)
          userStore.setRefreshToken(data.refreshToken)
          const userInfoRes = await getUserInfoApi()
          userStore.setUserInfo(userInfoRes.data)
          // 是否使用动态路由
          if (appStore.getDynamicRouter) {
            getRole()
          } else {
            await permissionStore.generateRoutes('static').catch(() => {})
            permissionStore.getAddRouters.forEach((route) => {
              addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
            })
            permissionStore.setIsAddRouters(true)
            push({ path: redirect.value || permissionStore.addRouters[0].path })
          }
        }
      } finally {
        loading.value = false
      }
    }
  })
}

// 获取角色信息
const getRole = async () => {
  await permissionStore.generateRoutes('frontEnd', userStore.getUserInfo?.roles).catch(() => {})
  permissionStore.getAddRouters.forEach((route) => {
    addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
  })
  permissionStore.setIsAddRouters(true)
  push({ path: redirect.value || permissionStore.addRouters[0].path })
}

// 去注册页面
const toRegister = () => {
  emit('to-register')
}
</script>

<template>
  <Form
    :schema="schema"
    :rules="rules"
    label-position="top"
    :hide-required-asterisk="true"
    size="large"
    class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
    @register="formRegister"
  />
</template>
