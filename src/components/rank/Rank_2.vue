<template>
  <div class="ranking-container">
    <ParticleBackground />
    
    <h1 class="main-title">大模型安全评测排行榜</h1>

    <!-- 筛选按钮组 -->
    <div class="filter-container">
      <div class="filter-buttons">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          :class="['filter-btn', { active: currentFilter === filter.value }]"
          @click="currentFilter = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <div class="ranking-list">
      <div class="list-header">
        <div class="header-rank">排名</div>
        <div class="header-model">模型信息</div>
        <div class="header-version">版本</div>
        <div class="header-score">评分</div>
      </div>

      <div class="list-body">
        <div v-for="(model, index) in filteredModels" 
             :key="model.modename"
             class="list-item"
             :class="[
               `rank-${index + 1}`,
               { 'top-three': index < 3 }
             ]">
          <!-- 排名徽章 -->
          <div class="rank-column">
            <div class="rank-badge" :class="`rank-${index + 1}`">
              <span class="rank-number">{{ index + 1 }}</span>
              <div class="rank-crown" v-if="index === 0">👑</div>
            </div>
          </div>
          
          <!-- 模型信息 -->
          <div class="model-column">
            <div class="model-name">{{ model.modename }}</div>
            <div class="model-meta">
              <span class="tag-closed">闭源</span>
              <span class="provider">{{ model.publishers }}</span>
              <span class="nationality">{{ model.nationality }}</span>
            </div>
          </div>

          <!-- 版本信息 -->
          <div class="version-column">
            <div class="version-tag">{{ model.modelsize }}</div>
          </div>

          <!-- 评分 -->
          <div class="score-column">
            <div class="score-wrapper">
              <div class="score-bar">
                <div class="score-progress" 
                    :style="{ 
                      width: `${getScoreWidth(model.score)}%`,
                      backgroundColor: getScoreColor(model.score)
                    }">
                </div>
              </div>
              <span class="score-value">{{ model.score.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="footer-content">
        <p class="update-time">数据更新时间：2024年12月</p>
        <p class="copyright">本评测排行榜数据仅供参考</p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import modelStore from './modelStore';
import ParticleBackground from './ParticleBackground.vue';

// 筛选选项定义
const filters = [
  { label: '综合排名', value: 'all' },
  { label: '国内模型', value: 'domestic' },
  { label: '国外模型', value: 'foreign' }
];

// 当前选中的筛选条件
const currentFilter = ref('all');

// 根据筛选条件过滤并排序模型
const filteredModels = computed(() => {
  let filtered = [...modelStore.data];
  
  // 根据选择的筛选条件过滤数据
  if (currentFilter.value === 'domestic') {
    filtered = filtered.filter(model => model.nationality === '中国');
  } else if (currentFilter.value === 'foreign') {
    filtered = filtered.filter(model => model.nationality !== '中国');
  }
  
  // 按分数排序
  return filtered.sort((a, b) => b.score - a.score);
});
const getScoreWidth = (score: number) => {
  // 将分数映射到0-100的范围
  // 假设最低分数是0，最高分数是100
  return Math.max(0, Math.min(100, score));
};

// 根据分数返回对应的颜色
const getScoreColor = (score: number) => {
  if (score <= 40) {
    return '#F56C6C';  // 红色
  } else if (score <= 70) {
    return 'rgb(237.5, 189.9, 118.5)';  // 黄色
  } else {
    return '#67C23A';  // 绿色
  }
};
</script>


<style scoped>
.ranking-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #faf8f8 0%, #f6f9fc 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.main-title {
  text-align: center;
  font-size: 4rem;
  font-weight: 800;
  color: #1a365d;
  margin: 2rem 0 4rem;
  position: relative;
  z-index: 2;
  background: linear-gradient(120deg, #1a365d 0%, #2b6cb0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ranking-list {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 2rem;
  position: relative;
  z-index: 2;
  max-width: 1600px;
  margin: 0 auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.list-header {
  display: grid;             /* 使用CSS Grid布局 */
  grid-template-columns: 100px 2fr 1fr 1fr; /* 定义四列网格，第一列为固定宽度，其余三列按比例分配空间 */
  padding: 1rem 2rem;        /* 设置内边距，上下1rem（根元素字体大小），左右2rem */
  font-weight: 600;
  color: #455469;            /* 设置文本颜色为一种深灰色 */
  border-bottom: 2px solid #e2e8f0; /* 在元素底部添加一条2像素宽的浅蓝色实线边框 */
  margin-bottom: 1rem;       /* 设置元素底部外边距为1rem */
}
.list-item {
  display: grid;
  grid-template-columns: 100px 2fr 1fr 1fr;
  padding: 1.5rem 2rem;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  position: relative;
}

.list-item:hover {
  transform: translateX(10px);
  background: rgba(255, 255, 255, 0.7);
}

/* 前三名特殊样式 */
.top-three {
  background: linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
  margin: 0.5rem 0;
  border-radius: 16px;
  border: none;
}

.rank-1 {
  background: linear-gradient(to right, rgba(251, 193, 0, 0.2), rgba(255, 255, 255, 0.95));
}

.rank-2 {
  background: linear-gradient(to right, rgba(226, 232, 240, 0.3), rgba(255, 255, 255, 0.95));
}

.rank-3 {
  background: linear-gradient(to right, rgba(205, 183, 158, 0.2), rgba(255, 255, 255, 0.95));
}

.rank-badge {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  position: relative;
  margin: 0 auto;
}

.rank-1 .rank-badge {
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
  color: white;
  box-shadow: 0 4px 8px rgba(255, 215, 0, 0.3);
}

.rank-2 .rank-badge {
  background: linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%);
  color: white;
  box-shadow: 0 4px 8px rgba(192, 192, 192, 0.3);
}

.rank-3 .rank-badge {
  background: linear-gradient(135deg, #CD7F32 0%, #B8860B 100%);
  color: white;
  box-shadow: 0 4px 8px rgba(205, 127, 50, 0.3);
}

.rank-crown {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.2rem;
}

.model-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #1a365d;
  margin-bottom: 0.5rem;
}

.model-meta {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.tag-closed {
  background: #ebf8ff;
  color: #2b6cb0;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
}

.provider, .nationality {
  color: #64748b;
  font-size: 0.9rem;
}

.version-tag {
  background: #f1f5f9;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  color: #475569;
  font-size: 0.9rem;
  display: inline-block;
}

.score-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.score-bar {
  flex: 1;
  height: 15px;
  background: #e2e8f0;
  border-radius: 80px;
  overflow: hidden;
}

.score-progress {
  height: 100%;
  border-radius: 4px;
  transition: all 0.6s ease;
}

.score-value {
  font-weight: bold;
  color: #2563eb;
  font-size: 1.2rem;
  min-width: 70px;
  text-align: right;
}

.footer {
  text-align: center;
  margin-top: 3rem;
  color: #64748b;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }

  .list-header {
    display: none;
  }

  .list-item {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1.5rem;
  }

  .rank-column {
    justify-self: center;
  }

  .model-meta {
    flex-wrap: wrap;
  }

  .score-wrapper {
    justify-content: center;
  }
}
/* 新增筛选按钮样式 */
.filter-container {
  max-width: 1600px;
  margin: 0 auto 2rem;
  position: relative;
  z-index: 2;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #2b6cb0;
  border-radius: 12px;
  background: transparent;
  color: #2b6cb0;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.filter-btn:hover {
  background: rgba(43, 108, 176, 0.1);
  transform: translateY(-2px);
}

.filter-btn.active {
  background: #2b6cb0;
  color: white;
  box-shadow: 0 4px 12px rgba(43, 108, 176, 0.2);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .filter-buttons {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .filter-btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>