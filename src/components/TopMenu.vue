<script setup lang="ts">
import { ref } from "vue";
const activeMenu = ref('/');
</script>


<template>
    <el-menu class="el-menu-demo" mode="horizontal" router :default-active="activeMenu">
      <div class="menu-item-container">
        <el-menu-item index="/">
          <img src="/image/main/topMenu/logo.png" class="menu-icon">
        </el-menu-item>
      </div>

      <div class="menu-item-container-right">
        <el-menu-item index="/" class="menu-text">首页</el-menu-item>
        <el-menu-item index="/model_list" class="menu-text">模型</el-menu-item>
        <!-- <el-menu-item index="/dataset_list" class="menu-text">数据集</el-menu-item> -->
        <el-sub-menu index="3">
          <template #title><span class="menu-text">数据集</span></template>
          <el-menu-item index="/dataset_list" class="sub-menu-item">概览</el-menu-item>
          <el-menu-item index="/dataset_generate" class="sub-menu-item">生成</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="4">
          <template #title><span class="menu-text">评测</span></template>
          <el-menu-item index="/evatask" class="sub-menu-item">发起评测</el-menu-item>
          
          <el-menu-item index="/rank_list" class="sub-menu-item">评测结果</el-menu-item>
          <!--        <el-sub-menu index="3-4">-->
          <!--          <template #title>item four</template>-->
          <!--          <el-menu-item index="3-4-1">item one</el-menu-item>-->
          <!--          <el-menu-item index="3-4-2">item two</el-menu-item>-->
          <!--          <el-menu-item index="3-4-3">item three</el-menu-item>-->
          <!--        </el-sub-menu>-->
        </el-sub-menu>
        <el-sub-menu index="5">
          <template #title><span class="menu-text">排行榜</span></template>
        <el-menu-item index="/evarank" class="sub-menu-item">大模型伦理维度测试排行榜</el-menu-item>
        <el-menu-item index="/evarank2" class="sub-menu-item">大模型生成内容测评榜单</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/lgtmain" class="menu-text"> 大模型生成内容测试平台</el-menu-item>
        <el-menu-item index="/redteammain" class="menu-text"> 红队攻击平台</el-menu-item>
        <!--<el-menu-item index="/test" class="menu-text"> test</el-menu-item>-->
      </div>
    </el-menu>

</template>

<style scoped>

.menu-item-container {
  display: flex;
  align-items: center;
  color: #121127;
  margin-top: 14px;
  margin-bottom: 14px;
}

.menu-icon {
  margin-left: 40px;
  width: 52px;
  height: 52px;
}

.menu-text {
  font-weight: 600;
  font-size: 16px;
  color: rgba(18, 17, 39, 0.6);
  line-height: 29px;
  text-align: center;
  margin-top: 25.5px;
  margin-bottom: 25.5px;
}

.sub-menu-item {
  font-size: 14px;
  color: #909399;
}

.el-menu-demo {
  width: 100%;
  height: 80px;
  background: #FFFFFF;
  box-shadow: 0 2px 16px 0 rgba(20, 24, 63, 0.08);
  display: flex;
  justify-content: space-between;

}
.el-menu-item {
  margin: 0;
}


.el-menu-item:hover{
  background-color:#FFFFFF !important;
  color: #003399 !important;
}

.menu-item-container-right{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: row;
  gap: 56px;
  padding-right: 80px; 
  padding-left: 80px; 
  margin: 0;
}

.el-menu-item.is-active {
  background-color:#FFFFFF !important;
  color: #003399 !important;

}


</style>
