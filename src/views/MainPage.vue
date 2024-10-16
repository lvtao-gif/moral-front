<script setup lang="ts">
import {onMounted, ref} from "vue";
import axios from "../utils/httpclient";
import model_store from "../components/models/store";
import datasets_store from "../components/dataset/store";
import {useRouter} from 'vue-router';

const router = useRouter();

const modelTableData = ref([]);
const datasetTableData = ref([]);

const navigateToDetailPage = (row) => {
  row.name = row.name.replace(/\//g, "--");
  window.open('/model_detail/' + row.name);
};

const navigateToDatasetDetailPage = (row) => {
  window.open('/dataset_detail/' + row.data_id);
};

const handleButtonClick2 = () => {
  router.push('/evarank');
};
const loading = ref(true);

onMounted(async () => {
  adjustCardHeight();

  try {
    loading.value = false;
    // Fetch model data
    const modelResponse = await axios.get('/api/model/available', {});
    modelTableData.value = modelResponse.data;
    model_store.list = modelTableData.value;

    // Fetch dataset data
    const datasetResponse = await axios.get('/api/dataset/list', {});
    datasetTableData.value = datasetResponse.data.list.flatMap(category =>
        category.datasets.map(dataset => ({
          name: dataset.name,
          data_id: dataset.data_id,
        }))
    );
  } catch (error) {
    loading.value = false;
    console.error('An error occurred:', error);
    modelTableData.value = model_store.list.map(item => ({name: item.name}));
    datasetTableData.value = datasets_store.list.flatMap(category =>
        category.datasets.map(dataset => ({
          name: dataset.name,
          data_id: dataset.data_id,
        }))
    );
  }
});

const fourBasicFunc = ref([
  {
    title: '周期性伦理风险排行',
    description: '平台定期发布涵盖多个领域和场景的伦理风险综合分析报告，深入探讨当前的主要伦理挑战和发展趋势，为用户提供关键的伦理风险洞察及其排行信息。',
    iconUrl: 'image/main/mainPage/fc1.svg'
  },
  {
    title: '第三方模型接入',
    description: '平台支持第三方模型接入，并提供伦理风险测试报告，旨在推动AI技术的负责任和可持续发展，帮助构建更安全、更道德的AI生态。',
    iconUrl: 'image/main/mainPage/fc2.svg'
  },
  {
    title: '定制化伦理风险管理',
    description: '基于4级风险分级体系，平台为用户提供量身定制的伦理风险评测报告。不仅精确地识别风险点，还提供个性化的安全策略和建议，助力用户高效管理伦理风险。',
    iconUrl: 'image/main/mainPage/fc3.svg'
  },
  {
    title: '伦理态势实时追踪',
    description: '平台具备实时追踪和评估新兴热点事件的能力，保证伦理风险评估内容的及时更新和相关性，以应对快速变化的社会和技术环境。',
    iconUrl: 'image/main/mainPage/fc4.svg'
  }
]);

const fourHighlights = ref([
  {
    title: "4级风险分级体系",
    description: "本平台引入了一个创新的4级风险分级体系，涵盖从“低”到“极高”不同程度的风险。此体系旨在对平台的各项测试数据进行细致的风险评估，确保用户可以清晰地了解每个领域潜在的风险等级。通过这种分级，平台能够为用户提供更为精准和个性化的安全建议和策略，帮助他们更好地理解和管理各类风险。",
    iconUrl: 'image/main/mainPage/hl1.svg'
  },
  {
    title: "16大领域数据集",
    description: "本平台汇集了16个重要领域的数据集，覆盖政治、经济、社会等多个重要领域。这些数据集通过综合分析不同领域的核心伦理问题，为用户提供了一个全面的伦理和道德评测框架。每个数据集都精心设计，以确保能够全面反映该领域的特点和挑战，从而使评测结果更加准确和有价值。",
    iconUrl: 'image/main/mainPage/hl2.svg'
  },
  {
    title: "48个伦理测评维度",
    description: "本平台提供了48个不同的伦理测评维度，这些维度涵盖了从个人道德到社会伦理的各个方面。这些维度基于广泛的研究和专家意见，确保能够全面地评估个人或组织在伦理方面的表现。这些维度的设置旨在帮助用户从多角度审视和理解伦理问题，从而促进更加负责任和道德的决策。",
    iconUrl: 'image/main/mainPage/hl3.svg'
  },
  {
    title: "10+万伦理道德价值观测试案例",
    description: "本平台的测试数据集包含超过10万个伦理道德价值观测试案例，覆盖15大类和51小类不同的主题。这些数据经过人工抽样评测，准确率高达95%，提供了一个非常可靠和全面的道德评测基础。这个巨大的数据集不仅能够提供深入的洞见，而且有助于确保评测结果的广泛适用性和高度准确性。",
    iconUrl: 'image/main/mainPage/hl4.svg'
  }
]);

// 用于调节el-card高度
// 在页面加载完成后或数据加载完成后调用这个函数
function adjustCardHeight() {
  const modelCardHeight = document.querySelector('.model-card-item-container').offsetHeight;
  const datasetCardHeight = document.querySelector('.dataset-card-item-container').offsetHeight;
  const maxHeight = Math.max(modelCardHeight, datasetCardHeight) + 160;

  document.querySelectorAll('.tag-container-model, .tag-container-dataset').forEach(card => {
    card.style.height = `${maxHeight}px`;
  });
}


</script>

<template>
  <el-main style="background-color: #f8f9fa;--el-main-padding: 0;">
    <!-- 大模型伦理评测平台 + 描述 + 底图 -->
    <div class="banner-container">
      <div class="banner-overlay">
        <h1 class="banner-title">大模型伦理评测平台</h1>
        <div class="banner-desc">
          "大模型伦理评测平台"（Large Model Ethical Evaluation
          Platform）旨在全面评估大语言模型的伦理表现。结合3H原则（有益、诚实、无害）和中国共产党第十八次全国代表大会提出的“五位一体”总体布局，该平台设计了包含4级风险分级体系、45个伦理测评维度的伦理评估框架，建立了相应的伦理价值判断体系，同时涵盖经济、政治、文化、社会和生态文明等领域。平台包括超过10万个伦理道德价值测试数据集，覆盖15个主要类别和51个子类别，手工抽样准确率高达95%。平台支持第三方接入，并已对多个开源大型语言模型进行了伦理风险评估，能够为研究人员、开发者和政策制定者提供关于AI技术伦理影响的深入见解，从而促进更加负责任和可持续的AI技术发展。
        </div>
        <div class="banner-button-container">
          <el-button class="button-handler" disabled>手册</el-button>
          <el-button class="button-rank" @click="handleButtonClick2" plain>排行榜</el-button>
        </div>
      </div>

    </div>

    <!-- 四大基本功能 -->
    <div class="container-title">
      <span class="title-item">四大基本功能</span>
    </div>
    <div class="page-container-item">
      <div class="container-item" v-for="(item, index) in fourBasicFunc" :key="index">
        <el-card shadow="hover">
          <div class="func-card-container">
            <img :src="`/public/${item.iconUrl}`" class="icon-img" alt="">
            <div class="card-title">{{ item.title }}</div>
            <div class="card-desc">{{ item.description }}</div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 四大特点 -->
    <div class="container-title">
      <span class="title-item">四大特点</span>
    </div>
    <div class="page-container-item">
      <div class="container-item" v-for="(item, index) in fourHighlights" :key="index">
        <el-card shadow="hover">
          <div class="hightlight-card-container">
            <img :src="`/public/${item.iconUrl}`" class="icon-img" alt="">
            <div class="card-title">{{ item.title }}</div>
            <div class="card-desc">{{ item.description }}</div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 测评模型与数据集 -->
    <div class="container-title">
      <span class="title-item">测评模型与数据集</span>
    </div>
    <div class="card-container-model" style="margin-bottom: 80px;">
      <div class="model-card-item-container">
        <el-card shadow="hover">
          <div class="title-card">
            <div class="item-title">评测模型</div>
            <div class="sub-title-item">Evaluation model</div>
          </div>
          <el-divider/>

          <div class="tag-container-model">
            <span class="item-name">模型名称</span>
            <div class="tag-item" v-for="(model, index) in modelTableData" :key="index" v-loading="loading">
              <el-button class="tag-item-style" @click="navigateToDetailPage(model)">{{ model.name }}</el-button>
            </div>
          </div>
        </el-card>

      </div>

      <div class="dataset-card-item-container" style="height: 505.5px;">
        <el-card shadow="hover">
          <div class="title-card">
            <div class="item-title">评测数据集</div>
            <div class="sub-title-item">Evaluation data set</div>
          </div>
          <el-divider/>

          <div class="tag-container-dataset">
            <span class="item-name">数据集名称</span>
            <div v-for="(dataset, index) in datasetTableData" :key="index" v-loading="loading">
              <el-button class="tag-item-style" @click="navigateToDatasetDetailPage(dataset)">{{
                  dataset.name
                }}
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </el-main>

</template>


<style scoped>
.banner-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  background-image: url(/image/main/mainPage/main-background.png);
  background-size: cover;
  background-position: center;
  height: 640px;
  position: relative;
}


.banner-title {
  width: 504px;
  height: 78px;
  font-weight: 600;
  font-size: 56px;
  color: #FFFFFF;
  line-height: 66px;
  text-align: left;
  margin-top: 130px;
  margin-bottom: 24px;
  margin-left: 80px;
  margin-right: 1336px;

}

.banner-desc {
  width: 725px;
  height: 224px;
  font-weight: 400;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 28px;
  padding-left: 80px;
}


.banner-button-container {
  display: flex;
  width: 192px;
  height: 40px;
  gap: 16px;
  margin-top: 40px;
  margin-bottom: 216px;
  margin-left: 80px;
  margin-right: 1336px;
}

.button-handler {
  width: 80px;
  height: 40px;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #FFFFFF;
  background-color: transparent;
  color: #FFFFFF;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
}

.button-rank {
  width: 96px;
  height: 40px;
  background: #FFFFFF;
  border-radius: 4px 4px 4px 4px;
  font-weight: 500;
  font-size: 16px;
  color: #242837;
  line-height: 24px;
  text-align: left;
}

.icon-img {
  width: 88px;
  height: 88px;
  margin-bottom: 24px;
}

.card-title {
  width: 343px;
  height: 39px;
  font-weight: 600;
  font-size: 28px;
  color: #121127;
  line-height: 33px;
  margin-bottom: 24px;
}

.card-desc {
  width: 343px;
  font-weight: 400;
  font-size: 16px;
  color: rgba(18, 17, 39, 0.7);
  line-height: 28px;
  margin-bottom: 68px;
}

.func-card-container {
  height: 367px;
  width: 343px;
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 40px;
  margin-bottom: 68px;

}


.hightlight-card-container {
  margin-top: 40px;
  margin-bottom: 40px;
  height: 490px;
  width: 343px;
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.container-item {
  flex: 1; /* 平分父容器的宽度 */
  display: flex;
  justify-content: center;
}

.card-container-model {
  display: flex;
  justify-content: center;
  margin: 0 auto; /* 居中显示 */
  max-width: 100%; /* 设置最大宽度，防止撑满页面 */
  align-items: stretch; /* 让子元素的高度自动填充整个父容器的高度 */
}

.title-item {
  font-weight: 600;
  font-size: 48px;
  color: #121127;
  line-height: 56px;
  text-align: center;

}

.container-title {
  height: 67px;
  text-align: center;
  width: fit-content;
  margin: 80px auto 40px;
}

.item-title {
  font-weight: 600;
  font-size: 28px;
  color: #121127;
  line-height: 33px;
  text-align: center;
}

.sub-title-item {
  font-weight: 400;
  font-size: 16px;
  color: #121127;
  line-height: 19px;
  text-align: center;
}

.title-card {
  width: 710px;
  height: 77px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 40px;
  margin-bottom: 41px;
  margin-left: 64px;
  margin-right: 64px;
}

.item-name {
  width: 710px;
  height: 34px;
  font-weight: 600;
  font-size: 24px;
  color: #121127;
  line-height: 28px;
  text-align: left;
}

.tag-container-dataset {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  align-items: flex-start;
  align-content: flex-start;
  gap: 28px;
  margin-top: 60px;
  margin-left: 64px;
  margin-bottom: 80px;
  margin-right: 64px;
}

.tag-container-model {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  align-items: flex-start;
  align-content: flex-start;
  gap: 28px;
  margin-top: 60px;
  margin-left: 64px;
  margin-bottom: 80px;
  margin-right: 64px;

}

.tag-item:last-child {
  display: block;
  margin-right: 0;
  margin-bottom: 0;
}

.tag-item-style {
  width: auto;
  height: 36px;
  border-radius: 4px;
  border: 1px solid #003399;
  color: #003399;

}

.page-container-item {
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(-90deg, rgba(3, 34, 55, 0) 0%, #032237 100%);
}

.model-card-item-container {
  flex-grow: 1;
  background: linear-gradient(180deg, #FFDEDE 0%, #FFFFFF 38%, #FFFFFF 100%), #FFFFFF;
  border-radius: 8px 8px 8px 8px;
  margin-left: 10px;
  max-width: calc(50% - 10px); /* 设置最大宽度为父容器的一半 */
}

.dataset-card-item-container {
  flex-grow: 1;
  background: linear-gradient(180deg, #FFDEDE 0%, #FFFFFF 38%, #FFFFFF 100%), #FFFFFF;
  border-radius: 8px 8px 8px 8px;
  margin-left: 10px;
  margin-right: 10px;
  max-width: calc(50% - 10px); /* 设置最大宽度为父容器的一半 */
}

@media (max-width: 768px) {
  .model-card-item-container,
  .dataset-card-item-container {
    flex-basis: 100%; /* 在小屏幕上每个元素占据整行 */
  }
}
</style>
