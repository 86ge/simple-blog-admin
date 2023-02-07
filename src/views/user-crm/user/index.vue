<script lang="ts" setup>
import {onBeforeMount, reactive, ref} from "vue"
import {createTableDataApi, deleteTableDataApi, getTableDataApi, updateTableDataApi} from "@/api/user"
import {ElMessage, ElMessageBox, type FormInstance, type FormRules} from "element-plus"
import {CirclePlus, Download, Refresh, RefreshRight, Search} from "@element-plus/icons-vue"
import {getAvatarList} from "@/api/avatar"

const loading = ref<boolean>(false)

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  account: "",
  password: "",
  avatar: ""
})
const avatarList = ref<Map<String, String>>()
const formRules: FormRules = reactive({
  account: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  password: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  avatar: [{ required: true, trigger: "blur", message: "请选择头像" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        createTableDataApi({
          account: formData.account,
          password: formData.password,
          avatar: formData.avatar
        }).then(() => {
          ElMessage.success("新增成功")
          dialogVisible.value = false
          getTableData()
        })
      } else {
        updateTableDataApi({
          userId: currentUpdateId.value,
          account: formData.account,
          password: formData.password === "" ? undefined : formData.password,
          avatar: formData.avatar
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
  formData.account = ""
  formData.password = ""
}
//#endregion

//#region 删
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`正在删除用户：${row.account}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteTableDataApi(row.userId).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | number>(undefined)
const handleUpdate = (row: any) => {
  currentUpdateId.value = row.userId
  formData.account = row.account
  formData.avatar = row.avatar
  dialogVisible.value = true
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
  getTableDataApi({
    pageIndex: paginationData.currentPage,
    pageSize: paginationData.size,
    account: searchData.account === "" ? undefined : searchData.account,
    userid: searchData.userid === "" ? undefined : searchData.userid
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
const handRefresh = () => {
  getTableData()
}
//#endregion

getTableData()
onBeforeMount(() => {
  getAvatarList({
    pageIndex: 1,
    pageSize: 20
  }).then((avatar: any) => {
    const arr: Array<{ imgId: string; imgUrl: string }> = avatar.data
    const map: Map<string, string> = new Map()
    for (const arrElement of arr) {
      map.set(arrElement.imgId, arrElement.imgUrl)
    }
    avatarList.value = map
  })
})
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="searchData.account" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="用户id">
          <el-input v-model="searchData.userid" placeholder="请输入" />
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
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增用户</el-button>
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
          <el-table-column prop="avatar" label="头像" align="center">
            <template #default="scope">
              <el-avatar size="large" shape="square" :src="avatarList.get(scope.row.avatar)" />
            </template>
          </el-table-column>
          <el-table-column prop="userId" label="用户id" align="center" />
          <el-table-column prop="addtime" label="添加时间" align="center" />
          <el-table-column prop="updatetime" label="更新时间" align="center" />
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
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增用户' : '修改用户'"
      @close="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="account" label="用户名">
          <el-input v-model="formData.account" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="formData.password" placeholder="请输入" />
        </el-form-item>
        <el-form-item class="option" prop="avatar" label="头像">
          <el-select v-model="formData.avatar" placeholder="请选择">
            <el-option
              style="height: auto !important"
              v-for="item in avatarList"
              :key="item[0]"
              :label="item[0]"
              :value="item[0]"
            >
              <div style="height: auto !important; text-align: center; margin-top: 5px">
                <el-avatar size="default" shape="square" :src="item[1]" />
              </div>
            </el-option>
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
.option {
  :deep(.el-select-dropdown__item) {
    height: auto !important;
  }
  :deep(el-select-dropdown__item) {
    height: auto !important;
  }
}
</style>
