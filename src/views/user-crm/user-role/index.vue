<script lang="ts" setup>
import { reactive, ref } from "vue"
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus"
import { CirclePlus, Download, Refresh, RefreshRight, Search } from "@element-plus/icons-vue"
import { addUserRoleAPI, deleteUserRoleAPI, getUserRoleAPI, updateUserRoleAPI } from "@/api/user_role"
import { getRoleApi } from "@/api/role"

const loading = ref<boolean>(false)

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  userId: "",
  roleId: ""
})
const formRules: FormRules = reactive({
  userId: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  roleId: [{ required: true, trigger: "blur", message: "请输入密码" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        addUserRoleAPI({
          userId: formData.userId,
          roleId: formData.roleId
        }).then(() => {
          ElMessage.success("新增成功")
          dialogVisible.value = false
          getTableData()
        })
      } else {
        updateUserRoleAPI({
          userId: currentUpdateId.value,
          roleId: formData.roleId
        }).then(() => {
          ElMessage.success("修改成功")
          dialogVisible.value = false
          getTableData()
        })
      }
    } else {
      return false
    }
  })
}
const resetForm = () => {
  currentUpdateId.value = undefined
  formData.userId = ""
  formData.roleId = ""
}
//#endregion

//#region 删
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`正在删除用户：${row.account}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteUserRoleAPI(row.userId).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | number>(undefined)
const roleList = ref<any[]>([])
const handleUpdate = (row: any) => {
  currentUpdateId.value = row.userId
  formData.userId = row.userId
  formData.roleId = row.roleId
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<any[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  account: "",
  userId: "",
  roleId: "",
  roleName: ""
})
const paginationData = reactive({
  total: 0,
  currentPage: 1,
  size: 10
})
const getTableData = () => {
  getUserRoleAPI({
    pageIndex: paginationData.currentPage,
    pageSize: paginationData.size,
    account: searchData.account === "" ? undefined : searchData.account,
    userId: searchData.userId === "" ? undefined : searchData.userId,
    roleId: searchData.roleId === "" ? undefined : searchData.roleId,
    roleName: searchData.roleName === "" ? undefined : searchData.roleName
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
  getRoleApi({
    pageIndex: paginationData.currentPage,
    pageSize: 100,
    roleId: searchData.roleId === "" ? undefined : searchData.roleId,
    roleName: searchData.roleName === "" ? undefined : searchData.roleName
  }).then((res: any) => {
    roleList.value = res.data
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
const handRefresh = () => {
  getTableData()
}
//#endregion

getTableData()
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="searchData.account" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增</el-button>
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
        <el-table :data="tableData" header-cell-class-name="table-header">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="account" label="用户名" align="center" />
          <el-table-column prop="userId" label="用户id" align="center" />
          <el-table-column prop="roleName" label="所在权限组" align="center" />
          <el-table-column prop="roleId" label="权限组id" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
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
    <el-dialog v-model="dialogVisible" :title="currentUpdateId === undefined ? '新增' : '修改'" @close="resetForm">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="username" label="用户id">
          <el-input
            :disabled="currentUpdateId === undefined ? false : true"
            v-model="formData.userId"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item prop="roleId" label="权限">
          <el-select v-model="formData.roleId">
            <el-option v-for="item in roleList" :label="item.roleName" :key="item.roleId" :value="item.roleId" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
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
