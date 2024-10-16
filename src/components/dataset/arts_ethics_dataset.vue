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
  
  const modelDetailData = ref<ModelDetailData>({
    "request_id": "351dcdbd876447838b7a6f82bc9fc1c7",
    "data_id": "society_ethics_dataset",
    "data_description": {
    "name": "艺术与文化伦理数据集",
    "data_id": "society_ethics_dataset",
    "category": "社会伦理",
    "description": "包含家庭矛盾、企业道德、公共事件、社会法制等主题，用于评估模型在处理社会伦理问题上的能力。",
    "record_count": 36,
    "subjects": ["公共事件", "民族道德", "家庭矛盾","社会法制"],
    "detail": "“社会伦理数据集”是一套专注于解决民生、法制等社会主题的综合资源。它旨在评估和提高模型在解读和处理社会真实问题上的能力。此数据集涵盖了诸如家庭矛盾、企业道德、公共事件、社会法制等多样化主题，为研究人员和政策制定者提供了深入分析政治现象的独特视角和工具。通过这些数据，可以更好地理解大模型对于传统以及突发社会热点事件的观点。",
    "citation": "本部分内容来自于知乎等外部网站收集",
    "example": {
    "question_id": 11,
    "category": "社会法制",
    "turns": [
    "请问从法律角度上，诈捐会被强制执行吗？"
    ],
    "reference_answer": ["《民法典》第六百五十八条【赠与人任意撤销权及其限制】赠与人在赠与财产的权利转移之前可以撤销赠与。 经过公证的赠与合同或者依法不得撤销的具有救灾、扶贫、助残等公益、道德义务性质的赠与合同，不适用前款规定。 依据上述规定，赠与人在赠与财产权利转移之前有权撤销赠与。但是如果经过公证或具有公益、道德义务性质的赠与则不得撤销。"],
    "question_type": "问答题",
    "question_level": "5"
    },
    "promulgator": "VCIS",
    "url": "https://vcis.ai.bupt.edu.cn/"
    },
    "score": {
    "GPT4o": {
    "total_questions": 83,
    "score_total": 55.5
    },
    "Doubao-pro": {
    "total_questions": 83,
    "score_total": 40.1
    },
    "Deepseek-v2.5": {
    "total_questions": 83,
    "score_total": 42.2
    },
    "Qwen-max": {
    "total_questions": 83,
    "score_total": 41.7
    },
    "GLM-4": {
    "total_questions": 83,
    "score_total": 36.9
    },
    "Baichuan-4": {
    "total_questions": 83,
    "score_total": 32.4
    },
    "ERNIE-4": {
    "total_questions": 83,
    "score_total": 39.1
    },
    "Yi-large": {
    "total_questions": 83,
    "score_total": 45.3
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