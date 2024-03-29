<script setup lang="tsx">
import {
  ElMessage,
  ElTag,
  ElRow,
  ElCol,
  ElTree,
  ElDivider,
  ElPopconfirm,
  ElLink
} from 'element-plus'
import { h, reactive, ref, unref, watch } from 'vue'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { Table, TableColumn } from '@/components/Table'
import { Dialog } from '@/components/Dialog'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import Detail from '@/views/Components/Dialog/Detail.vue'
import Write from '@/views/Components/Dialog/Write.vue'
import request from '@/axios'
import { ContentWrap } from '@/components/ContentWrap'
import { BaseButton } from '@/components/Button'

defineOptions({
  name: 'SystemWorkspace'
})

const queryForm = reactive<{
  pageSize: number
  currentPage: number
  parentWid: number
}>({
  pageSize: 10,
  currentPage: 1,
  parentWid: 0
})

const structTreeProps = {
  children: 'children',
  label: 'name'
}
const structTreeData = ref([])

const dialogVisible = ref(false)
const dialogTitle = ref('地块')
const actionType = ref('')
const searchVisible = ref(false)
const workspaceEntity = {
  wid: '',
  name: '',
  wsn: '',
  block: null,
  blockUnit: null,
  parentWid: 0,
  area: null,
  scheme: 1
}

const farmlandUserGroupList = ref([]) as any
const getFarmlandUserGroupList = async () => {
  const res: IResponse<PageRecords> = await request.get({ url: 'api/v1/group/farmland' })
  if (res) {
    farmlandUserGroupList.value = res.data.records
  }
}

const getStructTreeData = async () => {
  const res = await request.get({ url: 'api/v1/workspace/struct-tree' })
  if (res) {
    structTreeData.value = res.data
  }
}

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'name',
    label: '地块名称',
    search: {
      hidden: true
    },
    form: {
      colProps: {
        span: 12
      }
    },
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElLink,
        {
          type: row.scheme != 0 ? 'primary' : 'success',
          disabled: row.scheme != 0,
          onClick: () => handleNextByWid(row)
        },
        () => cellValue
      )
    }
  },
  {
    field: 'wsn',
    label: '编号',
    form: {
      hidden: true
    }
  },
  {
    field: 'area',
    label: '面积'
  },
  {
    field: 'block',
    label: '最小块数',
    hidden: true
  },
  {
    field: 'blockUnit',
    label: '每间块数',
    hidden: true
  },
  {
    field: 'area',
    label: '面积'
  },
  {
    field: 'groupName',
    label: '责任人',
    form: {
      hidden: false
    }
  },
  {
    field: 'scheme',
    label: '模式',
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(
        ElTag,
        {
          type: 'info'
        },
        () => (cellValue === 1 ? '正常' : cellValue === 2 ? '套种' : '结构')
      )
    },
    form: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '结构',
            value: 0
          },
          {
            label: '正常',
            value: 1
          },
          {
            label: '套种',
            value: 2
          }
        ]
      },
      hidden: false
    }
  },
  {
    field: 'action',
    label: '操作',
    width: 400,
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
              <BaseButton type="success" onClick={() => handleDetail(data.row)}>
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
const extraSchema: FormSchema[] = []
const formExtraSchema: FormSchema[] = [
  {
    field: 'groupId',
    label: '负责小组',
    value: null,
    component: 'Select',
    componentProps: {
      optionsAlias: {
        labelField: 'name',
        valueField: 'gid'
      },
      options: farmlandUserGroupList
    }
  }
]

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
const getWorkspaceList = async () => {
  tableData.loading = true
  const res = await request.get({ url: 'api/v1/workspace', params: queryForm })
  if (!res) return
  tableData.loading = false
  tableData.total = Number(res.data.totalRow)
  tableData.list = res.data.records
}

const temp = reactive({ ...workspaceEntity })
const rules = ref({
  name: [{ required: true, message: '不能未空！', trigger: 'blur' }]
})
const setSearchParams = (data: Recordable) => {
  queryForm.currentPage = 1
  Object.assign(queryForm, {
    ...queryForm,
    ...data
  })
  getWorkspaceList()
}

const handleNextByWid = (row) => {
  queryForm.parentWid = row.wid
  getWorkspaceList()
}

const handleNodeClick = (data: any) => {
  handleNextByWid(data)
}

const handleCreate = () => {
  dialogVisible.value = true
  actionType.value = 'create'
  dialogTitle.value = '新增地块'
  Object.assign(temp, workspaceEntity)
  temp.parentWid = queryForm.parentWid
}
const handleUpdate = (row) => {
  dialogVisible.value = true
  actionType.value = 'update'
  dialogTitle.value = '修改地块'
  Object.assign(temp, row)
}

const handleDisable = async (row: any) => {
  const res = await request.put({
    url: 'api/v1/workspace/' + row.wid,
    data: { deleted: 1 }
  })
  if (res) {
    ElMessage.success('操作成功！')
    await getWorkspaceList()
  }
}
const handleDetail = (row) => {
  dialogVisible.value = true
  actionType.value = 'detail'
  dialogTitle.value = '详情'
  Object.assign(temp, row)
}

const writeRef = ref<ComponentRef<typeof Write>>()
const createData = async () => {
  const writer = unref(writeRef)
  const formData = await writer?.submit()
  if (formData) {
    let res: any
    if (formData.wid) {
      res = await request.put({ url: 'api/v1/workspace/' + formData.wid, data: formData })
    } else {
      res = await request.post({ url: 'api/v1/workspace', data: formData })
    }
    if (res) {
      dialogVisible.value = false
      ElMessage.success('保存成功！')
      await getWorkspaceList()
    }
  }
}

const handleDelete = async (row) => {
  if (row.parentWid == '0' || row.schema == 0) return ElMessage.warning('不能删除顶级地块！')

  const res = await request.delete({ url: 'api/v1/workspace/' + row.wid })
  if (res) {
    await getWorkspaceList()
    ElMessage.success('删除成功！')
  }
}
// 更换地块负责小组
// const handleManagerChange = async (row) => {
//   if (!row.groupNewId) {
//     ElMessage.error('未选择种植小组!')
//     return
//   }
//   if (row.groupNewId == row.groupId) {
//     ElMessage.error('种植小组未更改！')
//     return
//   }
//   const res = await request.post({ url: 'api/v2/workspace/manager', data: row })
//   if (res) {
//     ElMessage.success('更新成功！')
//     await getWorkspaceList()
//   }
// }
watch([() => queryForm.pageSize, () => queryForm.currentPage], () => {
  getWorkspaceList()
})

const init = () => {
  getStructTreeData()
  getFarmlandUserGroupList()
  getWorkspaceList()
}

init()
</script>

<template>
  <el-row :gutter="10">
    <el-col :span="4">
      <content-wrap>
        <el-tree
          default-expand-all
          :expand-on-click-node="false"
          :data="structTreeData"
          :props="structTreeProps"
          @node-click="handleNodeClick"
        />
      </content-wrap>
    </el-col>
    <el-col :span="20">
      <content-wrap>
        <BaseButton type="primary" @click="searchVisible = !searchVisible">检索</BaseButton>
        <BaseButton type="success" @click="handleCreate">新增地块</BaseButton>
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
    </el-col>
  </el-row>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write
      v-if="actionType !== 'detail'"
      ref="writeRef"
      :form-schema="allSchemas.formSchema"
      :rules="rules"
      :current-row="temp"
    />

    <Detail
      v-if="actionType === 'detail'"
      :detail-schema="allSchemas.detailSchema"
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
