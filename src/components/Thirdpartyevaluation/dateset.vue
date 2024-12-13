<template>
  <div class="dataset-container">
    <h2 class="page-title">选择数据集</h2>
    <div class="cards-container">
      <!-- 勾选系统数据集卡片 -->
      <div class="selection-card" @click="openSystemDialog">
        <div class="card-header">
          <el-icon class="header-icon"><Document /></el-icon>
          <div class="header-content">
            <h3 class="card-title">配置系统数据集</h3>
            <p class="card-description">从系统预设的数据集中进行选择和配置</p>
          </div>
        </div>
        <div class="card-content">
          <ul class="feature-list">
            <li>支持伦理数据和安全数据集选择</li>
            <li>系统预置分类体系</li>
            <li>可配置数据集维度和题目数量</li>
          </ul>
        </div>
      </div>

      <!-- 上传自用数据集卡片 -->
      <div class="selection-card" @click="openUploadDialog">
        <div class="card-header">
          <el-icon class="header-icon"><Upload /></el-icon>
          <div class="header-content">
            <h3 class="card-title">上传自用数据集</h3>
            <p class="card-description">上传您自己的自定义数据集文件</p>
          </div>
        </div>
        <div class="card-content">
          <ul class="feature-list">
            <li>仅支持JSON格式</li>
            <li>文件大小限制10MB</li>
           
          </ul>
        </div>
      </div>
    </div>

    <!-- 系统数据集选择对话框 -->
    <el-dialog
    title="选择系统数据集"
    v-model="systemDialogVisible"
    width="80%"
    :close-on-click-modal="false"
    
  >
    <el-tabs v-model="activeTab">
      <el-tab-pane label="安全数据集" name="security">
        <div class="dataset-header">
          <div class="category-row">
            <div class="category-cell"></div>
            <div class="category-cell">一级分类</div>
            <div class="category-cell">二级分类</div>
            <div class="category-cell">标准题数</div>
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
            </div>
          </div>
        </el-form>
      </el-tab-pane>
      
      <el-tab-pane label="伦理数据集" name="ethics">
        <div class="dataset-header">
          <div class="category-row">
            <div class="category-cell"></div>
            <div class="category-cell">分类名称</div>
            <div class="category-cell">描述</div>
            <div class="category-cell">标准题数</div>
          </div>
        </div>
        <el-form class="dataset-form">
          <div v-for="(item, index) in ethicsDataset" 
               :key="index" 
               class="category-section"
               :class="{ 'alt-background': index % 2 === 1 }">
            <div class="category-row">
              <div class="checkbox-cell">
                <el-checkbox v-model="item.selected"></el-checkbox>
              </div>
              <div class="main-category-cell">{{ item.name }}</div>
              <div class="description-cell">{{ item.description }}</div>
              <div class="count-inputs">
                <el-input-number 
                  v-model="item.standard_count"
                  :min="0"
                  :max="999"
                  size="small"
                  controls-position="right"
                />
              </div>
            </div>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <div class="total-count">
      已选择：{{ selectedCount }} / {{ totalCount }} 题目
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="systemDialogVisible = false">取 消</el-button>
        <el-button type="success" @click="openNameDialog">保存数据集</el-button>
      </div>
    </template>
  </el-dialog>

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
      width="700px"
      center
      destroy-on-close
      :close-on-click-modal="false"
      class="upload-dialog"
    >
      <div class="upload-container">
        <el-upload
          class="upload-demo"
          drag
          action="/vcis/upload-dataset"
          :headers="uploadHeaders"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :before-upload="beforeUpload"
          :limit="1"
          accept=".csv,.xlsx,.json"
        >
          <template #trigger>
        <div class="upload-trigger">
          <el-icon class="upload-icon"><upload-filled /></el-icon>
          <div class="upload-text">
            拖拽文件到此处或 <em>点击上传</em>
          </div>
        </div>
      </template>

      <template #tip>
        <div class="upload-info">
          <div class="format-text">
            支持的文件格式：JSON（文件大小不超过10MB）
          </div>
          <el-button
            link
            type="primary"
            class="download-btn"
            @click="downloadTemplate"
          >
            <el-icon class="download-icon"><download /></el-icon>
            下载示例格式
          </el-button>
        </div>
      </template>
    </el-upload>
  </div>

  <template #footer>
    <div class="dialog-footer">
      <el-button @click="uploadDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleUploadSubmit">确定</el-button>
    </div>
  </template>
</el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { Document, Upload, UploadFilled } from '@element-plus/icons-vue';

export default defineComponent({
  name: 'DatasetSelection',
  components: {
    Document,
    Upload,
    UploadFilled,
  },
  setup() {
    const router = useRouter();
    const dialogVisible = ref(false);
    const systemDialogVisible = ref(false);
    const uploadDialogVisible = ref(false);
    const datasetName = ref('');
    const userJwt = ref('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3NTI4OTE4NzF9.6OFjQ62TRDJbW4fdGvuhm3lKazws_iUUGrVKInPDMt8');
    type TabType = 'security' | 'ethics';
    const activeTab = ref<TabType>('security');
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
          name: "A4 侵犯他人合法权益",
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
    
const ethicsDataset = ref([
  {
    name: "政治伦理数据集",
    selected: false,
    standard_count: 0,
    description: "涉及政治决策、权力运行等方面的伦理问题"
  },
  {
    name: "经济伦理数据集",
    selected: false,
    standard_count: 0,
    description: "经济活动中的道德规范和价值判断"
  },
  {
    name: "社会伦理数据集",
    selected: false,
    standard_count: 0,
    description: "社会关系和社会行为中的伦理准则"
  },
  {
    name: "文化伦理数据集",
    selected: false,
    standard_count: 0,
    description: "文化传播和文化交流中的伦理问题"
  },
  {
    name: "科技伦理数据集",
    selected: false,
    standard_count: 0,
    description: "科技发展和应用中的伦理考量"
  },
  {
    name: "环境伦理数据集",
    selected: false,
    standard_count: 0,
    description: "环境保护和可持续发展相关伦理"
  },
  {
    name: "医疗伦理数据集",
    selected: false,
    standard_count: 0,
    description: "医疗实践中的道德准则和价值取向"
  },
  {
    name: "教育伦理数据集",
    selected: false,
    standard_count: 0,
    description: "教育过程中的道德规范和价值观"
  },
  {
    name: "职业道德数据集",
    selected: false,
    standard_count: 0,
    description: "各类职业中的道德准则和行为规范"
  },
  {
    name: "艺术伦理数据集",
    selected: false,
    standard_count: 0,
    description: "艺术创作和传播中的伦理问题"
  },
  {
    name: "网络与信息伦理数据集",
    selected: false,
    standard_count: 0,
    description: "网络空间和信息传播中的伦理规范"
  },
  {
    name: "国际关系伦理数据集",
    selected: false,
    standard_count: 0,
    description: "国际交往中的道德准则和价值观"
  },
  {
    name: "心理伦理数据集",
    selected: false,
    standard_count: 0,
    description: "心理服务和研究中的伦理规范"
  },
  {
    name: "生物伦理数据集",
    selected: false,
    standard_count: 0,
    description: "生命科学研究和应用中的伦理准则"
  },
  {
    name: "运动伦理数据集",
    selected: false,
    standard_count: 0,
    description: "体育运动中的道德规范和价值观"
  }
]);

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

    // 打开系统数据集对话框
    const openSystemDialog = () => {
      systemDialogVisible.value = true;
      activeTab.value = 'security';
      console.log(activeTab.value);
    };

    // 处理系统数据集确认
    const handleSystemConfirm = () => {
      if (selectedCount.value === 0) {
        ElMessage.warning('请至少选择一个题目');
        return;
      }
      systemDialogVisible.value = false;
      router.push('/test/task');
    };
  const selectedCount = computed(() => {
  if (activeTab.value === 'security') {
    return datasetParams.value.categories.reduce((total, category) => {
      return total + (category.standard_count || 0);
    }, 0);
  } else {
    return ethicsDataset.value.reduce((total, item) => {
      return total + (item.standard_count || 0);
    }, 0);
  }
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
    let requestData;
    
    // 根据当前激活的标签页构建不同的请求数据
    if (activeTab.value === 'security') {
      requestData = {
        datasetName: datasetName.value,
        userJwt: userJwt.value,
        datasetType: 'security',
        datasetParams: {
          categories: datasetParams.value.categories
        }
      };
    } else {
      requestData = {
        datasetName: datasetName.value,
        userJwt: userJwt.value,
        datasetType: 'ethics',
        datasetParams: {
          categories: ethicsDataset.value  // 直接使用伦理数据集的数据
        }
      };
    }

    const response = await axios.post('/vcis11/generate-dataset/add', requestData);
    ElMessage.success('数据集保存成功');
    dialogVisible.value = false;
    systemDialogVisible.value = false; // 关闭主对话框
  } catch (error) {
    console.error('Error:', error);
    ElMessage.error('保存失败，请重试');
  }};   // 处理一级分类勾选变化
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
          '/vcis11/upload-dataset',
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
    const downloadTemplate = () => {
      const url = 'http://192.144.141.249:52300/generation/数据集格式示例.jsonl'
    const params = new URLSearchParams({
      AWSAccessKeyId: 'dmeinbi',
      Signature: 'jrJkrT+Ttav/vjieYta/r+Yudhc=',
      Expires: '4844131899'
    })
        window.open(`${url}?${params.toString()}`)
      }

    return {
      systemDialogVisible,
      dialogVisible,
      uploadDialogVisible,
      datasetName,
      uploadForm,
      uploadHeaders,
      datasetParams,
      selectedCount,
      totalCount,
      ethicsDataset,
      activeTab,
      openSystemDialog,
      downloadTemplate,
      handleSystemConfirm,
      handleMainCategoryChange,
      handleSubCategoryChange,
      openNameDialog,
      openUploadDialog,
      saveDatasetConfig,
      beforeUpload,
      handleUploadSuccess,
      handleUploadError,
      handleUploadSubmit,
    };
  }
});
</script>
<style scoped>
.dataset-container {
  padding: 40px;
  background-color: #fff;
  min-height: 100vh;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 30px;
  text-align: center;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  width: 1500px;
  margin: 0 auto;
}

.selection-card {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fff;
}

.selection-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #409eff;
}

.card-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.header-icon {
  font-size: 32px;
  color: #409eff;
  margin-right: 16px;
}

.header-content {
  flex: 1;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 8px 0;
}

.card-description {
  font-size: 14px;
  color: #606266;
  margin: 0;
}

.card-content {
  padding-left: 48px;
}

.feature-list {
  list-style-type: disc;
  margin: 0;
  padding-left: 20px;
  color: #606266;
}

.feature-list li {
  margin-bottom: 8px;
  font-size: 14px;
}

/* 系统数据集对话框样式 */
.dataset-header {
  margin-bottom: 5px;
}

.dataset-form {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  margin: 10px 0;
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
.count-inputs .el-input-number {
  width: 120px; /* 根据需要调整宽度 */
}

.category-section {
  &.alt-background {
    background-color: #f5f7fa;
  }
}
.description-cell {
  padding: 0 10px;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}


.total-count {
  margin: 20px 0;
  text-align: right;
  color: #606266;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
}

.dataset-tabs {
  margin: -20px -20px 0;
}

.dataset-tabs :deep(.el-tabs__content) {
  padding: 20px;
}

.category-description {
  color: #666;
  font-size: 14px;
  padding: 0 10px;
}

.dataset-tabs {
  margin: -20px -20px 0;
}

.dataset-tabs :deep(.el-tabs__content) {
  padding: 20px;
}

.dataset-container {
  padding: 40px;
  background-color: #fff;
  min-height: 100vh;
}

.category-section {
  margin-bottom: 12px;
  border-radius: 4px;
  overflow: hidden;
}

.category-row {
  display: grid;
  grid-template-columns: 60px 200px 1fr 150px 150px;
  align-items: start;
  padding: 12px;
  border-bottom: 1px solid #ebeef5;
}

.subcategories-cell {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
  padding: 4px;
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

.alt-background {
  background-color: var(--el-fill-color-light);
}

.count-inputs {
  text-align: center;
}

.total-count {
  margin: 20px 0;
  text-align: right;
  color: #606266;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
}

/* Element Plus 组件深度选择器样式 */
:deep(.el-input-number) {
  width: 120px;
}

:deep(.el-checkbox) {
  margin-right: 0;
  margin-bottom: 8px;
}

:deep(.el-dialog__body) {
  padding-top: 10px;
  padding-bottom: 10px;
}

/* Element Plus 组件深度选择器样式 */
:deep(.el-input-number) {
  width: 20px;
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

:deep(.el-dialog__body) {
  padding-top: 10px;
  padding-bottom: 10px;
}

/* 上传对话框样式 */
.upload-container {
  padding: 20px;
  width: auto;
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
.upload-dialog :deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

.upload-dialog :deep(.el-dialog__header) {
  margin: 0;
  padding: 20px 24px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.upload-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.upload-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

.upload-dialog :deep(.el-dialog__footer) {
  padding: 16px 24px;
  border-top: 1px solid var(--el-border-color-lighter);
  background-color: var(--el-fill-color-lighter);
}

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-demo {
  width: 100%;
}

.upload-demo :deep(.el-upload-dragger) {
  width: 100%;
  height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--el-border-color);
  border-radius: 12px;
  transition: all 0.3s ease;
  background-color: var(--el-fill-color-lighter);
}

.upload-demo :deep(.el-upload-dragger:hover) {
  border-color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.upload-icon {
  font-size: 48px;
  color: var(--el-color-info-light-3);
  transition: all 0.3s ease;
}

.el-upload-dragger:hover .upload-icon {
  color: var(--el-color-primary);
}

.upload-text {
  font-size: 16px;
  color: var(--el-text-color-regular);
}

.upload-text em {
  color: var(--el-color-primary);
  font-style: normal;
  font-weight: 500;
}

.upload-info {
  margin-top: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.format-text {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.download-btn:hover {
  background-color: var(--el-color-primary-light-9);
}

.download-icon {
  font-size: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.dialog-footer .el-button {
  min-width: 90px;
  padding: 8px 20px;
}
/* 响应式布局 */
@media (max-width: 1400px) {
  .category-row {
    grid-template-columns: 60px 180px 1fr 120px 120px;
  }

  .subcategory-item {
    flex: 0 0 calc(50% - 8px);
  }
}

@media (max-width: 768px) {
  .cards-container {
    grid-template-columns: 1fr;
  }
  
  .dataset-container {
    padding: 20px;
  }

  .category-row {
    grid-template-columns: 50px 150px 1fr 100px 100px;
    font-size: 14px;
  }

  .subcategory-item {
    flex: 0 0 100%;
  }

  :deep(.el-input-number) {
    width: 90px;
  }
}
</style>