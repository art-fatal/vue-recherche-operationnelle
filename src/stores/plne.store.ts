import {defineStore} from 'pinia'
import {GoalEnum, OperatorEnum} from "../models/plne.model";
import {ref, watch} from "vue";

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const usePLNEStore = defineStore('plne', () => {
    const decision = ref(3)
    const constrainst = ref(3)
    const goal = ref<GoalEnum>(GoalEnum.MAXIMIZE)
    const objectiveFunctionCoeff = ref(Array(decision.value).fill(1))
    const constrainstCoeff = ref<Array<Array<number>>>()
    const contrainstOperator = ref(Array(constrainst.value).fill(OperatorEnum.LOWER))

    constrainstCoeff.value = Array.from({ length: constrainst.value }, () => Array.from({ length: decision.value + 1}, () => 1))

    function setContrainstOperator(operator: OperatorEnum[]) {
        contrainstOperator.value = operator;
    }

    watch(() => constrainst.value, (value) => {
        contrainstOperator.value = Array(value).fill(OperatorEnum.LOWER)
        constrainstCoeff.value = Array(value).fill(Array(decision.value).fill(1))
    })
    watch(() => decision.value, (value) => {
        objectiveFunctionCoeff.value = Array(value).fill(1)
        constrainstCoeff.value = Array.from({ length: constrainst.value }, () => Array.from({ length: decision.value + 1}, () => 1))
    })

    return {decision, constrainst, goal, objectiveFunctionCoeff, constrainstCoeff, contrainstOperator, setContrainstOperator}
})