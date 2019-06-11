<template>
    <el-dialog :title="isadd?'新增管理员':'修改管理员'" :visible.sync="dialogVisible" width="50%" :before-close="closeDialog" :modal-append-to-body="false">
        <div class="role_root">
            <el-form label-width="200px" :rules="rules" ref="ruleForm" :model="ruleForm" status-icon>
                <el-form-item label="用户名" prop="username" autocomplete="off">
                    <el-input v-model="ruleForm.username" class="input_short" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pass" autocomplete="off">
                    <el-input v-model="ruleForm.pass" class="input_short" :placeholder="isadd?'密码':'不填则不修改'"
                        type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass" autocomplete="off">
                    <el-input v-model="ruleForm.checkPass" class="input_short" :placeholder="isadd?'确认密码':'不填则不修改'"
                        type="password">
                    </el-input>
                </el-form-item>
                <el-form-item label="拥有权限" autocomplete="off">
                    <el-radio-group v-model="ruleForm.role" size="small" class="radio_box">
                        <el-radio :label="r.id" border v-for="r in roles" :key="r.id" class="one_radio">
                            {{r.name}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="saveAdmin">确 定</el-button>
        </span>
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

    @Component
    export default class choseAdmin extends Vue {
        http: any = null;
        @Prop()
        dialogVisible!: boolean;
        @Prop()
        adminId!: string;
        @Prop()
        adminName!: string;
        isadd: boolean = false;
        ruleForm: any = {
            username: '',
            pass: '',
            checkPass: '',
            role: ''
        }

        rules: any = {
            username: [{
                validator: this.validateName,
                trigger: 'blur'
            }],
            pass: [{
                validator: this.validatePass,
                trigger: 'blur'
            }],
            checkPass: [{
                validator: this.validatePass2,
                trigger: 'blur'
            }]
        }
        roles: any[] = [];

        validateName(rule: any, value: any, callback: any) {
            if (value === '') {
                callback(new Error('请输入账号'));
            } else {
                callback();
            }
        };
        validatePass(rule: any, value: any, callback: any) {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.ruleForm.checkpass !== '') {
                    this.$refs.ruleForm.validateField('checkPass');
                }
                callback();
            }
        };
        validatePass2(rule: any, value: any, callback: any) {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm.pass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };

        @Watch('adminId')
        onIdChange(n: string) {
            this.getRole();
        }
        @Watch('adminName')
        onNameChange() {
            this.ruleForm.username = this.adminName;
        }
        created() {
            this.http = new $api();
            if (this.adminId === undefined) {
                //新增
                this.isadd = true;
            } else {
                this.ruleForm.username = this.adminName;
                this.getRole();
            }
            this.http.roleList().then((res: any) => {
                this.roles = res.data;
            })
        }
        getRole() {
            if (this.adminId != '') {
                this.http.adminRole({
                    id: this.adminId
                }).then((res: any) => {
                    res.data.forEach((role: any) => {
                        if (role.check === 1) {
                            this.ruleForm.role = role.id;
                        }
                    });
                })
            }

        }
        closeDialog() {
            this.ruleForm = {
                username: '',
                pass: '',
                checkPass: '',
                role: ''
            };
            this.$refs.ruleForm.resetFields();
            this.$emit('update:dialogVisible', false);
        }
        saveAdmin() {
            if (this.isadd) {
                this.http.saveAdmin({
                    username: this.ruleForm.username,
                    password: this.ruleForm.pass,
                    role: this.ruleForm.role,
                    password_two: this.ruleForm.checkPass
                }).then((res: any) => {
                    this.$emit('saveSuccess');
                })
            } else {
                this.http.editAdmin({
                    id: this.adminId,
                    username: this.ruleForm.username,
                    password: this.ruleForm.pass,
                    role: this.ruleForm.role,
                    password_two: this.ruleForm.checkPass
                }).then((res: any) => {
                    this.$emit('changeSuccess');
                })
            }

        }
    }
</script>
<style lang="scss">
    .role_root {
        height: 500px;
        overflow: auto;

        .input_short {
            width: 240px;
        }

        .radio_box {
            display: flex;
            flex-wrap: wrap;
            box-sizing: border-box;

            .one_radio {
                margin: 10px;
            }
        }
    }
    .role_root::-webkit-scrollbar {
		/*滚动条整体样式*/
		width: 10px;
		/*高宽分别对应横竖滚动条的尺寸*/
		height: 1px;
	}

	.role_root::-webkit-scrollbar-thumb {
		/*滚动条里面小方块*/
		border-radius: 10px;
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		background: #535353;
	}

	.role_root::-webkit-scrollbar-track {
		/*滚动条里面轨道*/
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		border-radius: 10px;
		background: #EDEDED;
	}
</style>