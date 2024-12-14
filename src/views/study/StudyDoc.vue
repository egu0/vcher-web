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
          <el-button type="primary" icon="el-icon-plus" @click="openAddDialog">
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
        <el-table-column prop="desp" label="Title" width="200">
        </el-table-column>
        <el-table-column prop="fName" label="Original File Name" width="250">
        </el-table-column>
        <el-table-column label="Download" width="80">
          <template slot-scope="scope">
            <a :href="scope.row.link" target="_blank">
              <i class="el-icon-download"></i>
            </a>
          </template>
        </el-table-column>
        <el-table-column
          prop="hrName"
          width="150"
          label="Creator"
        ></el-table-column>
        <el-table-column width="280" label="Uploaded Time">
          <template slot-scope="scope">
            <el-tag type="primary">{{ scope.row.insertTime }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="280" label="Updated Time">
          <template slot-scope="scope">
            <el-tag type="primary">{{ scope.row.updateTime }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Operations" width="200">
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
    <el-dialog title="添加文档" :visible.sync="dialogFormVisibleForAdd">
      <el-form :model="docForm" :label-width="formLabelWidth">
        <el-form-item label="描述">
          <el-input v-model="docForm.desp" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上传文件">
          <el-upload
            ref="upload"
            :limit="1"
            :on-exceed="handleUploadExceed"
            :action="filesUploadUrl"
            :on-success="filesUploadSuccess"
            :on-remove="handleFileRemove"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传一个文件，且不超过10MB
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddCancle">取消</el-button>
        <el-button type="primary" @click="handleAddSubmit">添加 </el-button>
      </div>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog title="修改文档信息" :visible.sync="dialogFormVisibleForUpdate">
      <el-form :model="updateRow" :label-width="formLabelWidth" size="mini">
        <el-form-item label="文档ID">
          <el-input
            v-model="updateRow.id"
            disabled
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="添加者">
          <el-input
            v-model="updateRow.hrName"
            disabled
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="文件名">
          <el-input
            v-model="updateRow.fName"
            disabled
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="链接">
          <el-input
            v-model="updateRow.link"
            disabled
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述信息">
          <el-input v-model="updateRow.desp" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="更改文件">
          <el-upload
            ref="reupload"
            :limit="1"
            :on-error="filesReUploadError"
            :action="filesUploadUrl"
            :on-success="filesReUploadSuccess"
          >
            <el-button size="small" type="primary">点击更改</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传一个文件，且不超过10MB
            </div>
          </el-upload>
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
      filesUploadUrl: '/study/doc/upload/',
      keyword: '',
      a: 1,
      keyword: '',
      tableData: [],
      total: 15,
      pageSize: 5,
      pageNum: 1,
      dialogFormVisibleForUpdate: false,
      dialogFormVisibleForAdd: false,
      docForm: {
        desp: '',
        link: '',
      },
      formLabelWidth: '100px',
      updateRow: {},
    }
  },
  created() {
    this.handleChange()
  },
  methods: {
    // fileupload
    handleFileRemove() {
      let d = this.docForm.desp
      this.docForm = {
        desp: d,
      }
    },
    handleUploadExceed() {
      console.log('exceed!')
    },
    filesUploadSuccess(resp) {
      console.log(resp)
      if (resp && resp.status == 200) {
        let d = this.docForm.desp
        this.docForm = resp.obj
        this.docForm.desp = d
      }
    },
    // search
    handleSearch() {
      this.handleCurrentChange()
    },
    // update
    filesReUploadError() {
      this.$message.error('上传失败！')
    },
    filesReUploadSuccess(resp) {
      if (resp && resp.status == 200) {
        let tmp = {
          id: this.updateRow.id,
          desp: this.updateRow.desp,
          hrName: this.updateRow.hrName,
          hrId: this.updateRow.hrId,
          link: resp.obj.link,
          fName: resp.obj.fName,
          uploadTime: resp.obj.uploadTime,
        }
        this.updateRow = tmp
      }
    },
    handleUpdateCancle() {
      this.dialogFormVisibleForUpdate = false
      this.updateRow = {}
    },
    handleUpdateSubmit() {
      this.putRequest('/study/doc/', this.updateRow)
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
      if (this.$refs['reupload']) {
        this.$refs['reupload'].clearFiles()
      }
    },
    // delete
    handleRowDelete(id) {
      this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deleteRequest('/study/doc/' + id + '/').then((resp) => {
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
    openAddDialog() {
      this.dialogFormVisibleForAdd = true
      this.docForm = {
        desp: '',
      }
      if (this.$refs['upload']) {
        this.$refs['upload'].clearFiles()
      }
    },
    handleAddSubmit() {
      this.dialogFormVisibleForAdd = false
      this.postRequest('/study/doc/', this.docForm).then((resp) => {
        console.log(resp)
        this.handleChange()
      })
    },
    handleAddCancle() {
      this.dialogFormVisibleForAdd = false
    },
    // select
    handleChange() {
      this.getRequest('/study/doc/', {
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
