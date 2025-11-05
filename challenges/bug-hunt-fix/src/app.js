/**
 * Simple TODO List Application Demo
 * Run with: node src/app.js
 */

const TodoList = require('./TodoList');
const TodoItem = require('./TodoItem');
const { searchTodos, validateTodo } = require('./utils');

console.log('🐛 Bug Hunt & Fix Challenge - TODO List Application\n');
console.log('This app has bugs! Try the features and see what breaks...\n');

const todoList = new TodoList();

// Add some sample todos
console.log('Adding sample tasks...');
todoList.addTodo('Buy groceries', 'Milk, eggs, bread', new Date('2025-11-05T14:00:00'), 'HIGH');
todoList.addTodo('Finish project', 'Complete the bug challenge', new Date('2025-11-04T09:00:00'), 'HIGH');
todoList.addTodo('Call mom', '', null, 'MEDIUM');
todoList.addTodo('Read book', 'Finish chapter 5', null, 'LOW');

console.log('\n--- All Todos ---');
displayTodos(todoList.getTodos());

// Mark one complete
console.log('\n--- Marking "Call mom" as complete ---');
const allTodos = todoList.getTodos();
const callMomTodo = allTodos.find(t => t.title === 'Call mom');
if (callMomTodo) {
    todoList.markComplete(callMomTodo.id);
}

// BUG #1 Test: Try to get only incomplete todos
console.log('\n--- Incomplete Todos (BUG: might show completed ones) ---');
displayTodos(todoList.getTodos(false));

// BUG #3 Test: Sort by priority
console.log('\n--- Sorted by Priority (BUG: order might be wrong) ---');
displayTodos(todoList.sortByPriority());

// BUG #4 Test: Search (case-sensitive bug)
console.log('\n--- Search for "PROJECT" (BUG: might not find "project") ---');
const searchResults = searchTodos(todoList.getTodos(), 'PROJECT');
displayTodos(searchResults);

// BUG #7 Test: Statistics
console.log('\n--- Statistics (BUG: counts might be wrong) ---');
const stats = todoList.getStatistics();
console.log(`Total: ${stats.total}, Completed: ${stats.completed}, Pending: ${stats.pending}`);

// BUG #5 Test: Try to delete multiple items
console.log('\n--- Deleting tasks (BUG: might skip items) ---');
const todosToDelete = todoList.getTodos();
if (todosToDelete.length >= 2) {
    console.log(`Attempting to delete ID ${todosToDelete[0].id} and ${todosToDelete[1].id}`);
    todoList.deleteTodo(todosToDelete[0].id);
    todoList.deleteTodo(todosToDelete[1].id);
}
console.log(`\nRemaining todos: ${todoList.getTodos().length}`);
displayTodos(todoList.getTodos());

// BUG #6 Test: ID duplication
console.log('\n--- Testing ID Generation (BUG: IDs might duplicate) ---');
const newList = new TodoList();
for (let i = 0; i < 10; i++) {
    newList.addTodo(`Task ${i}`);
}
const ids = newList.getTodos().map(t => t.id);
const uniqueIds = new Set(ids);
console.log(`Created 10 tasks. Unique IDs: ${uniqueIds.size}/10`);
if (uniqueIds.size < 10) {
    console.log('⚠️  WARNING: Duplicate IDs detected!');
}

function displayTodos(todos) {
    if (todos.length === 0) {
        console.log('  No todos found');
        return;
    }
    
    todos.forEach(todo => {
        const status = todo.completed ? '✓' : ' ';
        const color = TodoItem.getPriorityColor(todo.priority);
        const dueDate = TodoItem.formatDueDate(todo.dueDate);
        
        console.log(`  [${status}] ${color}${todo.priority}${TodoItem.resetColor()} - ${todo.title}`);
        if (todo.description) {
            console.log(`      ${todo.description}`);
        }
        console.log(`      Due: ${dueDate} | ID: ${todo.id}`);
    });
}

console.log('\n💡 Found any bugs? Use Copilot Chat to help debug!');
console.log('Hint: Try asking "What bugs are in TodoList.js?"\n');
