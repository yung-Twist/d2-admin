<template>
    <d2-container >
        <template slot="header">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
        </template>
        <el-table :data="rolesList" border >
          <el-table-column align="center" label="角色编号">
            <template slot-scope="scope">{{ scope.row.managerRoleId }}</template>
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
  managerRoleId: '',
  managerRoleName: '',
  managerRoleAuthority: ''
}
export default {
  name: 'Role',
  data () {
    return {
      rolesList: [],
      dialogType: '',
      ruleForm: Object.assign({}, defaultData),
      dialogVisible: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      rules: {
        managerRoleName: [{
          required: true,
          message: '请输入角色名',
          trigger: 'blur'
        }]
      },
      datalist: []
    }
  },
  mounted () {
    // this.getdata()
  },
  methods: {
    getdata () {
      this.$axios.post('/v1/admin/managerRole/roleList', {}).then(res => {
        console.log(res)
        this.datalist = res.data
      })
    },
    // 新增
    handleAdd () {
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
      })
      this.dialogType = 'new'
    },
    // 编辑
    handleEdit (row) {
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
      })
      this.dialogType = 'edit'
    },
    // 删除
    handleDelete (row) {
      this.$confirm('确定删除该角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // this.$axios.post('/v1/admin/managerRole/del', {
        //   managerRoleId: row.managerRoleId
        // }).then(res => {
        //   this.getRoleList()
        //   this.$message.success('删除成功')
        // })
      })
    },
    // 提交表单
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogType == 'edit') {

          } else {

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
