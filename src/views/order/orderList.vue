<template>
  <d2-container>
    <template slot="header">
      <div class="pageHeader">
          <el-select v-model="listQuery.orderStatus" placeholder="订单状态" class="search-input" clearable>
            <el-option v-for="item in orderStatusList" :key="item.value" :label="item.label" :value="item.value" clearable></el-option>
        </el-select>
        <el-input
          class="search-input"
          v-model="listQuery.orderUserPhone"
          placeholder="手机号"
          clearable
        ></el-input>
        <el-input class="search-input" v-model="listQuery.storeId" placeholder="门店id" clearable></el-input>
        <el-date-picker v-model="listQuery.orderPayDate" type="date" placeholder="支付日期" value-format="yyyy-MM-dd"></el-date-picker>
        <el-button type="primary" size="mini" @click="getdata" style="margin-left:10px;">搜索</el-button>
        <el-button
          type="warning"
          size="mini"
          @click="export_order"
        >导出订单</el-button>
      </div>
    </template>
    <el-table :data="dataList" border>
      <el-table-column align="center" label="订单号">
        <template slot-scope="scope">{{ scope.row.orderNumber}}</template>
      </el-table-column>
      <el-table-column align="center" label="用户手机">
        <template slot-scope="scope">{{ scope.row.orderUserPhone}}</template>
      </el-table-column>
      <el-table-column align="center" label="取货码">
        <template slot-scope="scope">{{ scope.row.orderCode}}</template>
      </el-table-column>
      <el-table-column align="center" label="订单金额">
        <template slot-scope="scope">{{ scope.row.orderPrice}}</template>
      </el-table-column>
      <el-table-column align="center" label="订单类型">
        <template
          slot-scope="scope"
        >{{ scope.row.orderType == 1 ? '普通订单' : scope.row.orderType == 2 ? '拼团订单' : '爆款订单'}}</template>
      </el-table-column>
      <el-table-column align="center" label="订单状态">
        <template
          slot-scope="scope"
        >{{ scope.row.orderStatus == 1 ? '待付款' : scope.row.orderStatus == 2 ? ' ' : scope.row.orderStatus == 3 ? '待备货' : scope.row.orderStatus == 4 ? '已备货/待取货' : scope.row.orderStatus == 5 ? '已完成' : scope.row.orderStatus == 6 ? '已取消' : '已退款'}}</template>
      </el-table-column>
      <el-table-column align="center" label="订单原价">
        <template slot-scope="scope">{{ scope.row.orderOriginalPrice}}</template>
      </el-table-column>
      <!-- <el-table-column align="center" label="订单佣金">
        <template slot-scope="scope">{{ scope.row.orderCommission}}</template>
      </el-table-column> -->
      <el-table-column align="center" label="团长店名">
        <template slot-scope="scope">{{ scope.row.orderStoreName}}</template>
      </el-table-column>
      <el-table-column align="center" label="取货地址">
        <template slot-scope="scope">{{ scope.row.orderDeliveryAddress}}</template>
      </el-table-column>
      <el-table-column align="center" label="团长电话">
        <template slot-scope="scope">{{ scope.row.orderStorePhone}}</template>
      </el-table-column>
      <el-table-column align="center" label="取货时间">
        <template slot-scope="scope">{{ scope.row.orderDeliveryTime}}</template>
      </el-table-column>
      <el-table-column align="center" label="取消订单时间">
        <template slot-scope="scope">{{ scope.row.orderCancelTime}}</template>
      </el-table-column>
      <el-table-column align="center" label="下单时间">
        <template slot-scope="scope">{{ scope.row.orderCreateTime}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" type="warning" @click="showOrderGoods(scope.row)">订单商品详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 订单商品详情 -->
    <el-dialog title="订单商品" :visible.sync="dialogVisible" >
        <el-table :data="orderGoodsData" border>
            <el-table-column prop="orderProductProductName" label="商品名称" >
            </el-table-column>
            <el-table-column label="图片" align="center" width="200">
                <template slot-scope="scope">
                    <img :src="scope.row.orderProductProductImagePath" alt="" style="widht:8vw;height:8vw;">
                </template>
            </el-table-column>
            <el-table-column prop="orderProductProductPrice" label="商品单价"></el-table-column>
            <el-table-column prop="orderProductProductOriginalPrice" label="商品原价"></el-table-column>
            <el-table-column prop="orderProductProductNumber" label="商品数量"></el-table-column>
            <el-table-column align="center" label="订单状态">
                <template slot-scope="scope">{{ scope.row.orderProductStatus == 1 ? '未付款' : scope.row.orderProductStatus == 2 ? '已付款' : '已退款'}}</template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 导出订单弹出框 -->
    <el-dialog title="导出订单" :visible.sync="dialogExcelVisible" width="30%">
        <el-form label-width="100px" class="demo-ruleForm">
            <el-form-item label="订单状态">
                <el-select v-model="orderStatus" placeholder="选择状态" class="handle-select" clearable>
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) in orderStatusList" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="门店id">
                <el-input v-model="storeId"></el-input>
            </el-form-item>
            <el-form-item label="用户手机">
                <el-input v-model="orderUserPhone"></el-input>
            </el-form-item>
            <el-form-item label="订单日期">
                <el-date-picker v-model="time" type="datetimerange" :picker-options="pickerOptions" @change="gettime" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
            </el-form-item>
            
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogExcelVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit_export">确 定</el-button>
        </div>
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
import excelexport from '@/utils/excelexport'
import XLSX from 'xlsx'
export default {
  name: "GoodsList",
  data() {
    return {
        listQuery: {
            limit: 10,
            page: 1,
            orderUserPhone: '',
            orderStatus: '',
            storeId: '',
            orderPayDate:''
        },
        total:10,
        dataList:[],
        orderStatus:'',
        storeId:'',
        orderUserPhone:'',
        startTime:'',
        endTime:'',
        orderGoodsData:[],
        dialogVisible:false,
        dialogExcelVisible:false,
        pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            time: [],
        orderStatusList:[
                {
                    label:'全部',
                    value:0
                },
                {
                    label:'待付款',
                    value:1
                },
                {
                    label:'待备货',
                    value:3
                },
                {
                    label:'已备货/待取货',
                    value:4
                },
                {
                    label:'已完成',
                    value:5
                },
                {
                    label:'已取消',
                    value:6
                },
                {
                    label:'已退款',
                    value:7
                }
            ],
    
    
    
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
        .post("/v1/admin/order/orderList", this.listQuery)
        .then(res => {
          this.total = res.data.total
          this.dataList = res.data.data;

        });
    },
    // 订单商品
    showOrderGoods(row) {
        this.orderGoodsData = row.orderProductList
        // console.log(row)
        this.dialogVisible = true
    },
    // 时间搜索
    gettime() {
        if(this.time){
            this.startTime = this.time[0]
            this.endTime = this.time[1]
        }else{
            this.startTime = null
            this.endTime = null
        }
    },
    // 导出订单
    export_order(){
        this.dialogExcelVisible = true
    },
    // 导出提交
    submit_export(){
        let params = {
            orderStatus : this.orderStatus,
            storeId : this.storeId,
            orderUserPhone : this.orderUserPhone,
            startTime:this.startTime,
            endTime:this.endTime
        }
        this.$axios.post('/v1/admin/order/export',params).then(res=>{
            let data = res.data
            for(let e of data){
                e.orderStatus = e.orderStatus == 1 ? '待付款' : e.orderStatus == 2 ? ' ' : e.orderStatus == 3 ? '待备货' : e.orderStatus == 4 ? '已备货/待取货' : e.orderStatus == 5 ? '已完成' : e.orderStatus == 6 ? '已取消' : '已退款'
            }
            //自定义标题栏
            var title=['商品名称','数量','店名','地址','订单状态','下单时间','支付时间']  
                //自定义过滤栏（不需要导出的行）
            var head=['productName','productNumber','storeName','deliveryAddress','orderStatus','orderCreateTime','orderPayTime']  
            //自定义导出
            excelexport.JSONToExcelConvertor(data,"订单列表",title,head)
            this.dialogExcelVisible = false
        })
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
  border-color: #409eff;
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