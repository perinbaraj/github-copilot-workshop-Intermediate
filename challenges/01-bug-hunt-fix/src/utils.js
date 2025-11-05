/**
 * Utility functions
 * WARNING: Contains 1-2 bugs!
 */

// BUG #4: Search is case-sensitive
function searchTodos(todos, query) {
    if (!query) return todos;
    
    // BUG: Should be case-insensitive
    return todos.filter(todo => 
        todo.title.includes(query) || 
        todo.description.includes(query)
    );
}

function validateTodo(title, priority) {
    if (!title || title.trim().length === 0) {
        throw new Error('Title is required');
    }
    
    const validPriorities = ['HIGH', 'MEDIUM', 'LOW'];
    if (!validPriorities.includes(priority)) {
        throw new Error('Invalid priority. Use HIGH, MEDIUM, or LOW');
    }
    
    return true;
}

module.exports = {
    searchTodos,
    validateTodo
};
