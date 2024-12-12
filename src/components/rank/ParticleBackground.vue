//src/components/ParticleBackground.vue
<template>
  <!-- 鼠标效果容器，fixed定位覆盖整个视口 -->
  <div class="mouse-effect" ref="mouseEffectRef">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';

/**
 * 粒子对象接口定义
 * @interface Particle
 * @property {number} x - 粒子的x坐标
 * @property {number} y - 粒子的y坐标
 * @property {number} vx - x方向的速度
 * @property {number} vy - y方向的速度
 * @property {number} radius - 粒子半径
 * @property {string} color - 粒子颜色(RGB格式)
 * @property {number} alpha - 粒子透明度
 */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

// 组件refs和全局变量声明
const mouseEffectRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let animationFrameId: number;  // 动画帧ID
let particles: Particle[] = []; // 粒子数组
let mousePos = { x: 0, y: 0 }; // 鼠标位置

/**
 * 获取随机颜色
 * @returns {{base: string, alpha: number}} 返回RGB颜色字符串和透明度
 */
const getRandomColor = () => {
  const colors = [
    { base: '100, 150, 255', alpha: 0.6 },  // 浅蓝色
    { base: '150, 200, 255', alpha: 0.5 },  // 天蓝色
    { base: '120, 180, 255', alpha: 0.55 }  // 中蓝色
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * 初始化Canvas和粒子系统
 * 设置画布尺寸并创建初始粒子
 */
const initCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  
  ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 设置Canvas尺寸
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  
  resize();
  window.addEventListener('resize', resize);

  // 创建粒子
  const particleCount = 220; // 粒子总数
  for (let i = 0; i < particleCount; i++) {
    const color = getRandomColor();
    particles.push({
      x: Math.random() * canvas.width,      // 随机x坐标
      y: Math.random() * canvas.height,     // 随机y坐标
      vx: (Math.random() - 0.5) * 0.8,     // 随机x方向速度
      vy: (Math.random() - 0.5) * 0.8,     // 随机y方向速度
      radius: Math.random() * 5 + 3,        // 随机半径(3-8)
      color: color.base,
      alpha: color.alpha
    });
  }
};

/**
 * 动画循环函数
 * 更新和绘制所有粒子
 */
const animate = () => {
  if (!canvasRef.value || !ctx) return;
  
  // 清空画布
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  
  // 遍历更新每个粒子
  particles.forEach(particle => {
    // 更新位置
    particle.x += particle.vx;
    particle.y += particle.vy;
    
    // 边界检查和反弹
    if (particle.x < 0 || particle.x > canvasRef.value!.width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > canvasRef.value!.height) particle.vy *= -1;
    
    // 创建径向渐变效果
    const gradient = ctx!.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.radius
    );
    gradient.addColorStop(0, `rgba(${particle.color}, ${particle.alpha})`);
    gradient.addColorStop(1, `rgba(${particle.color}, 0)`);
    
    // 绘制粒子
    ctx!.beginPath();
    ctx!.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx!.fillStyle = gradient;
    ctx!.fill();
    
    // 绘制粒子之间的连线
    particles.forEach(otherParticle => {
      const dx = particle.x - otherParticle.x;
      const dy = particle.y - otherParticle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // 当粒子距离小于180时绘制连线
      if (distance < 180) {
        ctx!.beginPath();
        ctx!.moveTo(particle.x, particle.y);
        ctx!.lineTo(otherParticle.x, otherParticle.y);
        const opacity = 0.15 * (1 - distance / 180);
        ctx!.strokeStyle = `rgba(${particle.color}, ${opacity})`;
        ctx!.stroke();
      }
    });

    // 处理鼠标交互
    const dx = particle.x - mousePos.x;
    const dy = particle.y - mousePos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 鼠标附近200px范围内的粒子会受到影响
    if (distance < 200) {
      // 绘制鼠标与粒子之间的连线
      ctx!.beginPath();
      ctx!.moveTo(particle.x, particle.y);
      ctx!.lineTo(mousePos.x, mousePos.y);
      const opacity = 0.3 * (1 - distance / 200);
      ctx!.strokeStyle = `rgba(${particle.color}, ${opacity})`;
      ctx!.stroke();

      // 计算粒子受到的加速度
      const acceleration = 0.07;
      const angle = Math.atan2(dy, dx);
      particle.vx -= Math.cos(angle) * acceleration;
      particle.vy -= Math.sin(angle) * acceleration;

      // 限制粒子最大速度
      const maxSpeed =3.5;
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      if (speed > maxSpeed) {
        particle.vx = (particle.vx / speed) * maxSpeed;
        particle.vy = (particle.vy / speed) * maxSpeed;
      }
    }
  });
  
  // 请求下一帧动画
  animationFrameId = requestAnimationFrame(animate);
};

/**
 * 处理鼠标移动事件
 * 更新鼠标位置坐标
 * @param {MouseEvent} e - 鼠标事件对象
 */
const handleMouseMove = (e: MouseEvent) => {
  const rect = mouseEffectRef.value?.getBoundingClientRect();
  if (rect) {
    mousePos.x = e.clientX - rect.left;
    mousePos.y = e.clientY - rect.top;
  }
};

// 生命周期钩子
onMounted(() => {
  initCanvas();  // 初始化画布
  animate();     // 开始动画循环
  window.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);  // 取消动画
  window.removeEventListener('mousemove', handleMouseMove);  // 移除事件监听
});
</script>

<style scoped>
/* 鼠标效果容器样式 */
.mouse-effect {
  position: fixed;  /* 固定定位 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;  /* 禁用鼠标事件，使其可以穿透到下层元素 */
  z-index: 1;  /* 确保在适当的层级显示 */
}
</style>