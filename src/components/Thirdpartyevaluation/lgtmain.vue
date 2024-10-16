<template>
    <el-container class="container">
      <!-- 主要内容区域 -->
      <el-main class="main-content">
        <div class="content-wrapper">
      <h1 class="title">大模型生成内容测试平台</h1>
      <div class="custom-text">
        <p class="typewriter-text">{{ message }}</p>
      </div>
      <el-button type="primary" size="large" class="custom-button" @click="goToDashboard">进入控制台</el-button>
    </div>
    </el-main>
    </el-container>
  </template>
  
  <script lang="ts" setup>
  import {} from '@element-plus/icons-vue';
  import { ref, computed, nextTick, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  const message = ref("本平台依据国家标准及上级部门的要求，特别是《生成式人工智能服务管理暂行办法》和《生成式人工智能服务安全基本要求》，推出了针对大模型的内容安全测试服务。该服务旨在通过对大模型生成内容的有效评估，促进相关业务的健康发展。");
  const router = useRouter();
  function goToDashboard() {
  router.push({ name: 'test' }); // 使用路由名称跳转
}
  </script>
  
  <style scoped>
  .container {
    min-height: 300px;
    display: flex;
    background-size: cover;
    background-position: center;
    flex-direction: column;

  }

  .title {
  font-size: 110px;
  font-weight: bold;
  text-align: lift;
  margin-top: -300px;
  padding-left: 2px;
  color: transparent; /* 文字颜色设置为透明 */
  background: linear-gradient(90deg, #de846e, #e1b475, #86a8e7, #7f7fd5, #ff7e5f,#de846e, #e1b475, #86a8e7, #7f7fd5, #ff7e5f,#e1b475); /* 渐变色，两端颜色相同以实现无缝循环 */
  background-size: 200% auto; /* 让背景尺寸为文字的两倍宽 */
  -webkit-background-clip: text; /* 适用于 Webkit 内核浏览器 */
  background-clip: text; /* 标准背景剪辑 */
  animation: gradient-scroll 5s linear infinite; /* 应用滚动动画 */
}

@keyframes gradient-scroll {
  0% {
    background-position: 0% 50%; /* 背景起始位置 */
  }
  100% {
    background-position: 100% 50%; /* 背景结束位置 */
  }
}

  .logo {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }

  .typewriter-text {
    width: 1000px;
    height: 224px;
    font-weight: 550;
    font-size: 25px;
    color:  #f9f7f7;
    line-height: 40px;
    padding-left: 100px;
}

.content-wrapper {
  display: flex;
  flex-direction: column; /* 垂直排列子元素 */
  align-items: center; /* 水平居中 */
  text-align: lift; /* 文本居中 */
}

  .main-content {
  width: 100%;
  height: calc(100vw * (1024 / 1600)); /* 按照图片宽高比调整高度 */
  background-color: #ffffff;
  display: flex;
  justify-content: right;
  align-items: center;
  background-image: url('/image/main/redteam/t3.png');
  background-repeat: no-repeat;
  background-size: contain; /* 图片按比例缩放以适应容器 */
}

  
.custom-button {
  font-size: 50px; /* 设置字体大小 */
  padding: 50px 100px; /* 调整按钮内边距，使其更大 */
  border-radius: 60px; /* 可选：设置按钮圆角 */
  color: #faf9f9;
  background-color: #af3fdf;
}
  
  .description {
    margin: 20px 0;
    font-size: 16px;
    color: #fff;
    
  }
  
  .process-flow {
    background-color: #fff;
    padding: 40px 20px;
  }
  
  .process-step {
    text-align: center;
  }
  
  .process-step img {
    width: 60px;
    height: 60px;
    margin-bottom: 10px;
  }
  
  .step-title {
    font-weight: bold;
    color: #333;
  }
  
  .process-step p {
    margin: 5px 0;
    color: #666;
  }
  </style>
  