<script setup>
import {onMounted, ref} from "vue";
import {usePLNEStore} from "../../stores/plne.store";
import {storeToRefs} from "pinia";
import {calculate} from "../../services/simplex";
const plneStore = usePLNEStore()

const {goal, decision, constrainst, contrainstOperator} = storeToRefs(plneStore)

const result = ref()
onMounted(() => {
  result.value = calculate(goal, decision, constrainst, contrainstOperator)
})
</script>

<template>

</template>

<style scoped>

</style>