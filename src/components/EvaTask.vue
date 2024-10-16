<script setup lang="ts">
import {ElMessageBox} from 'element-plus'
import axios from '../utils/httpclient'
import {computed, onMounted, reactive, ref} from 'vue';
import datasets_store from './dataset/store'
import model_store from './models/store'

onMounted(() => {
  axios.post('/api/evaluations', {page: currentPage.value, size: pageSize.value}, {})
      .then(responseData => {
        tableData.value = responseData["data"].list
        total.value = responseData["data"].total
      })
      .catch(error => {
        // console.error('发生错误:', error);
      })

  // 加载dataset_options
  dataset_options.value = datasets_store.list.flatMap(category =>
      category.datasets.map(dataset => ({
        value: dataset.data_id,
        label: dataset.name,
      }))
  );

  dataSetFilters.value = datasets_store.list.flatMap(category =>
      category.datasets.map(dataset => ({
        value: dataset.data_id,
        text: dataset.name,
      }))
  );

  model_options.value = model_store.list.map(item => ({
    value: item.model_id,
    label: item.name,
  }))

  modelFilters.value = model_store.list.map(item => ({
    value: item.model_id,
    text: item.name,
  }))

})

const dataSetFilters = ref([
  {text: 'Dataset A', value: 'Dataset A'},
  {text: 'Dataset B', value: 'Dataset B'},
]);

const statusFilters = ref([
  {text: 'FAILED', value: 'FAILED'},
  {text: 'SUCCESS', value: 'SUCCESS'},
  {text: 'RUNNING', value: 'RUNNING'},
  {text: 'DONE', value: 'DONE'},
]);

const handleDataSetFilter = (value, row) => {
  return row.data_set_id === value;
};

let hoveredDataSet = ref('');
const handleDataSetHover = (row) => {
  console.log(row)
  hoveredDataSet.value = row;
};
const clearHoveredDataSet = () => {
  hoveredDataSet.value = '';
};

const handleStatusFilter = (value, row) => {
  return row.status === value
}
const modelFilters = ref([
  {text: 'model A', value: 'model A'},
]);
const handleModelFilter = (value, row) => {
  return row.model_id === value
}

const currentPage = ref(1)
let total = ref(1)
const pageSize = ref(10)
const disabled = ref(false)
let tableData = ref([])
let detailData = ref([])
const formLabelWidth = '140px'
let dialogFormVisible = ref(false)

const dataset_options = ref([{"value": "", "label": ""}])
const model_options = ref([{"value": "", "label": ""}])

const form = reactive({
  data_set_ids: [],
  m_ids: '',
  weight_1: '',
  weight_2: '',
  weight_3: '',
})

const isButtonDisabled = computed(() => {
  return !form.data_set_ids || !form.m_ids;
});

const navigateToModelDetailPage = (row) => {
  window.open('/model_detail/' + row.model_id)
}

const navigateToDatasetDetailPage = (row) => {
  console.log(hoveredDataSet.value)
  window.open('/dataset_detail/' + hoveredDataSet.value)
}

const formattedDataSet = computed(() => {
  if (hoveredDataSet.value) {
    const dataSetParts = hoveredDataSet.value.split(',');
    return dataSetParts.join(', ');
  } else {
    return '';
  }
});
const handleSizeChange = (val: number) => {
  list()
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  list()
  console.log(`current page: ${val}`)
}

const list = () => {
  axios.post('/api/evaluations', {page: currentPage.value, size: pageSize.value}, {})
      .then(responseData => {
        tableData.value = responseData["data"].list
        total.value = responseData["data"].total
      })
      .catch(error => {
        console.error('发生错误:', error);
      })
}

const createTaskForm = (data_set_ids, m_ids) => {
  // 创建task
  let box_message = '创建成功'
  let box_title = '创建结果'

  let m_names = []
  let d_names = []

  for (let key in m_ids) {
    let foundObject = model_options.value.find(item => item.value === m_ids[key])
    const m_name = foundObject ? foundObject.label : null;
    m_names.push(m_name)
  }

  for (let key in data_set_ids) {
    let foundObject = dataset_options.value.find(item => item.value === data_set_ids[key])
    const d_name = foundObject ? foundObject.label : null;
    d_names.push(d_name)
  }

  axios.put('/api/evaluation', {data_set: d_names, data_set_ids: data_set_ids, m_ids: m_ids, m_names: m_names}, {})
      .then(responseData => {
        box_message = `创建成功 TaskId ${responseData["data"]}`
        ElMessageBox.alert(box_message, box_title, {
          confirmButtonText: 'OK',
        })
        list()
      })
      .catch(() => {
        ElMessageBox.alert("创建失败", box_title, {
          confirmButtonText: 'OK',
        })
      })
  dialogFormVisible.value = false
}

interface TaskRow {
  status: string
  task_id: number
}

const findDetail = (currentRow: TaskRow, expandedRows) => {
  var resData = []
  detailData.value = []

  if (expandedRows.length === 0) {
    return;
  }

  if (currentRow.status != 'SUCCESS') {
    return
  }

  axios.post('/api/details', {task_id: currentRow.task_id}, {})
      .then(responseData => {
        let res_list = responseData["data"]
        for (let iter in res_list) {
          const one_obj = res_list[iter]

          let promptInfo = one_obj["user_prompt"]
          promptInfo = promptInfo.replace("\n", "")
          let indexOfQuestion = promptInfo.indexOf("[Question]")
          let indexOfAnswer = promptInfo.indexOf("[The Start of Assistant's Answer]")
          let indexOfAnswerEnd = promptInfo.indexOf("[The End of Assistant's Answer]")

          let questionStr = promptInfo.substring(indexOfQuestion, indexOfAnswer)
          let answerStr = promptInfo.substring(indexOfAnswer, indexOfAnswerEnd)
          var oneData = {
            question_id: one_obj.question_id,
            model: one_obj.model,
            judge: one_obj.judge,
            user_prompt: questionStr.replace("[Question]", "【 Q 】:")
                + "" + answerStr.replace("[The Start of Assistant's Answer]", "【 A 】:"),
            judgment: one_obj.judgment,
            score: one_obj.score,
            turn: one_obj.turn,
            tstamp: one_obj.tstamp
          }
          resData.push(oneData)
        }
        detailData.value = resData
      })
      .catch(() => {
      })
}

const tableRowClassName = ({row}: { row: TaskRow }) => {
  if (row.status === 'FAILED') {
    return ''
  } else if (row.status === 'SUCCESS') {
    return ''
  }
  return ''
}
</script>

<template>
  <div style="margin-top: 20px">
    <el-button @click="dialogFormVisible=true" color="#003399">创建</el-button>
    <el-button @click="list" color="#003399">查询</el-button>

    <el-dialog v-model="dialogFormVisible" title="创建评测">
      <el-form :model="form">
        <el-form-item label="数据集" :label-width="formLabelWidth">
          <el-select v-model="form.data_set_ids" placeholder="选择数据集" multiple>
            <el-option v-for="option in dataset_options" :key="option.value" :label="option.label"
                       :value="option.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="模型" :label-width="formLabelWidth" style="white-space: pre-line;">
          <el-select v-model="form.m_ids" placeholder="选择待测试模型" multiple>
            <el-option v-for="option in model_options" :key="option.value" :label="option.label" :value="option.value"/>
          </el-select>
        </el-form-item>
        <div>
          <h3>权重</h3>
        </div>
        <div class="parallel-rows">
          <!-- 第一行 -->
          <div class="weight-row">
            <div class="weight-text">
              <el-form-item label="分类1">
                <el-input v-model="form.weight_1" placeholder="权重" :disabled="true"/>
              </el-form-item>
            </div>
            <div class="weight-text">
              <el-form-item label="分类2">
                <el-input v-model="form.weight_2" placeholder="权重" :disabled="true"/>
              </el-form-item>
            </div>
            <div class="weight-text">
              <el-form-item label="分类3">
                <el-input v-model="form.weight_3" placeholder="权重" :disabled="true"/>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>

      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false" color="#CED0D8">取消</el-button>
        <el-button type="primary" @click="createTaskForm(form.data_set_ids, form.m_ids)" :disabled="isButtonDisabled" color="#003399">
          确定
        </el-button>
      </span>
      </template>
    </el-dialog>

    <el-container>
      <el-main>
        <td class="line"/>
        <el-table :data="tableData"
                  style="width: 100%"
                  max-height=100%
                  :row-class-name="tableRowClassName"
                  @expand-change="findDetail">
          <el-table-column prop="task_id" label="任务id" width="300"/>
          <el-table-column prop="model_name" label="模型" width="400">
            <template v-slot="{ row }">
              <!-- 在模型名称单元格中添加点击事件 -->
              <span @click="navigateToModelDetailPage(row)" style="cursor: pointer;">{{ row.model_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="data_set" label="数据集" width="300">
            <template v-slot="{ row }">
              <span @mouseover="handleDataSetHover(row)" @mouseout="clearHoveredDataSet"
                    @click="navigateToDatasetDetailPage(row)"
                    style="cursor: pointer; position: relative;">
                <span>{{ row.data_set }}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" width="200"/>
          <el-table-column prop="status" label="任务状态" width="120"
                           :filters="statusFilters"
                           :filter-method="handleStatusFilter"
                           filter-placement="bottom-end">
          </el-table-column>
          <el-table-column prop="reason" label="失败原因"/>
          <!--
          <el-table-column prop="" label="详情" type="expand" width="80" fixed="left">
            <el-form label-position="left" style="color: dodgerblue" inline class="demo-table-expand">
              <el-table
                  :data="detailData"
                  border
                  :header-cell-style="{'text-align':'center'}"
                  :cell-style="{'text-align':'left'}"
              >
                <el-table-column
                    prop="question_id"
                    label="id"
                    width="80">
                </el-table-column>
                <el-table-column
                    sortable
                    prop="score"
                    label="得分"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="judge"
                    label="judge"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="user_prompt"
                    label="user_prompt"
                    width="600">
                </el-table-column>
                <el-table-column
                    prop="judgment"
                    label="judgment"
                    width="300">
                </el-table-column>
              </el-table>
            </el-form>
          </el-table-column>
          -->
        </el-table>
        <td class="line"/>
      </el-main>
    </el-container>
    <div class="pagination-container">
          <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[12, 24, 36, 48]"
            background layout="total, prev, pager, next, sizes, jumper" :total="tableData.length"
            @current-change="handlePageChange" />
        </div>
  </div>
</template>

<style scoped>
.demo-border .text {
  width: 15%;
}

.demo-border .line {
  width: 70%;
}

.demo-border .line div {
  width: 100%;
  height: 0;
  border-top: 1px solid var(--el-border-color);
}

.demo-border .line .dashed {
  border-top: 2px dashed var(--el-border-color);
}

.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

:deep(.el-table .warning-row) {
  --el-table-tr-bg-color: #F56C6C;
}

:deep(.el-table .success-row) {
  --el-table-tr-bg-color: #67C23A;
}
.pagination-container {
  margin-top: 28px;
  margin-right: 80px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  color: #FFFFFF;
}

a{
  color: #121127;
}
</style>