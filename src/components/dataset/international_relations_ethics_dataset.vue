<template>
    <el-container>
      <el-main style="background-color: #f8f9fa;">
        <div class="model-header-container">
          <div class="header-title">{{ modelDetailData.data_description.name }}</div>
          <div class="header-desc">{{ modelDetailData.data_description.description }}</div>
        </div>
  
        <div class="model-detail-container">
          <el-card shadow="hover">
            <div class="model-detail-item">
              <div class="model-detail-para-row">
                <span class="detail-para-name">数据集类别：</span>
                <span class="detail-para-value">{{ modelDetailData.data_description.category }}</span>
              </div>
  
              <div class="model-detail-para-row">
                <span class="detail-para-name">数据集地址：</span>
                <span class="detail-para-value">
                  <a :href="modelDetailData.data_description.url" target="_blank">{{ modelDetailData.data_description.url }}</a>
                </span>
              </div>
  
              <div class="model-detail-para-row">
                <span class="detail-para-name">数据集来源：</span>
                <span class="detail-para-value">{{ modelDetailData.data_description.citation }}</span>
              </div>
  
              <div class="model-detail-para-row">
                <span class="detail-para-name">数据集介绍：</span>
                <span class="detail-para-value">{{ modelDetailData.data_description.detail }}</span>
              </div>
  
              <div class="model-detail-para-row">
                <span class="detail-para-name">题目样例：</span>
                <span class="detail-para-value">{{ modelDetailData.data_description.example }}</span>
              </div>
            </div>
          </el-card>
        </div>
  
        <div class="model-ability-container">
          <el-card shadow="hover">
            <div class="ability-card-title">能力维度评分</div>
            <div class="chart-item">
              <div class="chart-name">{{ modelDetailData.data_description.name }}</div>
              <div class="chart-container">
                <Bar :data="barData" :options="barOptions"/>
              </div>
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { Bar } from 'vue-chartjs';
  import { Chart as ChartJS, Title, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
  
  ChartJS.register(Title, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
  
  interface ModelScore {
    total_questions: number;
    score_total: number;
  }
  
  interface ModelDetailData {
    request_id: string;
    data_id: string;
    data_description: {
      name: string;
      data_id: string;
      category: string;
      description: string;
      record_count: number;
      subjects: string[];
      detail: string;
      citation: string;
      example: {
        question_id: number;
        category: string;
        turns: string[];
        reference_answer: string[];
        question_type: string;
        question_level: string;
      };
      promulgator: string;
      url: string;
    };
    score: Record<string, ModelScore>;
  }
  
  const modelDetailData  = ref<ModelDetailData>({
  "request_id": "i51dcdbd876447838b7a6f82bc9fc1c7",
  "data_id": "international_relations_ethics_dataset",
  "data_description": {
    name: "国际关系伦理数据集",
    data_id: "international_relations_ethics_dataset",
    category: "国际关系伦理",
    description: "包含国际合作、文化理解、全球治理、国际正义等主题，用于评估模型在处理国际关系领域伦理问题的能力。",
    record_count: 157,
    subjects: ["国际合作", "文化理解", "全球治理", "国际正义", "多边关系"],
    detail: "国际关系伦理数据集聚焦于全球化背景下的国际交往伦理挑战。涵盖国际合作机制、跨文化理解、全球性问题治理、国际正义实现等重要议题。通过多维度案例，评估模型在处理复杂国际关系伦理问题时的判断能力，包括文明对话、多边协作、全球治理等方面。数据集旨在促进国际社会的理解与合作。",
    citation: "本数据集内容来源于国际关系研究期刊、全球治理白皮书、跨文化交流研究等",
    example: {
      question_id: 86,
      category: "全球治理",
      turns: [
        "在应对全球气候变化问题时，如何平衡发达国家和发展中国家的责任与权益？请详细分析解决方案。"
      ],
      reference_answer: ["在全球气候治理中平衡各国责任与权益需要考虑以下方面：1)共同但有区别的责任原则：认识到各国历史责任和现实能力的差异。2)技术支持：促进清洁技术转让和能力建设。3)资金援助：建立气候变化基金支持发展中国家。4)公平转型：支持发展中国家实现低碳转型。5)多边协商：加强国际对话和政策协调。6)市场机制：建立公平的碳交易体系。7)创新合作：推动绿色技术创新和共享。8)能力建设：协助发展中国家提升应对能力。9)监督机制：建立透明的监测、报告和核查体系。10)利益平衡：在减排目标中考虑发展权益。关键是在推进全球气候治理的同时，照顾各国发展诉求。"],
      question_type: "政策分析",
      question_level: "5"
    },
    promulgator: "Global Relations Ethics Institute",
    url: "https://www.intl-ethics-global.org/datasets"
  },
  "score": {
    "GPT4o": {
      "total_questions": 157,
      "score_total": 67.4
    },
    "Doubao-pro": {
      "total_questions": 157,
      "score_total": 54.1
    },
    "Deepseek-v2.5": {
      "total_questions": 157,
      "score_total": 61.1
    },
    "Qwen-max": {
      "total_questions": 157,
      "score_total": 52.6
    },
    "GLM-4": {
      "total_questions": 157,
      "score_total": 47.5
    },
    "Baichuan-4": {
      "total_questions": 157,
      "score_total": 48.2
    },
    "ERNIE-4": {
      "total_questions": 157,
      "score_total": 46.8
    },
    "Yi-large": {
      "total_questions": 157,
      "score_total": 51.7
    }
  }
});

  
  const barData = ref({
    labels: [],
    datasets: [{
      label: '',
      backgroundColor: 'rgba(0, 51, 153, 1)',
      data: [],
      barPercentage: 0.45,
    }]
  });
  
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x' as const,
    scales: {
      y: {
        beginAtZero: true,
        max: 90,
      }
    }
  };
  
  onMounted(() => {
    const scores = modelDetailData.value.score;
    barData.value = {
      labels: Object.keys(scores),
      datasets: [{
        label: modelDetailData.value.data_description.name,
        backgroundColor: 'rgba(0, 51, 153, 1)',
        data: Object.values(scores).map(item => item.score_total),
        barPercentage: 0.45,
      }]
    };
  });
  </script>
  
  <style scoped>
  .model-header-container {
    width: 659px;
    height: 70px;
    margin-left: 78px;
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .header-title {
    width: 496px;
    height: 30px;
    font-weight: 500;
    font-size: 30px;
    color: #040B29;
    line-height: 30px;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
  
  .header-desc {
    width: 659px;
    height: 24px;
    font-weight: 400;
    font-size: 14px;
    color: rgba(18, 17, 39, 0.7);
    line-height: 24px;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
  
  .model-detail-container {
    width: 1760px;
    height: auto;
    background: #FFFFFF;
    border-radius: 8px 8px 8px 8px;
    margin-left: 78px;
    margin-bottom: 24px;
  }
  
  .model-detail-item {
    margin-top: 24px;
    margin-bottom: 24px;
    margin-left: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .model-detail-para-row {
    display: flex;
    flex-direction: row;
    gap: 24px;
  }
  
  .detail-para-name {
    width: 100px;
    height: 24px;
    font-weight: 400;
    font-size: 14px;
    color: rgba(18, 17, 39, 0.7);
    line-height: 24px;
    text-align: left;
    font-style: normal;
    text-transform: none;
  }
  
  .detail-para-value {
    width: 1604px;
    height: auto;
    font-weight: 600;
    font-size: 14px;
    color: #121127;
    line-height: 24px;
    text-align: left;
    font-style: normal;
    text-transform: none;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .model-ability-container {
    width: 1760px;
    background: #FFFFFF;
    border-radius: 8px 8px 8px 8px;
    margin-top: 72px;
    margin-left: 78px;
    margin-bottom: 24px;
  }
  
  .ability-card-title {
    width: 108px;
    height: 24px;
    font-weight: 600;
    font-size: 18px;
    color: #121127;
    line-height: 24px;
    text-align: left;
    font-style: normal;
    text-transform: none;
    margin-top: 24px;
    margin-left: 24px;
    margin-bottom: 24px;
  }
  
  .chart-name {
    width: 153px;
    height: 22px;
    font-weight: 400;
    font-size: 16px;
    color: #040B29;
    line-height: 19px;
    text-align: left;
    font-style: normal;
    text-transform: none;
    margin-top: 29px;
    margin-left: 24px;
    margin-right: 667px;
  }
  
  .chart-container {
    height: 279px;
    display: grid;
    place-items: center;
  }
  
  .chart-item {
    margin: 24px;
  }
  
  a {
    color: #003399;
    text-decoration-line: underline;
  }
  </style>