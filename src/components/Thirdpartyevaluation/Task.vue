<template>
  <div class="task-container">
    <div class="main-content">
      <div class="section-title">
        <h1>发布任务</h1>
        <div class="title-line"></div>
      </div>

      <!-- 数据集部分 -->
      <div class="card dataset-section">
        <div class="card-header">
          <h2>我的数据集</h2>
          <div class="header-line"></div>
        </div>
        <el-collapse>
          <el-collapse-item>
            <template #title>
              <span class="collapse-title">数据集列表</span>
              <span class="collapse-subtitle">共 {{datasets.length}} 条记录</span>
            </template>
            <el-table 
              :data="datasets" 
              border 
              style="width: 100%" 
              @selection-change="handleDatasetSelectionChange"
              class="custom-table"
              :max-height="400"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="id" label="数据集ID" min-width="200" />
              <el-table-column prop="name" label="数据集名称" min-width="200" />
              <el-table-column label="操作" min-width="200">
                <template #default="scope">
                  <div class="button-group">
                    <el-button 
                      @click="deleteDataset(scope.$index, datasets)" 
                      type="danger" 
                      plain
                      :icon="Delete"
                    >删除</el-button>
                    <el-button 
                      @click="queryDataset(scope.row)" 
                      type="primary" 
                      plain
                      :icon="View"
                    >查看详情</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- 模型部分 -->
      <div class="card model-section">
        <div class="card-header">
          <h2>我的大模型</h2>
          <div class="header-line"></div>
        </div>
        <el-collapse>
          <el-collapse-item>
            <template #title>
              <span class="collapse-title">模型列表</span>
              <span class="collapse-subtitle">共 {{models.length}} 条记录</span>
            </template>
            <el-table 
              :data="models" 
              border 
              style="width: 100%" 
              @selection-change="handleModelSelectionChange"
              class="custom-table"
              :max-height="400"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="id" label="大模型ID" min-width="200" />
              <el-table-column prop="name" label="大模型名称" min-width="200" />
              <el-table-column label="操作" min-width="200">
                <template #default="scope">
                  <div class="button-group">
                    <el-button 
                      @click="deleteModel(scope.$index, models)" 
                      type="danger" 
                      plain
                      :icon="Delete"
                    >删除</el-button>
                    <el-button 
                      @click="queryModel(scope.row)" 
                      type="primary" 
                      plain
                      :icon="View"
                    >查看详情</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
      <el-button 
            type="primary" 
            class="action-button" 
            @click="openPublishDialog"
            :icon="Position"
          >发布任务</el-button>
        <el-button 
          type="success" 
          class="action-button" 
          @click="goToNextStep"
          :icon="ArrowRight"
        >下一步</el-button>
      </div>
    </div>

    <!-- 弹窗部分 -->
    <el-dialog 
      v-model="dialogVisible" 
      title="发布任务" 
      width="30%"
      class="custom-dialog"
    >
      <el-input v-model="taskName" placeholder="请输入任务名称">
        <template #prefix>
          <el-icon><Document /></el-icon>
        </template>
      </el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="publishTask">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 模型详情弹窗 -->
    <el-dialog 
      v-model="modelDialogVisible" 
      title="模型详情" 
      width="80%"
      class="custom-dialog"
    >
      <el-collapse v-if="modelData.length > 0">
        <el-collapse-item 
          v-for="model in modelData" 
          :key="model.modelId" 
          :title="`模型 ${model.modelId}: ${model.modelName}`"
        >
          <el-descriptions :column="1" border>
            <el-descriptions-item label="Model ID">{{ model.modelId }}</el-descriptions-item>
            <el-descriptions-item label="Model Name">{{ model.modelName }}</el-descriptions-item>
            <el-descriptions-item label="Model Config">
              <pre>{{ JSON.stringify(model.modelConfig, null, 2) }}</pre>
            </el-descriptions-item>
          </el-descriptions>
        </el-collapse-item>
      </el-collapse>
      <el-empty v-else description="暂无模型数据"></el-empty>
    </el-dialog>

    <!-- 数据集详情弹窗 -->
    <el-dialog 
      v-model="datasetDialogVisible" 
      title="数据集详情" 
      width="60%"
      class="custom-dialog"
    >
      <el-table 
        v-if="datasetData.length > 0" 
        :data="datasetData" 
        border 
        class="custom-table"
      >
        <el-table-column prop="datasetId" label="数据集ID" width="120" />
        <el-table-column prop="datasetName" label="数据集名称" width="200" />
        <el-table-column prop="questionCount" label="问题数量" width="120" />
      </el-table>
      <el-empty v-else description="暂无数据集数据"></el-empty>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { Delete, View, Document, Position, ArrowRight } from '@element-plus/icons-vue';

interface Dataset {
  id: string;
  name: string;
}

interface Model {
  id: string;
  name: string;
}

interface DatasetResponse {
  datasetId: string;
  datasetName: string;
  questionCount: number;
}

interface ModelResponse {
  modelId: string;
  modelName: string;
  modelConfig: any;
}

export default defineComponent({
  name: 'PublishTask',
  components: {
    Delete,
    View,
    Document,
    ArrowRight,
    Position
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const loading = ref(false);
    const activeMenu = ref(route.path.substring(1) || 'task');
    const datasets = ref<Dataset[]>([]);
    const models = ref<Model[]>([]);
    const selectedDataset = ref<Dataset | null>(null);
    const selectedModel = ref<Model | null>(null);
    const dialogVisible = ref(false);
    const taskName = ref('');
    const userJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3NTI4OTE4NzF9.6OFjQ62TRDJbW4fdGvuhm3lKazws_iUUGrVKInPDMt8';
    const currentPageTitle = ref('发布任务');
    const modelDialogVisible = ref(false);
    const modelData = ref<ModelResponse[]>([]);
    const datasetDialogVisible = ref(false);
    const datasetData = ref<DatasetResponse[]>([]);
    const defaultActiveNames = ref(['1', '2']); // 默认展开所有面板

    // 获取数据的方法
    const fetchData = async () => {
      loading.value = true;
      try {
        const response = await axios.get('http://10.110.147.246:5004/evaluation/choose', {
          params: {
            userJwt: userJwt
          }
        }); 
        if (response.data && response.data.data) {
          datasets.value = response.data.data.dataset || [];
          models.value = response.data.data.model || [];
        } else {
          datasets.value = [];
          models.value = [];
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        ElMessage.error('获取数据失败，请重试');
        datasets.value = [];
        models.value = [];
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchData();
    });

    const handleSelect = (key: string) => {
      activeMenu.value = key;
      router.push(`/${key}`);
    };

    const handleDatasetSelectionChange = (selection: Dataset[]) => {
      selectedDataset.value = selection.length > 0 ? selection[0] : null;
    };

    const handleModelSelectionChange = (selection: Model[]) => {
      selectedModel.value = selection.length > 0 ? selection[0] : null;
    };

    const openPublishDialog = () => {
      if (!selectedDataset.value || !selectedModel.value) {
        ElMessage.error('请选择数据集和模型');
        return;
      }
      dialogVisible.value = true;
    };

    const publishTask = async () => {
      if (!taskName.value) {
        ElMessage.error('请输入任务名称');
        return;
      }

      if (!selectedDataset.value || !selectedModel.value) {
        ElMessage.error('请选择数据集和模型');
        return;
      }

      const taskData = {
        taskName: taskName.value,
        datasetId: selectedDataset.value.id,
        modelId: selectedModel.value.id,
        userJwt: userJwt
      };

      try {
        const response = await axios.post('http://10.110.147.246:5004/evaluation/task/add', taskData);
        if (response.data.status==0) {
          ElMessage({
                message: '任务发布成功',
                type: 'success',
              })
          dialogVisible.value = false;
          taskName.value = ''; // 清空任务名称
          // 可选：刷新数据
          await fetchData();
        } else {
          ElMessage.error(response.data.message || '任务发布失败');
        }
      } catch (error) {
        console.error('Failed to publish task:', error);
        ElMessage.error('任务发布失败，请重试');
      }
    };

    const goToNextStep = () => {
      router.push('/test/taskmanger');
    };

    const deleteDataset = async (index: number, list: Dataset[]) => {
      const datasetId = list[index].id;
      try {
        const response = await axios.post('http://10.110.147.246:5004/generate-dataset/delete', {
          datasetId: datasetId,
          userJwt: userJwt
        });

        if (response.data.success) {
          list.splice(index, 1);
          ElMessage.success('数据集删除成功');
          // 如果删除的是当前选中的数据集，清空选择
          if (selectedDataset.value && selectedDataset.value.id === datasetId) {
            selectedDataset.value = null;
          }
        } else {
          ElMessage.error(response.data.message || '删除失败，请重试');
        }
      } catch (error) {
        console.error('删除数据集时出错:', error);
        ElMessage.error("删除失败");
      }
    };

    const queryDataset = async (row: Dataset) => {
      try {
        const response = await axios.get('http://10.110.147.246:5004/generate-dataset/query', {
          params: {
            userJwt: userJwt
          }
        });
        
        if (response.data.code === 0) {
          datasetData.value = response.data.data || [];
          datasetDialogVisible.value = true;
        } else {
          ElMessage.error(response.data.message || '查询失败，请重试');
        }
      } catch (error) {
        console.error('查询数据集时出错:', error);
        ElMessage.error('查询失败，请重试');
      }
    };

    const deleteModel = async (index: number, list: Model[]) => {
      const modelId = list[index].id;
      try {
        const response = await axios.post('http://10.110.147.246:5004/model/delete', {
          modelId: modelId,
          userJwt: userJwt
        });

        if (response.data.success) {
          list.splice(index, 1);
          ElMessage.success('模型删除成功');
          // 如果删除的是当前选中的模型，清空选择
          if (selectedModel.value && selectedModel.value.id === modelId) {
            selectedModel.value = null;
          }
        } else {
          ElMessage.error(response.data.message || '删除失败，请重试');
        }
      } catch (error) {
        console.error('删除模型时出错:', error);
        ElMessage.error('删除失败，请重试');
      }
    };

    const queryModel = async (row: Model) => {
      try {
        const response = await axios.get('http://10.110.147.246:5004/model/query', {
          params: {
            userJwt: userJwt
          }
        });
        
        if (response.data.code === 0) {
          modelData.value = response.data.data;
          modelDialogVisible.value = true;
        } else {
          ElMessage.error(response.data.message || '查询失败，请重试');
        }
      } catch (error) {
        console.error('查询模型时出错:', error);
        ElMessage.error('查询失败，请重试');
      }
    };

    return {
      activeMenu,
      currentPageTitle,
      datasets,
      models,
      dialogVisible,
      taskName,
      selectedDataset,
      selectedModel,
      modelDialogVisible,
      datasetDialogVisible,
      datasetData,
      modelData,
      defaultActiveNames,
      loading,
      handleSelect,
      handleDatasetSelectionChange,
      handleModelSelectionChange,
      openPublishDialog,
      publishTask,
      goToNextStep,
      deleteDataset,
      queryDataset,
      deleteModel,
      queryModel,
      Delete,
      View,
      Document,
      ArrowRight
    };
  }
});
</script>

<style scoped>
.task-container {
  min-height: 100vh;
  background: #ffffff;
  padding: 40px;
}

.main-content {
  width: 1480px;
  margin: 0 auto;
}

.section-title {
  margin-bottom: 40px;
  position: relative;
}

.section-title h1 {
  font-size: 32px;
  color: #1a1a1a;
  margin: 0;
  font-weight: 600;
}

.title-line {
  height: 4px;
  width: 60px;
  background: linear-gradient(90deg, #409eff, #67c23a);
  margin-top: 12px;
  border-radius: 2px;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.card-header {
  margin-bottom: 24px;
  position: relative;
}

.card-header h2 {
  font-size: 24px;
  color: #000000;
  margin: 0;
  font-weight: 600;
}

.header-line {
  height: 3px;
  width: 40px;
  background: #409eff;
  margin-top: 8px;
  border-radius: 1.5px;
}

.custom-table {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table) {
  --el-table-header-bg-color: #f8fafc;
  --el-table-row-hover-bg-color: #f5f7fa;
}

:deep(.el-table th) {
  background-color: var(--el-table-header-bg-color);
  color: #2c3e50;
  font-weight: 600;
  padding: 12px 0;
}

:deep(.el-table td) {
  padding: 16px 0;
}

:deep(.el-table--border) {
  border-radius: 8px;
}

.button-group {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 40px;
}

.action-button {
  padding: 12px 24px;
  font-size: 16px;
}

.custom-dialog {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  padding: 20px;
  margin: 0;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

:deep(.el-dialog__footer) {
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
}

:deep(.el-input__wrapper) {
  padding: 8px 12px;
}

:deep(.el-collapse) {
  border: none;
}

:deep(.el-collapse-item__header) {
  font-size: 16px;
  font-weight: 500;
  background-color: #f8fafc;
  padding: 12px 20px;
  border-radius: 8px 8px 0 0;
  border: 1px solid #e5e7eb;
  margin-bottom: -1px;
}

:deep(.el-collapse-item__content) {
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0 0 8px 8px;
}

:deep(.el-collapse-item__arrow) {
  margin-right: 8px;
}

.collapse-title {
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
  margin-right: 12px;
}

.collapse-subtitle {
  font-size: 14px;
  color: #606266;
}

:deep(.el-descriptions__label) {
  font-weight: 500;
}

pre {
  background: #f8fafc;
  padding: 12px;
  border-radius: 6px;
  font-family: 'Monaco', monospace;
  font-size: 14px;
  color: #2c3e50;
  margin: 0;
  overflow-x: auto;
}

/* 滚动条美化 */
:deep(.el-table__body-wrapper::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(.el-table__body-wrapper::-webkit-scrollbar-thumb) {
  border-radius: 3px;
  background: #c0c4cc;
}

:deep(.el-table__body-wrapper::-webkit-scrollbar-track) {
  border-radius: 3px;
  background: #f5f7fa;
}

/* 折叠动画 */
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease-in-out;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 按钮悬停效果 */
:deep(.el-button) {
  transition: all 0.3s ease;
}

:deep(.el-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 空状态样式 */
:deep(.el-empty) {
  padding: 40px 0;
}

:deep(.el-empty__description) {
  margin-top: 16px;
  color: #606266;
}

/* 加载状态样式 */
:deep(.el-loading-mask) {
  background-color: rgba(255, 255, 255, 0.9);
}

:deep(.el-loading-spinner) {
  .circular {
    width: 42px;
    height: 42px;
  }
}


/* 响应式调整 */
@media (max-width: 1520px) {
  .main-content {
    width: 100%;
    padding: 0 20px;
  }
}

@media (max-width: 768px) {
  .task-container {
    padding: 20px;
  }

  .card {
    padding: 16px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
  }
}
</style>