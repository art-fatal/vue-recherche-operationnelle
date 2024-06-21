export const calculate = (goal, decision, constrainst, contrainstOperator, objectiveFunctionCoeff, constrainstCoeff) => {
    console.log("calculate")

    // Initialize the tableau with variable names
    const tableau: { row: number[], variable: string }[] = [];

    // Variable names for each column
    const variableNames = [
        ...Array(decision).fill(0).map((_, i) => `x${i + 1}`),
    ];

    // Add slack, excess and artificial variables names
    const artificialVars: string[] = [];
    for (let i = 0; i < constrainst; i++) {
        if (contrainstOperator[i] === 'lte') {
            variableNames.push(`s${i + 1}`);
        } else if (contrainstOperator[i] === 'gte') {
            variableNames.push(`e${i + 1}`);
            artificialVars.push(`a${i + 1}`);
        } else if (contrainstOperator[i] === 'eq') {
            artificialVars.push(`a${i + 1}`);
        }
    }
    variableNames.push(...artificialVars, 'Value');

    // Add the constraints to the tableau with slack variables
    for (let i = 0; i < constrainst; i++) {
        const row = [...constrainstCoeff[i]];
        // Add slack variable
        row.splice(row.length - 1, 0, ...Array(constrainst).fill(0).map((_, j) => (i === j ? 1 : 0)));
        tableau.push({ row, variable: `s${i + 1}` });
    }

    // Add the objective function to the tableau
    const objectiveRow = [
        ...objectiveFunctionCoeff.map(coeff => coeff),
        ...Array(constrainst).fill(0),
        0
    ];
    tableau.push({ row: objectiveRow, variable: 'Z' });

    console.log("Initial tableau:", variableNames);
    tableau.forEach(t => console.log(t.variable, t.row));

    // Perform Simplex iterations
    iterateSimplex(tableau, variableNames);

    // Extract the solution
    const solution = extractSolution(tableau, decision, constrainst);

    console.log("Optimal solution:", solution);
    console.log("Valeur max de Z:", -tableau[tableau.length - 1].row[tableau[tableau.length - 1].row.length - 1]);

    return {tableau, solution, max: -tableau[tableau.length - 1].row[tableau[tableau.length - 1].row.length - 1]};
}


// Helper functions
const findPivotColumn = (lastRow: number[]): number => {
    let minIndex = 0;
    for (let i = 1; i < lastRow.length - 1; i++) {
        if (lastRow[i] > lastRow[minIndex]) {
            minIndex = i;
        }
    }
    return minIndex;
};

const findPivotRow = (tableau: { row: number[], variable: string }[], pivotColumn: number): number => {
    let minRatio = Infinity;
    let pivotRow = -1;
    for (let i = 0; i < tableau.length - 1; i++) {
        const element = tableau[i].row[pivotColumn];
        if (element > 0) {
            const ratio = tableau[i].row[tableau[i].row.length - 1] / element;
            if (ratio < minRatio) {
                minRatio = ratio;
                pivotRow = i;
            }
        }
    }
    return pivotRow;
};

const pivot = (tableau: { row: number[], variable: string }[], pivotRow: number, pivotColumn: number, variableNames: string[]) => {
    const pivotValue = tableau[pivotRow].row[pivotColumn];
    for (let j = 0; j < tableau[pivotRow].row.length; j++) {
        tableau[pivotRow].row[j] /= pivotValue;
    }

    for (let i = 0; i < tableau.length; i++) {
        if (i !== pivotRow) {
            const rowFactor = tableau[i].row[pivotColumn];
            for (let j = 0; j < tableau[i].row.length; j++) {
                tableau[i].row[j] -= rowFactor * tableau[pivotRow].row[j];
            }
        }
    }
    tableau[pivotRow].variable = variableNames[pivotColumn];
};

const iterateSimplex = (tableau: { row: number[], variable: string }[], variableNames: string[]) => {
    while (true) {
        const pivotColumn = findPivotColumn(tableau[tableau.length - 1].row);
        if (tableau[tableau.length - 1].row[pivotColumn] <= 0) {
            break; // Optimal solution found
        }

        const pivotRow = findPivotRow(tableau, pivotColumn);
        if (pivotRow === -1) {
            throw new Error("Unbounded solution");
        }

        pivot(tableau, pivotRow, pivotColumn, variableNames);
    }
};


const extractSolution = (tableau: { row: number[], variable: string }[], decision: number, constrainst: number): { [key: string]: number } => {
    const solution: { [key: string]: number } = {};
    tableau.forEach((t, i) => {
        if (i < tableau.length - 1) { // Skip objective row
            solution[t.variable] = t.row[t.row.length - 1];
        }
    });
    for (let i = 0; i < decision; i++) {
        if (!solution.hasOwnProperty(`x${i + 1}`)) {
            solution[`x${i + 1}`] = 0;
        }
    }
    return solution;
};
