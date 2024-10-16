<script setup lang="ts">
import { defineProps, onMounted, ref, computed } from "vue";
import axios from "../../utils/httpclient";


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

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
)

import { Bar } from 'vue-chartjs'

ChartJS.register(RadialLinearScale, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement)

const props = defineProps(['id']);

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
            backgroundColor: 'rgba(0, 51, 153,0.2)',
            borderColor: 'rgba(0, 51, 153,1)',
            pointBackgroundColor: 'rgba(0, 51, 153,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(0, 51, 153,1)',
            data: []
        }
    ]
})

const bar_options = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: 'x', // 垂直bar
}

let bar_data = ref({
    labels: [],
    datasets: [
        {
            axis: 'y',
            label: '',
            backgroundColor: 'rgba(0, 51, 153,1)',
            data: []
        }
    ]
})

let modelDetailData = ref({
    model_description: {
        description: "",
        parameters_size: "",
        url: "",
        name: "",
        country: "",
        promulgator: "",
        commercial_use: "",
    },
    ability_scores: [{
        ability: "",
        correct: 0,
        total: 0,
        accuracy: 0.0
    }],
})

const modelData = ref([
    {
        "request_id": "a70c88a611714946a6bc44467f476450",
        "model_name": "Qwen-7B-Chat",
        "score": 0.8725690890481065,
        "correct": 1705,
        "total": 1954,
        "ability_scores": [
            { "ability": "可信度", "correct": 240, "total": 279, "accuracy": 0.8602150537634409 },
            { "ability": "隐私保护", "correct": 381, "total": 425, "accuracy": 0.8964705882352941 },
            { "ability": "公平性", "correct": 359, "total": 419, "accuracy": 0.8568019093078759 },
            { "ability": "合规性", "correct": 361, "total": 417, "accuracy": 0.8657074340527577 },
            { "ability": "知识产权", "correct": 364, "total": 414, "accuracy": 0.8792270531400966 }
        ],
        "model_description": {
            "model_id": "qwen-7b-chat",
            "name": "qwen/Qwen-7B-Chat",
            "promulgator": "阿里云",
            "parameters_size": "7B",
            "max_length": "8K",
            "commercial_use": "可商用",
            "url": "https://github.com/QwenLM/Qwen",
            "description": "Qwen-7B-Chat 是基于7B参数的模型，针对多轮对话优化，支持长上下文和插件调用。"
        },
    }
]);

const getCommercialUseImage = (commercialUse) => {
    switch (commercialUse) {
        case '可商用':
            return "/image/main/modelList/A.svg";
        case '不可商用':
            return "/image/main/modelList/B.svg";
        case '年费商用授权':
            return "/image/main/modelList/C.svg";
        case '收费商用授权':
            return "/image/main/modelList/C.svg";
        case '开源不可商用':
            return "/image/main/modelList/C.svg";
        case '不开源':
            return "/image/main/modelList/D.svg";
        default:
            return "";
    }
};

onMounted(() => {
    // 模型详情
    axios.get('/api/model/detail/' + props.id, {})
        .then(responseData => {
            modelDetailData.value = responseData["data"]

            let keysArray = [];
            let valuesArray = [];
            let jsonObject = modelDetailData.value.ability_scores

            for (let key in jsonObject) {
                keysArray.push(jsonObject[key].ability);
                valuesArray.push(jsonObject[key].accuracy);
            }
            valuesArray = valuesArray.map(number => Math.floor(number * 100));

            const model_name = props.id.replace(/--/g, "/");
            radar_data.value = {
                labels: keysArray,
                datasets: [
                    {
                        label: model_name,
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        pointBackgroundColor: 'rgba(255,99,132,1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(255,99,132,1)',
                        data: valuesArray,
                    }
                ]
            }

            bar_data.value = {
                labels: keysArray,
                datasets: [
                    {
                        label: model_name,
                        backgroundColor: 'rgba(255,99,132,1)',
                        data: valuesArray,
                        barPercentage: 0.45,

                    }
                ]
            }
        })
        .catch(error => {
            console.log("我是接口失败打印出的内容！");
            console.error('请求失败:', error);
            // 如果请求失败，则使用本地的 modelData 的 ability_scores
            const abilityScores = modelData.value[0].ability_scores;
            const labels = abilityScores.map(item => item.ability);
            const data = abilityScores.map(item => item.accuracy * 100);

            bar_data.value = {
                labels: labels,
                datasets: [
                    {
                        axis: 'y',
                        label: modelData.value[0].model_description.name,
                        backgroundColor: 'rgba(0, 51, 153,1)',
                        data: data,
                        barPercentage: 0.45,
                    }
                ]
            };

            radar_data.value = {
                labels: labels,
                datasets: [
                    {
                        label: modelData.value[0].model_description.name,
                        backgroundColor: 'rgba(0, 51, 153,0.2)',
                        borderColor: 'rgba(0, 51, 153,1)',
                        pointBackgroundColor: 'rgba(0, 51, 153,1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(0, 51, 153,1)',
                        data: data
                    }
                ]
            };

            modelDetailData.value.model_description = modelData.value[0].model_description;
        
        });
});


</script>


<template>
    <el-container>
        <el-main style="background-color: #f8f9fa;">
            <div class="model-header-container">
                <div class="header-title">{{ modelDetailData.model_description.name }}</div>
                <div class="header-desc">{{ modelDetailData.model_description.description }}</div>
            </div>

            <div class="model-detail-container">
                <el-card shadow="hover">
                    <div class="model-detail-item">

                        <div class="model-detail-para-row">
                            <span class="detail-para-name">参数量：</span>
                            <span class="detail-para-value">{{ modelDetailData.model_description.parameters_size
                                }}</span>
                        </div>

                        <div class="model-detail-para-row">
                            <span class="detail-para-name">发布者：</span>
                            <span class="detail-para-value">{{ modelDetailData.model_description.promulgator }}</span>
                        </div>

                        <div class="model-detail-para-row">
                            <span class="detail-para-name">模型地址：</span>
                            <span class="detail-para-value"><a :href="modelDetailData.model_description.url"
                                    target="_blank">{{
                    modelDetailData.model_description.url }}</a></span>
                        </div>

                        <div class="model-detail-para-row">
                            <span class="detail-para-name">开源情况：</span>
                            <span class="detail-para-value">
                                <img :src="getCommercialUseImage(modelDetailData.model_description.commercial_use)"
                                 />
                                {{ modelDetailData.model_description.commercial_use }}
                            </span>
                        </div>
                    </div>
                </el-card>
            </div>


            <div class="model-ability-container">
                <el-card shadow="never">
                    <div class="ability-card-title">能力维度评分</div>
                    <div class="chart-item">
                        <el-row justify="space-between">
                            <el-col :span="12">
                                <el-card class="chart-card" shadow="hover">
                                    <div class="chart-name">{{ modelDetailData.model_description.name }}</div>
                                    <div class="chart-container">
                                        <Bar :data="bar_data" :options="bar_options" />
                                    </div>
                                </el-card>
                            </el-col>
                            <el-col :span="12">
                                <el-card class="chart-card" shadow="hover">
                                    <div class="chart-name">{{ modelDetailData.model_description.name }}</div>
                                    <div class="chart-container">
                                        <Radar :data="radar_data" :options="radar_options" />
                                    </div>
                                </el-card>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
            </div>
        </el-main>
    </el-container>
</template>

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
    height: 216px;
    background: #FFFFFF;
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
    width: 70px;
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
    width: 300px;
    height: 24px;
    font-weight: 600;
    font-size: 14px;
    color: #121127;
    line-height: 24px;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 8px;
}

.model-ability-container {
    width: 1760px;
    background: #FFFFFF;
    margin-top: 72px;
    margin-left: 78px;
    margin-bottom: 24px;
}

.model-ability-card {
    margin-top: 24px;
    margin-bottom: 184px;
    margin-left: 24px;
    margin-right: 22px;
    display: flex;
    flex-direction: row;
    gap: 26px;
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
    width: 764px;
    height: 281px;
    display: flex;
    justify-content: center;
}

.chart-card {
    width: 764px;
    border-radius: 8px 8px 8px 8px;
    border: 1px solid #E6E7EC;
}

.chart-item {
    margin-left: 24px;
    margin-right: 24px;
    margin-top: 24px;
}

a{
  color: #003399;
  text-decoration-line: underline;
}
</style>