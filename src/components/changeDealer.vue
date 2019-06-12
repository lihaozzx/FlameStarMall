<template>
    <el-dialog :visible.sync="dialogVisible" fullscreen :before-close="closeDialog" :modal="false">
        <div slot="title">
            <el-radio-group v-model="showModel">
                <el-radio-button label="1">详细资料</el-radio-button>
                <el-radio-button label="2">修改资料</el-radio-button>
            </el-radio-group>
        </div>
        <div v-if="dealerInfo!=null" v-show="showModel=='1'" class="info_root">
            <!-- 详情  -->
            <div class="info">
                <div class="head">
                    <img :src="url+dealerInfo.head" alt="">
                </div>
                <div class="all">
                    <span>姓名：{{dealerInfo.name}}</span>
                    <span>公司名：{{dealerInfo.company}}</span>
                    <span>电话：{{dealerInfo.phone}}</span>
                    <span>余额：{{dealerInfo.balance}}</span>
                    <span>总金额：{{dealerInfo.money}}</span>
                    <span>公司地址：{{dealerInfo.address}}</span>
                    <span>上次登录时间：{{ft(dealerInfo.last_log_time)}}</span>
                    <span>注册时间：{{ft(dealerInfo.reg_time)}}</span>
                </div>
            </div>
            <div class="table_box">
                <div class="one_table">
                    <div class="log_head">
                        <span class="title">订单信息</span>
                        <span class="more">更多>></span>
                    </div>
                    <el-table :data="logInfo" height="590" border style="width: 100%">
                        <el-table-column prop="number" label="订单号">
                        </el-table-column>
                        <el-table-column prop="money" label="金额">
                        </el-table-column>
                        <el-table-column prop="pay_type" label="付款方式">
                            <template slot-scope="scope">
                                <span>
                                    {{scope.row.pay_type==1?'支付宝':'微信'}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="pay_time" label="时间">
                            <template slot-scope="scope">
                                <span>
                                    {{ft(scope.row.pay_time)}}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="one_table">
                    <div class="log_head">
                        <span class="title">会员信息</span>
                        <span class="more">更多>></span>
                    </div>
                    <el-table :data="usersInfo" height="590" border style="width: 100%">
                        <el-table-column prop="nickname" label="昵称">
                        </el-table-column>
                        <el-table-column prop="phone" label="电话">
                        </el-table-column>
                        <el-table-column prop="integral" label="积分">
                        </el-table-column>
                        <el-table-column prop="reg_time" label="注册时间">
                            <template slot-scope="scope">
                                <span>
                                    {{ft(scope.row.reg_time)}}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <div v-if="dealerInfo!=null" v-show="showModel=='2'" class="info_root">
            <!-- 修改  -->
            <div class="from_box">
                <div class="form_center">
                    <el-form :model="from" :rules="rules" ref="ruleForm" label-width="80px">
                        <el-form-item label="公司名称">
                            <el-input v-model="from"></el-input>
                        </el-form-item>
                        <el-form-item label="姓名">
                            <el-input v-model="from"></el-input>
                        </el-form-item>
                        <el-form-item label="快商通电脑端代码">
                            <el-input v-model="from"></el-input>
                        </el-form-item>
                        <el-form-item label="快商通手机端代码">
                            <el-input v-model="from"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </el-dialog>
</template>
<script lang="ts">
    import {
        Component,
        Vue,
        Watch,
        Prop,
        Emit
    } from 'vue-property-decorator';
    import $api,{imgUrl} from '@/plugins/request';
    import $utils from '@/plugins/common';

    @Component
    export default class choseAdmin extends Vue {
        http!: $api;
        url = imgUrl;
        @Prop()
        dialogVisible!: boolean;
        @Prop()
        id!: string;
        @Watch('id')
        onIdChange() {
            this.getInfo();
        }
        form:any = {

        }
        showModel: string = '1';
        dealerInfo: any = null;
        logInfo: any[] = [];
        usersInfo: any[] = [];

        created() {
            this.http = new $api();
        }
        closeDialog() {
            this.$emit('update:dialogVisible', false);
        }

        getInfo() {
            this.http.dealerInfo({
                id: this.id
            }).then((res: any) => {
                this.dealerInfo = res.data.dealer_info;
                this.logInfo = res.data.orders;
                this.usersInfo = res.data.users;
            })
        }
        ft(d: string) {
            return new $utils().formatTime(new Date(Number.parseInt(d) * 1000), '{y}-{m}-{d} {h}:{i}:{s}');
        }
    }
</script>
<style lang="scss">
    .el-dialog__body {
        padding-top: 0;
    }

    .info_root {
        width: 100%;
        min-width: 1200px;
        height: 860px;

        .info {
            width: 100%;
            border: 1px solid #8b8b8b;
            height: 200px;
            box-sizing: border-box;
            border-radius: 5px;
            padding: 10px;
            display: flex;

            .head {
                width: 10%;
                min-width: 120px;
                height: 100%;
                border-radius: 5px;
                overflow: hidden;

                img {
                    width: 100%;
                }
            }

            .all {
                width: 85%;
                margin-left: 5%;
                height: 100%;
                font-size: 20px;
                display: flex;
                flex-wrap: wrap;
                align-items: center;

                span {
                    width: 25%;
                    height: 30px;
                }
            }
        }

        .table_box {
            width: 100%;
            margin-top: 40px;
            height: calc(100% - 240px);
            display: flex;

            .one_table {
                width: 50%;
                box-sizing: border-box;
                padding: 0 10px;
                background-color: #c47f7f;
                border-radius: 5px;

                .log_head {
                    height: 20px;
                    color: white;

                    .title {
                        font-size: 16px;
                    }

                    .more {
                        float: right;
                        cursor: pointer;
                    }
                }
            }
        }

        .from_box {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;

            .form_center {
                width: 50%;
                height: 100%;

            }
        }
    }
</style>