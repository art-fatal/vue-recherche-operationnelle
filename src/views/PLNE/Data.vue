<script setup>
import {GoalEnum, OperatorEnum} from "../../models/plne.model";
import {usePLNEStore} from "../../stores/plne.store";
import {useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {calculate} from "../../services/simplex";
import {ref} from "vue";

const router = useRouter()
const plneStore = usePLNEStore()

const {goal, decision, constrainst, contrainstOperator, objectiveFunctionCoeff, constrainstCoeff} = storeToRefs(plneStore)
const goalChoices = [
  {name: 'Maximiser', value: GoalEnum.MAXIMIZE},
  {name: 'Minimiser', value: GoalEnum.MINIMIZE}
]

const operatorChoices = [
  {name: '≤', value: OperatorEnum.LOWER},
  {name: '≥', value: OperatorEnum.GREATER},
  {name: '=', value: OperatorEnum.EQUAL}
]

const result = ref()

const submit = () => {
  console.log("submit")
  result.value = calculate(goal.value, decision.value, constrainst.value, contrainstOperator.value, objectiveFunctionCoeff.value, constrainstCoeff.value)

  // router.push({ name: 'plne_result' })
}

</script>

<template>

  <div class="flex gap-3 p-fluid justify-between items-center">
    <label :class="'w-1/'+(decision+2)">Fonction objéctif :</label>
    <Dropdown
        v-model="goal"
        :options="goalChoices"
        optionLabel="name"
        optionValue="value"
        :class="'w-1/'+(decision+2)"
    />

    <div v-for="(item, index) in Array.from({ length: decision })" :key="index"
         class="flex gap-3 justify-between" :class="'w-1/'+(decision+2)">
      <InputGroup class="w-2/3">
        <InputNumber v-model="objectiveFunctionCoeff[index]" class="w-1/2"/>
        <InputGroupAddon class="w-1/2">X<sub>{{ index + 1 }}</sub></InputGroupAddon>
      </InputGroup>
      <div v-if="index < decision - 1" class="w-1/3 text-center flex items-center justify-center">+</div>
    </div>
  </div>
  <p class="text-center mt-8 mb-3">Contrainte :</p>
  <div
      v-for="(constrainstItem, constrainstIndex) in Array.from({ length: constrainst })"
      class="flex gap-3 w-full justify-between items-center mb-4"
      :key="'c'+constrainstIndex"
  >
    <InputGroupAddon class="w-10">L<sub>{{ constrainstIndex + 1 }}</sub></InputGroupAddon>

    <div
        v-for="(item, decisionIndex) in Array.from({ length: decision })"
        :key="'c'+constrainstIndex+'d'+decisionIndex"
        :id="'c'+constrainstIndex+'d'+decisionIndex"
        class="flex justify-between gap-3"
        :class="'w-'+((decision*3)-1)+'/' + ((decision*3)+1)"
    >
      <InputGroup class="w-2/3">
        <InputNumber v-model="constrainstCoeff[constrainstIndex][decisionIndex]" class="w-1/2"/>
        <InputGroupAddon class="w-1/2">X<sub>{{ decisionIndex + 1 }}</sub></InputGroupAddon>
      </InputGroup>
      <div v-if="decisionIndex < decision - 1" class="w-1/3 text-center flex items-center justify-center">+</div>
      <Dropdown
          v-else
          class="w-1/3"
          v-model="contrainstOperator[constrainstIndex]"
          :options="operatorChoices"
          optionLabel="name"
          optionValue="value"
      />
    </div>
    <InputNumber v-model="constrainstCoeff[constrainstIndex][decision]" class="ms-5" :class="'w-1/'+((decision*3)+1)"/>
  </div>
  <p class="text-center mb-8">
            <span v-for="(decisionItem, decisionIndex) in Array.from({ length: decision })" :key="'dcp'+decisionIndex">
              X<sub>{{ decisionIndex + 1 }}</sub>
              <span v-if="decisionIndex < decision - 1">,</span>
            </span>
    <span> ≥ 0</span>
  </p>

  <div class="flex flex-wrap gap-3 justify-around mt-5">
    <router-link :to="{ name: 'plne_index' }">
      <Button icon="pi pi-arrow-left" outlined class="text-xl h-full"></Button>
    </router-link>
    <Button label="Continuer" outlined class="w-50 p-3 text-xl" @click="submit"></Button>
  </div>
  <Panel v-if="result">
    <p class="text-center mt-8 mb-3">Resultat :</p>
    <p class="text-left mt-8 mb-3">Max :{{ result.max }}</p>

    <div class="flex flex-wrap gap-3 justify-around mt-5" v-for="row in result.tableau">
      <InputGroup>
        <InputGroupAddon>{{ row.variable }}</InputGroupAddon>
        <InputGroupAddon v-for="col in row.row">{{ col }}</InputGroupAddon>
      </InputGroup>
    </div>
  </Panel>

</template>

<style scoped>

</style>