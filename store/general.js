const defaultState = {
    nodes: {}
};

const getters = {
    getNodes: (state) => state.nodes
};

const mutations = {
    take(state, {
        nodeId
    }) {

        let nodesCopy = {
                ...state.nodes
            },
            myNode = nodesCopy[nodeId];

        // Ensure it exists
        if (myNode) {
            // Loop through all connected nodes and subtract one from each of their values
            let sum = 0;
            for (let connection of myNode.connections) {
                nodesCopy[connection].value--;
                sum++;
            }

            myNode.value += sum;
        }

        // Update state
        state.nodes = nodesCopy;
    },

    give(state, {
        nodeId
    }) {

        let nodesCopy = {
                ...state.nodes
            },
            myNode = nodesCopy[nodeId];

        // Ensure it exists
        if (myNode) {
            // Loop through all connected nodes and subtract one from each of their values
            let difference = 0;
            for (let connection of myNode.connections) {
                nodesCopy[connection].value++;
                difference--;
            }

            myNode.value += difference;
        }

        // Update state
        state.nodes = nodesCopy;
    },

    addNode(state, node) {
        // Create a copy of the nodes
        let nodesCopy = {
            ...state.nodes
        };

        // Add a node
        nodesCopy[node.nodeId] = node;

        // Update state
        state.nodes = nodesCopy;
    }
};

const actions = {
    // Take one from connections
    take: (context, node) => {
        context.commit('take', node);
    },

    // Give one to connections
    give: (context, node) => {
        context.commit('give', node);
    },

    // Add node to store
    addNode: (context, node) => {
        context.commit('addNode', node);
    }
};

export default {
    state: defaultState,
    mutations,
    actions,
    getters
};