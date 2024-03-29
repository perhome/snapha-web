<script setup lang="tsx">
import { h, reactive, ref, unref, watch } from 'vue'
import { ElMessage, ElDivider, ElPopconfirm, ElSpace, ElTag } from 'element-plus'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { Table, TableColumn } from '@/components/Table'
import { Dialog } from '@/components/Dialog'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import Write from '@/views/Components/Dialog/Write.vue'
import request from '@/axios'
import { ContentWrap } from '@/components/ContentWrap'
import { BaseButton } from '@/components/Button'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'SystemUserIndex'
})

const { push } = useRouter()

const queryForm = reactive<{
  pageSize: number
  currentPage: number
}>({
  pageSize: 10,
  currentPage: 1
})
const moduleText = '用户'
const actionDict = {
  disable: '禁用',
  enable: '启用',
  create: '新增',
  update: '编辑',
  delete: '删除'
}
const dialogVisible = ref(false)
const searchVisible = ref(false)
const dialogTitle = ref(moduleText)

const actionType = ref('')
const userEntity = {
  uid: null,
  name: null,
  usn: null,
  departmentId: null
}
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'uid',
    label: 'ID',
    form: {
      hidden: true
    }
  },
  {
    field: 'name',
    label: '姓名',
    search: {
      hidden: false
    }
  },
  {
    field: 'usn',
    label: '编号'
  },
  {
    field: 'created',
    label: '创建日期',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    }
  },
  {
    field: 'roles',
    label: '角色',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    formatter: (_: Recordable, __: TableColumn, cellValue: string[]) => {
      return h(ElSpace, () => cellValue.map((item) => h(ElTag, { type: 'success' }, () => item)))
    }
  },
  {
    field: 'action',
    label: '操作',
    width: 360,
    form: {
      hidden: true
    },
    search: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: any) => {
          return (
            <>
              <BaseButton type="primary" onClick={() => handleUpdate(data.row)}>
                编辑
              </BaseButton>
              <ElPopconfirm
                title="确认禁用？"
                onConfirm={() => handleDisable(data.row)}
                v-slots={{
                  reference: () => <BaseButton type="warning">禁用</BaseButton>
                }}
              ></ElPopconfirm>
              <ElPopconfirm
                title="确认删除？"
                onConfirm={() => handleDelete(data.row)}
                v-slots={{
                  reference: () => <BaseButton type="danger">删除</BaseButton>
                }}
              ></ElPopconfirm>
            </>
          )
        }
      }
    }
  }
])
const extraSchema: FormSchema[] = []
const formExtraSchema: FormSchema[] = []

const { allSchemas } = useCrudSchemas(crudSchemas)
allSchemas.searchSchema.push(...extraSchema)
allSchemas.formSchema.push(...extraSchema, ...formExtraSchema)

const tableData = reactive<{
  loading: boolean
  list: []
  total: number
}>({
  loading: false,
  list: [],
  total: 0
})
const getUserList = async () => {
  tableData.loading = true
  const res = await request.get({ url: 'api/v1/user', params: queryForm })
  if (!res) return
  tableData.loading = false
  tableData.total = Number(res.data.totalRow)
  tableData.list = res.data.records
}

const temp = reactive({ ...userEntity })
const rules = ref({
  name: [{ required: true, message: '不能未空！', trigger: 'blur' }]
})
const setSearchParams = (data: Recordable) => {
  queryForm.currentPage = 1
  Object.assign(queryForm, Object.keys(data).length > 0 ? data : userEntity)
  getUserList()
}

const handleCreate = () => {
  push('/system/user/create')
}
const handleUpdate = (row) => {
  dialogVisible.value = true
  actionType.value = 'update'
  Object.assign(temp, row)
}

const handleDisable = async (row: any) => {
  const res = await request.put({
    url: 'api/v1/user/' + row.uid,
    data: { deleted: 1 }
  })
  if (res) {
    ElMessage.success('操作成功！')
    await getUserList()
  }
}
const writeRef = ref<ComponentRef<typeof Write>>()
const createData = async () => {
  const writer = unref(writeRef)
  const formData = await writer?.submit()
  if (formData) {
    let res: any
    if (formData.uid) {
      res = await request.put({ url: 'api/v1/user/' + formData.uid, data: formData })
    } else {
      res = await request.post({ url: 'api/v1/user', data: formData })
    }
    if (res) {
      dialogVisible.value = false
      ElMessage.success('保存成功！')
      await getUserList()
    }
  }
}

const handleDelete = async (row) => {
  const res = await request.delete({ url: 'api/v1/user/' + row.uid })
  if (res) {
    await getUserList()
    ElMessage.success('删除成功！')
  }
}
watch(actionType, (val) => {
  dialogTitle.value = actionDict[val] + moduleText
})
watch([() => queryForm.pageSize, () => queryForm.currentPage], () => {
  getUserList()
})

const init = () => {
  getUserList()
}

init()
</script>

<template>
  <content-wrap>
    <BaseButton type="primary" @click="searchVisible = !searchVisible">检索</BaseButton>
    <BaseButton type="primary" @click="getUserList">刷新</BaseButton>
    <BaseButton type="success" @click="handleCreate">新建</BaseButton>
    <el-divider />
    <Search
      v-if="searchVisible"
      :schema="allSchemas.searchSchema"
      @search="setSearchParams"
      @reset="setSearchParams"
    />
    <Table
      v-model:pageSize="queryForm.pageSize"
      v-model:currentPage="queryForm.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableData.list"
      :loading="tableData.loading"
      :pagination="{ total: tableData.total }"
      :border="false"
    />
  </content-wrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write
      v-if="actionType !== 'detail'"
      ref="writeRef"
      :form-schema="allSchemas.formSchema"
      :rules="rules"
      :current-row="temp"
    />

    <template #footer>
      <BaseButton v-if="actionType !== 'detail'" @click="createData()" type="primary">
        保存
      </BaseButton>
      <BaseButton @click="dialogVisible = false">关闭</BaseButton>
    </template>
  </Dialog>
</template>
