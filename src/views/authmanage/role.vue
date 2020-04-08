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
  managerRoleAuthority: '',
  managerRoleId: ''
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
      checkStrictly: true,
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
        this.$refs.tree.setCheckedKeys([])
      })
    },
    // 编辑
    handleEdit (row) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.ruleForm = row
      this.getEditPermission(row.managerRoleId)
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
      })
    },
    // 编辑获取权限集列表
    getEditPermission (managerRoleId) {
      this.$axios.post('/v1/admin/managerRole/edit', {
        isAssist: 1,
        managerRoleId: managerRoleId
      }).then(res => {
        this.permissinList = res.data.managerMenuList
        this.ruleForm.managerRoleName = res.data.managerRole.managerRoleName
        this.ruleForm.managerRoleId = res.data.managerRole.managerRoleId
        if (res.data.managerRole.managerRoleAuthority == 'ALL') {
          this.$refs.tree.setCheckedKeys([])
        } else {
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(
              JSON.parse(res.data.managerRole.managerRoleAuthority)
            )
          })
        }
      })
    },
    // 删除
    handleDelete (row) {
      this.$confirm('确定删除该角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.$axios.post('/v1/admin/managerRole/del', {
          managerRoleId: row.managerRoleId
        }).then(res => {
          this.getRoleList()
          this.$message.success('删除成功')
        })
      })
    },
    // 提交表单
    submitForm (formName) {
      let params = {
        managerRoleName: this.ruleForm.managerRoleName,
        managerRoleId: this.ruleForm.managerRoleId,
        managerRoleAuthority: JSON.stringify(this.$refs.tree.getCheckedKeys())
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogType == 'edit') {
            this.$axios.post('/v1/admin/managerRole/edit', params).then(res => {
              this.dialogVisible = false
              this.getRoleList()
              this.$message.success('修改成功')
            })
          } else {
            this.$axios.post('/v1/admin/managerRole/add', params).then(res => {
              this.dialogVisible = false
              this.getRoleList()
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
