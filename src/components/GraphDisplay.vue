<script setup lang="ts">
import { instance } from '@viz-js/viz'

import Card from 'primevue/card'
import { onMounted, ref, watch } from 'vue'

const graphContainer = ref('')
const props = defineProps({
  edges: {
    type: Array,
    required: true
  },
  maxFlow: {
    type: Object,
    required: true
  }
})

watch([()=> props.edges, ()=> props.maxFlow], () => {
  graphContainer.value.innerHTML = ''
  renderGraph()
})

const renderGraph = () => {
  let dotString = 'digraph G {'

  props.edges?.forEach(edge => {
    const flow = props.maxFlow?.[`${edge.source},${edge.target}`] || 0
    dotString += `${edge.source} -> ${edge.target} [label="${flow} / ${edge.capacity}"];`
  })

  dotString += '}'
  console.log(dotString)

  instance().then(viz => {
    console.log("instance")
    const element = viz.renderSVGElement(dotString)
    graphContainer.value.appendChild(element)
  })
}

onMounted(() => {
  renderGraph()
})
</script>

<template>
  <Card>
    <template #title>Graphe du flot maximal</template>
    <template #content>
      <div id="azer" ref="graphContainer"></div>
    </template>
  </Card>
</template>

<style scoped>
div {
  margin-top: 20px;
}
</style>