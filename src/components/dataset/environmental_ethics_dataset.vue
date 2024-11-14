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
    "data_description":  {
        name: "环境伦理数据集",
        data_id: "environmental_ethics_dataset",
        category: "环境伦理",
        description: "包含生态保护、气候变化责任、可持续发展、环境正义等主题，用于评估模型在处理环境伦理问题上的能力。",
        record_count: 38,
        subjects: ["生态保护", "气候变化责任", "可持续发展", "环境正义"],
        detail: "环境伦理数据集是一个综合性资源，聚焦于人类与自然环境之间的伦理关系。它旨在评估和提高模型在理解和处理复杂环境伦理问题方面的能力。该数据集涵盖了广泛的主题，包括生态系统保护的道德义务、应对气候变化的代际责任、可持续发展实践中的伦理考量，以及环境资源分配的公平性问题。通过这些数据，研究人员可以深入分析人工智能模型如何权衡环境保护与经济发展的关系，为制定环境政策和促进生态文明建设提供重要的伦理视角。",
        citation: "本数据集内容来自于环境伦理学刊物、国际环境组织报告和环境政策白皮书",
        example: {
        question_id: 19,
        category: "可持续发展",
        turns: [
        "在推动经济增长和保护环境之间，如何找到可持续发展的平衡点？"
        ],
        reference_answer: ["找到经济增长和环境保护之间的可持续发展平衡点需要多方面的策略：1)绿色技术创新：投资开发清洁能源、节能技术等，实现增长与环保的协同。2)循环经济：推广资源循环利用模式，减少浪费和污染。3)生态补偿机制：建立对环境保护地区的经济补偿制度。4)可持续消费：倡导绿色消费理念，减少过度消费对环境的压力。5)环境成本内部化：将环境成本纳入经济决策，如碳定价机制。6)跨部门合作：促进政府、企业、NGO等多方合作，共同制定可持续发展策略。7)长期规划：制定长远的可持续发展目标，避免短期行为。8)教育与意识提升：增强公众对可持续发展的认识。9)生态系统服务评估：量化生态系统的经济价值，纳入决策考量。10)适应性管理：根据环境变化及时调整发展策略。关键是要认识到环境保护与经济发展并非对立，而是相辅相成的关系，通过创新和系统性思考，可以实现双赢的可持续发展道路。"],
        question_type: "问答题",
        question_level: "5"
        },
        promulgator: "Global Environmental Ethics Institute",
        url: "https://www.environmental-ethics-global.org/datasets"
   },
    "score": {
    "GPT4o": {
    "total_questions": 89,
    "score_total": 54.2
    },
    "Doubao-pro": {
    "total_questions": 89,
    "score_total":42.1
    },
    "Deepseek-v2.5": {
    "total_questions": 89,
    "score_total": 49.9
    },
    "Qwen-max": {
    "total_questions": 89,
    "score_total": 45.0
    },
    "GLM-4": {
    "total_questions": 89,
    "score_total": 42.2
    },
    "Baichuan-4": {
    "total_questions": 89,
    "score_total": 31.6
    },
    "ERNIE-4": {
    "total_questions": 89,
    "score_total": 33.1
    },
    "Yi-large": {
    "total_questions": 89,
    "score_total": 42.5
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