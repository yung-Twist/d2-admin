<template>
  <d2-container>
    <!-- <template slot="header">
        <div class="pageHeader">
            <el-button type="primary" size="small" @click="handleAdd">客服设置</el-button>
        </div>
    </template> -->
    <el-table :data="dataList" border>
      <el-table-column prop="cooperateName" label="姓名"></el-table-column>
      <el-table-column prop="cooperatePhone" label="手机"></el-table-column>
      <el-table-column prop="cooperateMessage" label="留言"></el-table-column>
    </el-table>
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
const defaultForm = {

};
export default {
  name: "Cooperate",
  data() {
    return {
        listQuery: {
            limit: 10,
            page: 1,
        },
        dataList:[],
        total:10
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
        .post("/v1/admin/cooperate/cooperateList", this.listQuery)
        .then(res => {
            this.dataList = res.data.data
            this.total = res.data.total
        });
    },
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