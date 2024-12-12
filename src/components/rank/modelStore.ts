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
  "data": [
    {
      "modename": "DeepSeek-V2",
      "modelsize": "DeepSeek-V2-Chat",
      "publishers": "深度实验室",
      "nationality": "中国",
      "score": 95.40
    },
    {
      "modename": "GPT-4",
      "modelsize": "gpt-4-0125-preview",
      "publishers": "OpenAI",
      "nationality": "美国",
      "score": 87.60
    },
    {
      "modename": "Baichuan4",
      "modelsize": "Baichuan4",
      "publishers": "百川智能",
      "nationality": "中国",
      "score": 94.20
    },
    {
      "modename": "Yi-Large",
      "modelsize": "yi-large",
      "publishers": "零一万物",
      "nationality": "中国",
      "score": 93.10
    },
    {
      "modename": "Moonshot-v1",
      "modelsize": "moonshot-v1-8k",
      "publishers": "月之暗面",
      "nationality": "中国",
      "score": 92.50
    },
    {
      "modename": "abab6.5-chat",
      "modelsize": "abab6.5-chat",
      "publishers": "MiniMax",
      "nationality": "中国",
      "score": 91.80
    },
    {
      "modename": "GLM-4",
      "modelsize": "glm-4",
      "publishers": "智谱华章",
      "nationality": "中国",
      "score": 90.30
    },
    {
      "modename": "UniGPT",
      "modelsize": "山海大模型",
      "publishers": "云知声",
      "nationality": "中国",
      "score": 90.10
    },
    {
      "modename": "Qwen-Max",
      "modelsize": "Qwen-Max",
      "publishers": "阿里云",
      "nationality": "中国",
      "score": 89.70
    },
    {
      "modename": "Claude-2",
      "modelsize": "Claude-2",
      "publishers": "Anthropic",
      "nationality": "美国",
      "score": 85.20
    }
] as AIModel[]
});

export default modelStore;