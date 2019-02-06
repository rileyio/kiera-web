<template>
  <div id="sidebar">
    <el-row v-if="state.focusedView === 'new'">
      <el-col :span="24">
        <!-- <PermissionBuilder/> -->
      </el-col>
    </el-row>
    <el-row v-if="state.focusedView === 'all'">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <h2 class="h1">All Permissions</h2>
          <el-main>
            <el-table :data="tableData">
              <el-table-column prop="date" label="Date" width="140"></el-table-column>
              <el-table-column prop="name" label="Name" width="120"></el-table-column>
              <el-table-column prop="address" label="Address"></el-table-column>
            </el-table>
          </el-main>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { state } from "../defaults/app-state";
import { newPermissionState } from "../defaults/permission";

// import PermissionBuilder from "../components/permission-builder.vue";

@Component({
  components: {
    // PermissionBuilder
  }
})
export default class PermissionsPanel extends Vue {
  @Prop({ default: () => state })
  private state!: typeof state;
}
</script>

<style lang="less">
</style>

