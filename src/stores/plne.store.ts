import {defineStore} from 'pinia'
import {GoalEnum, OperatorEnum} from "@models/plne.model";

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const usePLNEStore = defineStore('plne', () => {
    const decision = ref(2)
    const constrainst = ref(1)
    const goal = ref<GoalEnum>(GoalEnum.MAXIMIZE)
    const contrainstOperator = ref()

    function setContrainstOperator(operator: OperatorEnum[]) {
        contrainstOperator.value = operator;
    }

    watch(() => constrainst.value, (value) => {
        contrainstOperator.value = Array(value).fill(OperatorEnum.LOWER)
    })

    return {decision, constrainst, goal, contrainstOperator, setContrainstOperator}
})