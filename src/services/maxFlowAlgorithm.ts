import { default as _ } from 'lodash';

export function makeGraph(data) {
  const capacity = _.fromPairs(data.map(d => [`${d[0].source},${d[0].target}`, d[1]]));
  const graph = {};
  data.forEach(d => {
    const {source: i, target: j} = d[0];
    if (!graph[i]) graph[i] = [];
    if (!graph[j]) graph[j] = [];
    graph[i].push(j);
    graph[j].push(i);
  });
  return { graph, capacity };
}

export function fordFulkerson(graph, capacity, s, t) {
  const flot = _.fromPairs(Object.keys(capacity).map(a => [a, 0]));
  let optimalPath = findOptimalPath(graph, capacity, flot, s, t);
  while (optimalPath) {
    const arcToIncrease = optimalPath[0];
    const arcToDicrease = optimalPath[1];
    const delta = Math.min(...arcToIncrease.map(a => capacity[a] - flot[a]).concat(arcToDicrease.map(a => flot[a])));
    arcToIncrease.forEach(a => { flot[a] += delta; });
    arcToDicrease.forEach(a => { flot[a] -= delta; });
    optimalPath = findOptimalPath(graph, capacity, flot, s, t);
  }
  return flot;
}

function findOptimalPath(graphe, capacity, flot, s, t) {
  console.log("findOptimalPath(")
  function dfs(visited, current, arcToIncrease, arcToDicrease) {
    if (current === t) return [arcToIncrease, arcToDicrease];
    const neighborsExiting = graphe[current].filter(i =>
      !visited.has(i) && capacity[`${current},${i}`] > flot[`${current},${i}`]);
    const neighborsEntering = graphe[current].filter(i =>
      !visited.has(i) && flot[`${i},${current}`] > 0);
    for (const i of neighborsExiting) {
      const result = dfs(new Set(visited).add(i), i, [...arcToIncrease, `${current},${i}`], arcToDicrease);
      if (result) return result;
    }
    for (const i of neighborsEntering) {
      const result = dfs(new Set(visited).add(i), i, arcToIncrease, [...arcToDicrease, `${i},${current}`]);
      if (result) return result;
    }
    return null;
  }
  return dfs(new Set([s]), s, [], []);
}
