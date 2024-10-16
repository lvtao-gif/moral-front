<template>
  <el-container class="layout-container">
    <!-- Sidebar menu -->
    <el-aside width="240px" class="sidebar">
      <div class="logo">
        <span class="logo-text">VCIS大模型生成内容检测平台</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        background-color="#1e1e2d"
        text-color="#a2a3b7"
        active-text-color="#ffffff"
        @select="handleSelect"
      >
        <el-menu-item index="llm">
          <el-icon><MessageBox /></el-icon>
          <span>大模型配置</span>
        </el-menu-item>
        <el-menu-item index="dateset">
          <el-icon><Edit /></el-icon>
          <span>数据集选择</span>
        </el-menu-item>
        <el-menu-item index="task">
          <el-icon><Notification /></el-icon>
          <span>发布任务</span>
        </el-menu-item>
        <el-menu-item index="taskmanger">
          <el-icon><Compass /></el-icon>
          <span>任务管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- Main content area -->
    <el-container>
      <el-header class="header">
        <h2 class="page-title">{{ currentPageTitle }}</h2>
        <div class="user-info">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
          <span class="username">用户名</span>
        </div>
      </el-header>
      <el-main>
        <div class="steps-container">
          <el-steps
            style="width: 500px;"
            :space="200"
            :active="2"
            finish-status="success"
          >
            <el-step title="大模型配置" />
            <el-step title="数据集选择" />
            <el-step title="发布任务" />
            <el-step title="任务管理" />
          </el-steps>
        </div>
        <div class="mb-4">
          <h2>我的数据集</h2>
          <el-table :data="datasets" border style="width: 100%" @selection-change="handleDatasetSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" label="数据集ID" width="500" />
            <el-table-column prop="name" label="数据集选择" width="520" />
            <el-table-column label="数据集操作" width="500">
              <template #default="scope">
                <el-button @click="deleteDataset(scope.$index, datasets)" type="danger">删除</el-button>
                <el-button @click="queryDataset(scope.row)" type="primary">查看数据集</el-button>
              </template>
            </el-table-column>
          </el-table>

          <h2>我的大模型</h2>
          <el-table :data="models" border style="width: 100%" @selection-change="handleModelSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" label="大模型ID" width="400" />
            <el-table-column prop="name" label="大模型名称" width="500" />
            <el-table-column label="大模型操作" width="620">
              <template #default="scope">
                <el-button @click="deleteModel(scope.$index, models)" type="danger">删除</el-button>
                <el-button @click="queryModel(scope.row)" type="primary">查看大模型详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="button-container">
          <el-button type="success" class="custom-button" @click="openPublishDialog">发布任务</el-button>
          <el-button type="success" class="custom-button" @click="goToNextStep">下一步</el-button>
        </div>
      </el-main>
    </el-container>
  </el-container>

  <!-- Dialog for task name input -->
  <el-dialog v-model="dialogVisible" title="发布任务" width="30%">
    <el-input v-model="taskName" placeholder="请输入任务名称"></el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="publishTask">确认</el-button>
      </span>
    </template>
  </el-dialog>
  
  <!-- Dialog for model details -->
  <el-dialog v-model="modelDialogVisible" title="模型详情" width="80%">
    <el-collapse v-if="modelData.length > 0">
      <el-collapse-item v-for="model in modelData" :key="model.modelId" :title="`模型 ${model.modelId}: ${model.modelName}`">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="Model ID">{{ model.modelId }}</el-descriptions-item>
          <el-descriptions-item label="Model Name">{{ model.modelName }}</el-descriptions-item>
          <el-descriptions-item label="Model Config">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="Answer">{{ model.modelConfig.answer }}</el-descriptions-item>
              <el-descriptions-item label="Concurrency">{{ model.modelConfig.concurrency }}</el-descriptions-item>
              <el-descriptions-item label="Retries">{{ model.modelConfig.retries }}</el-descriptions-item>
              <el-descriptions-item label="Timeout">{{ model.modelConfig.timeout }}</el-descriptions-item>
              <el-descriptions-item label="URL">{{ model.modelConfig.url }}</el-descriptions-item>
              <el-descriptions-item label="Data">
                <pre>{{ JSON.stringify(model.modelConfig.data, null, 2) }}</pre>
              </el-descriptions-item>
              <el-descriptions-item label="Headers">
                <pre>{{ JSON.stringify(model.modelConfig.headers, null, 2) }}</pre>
              </el-descriptions-item>
            </el-descriptions>
          </el-descriptions-item>
        </el-descriptions>
      </el-collapse-item>
    </el-collapse>
    <el-empty v-else description="暂无模型数据"></el-empty>
  </el-dialog>
  <el-dialog v-model="datasetDialogVisible" title="数据集详情" width="60%">
    <el-table v-if="datasetData.length > 0" :data="datasetData" border style="width: 100%">
      <el-table-column prop="datasetId" label="数据集ID" width="120" />
      <el-table-column prop="datasetName" label="数据集名称" width="200" />
      <el-table-column prop="questionCount" label="问题数量" width="120" />
    </el-table>
    <el-empty v-else description="暂无数据集数据"></el-empty>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'PublishTask',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const activeMenu = ref(route.path.substring(1) || 'task');
    const datasets = ref([]);
    const models = ref([]);
    const selectedDataset = ref(null);
    const selectedModel = ref(null);
    const dialogVisible = ref(false);
    const taskName = ref('');
    const userJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3NTI4OTE4NzF9.6OFjQ62TRDJbW4fdGvuhm3lKazws_iUUGrVKInPDMt8'; // Replace with actual JWT
    const currentPageTitle = ref('发布任务');
    const modelDialogVisible = ref(false);
    const modelData = ref([]);
    const datasetDialogVisible = ref(false)
    const datasetData = ref([]);

    onMounted(async () => {
      try {
        const response = await axios.get('http://10.110.147.246:5004/evaluation/choose', {
          params: {
            userJwt: userJwt
          }
        }); 
        const { data } = response.data;
        datasets.value = data.dataset;
        models.value = data.model;
      } catch (error) {
        console.error('Failed to fetch data:', error);
        ElMessage.error('获取数据失败，请重试');
      }
    });

    const handleSelect = (key: string) => {
      activeMenu.value = key;
      router.push(`/${key}`);
    };

    const handleDatasetSelectionChange = (selection) => {
      selectedDataset.value = selection.length > 0 ? selection[0] : null;
    };

    const handleModelSelectionChange = (selection) => {
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

      const taskData = {
        taskName: taskName.value,
        datasetId: selectedDataset.value.id,
        modelId: selectedModel.value.id,
        userJwt: userJwt
      };

      try {
        const response = await axios.post('http://10.110.147.246:5004/evaluation/task/add', taskData);
        console.log('Task published:', response.data);
        ElMessage.success('任务发布成功');
        dialogVisible.value = false;
      } catch (error) {
        console.error('Failed to publish task:', error);
        ElMessage.error('任务发布失败，请重试');
      }
    };

    const goToNextStep = () => {
      router.push('/taskmanger');
    };

    const deleteDataset = async (index: number, list: any[]) => {
      const datasetId = list[index].id;
      try {
        const response = await axios.post('http://10.110.147.246:5004/generate-dataset/delete', {
          datasetId: datasetId,
          userJwt: userJwt
        });

        if (response.data.success) {
          list.splice(index, 1);
          ElMessage.success('数据集删除成功');
        } else {
          ElMessage.error(response.data.message || '删除失败，请重试');
        }
      } catch (error) {
        console.error('删除数据集时出错:', error);
        ElMessage.error("删除失败");
      }
    };

    const queryDataset = async (row: any) => {
      try {
        const response = await axios.get('http://10.110.147.246:5004/generate-dataset/query', {
          params: {
            userJwt: userJwt
          }
        })
        
        if (response.data.code === 0) {
          datasetData.value = response.data.data || []
          datasetDialogVisible.value = true
        } else {
          ElMessage.error(response.data.message || '查询失败，请重试')
        }
      } catch (error) {
        console.error('查询数据集时出错:', error)
        ElMessage.error('查询失败，请重试')
      }
    }

    const deleteModel = async (index: number, list: any[]) => {
      const modelId = list[index].id;
      try {
        const response = await axios.post('http://10.110.147.246:5004/model/delete', {
          modelId: modelId,
          userJwt: userJwt
        });

        if (response.data.success) {
          list.splice(index, 1);
          ElMessage.success('模型删除成功');
        } else {
          ElMessage.error(response.data.message || '删除失败，请重试');
        }
      } catch (error) {
        console.error('删除模型时出错:', error);
        ElMessage.error('删除失败，请重试');
      }
    };

    const queryModel = async (row: any) => {
      try {
        const response = await axios.get('http://10.110.147.246:5004/model/query', {
          params: {
            userJwt: userJwt
          }
        })
        
        if (response.data.code === 0) {
          modelData.value = response.data.data
          modelDialogVisible.value = true
        } else {
          ElMessage.error(response.data.message || '查询失败，请重试')
        }
      } catch (error) {
        console.error('查询模型时出错:', error)
        ElMessage.error('查询失败，请重试')
      }
    }

    return {
      activeMenu,
      currentPageTitle,
      datasets,
      models,
      dialogVisible,
      taskName,
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
      modelDialogVisible,
      datasetDialogVisible,
      datasetData,
      modelData
    };
  }
});
</script>
<style scoped>
.layout-container {
  height: 100vh;
}

.sidebar {
  background-color: #1e1e2d;
}
.sidebar .el-menu-item span {
  font-size: 16px;
  font-weight: 500;
}

.logo {
  padding: 20px;
  text-align: center;
  background-color: #1e1e2d;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.logo-text {
  display: block;
  color: #ffffff;
  margin-top: 20px;
  font-family: 'Arial', sans-serif;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.header {
  background-color: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.page-title {
  font-size: 20px;
  color: #1e1e2d;
}

.user-info {
  display: flex;
  align-items: center;
}

.username {
  margin-left: 10px;
  font-size: 14px;
  color: #5e6278;
}

.steps-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.mb-4 {
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.custom-button {
  font-size: 16px;
  padding: 12px 20px;
}
.el-dialog__body {
  padding: 20px;
}

.el-table {
  margin-bottom: 20px;
}

.el-table th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: bold;
}

.el-table__row:hover {
  background-color: #f5f7fa;
}
</style>