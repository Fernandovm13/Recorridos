export default class GraphView {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    clear() {
        this.container.innerHTML = '';
    }

    displayVertex(vertex, type = '') {
        const vertexElement = document.createElement('div');
        vertexElement.className = `vertex ${type}`;
        vertexElement.textContent = vertex;
        this.container.appendChild(vertexElement);
    }

    displayEdge(start, end, weight) {
        const edgeElement = document.createElement('div');
        edgeElement.className = 'edge';
        this.container.appendChild(edgeElement);
    }

    displayMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        this.container.appendChild(messageElement);
    }

    highlightVertex(vertex, type) {
        const vertexElement = document.createElement('div');
        vertexElement.className = `highlight-vertex ${type}`;
        vertexElement.textContent = vertex;
        this.container.appendChild(vertexElement);
    }
}
