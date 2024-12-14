<template>
  <div>
    <el-tabs v-model="activePaneName">
      <el-tab-pane label="Models" name="managePane">
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
              <el-button
                icon="el-icon-search"
                @click="handleSearch"
                type="primary"
              >
                Search
              </el-button>
            </el-col>
            <el-col :span="8">
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="handleShowAddDialog"
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
            <el-table-column
              width="180"
              label="Title"
              prop="desp"
            ></el-table-column>
            <el-table-column label="Type" width="100">
              <template slot-scope="scope">
                <el-tag type="primary">{{ scope.row.typeName }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column width="120" label="Dir">
              <template slot-scope="scope">
                <el-tag type="info">{{ scope.row.dirName }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column width="120" label="Source File">
              <template slot-scope="scope">
                <el-tag type="success">{{ scope.row.src }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column width="120" label="mtl File">
              <template slot-scope="scope">
                <el-tag type="success">{{
                  scope.row.mtl === '' ? '\\' : scope.row.mtl
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column width="120" label="Craetor">
              <template slot-scope="scope">
                <el-tag type="info">{{ scope.row.hrName }}</el-tag>
              </template>
            </el-table-column>
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
            <el-table-column fixed="right" label="Operations" width="150">
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
                ></el-button>
                <el-button
                  size="mini"
                  @click="handleModelOpen(scope.row)"
                  type="info"
                  icon="el-icon-search"
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
        <el-dialog title="添加模型" :visible.sync="dialogFormVisibleForAdd">
          <el-form :model="modelForm" :label-width="formLabelWidth">
            <el-form-item label="模型类型">
              <el-select v-model="modelForm.type">
                <el-option
                  v-for="(item, index) in modelTypes"
                  :key="index"
                  :label="item.type"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="模型描述">
              <el-input v-model="modelForm.desp" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="文件夹名（建议只使用字母,数字命名）">
              <el-input
                v-model="modelForm.dirName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="资源文件名（建议只使用英文,数字命名）">
              <el-input v-model="modelForm.src" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item
              label="mtl文件名（建议只使用英文,数字命名）"
              v-show="mtl_input_show"
            >
              <el-input v-model="modelForm.mtl" autocomplete="off"></el-input>
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
            <el-form-item label="模型ID">
              <el-input
                v-model="updateRow.id"
                disabled
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="添加者">
              <el-input
                v-model="updateRow.hrId"
                disabled
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="模型类型">
              <el-select v-model="updateRow.type">
                <el-option
                  v-for="(item, index) in modelTypes"
                  :key="index"
                  :label="item.type"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="模型描述">
              <el-input v-model="updateRow.desp" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="模型所在文件夹">
              <el-input
                v-model="updateRow.dirName"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="模型文件名">
              <el-input v-model="updateRow.src" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item
              label="mtl文件名"
              v-show="update_dialog_mtl_input_show"
            >
              <el-input v-model="updateRow.mtl" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleUpdateCancle">取消</el-button>
            <el-button type="primary" @click="handleUpdateSubmit"
              >添加
            </el-button>
          </div>
        </el-dialog>
        <!-- 查看模型的dialog -->
        <el-dialog
          title="Preview"
          width="70%"
          :visible.sync="dialogVisibleForOpenModel"
        >
          <el-card>
            <model-three
              v-if="modelTypeNum == 1"
              :src="this.model_url_summary.json_url1"
            ></model-three>
            <model-obj
              v-if="modelTypeNum == 2"
              :src="this.model_url_summary.obj_url2"
            ></model-obj>
            <model-obj
              v-if="modelTypeNum == 3"
              :src="this.model_url_summary.obj_mtl_ourl3"
              :mtl="this.model_url_summary.obj_mtl_murl3"
            ></model-obj>
            <model-obj
              v-if="modelTypeNum == 4"
              :src="this.model_url_summary.fbx_url4"
            ></model-obj>
            <model-stl
              v-if="modelTypeNum == 5"
              :src="this.model_url_summary.stl_url5"
            ></model-stl>
            <model-collada
              v-if="modelTypeNum == 6"
              :src="this.model_url_summary.dae_url6"
            ></model-collada>
            <model-ply
              v-if="modelTypeNum == 7"
              :src="this.model_url_summary.ply_url7"
            ></model-ply>
            <model-gltf
              v-if="modelTypeNum == 8"
              :src="this.model_url_summary.gltf_url8"
            ></model-gltf>
          </el-card>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
  <!-- <div>
    <el-main>
      <model-gltf
        style="width:100%; height: 400px"
        src="/dae/model.gltf"
        backgroundColor="#000000"
        @on-progress="whenProgress"
        @on-error="whenError"
      ></model-gltf>
      <model-fbx
              src="/dae/model.fbx"
              style="width: 100%; height: 400px"
            ></model-fbx>
      <model-collada src="/dae/model.dae"> </model-collada>
    </el-main>
  </div> -->
</template>

<script>
import {
  ModelGltf,
  ModelFbx,
  ModelPly,
  ModelCollada,
  ModelStl,
  ModelObj,
  ModelThree,
} from 'vue-3d-model'
export default {
  name: 'Map3D',
  components: {
    ModelGltf,
    ModelFbx,
    ModelPly,
    ModelCollada,
    ModelStl,
    ModelObj,
    ModelThree,
  },
  data() {
    return {
      activePaneName: 'managePane',
      keyword: '',
      a: 1,
      keyword: '',
      tableData: [],
      total: 15,
      pageSize: 5,
      pageNum: 1,
      dialogFormVisibleForUpdate: false,
      dialogFormVisibleForAdd: false,
      dialogVisibleForOpenModel: false,
      modelTypes: [],
      modelForm: {
        desp: '',
        link: '',
        total: 99,
      },
      formLabelWidth: '280px',
      updateRow: {},
      model_url_summary: {
        json_url1: '',
        obj_url2: '',
        obj_mtl_ourl3: '',
        obj_mtl_murl3: '',
        fbx_url4: '',
        stl_url5: '',
        dae_url6: '',
        ply_url7: '',
        gltf_url8: '',
      },
      modelTypeNum: 0,
    }
  },
  created() {
    this.handleChange()
  },
  mounted() {},
  computed: {
    mtl_input_show() {
      if (this.modelForm.type == 3) return true
      else false
    },
    update_dialog_mtl_input_show() {
      if (this.updateRow.type == 3) return true
      else return false
    },
  },
  methods: {
    whenProgress(e) {
      console.log('on progress = ', e)
    },
    whenError(e) {
      console.log('on error = ', e)
    },
    // open model
    handleModelOpen(row) {
      this.modelTypeNum = 0
      this.model_url_summary = {}
      this.dialogVisibleForOpenModel = true
      let src_url = '/map/3d/model/' + row.dirName + '/' + row.src
      let mtl_url = '/map/3d/model/' + row.dirName + '/' + row.mtl
      if (row.type == 1) {
        this.modelTypeNum = 1
        this.model_url_summary.json_url1 = src_url
      } else if (row.type == 2) {
        this.modelTypeNum = 2
        this.model_url_summary.obj_url2 = src_url
      } else if (row.type == 3) {
        this.modelTypeNum = 3
        this.model_url_summary.obj_mtl_ourl3 = src_url
        this.model_url_summary.obj_mtl_murl3 = mtl_url
      } else if (row.type == 4) {
        this.modelTypeNum = 4
        this.model_url_summary.fbx_url4 = src_url
      } else if (row.type == 5) {
        this.modelTypeNum = 5
        this.model_url_summary.stl_url5 = src_url
      } else if (row.type == 6) {
        this.modelTypeNum = 6
        this.model_url_summary.dae_url6 = src_url
      } else if (row.type == 7) {
        this.modelTypeNum = 7
        this.model_url_summary.ply_url7 = src_url
      } else if (row.type == 8) {
        this.modelTypeNum = 8
        this.model_url_summary.gltf_url8 = src_url
      } else {
        alert('出错了～～')
      }
      console.log('load which model => ', this.model_url_summary)
    },
    // search
    handleSearch() {
      this.handleCurrentChange()
    },
    // update
    handleUpdateCancle() {
      this.dialogFormVisibleForUpdate = false
    },
    handleUpdateSubmit() {
      if (this.updateRow.type != 3) this.updateRow.mtl = ''
      this.putRequest('/map/3d/', this.updateRow)
        .then((resp) => {
          console.log(resp)
          this.handleChange()
        })
        .catch(() => {})
      this.dialogFormVisibleForUpdate = false
    },
    showDialgAndUpdate(row) {
      this.getRequest('/map/3d/types/').then((resp) => {
        if (resp) {
          this.modelTypes = resp.data
          this.dialogFormVisibleForUpdate = true
          // 深拷贝
          this.updateRow = JSON.parse(JSON.stringify(row))
        }
      })
    },
    // delete
    handleRowDelete(id) {
      this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deleteRequest('/map/3d/' + id + '/').then((resp) => {
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
    handleShowAddDialog() {
      this.modelForm = {
        type: 1,
      }
      this.getRequest('/map/3d/types/').then((resp) => {
        if (resp) {
          this.modelTypes = resp.data
          this.dialogFormVisibleForAdd = true
        }
      })
    },
    handleAddSubmit() {
      this.dialogFormVisibleForAdd = false
      this.postRequest('/map/3d/', this.modelForm).then((resp) => {
        console.log(resp)
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
      this.getRequest('/map/3d/', {
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

<style>
.desp-card {
  width: 680px;
}
.text {
  font-size: 16px;
}

.item {
  margin-bottom: 10px;
}
</style>
