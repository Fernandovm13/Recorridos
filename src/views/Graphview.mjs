export default class GraphView {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    displayVertex(vertex, type = '') {
        const vertexElement = document.createElement('div');
        vertexElement.className = `vertex ${type}`;
        vertexElement.textContent = vertex;
        this.container.appendChild(vertexElement);
    }

    highlightVertex(vertex, type = '') {
        const vertexElement = this.getVertexElement(vertex);
        if (vertexElement) {
            vertexElement.classList.add('highlight', type);
            setTimeout(() => {
                vertexElement.classList.remove('highlight', type);
            }, 1000); // Duración del highlight (1 segundo)
        }
    }

    getVertexElement(vertex) {
        return Array.from(this.container.getElementsByClassName('vertex')).find(el => el.textContent === vertex);
    }

    clear() {
        this.container.innerHTML = '';
    }

    displayMessage(message, type = 'info') {
        const messageContainer = document.getElementById('messages');
        const messageElement = document.createElement('p');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        messageContainer.innerHTML = ''; // Clear previous messages
        messageContainer.appendChild(messageElement);
    }
}
