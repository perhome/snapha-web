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
import { actionDict } from '@/constants/dict'

defineOptions({
  name: 'SystemProductIndex'
})

const queryForm = reactive<{
  pageSize: number
  currentPage: number
}>({
  pageSize: 10,
  currentPage: 1
})
const moduleText = '产品'
const dialogVisible = ref(false)
const searchVisible = ref(false)
const dialogTitle = ref(moduleText)

const actionType = ref('')
const productEntity = {
  pid: null,
  name: null,
  psd: null,
  parentPid: null,
  categoryId: null
}
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'pid',
    label: 'ID',
    form: {
      hidden: true
    }
  },
  {
    field: 'name',
    label: '名称',
    search: {
      hidden: false
    }
  },
  {
    field: 'psn',
    label: '编号'
  },
  {
    field: 'categoryId',
    label: '分类',
    hidden: true,
    form: { component: 'ProductCategory', hidden: false },
    search: {
      component: 'ProductCategory',
      hidden: false
    }
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
                onConfirm={() => handleSoftDelete(data.row)}
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
const getProductList = async () => {
  tableData.loading = true
  const res = await request.get({ url: 'api/v1/product', params: queryForm })
  tableData.loading = false
  tableData.total = Number(res.data.totalRow)
  tableData.list = res.data.records
}

const temp = reactive({ ...productEntity })
const rules = ref({
  name: [{ required: true, message: '不能未空！', trigger: 'blur' }]
})
const setSearchParams = (data: Recordable) => {
  queryForm.currentPage = 1
  Object.assign(queryForm, Object.keys(data).length > 0 ? data : productEntity)
  getProductList()
}

const handleCreate = () => {
  dialogVisible.value = true
  actionType.value = 'create'
  Object.assign(temp, productEntity)
}

const handleUpdate = (row) => {
  dialogVisible.value = true
  actionType.value = 'update'
  Object.assign(temp, row)
}

const handleSoftDelete = async (row: any) => {
  const res = await request.put({
    url: 'api/v1/user/' + row.pid,
    data: { deleted: 1 }
  })
  if (res) {
    ElMessage.success('操作成功！')
    await getProductList()
  }
}

const handleDelete = async (row) => {
  const res = await request.delete({ url: 'api/v1/product/' + row.pid })
  if (res) {
    await getProductList()
    ElMessage.success('删除成功！')
  }
}

const writeRef = ref<ComponentRef<typeof Write>>()
const createData = async () => {
  const writer = unref(writeRef)
  const formData = await writer?.submit()
  if (formData) {
    let res: any
    if (formData.pid) {
      res = await request.put({ url: 'api/v1/product/' + formData.pid, data: formData })
    } else {
      res = await request.post({ url: 'api/v1/product', data: formData })
    }
    if (res) {
      dialogVisible.value = false
      ElMessage.success('保存成功！')
      await getProductList()
    }
  }
}

watch(actionType, (val) => {
  dialogTitle.value = actionDict[val] + moduleText
})
watch([() => queryForm.pageSize, () => queryForm.currentPage], () => {
  getProductList()
})
getProductList()
</script>

<template>
  <content-wrap>
    <BaseButton type="primary" @click="searchVisible = !searchVisible">检索</BaseButton>
    <BaseButton type="primary" @click="getProductList">刷新</BaseButton>
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
