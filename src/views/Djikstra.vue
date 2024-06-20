<script setup>
import {ref} from "vue";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Card from "primevue/card";

const source = ref()

const summits = ref({
  's1': {'s2': 3, 's3': 12},
  's2': {'s1': 3, 's4': 5, 's5': 2},
  's5': {'s2': 2, 's4': 1},
  's4': {'s5': 1, 's3': 4},
  's3': {'s4': 4, 's1': 12}
})

const newSummit = ref('')
const newNeighbor = ref('')
const newDistance = ref(0)
const result = ref(null)

const addSummit = () => {
  if (newSummit.value && newNeighbor.value && newDistance.value > 0) {
    if (!summits.value[newSummit.value]) {
      summits.value[newSummit.value] = {};
    }
    summits.value[newSummit.value][newNeighbor.value] = newDistance.value;

    // Adding the reverse path for undirected graph (if necessary)
    if (!summits.value[newNeighbor.value]) {
      summits.value[newNeighbor.value] = {};
    }
    summits.value[newNeighbor.value][newSummit.value] = newDistance.value;

    // Clear inputs
    newSummit.value = '';
    newNeighbor.value = '';
    newDistance.value = 0;
  }
}

const     calculate = () => {
  console.log('azefr')
  result.value = dijkstra(summits.value, source.value);
}

const dijkstra = (summits, source) =>  {
  const distances = {};
  const previous = {};
  const summitAlreadyFinisheds = {};
  const todos = [];

  for (const summit in summits) {
    distances[summit] = Infinity;
    previous[summit] = null;
    summitAlreadyFinisheds[summit] = false;
  }
  distances[source] = 0;
  todos.push([0, source]);

  while (todos.length > 0) {
    todos.sort((a, b) => b[0] - a[0]);
    const [distanceToCurrentSummit, currentSummit] = todos.pop();

    if (!summitAlreadyFinisheds[currentSummit]) {
      summitAlreadyFinisheds[currentSummit] = true;

      for (const linkedSummit in summits[currentSummit]) {
        const distToLinkedSummit = summits[currentSummit][linkedSummit];
        const distLinkedSummitFromSource = distanceToCurrentSummit + distToLinkedSummit;

        if (distLinkedSummitFromSource < distances[linkedSummit]) {
          distances[linkedSummit] = distLinkedSummitFromSource;
          previous[linkedSummit] = currentSummit;
          todos.push([distLinkedSummitFromSource, linkedSummit]);
        }
      }
    }
  }

  return { distance: distances, previous: previous };
}

</script>

<template>
  <Panel>
    <div class="isolate bg-white px-2 py-2 sm:py-2 lg:px-2">
      <div class="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
           aria-hidden="true">
        <div
            class="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
            style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"/>
      </div>
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Plus court chemain</h2>
        <p class="mt-2 text-lg leading-8 text-gray-600">En utilisant l'algorithme de Djikstra.</p>
      </div>
    </div>
    <div>
      <div class="card flex justify-content-center w-full">
        <FloatLabel>
          <InputText id="source" v-model="source"/>
          <label for="source">Sommet source</label>
        </FloatLabel>
      </div>
      <Card>
        <template #title>Sommets</template>
        <template #content>
          <div v-for="(neighbors, summit) in summits" :key="summit">
            <h3>{{ summit }}</h3>
            <div v-for="(distance, neighbor) in neighbors" :key="neighbor">
              {{ summit }} - {{ neighbor }} : {{ distance }}
            </div>
          </div>
          <input v-model="newSummit" placeholder="Nouveau sommet"/>
          <input v-model="newNeighbor" placeholder="Voisin"/>
          <input v-model.number="newDistance" placeholder="Distance" type="number"/>
        </template>
        <template #footer>
          <div class="flex gap-3 mt-1">
            <Button @click="addSummit">Ajouter une sommet</Button>
            <Button @click="calculate">Calculer</Button>
          </div>
        </template>
      </Card>
      <Card v-if="result">
        <template #title>Resultat</template>
        <template #content>
          <div>
            <h3>Distances minimum:</h3>
            <pre>{{ result.distance }}</pre>
          </div>
          <div>
            <h3>Liste des précédents:</h3>
            <pre>{{ result.previous }}</pre>
          </div>
        </template>
      </Card>
    </div>
  </Panel>
</template>

<style scoped>

</style>