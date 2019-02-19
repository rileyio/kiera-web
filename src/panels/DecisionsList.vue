<template>
  <div id="sidebar">
    <el-row v-if="state.focusedView === 'all'">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <div class="h3">Your Decision Rollers</div>
          <span class="panel-description"></span>

          <el-table :data="decisionRollers" style="width: 100%" v-loading="loading.isLoading">
            <el-table-column type="expand" prop="allowed">
              <template slot-scope="scope">
                <DecisionOutcome :data="scope" @requestRefresh="getDecisions()" />
              </template>
            </el-table-column>
            <el-table-column label="ID">
              <template slot-scope="scope">
                <input
                  class="roller-id-input"
                  type="text"
                  :id="'roller-'+scope.row._id"
                  :value="scope.row._id"
                  disabled
                >
                <span class="roller-id" @click="copyIDtoClipboard(scope.row._id)">{{scope.row._id}}</span>
              </template>
            </el-table-column>
            <el-table-column label="Question">
              <template slot-scope="scope">
                <span class="roller-question">{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column align="right">
              <template slot-scope="scope">
                <div class="permission-override-stats">
                  <span>{{displayOutcomeCount(scope.row)}} outcomes</span>
                  <span>{{(scope.row.options.length > 0) ? Math.round((1 / scope.row.options.length) * 100 * 100) / 100 : 0}} %</span>
                </div>
                <!-- <el-switch
                  v-model="scope.row.enabled"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="toggleEnabled(scope.row._id, $event)"
                ></el-switch>-->
                <el-popover placement="top" width="160" v-model="scope.row._deleteVisible">
                  <p>Are you sure you wish delete this?</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      size="mini"
                      type="text"
                      @click="scope.row._deleteVisible = false"
                    >cancel</el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="deleteDecisionRoller(scope.row._id)"
                    >confirm</el-button>
                  </div>
                  <el-button type="danger" icon="el-icon-delete" slot="reference" circle></el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
declare var process: any;

import Vue from "vue";
import Axios from "axios";
import { Component, Prop, Watch } from "vue-property-decorator";
import { state } from "../defaults/app-state";
import { newPermissionState } from "../defaults/permission";
import { defaultDecision, defaultDecisionOutcome } from "../defaults/decision";
import { buildRequestHeaders } from "../utils";

// import PermissionBuilder from "../components/permission-builder.vue";
import DecisionOutcome from "../components/decision-outcome.vue";
import { user } from "../defaults/user";
import { mappedGuilds } from "../defaults/guilds";
import { Decision } from "../types/decisions";

@Component({
  components: {
    // PermissionBuilder
    DecisionOutcome
  }
})
export default class DecisionsPanel extends Vue {
  @Prop({ default: () => state })
  private state!: typeof state;

  @Prop({
    default: () => {
      return { webToken: "", user: user, guilds: mappedGuilds };
    }
  })
  public bot!: {
    webToken: string;
    user: typeof user;
    guilds: typeof mappedGuilds;
  };

  @Prop({
    default: () => []
  })
  public decisionRollers!: Array<any>;

  @Prop({
    default: () => {
      return { isLoading: true, loaded: false };
    }
  })
  public loading!: { isLoading: boolean; loaded: boolean };

  constructor() {
    super();
    this.getDecisions();
  }

  private async getDecisions() {
    try {
      const resp = await Axios(`${process.env.BOT_HOST}/decisions`, {
        method: "POST",
        data: {
          serverLimited: false
        },
        headers: buildRequestHeaders()
      });

      if (resp.status === 200) {
        // Merge in gui opts
        (<Array<Decision>>resp.data).map(d => {
          d._deleteVisible = false;
          // Update outcomes with GUI props
          d.options.map(o => {
            o._isUpdating = false;
            o._isChanged = false;
            o._deleteVisible = false;
            o._originalText = o.text;
            return o;
          });

          return d;
        });

        // Update cached data
        this.decisionRollers = resp.data;
        console.log(resp.data);
      }
    } catch (error) {}
    // Stop spinner
    this.loading.isLoading = false;
  }

  private async toggleEnabled(_id: string, $e: any) {
    console.log(_id, $e);
    const resp = await Axios(`${process.env.BOT_HOST}/decisions/enabled`, {
      method: "POST",
      data: {
        _id: _id,
        state: $e
      },
      headers: buildRequestHeaders()
    });

    console.log("toggleEnabled outcome =>", resp.data);
  }

  private async deleteDecisionRoller(_id: string) {
    console.log(_id);
    const resp = await Axios(`${process.env.BOT_HOST}/decision/delete`, {
      method: "DELETE",
      data: {
        _id: _id
      },
      headers: buildRequestHeaders()
    });

    console.log("deleteDecisionRoller outcome =>", resp.data);
    // If successful remove it from the local collection
    if (resp.status === 200) {
      if (resp.data.success) {
        this.decisionRollers.splice(
          this.decisionRollers.findIndex(d => d._id === _id),
          1
        );
      }
    }
  }

  private displayOutcomeCount(data: Decision) {
    return data.options.length;
  }

  private copyIDtoClipboard(_id: string) {
    var el = <HTMLInputElement>document.getElementById(`roller-${_id}`);
    console.log("copy from element:", el);
    // Enable temp editing for copy api
    el.disabled = false;
    el.select();
    document.execCommand("copy");
    el.disabled = true;
    this.$message(`${_id} copied to clipboard`);
  }
}
</script>

<style lang="less">
i.header-icon.el-icon-info {
  position: absolute;
  right: 36px;
}

.permission-override-stats {
  position: absolute;
  right: 65px;
  top: 7px;
  color: #616161;
}

.permission-override-stats > span {
  font-size: 10px;
  display: block;
  line-height: 1em;
}

// Panel
.panel-description {
  font-size: 12px;
  display: block;
  padding: 10px 4px;
}

// Text modifiers
span.md {
  padding: 2px 4px;
  background-color: #e4e7edbd;
  font-family: monospace;
  font-size: 12px;
  color: #484848;
  border-radius: 2px;
}

.roller-id {
  background-color: #2735d838;
  border-radius: 2px;
  font-size: 10px;
  display: inline-block;
  padding: 3px 5px;
  line-height: 1em;
  cursor: pointer;
  font-family: monospace;
  z-index: 2;
  top: 25px;
  position: absolute;
  left: 0;
}

.roller-id-input {
  opacity: 0;
  display: inline;
  z-index: 1;
}

.roller-question {
  font-size: 12px;
  word-break: break-word;
  line-height: 1.2em;
  display: block;
}
</style>

