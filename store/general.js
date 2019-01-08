const defaultState = {
    nodes: {},
    actionsTaken: 0,
    actionsLeft: 0,
    showLoss: false,
    showWin: false,

    lastAction: null,
    lastActionNode: null,

    level: 'medium',
    numNodes: 6
};

const getters = {
    getNodes: (state) => state.nodes,
    getActionsTaken: (state) => state.actionsTaken,
    getActionsLeft: (state) => state.actionsLeft,
    showLoss: (state) => state.showLoss,
    showWin: (state) => state.showWin,
    lastAction: (state) => state.lastAction,
    lastActionNode: (state) => state.lastActionNode,
    getLevel: (state) => state.level,
    numNodes: (state) => state.numNodes
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
        state.lastAction = 'take';
        state.lastActionNode = nodeId;
        state.actionsLeft--;
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
        state.lastAction = 'give';
        state.lastActionNode = nodeId;
        state.actionsLeft--;
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
    },

    numActionsTaken(state, actions) {
        // Assumption that a random walk would be 10x less efficient than a player, but always give at least 5 moves
        state.actionsTaken = actions;
        state.actionsLeft = Math.floor(actions / 10) + 5;
    },

    showLoss(state) {
        state.showLoss = true;
    },

    showWin(state) {
        state.showWin = true;
    },

    nukeNodes(state) {
        state = defaultState;
    },

    changeLevel(state, {level, numNodes}) {
        if(['easy', 'medium', 'hard'].includes(level)) {
            state.numNodes = numNodes;
            state.level = level;
        }
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
    },

    numActionsTaken: (context, actions) => {
        context.commit('numActionsTaken', actions);
    },

    showLoss: (context) => {
        context.commit('showLoss');
    },

    showWin: (context) => {
        context.commit('showWin');
    },

    nukeNodes: (context) => {
        context.commit('nukeNodes');
    },

    changeLevel: (context, obj) => {
        context.commit('changeLevel', obj);
    }
};

export default {
    state: defaultState,
    mutations,
    actions,
    getters
};