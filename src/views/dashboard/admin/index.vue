<template>
  <div class="body-admin">
    <el-row class="re-el-col">
      <template v-for="item of show1" :key="item.name">
        <el-col :span="6">
          <el-card shadow="hover" style="margin: 14px; min-width: 120px">
            <span style="font-size: 14px">{{ item.name }}</span>
            <div style="display: flex; justify-content: space-between; align-items: center">
              <span style="font-size: 28px">{{ item.value }}</span>
              <el-icon size="30px"><User /></el-icon>
            </div>
          </el-card>
        </el-col>
      </template>
    </el-row>
    <el-row class="re-el-col">
      <el-col :span="12">
        <el-card style="margin: 14px; min-width: 300px; max-width: 100%">
          <p>近7日api请求数</p>
          <div>
            <v-chart class="chart" :option="option" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="margin: 14px; min-width: 300px; max-width: 100%">
          <p>近7日访问数</p>
          <div>
            <v-chart class="chart" :option="option1" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { GridComponent } from "echarts/components"
import { BarChart } from "echarts/charts"
import { CanvasRenderer } from "echarts/renderers"
import VChart from "vue-echarts"
import { onBeforeMount, ref } from "vue"
import { use } from "echarts"
import { service } from "@/utils/service"
import { Ref, UnwrapRef } from "vue"
import {getLogCount} from "@/api/apilog";

// @ts-ignore
use([GridComponent, BarChart, CanvasRenderer])

const option = ref({})
const option1 = ref({})
const show1: Ref<UnwrapRef<Array<{ name: string; value: number }>>> = ref([])
onBeforeMount(() => {
  let date: Array<string>
  getLogCount().then((res: any) => {
    const data = res.data
    const count = []
    date = Object.keys(data)
    for (const string of date) {
      count.push(parseInt(data[string]))
    }
    show1.value = [
      {
        name: "用户总数",
        value: 6666
      },
      {
        name: "文章总数",
        value: 777
      },
      {
        name: "评论总数",
        value: 3333
      },
      {
        name: "本日api请求数",
        value: 3333
      }
    ]
    option.value = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      xAxis: {
        type: "category",
        data: date
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          data: count,
          type: "bar",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)"
          }
        }
      ]
    }
    option1.value = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      xAxis: {
        type: "category",
        data: date
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          data: [112, 130, 141, 153, 112, 121, 150],
          type: "bar",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)"
          }
        }
      ]
    }
  })
})
</script>

<style scoped lang="scss">
.chart {
  height: 400px;
}
.body-admin {
  margin: 14px;
}
.re-el-col {
  justify-content: center;
  :deep(.el-col-12) {
    max-width: none !important;
  }
  :deep(.el-col-6) {
    max-width: none !important;
  }
}
</style>
