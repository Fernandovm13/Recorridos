export default class Graph {
    #matrizAdyacencia = [];
    #map = new Map();

    constructor() {}

    addVertices(...vertices) {
        for (let value of vertices) {
            this.#matrizAdyacencia.push([]);
            this.#map.set(value, this.#matrizAdyacencia.length - 1);
        }
    }

    addV(value) {
        this.#matrizAdyacencia.push([]);
        this.#map.set(value, this.#matrizAdyacencia.length - 1);
    }

    addConexion(start, end, weight = 1) {
        if (this.#map.has(start) && this.#map.has(end)) {
            this.#matrizAdyacencia[this.#map.get(start)][this.#map.get(end)] = weight;
            return true;
        }
        return false;
    }

    async bfs(callback) {
        let queue = [];
        let list = [];
        const entries = [...this.#map.entries()];
        for (let i = 0; i < this.#matrizAdyacencia.length; i++)
            list[i] = false;

        let [key] = entries[0];
        queue.push(key);

        while (queue.length > 0) {
            let val = queue.shift(); // Sacamos el primer elemento de la cola
            callback(val); // Imprimimos el valor
            list[this.#map.get(val)] = true; // Marcamos de visitado
            for (let i = 0; i < this.#matrizAdyacencia[this.#map.get(val)].length; i++) {
                if (this.#matrizAdyacencia[this.#map.get(val)][i]) {
                    let [key] = entries[i];
                    if (!list[this.#map.get(key)] && !queue.includes(key))
                        queue.push(key); // Agregamos los vecinos a la cola
                }
            }
            await this.sleep(1000); // Esperar 1 segundo entre pasos
        }
    }

    async dfs(start, callback, visited = new Set()) {
        visited.add(start);
        callback(start);
        const startIdx = this.#map.get(start);
        for (let i = 0; i < this.#matrizAdyacencia[startIdx].length; i++) {
            if (this.#matrizAdyacencia[startIdx][i]) {
                let neighbor = [...this.#map.keys()][i];
                if (!visited.has(neighbor)) {
                    await this.sleep(1000); // Esperar 1 segundo entre pasos
                    await this.dfs(neighbor, callback, visited);
                }
            }
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getVertices() {
        return [...this.#map.keys()];
    }

    getEdges() {
        const edges = [];
        for (let [start, startIndex] of this.#map.entries()) {
            for (let [endIndex, weight] of this.#matrizAdyacencia[startIndex].entries()) {
                if (weight) {
                    edges.push([start, [...this.#map.keys()][endIndex]]);
                }
            }
        }
        return edges;
    }

    async dijkstra(startVertex, callback) {
        const distances = {};
        const visited = new Set();
        const previous = {};
        const vertices = this.getVertices();

        for (const vertex of vertices) {
            distances[vertex] = vertex === startVertex ? 0 : Infinity;
            previous[vertex] = null;
        }

        while (visited.size < vertices.length) {
            const currentVertex = this.getMinDistanceVertex(distances, visited);
            visited.add(currentVertex);

            for (const neighbor of this.getNeighbors(currentVertex)) {
                const weight = this.getWeight(currentVertex, neighbor);
                const totalDistance = distances[currentVertex] + weight;
                if (totalDistance < distances[neighbor]) {
                    distances[neighbor] = totalDistance;
                    previous[neighbor] = currentVertex;
                }
            }
            callback(previous, currentVertex);
            await this.sleep(1000); // Esperar 1 segundo entre pasos
        }
        return previous;
    }

    getMinDistanceVertex(distances, visited) {
        let minDistance = Infinity;
        let minVertex = null;
        for (const vertex in distances) {
            if (!visited.has(vertex) && distances[vertex] <= minDistance) {
                minDistance = distances[vertex];
                minVertex = vertex;
            }
        }
        return minVertex;
    }

    getNeighbors(vertex) {
        const neighbors = [];
        const vertexIndex = this.#map.get(vertex);
        for (let i = 0; i < this.#matrizAdyacencia[vertexIndex].length; i++) {
            if (this.#matrizAdyacencia[vertexIndex][i]) {
                neighbors.push([...this.#map.keys()][i]);
            }
        }
        return neighbors;
    }

    getWeight(start, end) {
        const startIdx = this.#map.get(start);
        const endIdx = this.#map.get(end);
        return this.#matrizAdyacencia[startIdx][endIdx];
    }
}
