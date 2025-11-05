/**
 * TodoList - Main TODO list management
 * WARNING: This file contains 3 intentional bugs for learning purposes!
 */

class TodoList {
    constructor() {
        this.todos = [];
        this.nextId = 1;
    }

    // BUG #1: Filter removes completed tasks instead of filtering them
    getTodos(includeCompleted = true) {
        if (includeCompleted) {
            return this.todos;
        }
        // BUG: Should return completed=false, but returns completed=true
        return this.todos.filter(todo => todo.completed === true);
    }

    addTodo(title, description = '', dueDate = null, priority = 'MEDIUM') {
        const todo = {
            // BUG #6: ID generation can create duplicates
            id: Math.floor(Math.random() * 1000), // Should use this.nextId++
            title,
            description,
            dueDate,
            priority,
            completed: false,
            createdAt: new Date()
        };
        this.todos.push(todo);
        return todo;
    }

    markComplete(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = true;
            return true;
        }
        return false;
    }

    // BUG #5: Deleting during iteration causes skipping
    deleteTodo(id) {
        // BUG: Modifying array while iterating
        for (let i = 0; i < this.todos.length; i++) {
            if (this.todos[i].id === id) {
                this.todos.splice(i, 1);
                // Should break or adjust index
            }
        }
    }

    // BUG #3: Priority sorting is backwards
    sortByPriority() {
        const priorityValues = { 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
        // BUG: Comparison is reversed
        return this.todos.sort((a, b) => 
            priorityValues[b.priority] - priorityValues[a.priority]
        );
    }

    // BUG #7: Counter has off-by-one error
    getStatistics() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        // BUG: Should be total - completed, not total - completed - 1
        const pending = total - completed - 1;
        return { total, completed, pending };
    }
}

module.exports = TodoList;
