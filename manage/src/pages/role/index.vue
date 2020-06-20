<template>
    <div>
        <Crumbs :items="[{title: '成员管理'},{title: '成员类型'}]" />
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.wk" placeholder="搜索内容" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="jump('/role/add')">新建</el-button>
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
                <el-table-column prop="name" label="类型名称"></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">{{statusTxt[scope.row.status]}}</template>
                </el-table-column>
                <el-table-column prop="add_time" label="创建时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="jump(`/role/edit/${scope.row.id}`)"
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
    </div>
</template>

<script>
//import { fetchData } from '../../api/index';

import Crumbs from '../../components/common/Crumbs';
import request from '../../utils/request';
export default {
    name: 'roleIndex',
    data() {
        return {
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
            request('GET /manage/role', this.query).then(resp => {
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
                    request(`DELETE /manage/role/${row.id}`, {}).then(resp => {
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
            request('POST /manage/members', this.form).then(resp => {
                if (resp.code == 0) {
                    this.form = {};
                    this.getData();
                } else {
                    this.$message.error(resp.msg);
                }
            });
        },
        handleEdit(ndex, row) {
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
