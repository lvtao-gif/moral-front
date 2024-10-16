import {createRouter, createWebHistory} from 'vue-router'

import {ref} from 'vue'

const savedScrollPosition = ref({x: 0, y: 0})

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/home',
            name: 'home',
            component: () => import('@/views/HomeView.vue'),
            children: [
                {
                    path: '/',
                    name: 'main',
                    component: () => import('@/views/MainPage.vue')
                },
                {
                    path: '/model_list',
                    name: 'model_list',
                    component: () => import('@/components/models/ModelList.vue')
                },
                {
                    path: '/model_detail/:id',
                    name: 'model_detail',
                    component: () => import('@/components/models/ModelDetail.vue'),
                    props: true,
                },
                {
                    path: '/dataset_list',
                    name: 'dataset_list',
                    component: () => import('@/components/dataset/DatasetList.vue')
                },
                {
                    path: '/dataset_detail/political_ethics_dataset/',
                    name: 'political_ethics_dataset',
                    component: () => import('@/components/dataset/political_ethics_dataset.vue'),
                    props: true,
                },
                {
                    path: '/dataset_detail/social_ethics_dataset/',
                    name: 'social_ethics_dataset',
                    component: () => import('@/components/dataset/social_ethics_dataset.vue'),
                    props: true,
                },
                {
                    path: '/dataset_detail/cultural_ethics_dataset/',
                    name: 'economic_ethics_dataset',
                    component: () => import('@/components/dataset/cultural_ethics_dataset.vue'),
                    props: true,
                },
                {
                    path: '/dataset_detail/technology_ethics_dataset/',
                    name: 'technology_ethics_dataset',
                    component: () => import('@/components/dataset/technology_ethics_dataset.vue'),
                    props: true,
                },
                {
                    path: '/dataset_detail/environmental_ethics_dataset/',
                    name: 'environmental_ethics_dataset',
                    component: () => import('@/components/dataset/environmental_ethics_dataset.vue'),
                    props: true,
                },
                {
                    path: '/dataset_detail/arts_ethics_dataset/',
                    name: 'arts_ethics_dataset',
                    component: () => import('@/components/dataset/arts_ethics_dataset.vue'),
                    props: true,
                },
                {
                    path: '/dataset_detail/cyber_information_ethics_dataset/',
                    name: 'cyber_information_ethics_dataset',
                    component: () => import('@/components/dataset/cyber_information_ethics_dataset.vue'),
                    props: true,
                },
                {
                    path: '/dataset_detail/psychology_ethics_dataset/',
                    name: 'psychology_ethics_dataset',
                    component: () => import('@/components/dataset/psychology_ethics_dataset.vue'),
                    props: true,
                },
                {
                    path: '/dataset_detail/sports_ethics_dataset/',
                    name: 'sports_ethics_dataset',
                    component: () => import('@/components/dataset/sports_ethics_dataset.vue'),
                    props: true,
                },
                {
                    path: '/dataset_detail/bioethics_dataset/',
                    name: 'bioethics_dataset',
                    component: () => import('@/components/dataset/bioethics_dataset.vue'),
                    props: true,
                },
                {
                    path:'/dataset_generate',
                    name:'dataset_generate',
                    component: () => import('@/components/dataset/DatasetGeneration.vue'),

                },
                {
                    path:'/redteam',
                    name:'redteam',
                    component: () => import('@/components/redteam/redteam.vue'),

                },
                {
                    path:'/redteammain',
                    name:'redteammain',
                    component: () => import('@/components/redteam/redteammain.vue'),

                },
                {
                    path:'/test',
                    name:'test',
                    component: () => import('@/components/redteam/test.vue'),

                },
                {
                    path:'/lgtmain',
                    name:'lgtmain',
                    component: () => import('@/components/Thirdpartyevaluation/lgtmain.vue'),

                },
                {
                    path:'/llm',
                    name:'llm',
                    component: () => import('@/components/Thirdpartyevaluation/llm.vue'),

                },
                {
                    path:'/dateset',
                    name:'dateset',
                    component: () => import('@/components/Thirdpartyevaluation/dateset.vue'),

                },
                {
                    path:'/keyword',
                    name:'keyword',
                    component: () => import('@/components/Thirdpartyevaluation/keyword.vue'),

                },
                {
                    path:'/task',
                    name:'task',
                    component: () => import('@/components/Thirdpartyevaluation/Task.vue'),

                },
                {
                    path:'/taskmanger',
                    name:'taskmanger',
                    component: () => import('@/components/Thirdpartyevaluation/Taskmanger.vue'),

                },
                {
                    path:'/lgt',
                    name:'lgt',
                    component: () => import('@/components/Thirdpartyevaluation/lgt.vue'),

                },
                {
                    path: '/rank_list',
                    name: 'rank_list',
                    component: () => import('@/components/EvaResultAll.vue')
                },
                {
                    path: '/evarank',
                    name: 'evaluation_rank',
                    component: () => import('@/components/rank/Rank_1.vue')
                },
                {
                    path: '/evarank2',
                    name: 'evaluation_rank2',
                    component: () => import('@/components/rank/Rank_2.vue')
                },
                {
                    path: '/evatask',
                    name: 'evaluation_task',
                    component: () => import('@/components/EvaTask.vue')
                },
            
            ]
        },
        {
            path: '/',
            redirect: '/main',
        },
        {
            path: '/login',
            name: 'LoginView',
            component: () => import('@/views/LoginView.vue')
        },
    ]
})

// 声明前置过滤
router.beforeEach((to, from, next) => {
    // 本地存储的sessionId
    // const sessionId = window.localStorage.getItem('sessionId');
    // // cookie中的sessionId
    // const cookieSessionId = getCookie("sessionId")
    //
    // if (to.path !== '/login' && sessionId !== cookieSessionId) {
    //     next({path: '/login'})
    // } else {
    //     next()
    // }
    // window.scrollTo(savedScrollPosition.value.x, savedScrollPosition.value.y);
    next()
})

router.afterEach(() => {
    const selection = window.getSelection()
    if (selection.rangeCount === 0) {
        return
    }

    const range = selection.getRangeAt(0)
    const {top, left} = range.getBoundingClientRect()
    const cursorPosition = {
        x: left,
        y: top + range.getBoundingClientRect().height,
    }

    savedScrollPosition.value = {x: cursorPosition.x, y: cursorPosition.y}
})

function getCookie(name) {
    const str_cookie = document.cookie;//获取cookie字符串
    const arr_cookie = str_cookie.split("; ");//分割
    //遍历匹配
    for (let i = 0; i < arr_cookie.length; i++) {
        const arr = arr_cookie[i].split("=");
        if (arr[0] == name) {
            return arr[1];
        }
    }
    return "";
}

export default router
