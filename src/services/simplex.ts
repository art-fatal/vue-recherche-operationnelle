import {GoalEnum, OperatorEnum} from "../models/plne.model";
import Fraction from 'fraction.js';

export const calculate = (goal, decision, constrainst, contrainstOperator, objectiveFunctionCoeff, constrainstCoeff) => {
    // Initialize the tableau with variable names
    const tableau: { row: Fraction[], variable: string }[] = [];

    // Variable names for each column
    const variableNames = [
        ...Array(decision).fill(0).map((_, i) => `x${i + 1}`),
    ];

    // Add slack, excess and artificial variables names
    const artificialVars: string[] = [];
    for (let i = 0; i < constrainst; i++) {
        if (contrainstOperator[i] === OperatorEnum.LOWER) {
            variableNames.push(`s${i + 1}`);
        } else if (contrainstOperator[i] === OperatorEnum.GREATER) {
            variableNames.push(`e${i + 1}`);
            artificialVars.push(`a${i + 1}`);
        } else if (contrainstOperator[i] === OperatorEnum.EQUAL) {
            artificialVars.push(`a${i + 1}`);
        }
    }
    variableNames.push(...artificialVars, 'Value');
    // Add the constraints to the tableau with slack/excess/artificial variables
    let artificialCount = 0;
    for (let i = 0; i < constrainst; i++) {
        const row = constrainstCoeff[i].map(coeff => new Fraction(coeff));
        if (contrainstOperator[i] === OperatorEnum.LOWER) {
            row.splice(row.length - 1, 0, ...Array(constrainst).fill(0).map((_, j) => new Fraction(i === j ? 1 : 0)));
        } else if (contrainstOperator[i] === OperatorEnum.GREATER) {
            row.splice(row.length - 1, 0, ...Array(constrainst).fill(0).map((_, j) => new Fraction(i === j ? -1 : 0)), new Fraction(1));
            artificialCount++;
        } else if (contrainstOperator[i] === OperatorEnum.EQUAL) {
            row.splice(row.length - 1, 0, ...Array(constrainst).fill(0).map(() => new Fraction(0)), new Fraction(1));
            artificialCount++;
        }
        tableau.push({row, variable: `s${i + 1}`});
    }

    // Add the objective function to the tableau
    const objectiveRow = [
        ...objectiveFunctionCoeff.map(coeff => new Fraction(goal === GoalEnum.MAXIMIZE ? coeff : -coeff)),
        ...Array(constrainst + artificialCount).fill(new Fraction(0)),
        new Fraction(0)
    ];
    tableau.push({row: objectiveRow, variable: 'Z'});

    console.log("Initial tableau:", variableNames);
    tableau.forEach(
        t => console.log(
            t.variable,
            t.row.map(
                f => f.toFraction()
            )
        )
    );

    const tableauHistory = [tableau.map(t => ({...t}))];
    // Perform Simplex iterations
    iterateSimplex(tableau, variableNames);

    // Extract the solution
    const solution = extractSolution(tableau, decision, constrainst);

    console.log("Optimal solution:", solution);
    console.log("Valeur max de Z:", tableau[tableau.length - 1].row[tableau[tableau.length - 1].row.length - 1].neg().toFraction());

    return {
        tableau,
        solution,
        max: tableau[tableau.length - 1].row[tableau[tableau.length - 1].row.length - 1].neg().toFraction(),
        tableauHistory
    };
}


// Helper functions
const findPivotColumn = (lastRow: Fraction[]): number => {
    let minIndex = 0;
    for (let i = 1; i < lastRow.length - 1; i++) {
        if (lastRow[i].compare(lastRow[minIndex]) > 0) {
            minIndex = i;
        }
    }
    return minIndex;
};

const findPivotRow = (tableau: { row: Fraction[], variable: string }[], pivotColumn: number): number => {
    let minRatio = new Fraction(1e10);
    let pivotRow = -1;
    for (let i = 0; i < tableau.length - 1; i++) {
        const element = tableau[i].row[pivotColumn];
        if (element.compare(0) > 0) {
            const ratio = tableau[i].row[tableau[i].row.length - 1].div(element);
            if (ratio.compare(minRatio) < 0) {
                minRatio = ratio;
                pivotRow = i;
            }
        }
    }
    return pivotRow;
};

const pivot = (tableau: {
    row: Fraction[],
    variable: string
}[], pivotRow: number, pivotColumn: number, variableNames: string[]) => {
    const pivotValue = tableau[pivotRow].row[pivotColumn];
    for (let j = 0; j < tableau[pivotRow].row.length; j++) {
        tableau[pivotRow].row[j] = tableau[pivotRow].row[j].div(pivotValue);
    }

    for (let i = 0; i < tableau.length; i++) {
        if (i !== pivotRow) {
            const rowFactor = tableau[i].row[pivotColumn];
            for (let j = 0; j < tableau[i].row.length; j++) {
                tableau[i].row[j] = tableau[i].row[j].sub(rowFactor.mul(tableau[pivotRow].row[j]));
            }
        }
    }
    tableau[pivotRow].variable = variableNames[pivotColumn];
};

const iterateSimplex = (tableau: { row: Fraction[], variable: string }[], variableNames: string[]) => {
    while (true) {
        const pivotColumn = findPivotColumn(tableau[tableau.length - 1].row);
        if (tableau[tableau.length - 1].row[pivotColumn].compare(0) <= 0) {
            break; // Optimal solution found
        }

        const pivotRow = findPivotRow(tableau, pivotColumn);
        if (pivotRow === -1) {
            throw new Error("Unbounded solution");
        }

        pivot(tableau, pivotRow, pivotColumn, variableNames);
    }
};


const extractSolution = (tableau: { row: Fraction[], variable: string }[], decision: number, constrainst: number): {
    [key: string]: string
} => {
    const solution: { [key: string]: string } = {};
    tableau.forEach((t, i) => {
        if (i < tableau.length - 1) { // Skip objective row
            solution[t.variable] = t.row[t.row.length - 1].toFraction();
        }
    });
    for (let i = 0; i < decision; i++) {
        if (!solution.hasOwnProperty(`x${i + 1}`)) {
            solution[`x${i + 1}`] = new Fraction(0).toFraction();
        }
    }
    return solution;
};
