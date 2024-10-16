<template>
    <div class="model-evaluation">
      <el-card class="box-card" :body-style="{ padding: '0px' }">
        <template #header>
          <div class="card-header">
            <h2>模型评估表格</h2>
            <el-input
              v-model="search"
              placeholder="搜索模型名称"
              prefix-icon="el-icon-search"
              class="search-input"
            />
          </div>
        </template>
        <el-table 
          :data="filteredTableData" 
          border 
          style="width: 100%"
          :header-cell-style="{ background: '#f0f9ff', color: '#1e40af', fontWeight: 'bold' }"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="modelName" label="模型名称" width="180" sortable />
          <el-table-column prop="evaluationTime" label="测评时间" width="180" sortable />
          <el-table-column label="生成内容安全评估">
            <el-table-column prop="contentSafety.samplingRate" label="抽检合格率" sortable>
              <template #default="scope">
                <el-progress 
                  :percentage="parseFloat(scope.row.contentSafety.samplingRate)" 
                  :color="customColorMethod"
                />
              </template>
            </el-table-column>
            <el-table-column prop="contentSafety.keywordRate" label="关键词合格率" sortable>
              <template #default="scope">
                <el-progress 
                  :percentage="parseFloat(scope.row.contentSafety.keywordRate)" 
                  :color="customColorMethod"
                />
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="问题拒答评估">
            <el-table-column prop="questionRefusal.responseRate" label="应拒答实拒答率" sortable>
              <template #default="scope">
                <el-progress 
                  :percentage="parseFloat(scope.row.questionRefusal.responseRate)" 
                  :color="customColorMethod"
                />
              </template>
            </el-table-column>
            <el-table-column prop="questionRefusal.refusalRate" label="非拒答实拒答率" sortable>
              <template #default="scope">
                <el-progress 
                  :percentage="parseFloat(scope.row.questionRefusal.refusalRate)" 
                  :color="customColorMethod"
                />
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const search = ref('')
  
  const tableData = ref([
    {
      modelName: 'ChatGLM',
      evaluationTime: '2024-09-05',
      contentSafety: {
        samplingRate: '100',
        keywordRate: '100'
      },
      questionRefusal: {
        responseRate: '56',
        refusalRate: '0'
      }
    },
    {
      modelName: 'Model B',
      evaluationTime: '2024-03-02',
      contentSafety: {
        samplingRate: '93',
        keywordRate: '97'
      },
      questionRefusal: {
        responseRate: '90',
        refusalRate: '10'
      }
    },
    {
      modelName: 'Model C',
      evaluationTime: '2024-03-03',
      contentSafety: {
        samplingRate: '97',
        keywordRate: '99'
      },
      questionRefusal: {
        responseRate: '94',
        refusalRate: '6'
      }
    }
  ])
  
  const filteredTableData = computed(() => {
    return tableData.value.filter(
      data => !search.value || data.modelName.toLowerCase().includes(search.value.toLowerCase())
    )
  })
  
  const tableRowClassName = ({ rowIndex }) => {
    if (rowIndex % 2 === 0) {
      return 'even-row'
    } else {
      return 'odd-row'
    }
  }
  
  const customColorMethod = (percentage) => {
    if (percentage < 70) return '#f56c6c'
    else if (percentage < 90) return '#e6a23c'
    else return '#67c23a'
  }
  </script>
  
  <style scoped>
  /* 样式部分保持不变 */
  .model-evaluation {
    max-width: 1200px;
    margin: 0 auto;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: #f0f9ff;
  }
  
  .card-header h2 {
    margin: 0;
    color: #1e40af;
    font-size: 24px;
  }
  
  .search-input {
    width: 250px;
  }
  
  .box-card {
    margin-top: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .box-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
  
  :deep(.el-table) {
    border-radius: 8px;
    overflow: hidden;
  }
  
  :deep(.even-row) {
    background-color: #f9fafb;
  }
  
  :deep(.odd-row) {
    background-color: #ffffff;
  }
  
  :deep(.el-progress-bar__inner) {
    transition: width 0.6s ease;
  }
  
  :deep(.el-table__row) {
    transition: all 0.3s ease;
  }
  
  :deep(.el-table__row:hover) {
    background-color: #e6f7ff !important;
  }
  </style>