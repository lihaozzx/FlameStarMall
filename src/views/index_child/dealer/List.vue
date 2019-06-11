<template>
	<div>
		<div class="head">
			<div class="search">
				<el-input placeholder="经销商" v-model="search.name"></el-input>
			</div>
			<div class="search">
				<el-input placeholder="公司" v-model="search.phone"></el-input>
			</div>
			<el-button class="btn" @click="searchFun">搜索</el-button>
			<el-button @click="searchEmpty">清空</el-button>
		</div>
		<div class="body_box">
			<el-table :data="tableData" class="table" v-loading="loads.table" @sort-change="tableSort">
				<el-table-column label="序号" width="50">
					<template slot-scope="scope">
						<div>
							{{scope.$index+1}}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="company" label="公司"></el-table-column>
				<el-table-column prop="name" label="经销商"></el-table-column>
				<el-table-column prop="phone" label="电话"></el-table-column>
				<el-table-column prop="reg_time" label="注册时间" sortable="custom"></el-table-column>
				<!-- <el-table-column prop="status" label="用户状态" width="100" align="center"></el-table-column> -->
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<div>
							<el-tooltip class="item" effect="dark" content="查看会员" placement="top-start">
								<el-button size="mini" class="mini" type="primary" @click="seeMember(scope.row)">
									<i class="el-icon-search"></i>
								</el-button>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="查看订单" placement="top-start">
								<el-button type="info" size="mini" class="mini">
									<i class="el-icon-s-shop"></i>
								</el-button>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="查看销量" placement="top-start">
								<el-button type="primary" size="mini" class="mini">
									<i class="el-icon-search"></i>
								</el-button>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
								<el-button type="warning" size="mini" @click="changeDealer(scope.row)" class="mini">
									<i class="el-icon-edit"></i>
								</el-button>
							</el-tooltip>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="foot_pagination">
			<el-pagination layout="prev, pager, next" :total="pageInfo.total" :page-size="pageInfo.limit"
				:current-page="pageInfo.nowPage" @current-change="pageChange"></el-pagination>
		</div>
		<el-dialog :visible.sync="dialogVisible" fullscreen :modal="false">
			<member :did='nowDid'></member>	
		</el-dialog>	
		<change-draler :dialogVisible.sync="dialogVisible2" :id="nowshowid"></change-draler>
	</div>
</template>

<script lang="ts">
	import {
		Component,
		Vue,
		Watch,
	} from 'vue-property-decorator';
	import $api from '@/plugins/request';
	import $utils from '@/plugins/common';
	import member from '@/views/index_child/member/User.vue';
	import changeDraler from '@/components/changeDealer.vue';
	import {
		Notification,
		MessageBox
	} from 'element-ui';

	class Dealerr {
		id: number; //id
		name: string;//经销商
		company: string;//公司
		phone: string;//电话
		reg_time: string;//注册时间
		status: string;//状态
		constructor(o: any) {
			this.id = o.id;
			this.name = o.name;
			this.company = o.company;
			this.phone = o.phone;
			this.reg_time =new $utils().formatTime(new Date(Number.parseInt(o.reg_time)*1000),'{y}-{m}-{d} {h}:{i}:{s}');
			this.status = o.status;
		}
	}
	class PageInfo {
		limit: number;
		nowPage: number;
		total: number;
		constructor(total: number, now: number, limit: number) {
			this.total = total;
			this.nowPage = now;
			this.limit = limit;
		}
	}

	@Component({
		components: {
			member,
			changeDraler
		}
	})
	export default class Dealer extends Vue {
		http!: $api;
		tableData: Dealerr[] = [];
		loads: any = {
			table: false
		}
		search: any = {
			name: '',
			company: '',
			order: ''
		}
		dialogVisible: boolean = false;
		dialogVisible2: boolean = false;
		nowDid:string = '';
		nowshowid:string='';
		timer: any = null;

		pageInfo: PageInfo = new PageInfo(0, 1, 0);

		created() {
			this.http = new $api();
			this.getList();
		}

		getList() {
			this.loads.table = true;
			this.http.dealerList({
				page: this.pageInfo.nowPage,
				name: this.search.name,
				company: this.search.company,
				order_by: this.search.order
			}).then((res: any) => {
				this.tableData = [];
				res.data.data.forEach((r: any) => {
					this.tableData.push(new Dealerr(r));
				});
				this.setPage(res.data);
				this.loads.table = false;
			})
		}
		setPage(data: any) {
			this.pageInfo = new PageInfo(data.total_rows, data.page, data.limit);
		}
		pageChange(p: number) {
			if (this.timer != null) {
				clearTimeout(this.timer);
			}
			return this.timer = setTimeout(() => {
				this.pageInfo.nowPage = p;
				this.getList();
			}, 300);
		}
		searchFun() {
			this.getList();
		}
		searchEmpty() {
			if (this.search.name == '' && this.search.phone == '') return;
			this.search = {
				name: '',
				company: '',
				order: this.search.order
			}
			this.getList();
		}
		tableSort(val: any) {
			if (val.order !== null) {
				if (val.order === 'descending') { //dese
					this.search.order = '["' + val.prop + '","desc"]';
				} else { //ase
					this.search.order = '["' + val.prop + '","asc"]';
				}
			} else {
				this.search.order = '';
			}
			this.getList();
		}

		seeMember(row: Dealerr){
			this.dialogVisible=true;
			this.nowDid = row.id+'';
		}

		successFun(k: string) {
			Notification({
				title: '成功',
				dangerouslyUseHTMLString: true,
				message: '<strong style="color:#3CB371">' + k + '成功</strong>',
				showClose: false
			});
			this.dialogVisible2 = this.dialogVisible = false;
			this.getList();
		}
		changeDealer(row: Dealerr) {
			this.dialogVisible2 = true;
			this.nowshowid = row.id+'';
		}
	}
</script>

<style lang="scss">
	.head {
		display: flex;

		.search {
			width: 240px;
			display: inline-block;
			margin-right: 10px;
		}

		.btn {
			background-color: rgb(85, 85, 85);
			color: white;
		}

		.btn:hover {
			background-color: rgb(105, 105, 105);
			color: white;
		}
	}

	.body_box {
		height: 90%;
		overflow: auto;

		.table {
			width: 100%;
		}

		.mini {
			padding: 5px 2px;
		}
	}

	.body_box::-webkit-scrollbar {
		/*滚动条整体样式*/
		width: 10px;
		/*高宽分别对应横竖滚动条的尺寸*/
		height: 1px;
	}

	.body_box::-webkit-scrollbar-thumb {
		/*滚动条里面小方块*/
		border-radius: 10px;
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		background: #535353;
	}

	.body_box::-webkit-scrollbar-track {
		/*滚动条里面轨道*/
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		border-radius: 10px;
		background: #EDEDED;
	}
</style>