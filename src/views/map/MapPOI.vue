<template>
  <div>
    <el-tabs
      v-model="activePaneName"
      @tab-click="handleTabClick"
      :before-leave="checkTabChange"
    >
      <el-tab-pane label="Maps" name="managePane">
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
              <el-table-column type="index" width="50" label="#">
              </el-table-column>
              <!-- <el-table-column prop="id" label="记录ID" fixed="left" width="80">
        </el-table-column> -->
              <el-table-column label="Remark" prop="remark" width="200">
              </el-table-column>
              <el-table-column width="100" label="Creator">
                <template slot-scope="scope">
                  <el-tag type="primary">{{ scope.row.hrName }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="Scale Level" width="100">
                <template slot-scope="scope">
                  <el-tag type="info">{{ scope.row.zoom }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="Point (lng & lat in BD09)" width="300">
                <template slot-scope="scope">
                  <el-tag type="info">{{
                    scope.row.lng + ', ' + scope.row.lat
                  }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column width="180" label="Updated Time">
                <template slot-scope="scope">
                  <el-tag type="success">{{ scope.row.updateTime }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column width="180" label="Created Time">
                <template slot-scope="scope">
                  <el-tag type="primary">{{ scope.row.insertTime }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="Operations" width="180">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    circle
                    @click="showDialgAndUpdate(scope.row)"
                  >
                  </el-button>
                  <el-button
                    circle
                    size="mini"
                    @click="handleRowDelete(scope.row.id)"
                    type="danger"
                    icon="el-icon-delete"
                  ></el-button>
                  <el-button
                    circle
                    size="mini"
                    @click="handleBeginEdit(scope.row.id)"
                    type="success"
                    icon="el-icon-right"
                  ></el-button>
                </template>
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
          <el-dialog title="添加地图" :visible.sync="dialogFormVisibleForAdd">
            <el-form :model="mapForm" :label-width="formLabelWidth">
              <el-form-item label="请输入BD09类型坐标的纬度">
                <el-input
                  type="number"
                  v-model="mapForm.lat"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="请输入BD09类型坐标的经度">
                <el-input
                  type="number"
                  v-model="mapForm.lng"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="请输入地图缩放等级(4-19)">
                <el-input
                  type="number"
                  v-model="mapForm.zoom"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="mapForm.remark"
                  type="textarea"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="handleAddCancle">取消</el-button>
              <el-button type="primary" @click="handleAddSubmit"
                >Add
              </el-button>
            </div>
          </el-dialog>
          <!-- 修改对话框 -->
          <el-dialog
            title="修改地图信息"
            :visible.sync="dialogFormVisibleForUpdate"
          >
            <el-form
              :model="updateRow"
              :label-width="formLabelWidth"
              size="mini"
            >
              <el-form-item label="地图ID">
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
              <el-form-item label="BD09类型坐标的纬度">
                <el-input
                  type="number"
                  v-model="updateRow.lat"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="BD09类型坐标的经度">
                <el-input
                  type="number"
                  v-model="updateRow.lng"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="缩放等级(4-19)">
                <el-input
                  type="number"
                  v-model="updateRow.zoom"
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
      <el-tab-pane label="Edit" name="editPane">
        <el-card class="box-card">
          <el-header style="height: 30px">
            <!-- <el-input
              type="text"
              v-model="mapRemark"
              maxlength="200"
              style="width:400px"
              disabled
            ></el-input> -->
            <el-tag size="medium" style="width: 210px;">{{
              computed_map_remark
            }}</el-tag>
            <el-button
              style="margin-left: 10px"
              type="warning"
              @click="clearAllOverlays"
              :disabled="isEditPaneActive == false"
              >清空地图(不会保存)</el-button
            >
            <el-button
              :type="keepStatusBtnType"
              @click="goToKeepAllData"
              :disabled="isEditPaneActive == false || keepStatus == 1"
              >{{ keepStatusBtnVal }}</el-button
            >
          </el-header>
          <el-main> <div id="map_canvas" style="height: 390px"></div></el-main>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ///////// 编辑地图所用到的对象
      map: null, //地图对象
      overlays: [], // 存放已经绘制的覆盖物
      infoWindow: [], //消息窗体对象
      drawingManager: null, //绘制管理器对象
      /////// 地图相关配置信息
      infoWindowOptions: {
        width: 300,
        height: 150,
        title: 'INFO',
      },
      //////// 编辑地图使用的数据信息
      markers: [
        {
          pt: {
            lng: 123,
            lat: 40,
          },
          address: '',
          remark: '标注',
          overlay: {}, //标注点对象
        },
      ],
      cache: {
        1646238488747: {}, // 模拟缓存，存放 【ts: overlay】
      },
      //////// 编辑地图功能的状态信息
      isEditPaneActive: false, // 是否可用
      mapId: -1, // 地图ID
      mapRemark: '',
      keepStatus: 1, // 保存状态。0 未保存、1 已保存
      // 嵌套三元表达式，有点不雅观
      keepStatusBtnType: 'success',
      keepStatusBtnVal: '地图已保存',
      //////// 管理界面用到的信息
      activePaneName: 'managePane', // editPane / managePane
      keyword: '',
      tableData: [],
      total: 15,
      pageSize: 5,
      pageNum: 1,
      dialogFormVisibleForUpdate: false,
      dialogFormVisibleForAdd: false,
      mapForm: {
        zoom: 17,
        remark: '',
        lat: 40.225234327805275,
        lng: 116.2550699295006,
      },
      formLabelWidth: '200px',
      updateRow: {},
    }
  },
  watch: {
    mapRemark(new_, old_) {
      if (!this.isEditPaneActive) return
      // console.log('watch mapRemark changed', new_, old_)
      // this.whenMapChanged()
    },
  },
  computed: {
    computed_map_remark() {
      if (this.mapRemark) {
        let len = this.mapRemark.length
        if (len > 15) {
          return this.mapRemark.slice(0, 15) + '...'
        } else {
          return this.mapRemark
        }
      } else {
        return 'unnamed map'
      }
    },
  },
  created() {},
  mounted() {
    this.handleChange()
    // this.loadAndEditBaiduMap(1)
  },
  methods: {
    // tab 切换
    handleTabClick(tab) {
      // 手动切换到【地图编辑】
      if (tab.index == 1) {
        this.$message({
          type: 'info',
          message: this.isEditPaneActive
            ? '请继续编辑'
            : '请从【地图管理】中选择地图并点击【->】进行编辑',
        })
      }
      // 由【地图编辑】切换到【地图管理】。主要逻辑体现在 checkTabChange 钩子函数：在切换前检查是否修改
      if (tab.index == 0) {
        console.log('handle tab click')
        this.handleChange()
      }
    },
    checkTabChange(new_active, old_active) {
      if (new_active === 'editPane' || new_active === 'despPane') return true
      if (new_active === 'managePane' && this.keepStatus == 1) return true
      return new Promise((reso, rejct) => {
        this.$confirm('是否保存已修改的地图?', '提示', {
          distinguishCancelAndClose: true, // 区分cancel和close
          confirmButtonText: '保存',
          cancelButtonText: '不保存',
          type: 'warning',
        })
          .then(() => {
            this.keepAllData()
            setTimeout(() => {
              reso()
            }, 500)
          })
          .catch((action) => {
            if (action === 'cancel') {
              reso()
            } else {
              this.$message({
                type: 'info',
                message: '已取消操作',
              })
              rejct() // 取消跳转
            }
          })
      })
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
      this.putRequest('/map/poi/', this.updateRow)
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
          this.deleteRequest('/map/poi/' + id + '/').then((resp) => {
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
      this.mapForm = {
        zoom: 17,
        remark: '默认地址是中国石油大学(BJ)～',
        lat: 40.225234327805275,
        lng: 116.2550699295006,
      }
      this.dialogFormVisibleForAdd = true
    },
    handleAddSubmit() {
      this.dialogFormVisibleForAdd = false
      this.postRequest('/map/poi/', this.mapForm).then((resp) => {
        console.log(resp)
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
      this.getRequest('/map/poi/', {
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
    handleBeginEdit(id) {
      this.checkAndload(id)
    },

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////    分割线                    //////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //获取地图信息，用于存储数据库
    getMapInfo() {
      let overlays_data = []
      for (var i = 0; this.markers && i < this.markers.length; i++) {
        let m = this.markers[i]
        overlays_data.push({
          remark: m.remark,
          address: m.address,
          pt: {
            lng: m.pt.lng,
            lat: m.pt.lat,
          },
        })
      }
      console.log('markers data to upload & store=', overlays_data)
      let zoom = this.map.getZoom()
      let center = this.map.getCenter()
      return {
        id: this.mapId,
        remark: this.mapRemark,
        zoom,
        lat: center.lat,
        lng: center.lng,
        data: JSON.stringify(overlays_data),
      }
    },
    changePane() {
      if (this.activePaneName == 'editPane') this.activePaneName = 'managePane'
      else if (this.activePaneName == 'managePane')
        this.activePaneName = 'editPane'
    },
    // 加载数据并展示地图
    initAndLoadBMap(id) {
      this.getRequest('/map/poi/' + id + '/').then((resp) => {
        if (resp.status == 200) {
          let map = resp.obj
          if (!map || map == null) {
            this.alertBug('加载地图数据出错，bug修复')
          }
          console.log('got a map obj-', id, map)
          this.mapId = map.id
          this.mapRemark = map.remark
          let { lat, lng } = {
            lat: parseFloat(map.lat),
            lng: parseFloat(map.lng),
          }
          let zoom = map.zoom
          let data = JSON.parse(map.data)
          this.isEditPaneActive = true
          this.mapHandle(zoom, { lat, lng }, data)
          this.changePane() // 切换到地图编辑标签页
        }
      })
    },
    checkAndload(id) {
      // 1、第一次打开或之前的已保存
      if (
        !this.isEditPaneActive ||
        (this.isEditPaneActive && this.keepStatus == 1 && id != this.mapId)
      ) {
        this.initAndLoadBMap(id)
        return
      }

      // 2、同一个地图
      if (this.isEditPaneActive && id == this.mapId) {
        this.getRequest('/map/poi/' + id + '/').then((resp) => {
          if (resp.status == 200) {
            this.mapRemark = resp.obj.remark
            this.$message({
              type: 'primary',
              message: '请继续编辑本张地图～',
            })
            this.changePane()
          }
        })
      }

      // 3、之前打开的未保存
      if (this.isEditPaneActive && this.keepStatus == 0 && id != this.mapId) {
        this.$confirm('上一张编辑的地图有修改并且还未保存, 是否保存?', '提示', {
          distinguishCancelAndClose: true, // 区分cancel和close
          confirmButtonText: '去保存',
          cancelButtonText: '不保存，这就去编辑',
          type: 'warning',
        })
          .then(() => {
            this.changePane()
          })
          .catch((action) => {
            if (action === 'cancel') {
              this.initAndLoadBMap(id)
            } else {
              this.$message({
                type: 'info',
                message: '已取消操作',
              })
            }
          })
      }
    },
    // 初始化地图
    mapHandle(zoom, pt, my_obj_array) {
      console.log('go build map', zoom, pt, my_obj_array)
      this.clearAllMapData(this) //清除数据
      //document.getElementById('map_canvas').innerHTML = ''
      console.log('go to instance')
      let map = new BMap.Map('map_canvas')
      var poi = new BMap.Point(pt.lng, pt.lat)
      map.centerAndZoom(poi, zoom)
      map.enableScrollWheelZoom(true) //开启鼠标滚轮缩放
      // 添加控件
      map.addControl(new BMap.NavigationControl()) //移动和缩放
      map.addControl(new BMap.ScaleControl()) //比例尺
      // 缩略图
      map.addControl(
        new BMap.OverviewMapControl({
          // isOpen: true, // 默认打开
        })
      )
      //地图类型控制
      map.addControl(
        new BMap.MapTypeControl({
          mapTypes: [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP, BMAP_HYBRID_MAP],
        })
      )
      // 重设
      map.setCenter(new BMap.Point(pt.lng, pt.lat))
      map.setZoom(zoom)
      // 将map实例加入data中
      this.map = map
      //map.setCurrentCity('北京') // 仅当设置城市信息时，MapTypeControl的切换功能才能可用
      // 添加组件
      for (let i = 0; i < my_obj_array.length; i++) {
        const elt = my_obj_array[i]
        console.log('elt-', i, elt)
        this.addMaker(elt)
      }
      let _this = this
      map.addEventListener('zoomend', function(type, target) {
        _this.whenMapChanged()
      })
      map.addEventListener('moveend', function(type, target) {
        _this.whenMapChanged()
      })
      this.addMapDrawTools() // 添加绘图控件
      //创建InfoWindows对象
      this.infoWindow = new BMap.InfoWindow('', this.infoWindowOptions)
      this.addListenerToInfoWindow() // 给infowindow添加事件监听
    },
    geocoder(pt) {
      return new Promise((s, e) => {
        // 异步逻辑
        var myGeo = new BMap.Geocoder({ extensions_town: true })
        myGeo.getLocation(new BMap.Point(pt.lng, pt.lat), function(result) {
          if (result) {
            let rs = result.addressComponents
            let address =
              rs.province +
              '' +
              rs.city +
              '' +
              rs.district +
              '' +
              rs.town +
              '' +
              rs.street +
              '' +
              rs.streetNumber
            s(address)
          } else {
            e('地址获取失败(>﹏<)')
          }
          // })
          // } catch (err) {}
          // s(address)
        })
      })
    },
    // 添加绘图工具，包括图形绘制结束的事件处理
    addMapDrawTools() {
      // 参考：http://api.map.baidu.com/library/DrawingManager/1.4/docs/symbols/BMapLib.DrawingManager.html
      let _this = this
      //实例化鼠标绘制工具
      var drawingManager = new BMapLib.DrawingManager(this.map, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
          anchor: BMAP_ANCHOR_BOTTOM_RIGHT, //位置
          offset: new BMap.Size(5, 5), //偏离值
        },
      })
      drawingManager.enableCalculate() // 开启面积计算
      // 鼠标绘制完成后，派发总事件的接口
      drawingManager.addEventListener('overlaycomplete', function(e) {
        // if (e.calculate == null) { // 防误触功能：排除无意义的覆盖层
        //   this.map.removeOverlay(this.overlays[i])
        // }
        if (e.drawingMode == 'marker') {
          // 记录新添加的 marker
          let { lat, lng } = e.overlay.point
          let address = _this.geocoder({ lat, lng })
          console.log('point=', lat, lng)
          console.log('address=', address)
          // 将marker保存起来
          _this.keepMarker(e.overlay, address, address)
          // 给maker添加事件
          _this.addClickHandlerToMaker(e.overlay)
          _this.whenMapChanged()
        }
        _this.overlays.push(e.overlay)
        console.log('添加了覆盖物 overlay-complete')
      })
      // 使用 vue 管理 drawingManager
      this.drawingManager = drawingManager
    },
    // 保存marker到 markers 数组中
    keepMarker(overlay, address, remark) {
      if (overlay) {
        console.log('3.put overlay into markers array', overlay)
        console.log('4.check markers array before push', this.markers)
        let data = this.markers
        for (var i = 0; i < data.length; i++) {
          if (data[i].overlay == overlay) {
            // 检查到对象已存在，直接返回
            return
          }
        }
        data.push({
          pt: {
            lng: overlay.point.lng,
            lat: overlay.point.lat,
          },
          address: address,
          remark: remark,
          overlay: overlay, //标注点对象
        })
      }
    },
    // 给marker添加点击处理（必须调用过了 keepMarker 添加了 marker，因为会用到已添加的marker）
    addClickHandlerToMaker(overlay) {
      let _this = this
      if (overlay) {
        overlay.addEventListener('click', function(e) {
          let click_overlay = e.currentTarget
          let data = _this.markers
          console.log('cur markers=', data)
          console.log('cur match overlay=', click_overlay)
          var i = 0
          for (; i < data.length; i++) {
            if (data[i].overlay == click_overlay) {
              let marker = data[i]
              console.log('cur clicked marker=', marker, 'index=', i)
              _this.openInfoWindow(
                marker.overlay.JA, // 坐标
                marker.address, // 标题
                {
                  // content对象
                  type: 'marker',
                  remark: marker.remark,
                },
                marker.overlay // 标注点
              )
              break
            }
          }
          if (i == data.length) {
            // _this.alertBug('傻孩子，你调用 keepMarker 了吗')
          }
        })
      }
    },
    //清除所有页面数据
    clearAllOverlays() {
      let _this = this
      this.$confirm(
        '此操作清空地图上的所有覆盖物（不会进行保存，除非手动保存）, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          _this.map.clearOverlays() // 清除所有覆盖物
          _this.clearAllMapData(_this)
          _this.drawingManager.close() //关闭地图的绘制状态，即切换到【拖动】模式
          _this.whenMapChanged() //触发状态
          this.$message({
            type: 'success',
            message: '删除成功',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    clearAllMapData(_this) {
      _this.overlays = []
      _this.markers = []
      _this.cache = []
    },
    closeInfoWindow() {
      // 尝试关闭窗口
      if (this.infoWindow && this.infoWindow.isOpen()) {
        this.map.closeInfoWindow()
        if (this.infoWindow.isOpen()) {
          this.alertBug('infowindow 关不上')
          return
        }
      }
    },
    // dom 操作，应该会有更好的方案~   ;  content={type_string, remark_string}
    openInfoWindow(pt, title, content, the_overlay) {
      console.log('open info window >>>>>> 准备打开窗口')
      let _this = this
      // 关闭窗口
      this.closeInfoWindow()
      // type=marker 时打开的信息窗口（标题+内容）
      if (content.type == 'marker') {
        console.log('where to open=', this.map.getCenter(), pt, title, content)
        /////// 作缓存：需要在infowindow关闭时将用户修改的数据进行保存
        let st = this.generateST()
        this.put2Cache(st, the_overlay)
        console.log('after put cache=', this.cache)
        /////// infoWindow content
        var div = document.createElement('div')
        var pn1 = document.createElement('p')
        pn1.style = 'display:none;'
        pn1.innerHTML = content.type + '|' // 添加类型表示，以便用这种方法继续拓展，拓展？这代码拓展起来有点难度 :D
        var pn2 = document.createElement('p')
        pn2.style = 'display:none;'
        pn2.innerHTML = st + '|' // 加个时间戳标识，关闭窗口时候可以知道是哪个点的infowindow被关闭了，然后就可以把修改的内容进行保存了。实现：模拟缓存，关联st和point对象
        var pn3 = document.createElement('p')
        pn3.style =
          'width: 290px; font-size: 12px; padding: 0px; margin: 6px 0px 3px;'
        pn3.innerHTML = '请编辑备注：'
        var pn4 = document.createElement('p')
        pn4.style = 'display:none;'
        pn4.innerHTML = '|' // 加个 ｜ ，便于切割字符串
        var ta = document.createElement('textarea')
        ta.style = 'width: 290px; height: 60px;'
        ta.innerHTML = content.remark
        ta.oninput = function(e) {
          console.log('textarea oninput', e, ta.value)
          ta.innerHTML = ta.value
          // 关闭窗口时检查到底一样不
        }
        var pn5 = document.createElement('p')
        pn5.style = 'display:none;'
        pn5.innerHTML = '|' // 加个 ｜ ，便于切割字符串
        var btn_del = document.createElement('button')
        btn_del.innerHTML = '删除该标记点及备注'
        btn_del.my_st = st // 记录一下 st，便于后边的删除
        btn_del.my_confirm_count = 0 //
        btn_del.onclick = function(e) {
          console.log('i am the cliked button=', e)
          if (e.target.my_confirm_count == 0) {
            e.target.innerHTML = '删除该标记点及备注，请在此点击执行删除'
            e.target.my_confirm_count = 1
          } else {
            _this.clearMarkerByST(e.target.my_st) // 删除标记点
            _this.closeInfoWindow() // 关闭窗口
          }
        }
        div.append(pn1) // 分隔符
        div.append(pn2) // 分隔符
        div.append(pn3) // '请修改备注'
        div.append(pn4) // 分隔符
        div.append(ta) // 编辑框
        div.append(pn5) // 分隔符
        div.append(btn_del) // 删除按钮
        this.infoWindow.setContent(div) // content.type：类型
        /////// infoWindow title
        var tt = document.createElement('div')
        tt.style =
          'overflow: auto;font-size: 14px; color: rgb(77, 77, 77); font-weight: bold; text-decoration: none;'
        tt.innerHTML = title
        this.infoWindow.setTitle(tt) // content.type：类型
        /////// open infoWindow
        this.map.openInfoWindow(this.infoWindow, pt) // 打开信息窗口
      }
    },
    //生成一个与 cache 的所有 key 不重复时间戳
    generateST() {
      while (true) {
        var st = new Date().getTime()
        if (!this.cache[st]) {
          this.cache[st] = {} // 占个坑。atomic op ? hehe
          return st
        } else console.log('generateST, fail one:', st, this.cache)
      }
    },
    //放缓存
    put2Cache(k, v) {
      this.cache[k] = v
    },
    //查缓存
    getFromCache(k) {
      return this.cache[k]
    },
    //清某个k
    removeFromCache(k) {
      if (this.cache[k]) {
        delete this.cache[k]
      }
    },
    // 监听infowindow窗口关闭
    addListenerToInfoWindow() {
      let _this = this
      this.infoWindow.addEventListener('close', function(type, target, point) {
        console.log('infoWindow closed=', type, target, point)
        console.log('修改后的内容=', type.currentTarget.content.outerText)
        let text = type.currentTarget.content.outerText
        if (text && typeof text == 'string' && text.startsWith('marker')) {
          let parts = text.split('|')
          let type = parts[0] // type string
          let st = parseInt(parts[1])
          // 有可能是删除时候的关闭，此时需要通过st找overlay，如果overlay不存在就返回不做处理
          if (!_this.getFromCache(st)) {
            console.log('监测到点被删除，所以就跳过数据保存了')
            return
          }
          // 获取备注信息
          console.log('splited parts=', parts)
          let s = parts[3]
          for (var i = 4; i < parts.length - 1; i++) s = s + '|' + parts[i]
          // 将备注信息进行存储。这里不一定修改了 remark
          _this.updateRemarkByOverlay(_this.getFromCache(st), s)
        }
      })
    },
    updateRemarkByOverlay(overlay, remark) {
      for (var i = 0; i < this.markers.length; i++) {
        if (this.markers[i].overlay == overlay) {
          console.log(
            'check if remark changed, ',
            this.markers[i].remark,
            remark,
            '是否相等=',
            this.markers[i].remark == remark
          )
          // 如果不同，则说明发生了修改
          if (this.markers[i].remark != remark) {
            this.markers[i].remark = remark
            this.whenMapChanged()
          }
        }
      }
    },
    // 当地图被改动时
    whenMapChanged() {
      this.keepStatus = 0 // 表示地图被改动了
      this.keepStatusBtnType = 'warning'
      this.keepStatusBtnVal = '地图有新修改，点击保存'
    },
    // 地图初始化完成或者保存成功后
    whenMapInitOrSaved() {
      this.keepStatus = 1 // 保存后切换状态
      this.keepStatusBtnType = 'success'
      this.keepStatusBtnVal = '地图已保存'
    },
    // 通过 st 清除 marker， 然后关闭 infowindow
    clearMarkerByST(st) {
      console.log('go delete marker by st=', st)
      let del_overlay = this.getFromCache(st) // 拿到 overlay
      if (!del_overlay) this.alertBug('找不到del_overlay')
      this.removeFromCache(st) // 清除缓存～
      this.deleteOverlayInMarkers(del_overlay) // 先删除 markers 中的
      this.deleteOverlayInOverlaysArray(
        // 再删除记录所有 overlay 数组中的
        del_overlay,
        this.overlays,
        'this.overlays数组'
      )
      this.map.removeOverlay(del_overlay)
      console.log('delete overlay over!!!')
      this.whenMapChanged()
    },
    // 从 markers 数组中删除具有 del_overlay 的marker
    deleteOverlayInMarkers(del_overlay) {
      let index = 0
      // 验证del_overlay在this.markers[x].overlay中
      for (; index < this.markers.length; index++) {
        let element = this.markers[index]
        if (element.overlay == del_overlay) {
          break
        }
      }
      // 确认或报错
      if (
        index >= 0 &&
        index <= this.markers.length - 1 &&
        this.markers[index].overlay == del_overlay
      ) {
        console.log('found target overlay to delete in markers=', this.markers)
        // 删除 markers[index]
        this.markers.splice(index, 1) // 删除 index 位置的 1 个元素
      } else {
        this.alertBug('没找到overlay --- deleteOverlayInMarkers')
      }
    },
    // 从一个 Array[Overlay] 中删除 overlay
    deleteOverlayInOverlaysArray(
      del_overlay,
      overlays_array,
      overlays_array_name
    ) {
      let index = 0
      // 验证del_overlay在this.markers[x].overlay中
      for (; index < overlays_array.length; index++) {
        if (overlays_array[index] == del_overlay) {
          break
        }
      }
      // 确认或报错
      if (
        index >= 0 &&
        index <= overlays_array.length - 1 &&
        overlays_array[index] == del_overlay
      ) {
        console.log('found target overlay to delete in ' + overlays_array_name)
        overlays_array.slice(index, 1) // 删除 index 未知的 1 个元素
      } else {
        this.alertBug('没找到overlay, 数组名=', overlays_array_name)
      }
    },
    // 有 bug 就报告
    alertBug(msg) {
      console.log('buggggggggg msg=', msg)
      alert(msg)
    },
    // 加载地图时，通过 marker{lat-lng,remark,address} 创建 marker
    addMaker(marker_obj) {
      console.log('1.begin to create Maker overlay', marker_obj)
      var marker = new BMap.Marker(
        new BMap.Point(marker_obj.pt.lng, marker_obj.pt.lat)
      ) // 创建标注
      this.map.addOverlay(marker) // 将标注添加到地图中
      console.log('2.Maker overlay had been created=', marker)
      // 将marker保存起来
      this.keepMarker(marker, marker_obj.address, marker_obj.remark) // 直接使用数据库中的地址，不进行重复计算了
      this.overlays.push(marker)
      // 给maker添加事件
      this.addClickHandlerToMaker(marker)
    },
    goToKeepAllData() {
      this.keepAllData()
    },
    keepAllData() {
      let map_info = this.getMapInfo()
      this.putRequest('/map/poi/', map_info).then((resp) => {
        // 成功保存数据
        if (resp && resp.status == 200) {
          this.whenMapInitOrSaved()
        }
      })
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
