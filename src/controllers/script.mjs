import Graph from "../models/Graph.mjs";
import GraphView from "../views/Graphview.mjs";

let g = new Graph();
g.addVertices("A", "B", "C", "D", "E", "F", "G");
g.addV("H");
g.addV("I");

g.addConexion("A", "B", 6);
g.addConexion("A", "C", 7);
g.addConexion("A", "D", 8);
g.addConexion("B", "E", 9);
g.addConexion("B", "F", 10);
g.addConexion("D", "F", 11);
g.addConexion("E", "G", 12);
g.addConexion("G", "H", 13);
g.addConexion("G", "I", 14);

// Crear instancia de la vista del grafo
const view = new GraphView('graph-container');

// Definir los callbacks para BFS y DFS
const bfsCallback = (val) => {
    view.displayVertex(val, 'bfs');
};

const dfsCallback = (val) => {
    view.displayVertex(val, 'dfs');
};

// Agregar vértice
document.getElementById('add-vertex-button').addEventListener('click', () => {
    const vertex = document.getElementById('vertex-input').value.trim();
    if (vertex) {
        g.addV(vertex);
        view.displayMessage(`Vértice ${vertex} agregado.`, 'success');
        document.getElementById('vertex-input').value = '';
    } else {
        view.displayMessage('Por favor, ingrese un vértice válido.', 'error');
    }
    updateGraphView();
});

// Agregar arista
document.getElementById('add-edge-button').addEventListener('click', () => {
    const start = document.getElementById('edge-start-input').value.trim();
    const end = document.getElementById('edge-end-input').value.trim();
    const weight = parseInt(document.getElementById('edge-weight-input').value.trim(), 10) || 1;
    if (start && end) {
        const success = g.addConexion(start, end, weight);
        if (success) {
            view.displayMessage(`Arista de ${start} a ${end} con peso ${weight} agregada.`, 'success');
            document.getElementById('edge-start-input').value = '';
            document.getElementById('edge-end-input').value = '';
            document.getElementById('edge-weight-input').value = '';
        } else {
            view.displayMessage('Vértice no válido. Verifique los vértices.', 'error');
        }
    } else {
        view.displayMessage('Por favor, ingrese vértices y peso válidos.', 'error');
    }
    updateGraphView();
});

// Realizar recorrido BFS
document.getElementById('bfs-button').addEventListener('click', () => {
    view.clear();
    g.bfs(bfsCallback);
    view.displayMessage('Recorrido BFS completado.', 'info');
});

// Realizar recorrido DFS
document.getElementById('dfs-button').addEventListener('click', () => {
    view.clear();
    const vertices = g.getVertices();
    if (vertices.length > 0) {
        g.dfs(vertices[0], dfsCallback);
        view.displayMessage('Recorrido DFS completado.', 'info');
    } else {
        view.displayMessage('No hay vértices en el grafo.', 'error');
    }
});

// Agregar evento para ejecutar Dijkstra
document.getElementById('dijkstra-button').addEventListener('click', async () => {
    const startVertex = document.getElementById('dijkstra-start-input').value.trim();
    const endVertex = document.getElementById('dijkstra-end-input').value.trim();
    
    if (startVertex && endVertex) {
        view.clear();
        const previous = await g.dijkstra(startVertex, (previous, currentVertex) => {
            view.highlightVertex(currentVertex, 'dijkstra');
            updateSteps(previous, endVertex);
        });

        view.displayMessage(`Ruta más corta desde el vértice ${startVertex} hasta el vértice ${endVertex}: ${getShortestPath(previous, endVertex)}`, 'info');
    } else {
        view.displayMessage('Por favor, ingrese vértices de inicio y fin válidos.', 'error');
    }
});

// Mostrar distancias desde un vértice dado
document.getElementById('distances-button').addEventListener('click', async () => {
    const startVertex = document.getElementById('distances-start-input').value.trim();
    if (startVertex) {
        view.clear();
        const distances = await g.dijkstra(startVertex, (previous, currentVertex) => {
            view.highlightVertex(currentVertex, 'dijkstra');
        });

        displayDistances(distances, startVertex);
        view.displayMessage(`Distancias desde el vértice ${startVertex} a todos los demás vértices calculadas.`, 'info');
    } else {
        view.displayMessage('Por favor, ingrese un vértice de inicio válido.', 'error');
    }
});

function updateGraphView() {
    view.clear();
    const vertices = g.getVertices();
    for (let vertex of vertices) {
        view.displayVertex(vertex);
    }
    const edges = g.getEdges();
    for (let [start, end, weight] of edges) {
        view.displayEdge(start, end, weight);
    }
}

function updateSteps(previous, endVertex) {
    const stepsContainer = document.getElementById('steps');
    stepsContainer.innerHTML = '';

    let currentVertex = endVertex;
    while (previous[currentVertex] !== null) {
        const stepElement = document.createElement('p');
        stepElement.textContent = `Pasar de ${previous[currentVertex]} a ${currentVertex} con peso ${g.getWeight(previous[currentVertex], currentVertex)}`;
        stepsContainer.appendChild(stepElement);
        currentVertex = previous[currentVertex];
    }
}

function getShortestPath(previous, endVertex) {
    let path = [];
    let currentVertex = endVertex;
    while (previous[currentVertex] !== null) {
        path.unshift(currentVertex);
        currentVertex = previous[currentVertex];
    }
    path.unshift(currentVertex);
    return path.join(' -> ');
}

function displayDistances(distances, startVertex) {
    const stepsContainer = document.getElementById('steps');
    stepsContainer.innerHTML = '';

    for (const vertex in distances) {
        const distanceElement = document.createElement('p');
        const distance = distances[vertex] === Infinity ? '∞' : distances[vertex];
        distanceElement.textContent = `Distancia desde ${startVertex} a ${vertex}: ${distance}`;
        stepsContainer.appendChild(distanceElement);
    }
}

updateGraphView();
