<template>
    <div>
        <div class="head">
            <el-button type="primary" @click="addCategory">新增分类</el-button>
        </div>
        <div class="body_box">
            <el-table :data="showTable" v-loading="loads.table" style="width: 100%;margin-bottom: 20px;" row-key="id"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column prop="name" label="分类名称">
                </el-table-column>
                <el-table-column label="操作" align="center" width="240">
                    <template slot-scope="scope">
                        <div>
                            <el-button size="mini" type="primary" @click="addNext(scope.row)">添加下级</el-button>
                            <el-button size="mini" type="primary" @click="edit(scope.row)">编辑</el-button>
                            <el-button size="mini" type="danger" @click="del(scope.row)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :visible.sync="dialogVisible" title="新增分类" width="40%" :before-close="closeDialog">
            <el-form :model="form" label-width="80px">
                <el-form-item label="分类名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-input v-model="form.pid" placeholder="0为顶级分类" disabled></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="form.sort" placeholder="最优先为1，数字越大依次递减"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="saveCategory">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog :visible.sync="dialogVisible2" title="编辑分类" width="40%" :before-close="closeDialog2">
            <el-form :model="form2" label-width="80px">
                <el-form-item label="分类名称">
                    <el-input v-model="form2.name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-input v-model="form2.pid" placeholder="0为顶级分类" disabled></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model="form2.sort" placeholder="最优先为1，数字越大依次递减"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog2">取 消</el-button>
                <el-button type="primary" @click="changeCategory">确 定</el-button>
            </span>
        </el-dialog>
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

    @Component({
        components: {
            member,
            changeDraler
        }
    })
    export default class Apply extends Vue {
        http!: $api;
        tableData: any[] = [];
        loads: any = {
            table: false
        }
        dialogVisible: boolean = false;
        dialogVisible2: boolean = false;
        form: any = {
            name: '',
            pid: '',
            sort: '',
        }
        form2: any = {
            name: '',
            id: '',
            pid: '',
            sort: '',
        }
        get showTable() {
            let noch:any[]=[];
            
            let table: any[] = this.tableData;
            for (let i = 0; i < table.length; i++) {
                const t = table[i];
                if (t.children.length == 0) {
                    noch.push(...table.splice(i, 1));
                    i--;
                }
            }
            return [...table,...noch];
        }
        created() {
            this.http = new $api();
            this.getList();
        }

        closeDialog() {
            this.dialogVisible = false;
            this.form = {
                name: '',
                pid: '',
                sort: '',
            }
        }
        closeDialog2() {
            this.dialogVisible2 = false;
            this.form = {
                name: '',
                id: '',
                pid: '',
                sort: '',
            }
        }
        getList() {
            this.loads.table = true;
            this.http.goodsCategory().then((res: any) => {
                this.tableData = res.data;
                this.loads.table = false;
            })
        }
        addCategory() {
            this.dialogVisible = true;
            this.form = {
                name: '',
                pid: 0,
                sort: '',
            }
        }
        saveCategory() {
            this.http.addCategory(this.form).then((res: any) => {
                this.dialogVisible = false;
                Notification({
                    title: '成功',
                    dangerouslyUseHTMLString: true,
                    message: '<strong style="color:#3CB371">分类添加成功</strong>',
                    showClose: false
                });
                this.getList();
            })
        }
        changeCategory() {
            this.http.editCategory(this.form2).then((res: any) => {
                this.dialogVisible2 = false;
                Notification({
                    title: '成功',
                    dangerouslyUseHTMLString: true,
                    message: '<strong style="color:#3CB371">分类修改成功</strong>',
                    showClose: false
                });
                this.getList();
            })
        }
        addNext(row: any) {
            this.dialogVisible = true;
            this.form = {
                name: '',
                pid: row.id,
                sort: '',
            }
        }
        edit(row: any) {
            this.dialogVisible2 = true;
            this.form2 = {
                name: row.name,
                id: row.id,
                pid: row.pid,
                sort: row.sort,
            }
        }
        del(row: any) {
            MessageBox.confirm('确定删除 ' + row.name + ' 分类吗？删除后无法恢复', '驳回', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info',
                center: true,
            }).then((res: any) => {
                this.http.delCategory({
                    id: row.id
                }).then(() => {
                    Notification({
                        title: '成功',
                        dangerouslyUseHTMLString: true,
                        message: '<strong style="color:#3CB371">分类删除成功</strong>',
                        showClose: false
                    });
                    this.getList();
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