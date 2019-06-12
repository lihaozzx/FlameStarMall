import Vue from 'vue';
import router from '../router';
import axios, {
	AxiosInstance
} from 'axios';
import $qs from 'qs';
import utils from '@/plugins/common'
import store from '../store'
const turl = process.env.NODE_ENV === 'development' ? '/test' : 'http://uu.scyouyou.com/admin.php';
export const imgUrl = 'http://uu.scyouyou.com/';
export default class extends Vue {
	token: string ;
	request: any = axios.create();
	url: string = turl;
	http: any = this.request;

	constructor() {
		super();
		this.token = store.getters.tokens;

		this.request.defaults.baseURL = this.url;
		this.request.defaults.timeout = 30000;
		this.request.defaults.headers.common['TOKEN'] = this.token;

		this.request.interceptors.response.use(function (response: any) {
			// 对响应数据做点什么
			if (response.status == 200) {
				if (response.data.code == 401) {
					// 1000表示token失效，重新登录
					Vue.prototype.$notify({
						title: '异常',
						dangerouslyUseHTMLString: true,
						iconClass: 'el-icon-warning',
						message: '<strong>登录状态已失效</strong>',
						showClose: false
					});
					new utils().delCookie('token');
					router.push({
						name: 'login'
					});
				} else {
					return response.data;
				}
			} else {
				Vue.prototype.$notify({
					title: '异常',
					dangerouslyUseHTMLString: true,
					iconClass: 'el-icon-warning',
					message: '<strong>服务器未响应，请稍后再试</strong>',
					showClose: false
				});
			}
		}, function (err: any) {
			// 对响应错误做点什么
			if (err && err.response) {
				switch (err.response.status) {
					case 400:
						err.message = '请求错误'
						break
					case 401:
						err.message = '未授权，请登录'
						break
					case 403:
						err.message = '拒绝访问'
						break
					case 404:
						Vue.prototype.$notify({
							title: '异常',
							dangerouslyUseHTMLString: true,
							iconClass: 'el-icon-warning',
							message: `<strong>请求地址出错: ${err.response.config.url}</strong>`,
							showClose: false
						});
						break
					case 408:
						err.message = '请求超时'
						break
					case 500:
						err.message = '服务器内部错误'
						break
					case 501:
						err.message = '服务未实现'
						break
					case 502:
						err.message = '网关错误'
						break
					case 503:
						err.message = '服务不可用'
						break
					case 504:
						err.message = '网关超时'
						break
					case 505:
						err.message = 'HTTP版本不受支持'
						break
					default:
				}
			}
			return Promise.reject(err)
		});
	}
	err(params: string): void {
		Vue.prototype.$notify({
			title: '异常',
			dangerouslyUseHTMLString: true,
			iconClass: 'el-icon-warning',
			message: '<strong style="color:red">' + params + '</strong>',
		});
	}
	getAuth(): Promise < any > {
		return new Promise((resolve, reject) => {
			this.request.post('/main/get_auth').then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	login(data = {}) {
		return new Promise((resolve, reject) => {
			this.request.post('/main/login', $qs.stringify(data)).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	roleList(data = {}) {
		return new Promise((resolve, reject) => {
			this.request.post('/admin/role_list', $qs.stringify(data)).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	logout(data = {}) {
		return new Promise((resolve, reject) => {
			this.request.post('/main/out_login', $qs.stringify(data)).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	editRole(data = {}) {
		return new Promise((resolve, reject) => {
			this.request.post('/admin/edit_role', $qs.stringify(data)).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	saveRole(data = {}) {
		return new Promise((resolve, reject) => {
			this.request.post('/admin/save_role', $qs.stringify(data)).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	delRole(data = {}) {
		return new Promise((resolve, reject) => {
			this.request.post('/admin/del_role', $qs.stringify(data)).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	adminList(data = {}) {
		return new Promise((resolve, reject) => {
			this.request.post('/admin/admin_list', $qs.stringify(data)).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	saveAdmin(data={}){
		return new Promise((resolve, reject) => {
			this.request.post('/admin/add_admin', $qs.stringify(data)).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	editAdmin(data={}){
		return new Promise((resolve, reject) => {
			this.request.post('/admin/edit_admin', $qs.stringify(data)).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	adminRole(data={}){
		return new Promise((resolve, reject) => {
			this.request.post('/admin/role', $qs.stringify(data)).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	delAdmin(data={}){
		return new Promise((resolve, reject) => {
			this.request.post('/admin/del_admin', $qs.stringify(data)).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	userList(data={}){
		return new Promise((resolve, reject) => {
			this.request.get('/user/user_list',{params:data}).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	userInfo(data={}){
		return new Promise((resolve, reject) => {
			this.request.post('/user/user_info',$qs.stringify(data)).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	saveUser(data={}){
		return new Promise((resolve, reject) => {
			this.request.post('/user/add_user',$qs.stringify(data)).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	
	editUser(data={}){
		return new Promise((resolve, reject) => {
			this.request.post('/user/edit_user',$qs.stringify(data)).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	delUser(data={}){
		return new Promise((resolve, reject) => {
			this.request.post('/user/del_user',$qs.stringify(data)).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	dealerList(data={}){
		return new Promise((resolve, reject) => {
			this.request.get('/dealer/dealer_list',{params:data}).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	dealerInfo(data={}){
		return new Promise((resolve, reject) => {
			this.request.post('/dealer/dealer_info',$qs.stringify(data)).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	dealerApplyList(data={}){
		return new Promise((resolve, reject) => {
			this.request.get('dealer/dealer_apply_list',{params:data}).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	rejectedApply(data={}){
		return new Promise((resolve, reject) => {
			this.request.post('/dealer/rejected',$qs.stringify(data)).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	approvedApply(data={}){
		return new Promise((resolve, reject) => {
			this.request.post('/dealer/approved',$qs.stringify(data)).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	goodsCategory(data={}){
		return new Promise((resolve, reject) => {
			this.request.post('/goods/category',$qs.stringify(data)).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	addCategory(data={}){
		return new Promise((resolve, reject) => {
			this.request.post('/goods/add_category',$qs.stringify(data)).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	editCategory(data={}){
		return new Promise((resolve, reject) => {
			this.request.post('/goods/edit_category',$qs.stringify(data)).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	delCategory(data={}){
		return new Promise((resolve, reject) => {
			this.request.post('/goods/del_category',$qs.stringify(data)).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	BrandList(data={}){
		return new Promise((resolve, reject) => {
			this.request.get('/goods/brand_list',{params:data}).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	
	
	
	








	exportOrders(data={}){
		return new Promise((resolve, reject) => {
			this.request.post('orders/export_orders',$qs.stringify(data)).then((res: any) => {
				if (res.code === 200) {
					resolve(res);
				} else {
					this.err(res.msg);
					reject(res);
				}
			})
		})
	}
	
}