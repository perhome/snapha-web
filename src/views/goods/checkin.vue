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
  name: 'SystemGoodsCheckinCheckin'
})

const queryForm = reactive<{
  pageSize: number
  currentPage: number
}>({
  pageSize: 10,
  currentPage: 1
})
const moduleText = '入库物料'
const dialogVisible = ref(false)
const searchVisible = ref(false)
const dialogTitle = ref(moduleText)

const actionType = ref('')
const goodsCheckinEntity = {
  gcid: null,
  name: null,
  gcsn: null,
  unitId: null
}
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'gcid',
    label: 'ID',
    form: {
      hidden: true
    }
  },
  {
    field: 'name',
    label: '物料名称',
    form: { hidden: true },
    search: {
      hidden: false
    }
  },
  {
    field: 'goodsId',
    hidden: true,
    label: '物料',
    form: { component: 'Goods', hidden: false },
    search: {
      component: 'Goods',
      hidden: false
    }
  },
  {
    field: 'gcsn',
    label: '登记编号'
  },
  {
    field: 'rawQuantity',
    form: { component: 'InputNumber', hidden: false },
    search: {
      hidden: true
    },
    label: '数量'
  },
  {
    field: 'rawAmount',
    form: { component: 'InputNumber', hidden: false },
    search: {
      hidden: true
    },
    label: '金额'
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

const getGoodsCheckinList = async () => {
  tableData.loading = true
  const res = await request.get({ url: 'api/v1/goods-checkin', params: queryForm })
  tableData.loading = false
  tableData.total = Number(res.data.totalRow)
  tableData.list = res.data.records
}

const temp = reactive({ ...goodsCheckinEntity })
const rules = ref({
  name: [{ required: true, message: '不能未空！', trigger: 'blur' }]
})
const setSearchParams = (data: Recordable) => {
  queryForm.currentPage = 1
  Object.assign(queryForm, Object.keys(data).length > 0 ? data : goodsCheckinEntity)
  getGoodsCheckinList()
}

const handleCreate = () => {
  dialogVisible.value = true
  actionType.value = 'create'
  Object.assign(temp, goodsCheckinEntity)
}

const handleUpdate = (row) => {
  dialogVisible.value = true
  actionType.value = 'update'
  Object.assign(temp, row)
}

const handleSoftDelete = async (row: any) => {
  const res = await request.put({
    url: 'api/v1/goods-checkin/' + row.gcid,
    data: { deleted: 1 }
  })
  if (res) {
    ElMessage.success('操作成功！')
    await getGoodsCheckinList()
  }
}

const handleDelete = async (row: any) => {
  const res = await request.delete({ url: 'api/v1/goods-checkin/' + row.gcid })
  if (res) {
    await getGoodsCheckinList()
    ElMessage.success('删除成功！')
  }
}

const writeRef = ref<ComponentRef<typeof Write>>()
const createData = async () => {
  const writer = unref(writeRef)
  const formData = await writer?.submit()
  if (formData) {
    let res: any
    if (formData.gcid) {
      res = await request.put({ url: 'api/v1/goods-checkin/' + formData.gcid, data: formData })
    } else {
      res = await request.post({ url: 'api/v1/goods-checkin', data: formData })
    }
    if (res) {
      dialogVisible.value = false
      ElMessage.success('保存成功！')
      await getGoodsCheckinList()
    }
  }
}

watch(actionType, (val) => {
  dialogTitle.value = actionDict[val] + moduleText
})

watch([() => queryForm.pageSize, () => queryForm.currentPage], () => {
  getGoodsCheckinList()
})

getGoodsCheckinList()
</script>

<template>
  <content-wrap>
    <BaseButton type="primary" @click="searchVisible = !searchVisible">检索</BaseButton>
    <BaseButton type="primary" @click="getGoodsCheckinList">刷新</BaseButton>
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
