<template>
  <el-container>
    <el-aside width="288px" style="height: 900px; background-color: blue;">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-vertical-demo"
        background-color="#337ecc"
        text-color="#fff"
        active-text-color="#c6e2ff"
        @select="handleSelect"
      >
      <el-menu-item index="0" class="menu-text">使用指南</el-menu-item>
        <el-menu-item index="1" class="menu-text">大模型配置</el-menu-item>
        <el-menu-item index="2" class="menu-text">数据集选择</el-menu-item>
        <el-menu-item index="3" class="menu-text">发布任务</el-menu-item>
        <el-menu-item index="4" class="menu-text">任务管理</el-menu-item>
      </el-menu>
    </el-aside>
    <el-main style="background-color: white;">
      <div v-if="activeIndex === '0'">
        <div class="rules">
          <h2>使用指南</h2>
          <ol>
            <li>输入公司或者团队，机构的名称</li>
            <li>输入大模型的名称</li>
            <li>输入大模型的API</li>
            <li>输入API的调用方式</li>
            <li>确认之后点击保存，然后点击下一步</li>
            <li>本数据集是根据《生成式人工智能管理办法》和《生成式人工智能服务安全基本要求》生成,本数据集涵盖《生成式人工智能服务安全基本要求》规定的5类31种风险</li>
            <li>数据集分为三类, 用户可根据自己需求选择题目种类和数量</li>
            <li>不同的题目和种类对应着不同的参考价格,参考价格仅供用户参考，可能与实际收费存在偏差，具体以实际收费为准</li>
            <li>添加完之后可以在“发布任务”界面的我的数据集查看</li>
            <li>先点击“我的数据集”的查询，查询已经配置好的数据集并选择数据集</li>
            <li>点击“我的数据集”的查询，查询已经配置好的大模型并选择需要检测的大模型</li>
            <li>选择好后按下发布按钮即可发布任务，后续结果请在“报告查询中”查看</li>
            <li>点击查询即可获得测评任务进行状态和报告</li>
          </ol>
        </div>
        <div class="strategy">
          <el-button type="success" size="large" @click="goToMenu1">开始使用</el-button>
        </div>
        
      </div>
      <div v-if="activeIndex === '1'">
        <div class="steps-container">
        <el-steps
        style="width: 500px;"
        :space="200"
        :active="0"
      >
        <el-step title="大模型配置" />
        <el-step title="数据集选择" />
        <el-step title="发布任务" />
        <el-step title="任务管理" />
      </el-steps>
    </div>
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 650px;">
          <div style="display: flex; align-items: center; margin-bottom: 30px;">
            <span style="margin-right: 5px;">公司、团队或机构名称：</span>
            <el-input v-model="inputteam" style="width: 500px;" placeholder="请输入公司、组织或机构名称"></el-input>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <span style="margin-right: 79px;">大模型名称：</span>
            <el-input v-model="modelName" style="width: 500px;" placeholder="大模型名称"></el-input>
          </div>
          <div style="display: flex; align-items: center;">
            <span style="margin-right: 24px;">大模型API调用方式：</span>
            <el-input v-model="textarea" style="width: 500px" :rows="21" type="textarea" placeholder="Please input"></el-input>
          </div>
        </div>
        <div class="mb-4" style="display: flex; justify-content: center;">
          <el-button type="primary" @click="saveModelConfig">保存</el-button>
          <el-button type="success" @click="goToMenu2">下一步</el-button>
        </div>
      </div>
      <div v-else-if="activeIndex === '2'">
        <div class="steps-container">
        <el-steps
        style="width: 500px;"
        :space="200"
        :active="1"
        finish-status="success"
        
      >
        <el-card class="data-collection-form" header="数据集详细数量配置">
      <div v-for="(section, sectionIndex) in formData" :key="sectionIndex">
        <h3>{{ section.title }}</h3>
        <div class="form-grid">
          <div v-for="(item, itemIndex) in section.items" :key="itemIndex" class="form-item">
            <span class="label">{{ item.label }}</span>
            <el-input-number
              v-model="item.value"
              :min="0"
              @change="(value) => updateValue(sectionIndex, itemIndex, value)"
            />
          </div>
        </div>
        <el-divider v-if="sectionIndex < formData.length - 1" />
      </div>
    </el-card>
        <el-step title="大模型配置" />
        <el-step title="数据集选择" />
        <el-step title="发布任务" />
        <el-step title="任务管理" />
      </el-steps>
    </div>
       
      </div>
      <div v-if="activeIndex === '3'">
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
          <el-table :data="datasets" border style="width: 100%">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" label="数据集ID" width="500" />
            <el-table-column prop="name" label="数据集选择" width="520" />
            <el-table-column label="数据集操作" width="500">
              <template v-slot="scope">
                <el-button @click="deleteDataset(scope.$index, datasets)" type="danger">删除</el-button>
                <el-button @click="queryDataset(scope.row)" type="primary">查看数据集</el-button>
              </template>
            </el-table-column>
          </el-table> 

          <h2>我的关键词库</h2>
          <el-table :data="keywords" border style="width: 100%">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" label="关键词ID" width="500" />
            <el-table-column prop="name" label="关键词名称" width="500" />
            <el-table-column label="关键词操作" width="520">
              <template v-slot="scope">
                <el-button @click="deleteKeyword(scope.$index, keywords)" type="danger">删除</el-button>
                <el-button @click="queryKeyword(scope.row)" type="primary">查看数据集</el-button>
              </template>
            </el-table-column>
          </el-table>

          <h2>我的大模型</h2>
          <el-table :data="models" border style="width: 100%">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" label="大模型ID" width="400" />
            <el-table-column prop="name" label="大模型名称" width="500" />
            <el-table-column label="大模型操作" width="620">
              <template v-slot="scope">
                <el-button @click="deleteModel(scope.$index, models)" type="danger">删除</el-button>
                <el-button @click="queryModel(scope.row)" type="primary">查看数据集</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="button-container">
          <el-button type="success" class="custom-button" @click="publishTask">发布任务</el-button>
          <el-button type="success" class="custom-button" @click="goToMenu4">下一步</el-button>
        </div>
      </div>
      <div v-else-if="activeIndex === '4'">
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
        <el-button type="primary" @click="inquire">查询</el-button>
          </div>
        <el-table :data="t1" border style="width: 100%">
          <el-table-column prop="taskId" label="任务ID" width="180" />
          <el-table-column prop="taskName" label="任务名称" width="180" />
          <el-table-column prop="datasetName" label="数据集名称" width="180" />
          <el-table-column prop="keywordName" label="关键词名称" width="180" />
          <el-table-column prop="modelName" label="模型名称" width="180" />
          <el-table-column prop="taskStatus" label="任务状态" width="180" />
          <el-table-column prop="creationTime" label="创建时间" width="180" />
          <el-table-column prop="download" label="下载链接" />
        </el-table> 
      </div>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref , watch} from 'vue';
import axios from 'axios';
import { 
  ElContainer, 
  ElAside, 
  ElMain, 
  ElMenu, 
  ElMenuItem,
  ElMessage,
  ElButton,
  ElCard, 
  ElDivider,
  ElInputNumber,
  ElInput, 
  ElTable, 
  ElTableColumn, 
  ElCheckbox, 
  ElCheckboxGroup,
  ElMessageBox
} from 'element-plus';

export default defineComponent({
  name: 'MyComponent',
  components: {
    ElContainer,
    ElAside,
    ElMain,
    ElMenu,
    ElMenuItem,
    ElButton,
    ElInput,
    ElTable,
    ElTableColumn,
    ElCheckbox,
    ElCheckboxGroup,
    ElMessageBox
  },
  setup() {
    const activeIndex = ref<string>('1');
    const inputteam = ref<string>('');
    const modelName = ref<string>('');
    const totalPrice = ref<number>(0);
    const datasets = ref<any[]>([]);
    const keywords = ref<any[]>([]);
    const models = ref<any[]>([]);
    const userJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3NTI4OTE4NzF9.6OFjQ62TRDJbW4fdGvuhm3lKazws_iUUGrVKInPDMt8';

    const cards = ref<any[]>([
      {
        title: '生成内容测评数据集',
        description: `
          <ul>
            <li>煽动国家颠覆政权，推翻社会主义制度</li>
            <li>危害国家统一、主权和领土完整</li>
            <li>煽动分裂国家，破坏民族团结和社会稳定</li>
            <li>宣扬恐怖主义、极端主义</li>
            <li>宣扬民族优越</li>
            <li>宣扬淫秽、暴力色情</li>
            <li>传播谣言有害信息</li>
            <li>其他法律、行政法规禁止的内容</li>
            <li>民族歧视内容</li>
            <li>信仰歧视内容</li>
            <li>国别歧视内容</li>
            <li>地域歧视内容</li>
            <li>性别歧视内容</li>
            <li>年龄歧视内容</li>
            <li>职业歧视内容；</li>
            <li>健康歧视内容</li>
            <li>其他方面歧视内容</li>
            <li>侵犯他人知识产权</li>
            <li>违反商业道德</li>
            <li>泄露他人商业秘密</li>
            <li>利用算法、数据、平台等优势，实施垄断和不正当竞争行为</li>
            <li>其他商业违法违规行为</li>
            <li>危害他人身心健康</li>
            <li>侵犯他人肖像权</li>
            <li>侵犯他人名誉权</li>
            <li>侵犯他人荣誉权</li>
            <li>侵犯他人其他合法权益</li>
            <li>内容不准确</li>
            <li>内容不可靠</li>
          </ul>
        `,
        quantity: 0,
        price: 160
      },
      {
        title: '应答拒答数据集',
        description: `
          <ul>
            <li>应答题</li>
            <li>拒答题</li>
          </ul>
        `,
        quantity: 0,
        price: 260
      },
      {
        title: '关键词库',
        description: `
          <ul>
            <li>总规模不宜少于10000个</li>
            <li>覆盖《生成式人工智能服务安全基本要求》附录A.1以及A.2中17种安全风险</li>
            <li>《生成式人工智能服务安全基本要求》附录A.1中每一种安全风险的关键词均不宜少于200个</li>
            <li>《生成式人工智能服务安全基本要求》附录A.2中每一种安全风险的关键词均不宜少于100个</li>
            <li>其他商业违法违规行为。</li>
          </ul>
        `,
        quantity: 0,
        price: 360
      }
    ]);

    const defaultText = ref<string>(JSON.stringify({
      modelConfig: {
        url: "http://xxx.yyy.zzz/api",
        headers: {
          "Content-Type": "application/json",
          "Access-Key": "xxx"
        },
        data: {
          prompt: "%prompt%",
          token: "xxx"
        },
        answer: "result.content",
        concurrency: 2,
        retries: 1,
        timeout: 60
      },
      userJwt: userJwt
    }, null, 2));

    const saveModelConfig = async () => {
      try {
        const config = JSON.parse(defaultText.value);

        const requestData = {
          modelName: modelName.value,
          modelConfig: config.modelConfig,
          userJwt: config.userJwt
        };
        console.log("Request Data:", requestData);

        const response = await axios.post('/vc/model/add', requestData);

        console.log('Response:', response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const updatePrice = () => {
      let total = 0;
      cards.value.forEach((card) => {
        if (card.quantity > 0) {
          total += card.price * card.quantity;
        }
      });
      totalPrice.value = total;
    };

    const handleSelect = (key: string) => {
      activeIndex.value = key;
    };

    const goToMenu1 = () => {
      activeIndex.value = '1';
    };

    const goToMenu2 = () => {
      activeIndex.value = '2';
    };

    const goToMenu3 = () => {
      activeIndex.value = '3';
    };
    const goToMenu4 = () => {
      activeIndex.value = '4';
    };

    const addCard = async () => {
      const card = cards.value[0];
      const requestData = {
        datasetName: card.title,
        userJwt: userJwt,
        standard_count: card.quantity
      };

      try {
        await axios.post('vc/generate-dataset/add', requestData);
        ElMessage.success('数据集添加成功');
      } catch (error) {
        console.error(`Error adding card ${0 + 1}:`, error);
        ElMessage.error('数据集添加失败');
      }
    };

    const addCard2 = async () => {
      const card = cards.value[1];
      const requestData = {
        datasetName: card.title,
        userJwt: userJwt,
        standard_count: card.quantity
      };

      try {
        await axios.post('vc/response-dataset/add', requestData);
        ElMessage.success('数据集添加成功');
      } catch (error) {
        console.error(`Error adding card ${1 + 1}:`, error);
        ElMessage.error('数据集添加失败');
      }
    };

    const addCard3 = async () => {
      const card = cards.value[2];
      const requestData = {
        datasetName: card.title,
        userJwt: userJwt,
        standard_count: card.quantity
      };

      try {
        await axios.post('vc/keyword/add', requestData);
        ElMessage.success('数据集添加成功');
      } catch (error) {
        console.error(`Error adding card ${2 + 1}:`, error);
        ElMessage.error('数据集添加失败');
      }
    };

    const fetchDataForPage3 = async () => {
      try {
        const response = await axios.get('vc/evaluation/choose', {
          params: { userJwt },
        });
        
        if (response.data.code === 0) {
          const { dataset, keyword, model } = response.data.data;
          datasets.value = dataset;
          keywords.value = keyword;
          models.value = model;
        } else {
          ElMessage.error('数据加载失败');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        ElMessage.error('请求失败，请稍后再试');
      }
    };

    watch(activeIndex, (newVal) => {
      if (newVal === '3') {
        fetchDataForPage3();
      }
    });





 const deleteDataset = (index: number, list: any[]) => {
      ElMessageBox.confirm('确定删除此数据集吗?', '警告', {
        type: 'warning'
      }).then(() => {
        // 删除逻辑
        list.splice(index, 1);
      }).catch(() => {
        // 取消删除
      });
    };
    const deleteKeyword = (index: number, list: any[]) => {
      ElMessageBox.confirm('确定删除此关键词吗?', '警告', {
        type: 'warning'
      }).then(() => {
        // 删除逻辑
        list.splice(index, 1);
      }).catch(() => {
        // 取消删除
      });
    };


    const deleteModel = (index: number, list: any[]) => {
      ElMessageBox.confirm('确定删除此大模型吗?', '警告', {
        type: 'warning'
      }).then(() => {
        // 删除逻辑
        list.splice(index, 1);
      }).catch(() => {
        // 取消删除
      });
    };

    

    const queryDataset = (row: any) => {
      // Send HTTP request to query dataset details
      // Render response in a popup
    };

    const queryModel = (row: any) => {
      // Send HTTP request to query model details
      // Render response in a popup
    };

    const formLabelWidth = ref('120px');
    const showCreateForm = ref(false);
    const createFormData = ref<number[]>([]);

    const fetchCreateFormData = async () => {
      try {
        const response = await axios.post('vc/evaluation/task/add');
        createFormData.value = response.data;
        showCreateForm.value = true;
      } catch (error) {
        ElMessage.error('获取创建表单数据失败');
        console.error('Error fetching create form data:', error);
      }
    };
    const publishTask = async () => {
      try {
        const response = await axios.post('vc/evaluation/task/add', {
          taskName: "Test Evaluation Task",
          datasetId: 1,
          keywordId: 2,
          modelId: 3,
          userJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3NTI4OTE4NzF9.6OFjQ62TRDJbW4fdGvuhm3lKazws_iUUGrVKInPDMt8
" // 请确保使用有效的 JWT
        });

        console.log('Task published successfully:', response.data);
        
        ElMessage.success('任务发布成功');
      } catch (error) {
        console.error('Error publishing task:', error);
        // 这里可以添加错误提示
         ElMessage.error('任务发布失败，请重试');
      }
    };


    const submitCreateForm = async () => {
      const requestData = {
        taskName: 'Test Evaluation Task',
        datasetId: createFormData.value[0], 
        keywordId: 2,
        modelId: 3,
        userJwt: userJwt 
      };

      try {
        const response = await axios.post('/evaluation/task/create', requestData);
        const responseData = response.data;

        if (responseData.status === 0) {
          ElMessage.success('任务发布成功');
          showCreateForm.value = false;
          inquire();
        } else {
          ElMessage.error(responseData.message);
        }
      } catch (error) {
        ElMessage.error('请求失败，请稍后再试');
        console.error('Error submitting create form:', error);
      }
    };

    const t1 = ref<any[]>([]);

    const inquire = async () => {
      try {
        const response = await axios.get('vc/evaluation/task/query', {
          params: {
            userJwt: userJwt
          }
        });
        if (response.data.code === 0) {
          t1.value = response.data.data;
        } else {
          console.error('查询失败:', response.data.message);
        }
      } catch (error) {
        console.error('请求失败:', error);
      }
    };
    
    return {
      activeIndex,
      inputteam,
      textarea: defaultText,
      modelName,
      saveModelConfig,
      totalPrice,
      cards,
      handleSelect,
      goToMenu1,
      goToMenu2,
      goToMenu3,
      addCard,
      addCard2,
      addCard3,
      inquire,
      formLabelWidth,
      showCreateForm,
      createFormData,
      fetchCreateFormData,
      t1,
      datasets,
      keywords,
      models,
      goToMenu4,
      publishTask,
      fetchDataForPage3,
      deleteKeyword,
      deleteDataset,
      deleteModel,
      queryDataset,
      queryModel,
      submitCreateForm,
      updatePrice
    };
  }
});
</script>


<style scoped>
.steps-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
}
.el-menu-vertical-demo {
  border-right: none;
}
.menu-text {
  font-weight: 700;
  font-size: 16px;
  color:#D4D7DE;
  line-height: 30px;
  text-align: center;
  margin-bottom: 25.5px;
}
.rules {
  background-color: #a3b9e8;
  padding: 20px;
  border-radius: 8px;
}
.strategy {
  margin-top: 30px; /* 与上面组件的距离 */
  text-align: center; /* 居中文本和按钮 */
}
.rules h2 {
  margin-bottom: 10px;
}
.rules ol {
  list-style: decimal;
  padding-left: 20px;
}
.el-menu-vertical-demo {
  width: 100%;
  height: 100%;
  border-right: none;
}
.mb-3 {
  text-align: right;
}
.mb-4 {
  margin-bottom: 100px;
}
.card-content {
  columns: 3; /* 你可以根据需要调整列数 */
  -webkit-columns: 3;
  -moz-columns: 3;
  column-gap: 1px;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

.card-header {
  font-weight: bold;
}

.card-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
}
.button-container {
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 30px; /* 按钮之间的间距 */
}
.custom-button {
  font-size: 30px; /* 设置字体大小 */
  padding: 30px 30px; /* 调整按钮内边距，使其更大 */
  border-radius: 60px; /* 可选：设置按钮圆角 */
  color: #faf9f9;
  background-color: #4f5cd0;
}
.total-price {
  width: 100%;
  text-align: right;
  font-size: 30px;
  margin-top: 16px;
  font-weight: bold;
  color: orangered;
}
.query-button {
  padding: 12px 20px;
  font-size: 16px;}
</style>
