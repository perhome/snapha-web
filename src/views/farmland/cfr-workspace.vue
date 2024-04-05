<script setup lang="tsx">
import { h, reactive, ref, unref, watch } from 'vue'
import { ElMessage, ElDivider, ElPopconfirm, ElTag } from 'element-plus'
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
import { actionDict } from '@/constants/dict'
import { useValidator } from '@/hooks/web/useValidator'

defineOptions({
  name: 'FarmlandCfrWorkspace'
})

const { required } = useValidator()
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
  startDate: null,
  endDate: null,
  realStartDate: null,
  realEndDate: null,
  cfrWorkspaceId: null,
  goods: []
}
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'cwid',
    label: 'ID',
    form: {
      hidden: true
    },
    width: 160
  },
  {
    field: 'productName',
    label: '产品',
    form: {
      hidden: true
    },
    search: {
      component: 'Product',
      hidden: false
    }
  },
  {
    field: 'workspaceName',
    label: '地块',
    search: {
      component: 'WorkspaceMultiple',
      hidden: false
    },
    form: {
      hidden: true
    }
  },
  {
    field: 'startDate',
    label: '计划开始',
    search: {
      component: 'DatePicker',
      hidden: false
    },
    form: {
      hidden: true
    }
  },
  {
    field: 'yield',
    label: '产量',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    }
  },
  {
    field: 'realStartDate',
    label: '实际开始',
    hidden: true,
    search: {
      hidden: true
    },
    form: {
      component: 'DatePicker',
      hidden: false
    }
  },
  {
    field: 'realEndDate',
    label: '实际结束',
    hidden: true,
    search: {
      hidden: true
    },
    form: {
      component: 'DatePicker',
      hidden: false
    }
  },
  {
    field: 'area',
    label: '面积',
    formatter: (_: Recordable, __: TableColumn, cellValue: Number) => {
      return h(ElTag, { type: 'success' }, () => cellValue)
    },
    search: {
      hidden: true
    },
    form: {
      hidden: true
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
              <BaseButton type="primary" onClick={() => handleDetail(data.row)}>
                详情
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

const areaSchema = reactive<FormSchema[]>([
  {
    field: 'hitDate',
    label: '生效日期',
    component: 'DatePicker',
    componentProps: { valueFormat: 'YYYY-MM-DD' },
    formItemProps: {
      rules: [required()]
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'area',
    component: 'InputNumber',
    formItemProps: {
      rules: [required()]
    },
    colProps: {
      span: 24
    },
    label: '面积'
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

const handleUpdate = (row: any) => {
  dialogVisible.value = true
  actionType.value = 'update'
  Object.assign(temp, row)
}

const handleDetail = (row: any) => {
  dialogVisible.value = true
  actionType.value = 'detail'
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
const writeAreaRef = ref<ComponentRef<typeof Write>>()
const createData = async () => {
  switch (actionType.value) {
    case 'create':
    case 'update':
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
      break
    case 'areaChange':
      const writerArea = unref(writeAreaRef)
      const formAreaData = await writerArea?.submit()
      if (formAreaData) {
        console.log(formAreaData)
      }
      break
    default:
  }
}

const handleDelete = async (row) => {
  const res = await request.delete({ url: 'api/v1/farmland/cfr-workspace/' + row.cwid })
  if (res) {
    await getCfrWorkspaceList()
    ElMessage.success('删除成功！')
  }
}

const handleCellClick = (row: any, column: any, __: HTMLTableCellElement, ___: Event) => {
  switch (column.property) {
    case 'area':
      dialogVisible.value = true
      actionType.value = 'areaChange'
      Object.assign(temp, row)
      break
    default:
  }
}

watch(actionType, (val) => {
  if (actionDict[val]) dialogTitle.value = actionDict[val] + moduleText
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
      @cell-click="handleCellClick"
      :loading="tableData.loading"
      :pagination="{ total: tableData.total }"
      :border="false"
    />
  </content-wrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write
      v-if="actionType === 'update'"
      ref="writeRef"
      :form-schema="allSchemas.formSchema"
      :rules="rules"
      :current-row="temp"
    />

    <Write
      v-if="actionType === 'areaChange'"
      ref="writeAreaRef"
      :form-schema="areaSchema"
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
