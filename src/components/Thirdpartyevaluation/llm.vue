<template>
  <div class="main-container">
    <div class="content-wrapper">
      <!-- 步骤导航 
      <div class="steps-container">
        <el-steps :active="0" finish-status="success" align-center class="custom-steps">
          <el-step title="大模型配置">
            <template #icon>
              <el-icon><MessageBox /></el-icon>
            </template>
          </el-step>
          <el-step title="数据集选择">
            <template #icon>
              <el-icon><Edit /></el-icon>
            </template>
          </el-step>
          <el-step title="发布任务">
            <template #icon>
              <el-icon><Notification /></el-icon>
            </template>
          </el-step>
          <el-step title="任务管理">
            <template #icon>
              <el-icon><Compass /></el-icon>
            </template>
          </el-step>
        </el-steps>
      </div> -->
      
      <!-- 表单卡片 -->
      <el-card class="config-card">
        <template #header>
          <div class="card-header">
            <span class="header-title">大模型配置</span>
            <span class="header-desc">请填写以下信息完成大模型配置</span>
          </div>
        </template>

        <el-form 
          label-position="top" 
          :model="formData" 
          class="config-form"
        >
          <el-form-item label="公司、团队或机构名称">
            <el-input 
              v-model="formData.teamName" 
              placeholder="请输入公司、组织或机构名称"
              class="custom-input"
            ></el-input>
          </el-form-item>
          
          <el-form-item label="大模型名称">
            <el-input 
              v-model="formData.modelName" 
              placeholder="大模型名称"
              class="custom-input"
            ></el-input>
          </el-form-item>
          
          <el-form-item label="大模型API调用方式">
            <el-input 
              v-model="formData.apiConfig" 
              type="textarea" 
              :rows="15" 
              placeholder="请输入API配置（JSON格式）"
              class="custom-textarea"
            ></el-input>
          </el-form-item>
        </el-form>

        <div class="form-actions">
          <el-button 
            type="primary" 
            @click="saveModelConfig"
            class="action-button"
          >保存</el-button>
          <el-button 
            type="warning" 
            @click="testApiConfig"
            class="action-button"
          >测试API</el-button>
          <el-button 
            type="success" 
            @click="goToNextStep"
            class="action-button"
          >下一步</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { MessageBox, Edit, Notification, Compass } from '@element-plus/icons-vue';

const router = useRouter();
const formData = ref({
  teamName: '',
  modelName: '',
  apiConfig: JSON.stringify({
    "url": "LLM-API地址",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer 请填入您的API"
    },
    "data": {
      "model": "glm-4",
      "messages": [
        {
          "role": "user",
          "content": "%prompt%"
        }
      ]
    },
    "answer": "choices.0.message.content",
    "concurrency": 2,
    "retries": 1,
    "timeout": 60
  }, null, 2)
});

const saveModelConfig = async () => {
  try {
    const config = JSON.parse(formData.value.apiConfig);
    const requestData = {
      modelName: formData.value.modelName,
      modelConfig: config,
      userJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3NTI4OTE4NzF9.6OFjQ62TRDJbW4fdGvuhm3lKazws_iUUGrVKInPDMt8"
    };
    const response = await axios.post('http://10.110.147.246:5004/model/add', requestData);
    console.log('Response:', response.data);
    ElMessage.success('配置保存成功');
  } catch (error) {
    console.error('Error:', error);
    ElMessage.error('配置保存失败，请检查输入');
  }
};

const testApiConfig = async () => {
  try {
    const config = JSON.parse(formData.value.apiConfig);
    const testData = {
      ...config.data,
      messages: [
        {
          role: "user",
          content: "This is a test message."
        }
      ]
    };

    const response = await axios({
      method: 'post',
      url: config.url,
      headers: config.headers,
      data: testData,
      timeout: config.timeout * 1000
    });

    if (response.status === 200) {
      const answerPath = config.answer.split('.');
      let result = response.data;
      for (const key of answerPath) {
        if (result && result[key]) {
          result = result[key];
        } else {
          result = null;
          break;
        }
      }

      if (result) {
        ElMessage.success('API配置测试成功，可以正常使用');
        console.log('API 响应:', result);
      } else {
        ElMessage.error('API响应中未找到预期的答案字段');
      }
    } else {
      ElMessage.error(`API请求失败，状态码: ${response.status}`);
    }
  } catch (error) {
    console.error('Error:', error);
    ElMessage.error('API配置测试失败，请检查配置: ' + error.message);
  }
};

const goToNextStep = () => {
  router.push('/test/dateset');
};
</script>

<style scoped>
.main-container {
  min-height: 100vh;
  background-color: #ffffff;
  padding: 40px;
  width: 1560px;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

/* 步骤条样式 */
.steps-container {
  margin-bottom: 40px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.custom-steps :deep(.el-step__title) {
  font-size: 16px;
  font-weight: 500;
  color: #606266;
}

.custom-steps :deep(.el-step__icon) {
  background-color: #fff;
  border-color: #dcdfe6;
}

.custom-steps :deep(.el-step__line) {
  background-color: #dcdfe6;
}

/* 卡片样式 */
.config-card {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  background: #ffffff;
  border: none;
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0;
}

.header-title {
  font-size: 30px;
  font-weight: 600;
  color: #303133;
}

.header-desc {
  font-size: 14px;
  color: #909399;
}

/* 表单样式 */
.config-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 0;
}

.config-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #303133;
  padding-bottom: 8px;
}

.custom-input :deep(.el-input__wrapper),
.custom-textarea :deep(.el-textarea__inner) {
  box-shadow: 0 0 0 1px #dcdfe6;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.custom-input :deep(.el-input__wrapper):hover,
.custom-textarea :deep(.el-textarea__inner):hover {
  box-shadow: 0 0 0 1px #409eff;
}

.custom-input :deep(.el-input__wrapper):focus-within,
.custom-textarea :deep(.el-textarea__inner):focus {
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

/* 按钮样式 */
.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;
}

.action-button {
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
  min-width: 120px;
}

/* Element Plus 样式定制 */
:deep(.el-button--primary) {
  background-color: #409eff;
  border-color: #409eff;
}

:deep(.el-button--warning) {
  background-color: #e6a23c;
  border-color: #e6a23c;
}

:deep(.el-button--success) {
  background-color: #67c23a;
  border-color: #67c23a;
}

:deep(.el-card__header) {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 24px;
}
</style>