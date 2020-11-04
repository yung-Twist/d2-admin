<template>
  <d2-container>
    <template slot="header">
        <div class="pageHeader">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="addnotice">新增</el-button>
            <!-- <el-input v-model="listQuery.productName" placeholder="商品名称" class="search-input" clearable></el-input>
            <el-select v-model="listQuery.productStatus" clearable placeholder="请选择状态" style="margin:0 10px;">
                <el-option
                v-for="(item, index) in statusList"
                :key="index"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select> -->
            <!-- <el-button type="success" icon="el-icon-search" size="small" @click="getdata">搜索</el-button> -->
        </div>
    </template>
    <el-table
      :data="dataList"
      border
    >
      <el-table-column align="center" label="标题" width="300">
        <template slot-scope="scope">{{ scope.row.noticeTitle}}</template>
      </el-table-column>
      <el-table-column align="center" label="内容">
        <template slot-scope="scope">{{ scope.row.noticeContent}}</template>
      </el-table-column>
      <el-table-column align="center" label="发送时间" width="200">
        <template slot-scope="scope">{{ scope.row.noticeSendTime}}</template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="200">
        <template slot-scope="scope">{{ scope.row.noticeCreateTime}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            class="customer"
            icon="el-icon-edit"
            @click="editinfo(scope.row)"
            size="mini"
            type="primary"
          >编辑</el-button>
          <el-button
            class="customer"
            icon="el-icon-edit"
            @click="delinfo(scope.row)"
            type="danger"
            size="mini"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增弹出框 -->
    <el-dialog :title="edittitle" :visible.sync="dialogVisible" width="50%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="公告标题" prop="noticeTitle">
          <el-input v-model="ruleForm.noticeTitle"></el-input>
        </el-form-item>
        <el-form-item label="发送时间" prop="noticeSendTime">
          <el-date-picker
            v-model="ruleForm.noticeSendTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="公告内容">
          <el-input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入内容" v-model="ruleForm.noticeContent"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <template slot="footer">
        <!-- 分页 -->
    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getdata"
    />
    </template>
  </d2-container>
</template>

<script>
import Pagination from "@/components/Pagination";
import util from '@/libs/util'
const defaultForm = {
    noticeTitle: "",
    noticeContent: "",
    noticeSendTime: "",
    noticeId: ""
};
export default {
  name: "Notice",
  data() {
    return {
        listQuery: {
            limit: 10,
            page: 1,
        },
        total:10,
        dataList:[],
        ruleForm:Object.assign({},defaultForm),
        rules: {
        noticeTitle: [
          {
            required: true,
            message: "请输入公告标题",
            trigger: "blur"
          }
        ],
        noticeContent: [
          {
            required: true,
            message: "请输入公告内容",
            trigger: "blur"
          }
        ],
        noticeSendTime: [
          {
            required: true,
            message: "请输入发送时间",
            trigger: "blur"
          }
        ]
      },
        edittitle:'',
        dialogVisible:false
    };
  },
  components:{
    Pagination
  },
  mounted() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.$axios.post("/v1/admin/notice/noticeList", this.listQuery).then(res => {
        this.total = res.data.total;
        this.dataList = res.data.data;
        // console.log(res)
      });
    },
    // 新增
    addnotice() {
      this.edittitle = "新增";
      this.dialogVisible = true;
      this.ruleForm = Object.assign({},defaultForm)
    },
    // 编辑
    editinfo(row) {
      this.edittitle = "编辑";
      this.$store
        .dispatch("mystore/mystore/GETASSISTDATA", {
          data: {
            isAssist: 1,
            noticeId: row.noticeId
          },
          url: "/v1/admin/notice/edit"
        })
        .then(res => {
            this.ruleForm = res.data.notice_data;
            this.dialogVisible = true;
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        // console.log(this.ruleForm)
        if (valid) {
          if (this.ruleForm.noticeId) {
            // 编辑提交
            this.$axios.post("/v1/admin/notice/edit", this.ruleForm).then(res => {
              this.$message.success("修改成功");
              this.getdata();
              this.dialogVisible = false;
            });
          } else {
            // 新增提交
            this.$axios.post("/v1/admin/notice/add", this.ruleForm).then(res => {
              this.$message.success("新增成功");
              this.getdata();
              this.dialogVisible = false;
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除
    delinfo(row) {
      this.$store
        .dispatch("mystore/mystore/DELETEROWDATA", {
          data: {
            noticeId: row.noticeId
          },
          url: "/v1/admin/notice/del"
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
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>