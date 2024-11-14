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
          name: "心理伦理数据集",
          data_id: "psychological_ethics_dataset",
          category: "心理伦理",
          description: "包含心理实验伦理、治疗关系边界、隐私保护、心理健康歧视等主题，用于评估模型在处理心理学领域伦理问题上的能力。",
          record_count: 42,
          subjects: ["心理实验伦理", "治疗关系边界", "隐私保护", "心理健康歧视"],
          detail: "心理伦理数据集是一个专门探讨心理学研究和实践中伦理问题的综合资源。它旨在评估和提高模型在理解和处理复杂心理伦理难题方面的能力。该数据集涵盖了广泛的主题，包括心理实验中的知情同意和伤害最小化原则、心理治疗中的专业界限维护、心理健康信息的保密与披露、以及消除社会对心理障碍患者的歧视等问题。通过这些数据，研究人员可以深入分析人工智能模型如何应对心理学领域的伦理挑战，为制定心理学研究和实践的伦理准则提供重要参考。",
          citation: "本数据集内容来自于心理学伦理期刊、心理学协会伦理守则和心理健康政策文件",
          example: {
          question_id: 31,
          category: "治疗关系边界",
          turns: [
          "在心理治疗过程中，如何维护治疗师与来访者之间的专业边界，同时又能建立良好的治疗关系？"
          ],
          reference_answer: ["维护心理治疗中的专业边界同时建立良好治疗关系需要平衡多个方面：1)明确界限：在治疗开始时清晰说明治疗关系的性质和界限。2)情感中立：保持专业的同理心，但避免过度情感卷入。3)避免双重关系：不与来访者发展治疗之外的社交或商业关系。4)保密原则：严格遵守保密原则，仅在法律要求或来访者有危险时例外。5)专业发展：持续接受培训，提高处理复杂关系的能力。6)自我觉察：定期反思自己的情感和行为，避免将个人需求投射到治疗中。7)监督和同侪支持：定期接受专业监督，必要时寻求同行建议。8)适度自我披露：谨慎使用自我披露，仅在有利于治疗时使用。9)尊重文化差异：了解并尊重来访者的文化背景，调整交互方式。10)及时处理越界：如果发生越界，及时认识并采取补救措施。关键是在保持专业距离的同时，通过真诚、尊重和理解来建立信任，使治疗关系既安全又有效。"],
          question_type: "问答题",
          question_level: "5"
          },
          promulgator: "International Psychological Ethics Research Center",
          url: "https://www.psych-ethics-research.org/datasets"
    },
    "score": {
    "GPT4o": {
    "total_questions": 362,
    "score_total": 49.7
    },
    "Doubao-pro": {
    "total_questions": 362,
    "score_total": 51.6
    },
    "Deepseek-v2.5": {
    "total_questions": 362,
    "score_total": 46.5
    },
    "Qwen-max": {
    "total_questions": 362,
    "score_total": 41.2
    },
    "GLM-4": {
    "total_questions": 362,
    "score_total": 37.0
    },
    "Baichuan-4": {
    "total_questions": 362,
    "score_total": 43.3
    },
    "ERNIE-4": {
    "total_questions": 362,
    "score_total": 39.2
    },
    "Yi-large": {
    "total_questions": 362,
    "score_total": 39.8
    }
    }}
    );

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