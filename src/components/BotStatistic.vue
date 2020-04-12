<template>
  <b-col :span="span" class="statistic" :style="{ 'background-color': backgroundColor, color: fontColor }">
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
    <div class="stat-title">{{ text }}</div>
    <div class="stat-value">{{ value }}</div>
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

  @Prop({ default: '#fff' })
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

<style lang="less">
.statistic {
  padding: 10px;
  text-align: center;
  color: rgb(142, 150, 179);
  line-height: 1.5em;
  border-radius: 3px;
  margin: 2px;
  display: block;
  position: relative;
  overflow: hidden;
  width: 100px;
  .percentage-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    > .bar {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
    }
  }
  > .stat-title {
    font-size: 14px !important;
    font-weight: 200;
  }
  > .stat-value {
    font-size: 20px !important;
    font-weight: 100;
  }
}
</style>
