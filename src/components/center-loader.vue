<template>
  <div
    id="center-loader-wrapper"
    :style="{ 'background-image': `url('/assets/img/${state.randomBG}.jpg')` }"
  >
    <div id="center-loader">
      <div class="socket-status">
        <span class="status">Getting things ready</span>
        <div class="loader-wrapper">
          <div class="la-ball-beat">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import { state } from "../defaults/app-state";

@Component
export default class CenterLoader extends Vue {
  @Prop({
    default: () => state
  })
  private state!: typeof state;

  constructor() {
    super();
  }
}
</script>

<style lang="less">
#center-loader-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-position: top;
  background-color: #3b466e;
  z-index: 100;
  #center-loader {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 300px;
    height: 200px;
    margin: auto;
    display: block;
    background: inherit;
    border-radius: 2px;
    overflow: hidden;
    box-shadow: 0 0 15px 0 #131929;

    &:after {
      position: absolute;
      content: "";
      width: 350px;
      height: 300px;
      background: inherit;
      left: -25px;
      top: -25px;
      box-shadow: inset 0 0 0 150px rgba(189, 189, 189, 0.05);
      filter: blur(8px);
    }

    .socket-status {
      position: relative;
      margin-top: 60px;
      text-align: center;
      z-index: 1;
      color: #fff;

      > .status {
        position: absolute;
        display: block;
        width: 100%;
        text-align: center;
        font-weight: 100 !important;
      }

      > .loader-wrapper {
        position: relative;
        width: 50px;
        top: 60px;
        margin: auto;
        /*!
    * Load Awesome v1.1.0 (http://github.danielcardoso.net/load-awesome/)
    * Copyright 2015 Daniel Cardoso <@DanielCardoso>
    * Licensed under MIT
    */
        /*!
 * Load Awesome v1.1.0 (http://github.danielcardoso.net/load-awesome/)
 * Copyright 2015 Daniel Cardoso <@DanielCardoso>
 * Licensed under MIT
 */
        .la-ball-beat,
        .la-ball-beat > div {
          position: relative;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
        }
        .la-ball-beat {
          display: block;
          font-size: 0;
          color: #fff;
        }
        .la-ball-beat.la-dark {
          color: #333;
        }
        .la-ball-beat > div {
          display: inline-block;
          float: none;
          background-color: currentColor;
          border: 0 solid currentColor;
        }
        .la-ball-beat {
          width: 54px;
          height: 18px;
        }
        .la-ball-beat > div {
          width: 10px;
          height: 10px;
          margin: 4px;
          border-radius: 100%;
          -webkit-animation: ball-beat 0.7s -0.15s infinite linear;
          -moz-animation: ball-beat 0.7s -0.15s infinite linear;
          -o-animation: ball-beat 0.7s -0.15s infinite linear;
          animation: ball-beat 0.7s -0.15s infinite linear;
        }
        .la-ball-beat > div:nth-child(2n-1) {
          -webkit-animation-delay: -0.5s;
          -moz-animation-delay: -0.5s;
          -o-animation-delay: -0.5s;
          animation-delay: -0.5s;
        }
        .la-ball-beat.la-sm {
          width: 26px;
          height: 8px;
        }
        .la-ball-beat.la-sm > div {
          width: 4px;
          height: 4px;
          margin: 2px;
        }
        .la-ball-beat.la-2x {
          width: 108px;
          height: 36px;
        }
        .la-ball-beat.la-2x > div {
          width: 20px;
          height: 20px;
          margin: 8px;
        }
        .la-ball-beat.la-3x {
          width: 162px;
          height: 54px;
        }
        .la-ball-beat.la-3x > div {
          width: 30px;
          height: 30px;
          margin: 12px;
        }
        /*
 * Animation
 */
        @-webkit-keyframes ball-beat {
          50% {
            opacity: 0.2;
            -webkit-transform: scale(0.75);
            transform: scale(0.75);
          }
          100% {
            opacity: 1;
            -webkit-transform: scale(1);
            transform: scale(1);
          }
        }
        @-moz-keyframes ball-beat {
          50% {
            opacity: 0.2;
            -moz-transform: scale(0.75);
            transform: scale(0.75);
          }
          100% {
            opacity: 1;
            -moz-transform: scale(1);
            transform: scale(1);
          }
        }
        @-o-keyframes ball-beat {
          50% {
            opacity: 0.2;
            -o-transform: scale(0.75);
            transform: scale(0.75);
          }
          100% {
            opacity: 1;
            -o-transform: scale(1);
            transform: scale(1);
          }
        }
        @keyframes ball-beat {
          50% {
            opacity: 0.2;
            -webkit-transform: scale(0.75);
            -moz-transform: scale(0.75);
            -o-transform: scale(0.75);
            transform: scale(0.75);
          }
          100% {
            opacity: 1;
            -webkit-transform: scale(1);
            -moz-transform: scale(1);
            -o-transform: scale(1);
            transform: scale(1);
          }
        }
      }
      // Ends here
    }
  }
}
</style>