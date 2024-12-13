<template>
  <div 
    class="task-management"
    v-loading.fullscreen.lock="isLoading"
    element-loading-text="数据刷新中..."
    element-loading-background="rgba(255, 255, 255, 0.8)"
  >
    <!-- 页面标题区域 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1>任务管理中心</h1>
          <div class="title-line"></div>
        </div>
        <div class="header-actions">
          <el-button 
            type="primary" 
            class="refresh-button" 
            @click="handleRefresh"
            :icon="Refresh"
          >
            刷新数据
          </el-button>
        </div>
      </div>
    </div>

    <!-- 数据统计卡片 -->
    <div class="statistics-cards">
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon><DataLine /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ taskData.length }}</div>
          <div class="stat-label">总任务数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon><Loading /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ runningTasks }}</div>
          <div class="stat-label">进行中</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon><Select /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ completedTasks }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </div>
    </div>

    <!-- 任务列表 -->
    <div class="task-table-container">
      <div class="table-header">
        <h2>任务列表</h2>
        <div class="header-line"></div>
      </div>
      <el-table 
        :data="taskData" 
        border 
        style="width: 100%"
        class="custom-table"
        :header-cell-style="{ background: '#f8fafc', color: '#1a1a1a', fontWeight: '600' }"
      >
        <el-table-column prop="taskId" label="任务ID" min-width="120">
          <template #default="scope">
            <div class="task-id">{{ scope.row.taskId }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="taskName" label="任务名称" min-width="150">
          <template #default="scope">
            <div class="task-name">{{ scope.row.taskName }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="datasetName" label="数据集名称" min-width="150" />
        <el-table-column prop="modelName" label="模型名称" min-width="150" />
        <el-table-column prop="taskStatus" label="任务状态" min-width="120">
          <template #default="scope">
            <el-tag 
              :type="getStatusType(scope.row.taskStatus)"
              effect="light"
              class="status-tag"
            >
              {{ getStatusText(scope.row.taskStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creationTime" label="创建时间" min-width="180">
          <template #default="scope">
            <div class="time-cell">
              <el-icon><Timer /></el-icon>
              {{ formatTime(scope.row.creationTime) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="download" label="操作" min-width="120" fixed="right">
          <template #default="scope">
            <el-button 
              v-if="scope.row.taskStatus === 1"
              type="primary" 
              link
              :icon="Download"
              @click="handleDownload(scope.row)"
            >
              下载结果
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { 
  Refresh, 
  DataLine, 
  Loading, 
  Select, 
  Timer,
  Download 
} from '@element-plus/icons-vue';
import { ElLoading } from 'element-plus';

export default defineComponent({
  name: 'TaskManagement',
  components: {
    Refresh,
    DataLine,
    Loading,
    Select,
    Timer,
    Download
  },
  setup() {
    const taskData = ref([]);
    const isLoading = ref(false);
    const userJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3NTI4OTE4NzF9.6OFjQ62TRDJbW4fdGvuhm3lKazws_iUUGrVKInPDMt8';

    // 计算统计数据
    const runningTasks = computed(() => {
      return taskData.value.filter(task => task.taskStatus === 2).length;
    });

    const completedTasks = computed(() => {
      return taskData.value.filter(task => task.taskStatus === 1).length;
    });

    const getStatusType = (status: number) => {
      switch (status) {
        case 1: return 'warning';
        case 2: return 'success';
        default: return 'warning';
      }
    };

    const getStatusText = (status: number) => {
      switch (status) {
        case 2: return '进行中';
        case 1: return '已完成';
        default: return '进行中';
      }
    };

    const formatTime = (time: string) => {
      const date = new Date(time);
      return date.toLocaleString();
    };

    const handleDownload = (row: any) => {
      if (row.download && typeof row.download === 'string') {
        window.open(row.download, '_blank');
      }
    };

    const inquire = async () => {
      try {
        const response = await axios.get('/vcis11/evaluation/task/query', {
          params: { userJwt }
        });
        if (response.data.code === 0) {
          taskData.value = response.data.data;
        }
      } catch (error) {
        console.error('查询失败:', error);
      }
    };

    // 处理刷新的方法
    const handleRefresh = async () => {
      isLoading.value = true;
      await inquire();
      
      // 确保加载动画至少显示500ms
      setTimeout(() => {
        isLoading.value = false;
      }, 500);
    };

    onMounted(() => {
      inquire();
    });

    return {
      taskData,
      runningTasks,
      completedTasks,
      isLoading,
      handleRefresh,
      getStatusType,
      getStatusText,
      formatTime,
      handleDownload,
      Refresh,
      DataLine,
      Loading,
      Select,
      Timer,
      Download
    };
  }
});
</script>


<style scoped>
.task-management {
  min-height: 100vh;
  padding: 40px;
  background: #ffffff;
  width: 1560px;
}

.title-line {
  height: 4px;
  width: 200px;
  background: linear-gradient(90deg, #409eff, #58aaed);
  margin-top: 12px;
  border-radius: 2px;
}

/* 修改刷新按钮样式 */
.refresh-button {
  padding: 12px 24px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.el-button--primary) {
  background: linear-gradient(45deg, #409eff, #70b0db);
  border: none;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

/* 添加加载时的样式 */
:deep(.el-button.is-loading) {
  background: linear-gradient(45deg, #409eff, #70b0db) !important;
  opacity: 0.8;
}
/* 自定义加载样式 */
:deep(.el-loading-mask) {
  z-index: 9999;
}

:deep(.el-loading-spinner .el-loading-text) {
  color: #409eff;
  font-size: 16px;
  margin-top: 10px;
}

:deep(.el-loading-spinner .path) {
  stroke: #409eff;
}
.page-header {
  margin-bottom: 40px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section {
  position: relative;
}

.title-section h1 {
  font-size: 32px;
  color: #1a1a1a;
  margin: 0;
  font-weight: 600;
}

.title-decoration {
  display: flex;
  align-items: center;
  margin-top: 12px;
  gap: 8px;
}

.line {
  height: 3px;
  width: 30px;
  background: linear-gradient(90deg, #409eff, #67c23a);
  border-radius: 1.5px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #409eff;
}

.statistics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #eaeaea;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #ecf5ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #409eff;
  font-size: 24px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.task-table-container {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.table-header {
  margin-bottom: 24px;

}

.table-header h2 {
  font-size: 24px;
  color: #1a1a1a;
  margin: 0;
  margin-bottom: 12px;
  font-weight: 700;

}

.header-line {
  height: 3px;
  width: 40px;
  background: #409eff;
  border-radius: 1.5px;
}

.custom-table {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table) {
  border: 1px solid #eaeaea;
}

.task-id {
  font-family: 'Monaco', monospace;
  color: #409eff;
  font-weight: 500;
}

.task-name {
  font-weight: 500;
}

.status-tag {
  padding: 6px 12px;
  border-radius: 6px;
}

.time-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

.refresh-button {
  padding: 12px 24px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.el-button--primary) {
  background: linear-gradient(45deg, #409eff, #70b0db);
  border: none;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(64, 158, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0);
  }
}

.refresh-button {
  animation: pulse 2s infinite;
}
</style>