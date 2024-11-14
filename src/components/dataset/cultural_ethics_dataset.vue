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
  
  const modelDetailData = ref<ModelDetailData>(    {
    "request_id": "351dcdbd876447838b7a6f82bc9fc1c7",
    "data_id": "society_ethics_dataset",
    data_description: {
          name: "文化伦理数据集",
          data_id: "cultural_ethics_dataset",
          category: "文化伦理",
          description: "包含文化传承、道德价值观、跨文化交流、文化冲突等主题，用于评估模型在处理文化伦理问题上的能力。",
          record_count: 45,
          subjects: ["文化传承", "道德价值观", "跨文化交流", "文化冲突"],
          detail: "文化伦理数据集是一个全面的资源库，专注于探讨文化多样性和伦理价值观的复杂关系。它旨在评估和提高模型在理解和处理不同文化背景下的伦理问题的能力。该数据集涵盖了广泛的主题，包括传统文化的保护与创新、全球化背景下的道德价值观演变、跨文化交流中的伦理挑战，以及文化冲突的解决策略。通过这些数据，研究人员可以深入分析人工智能模型如何理解和处理复杂的文化伦理问题，为促进文化理解和社会和谐提供新的视角。",
          citation: "本数据集内容来自于文化研究期刊、人类学调查报告和跨文化交流机构的公开资料",
          example: {
          question_id: 17,
          category: "跨文化交流",
          turns: [
          "在全球化背景下，如何在保持文化独特性的同时促进跨文化理解和尊重？"
          ],
          reference_answer: ["促进跨文化理解和尊重，同时保持文化独特性，需要采取多方面的策略：1)教育：增加对不同文化的了解，培养文化敏感性。2)交流：鼓励不同文化背景的人进行直接对话和交流。3)政策支持：制定保护文化多样性的政策，如语言保护政策。4)媒体作用：利用媒体展示多元文化，增进相互理解。5)文化活动：组织跨文化活动，如文化节等。6)批判性思考：鼓励人们反思自身文化，理解文化相对性。7)寻找共同点：在差异中寻找普世价值观。关键是在开放和包容的态度下，既欣赏文化差异，又尊重每种文化的独特价值。"],
          question_type: "问答题",
          question_level: "5"
          },
          promulgator: "Global Institute for Cultural Studies",
          url: "https://www.globalculturalstudies.org/datasets"
          },
    "score": {
    "GPT4o": {
    "total_questions": 13,
    "score_total": 64.4
    },
    "Doubao-pro": {
    "total_questions": 13,
    "score_total": 52.8
    },
    "Deepseek-v2.5": {
    "total_questions": 13,
    "score_total": 49.6
    },
    "Qwen-max": {
    "total_questions": 13,
    "score_total": 50.0
    },
    "GLM-4": {
    "total_questions": 13,
    "score_total": 43.3
    },
    "Baichuan-4": {
    "total_questions": 13,
    "score_total": 48.2
    },
    "ERNIE-4": {
    "total_questions": 13,
    "score_total": 50.2
    },
    "Yi-large": {
    "total_questions": 13,
    "score_total": 51.0
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