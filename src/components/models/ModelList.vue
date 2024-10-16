<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import model_store from "../models/store";

let modelTableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(12);
const loading = ref(true);

const navigateToDetailPage = (row) => {
  row.name = row.name.replace(/\//g, "--");
  window.open('/model_detail/' + row.name);
};

const modelSizeFilters = ref([]);
const checkedValue = ref([[], []]);
const regionFilters = ref([
  { value: "国内", text: "国内" },
  { value: "国外", text: "国外" },
]);
const openSourceFilters = ref([
  { value: '可商用', text: '可商用', iconUrl: 'image/main/modelList/A.svg' },
  { value: '不可商用', text: '不可商用', iconUrl: 'image/main/modelList/B.svg' },
  { value: '年费商用授权', text: '年费商用授权', iconUrl: 'image/main/modelList/C.svg' },
  { value: '收费商用授权', text: '收费商用授权', iconUrl: 'image/main/modelList/C.svg' },
  { value: '开源不可商用', text: '开源不可商用', iconUrl: 'image/main/modelList/D.svg' },
  { value: '不开源', text: '不开源', iconUrl: 'image/main/modelList/D.svg' }
]);

const getOpenSourceIcon = (value) => {
  const filterItem = openSourceFilters.value.find(item => item.value === value);
  return filterItem ? filterItem.iconUrl : '';
};

const handleSortChange = ({ prop, order }) => {
  modelTableData.value.sort((a, b) => {
    const aValue = a[prop];
    const bValue = b[prop];

    if (order === 'ascending') {
      return aValue > bValue ? 1 : -1;
    } else if (order === 'descending') {
      return aValue > bValue ? -1 : 1;
    }

    return 0;
  });
};

const checkAll = ref([false, false]);
const isIndeterminate = ref([false, false]);

const handleCheckAllInCountryChange = (val: boolean) => {
  checkedValue.value[0] = val ? regionFilters.value.map(item => item.value) : [];
  isIndeterminate.value[0] = false;
};

const handleCheckAllInOpenSourceChange = (val: boolean) => {
  checkedValue.value[1] = val ? openSourceFilters.value.map(item => item.value) : [];
  isIndeterminate.value[1] = false;
};

const handleCheckedModelCountryChange = (value: string[]) => {
  const checkedCount = value.length;
  checkAll.value[0] = checkedCount === regionFilters.value.length;
  isIndeterminate.value[0] = checkedCount > 0 && checkedCount < regionFilters.value.length;
};

const handleCheckedOpenSourceChange = (value: string[]) => {
  const checkedCount = value.length;
  checkAll.value[1] = checkedCount === openSourceFilters.value.length;
  isIndeterminate.value[1] = checkedCount > 0 && checkedCount < openSourceFilters.value.length;
};

const paginateTableData = () => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return modelTableData.value.slice(startIndex, endIndex);
};

const handlePageChange = (val: number) => {
  currentPage.value = val;
};

const getRowIndex = (index: number) => {
  return (currentPage.value - 1) * pageSize.value + index + 1;
};

const resetFilters = () => {
  checkedValue.value[0] = [];
  checkedValue.value[1] = [];
  checkAll.value = [false, false];
  isIndeterminate.value = [false, false];
  modelTableData.value = model_store.list;
};

const queryModels = () => {
  const filteredData = model_store.list.filter(row => {
    if (checkedValue.value[0].length > 0 && !checkedValue.value[0].includes(row.country)) {
      return false;
    }

    if (checkedValue.value[1].length > 0 && !checkedValue.value[1].includes(row.commercial_use)) {
      return false;
    }

    return true;
  });

  modelTableData.value = filteredData;
};

onMounted(() => {
  loading.value = false;
  modelTableData.value = model_store.list;

  const modelSizeTemp = model_store.list.map(item => item.parameters_size);
  const mergedArray = [...new Set(modelSizeTemp)].sort();

  mergedArray.forEach(item => {
    modelSizeFilters.value.push({ text: item, value: item });
  });
});

watch(checkedValue, () => {
  queryModels();
});
</script>


<template>
  <div class="page-container">

    <div class="title-container">
      <h1 class="title-item">模型</h1>
    </div>

    <div class="filter-container">
      <div class="filter-item">
        <el-row class="filter-item-row">
          <div class="filter-name">国内/国外：</div>
          <div class="filter-checkbox-container">
            <div class="filter-checkbox">
              <el-row class="filter-checkbox-row">
                <el-checkbox v-model="checkAll[0]" :indeterminate="isIndeterminate[0]"
                  @change="handleCheckAllInCountryChange">全选</el-checkbox>
                <el-checkbox-group v-model="checkedValue[0]" @change="handleCheckedModelCountryChange">
                  <el-checkbox v-for="filter in regionFilters" :key="filter.value" :label="filter.value"
                    :value="filter.value">{{ filter.text }}</el-checkbox>
                </el-checkbox-group>
              </el-row>
            </div>
          </div>
        </el-row>

        <el-row class="filter-item-row">
          <div class="filter-name">开源情况：</div>
          <div class="filter-checkbox-container">
            <div class="filter-checkbox">
              <el-row class="filter-checkbox-row">
                <el-checkbox v-model="checkAll[1]" :indeterminate="isIndeterminate[1]"
                  @change="handleCheckAllInOpenSourceChange">全选</el-checkbox>
                <el-checkbox-group v-model="checkedValue[1]" @change="handleCheckedOpenSourceChange">
                  <el-checkbox v-for="filter in openSourceFilters" :key="filter.value" :label="filter.value"
                    :value="filter.value">{{ filter.text }}</el-checkbox>
                </el-checkbox-group>
              </el-row>
            </div>
          </div>
        </el-row>

        <div class="filter-button-container">
          <el-button class="filter-select" color="#003399" @click="queryModels">查询</el-button>
          <el-button class="filter-reset" color="#CED0D8" @click="resetFilters">重置</el-button>
        </div>
      </div>
    </div>

    <div class="table-container">
      <el-table :data="paginateTableData()" @sort-change="handleSortChange" v-loading="loading"
        :header-cell-style="{ height: '56px', background: '#F5F6F7' }">
        <el-table-column label="序号" width="88" fixed>
          <template v-slot="{ row, $index }">
            <span>{{ getRowIndex($index) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="模型名称" width="200">
          <template v-slot="{ row }">
            <span @click="navigateToDetailPage(row)" style="cursor: pointer;"><a>{{ row.name }}</a></span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="模型简介" width="509"></el-table-column>
        <el-table-column prop="parameters_size" label="模型规模" width="116" sortable></el-table-column>
        <el-table-column prop="promulgator" label="发布者" width="120"></el-table-column>
        <el-table-column prop="date" label="发布时间" width="184" sortable></el-table-column>
        <el-table-column prop="country" label="国内/国外" width="95"></el-table-column>
        <el-table-column prop="commercial_use" label="开源情况" width="88">
          <template v-slot="{ row }">
            <img :src="getOpenSourceIcon(row.commercial_use)" alt="开源情况图标">
          </template>
        </el-table-column>
        <el-table-column prop="url" label="模型地址" width="240">
          <template v-slot="{ row }">
            <a :href="row.url" target="_blank">{{ row.url }}</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[12, 24, 36, 48]"
        background layout="total, prev, pager, next, sizes, jumper" :total="modelTableData.length"
        @current-change="handlePageChange" />
    </div>
  </div>
</template>


<style scoped>
.page-container {
  padding: 0 90px;
}

.title-item {
  font-weight: 500;
  font-size: 30px;
  color: #121127;
  line-height: 30px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.title-container {
  width: 60px;
  height: 30px;
  margin-top: 45px;
}

.filter-name {
  width: 77px;
  height: 22px;
  font-weight: 400;
  font-size: 14px;
  color: #41475E;
  line-height: 22px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.filter-checkbox-row {
  display: flex;
  align-items: center;
  gap: 24px;
}

.filter-item-row {
  display: flex;
  align-items: center;
  gap: 32px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.filter-container {
  margin-top: 32px;
}

.filter-select {
  width: 88px;
  height: 32px;
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
}

.filter-reset {
  width: 88px;
  height: 32px;
  border-radius: 4px 4px 4px 4px;
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
  color: #040B29;
}

.filter-button-container {
  margin-top: auto;
  gap: 16px;
  margin-left: 100px;
}

.table-container {
  margin-top: 24px;
  width: 100%;
}

.pagination-container {
  margin-top: 28px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  color: #FFFFFF;
}

a {
  color: #121127;
}

:deep(.el-table .descending .sort-caret.descending) {
  border-top-color: #121127;
}

:deep(.el-table .ascending .sort-caret.ascending) {
  border-bottom-color: #121127;
}
</style>
