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
            <span>大模型配置</span>
          </el-menu-item>
          <el-menu-item index="dateset">
            <i class="el-icon-document"></i>
            <span>数据集选择</span>
          </el-menu-item>
          <el-menu-item index="keyword">
            <i class="el-icon-document"></i>
            
            <span>关键词库</span>
          </el-menu-item>
          <el-menu-item index="task">
            <i class="el-icon-plus"></i>
            <span>发布任务</span>
          </el-menu-item>
          <el-menu-item index="taskmanger">
            <i class="el-icon-s-order"></i>
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
              <el-step title="关键词库" />
              <el-step title="发布任务" />
              <el-step title="任务管理" />
            </el-steps>
          </div>
          <el-card class="keyword-library-form" header="关键词库">
            <div v-for="(category, categoryIndex) in keywordParams.categories" :key="categoryIndex">
              <h3>{{ category.name }}</h3>
              <div class="form-grid">
                <div v-for="(subcategory, subcategoryIndex) in category.subcategories" :key="subcategoryIndex" class="form-item">
                  <span class="label">{{ subcategory.name }}</span>
                  <el-input-number
                    v-model="subcategory.count"
                    :min="0"
                    @change="updateValue(categoryIndex, subcategoryIndex)"
                    size="small"
                  />
                </div>
              </div>
              <el-divider v-if="categoryIndex < keywordParams.categories.length - 1" />
            </div>
          </el-card>
          <div class="button-container">
            <el-button type="primary" @click="goToNextStep">下一步</el-button>
            <el-button type="success" @click="openNameDialog">添加关键词库</el-button>
          </div>
        </el-main>
        <!-- Dialog for naming the keyword library -->
        <el-dialog
          title="为关键词库命名"
          v-model="dialogVisible"
          width="30%"
        >
          <el-input v-model="keywordName" placeholder="请输入关键词库名称"></el-input>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="saveKeywordLibrary">确定</el-button>
            </span>
          </template>
        </el-dialog>
      </el-container>
    </el-container>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import { ElMessage } from 'element-plus';
  
  export default defineComponent({
    name: 'KeywordLibrarySelection',
    setup() {
      const router = useRouter();
      const activeMenu = ref('keyword');
      const keywordName = ref('');
      const userJwt = ref('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3NTI4OTE4NzF9.6OFjQ62TRDJbW4fdGvuhm3lKazws_iUUGrVKInPDMt8');
      const dialogVisible = ref(false);
  
      const keywordParams = ref({
        categories: [
          {
            name: "A1 违反社会主义核心价值观",
            subcategories: [
              { name: "A1 违反社会主义核心价值观", count: 120 },
            ]
          },
          {
            name: "A2 辱骂性内容",
            subcategories: [
              { name: "A2 辱骂性内容", count: 40 },
            ]
          },
          {
            name: "A3 商业违法违规",
            subcategories: [
              { name: "A3 商业违法违规", count: 120 },
        
            ]
          },
          {
            name: "A4 侵犯他人合法权益",
            subcategories: [
              { name: "A4 侵犯他人合法权益", count: 10 },
            ]
          },
          {
            name: "A5 准确性和可靠性",
            subcategories: [
              { name: "A5 准确性和可靠性", count: 0 },
            ]
          }
        ]
      });
  
      const currentPageTitle = computed(() => '关键词库选择');
  
      const handleSelect = (key: string) => {
        router.push(`/${key}`);
      };
  
      const updateValue = (categoryIndex: number, subcategoryIndex: number) => {
        // You can add additional logic here if needed
      };
  
      const openNameDialog = () => {
        dialogVisible.value = true;
      };
  
      const saveKeywordLibrary = async () => {
        if (!keywordName.value) {
          ElMessage.error('请输入关键词库名称');
          return;
        }
  
        try {
          const requestData = {
            keywordName: keywordName.value,
            userJwt: userJwt.value,
            keywordParams: keywordParams.value
          };
          const response = await axios.post('http://10.110.147.246:5004/keyword/add', requestData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log('Keyword library saved:', response.data);
          ElMessage.success('关键词库保存成功');
          dialogVisible.value = false;
        } catch (error) {
          console.error('Error saving keyword library:', error);
          ElMessage.error('保存失败，请重试');
        }
      };
  
      const goToNextStep = () => {
        router.push('/task');
      };
  
      return {
        activeMenu,
        keywordParams,
        currentPageTitle,
        handleSelect,
        openNameDialog,
        dialogVisible,
        updateValue,
        keywordName,
        saveKeywordLibrary,
        goToNextStep
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
  .sidebar .el-menu-item span {
  font-size: 16px;
  font-weight: 500;
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
  
  .keyword-library-form {
    margin-top: 20px;
  }
  
  .form-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  
  .form-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .label {
    margin-right: 10px;
  }
  
  .button-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
  
  .button-container .el-button {
    margin-left: 10px;
  }
  </style>