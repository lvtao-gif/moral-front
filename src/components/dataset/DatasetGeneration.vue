<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container">
    <div class="button-container">
      <el-button @click="showCreateForm">创建</el-button>
      <el-button @click="refreshList">查询</el-button>
    </div>

    <el-dialog v-model="createFormVisible" title="创建数据集" :center="true">
      <!-- 文件上传 -->
      <el-form-item>
        <el-upload class="upload-demo" drag action="http://127.0.0.1:8000/upload" name="filepath"
          :before-upload="beforeUpload" :on-success="handleUploadSuccess" :style="{ width: '1000px', height: '200px' }">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
          <template #tip>
          </template>
        </el-upload>
      </el-form-item>
      <!-- 创建数据集的表单内容 -->
      <el-form :model="createForm" label-width="80px" class="horizontal-form">
        <el-form-item label="主题">
          <el-input v-model="createForm.topic" style="width: 240px"   placeholder="请输入数据集主题"/>
        </el-form-item>
        <el-form-item label="类别">
          <el-input v-model="createForm.categories" style="width: 240px"  placeholder="请输入数据集类别"/>
        </el-form-item>
      </el-form>
      <el-form :model="createForm" label-width="100px">
        <el-form-item label="段落精细度">
          <el-select v-model="createForm.precision" placeholder="请选择">
            <el-option label="最大长度" value="max_length"/>
            <el-option label="中等长度" value="medium_length" />
            <el-option label="最小长度" value="min_length" />
          </el-select>
        </el-form-item>
        <el-form :model="createForm" label-width="80px" class="horizontal-form">
          <el-form-item label="温度" >
            <el-input v-model="createForm.temperature"  placeholder="默认值0.7"/>
          </el-form-item>
          <el-form-item label="max_token">
            <el-input v-model="createForm.max"  placeholder="默认值1024" />
          </el-form-item>
          <el-form-item label="top_p">
            <el-input v-model="createForm.top"   placeholder="默认值1"/>
          </el-form-item>
            <!--<el-form-item label="max_score">
            <el-input v-model="createForm.max_score"  disabled placeholder="默认值0.7" />
          </el-form-item>-->
        </el-form>
        <el-form :model="createForm"  class="horizontal-form">
          <el-form-item label="min_length">
            <el-input v-model="createForm.min_length"  placeholder="默认值30" />
          </el-form-item>
        </el-form>
        <el-form :model="createForm" label-width="180px" class="horizontal-form"> 
          <el-form-item label="num_questions_to_generate">
            <el-input v-model="createForm.num_questions_to_generate"  placeholder="默认值20" />
          </el-form-item>
        </el-form>
        <el-form :model="createForm" label-position="top" label-width="80px">
          <el-form-item label="prompt">
            <el-input v-model="createForm.sprompt" />
          </el-form-item>
        </el-form>
        <el-form-item>
          <el-button type="primary" @click="createTask">创建数据集</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table :data="tableData" :default-sort="{prop: 'time', order: 'descending'}" border style="width: 100%">
      <!-- 表单定义 -->
      <el-table-column prop="id" label="ID" width="200" />
      <el-table-column prop="time" label="创建时间" width="200" sortable />
      <el-table-column prop="state" label="执行状态" width="100">
      </el-table-column>
      
      <el-table-column prop="additionalInfo" label="附加信息" width="350"></el-table-column>
    
      <el-table-column prop="originalText" label="原始文本" width="300">
        <template v-slot="scope">
          <a :href="scope.row.originalText" target="_blank">{{ scope.row.originalText }}</a>
        </template>
      </el-table-column>

      <el-table-column prop="datasetDownload" label="数据集下载" width="300">
        <template v-slot="scope">
          <a :href="scope.row.datasetDownload" target="_blank">{{ scope.row.datasetDownload }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="数据集评分" width="130">
        <template v-slot="scope">
          <el-button type="text" @click="Details(scope.row.score)">查看详情</el-button>
      </template>
      </el-table-column>
      <el-table-column prop="error1" label="错题详情" width="300">
        <template v-slot="scope">
          <a :href="scope.row.error1" target="_blank">{{ scope.row.error1 }}</a>
        </template>
      </el-table-column>
    </el-table>

    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="currentPage4"
        v-model:page-size="pageSize4"
        :page-sizes="[10, 20, 50, 100]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dynamicTotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
        <!-- 得分对话框 -->
        <el-dialog v-model="scoreDialogVisible" title="得分详情" :center="true">
          <div>{{ errorMessage }}</div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UploadFilled } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox  } from 'element-plus';
import axios from 'axios';
const scoreDialogVisible = ref(false); // 控制对话框显示/隐藏
const errorMessage = ref(''); // 存储错误信息
// 储存表格数据
const tableData = ref([
  {
    id: 1,
    time: '2024-02-26 10:30:00',
    state: '成功',
    additionalInfo: 'min_length: 30, num_questions_to_generate: 20, temperature: 0.7, max_tokens: 1024, top_p: 1',
    originalText: 'https://example.com/original-text1.txt',
    datasetDownload: 'https://example.com/dataset1.zip',
    score: 'Baichuan2-7B-ChatL:0.9,"ZhipuAI":0.8',
    error1: 'https://example.com/error1.txt'

  
  },
  {
    id: 2,
    time: '2024-02-25 15:45:00',
    state: '进行中',
    additionalInfo: 'min_length: 30, num_questions_to_generate: 20, temperature: 0.7, max_tokens: 1024, top_p: 1',
    originalText: 'https://example.com/original-text2.txt',
    datasetDownload: 'Loading',
    score: '0.8',
    error1: 'Loading'
  },
]);

const handleUploadSuccess = (response: { o_url: string; }) => {
  // 处理上传成功的数据，response 包含了后端返回的数据
  console.log('上传成功:', response);

  // 这里可以进行一些其他操作，例如更新表格数据等
  createForm.value.originalText = response.o_url;
  
  //isFileUploaded.value = true;
  
};

const isFileUploaded = ref(false);
const beforeUpload = (file: { name: string; type: string; size: number; }) => {
  const fileExtension = file.name.split('.').pop().toLowerCase();
  const isTextFile = file.type === 'text/plain';
  const isJsonLinesFile = fileExtension === 'jsonl';
  const isSizeValid = file.size / 1024 / 1024 <= 20; // 检查文件大小是否小于或等于20MB
  if (isFileUploaded.value) {
    ElMessage.error('只能上传一个文件，请删除已上传的文件后再次上传');
    return false;
  }
  if (!isTextFile && !isJsonLinesFile) {
    ElMessage.error('只能上传文本文件');
    return false;
  }

  if (!isSizeValid) {
    ElMessage.error('文件大小不能超过20MB');
    return false;
  }

  return true; // 如果两个条件都满足，则允许上传
};

//创建数据集对话框显示
const createFormVisible = ref(false);

//用于存储创建任务的表单数据
const createForm = ref({
  taskName: '',
  state: '',
  additionalInfo: '',
  originalText: '',
  datasetDownload: '',
  temperature: '',
  object: '',
  max: 1024,
  top: 1,
  sprompt: '', 
  prompt: '',
  min_length:30,
  num_questions_to_generate:20,
  precision:'',
  topic: "艺术与文化伦理", 
  categories: "传统传承",
  score:'',
  error1:''
});
//用于存储表格总行数，会在刷新列表时更新。
const dynamicTotal = ref(tableData.value.length);
//分页组件设置
const currentPage4 = ref(1);
const pageSize4 = ref(10);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);



//显示创建数据集对话框的方法，重置表单数据。
const showCreateForm = () => {
  createForm.value = {
    taskName: '',
    precision: '请选择',
    additionalInfo: '',
    originalText: '',
    datasetDownload: '',
    state: '',
    sprompt: '',
    prompt: '',
    error1:'',

 
  };
  createFormVisible.value = true;
};


//创建任务的方法，将表单数据添加到表格数据中。
const createTask = async () => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const currentTime = new Date().toLocaleString('zh-CN').replace(/\//g, '-');
  try {
    // 发送到后端的数据
    const dataToSend = {
    sprompt: createForm.value.sprompt,
    min_length: createForm.value.min_length|| 30,
    num_questions_to_generate: createForm.value.num_questions_to_generate|| 20,
    temperature: createForm.value.temperature|| 0.7,
    max_tokens: createForm.value.max|| 1024,
    top_p: createForm.value.top|| 1,
    topic: createForm.value.topic|| "艺术与文化伦理",
    categories: createForm.value.categories|| "传统传承"
};

    // 发送 POST 请求到后端
    const response = await axios.post('/vc/parameters', dataToSend);
    console.log('后端响应:', response);
    // 检查响应对象的结构
if (response) {
  console.log('响应状态码:', response.status);
  console.log('响应数据:', response.data);
  
  if (response.data) {
    const additionalInfo = response.data;
    // 继续处理 additionalInfo
  } else {
    console.error('未收到有效的响应数据:', response);
  }
} else {
  console.error('请求未成功完成:', response);
}
    const additionalInfo = response.data;
    const keysToShow = [ "min_length", "num_questions_to_generate", "temperature", "max_tokens", "top_p"];
    // 展示后端返回信息
    createForm.value.additionalInfo = keysToShow.map(key => `${key}: ${additionalInfo[key]}`).join(', ');
    

    // 更新表格数据等其他操作
    tableData.value.unshift({
      id:additionalInfo.ID,
      time: currentTime,
      ...createForm.value,
    });

    createFormVisible.value = false;

    ElMessage.success('任务创建成功');
    // 在任务创建成功后调用刷新列表
    refreshList();

  } catch (error) {
    console.error('任务创建失败:', error);
    ElMessage.error('任务创建失败');
  }
    
};




const refreshList = async () => {
  try {
    // 发送 GET 请求到后端获取最新数据
    const response = await axios.post('/vc/getLatestData');
    console.log('完整响应对象:', response);

    // 更新前端表格数据
    const state = response.data;
    
    if (state && state.url) {
      // 查找现有行并更新数据
      const existingRow = tableData.value.find(row => row.id === state.id);
      if (existingRow) {
        // 更新找到的行的数据
        existingRow.datasetDownload = state.url;
        existingRow.state = state.state;
        existingRow.error1 = state.error;

        console.log('列表已刷新');
      } else {
        console.error('找不到匹配的行: 无法更新数据');
      }
    } else {
      console.error('刷新列表时发生错误: 无法获取有效的响应数据');
    }
  } catch (error) {
    console.error('刷新列表时发生错误:', error);
  }
};

// 从后端获取错题详情数据
const Details = async () => {
  scoreDialogVisible.value = true;
  try {
    // 发送 GET 请求到后端获取错题详情数据
    const response = await axios.post('/vc/getLatestData');
    console.log('错误详情数据:', response.data);

    // 更新错误信息
    errorMessage.value = response.data.score;

     
  } catch (error) {
    console.error('获取错题详情失败:', error);
    errorMessage.value = "{'chatglm2-6b_2024-03-22 10:13:09': 0.808531746031746,'chatglm3-6b_2024-03-22 09:51:34': 0.16170634920634921,'Baichuan2-7B-Chat_2024-03-22 09:51:34': 0.8660714285714286,'Yi-6B-Chat_2024-03-22 09:51:34': 0.8462301587301587,'chatglm2-6b_2024-03-22 09:51:34': 0.808531746031746,'Qwen-7B-Chat_2024-03-22 09:51:34': 0.8849206349206349,'chatglm3-6b_2024-03-22 10:13:09': 0.16170634920634921,'Yi-6B-Chat_2024-03-22 10:13:09': 0.8462301587301587}"
  }
};

//处理每页条数变化的方法。
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
//处理当前页码变化的方法。
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);

};
</script>

<style scoped>
.el-form-item__label {
  line-height: 100px;
}
.container {
  margin-Top: 20px;
  display: flex;
  flex-direction: column;
}
.success-message {
  color: green;
  margin-left: 10px;
}

.button-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  margin-left: 10px;
}
.horizontal-form {
  display: flex;
  align-items: center;
}
.demo-pagination-block {
  margin-top: 10px;
}

.success-state {
  color: green;
}

.fail-state {
  color: red;
}

.progress-state {
  color: blue;
}

.pagination-container {
  margin-top: 28px;
  margin-right: 80px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #003399 !important;
  color: #FFFFFF;

}

:deep .el-pagination .el-pager li:not(.active):not(.disabled) {
  font-weight: 400;
  font-size: 14px;
  color: #41475E;
  text-align: center;
}

</style>
