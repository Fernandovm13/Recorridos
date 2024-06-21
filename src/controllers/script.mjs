import Graph from "../models/Graph.mjs";
import GraphView from "../views/Graphview.mjs";

let g = new Graph();
g.addVertices("A", "B", "C", "D", "E", "F", "G");
g.addV("H");
g.addV("I");

g.addConexion("A", "B");
g.addConexion("A", "C");
g.addConexion("A", "D", 8);
g.addConexion("B", "E", 9);
g.addConexion("B", "F", 10);
g.addConexion("D", "F", 11);
g.addConexion("E", "G", 12);
g.addConexion("G", "H");
g.addConexion("G", "I");

const view = new GraphView('graph-container');

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
    if (start && end) {
        const success = g.addConexion(start, end);
        if (success) {
            view.displayMessage(`Arista de ${start} a ${end} agregada.`, 'success');
            document.getElementById('edge-start-input').value = '';
            document.getElementById('edge-end-input').value = '';
        } else {
            view.displayMessage('Arista no válida. Verifique los vértices.', 'error');
        }
    } else {
        view.displayMessage('Por favor, ingrese vértices válidos.', 'error');
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

function updateGraphView() {
    view.clear();
    const vertices = g.getVertices();
    for (let vertex of vertices) {
        view.displayVertex(vertex);
    }
}

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

        view.displayMessage(`Ruta más corta desde ${startVertex} hasta ${endVertex}: ${getShortestPath(previous, endVertex)}`, 'info');
    } else {
        view.displayMessage('Por favor, ingrese vértices de inicio y fin válidos.', 'error');
    }
});

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

updateGraphView();
