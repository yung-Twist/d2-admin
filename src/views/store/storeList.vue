<template>
    <d2-container >
        <template slot="header">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
        </template>
        <el-table :data="datalist" border >
          <el-table-column align="center" label="门店名称">
            <template slot-scope="scope">{{ scope.row.storeName }}</template>
          </el-table-column>
          <el-table-column align="center" label="登录用户名">
            <template slot-scope="scope">{{ scope.row.storeUserName }}</template>
          </el-table-column>
          <el-table-column align="center" label="手机号">
            <template slot-scope="scope">{{ scope.row.storePhone }}</template>
          </el-table-column>
          <el-table-column align="center" label="地址">
            <template slot-scope="scope">{{ scope.row.storeProvince }}{{ scope.row.storeCity }}{{ scope.row.storeCounty }}{{ scope.row.storeAddress }}</template>
          </el-table-column>
          <el-table-column align="center" label="背景图" width="140">
            <template slot-scope="scope">
                <img :src="scope.row.storeImagePath" alt="" style="widht:8vw;height:8vw;">
            </template>
          </el-table-column>
          <el-table-column align="center" label="logo" width="140">
            <template slot-scope="scope">
                <img :src="scope.row.storeLogoImagePath" alt="" style="widht:8vw;height:8vw;">
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <el-tooltip
                effect="dark"
                :content="scope.row.storeStatus == 1 ? '启用' : '关闭'"
                placement="top"
              >
                <el-switch
                  @change="changestatus(scope.row)"
                  v-model="scope.row.storeStatus"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="2"
                ></el-switch>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="300" fixed="right">
            <template slot-scope="scope">
                <el-button type="warning" size="mini" @click="resetPwd(scope.row)">重置密码</el-button>
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 新增编辑弹出框 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'添加'" width="600px">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" label-position="left">
            <el-form-item label="用户名" prop="storeUserName">
                <el-input v-model="ruleForm.storeUserName" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="密码" prop="storePassword">
                <el-input v-model="ruleForm.storePassword" placeholder="请输入密码" />
            </el-form-item>
            <el-form-item label="门店名" prop="storeName">
                <el-input v-model="ruleForm.storeName" placeholder="请输入门店名称" />
            </el-form-item>
            <el-form-item label="地址">
                <v-distpicker @selected="onSelected"></v-distpicker>
            </el-form-item>
            <el-form-item label="详细地址" prop="storeAddress">
                <el-input v-model="ruleForm.storeAddress" placeholder="请输入详细地址" />
            </el-form-item>
            <el-form-item label="手机" prop="storePhone">
                <el-input v-model="ruleForm.storePhone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="排序" prop="storeOrder">
                <el-input v-model.number="ruleForm.storeOrder" placeholder="请输入排序" />
            </el-form-item>
            <el-form-item label="分成比例" prop="storeCommissionRate">
                <el-input v-model="ruleForm.storeCommissionRate" placeholder="请输入分成比例"><template slot="append">%</template></el-input>
            </el-form-item>
            <el-form-item label="背景图" prop="storeImageId">
                <el-upload
                class="avatar-uploader"
                :action="action"
                :show-file-list="false"
                :on-success="bgHandleSuccess"
                :data="uploadOtherParmas"
                name="store_image"
                >
                    <img v-if="imageUrlBG" :src="imageUrlBG" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <!-- <div slot="tip" class="el-upload__tip">建议上传宽高为1:1的图片</div> -->
                </el-upload>
            </el-form-item>
            <el-form-item label="LOGO图" prop="storeLogoImageId">
                <el-upload
                class="avatar-uploader"
                :action="action"
                :show-file-list="false"
                :on-success="logoHandleSuccess"
                :data="uploadOtherParmas"
                name="store_image"
                >
                    <img v-if="imageUrlLogo" :src="imageUrlLogo" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <!-- <div slot="tip" class="el-upload__tip">建议上传宽高为1:1的图片</div> -->
                </el-upload>
            </el-form-item>
        </el-form>
        <div style="text-align:right;">
            <el-button type="danger" @click="dialogVisible=false">取消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        </div>
    </el-dialog>
        <template slot="footer">
          <!-- 分页 -->
    <pagination
      v-show="total > 0"
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
import VDistpicker from "v-distpicker";
import validate from "@/utils/validate"
import util from '@/libs/util'
const defaultData = {
  storeUserName: '',
  storePassword: '',
  storeName: '',
  storeProvince: '',
  storeCity: '',
  storeCounty: '',
  storeAddress: '',
  storePhone: '',
  storeOrder: '',
  storeImageId: '',
  storeLogoImageId: '',
  storeCommissionRate: '',
  storeId: '',
}
export default {
  name: 'StoreList',
  data () {
    return {
      dialogType: '',
      ruleForm: Object.assign({}, defaultData),
      dialogVisible: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      total:10,
      rules: {
        storeUserName: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        storePassword: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }],
        storeName: [{
          required: true,
          message: '请输入门店名称',
          trigger: 'blur'
        }],
        storeCommissionRate: [{
          required: true,
          message: '请输分成比例',
          trigger: 'blur'
        }],
        storeAddress: [{
          required: true,
          message: '请输入详细地址',
          trigger: 'blur'
        }],
        storeImageId: [{
          required: true,
          message: '请上传背景图',
          trigger: 'blur'
        }],
        storeLogoImageId: [{
          required: true,
          message: '请上传LOGO图',
          trigger: 'blur'
        }],
        storePhone: [{ validator: validate.validatePhone, trigger: 'blur' }],
      },
      uploadOtherParmas: {
            isUploadImage: 1,
            token: util.cookies.get('token')
        },
      datalist: [],
      action:'',
      imageUrlBG:'',
      imageUrlLogo:''
    }
  },
  components:{
    Pagination,
    VDistpicker
  },
  mounted () {
    this.getdata()
  },
  methods: {
    getdata () {
      this.$axios.post('/v1/admin/store/storeList', this.listQuery).then(res => {
        // console.log(res)
        this.datalist = res.data.data
        this.total = res.data.total 
      })
    },
    // 选择地址
    onSelected(data) {
        this.ruleForm.storeProvince = data.province.value
        this.ruleForm.storeCity = data.city.value
        this.ruleForm.storeCounty = data.area.value
    },
    // 新增
    handleAdd () {
        this.ruleForm = Object.assign({}, defaultData);
        this.action = window.apiObj.ApiUrl + '/v1/admin/store/add'
        this.imageUrlBG = ''
        this.imageUrlLogo = ''
        this.$nextTick(() => {
            this.$refs['ruleForm'].resetFields()
        })
        this.dialogType = 'new'
        this.dialogVisible = true
    },
    // 背景图片上传成功
    bgHandleSuccess(res, file){
        this.imageUrlBG = URL.createObjectURL(file.raw);
        this.ruleForm.storeImageId = res.data.image_id
    },
    // logo图片上传成功
    logoHandleSuccess(res, file){
        this.imageUrlLogo = URL.createObjectURL(file.raw);
        this.ruleForm.storeLogoImageId = res.data.image_id
    },
    // 编辑
    handleEdit (row) {
      this.dialogType = 'edit'
      this.action = window.apiObj.ApiUrl + '/v1/admin/store/edit'
      this.dialogVisible = true
      this.$store
        .dispatch("mystore/mystore/GETASSISTDATA", {
          data: {
            isAssist: 1,
            storeId: row.storeId
          },
          url: "/v1/admin/store/edit"
        })
        .then(res => {
        //   console.log(res)
          this.ruleForm = res.data.store
          this.imageUrlLogo = res.data.store.storeLogoImagePath
          this.imageUrlBG = res.data.store.storeImagePath
        });
    },
    // 删除
    handleDelete (row) {
      this.$store
        .dispatch("mystore/mystore/DELETEROWDATA", {
          data: {
            storeId: row.storeId
          },
          url: "/v1/admin/store/del"
        })
        .then(res => {
          // console.log(res)
          this.getdata();
        });
    },
    // 重置密码
    resetPwd (row) {
      this.$prompt('请输入新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.$axios.post('/v1/admin/store/resetPwd', {
          storeId: row.storeId,
          storePassword: value
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
    // 修改状态
    changestatus (row) {
      // console.log(row.managerStatus)
        this.$axios.post('/v1/admin/store/changeStatus', {
        storeId: row.storeId
        }).then(res => {
        this.getdata()
        })
    },
    // 提交表单
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogType == 'edit') {
              this.$axios.post('/v1/admin/store/edit',this.ruleForm).then(res=>{
                  this.$message.success('修改成功');
                  this.getdata();
                    this.dialogVisible = false;
              })
          } else {
              this.$axios.post('/v1/admin/store/add',this.ruleForm).then(res=>{
                    this.$message.success('新增成功')
                    this.getdata();
                    this.dialogVisible = false;
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