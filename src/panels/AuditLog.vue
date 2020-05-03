<template>
  <div>
    <b-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <div class="h3">
            Audit Log ({{ auditEvents.length }})
            <el-button type="primary" plain icon="el-icon-refresh" size="small" :loading="loading.isLoading" @click="getAuditEntries()"></el-button>
          </div>
          <span class="panel-description"></span>

          <el-table :data="auditEvents" style="width: 100%;" v-loading="loading.isLoading" size="mini">
            <el-table-column type="expand" prop="allowed">
              <!-- <template slot-scope="scope">
                <PermissionsSub :data="scope"/>
              </template>-->
            </el-table-column>
            <el-table-column label="Action" prop="details">
              <template slot-scope="scope">
                <span class="permission-wrapper">
                  <span>
                    {{ scope.row.name }}
                    <el-tag size="mini" v-if="scope.row.successful === true" type="success">Successful</el-tag>
                    <el-tag size="mini" v-else type="danger">Invalid</el-tag>
                    <el-tag size="mini" v-if="scope.row.type === 'api.oauth'" type="warning">Auth</el-tag>
                  </span>
                  <span class="row-example">{{ scope.row.details }}</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="Timestamp" prop="details" align="right">
              <template slot-scope="scope">
                <span class="permission-wrapper">
                  <span>{{ new Date(scope.row.timestamp).toLocaleString() }}</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <b-row :gutter="20">
                  <el-col :span="4">
                    <div class="audit-entry">
                      <div class="details">
                        <span class="property">name</span>
                      </div>
                      <div class="details">
                        <span class="property">timestamp</span>
                      </div>
                      <div class="details">
                        <span class="property">runtime</span>
                      </div>
                      <div class="details">
                        <span class="property">type</span>
                      </div>
                      <div class="details">
                        <span class="property">where</span>
                      </div>
                      <div class="details" v-if="scope.row.guild">
                        <span class="property">server</span>
                      </div>
                      <div class="details" v-if="scope.row.error">
                        <span class="property">error</span>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="20">
                    <div class="audit-entry">
                      <div class="details">{{ scope.row.name }}</div>
                      <div class="details">{{ scope.row.timestamp }}</div>
                      <div class="details">{{ scope.row.runtime }}ms</div>
                      <div class="details">{{ scope.row.type }}</div>
                      <div class="details">{{ scope.row.where }}</div>
                      <div class="details" v-if="scope.row.guild">{{ scope.row.guild }}</div>
                      <div class="details" v-if="scope.row.error">{{ scope.row.error }}</div>
                    </div>
                  </el-col>
                </b-row>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </b-row>
  </div>
</template>

<script lang="ts">
declare var process: any

import Vue from 'vue'
import Axios from 'axios'
import { Component, Prop, Watch } from 'vue-property-decorator'

// Import Component Base
import BaseComponent from '@/components/BaseComponent.vue'

import { user } from '../defaults/user'
import { mappedGuilds } from '../defaults/guilds'
import { AuditEntry } from '../types/audit'

@Component({
  // components: {
  // }
})
export default class AuditPanel extends BaseComponent {
  @Prop({ default: () => [] })
  public auditEvents!: Array<any>

  @Prop({
    default: () => {
      return { isLoading: true, loaded: false }
    }
  })
  public loading!: { isLoading: boolean; loaded: boolean }

  constructor() {
    super()
    this.getAuditEntries()
  }

  private async getAuditEntries() {
    try {
      this.loading.isLoading = true
      const resp = await Axios(`${process.env.VUE_APP_BOT_HOST}/audit`, {
        method: 'POST',
        data: {
          serverLimited: false
        },
        headers: this.$session.get()
      })

      if (resp.status === 200) {
        // Merge in gui opts
        // (<Array<AuditEntry>>resp.data).map(d => {
        //   d._deleteVisible = false;
        //   // Update outcomes with GUI props
        //   d.options.map(o => {
        //     o._isUpdating = false;
        //     o._isChanged = false;
        //     o._deleteVisible = false;
        //     o._originalText = o.text;
        //     return o;
        //   });

        //   return d;
        // });

        // Update cached data
        this.auditEvents = resp.data
        console.log(resp.data)
      }
    } catch (error) {}
    // Stop spinner
    this.loading.isLoading = false
  }
}
</script>

<style lang="less">
i.header-icon.el-icon-info {
  position: absolute;
  right: 36px;
}

// Panel
.panel-description {
  font-size: 12px;
  display: block;
  padding: 10px 4px;
}

// Audit specific
.audit-entry {
  .details {
    font-size: 11px;
    margin: 4px 0px;
    .property {
      color: #f3f3f3;
      background-color: #a2a2a2;
      padding: 1px 2px;
    }
  }
}

.row-example {
  display: block;
  font-size: 11px;
  color: #909090;
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
</style>

;
