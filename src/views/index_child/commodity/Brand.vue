<template>
    <div>
        <div class="head" v-show="editing==1">
            <div class="search">
                <el-input placeholder="品牌名称" v-model="search.name"></el-input>
            </div>
            <el-button class="btn" @click="searchFun">搜索</el-button>
            <el-button @click="searchEmpty">清空</el-button>
            <el-button type="primary" @click="editing = 3"><i class="el-icon-plus">添加新品牌</i></el-button>
        </div>
        <div class="body_box" v-show="editing==1">
            <el-table :data="tableData" class="table" v-loading="loads.table" @sort-change="tableSort">
                <el-table-column label="序号" width="50">
                    <template slot-scope="scope">
                        <div>
                            {{scope.$index+1}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="品牌名称"></el-table-column>
                <el-table-column label="品牌网址">
                    <template slot-scope="scope">
                        <a :href="scope.row.url" target="_blank">{{scope.row.url}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="品牌logo">
                    <template slot-scope="scope">
                        <div class="img_logo">
                            <img :src="url+scope.row.logo" alt="">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="显示排序"></el-table-column>
                <el-table-column label="是否推荐" align="center">
                    <template slot-scope="scope">
                        <span>
                            {{scope.row.is_recommend==1?'推荐':'不推荐'}}
                            <el-button icon="el-icon-search" circle @click="changwreco"></el-button>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <div>
                            <el-button size="mini" type="primary" @click="changeBrand(scope.row)"><i
                                    class="el-icon-edit-outline"></i>编辑</el-button>
                            <el-button type="danger" size="mini" @click="delBrand(scope.row)"><i
                                    class="el-icon-delete-solid"></i>删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="foot_pagination" v-show="editing==1">
            <el-pagination layout="prev, pager, next" :total="pageInfo.total" :page-size="pageInfo.limit"
                :current-page="pageInfo.nowPage" @current-change="pageChange"></el-pagination>
        </div>

        <div class="body_box" v-if="editing==2">
            <el-button size="mini" type="primary" @click="editing=1">返回</el-button>
            <div class="edit_box">
                <el-form :model="form" label-width="180px">
                    <el-form-item label="品牌名称">
                        <el-col :span="12">
                            <el-input v-model="form.name"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="网址">
                        <el-col :span="12">
                            <el-input v-model="form.url"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="LOGO">
                        <el-col :span="12">
                            <img class="loge_img" v-if="form.loge" :src="url + form.loge" @click="changeLogo">
                        </el-col>
                    </el-form-item>
                    <el-form-item label="品牌分类">
                        <el-checkbox-group v-model="form.cates">
                            <el-checkbox v-for="c in cateData" :label="c.id" :key="c.id">{{c.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="品牌简介">
                        <vue-ueditor-wrap v-model="form.msg" :config="myConfig"></vue-ueditor-wrap>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="mini" type="primary" @click="saveBrand">保存</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-dialog :visible.sync="dialogVisible2" title="上传LOGO" width="40%" center>
                <div class="upload_box">
                    <el-upload class="upload-demo" drag action="w" multiple :before-upload="uploadLogo">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </div>
            </el-dialog>
        </div>

        <div class="body_box" v-if="editing==3">
            <el-button size="mini" type="primary" @click="editing=1">返回</el-button>
            <div class="edit_box">
                <el-form :model="addform" label-width="180px">
                    <el-form-item label="品牌名称">
                        <el-col :span="12">
                            <el-input v-model="addform.name"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="网址">
                        <el-col :span="12">
                            <el-input v-model="addform.url"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="LOGO">
                        <el-col :span="12">
                            <img class="loge_img" v-if="addform.loge" :src="url + addform.loge" @click="changeLogo">
                            <el-upload v-else drag action="w" multiple :before-upload="uploadaddLogo">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            </el-upload>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="品牌分类">
                        <el-checkbox-group v-model="addform.cates">
                            <el-checkbox v-for="c in cateData" :label="c.id" :key="c.id">{{c.name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="品牌简介">
                        <vue-ueditor-wrap v-model="addform.msg" :config="myConfig"></vue-ueditor-wrap>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="mini" type="primary" @click="addBrand">保存</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
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
    import {
        Notification,
        MessageBox
    } from 'element-ui';

    import VueUeditorWrap from 'vue-ueditor-wrap';

    class Brandd {
        cids: string;
        content: string;
        id: string;
        is_recommend: string;
        logo: string;
        name: string;
        sort: string;
        url: string;
        constructor(o: any) {
            this.cids = o.cids;
            this.content = o.content;
            this.id = o.id;
            this.is_recommend = o.is_recommend;
            this.logo = o.logo;
            this.name = o.name;
            this.sort = o.sort;
            this.url = o.url;
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
            VueUeditorWrap
        }
    })
    export default class Brand extends Vue {
        http!: $api;
        url: string = imgUrl;
        tableData: Brandd[] = [];
        loads: any = {
            table: false
        }
        search: any = {
            name: '',
        }
        dialogVisible: boolean = false;
        dialogVisible2: boolean = false;
        editing: number = 1;
        nowDid: string = '';
        nowshowid: string = '';
        timer: any = null;
        cateData: any[] = [];
        form: any = {
            cates: [],
            name: '',
            url: '',
            loge: '',
            msg: '',
        }
        addform: any = {
            cates: [],
            name: '',
            url: '',
            loge: '',
            msg: '',
        }


        myConfig: any = {
            // 编辑器不自动被内容撑高
            autoHeightEnabled: false,
            // 初始容器高度
            initialFrameHeight: 400,
            // 初始容器宽度
            initialFrameWidth: '99%',
            // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
            serverUrl: 'http://35.201.165.105:8000/controller.php',
        }
        pageInfo: PageInfo = new PageInfo(0, 1, 0);


        created() {
            this.http = new $api();
            this.getList();
            this.http.brandInfo().then((res: any) => {
                this.cateData = res.data.category
            })
        }

        getList() {
            this.loads.table = true;
            this.http.BrandList({
                page: this.pageInfo.nowPage,
                name: this.search.name,
            }).then((res: any) => {
                this.tableData = [];
                res.data.data.forEach((r: any) => {
                    this.tableData.push(new Brandd(r));
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


        uploadaddLogo(file: any) {
            let fd = new FormData();
            fd.append('fileToUpload', file);
            this.http.uploadLogo(fd).then((res: any) => {
                Notification({
                    title: '成功',
                    dangerouslyUseHTMLString: true,
                    message: '<strong style="color:#3CB371">上传成功</strong>',
                    showClose: false
                });
                this.addform.loge = res.data.url;
            })
            return false;
        }
        uploadLogo(file: any) {
            let fd = new FormData();
            fd.append('fileToUpload', file);
            this.http.uploadLogo(fd).then((res: any) => {
                Notification({
                    title: '成功',
                    dangerouslyUseHTMLString: true,
                    message: '<strong style="color:#3CB371">上传成功</strong>',
                    showClose: false
                });
                this.form.loge = res.data.url;
                this.dialogVisible2 = false;
            })
            return false;
        }
        changeBrand(row: Brandd) {
            this.form = {
                id: row.id,
                cates: row.cids == '' ? [] : JSON.parse(row.cids),
                name: row.name,
                url: row.url,
                loge: row.logo,
                msg: row.content,
                isre: row.is_recommend
            }
            this.editing = 2;
        }
        saveBrand() {
            this.http.editBrand({
                id: this.form.id,
                name: this.form.name,
                url: this.form.url,
                logo: this.form.loge,
                content: this.form.msg,
                is_recommend: this.form.isre,
                cids: JSON.stringify(this.form.cates),
            }).then((res: any) => {
                this.getList();
                this.editing = 1;
                Notification({
                    title: '成功',
                    dangerouslyUseHTMLString: true,
                    message: '<strong style="color:#3CB371">修改成功</strong>',
                    showClose: false
                });
                this.form = {
                    id: '',
                    cates: '',
                    name: '',
                    url: '',
                    loge: '',
                    msg: '',
                    isre: '',
                }
            })
        }
        addBrand() {
            this.http.addBrand({
                name: this.addform.name,
                url: this.addform.url,
                logo: this.addform.loge,
                content: this.addform.msg,
                cids: JSON.stringify(this.addform.cates),
            }).then((res: any) => {
                this.getList();
                this.editing = 1;
                Notification({
                    title: '成功',
                    dangerouslyUseHTMLString: true,
                    message: '<strong style="color:#3CB371">修改成功</strong>',
                    showClose: false
                });
                this.addform = {
                    id: '',
                    cates: '',
                    name: '',
                    url: '',
                    loge: '',
                    msg: '',
                    isre: '',
                }
            })
        }
        changeLogo() {
            this.dialogVisible2 = true;
        }
        delBrand(row:Brandd) {
            MessageBox.confirm('确定要删除‘ ' + row.name + ' ’这个品牌吗？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info',
            }).then(() => {
                this.http.delBrand({
                    id: row.id,
                }).then((res: any) => {
                    this.getList();
                    Notification({
                        title: '成功',
                        dangerouslyUseHTMLString: true,
                        message: '<strong style="color:#3CB371">删除成功</strong>',
                        showClose: false
                    });
                })
            })
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

        .img_logo {
            height: 140px;

            img {
                height: 100%;
            }
        }

        .edit_box {
            width: 90%;
            margin-left: 1%;

            .loge_img {
                width: 200px;
                cursor: pointer;
            }
        }

        .upload_box {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
</style>