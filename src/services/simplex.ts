export const calculate = (goal, decision, constrainst, contrainstOperator, objectiveFunctionCoeff, constrainstCoeff) => {
    console.log("calculate")

    // Initialize the tableau
    const tableau: number[][] = [];

    // Add the constraints to the tableau with slack variables
    for (let i = 0; i < constrainst; i++) {
        const row = [...constrainstCoeff[i]];
        // Add slack variable
        for (let j = 0; j < constrainst; j++) {
            row.splice(row.length - 1, 0, i === j ? 1 : 0); // Insert slack variable before the last element
        }
        tableau.push(row);
    }


    // Add the objective function to the tableau
    const objectiveRow = [...objectiveFunctionCoeff.map(coeff => coeff), ...Array(constrainst).fill(0)];
    tableau.push(objectiveRow);

    console.log("Initial tableau:", tableau);

    // Perform Simplex iterations
    iterateSimplex(tableau);

    // Extract the solution
    const solution = extractSolution(tableau, decision);

    console.log("Optimal solution:", solution);
    return solution;
}


// Helper functions
const findPivotColumn = (lastRow: number[]): number => {
    let minIndex = 0;
    for (let i = 1; i < lastRow.length; i++) {
        if (lastRow[i] < lastRow[minIndex]) {
            minIndex = i;
        }
    }
    return minIndex;
};

const findPivotRow = (tableau: number[][], pivotColumn: number): number => {
    let minRatio = Infinity;
    let pivotRow = -1;
    for (let i = 0; i < tableau.length - 1; i++) {
        const element = tableau[i][pivotColumn];
        if (element > 0) {
            const ratio = tableau[i][tableau[i].length - 1] / element;
            if (ratio < minRatio) {
                minRatio = ratio;
                pivotRow = i;
            }
        }
    }
    return pivotRow;
};

const pivot = (tableau: number[][], pivotRow: number, pivotColumn: number) => {
    const pivotValue = tableau[pivotRow][pivotColumn];
    for (let j = 0; j < tableau[pivotRow].length; j++) {
        tableau[pivotRow][j] /= pivotValue;
    }

    for (let i = 0; i < tableau.length; i++) {
        if (i !== pivotRow) {
            const rowFactor = tableau[i][pivotColumn];
            for (let j = 0; j < tableau[i].length; j++) {
                tableau[i][j] -= rowFactor * tableau[pivotRow][j];
            }
        }
    }
};

const iterateSimplex = (tableau: number[][]) => {
    while (true) {
        const pivotColumn = findPivotColumn(tableau[tableau.length - 1]);
        if (tableau[tableau.length - 1][pivotColumn] >= 0) {
            break; // Optimal solution found
        }

        const pivotRow = findPivotRow(tableau, pivotColumn);
        if (pivotRow === -1) {
            throw new Error("Unbounded solution");
        }

        pivot(tableau, pivotRow, pivotColumn);
    }
};

const extractSolution = (tableau: number[][], decision: number): number[] => {
    const solution = Array(decision).fill(0);
    for (let i = 0; i < tableau.length - 1; i++) {
        const basicVariableColumn = tableau[i].slice(0, decision).findIndex(value => value === 1);
        if (basicVariableColumn !== -1 && tableau[i].slice(0, decision).every((value, index) => index === basicVariableColumn || value === 0)) {
            solution[basicVariableColumn] = tableau[i][tableau[i].length - 1];
        }
    }
    return solution;
};
