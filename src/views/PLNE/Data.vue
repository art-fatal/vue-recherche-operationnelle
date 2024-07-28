<script setup lang="ts">
import {GoalEnum, OperatorEnum} from "../../models/plne.model";
import {usePLNEStore} from "../../stores/plne.store";
import {useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {calculate} from "../../services/simplex";
import {onMounted, ref} from "vue";
import Solver from 'javascript-lp-solver';

const router = useRouter()
const plneStore = usePLNEStore()

const {
  goal,
  decision,
  constrainst,
  contrainstOperator,
  objectiveFunctionCoeff,
  constrainstCoeff,
  isInt
} = storeToRefs(plneStore)

const goalChoices = [
  {name: 'Maximiser', value: GoalEnum.MAXIMIZE},
  {name: 'Minimiser', value: GoalEnum.MINIMIZE}
]

const binaryChoices = [
  {name: 'Oui', value: true},
  {name: 'Non', value: false}
]

const operatorChoices = [
  {name: '≤', value: OperatorEnum.LOWER},
  {name: '≥', value: OperatorEnum.GREATER},
  {name: '=', value: OperatorEnum.EQUAL}
]

const result = ref()

type Constraint = {
  [key: string]: { min?: number; max?: number; equal?: number }
};

type Variable = {
  z: number;
  [key: string]: number | boolean;
  int: boolean;
};

type Variables = {
  [key: string]: Variable;
};

function createVariables(arr: number[][], zVals: number[]): Variables {
  const result: Variables = {};
  const numVariables = arr[0].length - 1;  // Excluding the last element
  const numConstraints = arr.length;

  for (let i = 0; i < numVariables; i++) {
    const variableKey = `x${i + 1}`;
    const variable: Variable = {
      z: zVals[i],
      int: true
    };

    for (let j = 0; j < numConstraints; j++) {
      variable[`contraint${j + 1}`] = arr[j][i];
    }

    result[variableKey] = variable;
  }

  return result;
}

const createConstraints = (arr: number[][], types: string[]): Constraint => {
  const result: Constraint = {};

  for (let i = 0; i < arr.length; i++) {
    const subArray = arr[i];
    const lastValue = subArray[subArray.length - 1];
    const constraintKey = `contraint${i + 1}`;
    const constraintType = types[i];

    result[constraintKey] = constraintType === OperatorEnum.EQUAL
        ? {equal: lastValue}
        : constraintType === OperatorEnum.LOWER
            ? {max: lastValue} : {min: lastValue};
  }

  return result;
}

const submit = () => {

  const variables = createVariables(constrainstCoeff.value, objectiveFunctionCoeff.value);
  const isIntegers = {}

  Object.keys(variables).forEach((variable) => {
    isIntegers[variable] = isInt.value ? 1 : 0
  })

  const model = {
    "optimize": "z",
    "opType": goal.value === GoalEnum.MAXIMIZE ? "max" : "min",
    "constraints": createConstraints(constrainstCoeff.value, contrainstOperator.value),
    "variables": variables,
    "ints": isIntegers
  };

// Résolution du problème
  result.value = Solver.Solve(model);
  // result.value = calculate(goal.value, decision.value, constrainst.value, contrainstOperator.value, objectiveFunctionCoeff.value, constrainstCoeff.value)

  // router.push({ name: 'plne_result' })
}

onMounted(() => {
  if (decision.value === 3 && constrainst.value === 3) {
    objectiveFunctionCoeff.value[0] = 10
    objectiveFunctionCoeff.value[1] = 14
    objectiveFunctionCoeff.value[2] = 12

    constrainstCoeff.value[0][0] = 1
    constrainstCoeff.value[0][1] = 3
    constrainstCoeff.value[0][2] = 2
    constrainstCoeff.value[0][3] = 40

    constrainstCoeff.value[1][0] = 3
    constrainstCoeff.value[1][1] = 2
    constrainstCoeff.value[1][2] = 1
    constrainstCoeff.value[1][3] = 45

    constrainstCoeff.value[2][0] = 1
    constrainstCoeff.value[2][1] = 1
    constrainstCoeff.value[2][2] = 4
    constrainstCoeff.value[2][3] = 38
  }

})
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
  <div class="flex gap-3 p-fluid justify-start items-center mt-3">
    <label>Nombre entier uniquement :</label>
    <Dropdown
        v-model="isInt"
        :options="binaryChoices"
        optionLabel="name"
        optionValue="value"
    />
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
    <p class="text-left mt-8 mb-3">Max :{{ result.result }}</p>

    <div class="flex flex-wrap gap-3 justify-around mt-5" v-for="(decisionItem, decisionIndex) in Array.from({ length: decision })">
      <InputGroup>
        <InputGroupAddon>x{{ decisionIndex + 1 }}</InputGroupAddon>
        <InputGroupAddon>{{ result[`x${decisionIndex+1}`] }}</InputGroupAddon>
      </InputGroup>
    </div>
  </Panel>

</template>

<style scoped>

</style>