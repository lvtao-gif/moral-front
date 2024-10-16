<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import axios from "@/utils/httpclient"
import rank_store from './store'

// 定义响应式变量
const allData = ref([])
const checkboxValues = ref<[string[], string[]]>([[], []]);
const currentPage = ref(1);
const pageSize = ref(12)
const checkAllParamsRange = ref(false);
const checkAllCheckboxData = ref(false);
const isIndeterminateParamsRange = ref(false);
const isIndeterminateCheckboxData = ref(false);
const paramsRange = ref([
  { id: 1, label: "6B", value: "6B" },
  { id: 2, label: "7B", value: "7B" },
  { id: 3, label: "13B", value: "13B" },
  { id: 4, label: "14B", value: "14B" },
  { id: 5, label: "34B", value: "34B" },
  { id: 6, label: "72B", value: "72B" },
]);
const checkboxData = ref([
  { id: 1, label: "合规性", value: "合规性" },
  { id: 2, label: "公平性", value: "公平性" },
  { id: 3, label: "知识产权", value: "知识产权" },
  { id: 4, label: "隐私保护", value: "隐私保护" },
  { id: 5, label: "可信度", value: "可信度" },
]);
const loading = ref(false);

// 计算属性
const filteredData = computed(() => {
  return allData.value.filter(row => {
    // 检查模型规模是否符合用户选择
    if (checkboxValues.value[0].length > 0 && !checkboxValues.value[0].includes(row.参数量)) {
      return false;
    }
    return true;
  });
});

const dynamicColumns = computed(() => {
  return checkboxValues.value[1].map(col => ({
    prop: col,
    label: col,
    width: 167,
    fixed: 'right',
    sortable: true
  }));
});

const paginateTableData = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return filteredData.value.slice(startIndex, endIndex);
});

// 方法
const fetch_report = () => {
  loading.value = true;

  axios.post('/vcis11/get_leaderboard_detail', {}, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      loading.value = false;
      console.log('API 响应:', response);
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        console.log('API 返回的数据长度:', response.data.data.length);
        allData.value = response.data.data;
      } else {
        console.warn('API 未返回有效数据，使用本地数据');
        useLocalData();
      }
    })
    .catch(error => {
      console.error('API 请求错误:', error);
      loading.value = false;
      useLocalData();
    });
};

const useLocalData = () => {
  console.log('使用本地数据');
  const localData = rank_store.data;
  if (localData && Array.isArray(localData.data)) {
    allData.value = localData.data;
  } else {
    console.error('本地数据格式不正确');
    allData.value = [];
  }
};

const handleCheckAllParamsRangeChange = (val: boolean) => {
  checkboxValues.value[0] = val ? paramsRange.value.map(item => item.value) : [];
  isIndeterminateParamsRange.value = false;
  checkAllParamsRange.value = val;
};

const handleCheckAllCheckboxDataChange = (val: boolean) => {
  checkboxValues.value[1] = val ? checkboxData.value.map(item => item.value) : [];
  isIndeterminateCheckboxData.value = false;
  checkAllCheckboxData.value = val;
};

const handleCheckModelChange = (value: string[], type: 'paramsRange' | 'checkboxData') => {
  if (type === 'paramsRange') {
    const checkedCount = value.length;
    checkAllParamsRange.value = checkedCount === paramsRange.value.length;
    isIndeterminateParamsRange.value = checkedCount > 0 && checkedCount < paramsRange.value.length;
  } else {
    const checkedCount = value.length;
    checkAllCheckboxData.value = checkedCount === checkboxData.value.length;
    isIndeterminateCheckboxData.value = checkedCount > 0 && checkedCount < checkboxData.value.length;
  }
};

const handlePageChange = (val: number) => {
  currentPage.value = val;
};

const getRowIndex = (index: number) => {
  return (currentPage.value - 1) * pageSize.value + index + 1;
};

const resetFilters = () => {
  checkboxValues.value = [[], []];
  checkAllParamsRange.value = false;
  isIndeterminateParamsRange.value = false;
  checkAllCheckboxData.value = false;
  isIndeterminateCheckboxData.value = false;
  currentPage.value = 1;
};

const queryModels = () => {
  // 不需要额外的操作，因为我们使用了计算属性
  currentPage.value = 1;  // 重置到第一页
};

// 生命周期钩子
onMounted(() => {
  fetch_report();
});

// 监听过滤器变化
watch(checkboxValues, () => {
  currentPage.value = 1;  // 重置页码
}, { deep: true });
</script>

<template>
  <div>
    <el-container>
      <el-main>
        <div class="title-container">
          <h1 class="title-item">排行榜</h1>
        </div>
        <div class="rank-filter-container">
          <div class="para-container">
            <!-- 查询模型规模 -->
            <div class="para-item">
              <h1 class="para-item-title">查询模型规模：</h1>
              <div class="checkbox-item">
                <el-row class="inline-checkbox">
                  <el-checkbox
                    :indeterminate="isIndeterminateParamsRange"
                    v-model="checkAllParamsRange"
                    @change="handleCheckAllParamsRangeChange"
                  >全选</el-checkbox>
                  <el-checkbox-group
                    v-model="checkboxValues[0]"
                    @change="(value) => handleCheckModelChange(value, 'paramsRange')"
                  >
                    <el-checkbox
                      v-for="item in paramsRange"
                      :key="item.id"
                      :label="item.value"
                    >
                      {{ item.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-row>
              </div>
            </div>
            <!-- 显示维度 -->
            <div class="para-item">
              <h1 class="para-item-title">显示维度：</h1>
              <div class="checkbox-item">
                <el-row class="inline-checkbox">
                  <el-checkbox
                    :indeterminate="isIndeterminateCheckboxData"
                    v-model="checkAllCheckboxData"
                    @change="handleCheckAllCheckboxDataChange"
                  >全选</el-checkbox>
                  <el-checkbox-group
                    v-model="checkboxValues[1]"
                    @change="(value) => handleCheckModelChange(value, 'checkboxData')"
                  >
                    <el-checkbox
                      v-for="item in checkboxData"
                      :key="item.id"
                      :label="item.value"
                    >
                      {{ item.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-row>
              </div>
            </div>
            <!-- 查询和重置按钮 -->
            <div class="button-container">
              <el-button class="button-find-item" type="primary" @click="queryModels">查询</el-button>
              <el-button class="button-reset-item" color="#CED0D8" plain @click="resetFilters">重置</el-button>
            </div>
          </div>
        </div>
        <!-- 表格 -->
        <div class="table-container">
          <el-table 
            :data="paginateTableData" 
            highlight-current-row 
            v-loading="loading"
            :header-cell-style="{ backgroundColor: '#F5F6F7', color: '#41475E', 'font-size': '14px', 'font-weight': '600', 'line-height': '24px' }"
            :cell-style="{ 'height': '56px', 'line-height': '24px' }"
          >
            <el-table-column label="序号" width="88" fixed>
              <template v-slot="{ row, $index }">
                <span>{{ getRowIndex($index) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="模型" label="模型" width="120" fixed></el-table-column>
            <el-table-column prop="参数量" label="模型规模" width="120" fixed sortable></el-table-column>
            <el-table-column prop="发布者" label="发布者" width="120" fixed></el-table-column>
            <el-table-column prop="发布日期" label="发布日期" width="184" fixed sortable></el-table-column>
            <el-table-column prop="国内/国外模型" label="国内/国外" width="95" fixed></el-table-column>
            <el-table-column prop="综合" label="综合" width="163" fixed sortable></el-table-column>
            <el-table-column 
              v-for="column in dynamicColumns" 
              :key="column.prop" 
              :prop="column.prop"
              :label="column.label" 
              :width="column.width" 
              :fixed="column.fixed"
              :sortable="column.sortable"
            ></el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination 
            v-model:current-page="currentPage" 
            v-model:page-size="pageSize" 
            :page-sizes="[12, 24, 36, 48]"
            :total="filteredData.length"
            @current-change="handlePageChange"
            layout="total, sizes, prev, pager, next, jumper"
            background
          />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.rank-container {
  align-items: center;
}

.title-container {
  width: 120px;
  height: 30px;
  margin-top: 30px;
  margin-left: 70px;
}

.title-item {
  font-weight: 500;
  font-size: 30px;
  color: #121127;
  line-height: 30px;
  text-align: left;
}

.rank-filter-container {
  display: flex;
  margin-top: 32px;
  margin-bottom: 29px;
}

.table-container {
  width: auto;
  margin-left: 70px;
  margin-right: auto;
}

.para-item-title {
  font-weight: 400;
  font-size: 14px;
  color: #41475E;
  line-height: 22px;
  text-align: left;
  height: 22px;
  width: 98px;
}

.para-item {
  display: flex;
  align-items: center;
  margin-left: 70px;
  grid-row-gap: 25px;
}

.checkbox-item {
  margin-left: 24px;
}

.checkbox-label {
  font-weight: 400;
  font-size: 14px;
  color: #121127;
  line-height: 22px;
  text-align: left;
}

.table-row-item {
  width: 28px;
  height: 24px;
  font-weight: 600;
  font-size: 14px;
  color: #41475E;
  line-height: 24px;
  text-align: left;
}

.button-container {
  margin-top: 25px;
  gap: 16px;
  margin-left: 190px;
}

.button-find-item {
  width: 88px;
  height: 32px;
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
  color: #FFFFFF;
}

.button-reset-item {
  width: 88px;
  height: 32px;
  border-radius: 4px 4px 4px 4px;
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
  color: #040B29;
}

.inline-checkbox {
  display: flex;
  flex-direction: row;
  gap: 24px;
}

.pagination-container {
  margin-top: 28px;
  margin-right: 80px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table .descending .sort-caret.descending) {
  border-top-color: #121127;
}

:deep(.el-table .ascending .sort-caret.ascending) {
  border-bottom-color: #121127;
}
</style>
