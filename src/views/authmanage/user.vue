<template>
    <d2-container >
        <template slot="header">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-if="$store.state.d2admin.menu.managerRoleAuthority.has('/admin/manager/add')">新增</el-button>
        </template>
        <el-table :data="datalist" border >
          <el-table-column align="center" label="用户名">
            <template slot-scope="scope">{{ scope.row.managerUserName }}</template>
          </el-table-column>
          <el-table-column align="center" label="姓名">
            <template slot-scope="scope">{{ scope.row.managerName }}</template>
          </el-table-column>
          <el-table-column align="center" label="手机">
            <template slot-scope="scope">{{ scope.row.managerPhoneNumber }}</template>
          </el-table-column>
          <el-table-column align="center" label="角色名">
            <template slot-scope="scope">{{ scope.row.managerRoleName }}</template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <el-tooltip
                effect="dark"
                :content="scope.row.managerStatus == 1 ? '启用' : '关闭'"
                placement="top"
              >
                <el-switch
                  @change="changestatus(scope.row)"
                  v-model="scope.row.managerStatus"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="2"
                  :disabled="scope.row.managerId == 1 || $store.state.d2admin.menu.managerRoleAuthority.has('/admin/manager/changeStatus')"
                ></el-switch>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" label="注册时间">
            <template slot-scope="scope">{{ scope.row.managerCreateTime }}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="300">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row)" v-if="$store.state.d2admin.menu.managerRoleAuthority.has('/admin/manager/edit')">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)" v-if="$store.state.d2admin.menu.managerRoleAuthority.has('/admin/manager/del')">删除</el-button>
                <el-button type="success" icon="el-icon-refresh" size="mini" @click="resetpwd(scope.row)" v-if="$store.state.d2admin.menu.managerRoleAuthority.has('/admin/manager/resetPwd')">重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 新增编辑弹出框 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'添加'" width="600px">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" label-position="left">
            <el-form-item label="用户名" prop="managerUserName">
                <el-input v-model="ruleForm.managerUserName" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="密码" prop="managerPassword" v-if="dialogType == 'new'">
                <el-input v-model="ruleForm.managerPassword" placeholder="请输入密码" />
            </el-form-item>
            <el-form-item label="姓名" prop="managerName">
                <el-input v-model="ruleForm.managerName" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="手机号" prop="managerPhoneNumber">
                <el-input v-model="ruleForm.managerPhoneNumber" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="角色" prop="managerRoleId">
              <el-select v-model="ruleForm.managerRoleId" placeholder="请选择角色">
                <el-option
                  v-for="item in rolesList"
                  :key="item.managerRoleId"
                  :label="item.managerRoleName"
                  :value="item.managerRoleId"
                ></el-option>
              </el-select>
            </el-form-item>
        </el-form>
        <div style="text-align:right;">
            <el-button type="danger" @click="dialogVisible=false">取消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        </div>
    </el-dialog>
        <template slot="footer">Footer</template>
    </d2-container>
</template>

<script>
import validate from '@/utils/validate'
const defaultData = {
  managerUserName: '',
  managerPassword: '',
  managerName: '',
  managerPhoneNumber: '',
  managerRoleId: '',
  managerId: ''
}
export default {
  name: 'Role',
  data () {
    return {
      rolesList: [],
      dialogType: '',
      ruleForm: Object.assign({}, defaultData),
      dialogVisible: false,
      rules: {
        managerUserName: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        managerPassword: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }],
        managerName: [{
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        }],
        managerRoleId: [{
          required: true,
          message: '请选择用户角色',
          trigger: 'change'
        }],
        managerPhoneNumber: [{ validator: validate.validatePhone, trigger: 'blur' }]
      },
      listQuery: {
        managerUserName: '',
        managerRoleId: '',
        managerStatus: '',
        managerPhoneNumber: ''
      },
      datalist: []
    }
  },
  mounted () {
    this.getdata()
  },
  methods: {
    // 获取数据
    getdata () {
      this.$axios.post('/v1/admin/manager/managerList', this.listQuery).then(res => {
        this.datalist = res.data.data
        // console.log(res)
      })
    },
    // 修改状态
    changestatus (row) {
      // console.log(row.managerStatus)
      if (row.managerId === 1) {
        this.$message.error('无法对超级管理员进行操作')
      } else {
        this.$axios.post('/v1/admin/manager/changeStatus', {
          managerStatus: row.managerStatus,
          managerId: row.managerId
        }).then(res => {
          this.getdata()
        })
      }
    },
    // 新增
    handleAdd () {
      this.ruleForm = Object.assign({}, defaultData)
      this.dialogType = 'new'
      this.dialogVisible = true
      this.getAddAssistdata()
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    // 获取新增辅助数据
    getAddAssistdata () {
      this.$axios.post('/v1/admin/manager/add', { isAssist: 1 }).then(res => {
        // console.log(res)
        this.rolesList = res.data.managerRoleList
      })
    },
    // 编辑
    handleEdit (row) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.getEditAssistdata(row.managerId)
    },
    // 获取编辑辅助数据
    getEditAssistdata (managerId) {
      this.$axios.post('/v1/admin/manager/edit', { isAssist: 1, managerId: managerId }).then(res => {
        this.rolesList = res.data.managerRoleList
        this.ruleForm = res.data.manager
        // console.log(res)
      })
    },
    // 删除
    handleDelete (row) {
      this.$confirm('确定删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.$axios.post('/v1/admin/manager/del', {
          managerId: row.managerId
        }).then(res => {
          this.getdata()
          this.$message.success('删除成功')
        })
      })
    },
    // 重置密码
    resetpwd (row) {
      this.$prompt('请输入新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.$axios.post('/v1/admin/manager/resetPwd', {
          managerId: row.managerId,
          managerPassword: value
        }).then(res => {
          this.$message.success('重置密码成功')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    // 提交表单
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogType == 'edit') {
            // console.log(this.ruleForm)
            this.$axios.post('/v1/admin/manager/edit', this.ruleForm).then(res => {
              this.getdata()
              this.dialogVisible = false
              this.$message.success('修改成功')
            })
          } else {
            this.$axios.post('/v1/admin/manager/add', this.ruleForm).then(res => {
              this.getdata()
              this.dialogVisible = false
              this.$message.success('添加成功')
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
