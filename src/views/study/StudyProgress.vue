<template>
  <div>
    <el-tabs v-model="activePaneName" @tab-click="handleTabClick">
      <el-tab-pane label="Display" name="pDisplay">
        <el-card class="box-card">
          <el-container>
            <div
              id="mainDisplayPane"
              style="width: 100% ;height: 400px"
              ref="echartsDisplay"
            ></div>
          </el-container>
          <!-- 分页 -->
          <el-container>
            <el-pagination
              background
              layout="prev, pager, next"
              :page-size="pageSize"
              :current-page="chartPageNumber"
              :total="chartTotal"
              :hide-on-single-page="true"
              @current-change="handleCurrentChartChange"
            >
            </el-pagination>
          </el-container>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="Management" name="pManage">
        <div>
          <!-- 头部 -->
          <el-container>
            <el-row type="flex" :gutter="20">
              <el-col :span="20">
                <el-input
                  v-model="keyword"
                  placeholder="根据备注进行搜索..."
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
                  搜索
                </el-button>
              </el-col>
              <el-col :span="8">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  @click="dialogFormVisibleForAdd = true"
                >
                  添加
                </el-button>
              </el-col>
            </el-row>
          </el-container>
          <!-- 表格 -->
          <el-container>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column type="index" width="50" label="#">
              </el-table-column>
              <!-- <el-table-column prop="id" label="记录ID" fixed="left" width="80">
        </el-table-column> -->
              <el-table-column label="日期" width="150">
                <template slot-scope="scope">
                  <el-tag type="primary">{{ scope.row.tDate }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="进度" width="120">
                <template slot-scope="scope">
                  <el-tag type="primary">{{ scope.row.tProgress }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="备注" prop="remark" width="300">
              </el-table-column>
              <el-table-column width="180" label="记录者">
                <template slot-scope="scope">
                  <el-tag type="info">{{ scope.row.hrName }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column width="180" label="最新修改时间">
                <template slot-scope="scope">
                  <el-tag type="primary">{{ scope.row.lastUpdateTime }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="150">
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
          <el-dialog title="添加进度" :visible.sync="dialogFormVisibleForAdd">
            <el-form :model="progressForm" :label-width="formLabelWidth">
              <el-form-item label="请选择日期（不能与已有的重复）">
                <el-date-picker
                  v-model="progressForm.tDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="请输入进度（用0～100表示）">
                <el-input
                  type="number"
                  v-model="progressForm.tProgress"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="progressForm.remark"
                  type="textarea"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="handleAddCancle">取消</el-button>
              <el-button type="primary" @click="handleAddSubmit"
                >添加
              </el-button>
            </div>
          </el-dialog>
          <!-- 修改对话框 -->
          <el-dialog
            title="修改进度信息"
            :visible.sync="dialogFormVisibleForUpdate"
          >
            <el-form
              :model="updateRow"
              :label-width="formLabelWidth"
              size="mini"
            >
              <el-form-item label="进度记录ID">
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
              <el-form-item label="日期">
                <el-input
                  v-model="updateRow.tDate"
                  disabled
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="进度（用0～100表示）">
                <el-input
                  type="number"
                  v-model="updateRow.tProgress"
                  autocomplete="off"
                  max="100"
                  min="0"
                ></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="updateRow.remark"
                  type="textarea"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="handleUpdateCancle">取消</el-button>
              <el-button type="primary" @click="handleUpdateSubmit"
                >添加
              </el-button>
            </div>
          </el-dialog>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'StudyLesson',
  data() {
    return {
      // activePaneName: 'pManage',
      activePaneName: 'pDisplay',
      keyword: '',
      tableData: [],
      total: 15,
      pageSize: 7,
      pageNum: 1,
      dialogFormVisibleForUpdate: false,
      dialogFormVisibleForAdd: false,
      progressForm: {
        tProgress: 50,
        remark: '',
        tDate: '',
      },
      formLabelWidth: '250px',
      updateRow: {},
      /////////////////////
      myChart: null,
      chartTitle: 'Daily Progress',
      chartPageNumber: 1,
      chartXArr: [
        '2022-02-13',
        '2022-02-14',
        '2022-02-22',
        '2022-02-24',
        '2022-02-26',
        '2022-02-27',
        '2022-02-28',
      ],
      chartYArr: [50, 100, 60, 50, 20, 90, 100],
      chartTotal: 12,
    }
  },
  created() {
    // setOption，显示图表
    this.handleChartChange()
  },
  mounted() {
    // 初始化 echarts 图表
    this.initEcharts()
  },
  methods: {
    // 初始化数据统计图
    initEcharts() {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$echarts.init(this.$refs.echartsDisplay)
    },
    repaintEcharts() {
      // 绘制图表
      this.myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
        },
        title: {
          text: this.chartTitle,
        },
        xAxis: [
          {
            name: 'Date',
            data: this.chartXArr,
          },
        ],
        yAxis: {
          type: 'value',
          //name: '进度',
          min: 0,
          max: 100,
        },
        series: [
          {
            name: '进度',
            smooth: true,
            type: 'line',
            data: this.chartYArr,
          },
        ],
      })
    },
    // tab
    handleTabClick(tab) {
      if (tab.index == 1) {
        // 进度管理，到第一页
        this.handleCurrentChange(1)
      }
      if (tab.index == 0) {
        // 数据展示
        this.handleChartChange()
      }
    },
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
      this.putRequest('/study/progress/', this.updateRow)
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
          this.deleteRequest('/study/progress/' + id + '/').then((resp) => {
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
      this.postRequest('/study/progress/', this.progressForm).then((resp) => {
        console.log(resp)
        this.progressForm = {
          tProgress: 50,
          remark: '',
          tDate: '',
        }
        this.handleChange()
      })
    },
    handleAddCancle() {
      this.dialogFormVisibleForAdd = false
      this.progressForm = {
        tProgress: 50,
        remark: '',
        tDate: '',
      }
    },
    // select
    handleChange() {
      this.getRequest('/study/progress/', {
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
    handleChartChange() {
      this.getRequest('/study/progress/echarts/', {
        page: this.chartPageNumber,
        size: this.pageSize,
      }).then((resp) => {
        console.log(resp)
        this.chartTotal = resp.obj.total
        this.chartXArr = resp.obj.xarr
        this.chartYArr = resp.obj.yarr
        this.repaintEcharts()
      })
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.handleChange()
    },
    handleCurrentChartChange(val) {
      this.chartPageNumber = val
      this.handleChartChange()
    },
  },
}
</script>

<style></style>
