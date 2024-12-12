<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import axios from "@/utils/httpclient"
import rank_store from './store'
import ParticleBackground from './ParticleBackground.vue'

// 定义选项数据
const paramsRange = ref([
  { id: 1, label: "6B", value: "6B" },
  { id: 2, label: "7B", value: "7B" },
  { id: 3, label: "13B", value: "13B" },
  { id: 4, label: "14B", value: "14B" },
  { id: 5, label: "34B", value: "34B" },
  { id: 6, label: "72B", value: "72B" }
])

const checkboxData = ref([
  { id: 1, label: "合规性", value: "合规性" },
  { id: 2, label: "公平性", value: "公平性" },
  { id: 3, label: "知识产权", value: "知识产权" },
  { id: 4, label: "隐私保护", value: "隐私保护" },
  { id: 5, label: "可信度", value: "可信度" }
])

// 基础响应式变量
const allData = ref([])
const currentPage = ref(1)
const pageSize = ref(12)
const loading = ref(false)
const checkAllParamsRange = ref(true)
const checkAllCheckboxData = ref(true)
const isIndeterminateParamsRange = ref(false)
const isIndeterminateCheckboxData = ref(false)

// 初始化选中值
const checkboxValues = ref<[string[], string[]]>([
  paramsRange.value.map(item => item.value),
  checkboxData.value.map(item => item.value)
])

// 计算属性
const filteredData = computed(() => {
  return allData.value.filter(row => {
    if (checkboxValues.value[0].length > 0 && !checkboxValues.value[0].includes(row.参数量)) {
      return false
    }
    return true
  })
})

// 得分格式化函数，只显示2位小数
const formatScore = (row: any, column: any) => {
  const value = row[column.property]
  // 检查是否为有效数字
  if (value !== null && value !== undefined && !isNaN(value)) {
    const num = parseFloat(value)
    return num.toFixed(2)
  }
  return value
}

// 动态生成得分相关列
const dynamicColumns = computed(() => {
  return checkboxValues.value[1].map(col => ({
    prop: col,
    label: col,
    width: 167,
    fixed: 'right',
    sortable: true,
    formatter: formatScore  // 应用格式化
  }))
})

const paginateTableData = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filteredData.value.slice(startIndex, endIndex)
})

// 方法定义
const fetch_report = () => {
  loading.value = true

  // 先加载本地数据确保显示
  useLocalData()
  
  // 然后尝试获取后端数据
  axios.post('/vcis11/get_leaderboard_detail', {}, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      loading.value = false
      console.log('API 响应:', response)
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        console.log('API 返回的数据长度:', response.data.data.length)
        allData.value = response.data.data
      }
    })
    .catch(error => {
      console.error('API 请求错误:', error)
      loading.value = false
    })
}

const useLocalData = () => {
  console.log('使用本地数据')
  const localData = rank_store.data
  if (localData && Array.isArray(localData.data)) {
    allData.value = localData.data
  } else if (rank_store.default && Array.isArray(rank_store.default.data)) {
    allData.value = rank_store.default.data
  } else {
    console.error('本地数据格式不正确')
    allData.value = []
  }
  loading.value = false
}

const handleCheckAllParamsRangeChange = (val: boolean) => {
  checkboxValues.value[0] = val ? paramsRange.value.map(item => item.value) : []
  isIndeterminateParamsRange.value = false
  checkAllParamsRange.value = val
}

const handleCheckAllCheckboxDataChange = (val: boolean) => {
  checkboxValues.value[1] = val ? checkboxData.value.map(item => item.value) : []
  isIndeterminateCheckboxData.value = false
  checkAllCheckboxData.value = val
}

const handleCheckModelChange = (value: string[], type: 'paramsRange' | 'checkboxData') => {
  if (type === 'paramsRange') {
    const checkedCount = value.length
    checkAllParamsRange.value = checkedCount === paramsRange.value.length
    isIndeterminateParamsRange.value = checkedCount > 0 && checkedCount < paramsRange.value.length
  } else {
    const checkedCount = value.length
    checkAllCheckboxData.value = checkedCount === checkboxData.value.length
    isIndeterminateCheckboxData.value = checkedCount > 0 && checkedCount < checkboxData.value.length
  }
}

const handlePageChange = (val: number) => {
  currentPage.value = val
}

const getRowIndex = (index: number) => {
  return (currentPage.value - 1) * pageSize.value + index + 1
}

const resetFilters = () => {
  checkboxValues.value = [[], []]
  checkAllParamsRange.value = false
  isIndeterminateParamsRange.value = false
  checkAllCheckboxData.value = false
  isIndeterminateCheckboxData.value = false
  currentPage.value = 1
}

const queryModels = () => {
  currentPage.value = 1
}

// 生命周期钩子
onMounted(() => {
  fetch_report()
})

// 监听过滤器变化
watch(checkboxValues, () => {
  currentPage.value = 1
}, { deep: true })
</script>

<template>
  <div class="page-container">
    <ParticleBackground class="particle-bg" />
    
    <div class="content-wrapper">
      <el-container>
        <el-main>
          <div class="glass-card main-content">
            <div class="title-container">
              <h1 class="title-text">大模型伦理评测排行榜</h1>
              <div class="title-decoration"></div>
            </div>

            <div class="filter-section">
              <div class="filter-group">
                <h2 class="filter-title">查询模型规模</h2>
                <div class="checkbox-group">
                  <el-checkbox
                    :indeterminate="isIndeterminateParamsRange"
                    v-model="checkAllParamsRange"
                    @change="handleCheckAllParamsRangeChange"
                    class="checkbox-all"
                  >全选</el-checkbox>
                  <el-checkbox-group
                    v-model="checkboxValues[0]"
                    @change="(value) => handleCheckModelChange(value, 'paramsRange')"
                    class="checkbox-items"
                  >
                    <el-checkbox
                      v-for="item in paramsRange"
                      :key="item.id"
                      :label="item.value"
                      class="modern-checkbox"
                    >
                      {{ item.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>

              <div class="filter-group">
                <h2 class="filter-title">显示维度</h2>
                <div class="checkbox-group">
                  <el-checkbox
                    :indeterminate="isIndeterminateCheckboxData"
                    v-model="checkAllCheckboxData"
                    @change="handleCheckAllCheckboxDataChange"
                    class="checkbox-all"
                  >全选</el-checkbox>
                  <el-checkbox-group
                    v-model="checkboxValues[1]"
                    @change="(value) => handleCheckModelChange(value, 'checkboxData')"
                    class="checkbox-items"
                  >
                    <el-checkbox
                      v-for="item in checkboxData"
                      :key="item.id"
                      :label="item.value"
                      class="modern-checkbox"
                    >
                      {{ item.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>

              <div class="action-buttons">
                <el-button type="primary" @click="queryModels" class="search-btn">
                  查询
                </el-button>
                <el-button @click="resetFilters" class="reset-btn">
                  重置
                </el-button>
              </div>
            </div>

            <div class="table-section">
              <el-table 
                :data="paginateTableData" 
                highlight-current-row 
                v-loading="loading"
                class="modern-table"
                :header-cell-style="{ backgroundColor: '#F5F6F7', color: '#41475E', 'font-size': '14px', 'font-weight': '600', 'line-height': '24px' }"
                :cell-style="{ 'height': '56px', 'line-height': '24px' }"
              >
                <el-table-column label="序号" width="88" fixed>
                  <template v-slot="{ row, $index }">
                    <span class="row-number">{{ getRowIndex($index) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="模型" label="模型" width="120" fixed></el-table-column>
                <el-table-column prop="参数量" label="模型规模" width="120" fixed sortable></el-table-column>
                <el-table-column prop="发布者" label="发布者" width="120" fixed></el-table-column>
                <el-table-column prop="发布日期" label="发布日期" width="184" fixed sortable></el-table-column>
                <el-table-column prop="国内/国外模型" label="国内/国外" width="95" fixed></el-table-column>
                <el-table-column prop="综合" label="综合" width="130" fixed sortable :formatter="formatScore"></el-table-column>
                <el-table-column 
                  v-for="column in dynamicColumns" 
                  :key="column.prop" 
                  :prop="column.prop"
                  :label="column.label" 
                  :width="column.width" 
                  :fixed="column.fixed"
                  :sortable="column.sortable"
                  :formatter="formatScore"
                ></el-table-column>
              </el-table>

              <div class="pagination-wrapper">
                <el-pagination 
                  v-model:current-page="currentPage" 
                  v-model:page-size="pageSize" 
                  :page-sizes="[12, 24, 36, 48]"
                  :total="filteredData.length"
                  @current-change="handlePageChange"
                  layout="total, sizes, prev, pager, next, jumper"
                  background
                  class="modern-pagination"
                />
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>


<style scoped>
.page-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(246,249,252,0.9) 100%);
}

.particle-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 2rem;
}

.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.title-container {
  position: relative;
  margin-bottom: 3rem;
  text-align: center;
}

.title-text {
  text-align: center;
  font-size: 4rem;
  font-weight: 800;
  color: #1a365d;
  margin: 2rem 0 1rem;
  position: relative;
  z-index: 2;
  background: linear-gradient(120deg, #1a365d 0%, #2b6cb0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.filter-group {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}

.filter-title {
  font-size: 1.5rem;
  color: #1a365d;
  margin-bottom: 0.4rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 16px;
  background: linear-gradient(45deg, #2196F3, #00BCD4);
  border-radius: 2px;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  padding-left: 0.5rem;
}

.modern-checkbox {
  transition: all 0.2s ease;
  margin-right: 0;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
}

.modern-checkbox:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.1);
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #2196F3;
  border-color: #2196F3;
}

:deep(.el-checkbox__inner:hover) {
  border-color: #2196F3;
}

:deep(.el-checkbox__label) {
  font-size: 0.9rem;
  color: #2c5282;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  margin-top: 1rem;
  padding-left: 2rem;
}

.search-btn, .reset-btn {
  min-width: 100px;
  height: 36px;
  border-radius: 18px;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.search-btn {
  background: linear-gradient(45deg, #2196F3, #00BCD4);
  border: none;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(33, 150, 243, 0.3);
}

.reset-btn {
  background: #f5f5f5;
  color: #666;
}

.reset-btn:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
}

.table-section {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  padding: 1rem;
}

.modern-table {
  border-radius: 10px;
  overflow: hidden;
}

:deep(.el-table) {
  background: transparent !important;
}

:deep(.el-table th) {
  background: linear-gradient(45deg, #f8f9fa, #e9ecef) !important;
  color: #333 !important;
  font-weight: 600;
}

:deep(.el-table td) {
  border-bottom: 1px solid rgba(0,0,0,0.05) !important;
}

.row-number {
  background: linear-gradient(45deg, #2196F3, #00BCD4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
}

.pagination-wrapper {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
}

.modern-pagination {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
}

:deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
  background: linear-gradient(45deg, #2196F3, #00BCD4);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.main-content {
  animation: fadeIn 0.8s ease-out;
}
</style>