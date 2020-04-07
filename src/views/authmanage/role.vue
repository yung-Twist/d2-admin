<template>
<d2-container>
    <template slot="header">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="addRole">新增</el-button>
    </template>
    <el-table :data="rolesList" border>
        <el-table-column align="center" label="角色编号">
            <template slot-scope="scope">{{ scope.row.managerRoleId }}</template>
        </el-table-column>
        <el-table-column align="center" label="角色名称">
            <template slot-scope="scope">{{ scope.row.managerRoleName }}</template>
        </el-table-column>
        <el-table-column align="header-center" label="创建时间">
            <template slot-scope="scope">{{ scope.row.managerRoleCreateTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 新增编辑弹出框 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'添加'" width="600px">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" label-position="left">
            <el-form-item label="角色名" prop="managerRoleName">
                <el-input v-model="ruleForm.managerRoleName" placeholder="请输入角色名" />
            </el-form-item>
            <el-form-item label="权限集">
            <el-tree
                :data="permissinList"
                show-checkbox
                ref="tree"
                node-key="managerMenuAuthorityTab"
                :check-strictly="checkStrictly"
                :props="defaultProps">
            </el-tree>
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
const defaultData = {
  managerRoleName: '',
  managerRoleAuthority: ''
}
export default {
  name: 'Role',
  data () {
    return {
      rolesList: [],
      dialogVisible: false,
      ruleForm: Object.assign({}, defaultData),
      dialogType: '',
      permissinList: [],
      checkStrictly: false,
      defaultProps: {
        children: 'child',
        label: 'managerMenuName'
      },
      rules: {
        managerRoleName: [{
          required: true,
          message: '请输入角色名',
          trigger: 'blur'
        }]
      }
    }
  },
  mounted () {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    getRoleList () {
      this.$axios.post('/v1/admin/managerRole/roleList', {}).then(res => {
        // console.log(res)
        this.rolesList = res.data
      })
    },
    // 添加按钮
    addRole () {
      this.dialogType = 'new'
      this.dialogVisible = true
      this.ruleForm = Object.assign({}, defaultData)
      this.getPermission()
    },
    // 添加获取权限集列表
    getPermission () {
      this.$axios.post('/v1/admin/managerRole/add', {
        isAssist: 1
      }).then(res => {
        this.permissinList = res.data.managerMenuList
      })
    },
    // 编辑
    handleEdit (row) {},
    // 删除
    handleDelete (row) {},
    // 提交表单
    submitForm (formName) {
      let params = {
        managerRoleName: this.ruleForm.managerRoleName,
        managerRoleAuthority: this.$refs.tree.getCheckedKeys()
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogType == 'edit') {

          } else {
            this.$axios.post('/v1/admin/managerRole/add', params).then(res => {
              this.$message.success('添加成功')
              this.getRoleList()
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
