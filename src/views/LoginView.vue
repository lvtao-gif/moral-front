<template>
  <div class='building'>
    <div class="login-container">
      <el-form :model="input" :rules="rules"
               status-icon
               ref="ruleForm"
               label-position="left"
               label-width="0px"
               class="demo-ruleForm login-page"
               style="margin-top: 10px"
      >
        <!-- <h3 class="title" v-if="this.$store.state.loginMode === this.$login.constant.NATIVE_MODE">
          用户登录
        </h3> -->
        <!-- <h3 class="title" v-if="this.$store.state.loginMode === this.$login.constant.SSO_MODE">
          用户登录(单点登录模式)
        </h3> -->
        <el-form-item prop="username">
          <el-input type="text"
                    clearable
                    v-model="input.username"
                    auto-complete="username"
                    placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password"
                    clearable
                    v-model="input.password"
                    placeholder="密码"
                    auto-complete="current-password"
                    show-password
          ></el-input>
        </el-form-item>
<!--        <el-form-item prop="code">-->
<!--          <el-row :span=24>-->
<!--            <el-col :span=14>-->
<!--              <el-input v-model="input.code" clearable auto-complete="one-time-code" placeholder="验证码"-->
<!--                        v-on:keydown.enter="login"></el-input>-->
<!--            </el-col>-->
<!--            <el-col :span=10>-->
<!--              <div class="login-code" @click="refreshCode">-->
<!--                &lt;!&ndash; 验证码组件 &ndash;&gt;-->
<!--                <SIdentify :identifyCode="identifyCode"></SIdentify>-->
<!--              </div>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </el-form-item>-->
        <!-- <el-form-item prop="rememberpassword" style="margin-top: 0px; margin-bottom: 0px;"> -->
<!--        <el-checkbox v-model="rememberUser" style="margin-top: 0; margin-bottom: 0;">记住用户名</el-checkbox>-->
        <!-- </el-form-item> -->
        <el-form-item prop="login">
          <el-button type="primary" style="width:100%;margin-top: 10px" @click="login(input)" :loading="loginLoading">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import axios from '../utils/httpclient'
import { alertBox } from "../utils/alertBox.js";

interface Input {
  username: string
  password: string
}

const input = ref({username: "", password: ""})
const router = useRouter()
const identifyCode = ref("")
const identifyCodes = ref("")
const loginLoading = ref(false)
const rememberUser = ref(false)

const rules = ref({
  username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
  password: [{required: true, message: '请输入密码', trigger: 'blur'}],
  // code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
})


const login = (input: Input) => {
  //make sure username OR password are not empty
  if (input.username !== "" || input.password !== "") {
    // fixme login interface
    axios.post('/api/login', input, {})
        .then(responseData => {
          window.localStorage.setItem('sessionId', responseData['data']['session_id'])
          window.localStorage.setItem('uid', responseData['data']['uid'])
          window.localStorage.setItem('username', input.username)
          router.push('/rank_list')
          console.log("authenticated")
        })
        .catch((error => {
          console.error('发生错误:', error);
        }))
  } else {
    console.log("Username and Password can not be empty")
  }
}

const refreshCode = () => {
  identifyCode.value = ''
  makeCode(identifyCodes.value, 4)
}

const makeCode = (o, l) => {
  for (let i = 0; i < l; i++) {
    identifyCode.value += identifyCodes.value[
        randomNum(0, identifyCodes.value.length)
        ]
  }
}

const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

onMounted(()=>{
  if (rememberUser.value) {
    input.value.username = window.localStorage.getItem("username")
  }
})
</script>

<style scoped>
.building{
  background:url("/image/LoginBackground.jpg");
  width:100%;
  height:100%;
  position:fixed;
  background-size:100% 100%;
}

.logo {
  margin-left: 12px;
  margin-bottom: 10px
}
.login-container {

  position: absolute;
  left:50%;
  top:50%;
  transform: translate(-50%,-50%);
}
.login-page {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px;
  background-color: rgba(255,255,255,0.7);
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

label.el-checkbox.rememberme {
  margin: 0px 0px 15px;
  text-align: left;
}

h3{
  font-size: 20px;
}

</style>