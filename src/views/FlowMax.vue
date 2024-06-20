<script setup>
import GraphInput from "../components/GraphInput.vue";
import GraphDisplay from "../components/GraphDisplay.vue";
import { fordFulkerson, makeGraph } from '../services/maxFlowAlgorithm';
import {ref} from "vue";

const edges = ref([])
const maxFlow = ref()

const handleCalculateMaxFlow = (ed) => {
  edges.value = ed
  const graphData = ed.map(edge => ([{ source: edge.source, target: edge.target }, edge.capacity]))
  const { graph, capacity } = makeGraph(graphData)
  maxFlow.value = fordFulkerson(graph, capacity, 's', 't')
}
</script>

<template>
  <Panel>
    <div class="isolate bg-white px-2 py-2 sm:py-2 lg:px-2">
      <div class="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
        <div class="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
      </div>
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Flot maximum</h2>
        <p class="mt-2 text-lg leading-8 text-gray-600">En utilisant l'algorithme de Ford Fulkerson.</p>
      </div>
    </div>
    <GraphInput @calculate-max-flow="handleCalculateMaxFlow" />
    <GraphDisplay  v-if="maxFlow" :edges="edges" :maxFlow="maxFlow" />
  </Panel>
</template>

<style scoped>

</style>