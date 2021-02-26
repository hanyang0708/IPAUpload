<template>
    <div id="app">
        <div class="top">
            <div></div>
            <div style='-webkit-app-region: no-drag;' @dblclick="dblclickFunction"></div>
        </div>
        <div class="content">
            <div class="header">
                <el-card>
                    <el-row :gutter="40">
                        <el-form>
                            <el-col :span="12">
                                <el-form-item label="Apple开发者账号">
                                    <el-input v-model="id" placeholder="请输入Apple开发者账号" @change="idChange"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item>
                                    <div slot="label">
                                        开发者账号专用密码
                                    </div>
                                    <el-input v-model="password" placeholder="请输入开发者账号专用密码" @change="passwordChange"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-form>
                    </el-row>
                    <div class="remember">
                        <div><el-checkbox v-model="isRemember" @change="isRememberChange">记住账号密码</el-checkbox></div>
                        <div><el-button type="primary" @click="onSubmit">开始上传</el-button></div>
                    </div>
                </el-card>
            </div>
            <div class="input">
                <el-card style="height:100%;">
                    <div class="con">
                        <!-- <div class="con_header"> 
                            <el-radio-group v-model="typeCard">
                                <el-radio-button label="upload">上传文件</el-radio-button>
                                <el-radio-button label="history">上传记录</el-radio-button>
                            </el-radio-group>
                        </div> -->
                        <div class="con_con" v-if="typeCard == 'upload'">
                            <el-upload
                                v-if="!file"
                                class="upload"
                                style="width:100%;height:100%"
                                drag
                                :on-change='onChange'
                                action="https://www.241210.com"
                                :multiple='false'
                                :auto-upload='false'
                                accept='.ipa'
                            >
                                <div class="uploadText">
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                </div>
                            </el-upload>
                            <div v-else style="width:100%;height:100%;display:flex;flex-direction: column;">
                                <div style="color: #FB7299;margin-bottom:20px">已选择的文件</div>
                                <div class="fileList">
                                    <div style="flex:1;padding-right:40px">
                                        <div style="font-size:20px;font-weight:600">{{file.name}}</div>
                                        <div style="padding-top:10px">文件路径：{{file.path}}</div>
                                    </div>
                                    <div>
                                        <el-button type="text" @click="deleteFile"><i class="el-icon-delete"></i></el-button>
                                    </div>
                                </div>
                                <div style="padding-top:20px">
                                    上传信息
                                    <el-tooltip placement="top">
                                        <div slot="content"> 如果显示 No Error 则代表上传成功！</div>
                                        <i class="el-icon-warning-outline"></i>
                                    </el-tooltip>
                                </div>
                                <div style="height:0px;flex:1;overflow:auto">
                                    <p v-for="(value,index) in shellMessage" :key="index" style="padding:20px 0px" v-html="shellMessage"></p>
                                </div>
                            </div>
                        </div>
                        <div v-else class="con_con">
                            功能暂未开发
                        </div>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            id: '',
            password: '',
            isRemember: false,
            file: '',
            typeCard: 'upload',
            shellMessage: []
        }
    },
    methods: {
        dblclickFunction() {
            window.ipcRenderer.send('max');
        },
        onChange(file) {
            console.log(file,'213')
            this.file = file.raw;
            return false
        },
        deleteFile() {
            this.$confirm('确定要移除该文件吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.file = ''
                this.$notify({
                    title: '删除成功',
                    type: 'success'
                });
                this.shellMessage = [];
            }).catch(() => {
                this.$notify({
                    title: '已取消删除',
                    type: 'info'
                });     
            });
        },
        idChange() {
            if(!this.isRemember) return
            this.$ls.set('id', this.id);
        },
        passwordChange() {
            if(!this.isRemember) return
            this.$ls.set('password', this.password);
        },
        isRememberChange() {
            if(this.isRemember) {
                this.$ls.set('id', this.id);
                this.$ls.set('password', this.password);
            }else {
                this.$ls.set('id', '');
                this.$ls.set('password', '');
            }
        },
        onSubmit() {
            if(!this.id) {
                this.$notify({
                    title: 'Apple 开发者账号不能为空！',
                    type: 'error'
                });
                return
            }
            if(!this.password) {
                this.$notify({
                    title: '开发者账号专用密码不能为空！',
                    type: 'error'
                });
                return
            }

            if(!this.file) {
                this.$notify({
                    title: '请选择要上传的 ipa 文件！',
                    type: 'error'
                });
                return
            }

            this.$notify({
                title: '正在上传请稍等，注意上传信息！',
                type: 'info'
            });
            let that = this;
            let cmdStr1 = `xcrun altool --upload-app -f ${this.file.path} -u "${this.id}" -p "${this.password}"`
            let cmdPath = '/'
            // 子进程名称
            let workerProcess
            runExec(cmdStr1)
            function runExec (cmdStr) {
                workerProcess = window.exec(cmdStr, { cwd: cmdPath })
                // 打印正常的后台可执行程序输出
                workerProcess.stdout.on('data', function (data) {
                    console.log('stdout: ' + data)
                    that.shellMessage.push(data);
                })
                // 打印错误的后台可执行程序输出
                workerProcess.stderr.on('data', function (data) {
                    console.log('stderr: ' + data)
                    that.shellMessage.push(data);
                })
                // 退出之后的输出
                workerProcess.on('close', function (code) {
                    console.log('out code：' + code)
                    that.shellMessage.push(code);
                })
            }
        },
    },
    created() {
        // console.log(this.$ls.get('id'))
        if(this.$ls.get('id')) {
            this.isRemember = true;
        }
        this.id = this.$ls.get('id') || '';
        this.password = this.$ls.get('password') || '';
    }

}

</script>


<style lang="less">

#app {
    background-color: transparent;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    .top {
        height: 27px;
        background-color: @primary;
        -webkit-app-region: drag;
        display: flex;
        div {
            flex: 1;
        }
    }
    .content {
        height: 0px;
        padding: 15px;
        flex: 1;
        display: flex;
        flex-direction: column;
        .remember {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .input {
            height: 0px;
            padding-top: 20px;
            flex: 1;
            /deep/ .el-card__body {
                height: 100%;
                box-sizing: border-box;
            }
            .con {
                display: flex;
                width: 100%;
                height: 100%;
                flex-direction: column;
            }
            .con_con {
                height: 0px;
                flex: 1;
                .fileList {
                    padding: 20px;
                    border: 1px solid @primary;
                    border-radius: 5px;
                    display: flex;
                    align-items: center;
                    .el-icon-delete {
                        font-size: 20px;
                    }
                }
            }
            .upload {
                width: 100%;
                height: 100%;
                /deep/ .el-upload {
                    width: 100%;
                    height: 100%;
                    /deep/ .el-upload-dragger{
                        width: 100%;
                        height: 100%;
                        position: relative;
                    }
                }
                .uploadText {
                    position: absolute;
                    top: 0px;
                    left: 0px;
                    bottom: 0px;
                    right: 0px;
                    margin: auto;
                    width: 200px;
                    height: 200px;
                }
            }
        }
    }
}

</style>
