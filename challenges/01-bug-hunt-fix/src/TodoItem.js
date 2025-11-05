/**
 * TodoItem - Individual TODO item utilities
 * WARNING: Contains 2 bugs!
 */

class TodoItem {
    // BUG #2: Date parsing doesn't handle timezones correctly
    static formatDueDate(dueDate) {
        if (!dueDate) return 'No due date';
        
        const date = new Date(dueDate);
        // BUG: toLocaleDateString doesn't include time, but we show hours wrong
        const hours = date.getHours(); // Should use getUTCHours() or handle timezone
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const dateStr = date.toLocaleDateString();
        
        return `${dateStr} ${hours}:${minutes}`;
    }

    static getPriorityColor(priority) {
        const colors = {
            'HIGH': '\x1b[31m',     // Red
            'MEDIUM': '\x1b[33m',   // Yellow
            'LOW': '\x1b[32m'       // Green
        };
        return colors[priority] || '\x1b[0m';
    }

    static resetColor() {
        return '\x1b[0m';
    }
}

module.exports = TodoItem;
