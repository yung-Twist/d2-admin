<template>
<div>

  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text">{{info.name ? `你好 ${info.name}` : '未登录'}}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="logOff">
        <d2-icon name="power-off" class="d2-mr-5"/>
        注销
      </el-dropdown-item>
      <el-dropdown-item @click.native="editPass">
        <d2-icon name="clock-o" class="d2-mr-5"/>
        修改密码
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
  <el-dialog :visible.sync="dialogVisible" title="修改密码" width="600px">
      <el-form
        :model="pwdGroup"
        :rules="pwdRules"
        ref="pwdGroup"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input type="password" v-model="pwdGroup.oldPwd" ref="oldPwd" name="oldPwd" placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input type="password" v-model="pwdGroup.newPwd" ref="newPwd" name="newPwd" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="重复新密码">
          <el-input type="password" v-model="resNewPwd" placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmPwd">确定</el-button>
      </div>
    </el-dialog>
</div>

</template>

<script>
import { mapState, mapActions } from 'vuex'
const defaultPwdGroup = {
  oldPwd: "",
  newPwd: ""
};
export default {
  
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能少于6位"));
      } else {
        callback();
      }
    };
    return {
      pwdGroup: {
        oldPwd: "",
        newPwd: ""
      },
      resNewPwd: "",
      pwdRules: {
        oldPwd: [
          { required: true, trigger: "blur", validator: validatePassword }
        ],
        newPwd: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      userName: window.localStorage.getItem("userName"),
      dialogVisible: false
    };
  },
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logout'
    ]),
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        confirm: true
      })
    },
    // 修改密码
    editPass(){
      this.dialogVisible = true
    },
    confirmPwd() {
      this.$refs.pwdGroup.validate(valid => {
        if (valid) {
          if (this.pwdGroup.newPwd === this.resNewPwd) {
            this.$axios.post("/v1/admin/common/changePwd", this.pwdGroup).then(
              res => {
                this.dialogVisible = false;
                this.pwdGroup = Object.assign({}, defaultPwdGroup);
                this.resNewPwd = "";
                this.$message.success("修改密码成功");
              }
            );
          } else {
            this.$message.error("密码输入不一致");
          }
        }
      });
    }
  }
}
</script>
