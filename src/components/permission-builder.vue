// <template>
//   <div class="grid-content bg-purple-dark">
//     <h2 class="h1">New Permission</h2>
//     <el-main>
//       <!-- Checkboxes: Permission Scope -->
//       <el-checkbox-group v-model="newPermission.scope" @change="handleCheckedScope">
//         <el-checkbox v-for="scope in scopes" :label="scope" :key="scope">{{scope}}</el-checkbox>
//       </el-checkbox-group>

//       <div style="margin: 20px 0;"></div>

//       <!-- Input: Name -->
//       <el-input placeholder="Name of the new permission" v-model="textarea2" clearable></el-input>

//       <div style="margin: 20px 0;"></div>

//       <!-- Input: Description -->
//       <el-input
//         type="textarea"
//         :autosize="{ minRows: 2, maxRows: 4}"
//         placeholder="Notes / Info about this permission"
//         v-model="textarea3"
//       ></el-input>

//       <div style="margin: 20px 0;"></div>

//       <el-select
//         v-model="value10"
//         multiple
//         filterable
//         allow-create
//         default-first-option
//         placeholder="Choose tags for your article"
//       ></el-select>
//       <el-select
//         v-model="value10"
//         multiple
//         filterable
//         allow-create
//         default-first-option
//         placeholder="Choose tags for your article"
//       ></el-select>
//       <el-select
//         v-model="value10"
//         multiple
//         filterable
//         allow-create
//         default-first-option
//         placeholder="Choose tags for your article"
//       ></el-select>
//       <!-- Input: Individual items -->
//       <el-option v-for="item in options5" :key="item.value" :label="item.label" :value="item.value"></el-option>
//     </el-main>
//   </div>
// </template>

// <script lang="ts">
// import Vue from "vue";
// import Axios from "axios";
// import { Component, Prop } from "vue-property-decorator";
// import { state } from "../defaults/app-state";
// import { Permission } from "../types/permissions";
// import {
//   permissionDefault,
//   newPermissionState,
//   lists
// } from "../defaults/permission";

// @Component
// export default class PermissionBuilder extends Vue {
//   @Prop({
//     default: () => newPermissionState
//   })
//   private newPermissionStates!: typeof newPermissionState;
//   @Prop({
//     default: () => ["api", "channel", "dm", "server", "role", "web"]
//   })
//   private scopes!: Array<"api" | "channel" | "dm" | "server" | "role" | "web">;
//   @Prop({
//     default: () => state
//   })
//   private state!: typeof state;
//   @Prop({
//     default: () => permissionDefault
//   })
//   private newPermission!: Permission;
//   @Prop({
//     default: () => lists
//   })
//   private lists!: typeof lists;

//   /*
//    * New Permission
//    */
//   private handleCheckAllScopes(val: boolean) {
//     this.newPermission.scope = val ? this.scopes : [];
//     this.newPermissionStates.isIndeterminate = false;
//   }
//   private handleCheckedScope(value: string) {
//     let checkedCount = value.length;
//     this.newPermissionStates.checkAll =
//       checkedCount === this.newPermission.scope.length;
//     this.newPermissionStates.isIndeterminate =
//       checkedCount > 0 && checkedCount < this.newPermission.scope.length;
//   }

//   private async fetchList(input?: string) {
//     const resp = await Axios("https://dev.tdm.io:8234/api/lists", {
//       method: "POST",
//       data: {
//         input: input
//       },
//       headers: {
//         AuthKey: ""
//       }
//     });
//   }
// }
// </script>

// <style lang="less">
// </style>

