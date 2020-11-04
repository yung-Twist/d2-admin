<template>
  <d2-container>
    <template slot="header">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="addCategory" v-if="$store.state.d2admin.menu.managerRoleAuthority.has('/admin/productCategory/add')">新增</el-button>
    </template>
    <el-table :data="dataList" border>
      <el-table-column prop="categoryName" label="分类名称"></el-table-column>
      <el-table-column prop="categoryId" label="分类id"></el-table-column>
      <el-table-column prop="categoryOrder" label="排序"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleEdit(scope.row)"
            v-if="$store.state.d2admin.menu.managerRoleAuthority.has('/admin/productCategory/edit')"
          >编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDel(scope.row)"
            v-if="$store.state.d2admin.menu.managerRoleAuthority.has('/admin/productCategory/del')"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增弹出框 -->
    <el-dialog :title="edittitle" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="名称" prop="categoryName">
          <el-input v-model="ruleForm.categoryName"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="ruleForm.categoryOrder"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <template slot="footer">Footer</template> -->
  </d2-container>
</template>

<script>
const defaultForm = {
  categoryName: "",
  categoryOrder: ""
};
export default {
  name: "CategoryList",
  data() {
    return {
      listQuery: {
        limit: 10,
        page: 1
      },
      dataList: [],
      ruleForm: Object.assign({}, defaultForm),
      rules: {
        categoryName: [
          {
            required: true,
            message: "请输入消息标题",
            trigger: "blur"
          }
        ],
        categoryIconId: [
          {
            required: true,
            message: "请上传分类图片",
            trigger: "blur"
          }
        ]
      },
      edittitle: "",
      dialogVisible: false
    };
  },
  mounted() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.$axios
        .post("/v1/admin/productCategory/categoryList", this.listQuery)
        .then(res => {
          // this.total = res.data.total
          this.dataList = res.data;
          console.log(res.data);
        });
    },
    // 新增
    addCategory() {
      this.edittitle = "新增";
      this.dialogVisible = true;
      this.ruleForm = Object.assign({}, defaultForm);
    },
    // 编辑
    handleEdit(row) {
      this.edittitle = "编辑";
      this.dialogVisible = true;
      this.$store
        .dispatch("mystore/mystore/GETASSISTDATA", {
          data: {
            isAssist: 1,
            categoryId: row.categoryId
          },
          url: "/v1/admin/productCategory/edit"
        })
        .then(res => {
          this.ruleForm = res.data.category;
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.edittitle == "编辑") {
            // 编辑提交
            this.$axios
              .post("/v1/admin/productCategory/edit", this.ruleForm)
              .then(res => {
                this.$message.success("修改成功");
                this.getdata();
                this.dialogVisible = false;
              });
          } else {
            // 新增提交
            this.$axios
              .post("/v1/admin/productCategory/add", this.ruleForm)
              .then(res => {
                this.$message.success("新增成功");
                this.getdata();
                this.dialogVisible = false;
              });
          }
        } else {
          return false;
        }
      });
    },
    // 删除
    handleDel(row) {
      this.$store
        .dispatch("mystore/mystore/DELETEROWDATA", {
          data: {
            categoryId: row.categoryId
          },
          url: "/v1/admin/productCategory/del"
        })
        .then(res => {
          // console.log(res)
          this.getdata();
        });
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
