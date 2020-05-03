<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

// Defaults
import { AppState } from '@/defaults/app-state'

@Component
export default class ComponentBase extends Vue {
  @Prop({ default: () => AppState })
  private AppState!: typeof AppState
}
</script>
