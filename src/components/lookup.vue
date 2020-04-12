<template>
  <el-autocomplete v-model="props.state4" :fetch-suggestions="querySearchAsync" placeholder="Please input" @select="handleSelect"></el-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class PermissionsPanel extends Vue {
  @Prop({
    default: () => {
      return {
        links: [],
        state4: '',
        timeout: null
      }
    }
  })
  private props!: any

  loadBasic() {
    return []
  }

  querySearchAsync(queryString: string, cb: Function) {
    // Only accept if more than 2 characters entered
    if (queryString.length < 2) {
      cb(this.loadBasic())
    }
    const links = this.props.links
    const results = queryString ? links.filter(this.createFilter(queryString)) : links

    clearTimeout(this.props.timeout)
    this.props.timeout = setTimeout(() => {
      cb(results)
    }, 3000 * Math.random())
  }

  createFilter(queryString: string) {
    return (link: any) => {
      return link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    }
  }

  handleSelect(item: any) {
    console.log(item)
  }

  mounted() {
    this.props.links = this.loadBasic()
  }
}
</script>
