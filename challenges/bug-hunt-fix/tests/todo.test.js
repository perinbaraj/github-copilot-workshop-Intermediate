const TodoList = require('../src/TodoList');
const { searchTodos, validateTodo } = require('../src/utils');

describe('TodoList', () => {
    let todoList;

    beforeEach(() => {
        todoList = new TodoList();
    });

    test('should add a todo', () => {
        const todo = todoList.addTodo('Test task', 'Description', null, 'HIGH');
        expect(todo.title).toBe('Test task');
        expect(todoList.getTodos().length).toBe(1);
    });

    test('should mark todo as complete', () => {
        const todo = todoList.addTodo('Test task');
        todoList.markComplete(todo.id);
        expect(todoList.getTodos()[0].completed).toBe(true);
    });

    // This test will FAIL due to Bug #1
    test('should filter incomplete todos correctly', () => {
        todoList.addTodo('Task 1');
        const todo2 = todoList.addTodo('Task 2');
        todoList.markComplete(todo2.id);
        
        const incomplete = todoList.getTodos(false);
        expect(incomplete.length).toBe(1);
        expect(incomplete[0].title).toBe('Task 1');
        expect(incomplete[0].completed).toBe(false);
    });

    // This test will FAIL due to Bug #7
    test('should calculate statistics correctly', () => {
        todoList.addTodo('Task 1');
        todoList.addTodo('Task 2');
        todoList.addTodo('Task 3');
        const firstTodo = todoList.getTodos()[0];
        todoList.markComplete(firstTodo.id);
        
        const stats = todoList.getStatistics();
        expect(stats.total).toBe(3);
        expect(stats.completed).toBe(1);
        expect(stats.pending).toBe(2); // Will fail: shows 1 due to bug
    });

    // This test will FAIL due to Bug #3
    test('should sort by priority correctly', () => {
        todoList.addTodo('Low task', '', null, 'LOW');
        todoList.addTodo('High task', '', null, 'HIGH');
        todoList.addTodo('Medium task', '', null, 'MEDIUM');
        
        const sorted = todoList.sortByPriority();
        expect(sorted[0].priority).toBe('HIGH');
        expect(sorted[1].priority).toBe('MEDIUM');
        expect(sorted[2].priority).toBe('LOW');
    });

    // This test will FAIL due to Bug #6
    test('should generate unique IDs for todos', () => {
        const ids = new Set();
        for (let i = 0; i < 20; i++) {
            const todo = todoList.addTodo(`Task ${i}`);
            ids.add(todo.id);
        }
        // All IDs should be unique
        expect(ids.size).toBe(20);
    });

    // This test will FAIL due to Bug #5
    test('should delete todos correctly', () => {
        const todo1 = todoList.addTodo('Task 1');
        const todo2 = todoList.addTodo('Task 2');
        const todo3 = todoList.addTodo('Task 3');
        
        todoList.deleteTodo(todo1.id);
        expect(todoList.getTodos().length).toBe(2);
        
        todoList.deleteTodo(todo2.id);
        expect(todoList.getTodos().length).toBe(1);
        expect(todoList.getTodos()[0].id).toBe(todo3.id);
    });
});

describe('Search', () => {
    // This test will FAIL due to Bug #4
    test('should search case-insensitively', () => {
        const todos = [
            { title: 'Buy Groceries', description: 'milk and eggs' },
            { title: 'finish project', description: 'Complete coding' }
        ];
        
        const results = searchTodos(todos, 'PROJECT');
        expect(results.length).toBe(1); // Will fail: returns 0 due to case sensitivity
        expect(results[0].title).toBe('finish project');
    });

    test('should search in title and description', () => {
        const todos = [
            { title: 'Buy Groceries', description: 'milk and eggs' },
            { title: 'Finish project', description: 'Complete coding' },
            { title: 'Call mom', description: 'eggs recipe' }
        ];
        
        const results = searchTodos(todos, 'eggs');
        expect(results.length).toBe(2);
    });

    test('should return all todos when query is empty', () => {
        const todos = [
            { title: 'Task 1', description: '' },
            { title: 'Task 2', description: '' }
        ];
        
        const results = searchTodos(todos, '');
        expect(results.length).toBe(2);
    });
});

describe('Validation', () => {
    test('should validate todo with valid data', () => {
        expect(() => validateTodo('Test task', 'HIGH')).not.toThrow();
    });

    test('should throw error for empty title', () => {
        expect(() => validateTodo('', 'HIGH')).toThrow('Title is required');
    });

    test('should throw error for invalid priority', () => {
        expect(() => validateTodo('Test task', 'URGENT')).toThrow('Invalid priority');
    });
});
