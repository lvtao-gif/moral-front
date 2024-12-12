<template>
  <el-container class="layout-container">
    <!-- Sidebar menu -->
    <el-aside width="280px" class="sidebar">
      <div class="logo">
        <!--<el-image
          style="width: 40px; height: 40px;"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          fit="cover"
        />-->
        <span class="logo-text" @click="goToTest">大模型生成内容检测平台</span>
      </div>
      
      <!-- 卡片式菜单 -->
      <div class="menu-cards">
        <div
          v-for="item in menuItems"
          :key="item.index"
          :class="['menu-card', { active: currentRoute === item.index }]"
          @click="handleSelect(item.index)"
        >
          <div class="card-content">
            <el-icon class="card-icon">
              <component :is="item.icon" />
            </el-icon>
            <span class="card-title">{{ item.title }}</span>
          </div>
        </div>
      </div>
    </el-aside>

    <!-- Main content area -->
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <h1 class="platform-title">大模型测试平台</h1>
          <h2 class="page-title">{{ currentPageTitle }}</h2>
        </div>
        <div class="user-info">
          <el-dropdown>
            <div class="user-dropdown-link">
              <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
              <span class="username">用户名</span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>设置</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  Setting, 
  List, 
  Key, 
  Edit, 
  Notification, 
  Compass,
  ArrowDown
} from '@element-plus/icons-vue';

export default defineComponent({
  name: 'TestLayout',
  components: {
    Setting,
    List,
    Key,
    Edit,
    Notification,
    Compass,
    ArrowDown
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    
    // 获取当前路由
    const currentRoute = computed(() => {
      const path = route.path;
      const lastSegment = path.split('/').pop();
      return lastSegment || 'llm';
    });

    const menuItems = [
      {
        icon: 'Setting',
        title: '大模型配置',
        index: 'llm'
      },
      {
        icon: 'List',
        title: '数据集选择',
        index: 'dateset'
      },
      {
        icon: 'Edit',
        title: '发布任务',
        index: 'task'
      },
      {
        icon: 'Notification',
        title: '任务管理',
        index: 'taskmanger'
      },
    ];
    
    const currentPageTitle = computed(() => {
      return menuItems.find(item => item.index === currentRoute.value)?.title || '';
    });

    const goToTest = () => {
      router.push('/lgtmain');
    };

    const handleSelect = (key: string) => {
      router.push(`/test/${key}`);
    };

    // 监听路由变化
    watch(
      () => route.path,
      (newPath) => {
        if (!newPath.includes('/test/')) {
          router.push('/test/llm');
        }
      }
    );

    // 组件挂载时检查路由
    onMounted(() => {
      if (!route.path.includes('/test/')) {
        router.push('/test/llm');
      }
    });


    return {
      menuItems,
      currentRoute,
      currentPageTitle,
      handleSelect,
      goToTest
    };
  }
});
</script>

<style scoped>
/* 样式保持不变 */
.layout-container {
  height: 100vh;
  display: flex;
  font-family: 'Roboto', sans-serif;
}

.sidebar {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-right: 1px solid #e6e6e6;
}

.logo {
  text-align: center;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;  /* 添加鼠标指针样式 */
  transition: opacity 0.3s ease;  /* 添加过渡效果 */
}
.logo:hover {
  opacity: 0.8;  /* 添加悬停效果 */
}
.logo-text {
  color: #333333;
  font-size: 20px;
  font-weight: bold;
  line-height: 1.4;
}

.menu-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.menu-card {
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e6e6e6;
}

.menu-card:hover {
  background-color: #ecf5ff;
  transform: translateX(4px);
}

.menu-card.active {
  background-color: #409eff;
  border-color: #409eff;
  position: relative;
}

.menu-card.active .card-icon,
.menu-card.active .card-title {
  color: #ffffff;
}

.card-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon {
  font-size: 20px;
  color: #606266;
}

.card-title {
  font-size: 16px;
  color: #606266;
  font-weight: 500;
  transition: color 0.3s ease;
}

.menu-card:hover .card-icon,
.menu-card:hover .card-title {
  color: #409eff;
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

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.platform-title {
  font-size: 24px;
  color: #409eff;
  font-weight: bold;
  margin: 0;
}

.page-title {
  font-size: 20px;
  color: #606266;
  font-weight: 500;
  margin: 0;
  padding-left: 20px;
  border-left: 2px solid #e6e6e6;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin: 0 10px;
  font-size: 16px;
  color: #606266;
  font-weight: 500;
}

.main-content {
  padding: 30px;
  background-color: #f5f7fa;
  height: calc(100vh - 70px);
  overflow-y: auto;
}

:deep(.el-dropdown-menu__item) {
  padding: 8px 20px;
}

:deep(.el-dropdown-menu__item:not(:last-child)) {
  border-bottom: 1px solid #f0f0f0;
}
</style>