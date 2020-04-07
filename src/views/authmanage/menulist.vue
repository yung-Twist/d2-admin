<template>
<d2-container >
    <template slot="header">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
    </template>
    <el-table :data="menulist" style="width: 100%;margin-bottom: 20px;" row-key="managerMenuId" border default-expand-all :tree-props="{children: 'child', hasChildren: 'hasChildren'}">
        <el-table-column prop="managerMenuName" label="菜单名称" sortable width="180">
        </el-table-column>
        <el-table-column prop="managerMenuOrder" label="排序">
        </el-table-column>
        <el-table-column prop="managerMenuPath" label="请求地址">
        </el-table-column>
        <el-table-column label="菜单类型">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.managerMenuType == 1">目录</el-tag>
                <el-tag v-if="scope.row.managerMenuType == 2" type="success">菜单</el-tag>
                <el-tag v-if="scope.row.managerMenuType == 3" type="info">按钮</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="状态">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.managerMenuStatus == 1">显示</el-tag>
                <el-tag v-if="scope.row.managerMenuStatus == 2" type="danger">隐藏</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="managerMenuAuthorityTab" label="权限标识">
        </el-table-column>
        <el-table-column prop="managerMenuIcon" label="图标">
        </el-table-column>
        <el-table-column prop="managerMenuParentId" label="父级ID">
        </el-table-column>
        <el-table-column prop="managerMenuCreateTime" label="创建时间">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelMenu(scope.row)">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    <template slot="footer">Footer</template>
    <!-- 新增弹出框 -->
    <el-dialog title="新增菜单" :visible.sync="dialogVisible" width="30%">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="上级菜单" prop="managerMenuParentId">
                <el-cascader
                    v-model="ruleForm.managerMenuParentId"
                    :options="options"
                    ref="managerMenuParentId"
                    name="managerMenuParentId"
                    :props="{ expandTrigger: 'hover',value: 'managerMenuId',label:'managerMenuName',children:'child',checkStrictly: true,emitPath:false }"
                ></el-cascader>
            </el-form-item>
            <el-form-item label="菜单名称" prop="managerMenuName">
                <el-input v-model="ruleForm.managerMenuName"></el-input>
            </el-form-item>
            <el-form-item label="菜单图标" prop="managerMenuIcon" >
                <d2-icon-select v-model="ruleForm.managerMenuIcon" :user-input="true"/>
            </el-form-item>
            <el-form-item label="菜单类型" prop="managerMenuType">
                <el-radio-group v-model="ruleForm.managerMenuType">
                    <el-radio :label="1">目录</el-radio>
                    <el-radio :label="2">菜单</el-radio>
                    <el-radio :label="3">按钮/接口</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="菜单排序" prop="managerMenuOrder">
                <el-input-number v-model="ruleForm.managerMenuOrder" :min="0" ></el-input-number>
            </el-form-item>
            <el-form-item label="路由地址" prop="managerMenuPath">
                <el-input v-model="ruleForm.managerMenuPath"></el-input>
            </el-form-item>
            <el-form-item label="权限标识" prop="managerMenuAuthorityTab">
                <el-input v-model="ruleForm.managerMenuAuthorityTab" placeholder="请输入权限标识" />
            </el-form-item>
            <el-form-item label="菜单状态" prop="managerMenuStatus">
                <el-radio-group v-model="ruleForm.managerMenuStatus">
                    <el-radio :label="1">显示</el-radio>
                    <el-radio :label="2">隐藏</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </span>
    </el-dialog>
</d2-container>
</template>

<script>
const defaultMenu = {
  managerMenuId: '',
  managerMenuName: '',
  managerMenuOrder: '',
  managerMenuPath: '',
  managerMenuType: '',
  managerMenuStatus: '',
  managerMenuAuthorityTab: '',
  managerMenuIcon: '',
  managerMenuParentId: ''
}
export default {
  name: 'menelist',
  data () {
    return {
      menulist: [],
      options: [
        {
          managerMenuId: '0',
          managerMenuName: '最顶级目录'
        }
      ],
      dialogVisible: false,
      ruleForm: Object.assign({}, defaultMenu),
      rules: {
        managerMenuName: [
          { required: true, message: '菜单名称', trigger: 'blur' }
        ],
        managerMenuParentId: [
          { required: true, message: '请选择上级菜单', trigger: 'blur' }
        ],
        managerMenuType: [
          { required: true, message: '请选择菜单类型', trigger: 'blur' }
        ],
        managerMenuPath: [
          { required: true, message: '请输入路由地址', trigger: 'blur' }
        ],
        managerMenuAuthorityTab: [
          { required: true, message: '请输入权限标识', trigger: 'blur' }
        ],
        managerMenuStatus: [
          { required: true, message: '请选择菜单状态', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getdata()
  },
  methods: {
    getdata () {
      this.$axios.post('/v1/admin/managerMenu/menuList', {}).then(res => {
        // console.log(res)
        this.menulist = res.data
        this.options = [
          {
            managerMenuId: '0',
            managerMenuName: '最顶级目录'
          }
        ]
        for (let item of res.data) {
          this.options.push(item)
        }
      })
    },
    handleAdd () {
      this.dialogVisible = true
    },
    // 提交表单
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          this.$axios.post('/v1/admin/managerMenu/add', this.ruleForm).then(res => {
            console.log(res)
            this.getdata()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除菜单
    handleDelMenu (row) {
      this.$confirm('确定要删除该条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.$axios.post('/v1/admin/managerMenu/del', { managerMenuId: row.managerMenuId }).then(res => {
          this.getdata()
          this.$message.success('删除成功')
        })
      })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.title-group {
    margin-top: 20px;
    margin-bottom: 10px;

    &:first-child {
        margin-top: 0px;
    }

    .title {
        margin: 0px;
    }

    .sub-title {
        margin: 0px;
        color: $color-text-sub;
        font-size: 10px;
    }
}
</style>
