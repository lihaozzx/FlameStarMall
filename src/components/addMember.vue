<template>
    <el-dialog title="新增用户" :visible.sync="dialogVisible" width="50%" :before-close="closeDialog"
        :modal-append-to-body="false">
        <div class="role_root">
            <el-form label-width="200px" :rules="rules" ref="ruleForm" :model="ruleForm" status-icon>
                <el-form-item label="用户名" prop="username" autocomplete="off">
                    <el-input v-model="ruleForm.username" class="input_short" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone" autocomplete="off">
                    <el-input v-model="ruleForm.phone" class="input_short" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pass" autocomplete="off">
                    <el-input v-model="ruleForm.pass" class="input_short" placeholder="密码" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass" autocomplete="off">
                    <el-input v-model="ruleForm.checkPass" class="input_short" placeholder="确认密码" type="password">
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="saveMember">确 定</el-button>
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
        http!: $api;
        @Prop()
        dialogVisible!: boolean;
        ruleForm: any = {
            username: '',
            pass: '',
            checkPass: '',
            phone: ''
        }

        rules: any = {
            username: [{
                validator: this.validateName,
                trigger: 'blur'
            }],
            phone: [{
                validator: this.validatePhone,
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
        validatePhone(rule: any, value: any, callback: any) {
            if (value === '') {
                callback(new Error('请输入手机号'));
            } else if (!(/^1[3456789]\d{9}$/.test(value))) {
                callback(new Error('请输入正确的手机号'));
            } else {
                callback();
            }
        };

        created() {
            this.http = new $api();
        }
        closeDialog() {
            this.ruleForm = {
                name: '',
                phone: '',
                password: '',
                password_two: '',
            };
            this.$refs.ruleForm.resetFields();
            this.$emit('update:dialogVisible', false);
        }
        saveMember() {
            this.http.saveUser({
                nickname: this.ruleForm.username,
                phone: this.ruleForm.phone,
                password: this.ruleForm.pass,
                password_two: this.ruleForm.checkPass
            }).then((res: any) => {
                this.$emit('saveSuccess');
            })
        }
    }
</script>
<style lang="scss">
</style>