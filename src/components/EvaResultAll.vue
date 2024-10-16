<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import axios from 'axios';
import { marked } from 'marked';

const sendReportRequest = (row) => {
  axios.post('/api/eval_reports', { "params": [], "categories": [] }, {})
    .then((response) => {
      console.log('Report request successful', response);
      const htmlContent = marked(response.data.data);
      const reportWindow = window.open('', '_blank');
      reportWindow.document.write(htmlContent);
      reportWindow.document.title = '评测报告';
    })
    .catch((error) => {
      console.error('Report request failed', error);
    });
}

const form = reactive({
  data_set_id: 'moral_bench_test1',
  m_name: 'chatglm2-6b',
})

const modelFilters = ref([
  { text: 'model A', value: 'model A' },
]);
const navigateToModelDetailPage = (row) => {
  window.open('/model_detail/' + row.model_id)
}
const navigateToDatasetDetailPage = (row) => {
  window.open('/dataset_detail/' + row.data_set_id)
}
const dataSetFilters = ref([
  { text: 'Dataset A', value: 'Dataset A' },
  { text: 'Dataset B', value: 'Dataset B' },
]);

onMounted(() => {
  const data_array = [];
  let iCounter = 0;

  mock_data.forEach(item => {
    const detail = {
      labels: ['合规性', '公平性', '知识产权', '隐私保护', '可信度'],
      datasets: [
        {
          label: item[0],
          backgroundColor: 'rgba(0, 51, 153, 0.2)',
          borderColor: 'rgba(0, 51, 153, 1)',
          pointBackgroundColor: 'rgba(0, 51, 153, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(0, 51, 153, 1)',
          data: [
            item[2] * 100,
            item[3] * 100,
            item[4] * 100,
            item[5] * 100,
            item[6] * 100
          ]
        }
      ]
    };

    data_array.push({
      id: iCounter,
      task_id: "cff16343905a401b8cbca5249574fbd7",
      model_id: item[0],
      total_score: item[1],
      detail: detail,
      eva_time: item[7],
      report: item[8],
    });

    iCounter++;
  });

  console.log(data_array);
  tableData.value = data_array;
});


const handleModelFilter = (value, row) => {
  return row.model_id === value;
}
const handleDataSetFilter = (value, row) => {
  return row.data_set_id === value;
};
const tableData = ref([]);
const mock_data = [
  // [
  //   "Model ID",
  //   "Total Score",
  //   "合规性",
  //   "公平性",
  //   "知识产权",
  //   "隐私保护",
  //   "可信度",
  //   "Evaluate Time",
  //   "Report"
  // ],
  [
    "Baichuan2-7B-Chat",
    0.7114169675090253,
    0.6789473684210526,
    0.7657232704402516,
    0.7684210526315789,
    0.7400881057268722,
    0.7523219814241486,
    "2024-01-16 17:40:53",
    ""
  ],
  [
    "Qwen-7B-Chat",
    0.7509025270758123,
    0.7162280701754385,
    0.8050314465408805,
    0.7736842105263158,
    0.8039647577092511,
    0.7832817337461301,
    "2024-01-16 17:40:53",
    ""
  ],
  [
    "Yi-34B-Chat",
    0.7450361010830325,
    0.7298245614035088,
    0.7657232704402516,
    0.7473684210526316,
    0.8149779735682819,
    0.7708978328173375,
    "2024-01-16 17:40:53",
    ""
  ],
  [
    "Yi-6B-Chat",
    0.7012635379061372,
    0.6745614035087719,
    0.7248427672955975,
    0.7052631578947368,
    0.7797356828193832,
    0.7678018575851393,
    "2024-01-16 17:40:53",
    ""
  ],
  [
    "chatglm2-6b",
    0.6633574007220217,
    0.6052631578947368,
    0.7169811320754716,
    0.7342105263157894,
    0.7577092511013216,
    0.7708978328173375,
    "2024-01-16 17:40:53",
    ""
  ],
  [
    "chatglm3-6b",
    0.28294223826714804,
    0.2657894736842105,
    0.2830188679245283,
    0.28421052631578947,
    0.3656387665198238,
    0.3746130030959752,
    "2024-01-16 17:40:53",
    ""
  ],
  [
    "Baichuan2-13B-Chat",
    0.7242779783393501,
    0.6894736842105263,
    0.7704402515723271,
    0.7342105263157894,
    0.788546255506608,
    0.7678018575851393,
    "2024-01-16 17:40:53",
    ""
  ],
  [
    "Llama-2-13b-chat-ms",
    0.450586642599278,
    0.4074561403508772,
    0.49842767295597484,
    0.4631578947368421,
    0.5506607929515418,
    0.5232198142414861,
    "2024-01-16 17:40:53",
    ""
  ],
  [
    "Llama-2-7b-chat-ms",
    0.3689079422382672,
    0.3140350877192982,
    0.4339622641509434,
    0.39473684210526316,
    0.5418502202643172,
    0.42724458204334365,
    "2024-01-16 17:40:53",
    ""
  ],
  [
    "Mistral-7B-Instruct-v0.2",
    0.434115523465704,
    0.362280701754386,
    0.4779874213836478,
    0.5131578947368421,
    0.5837004405286343,
    0.5170278637770898,
    "2024-01-16 17:40:53",
    ""
  ],
  [
    "Qwen-14B-Chat",
    0.7872292418772563,
    0.7635964912280702,
    0.8223270440251572,
    0.8078947368421052,
    0.8348017621145375,
    0.7987616099071208,
    "2024-01-16 17:40:53",
    ""
  ],
  [
    "Vicuna-7B",
    0.34814981949458484,
    0.33157894736842103,
    0.37735849056603776,
    0.3368421052631579,
    0.3788546255506608,
    0.4055727554179567,
    "2024-01-16 17:40:53",
    ""
  ],
  [
    "openchat_3.5",
    0.70735559566787,
    0.6587719298245615,
    0.75,
    0.7552631578947369,
    0.8061674008810573,
    0.7894736842105263,
    "2024-01-16 17:40:53",
    ""
  ]
]

/* 雷达图 */
import {
  Chart as ChartJS,
  Title,
  BarElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'vue-chartjs'

const radar_options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      max: 100, // 设置坐标轴的最大值
      min: 0,   // 设置坐标轴的最小值
      stepSize: 20 // 可选，设置坐标轴刻度的间隔
    }
  }
}

let radar_data = ref({
  labels: [],
  datasets: [
    {
      label: '',
      backgroundColor: 'rgba(0, 51, 153, 0.2)',
      borderColor: 'rgba(0, 51, 153, 1)',
      pointBackgroundColor: 'rgba(0, 51, 153, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(0, 51, 153, 1)',
    }
  ]
})
ChartJS.register(RadialLinearScale, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement)


</script>

<template>
  <div class="list-title">
    <h1>评测结果</h1>
  </div>

  <div class="table-container">
    <el-table :data="tableData" style="width: 100%" max-height="100%">
      <el-table-column prop="id" label="序号" width="60" />
      <el-table-column prop="model_id" label="模型" width="200">
        <template v-slot="{ row }">
          <span @click="navigateToModelDetailPage(row)" style="cursor: pointer;"><a>{{ row.model_id }}</a></span>
        </template>
      </el-table-column>
      <el-table-column prop="detail" label='评测维度' width="300">
        <template v-slot="{ row }">
          <Radar :data="row.detail" :options="radar_options" />
        </template>
      </el-table-column>
      <el-table-column prop="eva_time" label="评测时间" width="300" />
      <el-table-column prop="report" label="评测报告">
        <template v-slot="{ row }">
          <el-button @click="sendReportRequest(row)" color="#003399">查看报告</el-button>
          <a :href="row.url" target="_blank">{{ row.url }}</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.list-title {
  margin-top: 30px;
  font-weight: 500;
  font-size: 30px;
  color: #040B29;
  line-height: 45px;
  text-align: left;
  margin-left: 90px;
}

.table-container {
  margin-top: 31px;
  margin-left: 90px;
}

a {
  color: #121127;
}
</style>