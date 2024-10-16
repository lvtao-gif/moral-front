<template>
  <el-container class="layout-container">
    <!-- Sidebar menu - Kept original -->
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

    <!-- Main content area - Enhanced -->
    <el-container>
      <el-header class="header">
        <h2 class="page-title">{{ currentPageTitle }}</h2>
        <div class="user-info">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
          <span class="username">用户名</span>
        </div>
      </el-header>
      <el-main class="main-content">
        <component :is="currentComponent" v-if="currentComponent" />
        <div v-else class="welcome-content">
          <h2>欢迎使用VCIS大模型生成内容检测平台</h2>
          <p>本平台测评方式严格参照《生成式人工智能服务安全基本要求》。请按以下步骤操作：</p>
          <ol>
            <li>配置大模型</li>
            <li>从数据集中选取题目及数量</li>
            <li>选取需要测评的关键词数量</li>
            <li>选择配置的大模型、题库及关键词</li>
            <li>发布测评任务</li>
          </ol>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, shallowRef, computed } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'TestLayout',
  setup() {
    const router = useRouter()
    const currentComponent = shallowRef(null)
    const activeMenu = ref('')

    const currentPageTitle = computed(() => {
      switch (activeMenu.value) {
        case 'llm': return '大模型配置'
        case 'dateset': return '数据集选择'
        case 'task': return '发布任务'
        case 'taskmanger': return '任务管理'
        default: return '欢迎'
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
            return;
        }
        
        const component = await import(/* @vite-ignore */ componentPath);
        currentComponent.value = component.default;
        router.push(`/${key}`);
      } catch (error) {
        console.error(`Failed to load component: ${key}`, error);
        currentComponent.value = null;
      }
    }

    return {
      currentComponent,
      activeMenu,
      handleSelect,
      currentPageTitle
    }
  }
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
  font-family: 'Roboto', sans-serif;
}

.sidebar {
  background-color: #1e1e2d;
  display: flex;
  flex-direction: column;
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
  font-family: 'Arial', sans-serif; /* 使用更现代的字体 */
  font-size: 24px; /* 增大字体大小 */
  font-weight: bold; /* 加粗文本 */
  letter-spacing: 1px; /* 增加字母间距 */
  text-transform: uppercase; /* 将文本转换为大写 */
}

.header {
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  height: 70px;
}

.page-title {
  font-size: 24px;
  color: #1e1e2d;
  font-weight: 500;
}

.user-info {
  display: flex;
  align-items: center;
}

.username {
  margin-left: 15px;
  font-size: 16px;
  color: #5e6278;
  font-weight: 500;
}

.main-content {
  padding: 30px;
  background-color: #f5f7fa;
}

.welcome-content {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.welcome-content h2 {
  color: #1e1e2d;
  margin-bottom: 20px;
}

.welcome-content p {
  color: #5e6278;
  margin-bottom: 20px;
  line-height: 1.6;
}

.welcome-content ol {
  color: #5e6278;
  padding-left: 20px;
}

.welcome-content li {
  margin-bottom: 10px;
}
</style>