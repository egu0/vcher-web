<template>
  <div>
    <el-tabs v-model="activePaneName">
      <el-tab-pane label="2,3维联动" name="interPane">
        <el-row :gutter="1">
          <el-col :span="12">
            <div
              id="cesiumContainer2"
              class="grid-content bg-purple"
              style="height: 500px"
            ></div>
          </el-col>
          <el-col :span="12">
            <div
              id="cesiumContainer3"
              class="grid-content bg-purple"
              style="height: 500px"
            ></div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="功能描述" name="despPane">
        <el-row>
          <el-card class="desp-card">
            <div slot="header">
              <span>相关描述</span>
            </div>
            <div>
              <ol>
                <li class="text item">
                  Cesium
                  联动：基于Cesium地图，实现二三维地图联动，采用全局引入的方式引入
                  cesium，引入参考：
                  <a href="https://www.cnblogs.com/yaosusu/p/11987332.html"
                    >https://www.cnblogs.com/yaosusu/p/11987332.html</a
                  >
                </li>
                <li class="text item">
                  存在的问题：两张地图同时渲染，对电脑性能有一定的要求，可能会出现网页崩溃、地图显示不全的情况
                </li>
                <li class="text item">
                  注意：显示本地图的token为私人所有，可能会失效，请参考<a
                    href="https://cesium.com/learn/cesiumjs-learn/cesiumjs-quickstart/"
                    >此链接</a
                  >创建账户和申请token
                </li>
                <li class="text item">
                  参考文档：
                  <a
                    href="https://blog.csdn.net/qq_38870665/article/details/112299972"
                    >添加地图视图事件</a
                  >、<a href="https://zhuanlan.zhihu.com/p/334540571"
                    >坐标转换</a
                  >、<a href="http://cesium.xin/wordpress/archives/261.html"
                    >相机镜头变换</a
                  >、<a href="https://gitee.com/engureguo/cesium1.91etc"
                    >笔者的cesium使用整理</a
                  >
                </li>
              </ol>
            </div>
          </el-card>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activePaneName: 'interPane',
      viewer2: {},
      viewer3: {},
    }
  },
  mounted() {
    this.initCesium()
  },
  methods: {
    initCesium() {
      Cesium.Ion.defaultAccessToken = '123'
      // 二维模型
      let viewer2 = new Cesium.Viewer('cesiumContainer2', {
        geocoder: false, // 查找位置工具
        homeButton: false, // 视角返回初始位置
        sceneModePicker: false, // 视角模式选择工具
        baseLayerPicker: false, // 图层选择器
        navigationHelpButton: false, // 导航帮助按钮
        animation: false, // 动画器件
        timeline: false, // 时间线
        fullscreenButton: false, // 全屏幕按钮
        vrButton: false,
        imageryProvider: new Cesium.OpenStreetMapImageryProvider({
          url: 'https://a.tile.openstreetmap.org/',
        }),
      })
      // 三维模型
      let viewer3 = new Cesium.Viewer('cesiumContainer3', {
        geocoder: false, // 查找位置工具
        homeButton: false, // 视角返回初始位置
        sceneModePicker: false, // 视角模式选择工具
        baseLayerPicker: false, // 图层选择器
        navigationHelpButton: false, // 导航帮助按钮
        animation: false, // 动画器件
        timeline: false, // 时间线
        fullscreenButton: false, // 全屏幕按钮
        vrButton: false,
        terrainProvider: Cesium.createWorldTerrain(),
      })
      this.viewer2 = viewer2
      this.viewer3 = viewer3
      let _this = this
      ////////////// 2维地图逻辑
      // 显示帧率
      viewer2.scene.debugShowFramesPerSecond = true
      // 添加点击事件，进而实现2d地图点击，3d地图镜头跳转
      var handler2 = new Cesium.ScreenSpaceEventHandler(viewer2.scene.canvas)
      handler2.setInputAction(function(movement) {
        var ray = viewer2.camera.getPickRay(movement.position)
        var position = viewer2.scene.globe.pick(ray, viewer2.scene) //笛卡尔坐标
        var p2 = Cesium.Cartographic.fromCartesian(position) //地理坐标（弧度制）
        var lat = Cesium.Math.toDegrees(p2.latitude) // 经纬度坐标
        var lng = Cesium.Math.toDegrees(p2.longitude) // 经纬度坐标
        console.log('cartesion3 = ', position, 'lng,lat = ', lng, lat)
        _this.flyToSpecifiedSite(viewer3, { lng, lat })
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
      ////////////// 3维地图逻辑
      // 显示帧率
      viewer3.scene.debugShowFramesPerSecond = true
      // 显示3D建筑物
      const buildingsTileset = viewer3.scene.primitives.add(
        Cesium.createOsmBuildings()
      )
      buildingsTileset.style = new Cesium.Cesium3DTileStyle({
        show: {
          conditions: [[true, true]],
        },
        color:
          "Boolean(${feature['cesium#color']}) ? color(${feature['cesium#color']}) : color('#ffffff')",
      })
      // 添加点击事件，进而实现2d地图点击，3d地图镜头跳转
      var handler3 = new Cesium.ScreenSpaceEventHandler(viewer3.scene.canvas)
      handler3.setInputAction(function(movement) {
        var ray = viewer3.camera.getPickRay(movement.position)
        var position = viewer3.scene.globe.pick(ray, viewer3.scene) //笛卡尔坐标
        var p2 = Cesium.Cartographic.fromCartesian(position) //地理坐标（弧度制）
        var lat = Cesium.Math.toDegrees(p2.latitude) // 经纬度坐标
        var lng = Cesium.Math.toDegrees(p2.longitude) // 经纬度坐标
        console.log('cartesion3 = ', position, 'lng,lat = ', lng, lat)
        _this.flyToSpecifedSiteOn2DMap(viewer2, { lng, lat })
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
      // 初始状态
      setTimeout(() => {
        this.flyToSpecifiedSite(this.viewer3, {
          lng: 116.39134,
          lat: 39.90734,
        })
      }, 1000)
      setTimeout(() => {
        this.flyToSpecifedSiteOn2DMap(this.viewer2, {
          lng: 116.39134,
          lat: 39.90734,
        })
      }, 1000)
    },
    //移动二维地图的镜头到某个位置
    flyToSpecifedSiteOn2DMap(viewer, { lng, lat }) {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lng, lat, 1000.0), // 设置位置
        orientation: {
          heading: Cesium.Math.toRadians(0.0), // 方向
          pitch: Cesium.Math.toRadians(-90.0), // 倾斜角度
          roll: 0,
        },
        duration: 2, // 设置飞行持续时间，默认会根据距离来计算
        complete: function() {
          // 到达位置后执行的回调函数
        },
        cancle: function() {
          // 如果取消飞行则会调用此函数
        },
      })
    },
    //移动三维地图的镜头到某个位置
    flyToSpecifiedSite(viewer, { lng, lat }) {
      lat -= 0.008 // 消除3D地图倾斜视角下地图偏移问题
      // 镜头飞到某个位置，怎么飞。这里可以提取出镜头移动参数，动态修改
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lng, lat, 1000.0), // 设置位置
        orientation: {
          heading: Cesium.Math.toRadians(0.0), // 方向
          pitch: Cesium.Math.toRadians(-60.0), // 倾斜角度
          roll: 0,
        },
        duration: 2, // 设置飞行持续时间，默认会根据距离来计算
        complete: function() {
          // 到达位置后执行的回调函数
        },
        cancle: function() {
          // 如果取消飞行则会调用此函数
        },
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
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
