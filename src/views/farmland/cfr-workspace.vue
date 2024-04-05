<script setup lang="tsx">
import { reactive, ref, unref, watch } from 'vue'
import { ElMessage, ElDivider, ElPopconfirm } from 'element-plus'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { Table } from '@/components/Table'
import { Dialog } from '@/components/Dialog'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import Write from '@/views/Components/Dialog/Write.vue'
import request from '@/axios'
import { ContentWrap } from '@/components/ContentWrap'
import { BaseButton } from '@/components/Button'
import { useRouter } from 'vue-router'
import { actionDict } from '@/constants/dict'

defineOptions({
  name: 'FarmlandCfrWorkspace'
})
const { push } = useRouter()
const queryForm = reactive<{
  pageSize: number
  currentPage: number
}>({
  pageSize: 10,
  currentPage: 1
})
const moduleText = '茬口'
const dialogVisible = ref(false)
const searchVisible = ref(false)
const dialogTitle = ref(moduleText)

const actionType = ref('')
const cfrWorkspaceEntity = {
  cwid: null,
  name: null,
  wsn: null,
  cfrWorkspaceId: null,
  goods: []
}
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'cwid',
    label: 'ID',
    form: {
      hidden: true
    }
  },
  {
    field: 'productName',
    label: '产品',
    search: {
      hidden: false
    }
  },
  {
    field: 'workspaceName',
    label: '地块'
  },
  {
    field: 'area',
    label: '面积'
  },
  {
    field: 'action',
    label: '操作',
    cwidth: 360,
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
const getCfrWorkspaceList = async () => {
  tableData.loading = true
  const res = await request.get({ url: 'api/v1/farmland/cfr-workspace', params: queryForm })
  if (!res) return
  tableData.loading = false
  tableData.total = Number(res.data.totalRow)
  tableData.list = res.data.records
}

const temp = reactive({ ...cfrWorkspaceEntity })
const rules = ref({
  name: [{ required: true, message: '不能未空！', trigger: 'blur' }]
})
const setSearchParams = (data: Recordable) => {
  queryForm.currentPage = 1
  Object.assign(queryForm, Object.keys(data).length > 0 ? data : cfrWorkspaceEntity)
  getCfrWorkspaceList()
}

const handleCreate = () => {
  push('/farmland/cfr/create')
}
const handleUpdate = (row) => {
  dialogVisible.value = true
  actionType.value = 'update'
  Object.assign(temp, row)
}

const handleDisable = async (row: any) => {
  const res = await request.put({
    url: 'api/v1/farmland/cfr-workspace/' + row.cwid,
    data: { deleted: 1 }
  })
  if (res) {
    ElMessage.success('操作成功！')
    await getCfrWorkspaceList()
  }
}

const writeRef = ref<ComponentRef<typeof Write>>()
const createData = async () => {
  const writer = unref(writeRef)
  const formData = await writer?.submit()
  if (formData) {
    let res: any
    if (formData.cwid) {
      res = await request.put({
        url: 'api/v1/farmland/cfr-workspace/' + formData.cwid,
        data: formData
      })
    } else {
      res = await request.post({ url: 'api/v1/farmland/cfr-workspace', data: formData })
    }
    if (res) {
      dialogVisible.value = false
      ElMessage.success('保存成功！')
      await getCfrWorkspaceList()
    }
  }
}

const handleDelete = async (row) => {
  const res = await request.delete({ url: 'api/v1/farmland/cfr-workspace/' + row.cwid })
  if (res) {
    await getCfrWorkspaceList()
    ElMessage.success('删除成功！')
  }
}

watch(actionType, (val) => {
  dialogTitle.value = actionDict[val] + moduleText
})
watch([() => queryForm.pageSize, () => queryForm.currentPage], () => {
  getCfrWorkspaceList()
})

const init = () => {
  getCfrWorkspaceList()
}

init()
</script>

<template>
  <content-wrap>
    <BaseButton type="primary" @click="searchVisible = !searchVisible">检索</BaseButton>
    <BaseButton type="primary" @click="getCfrWorkspaceList">刷新</BaseButton>
    <BaseButton type="success" @click="handleCreate">新建</BaseButton>
    <BaseButton type="primary" @click="handleCreate">茬口物料历史</BaseButton>
    <BaseButton type="primary" @click="handleCreate">茬口档案</BaseButton>
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
