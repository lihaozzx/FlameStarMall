<template>
    <el-dialog title="用户信息" :visible.sync="dialogVisible" fullscreen :before-close="closeDialog" :modal="false">
        <div class="info_root">
            <div class="user_info" v-if="userInfo!=null">
                <div class="info_top">
                    <div class="user_head">
                        <img src="http://uu.scyouyou.com/public/logo/default_head.jpg" alt="">
                    </div>
                    <div class="user_details">
                        <p>姓名：<span>{{userInfo.fullname}}</span></p>
                        <p>昵称：<span>{{userInfo.nickname}}</span></p>
                        <p>电话：<span>{{userInfo.phone}}</span></p>
                        <p>积分：<span>{{userInfo.integral}}</span></p>
                    </div>
                </div>
                <div class="info_bottom">
                    <p>经销商：<span>{{userInfo.dealer}}</span></p>
                    <p>上次登录时间：<span>{{ft(userInfo.last_log_time)}}</span></p>
                    <p>上次登录IP：<span>{{userInfo.last_log_ip}}</span></p>
                    <p>注册时间：<span>{{ft(userInfo.reg_time)}}</span></p>
                </div>
            </div>
            <div class="border"></div>
            <div class="log">
                <div class="log_head">
                    <span class="title">订单详情</span>
                    <span class="more">更多>></span>
                </div>
                
                <el-table :data="logInfo" height="820" border style="width: 100%">
                    <el-table-column prop="trade_no" label="编号">
                    </el-table-column>
                    <el-table-column prop="content" label="详情">
                    </el-table-column>
                    <el-table-column prop="type" label="类型">
                    </el-table-column>
                    <el-table-column prop="pay" label="金额">
                    </el-table-column>
                    <el-table-column prop="pay_type" label="付款方式">
                        <template  slot-scope="scope">
                            <span>
                                {{scope.row.pay_type==1?'支付宝':'微信'}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dt" label="时间">
                        <template  slot-scope="scope">
                            <span>
                                {{ft(scope.row.dt)}}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
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
    import $api from '@/plugins/request';
    import $utils from '@/plugins/common';

    @Component
    export default class choseAdmin extends Vue {
        http!: $api;
        @Prop()
        dialogVisible!: boolean;
        @Prop()
        id!: string;
        @Watch('id')
        onIdChange() {
            this.getInfo();
        }
        userInfo: any = null;
        logInfo: any[] = [];

        created() {
            this.http = new $api();
        }
        closeDialog() {
            this.$emit('update:dialogVisible', false);
        }

        getInfo() {
            this.http.userInfo({
                id: this.id
            }).then((res: any) => {
                this.userInfo = res.data.userinfo;
                this.logInfo = res.data.log;
            })
        }
        ft(d: string) {
            return new $utils().formatTime(new Date(Number.parseInt(d) * 1000), '{y}-{m}-{d} {h}:{i}:{s}');
        }
    }
</script>
<style lang="scss" scoped>
    .el-dialog__body {
        padding-top: 0;
    }

    .info_root {
        width: 100%;
        min-width: 1200px;
        height: 860px;
        display: flex;

        .user_info {
            height: 100%;
            width: 50%;

            .info_top {
                width: 100%;
                height: 50%;
                display: flex;

                .user_head {
                    width: 40%;
                    height: 100%;
                    margin: 10px;
                    border-radius: 20px;
                    overflow: hidden;

                    img {
                        width: 100%;
                    }
                }

                .user_details {
                    margin-left: 5%;
                    width: 50%;
                    height: 100%;
                    box-sizing: border-box;
                    padding: 20px 0;
                    font-size: 24px;
                }
            }

            .info_bottom {
                width: 100%;
                height: 50%;
                font-size: 16px;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }
        }

        .border {
            width: 1px;
            height: 103%;
            background-color: rgb(100, 147, 237);
            margin-right: 2px;
        }

        .log {
            height: 100%;
            width: 50%;
            box-sizing: border-box;
            padding: 5px;
            background-color: #c47f7f;
            border-radius: 5px;
            .log_head{
                height: 30px;
                color: white;
                .title{
                    font-size: 22px;
                }
                .more{
                    float: right;
                    cursor: pointer;
                }
            }
        }
    }
</style>