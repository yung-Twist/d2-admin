<template>
    <d2-container >
        <template slot="header">
            <el-button type="primary" icon="el-icon-plus" size="mini" >新增</el-button>
        </template>
        <el-table :data="rolesList" border >
      <!-- <el-table-column align="center" label="角色编号">
        <template slot-scope="scope">{{ scope.row.managerRoleId }}</template>
      </el-table-column> -->
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
        <template slot="footer">Footer</template>
    </d2-container>
</template>

<script>
export default {
  name: 'Role',
  data () {
    return {
      rolesList: []
    }
  },
  mounted () {
    // this.getRoleList()
  },
  methods: {
    // 获取角色列表
    getRoleList () {
      this.$axios.post('/v1/admin/managerRole/roleList', {}).then(res => {
        console.log(res)
        this.rolesList = res.data
      })
    },
    // 编辑
    handleEdit (row) {},
    // 删除
    handleDelete (row) {}
  }
}
</script>

<style lang='scss' scoped>

</style>
