<template>
  <d2-container>
    <template slot="header">
        <div class="pageHeader">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">新增</el-button>
            <el-input v-model="listQuery.productName" placeholder="商品名称" class="search-input" clearable></el-input>
            <el-select v-model="listQuery.productStatus" clearable placeholder="请选择状态" style="margin:0 10px;">
                <el-option
                v-for="(item, index) in statusList"
                :key="index"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-button type="success" icon="el-icon-search" size="small" @click="getdata">搜索</el-button>
        </div>
    </template>
    <el-table :data="dataList" border>
      <el-table-column prop="productName" label="产品名称"></el-table-column>
      <el-table-column label="图片" width="140" align="center">
          <template slot-scope="scope">
              <img :src="scope.row.productImagePath" alt="" style="width:8vw;height:8vw;">
          </template>
      </el-table-column>
      <el-table-column prop="productDescription" label="产品简介"></el-table-column>
      <el-table-column label="分类">
          <template slot-scope="scope">
              {{categoryData[scope.row.productCategoryId]}}
          </template>
      </el-table-column>
      <el-table-column prop="productPrice" label="产品价格"></el-table-column>
      <el-table-column prop="productStock" label="库存"></el-table-column>
      <el-table-column prop="productSalesVolume" label="实际销量"></el-table-column>
      <el-table-column prop="productVirtualSalesVolume" label="虚拟销量"></el-table-column>
      <el-table-column align="center" label="状态">
            <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.productStatus == 1 ? '上架' : '下架'" placement="top">
                    <el-switch @change="changeStatus($event,scope.row)" v-model="scope.row.productStatus" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="2"></el-switch>
                </el-tooltip>
            </template>
        </el-table-column>
      <el-table-column prop="productAttributes" label="参数"></el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
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
    <el-dialog :title="edittitle" :visible.sync="dialogVisible" width="50%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="名称" prop="productName">
          <el-input v-model="ruleForm.productName"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="productImageId">
            <el-upload
            class="avatar-uploader"
            :action="action"
            :show-file-list="false"
            :on-success="handleSuccess"
            :data="uploadOtherParmas"
            name="product_image"
            >
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">建议上传宽高为1:1的图片</div>
            </el-upload>
        </el-form-item>
        <el-form-item label="分类">
            <el-select v-model="ruleForm.productCategoryId" placeholder="请选择分类">
                <el-option :label="item.categoryName" :value="item.categoryId" v-for="(item, index) in categoryList" :key="index"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="productDescription">
          <el-input v-model="ruleForm.productDescription"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="productPrice">
          <el-input v-model="ruleForm.productPrice"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="productStock">
          <el-input v-model="ruleForm.productStock"></el-input>
        </el-form-item>
        <el-form-item label="虚拟销量" prop="productVirtualSalesVolume">
          <el-input v-model="ruleForm.productVirtualSalesVolume"></el-input>
        </el-form-item>
        <el-form-item label="参数">
            <el-input placeholder="请输入参数名" v-model="attributeName" class="input-with-select">
                <el-button slot="append" @click="addAttribute">添加</el-button>
            </el-input>
        </el-form-item>
        <el-form-item label="参数内容" v-if="attributeList.length > 0">
            <el-input placeholder="请输入参数内容" v-model="item.value" v-for="(item, index) in attributeList" :key="index">
                <template slot="prepend">{{item.key}}</template>
                <el-button slot="append" @click="removeAttribute(index)">移除</el-button>
            </el-input>
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
  productName: '',
  productDescription: '',
  productCategoryId:'',
  productPrice:'',
  productStock:'',
  productImageId:'',
  productVirtualSalesVolume:'',
  productAttributes:'',
  productId:''
};
export default {
  name: "GoodsList",
  data() {
    return {
        listQuery: {
            limit: 10,
            page: 1,
            productName:'',
            productStatus:''
        },
        total:10,
        action:'',
        imageUrl:'',
        uploadOtherParmas: {
            isUploadImage: 1,
            token: util.cookies.get('token')
        },
        dataList: [],
        ruleForm: Object.assign({}, defaultForm),
        rules: {
            productName: [
                {
                    required: true,
                    message: "请输入商品名称",
                    trigger: "blur"
                }
            ],
            productImageId: [
                {
                    required: true,
                    message: "请上传图片",
                    trigger: "blur"
                }
            ],
            productDescription: [
                {
                    required: true,
                    message: "请输入商品描述",
                    trigger: "blur"
                }
            ],
            productCategoryId: [
                {
                    required: true,
                    message: "请选择分类",
                    trigger: "blur"
                }
            ],
            productPrice: [
                {
                    required: true,
                    message: "请输入商品价格",
                    trigger: "blur"
                }
            ],
            productStock: [
                {
                    required: true,
                    message: "请输入库存",
                    trigger: "blur"
                }
            ],
        },
        edittitle: "",
        dialogVisible: false,
        statusList:[
            {
                value:0,
                label:'全部'
            },
            {
                value:1,
                label:'上架'
            },
            {
                value:2,
                label:'下架'
            }
        ],
        categoryData:{},
        categoryList:[],
        attributeName:'',
        attributeList:[]
    };
  },
  components:{
    Pagination
  },
  mounted() {
    this.getassistdata()
    this.getdata();
  },
  methods: {
    // 产品列表辅助数据
    getassistdata(){
        this.$store.dispatch("mystore/mystore/GETASSISTDATA", {
          data: {
            isAssist: 1
          },
          url: "/v1/admin/product/productList"
        })
        .then(res => {
          this.categoryData = {}
          for(let e of res.data.categoryList){
              this.categoryData[e.categoryId] = e.categoryName
          }
        });
    },
    getdata() {
      this.$axios
        .post("/v1/admin/product/productList", this.listQuery)
        .then(res => {
          this.total = res.data.total
          this.dataList = res.data.data;

        });
    },
    // 新增
    handleAdd() {
        this.edittitle = "新增";
        this.dialogVisible = true;
        this.ruleForm = Object.assign({}, defaultForm);
        this.action = window.apiObj.ApiUrl + '/v1/admin/product/add'
        this.imageUrl = ''
        this.attributeList = []
        this.$store
        .dispatch("mystore/mystore/GETASSISTDATA", {
          data: {
            isAssist: 1
          },
          url: "/v1/admin/product/add"
        })
        .then(res => {
          this.categoryList = res.data.categoryList
        });
    },
    // 图片上传成功
    handleSuccess(res, file){
        this.imageUrl = URL.createObjectURL(file.raw);
        this.ruleForm.productImageId = res.data.image_id
    },
    // 编辑
    handleEdit(row) {
      this.edittitle = "编辑";
      this.dialogVisible = true;
      this.action = window.apiObj.ApiUrl + '/v1/admin/product/edit'
      this.$store
        .dispatch("mystore/mystore/GETASSISTDATA", {
          data: {
            isAssist: 1,
            productId: row.productId
          },
          url: "/v1/admin/product/edit"
        })
        .then(res => {
          this.categoryList = res.data.categoryList;
          this.ruleForm = res.data.product;
          this.imageUrl = res.data.product.productImagePath
        //   转化属性
          let attribute = res.data.product.productAttributes.split(',');
          this.attributeList = []
          for(let e of attribute){
              let obj = {
                  key:e.split(':')[0],
                  value:e.split(':')[1]
              }
              this.attributeList.push(obj)
          }
        });
    },
    //修改商品状态
    changeStatus($event, row) {
        this.$axios.post("/v1/admin/product/changeStatus", {
            productId: row.productId
        }).then(
            res => {
                this.$message.success("更改状态成功");
                this.getdata();
            }
        );
    },
    // 添加参数属性名
    addAttribute(){
        if(this.attributeName == ''){
            this.$message('请输入属性名')
        }else{
            this.attributeList.push({
                key:this.attributeName,
                value:''
            })
            this.attributeName = ''
        }
    },
    // 移除属性
    removeAttribute(index){
        this.attributeList.splice(index,1)
    },
    submitForm(formName) {
        this.ruleForm.productAttributes = ''
        for(let e of this.attributeList){
            this.ruleForm.productAttributes += `${e.key}:${e.value},`
        }
        this.ruleForm.productAttributes = this.ruleForm.productAttributes.substr(0, this.ruleForm.productAttributes.length - 1)
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.edittitle == "编辑") {
            // 编辑提交
            this.$axios
              .post("/v1/admin/product/edit", this.ruleForm)
              .then(res => {
                this.$message.success("修改成功");
                this.getdata();
                this.dialogVisible = false;
              });
          } else {
            // 新增提交
            this.$axios
              .post("/v1/admin/product/add", this.ruleForm)
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