<template>
    <d2-container >
        <el-tabs type="border-card">
        <el-tab-pane v-for="(item,index) in configuration" :key="index" :label="item.name" :type="item.type">
            <div class="messageConfig" v-if="item.name == '消息模版设置'">
                <div class="placeholderList">
                    <el-card class="box-card">
                        <h3>占位符模板</h3>
                        <div v-for="(item, index) in placeholderList" :key="index" class="text item">
                            {{item.name}}：{{item.value}}
                        </div>
                    </el-card>
                </div>
                <div class="messageConfigWrap">
                    <div class="messageConfigItem" v-for="(value,index) in item.values" :key="index">
                        <p>{{value.name}}</p>
                        <el-input v-if="value.type == 'textarea'" :autosize="{ minRows: 10, maxRows: 16}" type="textarea" :rows="2" :placeholder="value.name" v-model="value.default">
                        </el-input>
                    </div>
                </div>
            </div>
            <div class="form-item" v-for="(value,index) in item.values" :key="index" v-else>
                    
                    <span style="width:220px;text-align:right;">{{value.name}}</span>

                    <el-input v-if="value.type == 'input'" v-model="value.default" :placeholder="value.name"></el-input>

                    <el-radio-group v-model="value.default" v-if="value.type == 'radio'">
                        <el-radio v-for="(val,valIndex) in value.option" :key="valIndex" :label="valIndex">{{val}}</el-radio>
                    </el-radio-group>

                    <el-select v-model="value.default" :placeholder="value.name" v-if="value.type == 'select'">
                        <el-option v-for="item in value.option" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>

                    <el-input v-if="value.type == 'textarea'" type="textarea" :rows="2" :placeholder="value.name" v-model="value.default">
                    </el-input>
            </div>
            <el-button class="submit-button" type="primary" @click="submit(item)">提交</el-button>
        </el-tab-pane>
    </el-tabs>
    </d2-container>
</template>

<script>
export default {
  name: 'ConfigSystem',
  data () {
    return {
        configuration: [],
        htmlItem: "",
        placeholderList:[],
        apiUrl:window.apiObj.ApiUrl
    }
  },
  mounted() {
        this.getConfig();
        this.getMessageConfig();
    },
    methods: {
        getConfig() {
            this.$axios.post("/v1/admin/settings/get", {}).then(res => {
                this.configuration = res.data;
                // console.log(window.apiObj.ApiUrl)
            });
        },
        //提交配置组，将需要提交的数据进行验证，并重组成新的对象提交
        submit(item) {
            let SETTINGS_KEY = {};
            SETTINGS_KEY.type = item.type;
            let bool = true
            for (let child of item.values) {
                if (child.filter == 'url') {
                    bool = this.functionisURL(child.default)
                    if (!bool) {
                        this.$message.error('请输入有效的验证地址')
                        break
                    }
                } else if (child.filter == "all") {
                    bool = child.default.length > 0
                    if (!bool) {
                        this.$message.error('输入的数据不能为空')
                        break
                    }
                } else if (child.filter == "email") {
                    bool = this.functionisEmail(child.default)
                    if (!bool) {
                        this.$message.error('输入的邮箱格式不正确')
                        break
                    }
                } else if (child.filter == "int") {
                    bool = this.functionisInt(child.default)
                    if (!bool) {
                        this.$message.error('请输入整数型的字符串')
                        break
                    }
                }
                SETTINGS_KEY[child.key] = child.default;
            }
            if (bool) {
                this.$axios.post("/v1/admin/settings/set", SETTINGS_KEY).then(res => {
                    this.$message.success('提交成功')
                });
            }
        },
        //url正则
        functionisURL(str) {
            return !!str.match(/(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g);
        },
        //邮箱正则
        functionisEmail(str) {
            let emailReg = /^[\w.-]+@([1-9]|[a-z]|[A-Z])+(\.[A-Za-z]{2,4}){1,2}$/
            return emailReg.test(str)
        },
        //int型字符串验证
        functionisInt(str) {
            let intReg = /^\d+$/
            return intReg.test(str)
        },
        // 获取消息配置信息提醒
        getMessageConfig(){
            this.$axios.post('/v1/admin/settings/get',{}).then(res=>{
                this.placeholderList = res.data.placeholder
                // console.log(this.placeholderList)
            })
        }
    }
}
</script>

<style lang='scss' scoped>
.wechatUrlConfig{
    text-align: center;
    p{
        color: #f40;
    }
}
.roles-table {
    margin-top: 30px;
}

.permission-tree {
    margin-bottom: 30px;
}

.customer {
    cursor: pointer;
    color: #1890ff;
}

.form-item {
    display: flex;
    width: 500px;
    margin: 10px auto;
    align-items: center;

    span {
        font-size: 14px;
        // width: 150px;
        white-space: nowrap;
        margin-right: 1em;
    }
}
.messageConfig{
    .placeholderList{
        width: 50%;
        margin: 1em auto;
        h3{
            color: #f40;
        }
    }
    .messageConfigWrap{
        display: flex;
        flex-direction: row;
        justify-content: center;
        .messageConfigItem{
            margin:1rem;
            width: 500px;
            p{
                margin: 1rem 0;
            }
        }
    }
}
.submit-button {
    width: 200px;
    display: block;
    margin: 0 auto;
}

@media (max-width:1024px) {
    .form-item {
        display: block;
        width: 100%;
    }
}
</style>
