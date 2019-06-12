import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
	routes: [{
			path: '/',
			component: () => import( /* webpackChunkName: "index" */ '@/views/Index.vue'),
			children: [{
				path: '/',
				name: 'index',
				components: {
					indes: () => import( /* webpackChunkName: "home" */ '@/views/index_child/Home.vue'),
					//管理员中心
					role_list: () => import( /* webpackChunkName: "role_list" */ '@/views/index_child/manage/Role.vue'),
					admin_list:()=> import( /* webpackChunkName: "admin_list" */ '@/views/index_child/manage/Admin.vue'),
					//会员管理
					user_list:()=> import( /* webpackChunkName: "user_list" */ '@/views/index_child/member/User.vue'),
					//商品管理
					category:()=> import( /* webpackChunkName: "category" */ '@/views/index_child/commodity/Category.vue'),
					brand_list:()=> import( /* webpackChunkName: "brand" */ '@/views/index_child/commodity/Brand.vue'),
					//供应商管理
					dealer_list:()=> import( /* webpackChunkName: "dealer_list" */ '@/views/index_child/dealer/List.vue'),
					dealer_apply_list:()=> import( /* webpackChunkName: "dealer_apply_list" */ '@/views/index_child/dealer/Apply.vue'),
				}
			}],
			meta: {
				title: '侑侑商城后台管理'
			}
		},
		{
			path: '/login',
			name: 'login',
			component: () => import( /* webpackChunkName: "Login" */ '@/views/Login.vue')
		},
	],
});