<script lang="ts" setup>
import {reactive, ref} from "vue"
import {ElMessage, ElMessageBox, type FormInstance, type FormRules} from "element-plus"
import {Download, RefreshRight} from "@element-plus/icons-vue"
import {addCommentApi, deleteCommentApi, getCommentMessageListApi, updateCommentApi} from "@/api/comment"
import MdEditor from "md-editor-v3"
import "md-editor-v3/lib/style.css"

const loading = ref<boolean>(false)

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  id: "",
  context: "",
  commentBlogId: "",
  commentUserId: "",
  commentCommentId: ""
})
const formRules: FormRules = reactive({
  title: [{ required: true, min: 5, max: 30, trigger: "blur", message: "长度不得小于5位或大于30位" }],
  html: [{ required: true, trigger: "blur", message: "请输入内容" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      addCommentApi({
        id: formData.id,
        context: formData.context,
        commentBlogId: formData.commentBlogId,
        commentUserId: formData.commentUserId,
        commentCommentId: formData.commentCommentId
      }).then(() => {
        ElMessage.success("新增成功")
        dialogVisible.value = false
        getTableData()
      })
    } else {
      return false
    }
  })
}
const resetForm = () => {
  currentUpdateId.value = ""
  formData.commentBlogId = ""
  formData.context = ""
  formData.commentUserId = ""
  formData.commentCommentId = ""
}
//#endregion

//#region 删
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`正在删除文章：${row.title}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteCommentApi(row.id).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 改
const currentUpdateId = ref<string | number>("")
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
  getCommentMessageListApi({
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
const handleUpdate = () => {
  logBoxVisible.value = false
  updateCommentApi({
    id: currentUpdateId.value,
    context: showMsg.value
  }).then(() => {
    ElMessage.success("修改成功")
    dialogVisible.value = false
    getTableData()
  })
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
const logBoxVisible = ref<boolean>(false)
const showMsg = ref<string>("")
const showMsgFunc = (row: { context: string; id: number }) => {
  logBoxVisible.value = true
  currentUpdateId.value = row.id
  showMsg.value = row.context
}

getTableData()
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <!--        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增</el-button>
        </div>-->
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
          <el-table-column prop="id" label="评论id" align="center" />
          <el-table-column prop="account" label="评论用户名" align="center" />
          <el-table-column prop="commentUserId" label="评论用户Id" align="center" />
          <el-table-column prop="context" label="评论" align="center">
            <template #default="{ row }">
              <el-button type="text" @click="showMsgFunc(row)">查看|修改</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="commentBlogId" label="评论博客id" align="center" />
          <el-table-column prop="updateTime" label="更新时间" align="center" />
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
    <el-dialog v-model="dialogVisible" title="新增文章" @close="resetForm" width="80%">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="50px" label-position="left">
        <el-form-item prop="title" label="标题">
          <el-input v-model="formData.title" placeholder="请输入" maxlength="30" minlength="5" />
        </el-form-item>
        <el-form-item size="large" prop="html" label="内容">
          <md-editor style="width: 95%" v-model="formData.html" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="logBoxVisible" width="30%" align-center>
      <el-input v-model="showMsg" show-word-limit placeholder="输入内容" type="textarea" maxlength="100" />
      <template #footer>
        <el-button @click="logBoxVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpdate">确认</el-button>
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
