<template>
  <div class="mainCss">
    <md-editor @onSave="save" style="width: 95%" v-model="markdown" />
  </div>
</template>

<script lang="ts" setup>
import MdEditor from "md-editor-v3"
import "md-editor-v3/lib/style.css"
import {onMounted, ref} from "vue"
import {getMyAbout, saveMyAbout} from "@/api/user";

const markdown = ref("")
onMounted(() => {
  getMyAbout().then((res) => {
    markdown.value = res.data
  })
})
const save = () => {
  saveMyAbout(markdown.value).then((res) => {
    console.log(res)
  })
}
</script>

<style scoped lang="scss">
.mainCss {
  margin: 0 auto;
  width: 95%;
}
</style>
