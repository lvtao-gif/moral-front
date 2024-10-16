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
          <el-steps :active="0" finish-status="success" align-center>
            <el-step title="大模型配置" />
            <el-step title="数据集选择" />
            <el-step title="发布任务" />
            <el-step title="任务管理" />
          </el-steps>
        </div>
          <el-card class="data-collection-form" header="生成内容评测">
          <div v-for="(category, categoryIndex) in datasetParams.categories" :key="categoryIndex">
            <h3>{{ category.name }}</h3>
            <div class="form-grid">
              <div v-for="(subcategory, subcategoryIndex) in category.subcategories" :key="subcategoryIndex" class="form-item">
                <span class="label">{{ subcategory.name }}</span>
                <div>
                  <el-input-number
                    v-model="subcategory.standard_count"
                    :min="0"
                    @change="updateValue(categoryIndex, subcategoryIndex, 'standard_count')"
                    size="small"
                  />
                  <el-input-number
                    v-model="subcategory.advanced_attack_count"
                    :min="0"
                    @change="updateValue(categoryIndex, subcategoryIndex, 'advanced_attack_count')"
                    size="small"
                  />
                </div>
              </div>
            </div>
            <el-divider v-if="categoryIndex < datasetParams.categories.length - 1" />
          </div>
        </el-card>
        <div class="button-container">
          <el-button type="success" @click="openNameDialog">保存数据集</el-button>
          <el-button type="primary" @click="goToNextStep">下一步</el-button>
      
    </div>
        </el-main>
        <!-- Add this dialog component for naming the dataset -->
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
      </el-container>
    </el-container>
  </template>
  
  <script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'DatasetSelection',
  setup() {
    const router = useRouter();
    const activeMenu = ref('dateset');
    const datasetName = ref('');
    const userJwt = ref('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3NTI4OTE4NzF9.6OFjQ62TRDJbW4fdGvuhm3lKazws_iUUGrVKInPDMt8');
    const dialogVisible = ref(false);

    const datasetParams = ref({
  categories: [
    {
      name: "A1 违反社会主义核心价值观",
      subcategories: [
        {
          name: "煽动颠覆国家政权, 推翻社会主义制度",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "危害国家安全和利益, 损害国家形象",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "煽动分裂国家, 破坏国家统一和社会稳定",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "宣扬恐怖主义, 极端主义",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "宣扬民族仇恨, 民族歧视",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "宣扬暴力, 淫秽色情",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "宣传虚假有害信息",
          standard_count:0,
          advanced_attack_count: 0
        },
        {
          name: "其他法律, 行政法规禁止的内容",
          standard_count: 0,
          advanced_attack_count: 0
        }
      ]
    },
    {
      name: "A2 辱骂性内容",
      subcategories: [
        {
          name: "民族歧视内容",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "信仰歧视内容",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "国别歧视内容",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "地域歧视内容",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "性别歧视内容",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "年龄歧视内容",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "职业歧视内容",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "监控歧视内容",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "其他方面歧视内容",
          standard_count: 0,
          advanced_attack_count: 0
        }
      ]
    },
    {
      name: "A3 商业违法违规",
      subcategories: [
        {
          name: "侵犯他人知识产权",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "违反商业道德",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "泄露他人商业秘密",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "实施垄断和不正当竞争行为",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "其他商业违法违规行为",
          standard_count: 0,
          advanced_attack_count: 0
        }
      ]
    },
    {
      name: "A4 侵犯他人合法权益",
      subcategories: [
        {
          name: "危害他人身心健康",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "侵犯他人肖像权",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "侵犯他人名誉权",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "侵犯他人荣誉权",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "侵犯他人隐私权",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "侵犯他人个人信息权益",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "侵犯他人其他合法权益",
          standard_count: 0,
          advanced_attack_count: 0
        }
      ]
    },
    {
      name: "A5 准确性和可靠性",
      subcategories: [
        {
          name: "内容不准确",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name: "内容不可靠",
          standard_count: 0,
          advanced_attack_count: 0
        }
      ]
    },
    {
      name: "B应答拒答题库",
      subcategories: [
        {
          name: "B1 应答题",
          standard_count: 0,
          advanced_attack_count: 0
        },
        {
          name:"B1 应答题",
          standard_count: 0,
          advanced_attack_count: 0
        }
      ]
    }
  ]
});

    const currentPageTitle = computed(() => '数据集选择');

    const handleSelect = (key: string) => {
      router.push(`/${key}`);
    };

    const updateValue = (categoryIndex: number, subcategoryIndex: number, field: 'standard_count' | 'advanced_attack_count') => {
      // You can add additional logic here if needed
    };

    const openNameDialog = () => {
      dialogVisible.value = true;
    };

    const saveDatasetConfig = async () => {
      if (!datasetName.value) {
        // Show an error message if the dataset name is empty
        ElMessage.error('请输入数据集名称');
        return;
      }

      try {
        const requestData = {
          datasetName: datasetName.value,
          userJwt: userJwt.value,
          datasetParams: datasetParams.value
        };
        const response = await axios.post('http://10.110.147.246:5004/generate-dataset/add', requestData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Configuration saved:', response.data);
        ElMessage.success('数据集保存成功');
        dialogVisible.value = false;
      } catch (error) {
        console.error('Error saving configuration:', error);
        ElMessage.error('保存失败，请重试');
      }
    };


    const goToNextStep = () => {
      router.push('/task');
    };

    return {
      activeMenu,
      datasetParams,
      currentPageTitle,
      handleSelect,
      openNameDialog,
      dialogVisible,
      updateValue,
      datasetName,
      saveDatasetConfig,
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
  .sidebar .el-menu-item span {
  font-size: 16px;
  font-weight: 500;
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
  margin-bottom: 30px;
}
  
  .data-collection-form {
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