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
  "request_id": "ed1dcdbd876447838b7a6f82bc9fc1c7",
  "data_id": "education_ethics_dataset",
  "data_description": {
    name: "教育伦理数据集",
    data_id: "education_ethics_dataset",
    category: "教育伦理",
    description: "包含教育公平、教师职责、学术诚信、教育资源分配等主题，用于评估模型在处理教育领域伦理问题的能力。",
    record_count: 157,
    subjects: ["教育公平", "教师职责", "学术诚信", "教育资源", "教育政策"],
    detail: "教育伦理数据集聚焦于现代教育领域的伦理挑战。涵盖教育机会平等、教师专业伦理、学术规范、教育资源分配等核心议题。通过多样化的案例，评估模型在处理教育伦理问题时的分析能力，包括教育公平促进、师德建设、学术不端防范等。数据集旨在帮助构建更加公平、诚信的教育环境。",
    citation: "本数据集内容来源于教育伦理研究期刊、教育政策文件、学术诚信指南等",
    example: {
      question_id: 63,
      category: "教育公平",
      turns: [
        "在推进教育信息化的过程中，如何确保教育公平，防止数字鸿沟加剧教育不平等？"
      ],
      reference_answer: ["确保教育信息化进程中的公平性需要多方面措施：1)基础设施建设：加强农村和偏远地区网络设施建设。2)设备支持：为经济困难学生提供必要的学习设备。3)资源共享：建立优质教育资源共享平台。4)教师培训：提升教师信息技术应用能力。5)差异化支持：针对不同地区和群体制定帮扶政策。6)混合式教学：结合线上线下优势，照顾不同学习条件。7)技术支持：提供技术咨询和故障解决服务。8)评估监测：定期评估政策实施效果。9)家校协同：加强家庭教育指导。10)社会支持：调动社会力量参与教育均衡发展。关键是确保教育信息化不拉大而是缩小教育差距。"],
      question_type: "策略分析",
      question_level: "4"
    },
    promulgator: "National Education Ethics Research Center",
    url: "https://www.edu-ethics-national.org/datasets"
  },
  "score": {
    "GPT4o": {
      "total_questions": 157,
      "score_total": 69.4
    },
    "Doubao-pro": {
      "total_questions": 157,
      "score_total": 56.9
    },
    "Deepseek-v2.5": {
      "total_questions": 157,
      "score_total": 60.9
    },
    "Qwen-max": {
      "total_questions": 157,
      "score_total": 52.4
    },
    "GLM-4": {
      "total_questions": 157,
      "score_total": 48.7
    },
    "Baichuan-4": {
      "total_questions": 157,
      "score_total": 49.8
    },
    "ERNIE-4": {
      "total_questions": 157,
      "score_total": 47.9
    },
    "Yi-large": {
      "total_questions": 157,
      "score_total": 53.1
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