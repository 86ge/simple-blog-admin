<script lang="ts" setup>
import {reactive, ref} from "vue"
import {ElMessage, ElMessageBox, type FormInstance, type FormRules} from "element-plus"
import {Delete, Download, RefreshRight} from "@element-plus/icons-vue"
import {deleteApiLog, getApiLog} from "@/api/apilog"

const loading = ref<boolean>(false)
const multipleSelection = ref<any>(false)

const logBoxVisible = ref<boolean>(false)
const showMsg = ref<string>("")
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  account: "",
  password: ""
})
const formRules: FormRules = reactive({
  account: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  password: [{ required: true, trigger: "blur", message: "请输入密码" }]
})

//#endregion

//#region 删
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `正在删除${row == "list" ? multipleSelection.value.length + "条日志" : row.id}，确认删除？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }
  ).then(() => {
    if (row == "list") {
      const s: Array<string> = []
      for (const valueElement of multipleSelection.value) {
        s.push(valueElement.id)
      }
      deleteApiLog(s).then(() => {
        ElMessage.success("删除成功")
        getTableData()
      })
      return
    }
    deleteApiLog([row.id]).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}

//#endregion

//#region 查
const tableData = ref<any[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  account: "",
  userid: ""
})
const paginationData = reactive({
  total: 0,
  currentPage: 1,
  size: 10
})
const getTableData = () => {
  loading.value = true
  getApiLog({
    pageIndex: paginationData.currentPage,
    pageSize: paginationData.size
  })
    .then((res: any) => {
      paginationData.total = res.dataCount
      tableData.value = res.data
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSizeChange = (value: number) => {
  paginationData.size = value
  getTableData()
}
const handleCurrentChange = (value: number) => {
  paginationData.currentPage = value
  getTableData()
}
const handleSearch = () => {
  paginationData.currentPage = 1
  getTableData()
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  paginationData.currentPage = 1
  getTableData()
}

const showMsgFunc = (row: { resString: string }) => {
  logBoxVisible.value = true
  showMsg.value = row.resString
}

const handRefresh = () => {
  getTableData()
}
//#endregion

getTableData()
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="danger" @click="handleDelete('list')" :icon="Delete">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="下载" effect="light">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新表格" effect="light">
            <el-button type="primary" :icon="RefreshRight" circle @click="handRefresh" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" @selection-change="handleSelectionChange" header-cell-class-name="table-header">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="id" label="请求id" align="center" />
          <el-table-column prop="userId" label="用户id" align="center" />
          <el-table-column prop="reqIp" label="请求ip" align="center" />
          <el-table-column prop="reqApi" label="请求api" align="center" />
          <el-table-column prop="reqParame" label="请求参数" align="center" />
          <el-table-column prop="reqType" label="请求方式" align="center" />
          <el-table-column prop="resString" label="返回信息" align="center">
            <template #default="{ row }">
              <el-button type="text" @click="showMsgFunc(row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="请求时间" align="center" />
          <el-table-column prop="endTime" label="返回时间" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50]"
          :total="paginationData.total"
          :page-size="paginationData.size"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/编辑 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增用户' : '修改用户'"
      @close="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="formData.account" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="formData.password" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="logBoxVisible" title="msg" width="30%" align-center>
      <p>{{ showMsg }}</p>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
  :deep(.table-header) {
    background-color: var(--el-fill-color-light) !important;
  }
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
