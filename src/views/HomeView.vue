<script setup lang="ts">
import TopMenu from "../components/TopMenu.vue";
import axios from "../utils/httpclient";
import { useRouter } from "vue-router";
import { onBeforeMount, ref } from 'vue';

const router = useRouter();
let username = ref("");

onBeforeMount(() => {
  username.value = window.localStorage.getItem('username');
});

const logout = () => {
  const sessionId = window.localStorage.getItem('sessionId');
  const uid = window.localStorage.getItem('uid');
  const input = {uid: uid, sessionId: sessionId};

  axios.post('/api/logout', input, {})
      .then(() => {
        router.push('/login');
      })
      .catch((error => {
        console.error('发生错误:', error);
      }));
};
</script>

<template>
  <el-container name="juan" style="position: absolute; left: 0; right: 0; top: 0; bottom: 0; overflow: hidden; width: 100%; height: 100%;">
    <el-header style="text-align: right; vertical-align: center; height: 10%; --el-header-padding: 0 0px">
      <TopMenu/>
    </el-header>
    <el-container style="position: absolute; left: 0; right: 0; top: 79px; bottom: 0; overflow: hidden; width: 100%; height: 90%;">
      <el-container style="position: relative; left: 0; right: 0; top: 0; bottom: 0; overflow: hidden; width: 100%; height: 100%;">
        <el-main style="--el-main-padding: 0;">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<style>
.el-dropdown-link {
  cursor: pointer;
  color: #ffffff;
  display: flex;
  height: 100%;
  align-items: baseline;
}
</style>
