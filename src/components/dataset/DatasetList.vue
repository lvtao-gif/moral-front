<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "../../utils/httpclient";
import datasets_store from './store'
import type { TabsPaneContext } from 'element-plus'

const selectedItem = ref()

const activeName = ref('通用伦理')

const card_type_list_data = ref([{ id: 1, category: '分类一', datasets: [] }])

const dataSetCard = ref([])
var mock_dataset_list = []

let datasetTableData = ref([])

const navigateToDetailPage = (row) => {
  datasets_store.selected_dataset = row
  window.open('/dataset_detail/' + row.data_id)
}

const handleLeftCardClick = (item) => {
  selectedItem.value = item
  dataSetCard.value = item.datasets
}

onMounted(() => {
  // 通过接口获取，然后渲染进 $datasets_store.list
  // 模型列表
  axios.post('/api/dataset_list', {}, {})
      .then(responseData => {
        datasetTableData.value = responseData["data"].list
      })
      .catch(error => {
        // console.error('发生错误:', error);
        datasetTableData.value = mock_dataset_list
      })
  card_type_list_data.value = datasets_store.list
  dataSetCard.value = datasets_store.list[0].datasets
  selectedItem.value = datasets_store.list[0]

  axios.get('/api/dataset/list', {})
      .then(responseData => {
        card_type_list_data.value = responseData["data"]
        rightCardData.value = responseData["data"][0].datasets
        selectedItem.value = responseData["data"][0]
      })
      .catch(error => {
        // console.error('发生错误:', error);
        card_type_list_data.value = datasets_store.list
        rightCardData.value = datasets_store.list[0].datasets
        selectedItem.value = datasets_store.list[0]
      })
})
</script>

<template>
  <div>
    <el-container>
      <el-main>
        <div class="title-container">
          <h1 class="title-item">数据集</h1>
        </div>

        <div class="tab-container">
          <el-tabs class="dataset-select" v-model="activeName">
            <el-tab-pane v-for="item in card_type_list_data" :key="item.id" :label="item.category" :name="item.category">
              <div class="card-container">
                <el-card v-for="dataset in item.datasets" :key="dataset.id" shadow="hover">
                  <div class="dataset-container">
                    <h3 class="dataset-name">{{ dataset.name }}</h3>
                    <p class="dataset-description">{{ dataset.description }}</p>
                    <div class="detail-button-container">
                      <el-button @click="navigateToDetailPage(dataset)" class="button-item">查看详情</el-button>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.title-container {
  margin-top: 30px;
  padding: 0 75px;
  margin-bottom: 31px;
}

.title-item {
  font-weight: 500;
  font-size: 30px;
  color: #121127;
  line-height: 30px;
}

.tab-container {
  margin-left: 75px;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.el-card {
  width: calc(25% - 24px);
}

.dataset-container {
  margin-left: 24px;
  margin-right: 24px;
}

.dataset-name {
  font-weight: 600;
  font-size: 18px;
  color: #121127;
  line-height: 24px;
}

.dataset-description {
  font-weight: 400;
  font-size: 14px;
  color: rgba(18, 17, 39, 0.7);
  line-height: 24px;
  text-align: left;
  margin-top: 8px;
  margin-bottom: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.button-item {
  width: 88px;
  height: 32px;
  background: rgba(0, 51, 153, 0.05);
  border-radius: 4px;
  color: #003399;
}

.detail-button-container {
  margin-right: 310px;
}
:deep(.el-tabs__item){
  font-size: 20px;
  font-weight: 600;
  line-height: 23px;
  color: #121127;
}
:deep(.el-tabs__nav-wrap::after){
  position: static;
}
:deep(.el-tabs__item.is-active){
  color: #003399;
}
:deep(.el-tabs__active-bar){
  padding: 0 22px;
  background-clip: content-box !important;
}

</style>
