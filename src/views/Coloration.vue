<script setup lang="ts">
import Solver from 'javascript-lp-solver';

import Fraction from 'fraction.js';
// Définition du modèle
const model = {
  "optimize": "z",
  "opType": "max",
  "constraints": {
    "contraint1": {"max": 12},
    "contraint2": {"min": 4},
    "contraint3": {"max": 3}
  },
  "variables": {
    "x1": {
      "z": 4,
      "contraint1": 3,
      "contraint2": 1,
      "contraint3": 1,
      "int" : true
    },
    "x2": {
      "z": 2,
      "contraint1": 2,
      "contraint2": 3,
      "contraint3": 0,
      "int" : true
    }
  },
  "ints": {"x1": 1, "x2": 1, "z": 1}
};

// Résolution du problème
const results = Solver.Solve(model);

console.log(results);

// Affichage des résultats
console.log("Solution optimale :");
console.log(`x1 : ${results.x1}`);
console.log(`x2 : ${results.x2}`);
console.log(`Z : ${results.result}`);
</script>

<template>
  <div class="isolate bg-white px-2 py-2 sm:py-2 lg:px-2">
    <div class="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
         aria-hidden="true">
      <div
          class="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"/>
    </div>
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Coloration</h2>
    </div>
  </div>
</template>

<style scoped>

</style>