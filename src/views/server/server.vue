<template>
  <d2-container>
    <template slot="header">
        <div class="pageHeader">
            <el-button type="primary" size="small" @click="handleAdd">客服设置</el-button>
        </div>
    </template>
    <el-table :data="dataList" border>
      <el-table-column prop="wechat_name" label="微信名"></el-table-column>
      <el-table-column label="头像" width="140" align="center">
          <template slot-scope="scope">
              <img :src="scope.row.image_path" alt="" style="width:8vw;height:8vw;">
          </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
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
        <el-form-item label="微信名" prop="wechat_name">
          <el-input v-model="ruleForm.wechat_name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="微信二维码" prop="image_id">
            <el-upload
            class="avatar-uploader"
            :action="action"
            :show-file-list="false"
            :on-success="handleSuccess"
            :data="uploadOtherParmas"
            name="settings_image"
            >
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">建议上传宽高为1:1的图片</div>
            </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </d2-container>
</template>

<script>
import Pagination from "@/components/Pagination";
import validate from '@/utils/validate'
import util from '@/libs/util'
const defaultForm = {
  wechat_name: '',
  phone: '',
  image_id:'',
};
export default {
  name: "Server",
  data() {
    return {
        listQuery: {
            limit: 10,
            page: 1,
        },
        action:'',
        imageUrl:'',
        uploadOtherParmas: {
            isUploadImage: 1,
            token: util.cookies.get('token')
        },
        dataList: [],
        ruleForm: Object.assign({}, defaultForm),
        rules: {
            wechat_name: [
                {
                    required: true,
                    message: "请输入微信昵称",
                    trigger: "blur"
                }
            ],
            phone: [{ validator: validate.validatePhone, trigger: 'blur' }],
            image_id: [
                {
                    required: true,
                    message: "请上传图片",
                    trigger: "blur"
                }
            ],
        },
        edittitle: "",
        dialogVisible: false,
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
      this.$axios
        .post("/v1/admin/settings/getCustomerService", this.listQuery)
        .then(res => {
            this.dataList = []
          this.dataList.push(res.data)

        });
    },
    // 新增
    handleAdd() {
        this.dialogVisible = true;
        this.action = window.apiObj.ApiUrl + '/v1/admin/settings/setCustomerService'
        this.ruleForm = this.dataList[0]
        this.imageUrl = this.dataList[0].image_path
    },
    // 图片上传成功
    handleSuccess(res, file){
        this.imageUrl = URL.createObjectURL(file.raw);
        this.ruleForm.image_id = res.data.image_id
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
            this.$axios
              .post("/v1/admin/settings/setCustomerService", this.ruleForm)
              .then(res => {
                this.$message.success("设置成功");
                this.getdata();
                this.dialogVisible = false;
              });
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
            productId: row.productId
          },
          url: "/v1/admin/product/del"
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