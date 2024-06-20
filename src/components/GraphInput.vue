<script setup lang="ts">
import { ref } from 'vue'
import InputGroup from 'primevue/inputgroup'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Card from 'primevue/card'

const emit = defineEmits(['calculate-max-flow'])
const edges = ref([
  { source: 's', target: 'a', capacity: 8 },
  { source: 's', target: 'd', capacity: 3 },
  { source: 'a', target: 'b', capacity: 9 },
  { source: 'b', target: 'd', capacity: 7 },
  { source: 'd', target: 'c', capacity: 4 },
  { source: 'b', target: 't', capacity: 2 },
  { source: 'c', target: 't', capacity: 5 }
])

const addEdge = () => {
  edges.value.push({ source: '', target: '', capacity: 0 })
}
const removeEdge = (index) => {
  edges.value.splice(index, 1)
}
const calculateMaxFlow = () => {
  emit('calculate-max-flow', edges.value)
}
</script>

<template>
  <Card>
    <template #title>Entrer les données du graphe</template>
    <template #content>
      <div v-for="(edge, index) in edges" :key="index" class="mb-2">
        <InputGroup>
          <InputText v-model="edge.source" placeholder="Source" />
          <InputText v-model="edge.target" placeholder="Target" />
          <InputNumber v-model="edge.capacity" placeholder="Capacity" />
          <Button @click="removeEdge(index)" label="Supprimer" />

        </InputGroup>
      </div>
    </template>
    <template #footer>
      <div class="flex gap-3 mt-1">
        <Button @click="addEdge">Ajouter une arête</Button>
        <Button @click="calculateMaxFlow">Calculer le flot maximal</Button>
      </div>
    </template>

  </Card>
</template>

<style scoped>

</style>