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
            <i class="el-icon-setting"></i>
            <el-icon><MessageBox /></el-icon>
            <span>大模型配置</span>
          </el-menu-item>
          <el-menu-item index="dateset">
            <i class="el-icon-document"></i>
            <el-icon><Edit /></el-icon>
            <span>数据集选择</span>
          </el-menu-item>
         <!-- <el-menu-item index="keyword">
            <i class="el-icon-document"></i>
            <span>关键词库</span>
          </el-menu-item>-->
          <el-menu-item index="task">
            <i class="el-icon-plus"></i>
            <el-icon><Notification /></el-icon>
            <span>发布任务</span>
          </el-menu-item>
          <el-menu-item index="taskmanger">
            <i class="el-icon-s-order"></i>
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
              :active="3"
              finish-status="success"
            >
            <el-step title="大模型配置" />
            <el-step title="数据集选择" />
            <el-step title="发布任务" />
            <el-step title="任务管理" />
            </el-steps>
          </div>
          <div class="mb-4">
            <div class="query-button">
              <el-button type="primary" @click="inquire">刷新</el-button>
            </div>
            <el-table :data="taskData" border style="width: 100%">
              <el-table-column prop="taskId" label="任务ID" width="180" />
              <el-table-column prop="taskName" label="任务名称" width="180" />
              <el-table-column prop="datasetName" label="数据集名称" width="180" />
              <!-- <el-table-column prop="keywordName" label="关键词库" width="180" />-->
              <el-table-column prop="modelName" label="模型名称" width="180" />
              <el-table-column prop="taskStatus" label="任务状态" width="180" />
              <el-table-column prop="creationTime" label="创建时间" width="180" />
              <el-table-column prop="download" label="下载链接" />
            </el-table> 
          </div>
        </el-main>
      </el-container>
    </el-container>
  </template>
  
<script lang="ts">
import { defineComponent, ref, shallowRef, computed , onMounted} from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios';


export default defineComponent({
  name: 'TestLayout',
  setup() {
    const router = useRouter()
    const currentComponent = shallowRef(null)
    const activeMenu = ref('')
    const taskData = ref([])
    const userJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3NTI4OTE4NzF9.6OFjQ62TRDJbW4fdGvuhm3lKazws_iUUGrVKInPDMt8' // 请替换为实际的 JWT token

    const currentPageTitle = computed(() => {
      switch (activeMenu.value) {
        case 'llm': return '大模型配置'
        case 'dateset': return '数据集选择'
        case 'task': return '发布任务'
        case 'taskmanger': return '任务管理'
        default: return '任务管理'
      }
    })

    const handleSelect = async (key: string) => {
      activeMenu.value = key
      
      try {
        let componentPath = '';
        switch(key) {
          case 'llm':
            componentPath = '/src/components/Thirdpartyevaluation/llm.vue';
            break;
          case 'dateset':
            componentPath = '/src/components/Thirdpartyevaluation/dateset.vue';
            break;
          case 'task':
            componentPath = '/src/components/Thirdpartyevaluation/Task.vue';
            break;
          case 'taskmanger':
            componentPath = '/src/components/Thirdpartyevaluation/Taskmanger.vue';
            break;
          default:
            currentComponent.value = null;
            router.push('/');
            return;
        }
        
        // 使用动态导入来加载组件
        const module = await import(/* @vite-ignore */ componentPath);
        currentComponent.value = module.default;
        
        // 确保路由更新
        await router.push(`/${key}`);
      } catch (error) {
        console.error(`Failed to load component: ${key}`, error);
        currentComponent.value = null;
        router.push('/');
      }
    }
    const inquire = async () => {
      try {
        const response = await axios.get('http://10.110.147.246:5004/evaluation/task/query', {
          params: {
            userJwt: userJwt
          }
        });
        if (response.data.code === 0) {
          taskData.value = response.data.data;
        } else {
          console.error('查询失败:', response.data.message);
        }
      } catch (error) {
        console.error('请求失败:', error);
      }
    };
        // 添加自动查询函数
        const autoInquire = () => {
      inquire();
    };

    // 使用 onMounted 钩子在组件挂载后自动执行查询
    onMounted(() => {
      autoInquire();
    });

    return {
      currentComponent,
      activeMenu,
      handleSelect,
      currentPageTitle,
      inquire,
      taskData 
    }
  }
})
  </script>
  
  <style scoped>
  .layout-container {
    height: 100vh;
  }
  
  .sidebar {
    background-color: #1e1e2d;
  }
  
  .logo {
  padding: 20px;
  text-align: center;
  background-color:  #1e1e2d; /* 使用漂亮的蓝色作为背景 */
  border-radius: 8px; /* 增加圆角效果 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 添加柔和的阴影 */
  transition: all 0.3s ease; /* 添加平滑过渡效果 */
}


.logo-text {
  display: block;
  color: #ffffff;
  margin-top: 20px;
  font-family: 'Arial', sans-serif; /* 使用更现代的字体 */
  font-size: 24px; /* 增大字体大小 */
  font-weight: bold; /* 加粗文本 */
  letter-spacing: 1px; /* 增加字母间距 */
  text-transform: uppercase; /* 将文本转换为大写 */
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
  .sidebar .el-menu-item span {
  font-size: 16px;
  font-weight: 500;
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
  
  .query-button {
    margin-bottom: 20px;
  }
  </style>