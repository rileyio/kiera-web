<template>
  <div id="app">
    Welcome to the Kiera Bot webportal!
    <br>
    <br>If you're a server owner you'll find options on any servers containing the ⭐️
    listed under the owners category of the dropdown.
    <br>
    <br>Every user will see all other available Bot options in the left menu
    after selecting a server.
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { state } from "../defaults/app-state";

@Component({
  components: {
    //
  }
})
export default class WelcomePanel extends Vue {}
</script>