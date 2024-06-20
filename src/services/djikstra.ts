export function dijkstra(village, source = 's1') {
    const precedent = {};
    const dejaTraite = {};
    const distance = {};
    const a_traiter = [];

    for (const node in village) {
        precedent[node] = null;
        dejaTraite[node] = false;
        distance[node] = Infinity;
    }
    distance[source] = 0;
    a_traiter.push([0, source]);

    while (a_traiter.length > 0) {
        a_traiter.sort((a, b) => b[0] - a[0]);
        const [dist_noeud, noeud] = a_traiter.pop();

        if (!dejaTraite[noeud]) {
            dejaTraite[noeud] = true;
            for (const voisin in village[noeud]) {
                const dist_voisin = dist_noeud + village[noeud][voisin];
                if (dist_voisin < distance[voisin]) {
                    distance[voisin] = dist_voisin;
                    precedent[voisin] = noeud;
                    a_traiter.push([dist_voisin, voisin]);
                }
            }
        }
    }
    return { distance, precedent };
}
