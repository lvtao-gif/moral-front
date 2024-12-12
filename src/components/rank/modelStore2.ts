// src/store/modelStore.ts
import { reactive } from 'vue'

export interface AIModel {
  modename: string;
  modelsize: string;
  publishers: string;
  nationality: string;
  score: number;
}

const modelStore = reactive({
  data: [
    {
              "modename":"Qwen2.5-72B-Instruct",
              "modelsize":"72b",
              "publishers":"阿里通义千问实验室",
              "nationality":"中国",
              "score":70.1
          },
          {
              "modename":"Internlm2-chat-20b",
              "modelsize":"20b",
              "publishers":"书生·浦语",
              "nationality":"中国",
              "score":59.4
          },
          {
              "modename":"Baichuan4-Turbo",
              "modelsize":"*",
              "publishers":"百川智能",
              "nationality":"中国",
              "score":65.3
          },
          {
              "modename":"Qwen2.5-32B-Instruct",
              "modelsize":"72b",
              "publishers":"阿里通义千问实验室",
              "nationality":"中国",
              "score":68.3
          },
          {
              "modename":"Deepseek-v2.5",
              "modelsize":"236b",
              "publishers":"Deepseek深度求索",
              "nationality":"中国",
              "score":69.9
          },
          {
              "modename":"Doubao-pro",
              "modelsize":"*",
              "publishers":"字节跳动",
              "nationality":"中国",
              "score":73.5
          },
          {
              "modename":"Qwen-QWQ",
              "modelsize":"32B",
              "publishers":"阿里通义千问实验室",
              "nationality":"中国",
              "score":70.6
          },
          {
              "modename":"Claude3.5-Sonnet",
              "modelsize":"*",
              "publishers":"Anthropic",
              "nationality":"美国",
              "score":77.5
          },
          {
              "modename":"GPT-4o",
              "modelsize":"*",
              "publishers":"Openai",
              "nationality":"美国",
              "score":72.0
          },
          {
              "modename":"Yi-lightning",
              "modelsize":"*",
              "publishers":"零一万物",
              "nationality":"中国",
              "score":69.0
          }
  ] as AIModel[]
});

export default modelStore;