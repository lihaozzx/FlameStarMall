<template>
    <div>
        <div class="head">
            <div class="search">
                <el-input placeholder="公司" v-model="search.company"></el-input>
            </div>
            <div class="search">
                <el-input placeholder="电话" v-model="search.phone"></el-input>
            </div>
            <div class="search">
                <el-input placeholder="姓名" v-model="search.name"></el-input>
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
                <el-table-column prop="company" label="店铺名称"></el-table-column>
                <el-table-column prop="address" label="所在地区"></el-table-column>
                <el-table-column prop="products" label="主营产品"></el-table-column>
                <el-table-column prop="name" label="联系人"></el-table-column>
                <el-table-column prop="phone" label="联系电话"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column prop="addtime" label="申请时间" sortable="custom"></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <span :style="scope.row.status==3?'color:red;cursor: pointer;':''" @click="seeRej(scope.row)">
                            {{scope.row.status==1?'待审核':scope.row.status==3?'未通过':scope.row.status==2?'已通过':''}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="reg_time" label="证件">
                    <template slot-scope="scope">
                        <span style="color: #26921c;cursor: pointer;" @click="seeZj(scope.row)">
                            查看证件
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status==1">
                            <el-button size="mini" type="primary" @click="approved(scope.row)">通过</el-button>
                            <el-button type="info" size="mini" @click="reject(scope.row)">驳回</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="foot_pagination">
            <el-pagination layout="prev, pager, next" :total="pageInfo.total" :page-size="pageInfo.limit"
                :current-page="pageInfo.nowPage" @current-change="pageChange"></el-pagination>
        </div>
        <el-dialog :visible.sync="dialogVisible" title="查看证件" width="70%">
            <div class="showImg">
                <div class="one_img">
                    <img :src="url + imgs.f" alt="" @click="newWindow($event)">
                    <span>身份证件</span>
                </div>
                <div class="one_img">
                    <img :src="url + imgs.t" alt="" @click="newWindow($event)">
                    <span>身份证件</span>
                </div>
                <div class="one_img">
                    <img :src="url + imgs.s" alt="" @click="newWindow($event)">
                    <span>营业执照</span>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {
        Component,
        Vue,
        Watch,
    } from 'vue-property-decorator';
    import $api, {
        imgUrl
    } from '@/plugins/request';
    import $utils from '@/plugins/common';
    import member from '@/views/index_child/member/User.vue';
    import changeDraler from '@/components/changeDealer.vue';
    import {
        Notification,
        MessageBox
    } from 'element-ui';

    class Applyy {
        address: string; //地址
        addtime: string; //申请时间
        area: string; //地区id？
        city: string; //市
        province: string; //省
        company: string; //公司名
        id: string;
        name: string; //联系人
        optdt: string;
        optid: string;
        optname: string;
        phone: string; //电话
        products: string; //产品
        rejected: string; //拒绝理由
        remark: string; //备注
        sfz_img: string; //身份证
        status: string; //1待审核 3未通过（拒绝） 2已通过 
        user_id: string;
        yyzz_img: string; //营业执照
        constructor(o: any) {
            this.address = o.address;
            this.addtime = o.addtime;
            this.area = o.area;
            this.city = o.city;
            this.company = o.company;
            this.id = o.id;
            this.name = o.name;
            this.optdt = o.optdt;
            this.optid = o.optid;
            this.optname = o.optname;
            this.phone = o.phone;
            this.products = o.products;
            this.province = o.province;
            this.rejected = o.rejected;
            this.remark = o.remark;
            this.sfz_img = o.sfz_img;
            this.status = o.status;
            this.user_id = o.user_id;
            this.yyzz_img = o.yyzz_img;
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
    export default class Apply extends Vue {
        http!: $api;
        url:string = imgUrl;
        tableData: Applyy[] = [];
        loads: any = {
            table: false
        }
        search: any = {
            company: '',
            phone: '',
            name: '',
            order: ''
        }
        dialogVisible: boolean = false;
        dialogVisible2: boolean = false;
        nowDid: string = '';
        nowshowid: string = '';
        timer: any = null;

        pageInfo: PageInfo = new PageInfo(0, 1, 0);

        imgs:any = {
            f:'',t:'',s:''
        }

        created() {
            this.http = new $api();
            this.getList();
        }

        getList() {
            this.loads.table = true;
            this.http.dealerApplyList({
                page: this.pageInfo.nowPage,
                name: this.search.name,
                company: this.search.company,
                order_by: this.search.order
            }).then((res: any) => {
                this.tableData = [];
                res.data.data.forEach((r: any) => {
                    this.tableData.push(new Applyy(r));
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
                company: '',
                phone: '',
                name: '',
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

        seeZj(row: Applyy) {
            this.dialogVisible = true;
            let imgs = row.sfz_img.split(',');
            this.imgs={
                f:imgs[0],
                t:imgs[1],
                s:row.yyzz_img
            }
        }
        newWindow(e:any){
            window.open(e.target.src,'_blank');
        }
        seeRej(row: Applyy) {
            MessageBox.confirm(row.rejected, '驳回理由', {
                confirmButtonText: '确定',
                showCancelButton: false,
                type: 'info',
                center: true
            }).catch(() => {

            })
        }
        approved(row: Applyy) {
            MessageBox.confirm('同意 ' + row.company + ' 的申请', '通过', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info',
                center: true,
            }).then((res: any) => {
                let liyou = res.value;
                this.http.approvedApply({
                    id: row.id,
                }).then((res: any) => {
                    this.getList();
                    Notification({
                        title: '成功',
                        dangerouslyUseHTMLString: true,
                        message: '<strong style="color:#3CB371">已通过申请</strong>',
                        showClose: false
                    });
                })
            })
        }
        reject(row: Applyy) {
            MessageBox.confirm('驳回 ' + row.company + ' 申请的理由', '驳回', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info',
                center: true,
                showInput: true,
                inputType: 'textarea'
            }).then((res: any) => {
                let liyou = res.value;
                this.http.rejectedApply({
                    id: row.id,
                    content: liyou
                }).then((res: any) => {
                    this.getList();
                    Notification({
                        title: '成功',
                        dangerouslyUseHTMLString: true,
                        message: '<strong style="color:#3CB371">已驳回申请</strong>',
                        showClose: false
                    });
                })
            })
        }

    }
</script>

<style lang="scss">
    .jujue {
        width: 350px;
        resize: none;
        height: 300px;
        font-size: 24px;
    }

    .showImg {
        width: 100%;
        height: 500px;
        display: flex;
        justify-content: space-between;

        .one_img {
            width: 30%;
            height: 100%;
            overflow: hidden;

            img {
                width: 100%;
            }
        }
    }

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