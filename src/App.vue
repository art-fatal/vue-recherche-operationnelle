<script setup>
import { ref } from 'vue'
import Dock from 'primevue/dock';

const items = ref([
  {
    label: 'Flot maximale',
    link: 'flot_maximal'
  },
  {
    label: 'Djikstra',
    link: 'djikstra'
  },
  {
    label: 'Coloration',
    link: 'coloration'
  },
  {
    label: 'PLNE',
    link: 'plne'
  }
]);

</script>

<template>
  <Dock :model="items" position="top">
    <template #item="item">
      <router-link :to="{ name: item.item.link }">{{ item.label }}</router-link>
    </template>
  </Dock>
  <RouterView />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
