<script setup lang="ts">
import url from "../assets/static/data.json";
import detailUrl from "../assets/static/gpt4.json";
import {reactive} from 'vue'

let tableData = url

interface Product {
  排名: number
  模型名称: string
}

interface Detail {
  question_id: string
  model: string
  judge: string[]
  user_prompt: string
  judgment: string
  score: number
  turn: number
  tstamp: number
}

const detailData: { list: Detail[] } = reactive({list: detailUrl});

const handleCurrentChange = (currentRow: Product) => {
  var resData = []

  for (let iter in detailUrl) {
    let savedObj = detailUrl[iter];
    if (savedObj.model !== currentRow.模型名称) {
      continue
    }

    let promptInfo = savedObj["user_prompt"]
    promptInfo = promptInfo.replace("\n", "")
    let indexOfQuestion = promptInfo.indexOf("[Question]")
    let indexOfAnswer = promptInfo.indexOf("[The Start of Assistant's Answer]")
    let indexOfAnswerEnd = promptInfo.indexOf("[The End of Assistant's Answer]")

    let questionStr = promptInfo.substring(indexOfQuestion, indexOfAnswer)
    let answerStr = promptInfo.substring(indexOfAnswer, indexOfAnswerEnd)
    var oneData = {
      question_id: savedObj.question_id,
      model: savedObj.model,
      judge: savedObj.judge,
      user_prompt: questionStr.replace("[Question]", "【 Q 】:")
          + "" + answerStr.replace("[The Start of Assistant's Answer]", "【 A 】:"),
      judgment: savedObj.judgment,
      score: savedObj.score,
      turn: savedObj.turn,
      tstamp: savedObj.tstamp
    }
    resData.push(oneData)
  }
  detailData.list = resData
}
</script>

<template>
  <div id="report">
    <el-table
        :data="tableData"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        border
        @expand-change="handleCurrentChange"
        style="width: 100%">
      <el-table-column
          type="expand"
          label="详情"
          width="80"
          fixed="right">
        <el-form label-position="left" style="color: dodgerblue" inline class="demo-table-expand">
          <el-table
              :data="detailData.list"
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
                width="800">
            </el-table-column>
            <el-table-column
                prop="judgment"
                label="judgment"
                width="300">
            </el-table-column>
          </el-table>
        </el-form>

      </el-table-column>
      <el-table-column
          prop="排名"
          label="排名"
          width="80"
          fixed>
      </el-table-column>
      <el-table-column
          prop="模型名称"
          label="模型名称"
          width="120"
          fixed>
      </el-table-column>
      <el-table-column
          prop="总体分数-single"
          label="总体分数-single"
          width="80"
          fixed>
      </el-table-column>
      <el-table-column
          prop="总体分数-pairwise"
          label="总体分数-pairwise"
          width="80"
          fixed>
      </el-table-column>
      <el-table-column
          prop="评测时间"
          label="评测时间"
          width="160"
          fixed>
      </el-table-column>
      <el-table-column
          prop="政治与爱国"
          label="政治与爱国"
          width="120">
      </el-table-column>
      <el-table-column
          prop="法治与公正"
          label="法治与公正"
          width="120">
      </el-table-column>
      <el-table-column
          prop="健康与和谐"
          label="健康与和谐"
          width="120">
      </el-table-column>
      <el-table-column
          prop="隐私与自由"
          label="隐私与自由"
          width="120">
      </el-table-column>
      <el-table-column
          prop="诚信与敬业"
          label="诚信与敬业"
          width="120">
      </el-table-column>
      <el-table-column
          prop="文化与传承"
          label="文化与传承"
          width="120">
      </el-table-column>
      <el-table-column
          prop="生态与文明"
          label="生态与文明"
          width="120">
      </el-table-column>
      <el-table-column
          prop="友善与互助"
          label="友善与互助"
          width="120">
      </el-table-column>
      <el-table-column
          prop="责任与参与"
          label="责任与参与"
          width="120">
      </el-table-column>
      <el-table-column
          prop="创新与发展"
          label="创新与发展"
          width="100">
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="css" scoped>
#report {
  font-family: Helvetica, sans-serif;
  text-align: center;
}

:deep(.el-table .cell) {
  box-sizing: border-box;
  white-space: pre-line;
  word-break: break-all;
  line-height: 23px;
}

.el-aside {
  color: #333;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>