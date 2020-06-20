<template>
    <div>
        <Crumbs :items="[{title: '成员管理'},{title: '成员列表'}]" />
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.uname" placeholder="搜索内容" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button
                    type="primary"
                    icon="el-icon-lx-add"
                    @click="visible = true ; form = {}"
                >新建</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="uname" label="姓名"></el-table-column>
                <el-table-column prop="mobile" label="手机号"></el-table-column>
                <el-table-column prop="type" label="类型"></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">{{statusTxt[scope.row.status]}}</template>
                </el-table-column>
                <el-table-column prop="add_time" label="创建时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <el-dialog title="新增成员" :visible.sync="visible" width="30%">
            <el-form
                class="myform"
                style="padding-right: 30px;"
                ref="form"
                :model="form"
                label-width="100px"
            >
                <el-form-item label="姓名">
                    <el-input v-model="form.uname" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select style="width: 100%;" v-model="form.type" placeholder="请选择类型">
                        <el-option key="bbk" label="管理员" :value="1"></el-option>
                        <el-option key="xtc" label="运营员" :value="2"></el-option>
                        <el-option key="imoo" label="其它" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <span class="dialog-footer dialog-pwd">
                        <el-button type="primary" @click="save">保 存</el-button>
                        <el-button @click="visible = false">取 消</el-button>
                    </span>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
//import { fetchData } from '../../api/index';

import Crumbs from '../../components/common/Crumbs';
import request from '../../utils/request';
export default {
    name: 'membersIndex',
    data() {
        return {
            visible: false,
            tableData: [],
            multipleSelection: [],
            delList: [],
            pageTotal: 0,
            form: {
                uname: '',
                mobile: '',
                type: null
            },
            query: {
                p: 1,
                pNum: 10
            },
            statusTxt: ['禁用', '正常']
        };
    },
    components: {
        Crumbs
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            request('GET /manage/members', this.query).then(resp => {
                this.tableData = resp.items;
                this.pageTotal = resp.total || 10;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'p', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    //
                    //this.tableData.splice(index, 1);
                    request(`DELETE /manage/members/${row.id}`, {}).then(resp => {
                        if (resp.code == 0) {
                            this.getData();
                            this.$message.success('删除成功');
                        } else {
                            this.$message.error(resp.msg);
                        }
                    });
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 保存编辑
        save() {
            const { id } = this.form;
            const url = id > 0 ? `PUT /manage/members/${id}` : 'POST /manage/members';
            request(url, this.form).then(resp => {
                if (resp.code == 0) {
                    this.visible = false;
                    this.form = {};
                    this.getData();
                } else {
                    this.$message.error(resp.msg);
                }
            });
        },
        handleEdit(ndex, row) {
            this.visible = true;
            request(`GET /manage/members/${row.id}`).then(resp => {
                if (resp.code == 0) {
                    this.form = resp.item;
                }
            });
        },
        handlePageChange(p) {
            this.query.p = p;
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
