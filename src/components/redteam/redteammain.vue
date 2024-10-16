<template>
  <el-container class="container">
    <!-- 主要内容区域 -->
    <el-main class="main-content">
      <div class="content-wrapper">
    <h1 class="title">VCIS红队攻击平台</h1>
    <div class="custom-text">
        <p class="typewriter-text">{{ message }}</p>
      </div>
    <el-button type="primary" size="large" class="custom-button" @click="goToDashboard">进入平台</el-button>
  </div>
  </el-main>
    <!-- 底部流程展示部分
    <el-footer class="process-flow">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="process-step">
            <img src="icon1.png" alt="提交申请单" />
            <p class="step-title">1. 提交申请单</p>
            <p>提交申请后，审核团队会尽快完成您的申请审批。</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="process-step">
            <img src="icon2.png" alt="配置待评测问题" />
            <p class="step-title">2. 配置待评测问题</p>
            <p>选择合适的评测模型和问题类型。</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="process-step">
            <img src="icon3.png" alt="配置大模型参数" />
            <p class="step-title">3. 配置大模型参数</p>
            <p>配置模型参数和相关设置。</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="process-step">
            <img src="icon4.png" alt="获取评测报告" />
            <p class="step-title">4. 获取评测报告</p>
            <p>评测完成后，您将获得详细的评测报告。</p>
          </div>
        </el-col>
      </el-row>
    </el-footer> -->
  </el-container>
</template>

<script lang="ts" setup>
import {} from '@element-plus/icons-vue';
import { ref, computed, nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const message = ref("本平台采用多种红队攻击方案，通过静态展示红队攻击结果和用户交互式测试红队攻击结果，以帮助用户了解红队攻击的流程和效果。")
const router = useRouter();
function goToDashboard() {
router.push({ name: 'redteam' }); // 使用路由名称跳转
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
text-align: left;
margin-top: -300px;
padding-left: 2px;
color: transparent; /* 文字颜色设置为透明 */
background: linear-gradient(90deg, #ff7e5f, #feb47b, #ff6e7f, #feb47b, #ff6e7f); /* 静态渐变色 */
background-size: 100%; /* 背景尺寸覆盖整个文字 */
-webkit-background-clip: text; /* 适用于 Webkit 内核浏览器 */
background-clip: text; /* 标准背景剪辑 */
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
  color:  #f7f6fb;
  line-height: 40px;
  padding-left: 100px;
}

.content-wrapper {
display: flex;
flex-direction: column; /* 垂直排列子元素 */
align-items: center; /* 水平居中 */
text-align: left; /* 文本居中 */
}

.main-content {
width: 100%;
height: calc(100vw * (1024 / 1600)); /* 按照图片宽高比调整高度 */
background-color: #ffffff;
display: flex;
justify-content:left;
align-items: center;
background-image: url('/image/main/redteam/r2.jpg');
background-repeat: no-repeat;
background-size: contain; /* 图片按比例缩放以适应容器 */
}


.custom-button {
font-size: 50px; /* 设置字体大小 */
padding: 50px 100px; /* 调整按钮内边距，使其更大 */
border-radius: 60px; /* 可选：设置按钮圆角 */
color: #faf9f9;
background-color: #1619c4;
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
