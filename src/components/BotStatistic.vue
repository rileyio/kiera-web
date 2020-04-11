<template>
  <b-col :span="span">
    <b-card :style="{ 'background-color': backgroundColor, color: fontColor }">
      <div class="percentage-bar" v-if="percentageBar.show">
        <div
          class="bar"
          v-for="(value, i) in percentageBar.values"
          :key="i"
          :style="{
            width: calculatePerc(value, percentageBar.values) + '%',
            backgroundColor: percentageBar.colors[i],
            left: i === 0 ? 0 : 100 - calculatePerc(value, percentageBar.values) + '%'
          }"
        ></div>
      </div>
      <div class="grid-content stat-title">{{ text }}</div>
      <div class="grid-content stat-value">{{ value }}</div>
    </b-card>
  </b-col>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'

@Component({ components: {} })
export default class BotStatistic extends Vue {
  @Prop({ default: '' })
  private text!: string

  @Prop({ default: '#1f273a' })
  private backgroundColor!: string

  @Prop({ default: 'rgb(142, 150, 179)' })
  private fontColor!: string

  @Prop({ default: '6' })
  private span!: string

  @Prop({ default: '' })
  private value!: string

  @Prop({
    default: () => {
      return { show: false, values: [] }
    }
  })
  private percentageBar!: { show: boolean; values: Array<any> }

  private calculatePerc(value: number, values: Array<number>) {
    return (value / values.reduce((a, b) => a + b, 0)) * 100
  }
}
</script>
