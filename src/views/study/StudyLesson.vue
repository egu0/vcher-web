<template>
  <div>
    <!-- 头部 -->
    <el-container>
      <el-row type="flex" :gutter="20">
        <el-col :span="20">
          <el-input
            v-model="keyword"
            prefix-icon="el-icon-search"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="8">
          <el-button icon="el-icon-search" @click="handleSearch" type="primary">
            Search
          </el-button>
        </el-col>
        <el-col :span="8">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="dialogFormVisibleForAdd = true"
          >
            Add
          </el-button>
        </el-col>
      </el-row>
    </el-container>
    <!-- 表格 -->
    <el-container>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <!-- <el-table-column prop="id" label="记录ID" fixed="left" width="80">
        </el-table-column> -->
        <el-table-column prop="desp" label="Describe" width="400">
        </el-table-column>
        <el-table-column label="Link" width="60">
          <template slot-scope="scope">
            <a :href="scope.row.link" target="_blank">
              <i class="el-icon-link"></i>
            </a>
          </template>
        </el-table-column>
        <el-table-column width="80" label="Total">
          <template slot-scope="scope">
            <el-tag type="info">{{ scope.row.total }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="90" label="Completed">
          <template slot-scope="scope">
            <el-tag type="primary">{{ scope.row.finished }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="hr"
          width="100"
          label="Creator"
        ></el-table-column>
        <el-table-column width="180" label="Created Time">
          <template slot-scope="scope">
            <el-tag type="primary">{{ scope.row.insertTime }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="180" label="Updated Time">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.updateTime }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Operation" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              circle=""
              @click="showDialgAndUpdate(scope.row)"
            >
            </el-button>
            <el-button
              size="mini"
              @click="handleRowDelete(scope.row.id)"
              type="danger"
              icon="el-icon-delete"
              circle
            ></el-button
          ></template>
        </el-table-column>
      </el-table>
    </el-container>
    <!-- 分页 -->
    <el-container>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page="pageNum"
        :total="total"
        :hide-on-single-page="true"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-container>
    <!-- 添加对话框 -->
    <el-dialog title="添加课程" :visible.sync="dialogFormVisibleForAdd">
      <el-form :model="lessonForm" :label-width="formLabelWidth">
        <el-form-item label="课程名">
          <el-input v-model="lessonForm.desp" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="lessonForm.link" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="总数量">
          <el-input
            v-model="lessonForm.total"
            type="number"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddCancle">取消</el-button>
        <el-button type="primary" @click="handleAddSubmit">添加 </el-button>
      </div>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog title="修改课程" :visible.sync="dialogFormVisibleForUpdate">
      <el-form :model="updateRow" :label-width="formLabelWidth" size="mini">
        <el-form-item label="课程ID">
          <el-input
            v-model="updateRow.id"
            disabled
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="添加者">
          <el-input
            v-model="updateRow.hr"
            disabled
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="课程名">
          <el-input v-model="updateRow.desp" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="updateRow.link" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="总数量">
          <el-input
            v-model="updateRow.total"
            type="number"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="完成的数量">
          <el-input
            v-model="updateRow.finished"
            type="number"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleUpdateCancle">取消</el-button>
        <el-button type="primary" @click="handleUpdateSubmit">添加 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'StudyLesson',
  data() {
    return {
      keyword: '',
      a: 1,
      keyword: '',
      tableData: [],
      total: 15,
      pageSize: 5,
      pageNum: 1,
      dialogFormVisibleForUpdate: false,
      dialogFormVisibleForAdd: false,
      lessonForm: {
        desp: '',
        link: '',
        total: 99,
      },
      formLabelWidth: '100px',
      updateRow: {},
    }
  },
  created() {
    this.handleChange()
  },
  methods: {
    // search
    handleSearch() {
      this.handleCurrentChange()
    },
    // update
    handleUpdateCancle() {
      this.dialogFormVisibleForUpdate = false
      this.updateRow = {}
    },
    handleUpdateSubmit() {
      this.putRequest('/study/lesson/', this.updateRow)
        .then((resp) => {
          console.log(resp)
          this.updateRow = {}
          this.handleChange()
        })
        .catch(() => {
          this.updateRow = {}
        })
      this.dialogFormVisibleForUpdate = false
    },
    showDialgAndUpdate(row) {
      this.dialogFormVisibleForUpdate = true
      // 深拷贝
      this.updateRow = JSON.parse(JSON.stringify(row))
    },
    // delete
    handleRowDelete(id) {
      this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deleteRequest('/study/lesson/' + id + '/').then((resp) => {
            console.log(resp)
            this.handleChange()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // add
    handleAddSubmit() {
      this.dialogFormVisibleForAdd = false
      this.postRequest('/study/lesson/', this.lessonForm).then((resp) => {
        console.log(resp)
        this.lessonForm = {
          desp: '',
          link: '',
          total: 99,
        }
        this.handleChange()
      })
    },
    handleAddCancle() {
      this.dialogFormVisibleForAdd = false
      this.lessonForm = {
        desp: '',
        link: '',
        total: 99,
      }
    },
    // select
    handleChange() {
      this.getRequest('/study/lesson/', {
        size: this.pageSize,
        page: this.pageNum,
        keyword: this.keyword,
      }).then((resp) => {
        console.log(resp)
        if (resp) {
          this.tableData = resp.data
          this.total = resp.total
        }
      })
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.handleChange()
    },
  },
}
</script>

<style></style>
