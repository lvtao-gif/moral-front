<template>
  <div class="main-container">
    <div class="content-wrapper">
      <el-card class="config-card">
        <template #header>
          <div class="card-header">
            <span class="header-title">大模型配置</span>
            <span class="header-desc">请填写以下信息完成大模型配置</span>
          </div>
        </template>

        <el-form 
          ref="formRef"
          label-position="top" 
          :model="formData"
          :rules="rules"
          class="config-form"
        >
          <el-form-item 
            label="公司、团队或机构名称" 
            prop="teamName"
          >
            <el-input 
              v-model="formData.teamName" 
              placeholder="请输入公司、组织或机构名称"
              class="custom-input"
            ></el-input>
          </el-form-item>
          
          <el-form-item 
            label="大模型名称"
            prop="modelName"
          >
            <el-input 
              v-model="formData.modelName" 
              placeholder="大模型名称"
              class="custom-input"
            ></el-input>
          </el-form-item>
          
          <el-form-item 
            label="大模型API调用方式"
            prop="apiConfig"
          >
            <el-input 
              v-model="formData.apiConfig" 
              type="textarea" 
              :rows="20" 
              placeholder="请输入API配置（JSON格式）"
              class="custom-textarea"
            ></el-input>
          </el-form-item>
        </el-form>

        <div class="form-actions">
          <el-button 
            type="warning" 
            @click="testApiConfig"
            class="action-button"
          >测试API</el-button>
          <el-button 
            type="primary" 
            @click="saveModelConfig"
            class="action-button"
          >保存</el-button>
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
import type { FormInstance } from 'element-plus'
import { MessageBox, Edit, Notification, Compass } from '@element-plus/icons-vue';

const router = useRouter();
const formRef = ref<FormInstance>();

const formData = ref({
  teamName: '',
  modelName: '',
  apiConfig: JSON.stringify({
    "url": "填写LLM服务的base_url",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer 请填入您的API-KEY"
    },
    "data": {
      "model": "请填入您的大模型名称",
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
const rules = {
  teamName: [
    { required: true, message: '请输入公司、团队或机构名称', trigger: 'blur' }
  ],
  modelName: [
    { required: true, message: '请输入大模型名称', trigger: 'blur' }
  ],
  apiConfig: [
    { required: true, message: '请输入API配置', trigger: 'blur' },
    { 
      validator: (rule: any, value: string, callback: any) => {
        try {
          if (value) {
            JSON.parse(value);
          }
          callback();
        } catch (error) {
          callback(new Error('请输入有效的JSON格式'));
        }
      },
      trigger: 'blur'
    }
  ]
};

const saveModelConfig = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        const config = JSON.parse(formData.value.apiConfig);
        const requestData = {
          modelName: formData.value.modelName,
          modelConfig: config,
          userJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3NTI4OTE4NzF9.6OFjQ62TRDJbW4fdGvuhm3lKazws_iUUGrVKInPDMt8"
        };
        const response = await axios.post('/vcis11/model/add', requestData);
        console.log('Response:', response.data);
        ElMessage.success('配置保存成功');
      } catch (error) {
        console.error('Error:', error);
        ElMessage.error('配置保存失败，请检查输入');
      }
    } else {
      ElMessage.error('请填写所有必填项');
    }
  });
};

const testApiConfig = async () => {
  if (!formRef.value) return;

  await formRef.value.validateField('apiConfig', async (valid) => {
    if (valid) {
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
    }
  });
};

const goToNextStep = async () => {
  if (!formRef.value) return;

  await formRef.value.validate((valid) => {
    if (valid) {
      router.push('/test/dateset');
    } else {
      ElMessage.error('请先完成所有必填项');
    }
  });
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

.form-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 5px;
}

.action-button {
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
  min-width: 120px;
}

:deep(.el-button--primary) {
  background-color: #409eff;
  border-color: #409eff;
}

:deep(.el-button--warning) {
  background-color: #409eff;
  border-color: #409eff;
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