<script lang="ts" setup>
import { onBeforeMount, reactive, ref } from "vue"
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus"
import { CirclePlus, Download, RefreshRight } from "@element-plus/icons-vue"
import { addBlogApi, deleteBlogApi, getBlogListApi, updateBlogApi } from "@/api/blog"
import MdEditor from "md-editor-v3"
import "md-editor-v3/lib/style.css"
import { getBlogTags, setBlogTags } from "@/api/blogtags"

const loading = ref<boolean>(false)

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  title: "",
  html: "",
  markdown: "",
  img: "",
  tagsId: [],
  introduction: ""
})
const formOptions = ref(true)
const formRules: FormRules = reactive({
  title: [{ required: true, min: 5, max: 30, trigger: "blur", message: "长度不得小于5位或大于30位" }],
  markdown: [{ required: true, trigger: "blur", message: "请输入内容" }],
  tagsId: [{ required: true, trigger: "blur", message: "请选择标签" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (formOptions.value) {
        addBlogApi({
          title: formData.title,
          markdown: formData.html,
          html: formData.html,
          img: formData.img,
          tagsId: formData.tagsId,
          introduction: formData.introduction
        }).then(() => {
          ElMessage.success("新增成功")
          dialogVisible.value = false
          getTableData()
        })
      } else {
        updateBlogApi({
          id: currentUpdateId.value,
          title: formData.title,
          markdown: formData.html,
          html: formData.html,
          img: formData.img,
          tagsId: formData.tagsId,
          introduction: formData.introduction
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
  formData.title = ""
  formData.html = ""
  formData.markdown = ""
  formData.img = ""
  formData.tagsId = []
  formData.introduction = ""
}
//#endregion

//#region 删
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`正在删除文章：${row.title}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteBlogApi(row.id).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | number>(undefined)
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
const tagsMap = ref<Map<number, string>>(new Map())
const getTagsName = (id: number | string) => {
  if (typeof id === "string") {
    id = parseInt(id)
  }
  console.log(tagsMap.value.get(0))
  return tagsMap.value?.get(id)
}
const getTableData = () => {
  loading.value = true
  getBlogListApi({
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
const handRefresh = () => {
  getTableData()
}
const mdSave = (md: string) => {
  for (const valueElement of tableData.value) {
    if (valueElement.id == nowMdId.value) {
      valueElement.html = md
      break
    }
  }
  updateBlogApi({
    id: nowMdId.value,
    html: onHtmlChanged.value,
    markdown: md,
    introduction: formData.introduction,
    img: formData.img
  }).then(() => {
    ElMessage.success("保存成功")
    return
  })
  setBlogTags({
    blogId: nowMdId.value,
    tags: checkboxGroup.value
  })
}
//#endregion
const nowMdId = ref<number | string>("")
const onHtmlChanged = ref<string>("")
const logBoxVisible = ref<boolean>(false)
const showMsg = ref<string>("")
const showMsgFunc = (row: {
  title: string
  html: string
  markdown: string
  img: string
  tagsId: string
  introduction: string
}) => {
  currentUpdateId.value = row.id
  formOptions.value = false
  formData.title = row.title
  formData.html = row.markdown
  formData.markdown = row.markdown
  formData.img = row.img
  formData.tagsId = row.tagsId.includes(",") ? row.tagsId.split(",").map(Number) : [row.tagsId]
  formData.introduction = row.introduction
  dialogVisible.value = true
}
const checkboxGroup = ref<number[]>([])
onBeforeMount(() => {
  getBlogTags({
    pageIndex: paginationData.currentPage,
    pageSize: paginationData.size
  }).then((res: { data: Array<{ tagsId: number | string; tagsName: string }> }) => {
    for (const dataKey in res.data) {
      let tagsId = res.data[dataKey].tagsId
      if (typeof tagsId === "string") tagsId = parseInt(tagsId)
      tagsMap.value.set(tagsId, res.data[dataKey].tagsName)
    }
  })
})
getTableData()
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click=";(dialogVisible = true), (formOptions = true)"
            >新增</el-button
          >
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
          <el-table-column prop="id" label="博客id" align="center" />
          <el-table-column prop="title" label="标题" align="center" />
          <el-table-column prop="tagsId" label="标签" align="center">
            <template #default="{ row }">
              <div v-if="row.tagsId">
                <template v-for="item in row.tagsId.split(',')" :key="item">
                  <el-tag style="margin-left: 5px" type="success" size="small">{{ getTagsName(item) }}</el-tag>
                </template>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="html" label="内容" align="center">
            <template #default="{ row }">
              <el-button type="text" @click="showMsgFunc(row)">查看|修改</el-button>
            </template>
          </el-table-column>
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
    <!-- 新增 -->
    <el-dialog v-model="dialogVisible" :title="formOptions ? '新增文章' : '修改文章'" @close="resetForm" width="80%">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="70px" label-position="left">
        <el-form-item prop="title" label="标题">
          <el-input style="width: 500px" v-model="formData.title" placeholder="请输入" maxlength="30" minlength="5" />
        </el-form-item>
        <el-form-item prop="tagsId" label="标签">
          <el-checkbox-group v-model="formData.tagsId">
            <el-checkbox v-for="item in tagsMap" :key="item[0]" :label="item[0]">{{ item[1] }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item prop="img" label="预览图">
          <el-input style="width: 500px" v-model="formData.img" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="introduction" label="简介">
          <el-input v-model="formData.introduction" style="width: 500px" type="textarea" rows="3" />
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
