<template>
  <div>
    <b-row>
      <b-col cols="3">
        <b-overlay :show="loading.isLoading" spinner-variant="primary" spinner-type="grow" spinner-small rounded="sm">
          <b-list-group>
            <b-list-group-item
              v-for="(data, i) in myDataTotals"
              :key="i"
              class="d-flex justify-content-between align-items-center"
              :variant="myDataTotals[i].thirdParty ? 'warning' : ''"
            >
              <b-badge micro :variant="data.thirdParty ? 'warning' : 'primary'">{{ data.scope }}</b-badge
              >{{ data.name }}
              <b-badge pill>{{ data.count }}</b-badge>
            </b-list-group-item>
          </b-list-group>
        </b-overlay>
      </b-col>
      <b-col cols="6">
        <h4>Data stored within Kiera's Database.</h4>
        <br />
        <p>Data that is marked as <b-badge>kiera</b-badge> are 1st party data. This type of data is what's used to allow Kiera commands to work successfully for your account.</p>
        <p>
          Data that's in <b-badge variant="warning">yellow</b-badge> is data coming from a 3rd party source. This data is cached for <code>&lt;60</code> minutes at a time before
          the cache is rebuilt.
        </p>
        <hr />
        <p>
          The total's below are the number of occurrences your Discord ID is seen in each database collection. This unique ID is what Discord uses to identify you and how Kiera
          know's you are you.
        </p>
        <hr />
        <p>
          At this time, if you wish to have the records associated with your account or have all data removed, please reach out to <code>emma#1366</code> on Discord. There will be
          an automated option for both of these in the near future.
        </p>
      </b-col>
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
import { AuditEntry } from '../types/audit'

// Utils
import * as DateTimeUtils from '@/utils/date'

@Component({})
export default class MyData extends BaseComponent {
  public myDataTotals = [{ thirdParty: false, scope: '', name: '', count: null }] as Array<{ thirdParty: boolean; scope: string; name: string; count: number }>

  @Prop({ default: () => DateTimeUtils })
  private DateTimeUtils!: typeof DateTimeUtils

  @Prop({
    default: () => {
      return { isLoading: true, loaded: false }
    }
  })
  public loading!: { isLoading: boolean; loaded: boolean }

  private async mounted() {
    await this.getAuditEntries()
  }

  private async getAuditEntries() {
    try {
      this.loading.isLoading = true
      const resp = await Axios(`${process.env.VUE_APP_BOT_HOST}/user/mydata/totals`, {
        method: 'GET',
        headers: this.$session.get()
      })

      if (resp.status === 200) {
        // Update cached data
        this.myDataTotals = resp.data.data
        console.log(resp.data)
      }
    } catch (error) {}
    // Stop spinner
    this.loading.isLoading = false
  }
}
</script>

<style lang="less"></style>
