<script setup lang="tsx">
import { reactive, ref, unref, watch } from 'vue'
import { ElMessage, ElDivider, ElTree, ElLink, ElText, ElSpace, ElPopconfirm } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { FormSchema } from '@/components/Form'
import Write from '@/views/Components/Dialog/Write.vue'
import request from '@/axios'
import { ContentWrap } from '@/components/ContentWrap'
import { BaseButton } from '@/components/Button'
import { actionDict } from '@/constants/dict'
import { useValidator } from '@/hooks/web/useValidator'

defineOptions({
  name: 'SystemJob'
})

const { required } = useValidator()

const moduleText = '岗位设置'

const dialogVisible = ref(false)
const dialogTitle = ref(moduleText)

const actionType = ref('')
const jobEntity = {
  jid: null,
  name: null
}

const formSchema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    formItemProps: {
      rules: [required()]
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'jsn',
    label: '编号',
    component: 'Input',
    formItemProps: {},
    colProps: {
      span: 24
    }
  }
])

const jobData = ref([])

const getJobList = async () => {
  const res = await request.get({ url: 'api/v1/system/job' })
  jobData.value = res.data
}

const temp = reactive({ ...jobEntity })

const writeRef = ref<ComponentRef<typeof Write>>()
const createData = async () => {
  const writer = unref(writeRef)
  const formData = await writer?.submit()
  if (formData) {
    const res = await request.post({ url: 'api/v1/system/job', data: formData })
    if (res) {
      dialogVisible.value = false
      ElMessage.success('保存成功！')
      await getJobList()
    }
  }
}
const handleCreate = (_: any) => {
  dialogVisible.value = true
  actionType.value = 'create'
}
const handleDelete = async (_: any, row: any) => {
  const res = await request.delete({ url: 'api/v1/system/job/' + row.jid })
  if (res) {
    await getJobList()
    ElMessage.success('删除成功！')
  }
}
const handleDisable = async (row: any) => {
  const res = await request.put({
    url: 'api/v1/system/job/' + row.jid,
    data: { deleted: 1 }
  })
  if (res) {
    await getJobList()
    ElMessage.success('禁用成功！')
  }
}

watch(actionType, (val) => {
  dialogTitle.value = actionDict[val] + moduleText
})

getJobList()
</script>

<template>
  <content-wrap>
    <BaseButton type="primary" @click="handleCreate">新建</BaseButton>
    <el-divider />
    <el-tree
      style="max-width: 600px"
      :data="jobData"
      :props="{ label: 'name' }"
      node-key="jid"
      default-expand-all
    >
      <template #default="{ node, data }">
        <el-text style="width: 300px">{{ node.label }}</el-text>
        <el-space>
          <el-popconfirm title="继续禁用" @confirm="handleDisable(data)">
            <template #reference>
              <el-link type="warning"> 禁用 </el-link>
            </template>
          </el-popconfirm>
          <el-popconfirm title="继续删除" @confirm="handleDelete(node, data)">
            <template #reference>
              <el-link type="danger"> 删除 </el-link>
            </template>
          </el-popconfirm>
        </el-space>
      </template>
    </el-tree>
  </content-wrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write
      v-if="actionType !== 'detail'"
      ref="writeRef"
      :form-schema="formSchema"
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
