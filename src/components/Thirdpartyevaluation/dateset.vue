<template>
  <div class="dataset-container">
    <div class="dataset-header">
      <div class="category-row">
        <div class="category-cell"></div>
        <div class="category-cell">一级分类</div>
        <div class="category-cell">二级分类</div>
        <div class="count-cell">标准题数</div>
        <div class="count-cell">高级攻击题数</div>
      </div>
    </div>
    <el-form class="dataset-form" :model="datasetParams">
      <div v-for="(category, categoryIndex) in datasetParams.categories" 
           :key="categoryIndex" 
           class="category-section"
           :class="{ 'alt-background': categoryIndex % 2 === 1 }">
        <div class="category-row">
          <div class="checkbox-cell">
            <el-checkbox 
              v-model="category.selected"
              @change="(val) => handleMainCategoryChange(val, categoryIndex)"
            ></el-checkbox>
          </div>
          <div class="main-category-cell">{{ category.name }}</div>
          <div class="subcategories-cell">
            <div v-for="(subcategory, subIndex) in category.subcategories" 
                 :key="subcategory.name" 
                 class="subcategory-item">
              <el-checkbox 
                v-model="subcategory.selected"
                @change="(val) => handleSubCategoryChange(val, categoryIndex, subIndex)"
              >
                {{ subcategory.name }}
              </el-checkbox>
            </div>
          </div>
          <div class="count-inputs">
            <el-input-number 
              v-model="category.standard_count"
              :min="0"
              :max="999"
              size="small"
              controls-position="right"
            />
          </div>
          <div class="count-inputs">
            <el-input-number 
              v-model="category.advanced_attack_count"
              :min="0"
              :max="999"
              size="small"
              controls-position="right"
            />
          </div>
        </div>
      </div>
    </el-form>

    <div class="total-count">
      已选择：{{ selectedCount }} / {{ totalCount }} 题目
    </div>

    <div class="form-actions">
      <el-button type="primary" @click="openUploadDialog" class="action-button">上传自用数据集</el-button>
      <el-button type="success" @click="openNameDialog"  class="action-button">保存数据集</el-button>
      <el-button type="primary" @click="goToNextStep" class="action-button">下一步</el-button>
    </div>

    <!-- 保存数据集对话框 -->
    <el-dialog
      title="为数据集命名"
      v-model="dialogVisible"
      width="30%"
    >
      <el-input v-model="datasetName" placeholder="请输入数据集名称"></el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveDatasetConfig">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 上传数据集对话框 -->
    <el-dialog
  title="上传数据集"
  v-model="uploadDialogVisible"
  width="40%"
>
  <div class="upload-container">
    <el-upload
      class="upload-demo"
      drag
      action="http://10.110.147.246:5004/upload-dataset"
      :headers="uploadHeaders"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      :before-upload="beforeUpload"
      accept=".csv,.xlsx,.json"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        拖拽文件到此处或 <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          支持的文件格式：CSV、Excel、JSON（文件大小不超过10MB）
        </div>
      </template>
    </el-upload>
  </div>
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="uploadDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleUploadSubmit">确定</el-button>
    </span>
  </template>
</el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'DatasetSelection',
  components: {
    UploadFilled,
  },
  setup() {
    const router = useRouter();
    const dialogVisible = ref(false);
    const uploadDialogVisible = ref(false);
    const datasetName = ref('');
    const userJwt = ref('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3NTI4OTE4NzF9.6OFjQ62TRDJbW4fdGvuhm3lKazws_iUUGrVKInPDMt8');

    const uploadForm = ref({
      file: null as File | null,
    });

    const uploadHeaders = computed(() => ({
      Authorization: `Bearer ${userJwt.value}`,
    }));

    const datasetParams = ref({
      categories: [
        {
          name: "A1 违反社会主义核心价值观",
          selected: false,
          standard_count: 0,
          advanced_attack_count: 0,
          subcategories: [
            { name: "煽动颠覆国家政权，推翻社会主义制度", selected: false },
            { name: "危害国家安全和利益，损害国家形象", selected: false },
            { name: "煽动分裂国家，破坏国家统一", selected: false },
            { name: "宣传恐怖主义、极端主义", selected: false },
            { name: "宣传暴力、淫秽色情", selected: false },
            { name: "宣传虚假有害信息", selected: false }
          ]
        },
        {
          name: "A2 歧视性内容",
          selected: false,
          standard_count: 0,
          advanced_attack_count: 0,
          subcategories: [
            { name: "民族歧视内容", selected: false },
            { name: "信仰歧视内容", selected: false },
            { name: "国别歧视内容", selected: false },
            { name: "地域歧视内容", selected: false },
            { name: "性别歧视内容", selected: false },
            { name: "年龄歧视内容", selected: false },
            { name: "职业歧视内容", selected: false }
          ]
        },
        {
          name: "A3 商业违法违规",
          selected: false,
          standard_count: 0,
          advanced_attack_count: 0,
          subcategories: [
            { name: "侵犯他人知识产权", selected: false },
            { name: "违反商业道德", selected: false },
            { name: "泄露他人商业秘密", selected: false },
            { name: "实施垄断和不正当竞争行为", selected: false },
            { name: "其他商业违法违规行为", selected: false },
          ]
        },
        {
          name: "A4 商业违法违规",
          selected: false,
          standard_count: 0,
          advanced_attack_count: 0,
          subcategories: [
            { name: "危害他人身心健康", selected: false },
            { name: "侵害他人肖像权", selected: false },
            { name: "侵害他人名誉权", selected: false },
            { name: "侵害他人荣誉权", selected: false },
            { name: "侵害他人隐私权", selected: false },
            { name: "侵害他人个人信息权益", selected: false },
            { name: "侵犯他人其他合法权益", selected: false },
          ]
        },
        {
          name: "A5 无法满足特定服务类型的安全需求",
          selected: false,
          standard_count: 0,
          advanced_attack_count: 0,
          subcategories: [
            { name: "内容不准确", selected: false },
            { name: "内容不可靠", selected: false },
          ]
        },
        {
          name: "B 应答拒答题库",
          selected: false,
          standard_count: 0,
          advanced_attack_count: 0,
          subcategories: [
            { name: "B1 应答题", selected: false },
            { name: "B2 非应答题", selected: false },
          ]
        }
      ]
    });

    // 打开上传对话框
    const openUploadDialog = () => {
      uploadDialogVisible.value = true;
      uploadForm.value.file = null;
    };

    // 上传前验证
    const beforeUpload = (file: File) => {
      const isValidType = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
        'application/json'
      ].includes(file.type);
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isValidType) {
        ElMessage.error('请上传正确的文件格式！');
        return false;
      }
      if (!isLt10M) {
        ElMessage.error('文件大小不能超过 10MB!');
        return false;
      }
      return true;
    };

    // 上传成功处理
    const handleUploadSuccess = (response: any, uploadFile: any) => {
      if (response.code === 0) {
        ElMessage.success('文件上传成功');
        uploadForm.value.file = uploadFile.raw;
      } else {
        ElMessage.error(response.message || '文件上传失败');
      }
    };

    // 上传失败处理
    const handleUploadError = (error: any) => {
      console.error('Upload error:', error);
      ElMessage.error('文件上传失败，请重试');
    };

    // 提交上传表单
    const handleUploadSubmit = async () => {
      if (!uploadForm.value.file) {
        ElMessage.error('请上传文件');
        return;
      }

      const formData = new FormData();
      formData.append('file', uploadForm.value.file);

      try {
        const response = await axios.post(
          'http://10.110.147.246:5004/upload-dataset',
          formData,
          {
            headers: {
              ...uploadHeaders.value,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.data.code === 0) {
          ElMessage.success('数据集上传成功');
          uploadDialogVisible.value = false;
        } else {
          ElMessage.error(response.data.message || '上传失败，请重试');
        }
      } catch (error: any) {
        console.error('Error:', error);
        ElMessage.error(error.response?.data?.message || '上传失败，请重试');
      }
    };

    // 处理一级分类勾选变化
    const handleMainCategoryChange = (checked: boolean, categoryIndex: number) => {
      const category = datasetParams.value.categories[categoryIndex];
      // 设置所有子分类的选中状态
      category.subcategories.forEach(sub => {
        sub.selected = checked;
      });
    };

    // 处理二级分类勾选变化
    const handleSubCategoryChange = (checked: boolean, categoryIndex: number, subIndex: number) => {
      const category = datasetParams.value.categories[categoryIndex];
      // 检查是否所有子分类都被选中
      const allSelected = category.subcategories.every(sub => sub.selected);
      const anySelected = category.subcategories.some(sub => sub.selected);
      // 更新一级分类的选中状态
      category.selected = allSelected;
    };

    // 监听子分类的变化以更新一级分类状态
    watch(
      () => datasetParams.value.categories,
      (categories) => {
        categories.forEach(category => {
          const allSelected = category.subcategories.every(sub => sub.selected);
          if (category.selected !== allSelected) {
            category.selected = allSelected;
          }
        });
      },
      { deep: true }
    );

    const selectedCount = computed(() => {
      return datasetParams.value.categories.reduce((total, category) => {
        return total + (category.standard_count || 0) + (category.advanced_attack_count || 0);
      }, 0);
    });

    const totalCount = computed(() => 400);

    const openNameDialog = () => {
      dialogVisible.value = true;
    };

    const saveDatasetConfig = async () => {
      if (!datasetName.value) {
        ElMessage.error('请输入数据集名称');
        return;
      }

      try {
        const requestData = {
          datasetName: datasetName.value,
          userJwt: userJwt.value,
          datasetParams: datasetParams.value
        };
        const response = await axios.post('http://10.110.147.246:5004/generate-dataset/add', requestData);
        ElMessage.success('数据集保存成功');
        dialogVisible.value = false;
      } catch (error) {
        console.error('Error:', error);
        ElMessage.error('保存失败，请重试');
      }
    };

    const goToNextStep = () => {
      router.push('/test/task');
    };

    return {
      datasetParams,
      dialogVisible,
      uploadDialogVisible,
      datasetName,
      uploadForm,
      uploadHeaders,
      selectedCount,
      totalCount,
      handleMainCategoryChange,
      handleSubCategoryChange,
      openNameDialog,
      openUploadDialog,
      saveDatasetConfig,
      goToNextStep,
      beforeUpload,
      handleUploadSuccess,
      handleUploadError,
      handleUploadSubmit,
    };
  }
});
</script>

<style scoped>
/* 原有样式保持不变 */
.dataset-container {
  padding: 20px;
  background-color: #fff;
  min-height: 100vh;
}

.dataset-header {
  margin-bottom: 5px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 30px;
}


.category-row {
  display: grid;
  grid-template-columns: 60px 200px 1fr 150px 150px;
  align-items: start;
  padding: 12px;
  border-bottom: 1px solid #ebeef5;
}

.category-cell {
  font-weight: bold;
  color: #606266;
}

.checkbox-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-category-cell {
  font-weight: bold;
  color: #303133;
}

.subcategories-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.subcategory-item {
  flex: 0 0 calc(33.33% - 8px);
}

.count-cell, .count-inputs {
  text-align: center;
}

.category-section {
  &.alt-background {
    background-color: #f5f7fa;
  }
}

.total-count {
  margin: 20px 0;
  text-align: right;
  color: #606266;
  font-size: 14px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

:deep(.el-input-number) {
  width: 120px;
}

:deep(.el-checkbox) {
  margin-right: 0;
  margin-bottom: 8px;
}

:deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
  background-color: #409eff;
  border-color: #409eff;
}

:deep(.el-input-number.is-controls-right .el-input__wrapper) {
  padding-right: 35px;
}


.upload-container {
  padding: 20px;
}

:deep(.el-upload) {
  width: 100%;
}

:deep(.el-upload-dragger) {
  width: 100%;
  height: 200px;
}

.el-upload__tip {
  color: #909399;
  font-size: 12px;
  margin-top: 8px;
}

.upload-demo {
  text-align: center;
}

:deep(.el-icon--upload) {
  font-size: 48px;
  color: #409EFF;
  margin-bottom: 16px;
}

.el-upload__text {
  color: #606266;
  font-size: 14px;
  text-align: center;
  em {
    color: #409EFF;
    font-style: normal;
  }
}

.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}
</style>