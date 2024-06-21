<script setup lang="ts">
import {usePLNEStore} from "../../stores/plne.store";
import {storeToRefs} from "pinia";
import {useRouter} from "vue-router";

const router = useRouter()

const plneStore = usePLNEStore()
const {decision, constrainst} = storeToRefs(plneStore)


const submit = () => {
  router.push({ name: 'plne_data' })
}
</script>

<template>
  <div class="flex flex-wrap gap-3 p-fluid justify-between">
    <FloatLabel>
      <InputNumber id="number-input" v-model="decision" :min="2"/>
      <label for="number-input">Nombre de variable de décision</label>
    </FloatLabel>

    <FloatLabel>
      <InputNumber id="number-input" v-model="constrainst" :min="1"/>
      <label for="number-input">Nombre de contrainte</label>
    </FloatLabel>
    <Button label="Continuer" outlined class="w-50 p-3 text-xl" @click="submit"></Button>
  </div>
</template>

<style scoped>

</style>