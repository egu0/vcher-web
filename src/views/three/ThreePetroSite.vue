<template>
  <div>
    <el-tabs v-model="activePaneName">
      <el-tab-pane label="Preview" name="interPane">
        <el-row :gutter="1">
          <div id="cesiumContainer" style="height: 500px"></div>
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
      newBuildingTileset: {},
    }
  },
  mounted() {
    this.initCesium()
  },
  methods: {
    initCesium() {
      // Get your token from https://cesium.com/ion/tokens
      Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NTRhYWI5ZC0wYWY5LTQ1N2EtYTBjMy1mYWQ3NmZhNDJiMzYiLCJpZCI6ODM0MjksImlhdCI6MTY0NTU4OTQzMH0.vCsmfsNxPcV58MOy_dIGq98lJsQ-S-yf1RPNX2WLkjI'
      // Initialize the viewer with Cesium World Terrain.
      const viewer = new Cesium.Viewer('cesiumContainer', {
        geocoder: false, // 查找位置工具
        //homeButton: false, // 视角返回初始位置
        sceneModePicker: false, // 视角模式选择工具
        baseLayerPicker: false, // 图层选择器
        navigationHelpButton: false, // 导航帮助按钮
        animation: false, // 动画器件
        timeline: false, // 时间线
        fullscreenButton: false, // 全屏幕按钮
        vrButton: false,
        terrainProvider: Cesium.createWorldTerrain(),
      })
      // Add Cesium OSM Buildings.
      const buildingsTileset = viewer.scene.primitives.add(
        Cesium.createOsmBuildings()
      )
      // Hide individual buildings in this area using 3D Tiles Styling language.
      buildingsTileset.style = new Cesium.Cesium3DTileStyle({
        show: {
          conditions: [[true, true]],
        },
        color:
          "Boolean(${feature['cesium#color']}) ? color(${feature['cesium#color']}) : color('#ffffff')",
      })
      // Add the 3D Tileset you created from your Cesium ion account.
      const newBuildingTileset = viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: Cesium.IonResource.fromAssetId(863995),
        })
      )
      // Move the camera to the new building.
      viewer.flyTo(newBuildingTileset)
      this.newBuildingTileset = newBuildingTileset
      // fly to our building after clicking home button
      viewer.homeButton.viewModel.command.beforeExecute.addEventListener(
        function(commandInfo) {
          // fly to our building
          viewer.flyTo(newBuildingTileset)
          // Tell the home button not to do anything
          commandInfo.cancel = true
        }
      )
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
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
