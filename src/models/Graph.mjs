import PriorityQueue from '../models/PriorityQueue.mjs';

export default class Graph {
    #adjacencyList = new Map();

    constructor() {}

    addVertices(...vertices) {
        for (let vertex of vertices) {
            this.addV(vertex);
        }
    }

    addV(vertex) {
        if (!this.#adjacencyList.has(vertex)) {
            this.#adjacencyList.set(vertex, []);
        }
    }

    addConexion(start, end, weight = 1) {
        if (this.#adjacencyList.has(start) && this.#adjacencyList.has(end)) {
            this.#adjacencyList.get(start).push({ vertex: end, weight });
            this.#adjacencyList.get(end).push({ vertex: start, weight }); // Si el grafo es no dirigido
            return true;
        }
        return false;
    }

    async bfs(callback) {
        let queue = [];
        let visited = new Set();
        const vertices = Array.from(this.#adjacencyList.keys());

        queue.push(vertices[0]);
        visited.add(vertices[0]);

        while (queue.length > 0) {
            let val = queue.shift();
            callback(val);
            const neighbors = this.#adjacencyList.get(val);

            for (let neighbor of neighbors) {
                if (!visited.has(neighbor.vertex)) {
                    queue.push(neighbor.vertex);
                    visited.add(neighbor.vertex);
                }
            }

            await this.sleep(1000);
        }
    }

    async dfs(start, callback, visited = new Set()) {
        visited.add(start);
        callback(start);

        const neighbors = this.#adjacencyList.get(start);
        for (let neighbor of neighbors) {
            if (!visited.has(neighbor.vertex)) {
                await this.sleep(1000);
                await this.dfs(neighbor.vertex, callback, visited);
            }
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getVertices() {
        return Array.from(this.#adjacencyList.keys());
    }

    getEdges() {
        const edges = [];
        for (let [start, neighbors] of this.#adjacencyList.entries()) {
            for (let neighbor of neighbors) {
                edges.push([start, neighbor.vertex, neighbor.weight]);
            }
        }
        return edges;
    }

    async dijkstra(startVertex, callback) {
        const distances = {};
        const previous = {};
        const vertices = this.getVertices();
    
        for (let vertex of vertices) {
            distances[vertex] = Infinity;
            previous[vertex] = null;
        }
    
        distances[startVertex] = 0;
    
        const pq = new PriorityQueue();
        pq.enqueue(startVertex, 0);
    
        while (!pq.isEmpty()) {
            const { value: currentVertex } = pq.dequeue();
    
            const neighbors = this.#adjacencyList.get(currentVertex);
            for (let neighbor of neighbors) {
                const distance = distances[currentVertex] + neighbor.weight;
    
                if (distance < distances[neighbor.vertex]) {
                    distances[neighbor.vertex] = distance;
                    previous[neighbor.vertex] = currentVertex;
                    pq.enqueue(neighbor.vertex, distance);
    
                    await this.sleep(1000);
                    callback(previous, neighbor.vertex);
                }
            }
        }
    
        return previous;
    }
    
    getWeight(start, end) {
        const neighbors = this.#adjacencyList.get(start);
        for (let neighbor of neighbors) {
            if (neighbor.vertex === end) {
                return neighbor.weight;
            }
        }
        return null;
    }    
}
