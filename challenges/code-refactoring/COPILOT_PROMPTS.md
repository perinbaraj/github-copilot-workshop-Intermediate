# My Copilot Refactoring Prompts Library

A collection of effective prompts discovered during the code refactoring challenge.

## Function Decomposition Prompts

### Breaking Down Large Functions
```
"Analyze this function and suggest how to break it into smaller, focused functions with single responsibilities"

"Extract the [specific functionality] logic into a separate function"

"Break this monolithic function into multiple functions, each handling one aspect of the business logic"
```

### Responsibility Separation
```
"Separate the validation logic from the business logic in this function"

"Extract all the calculation logic into dedicated utility functions"

"Move the data persistence operations to a separate module"
```

## Error Handling Prompts

### Creating Robust Error Handling
```
"Add comprehensive error handling to this function with specific error types for different failure scenarios"

"Create custom error classes for validation errors, business logic errors, and system errors"

"Implement error handling that provides meaningful messages and doesn't crash the application"
```

### Error Recovery
```
"Add error recovery mechanisms that allow the system to gracefully handle failures"

"Implement retry logic for operations that might fail temporarily"

"Create fallback strategies for when primary operations fail"
```

## Design Pattern Implementation

### Strategy Pattern
```
"Refactor this code to use the Strategy pattern for handling different payment methods"

"Implement the Strategy pattern to handle different shipping calculation methods"

"Use the Strategy pattern to support multiple discount calculation approaches"
```

### Builder Pattern
```
"Refactor this object creation to use the Builder pattern for complex order construction"

"Implement a Builder pattern to create orders with optional fields and validation"
```

### Observer Pattern
```
"Implement the Observer pattern for order status updates and notifications"

"Use the Observer pattern to handle events when order state changes"
```

### Factory Pattern
```
"Create a Factory pattern for instantiating different types of processors based on configuration"

"Implement a Factory to create payment processors based on payment method"
```

## Code Quality Improvement Prompts

### Naming and Documentation
```
"Improve the variable and function naming in this code to be more descriptive and consistent"

"Add comprehensive JSDoc comments to document this module's public interface"

"Refactor this code to use consistent naming conventions throughout"
```

### SOLID Principles
```
"Refactor this code to follow the Single Responsibility Principle"

"Apply the Open/Closed Principle to make this code extensible without modification"

"Implement dependency injection to follow the Dependency Inversion Principle"
```

### Code Duplication Elimination
```
"Identify and eliminate code duplication in this module by creating reusable utility functions"

"Extract common functionality into shared utilities to reduce code duplication"

"Refactor this code to eliminate repeated patterns and create reusable components"
```

## Performance Optimization Prompts

### Efficiency Improvements
```
"Optimize this code for better performance while maintaining readability"

"Identify performance bottlenecks in this code and suggest improvements"

"Refactor this code to reduce memory usage and improve execution speed"
```

### Caching and Optimization
```
"Add caching mechanisms to improve the performance of frequently accessed data"

"Optimize database queries and file operations in this code"
```

## Testing and Testability Prompts

### Making Code Testable
```
"Refactor this code to make it more testable by reducing dependencies and improving modularity"

"Implement dependency injection to make this code easier to unit test"

"Break down this function so that each part can be tested independently"
```

### Test Generation
```
"Generate comprehensive unit tests for this refactored code"

"Create test cases that cover all edge cases and error scenarios"

"Write integration tests that verify the refactored components work together correctly"
```

## Architectural Improvement Prompts

### Separation of Concerns
```
"Separate the business logic from the data access layer in this code"

"Refactor this code to separate concerns and improve maintainability"

"Create clear boundaries between different layers of the application"
```

### Modularity
```
"Break this large module into smaller, focused modules with clear interfaces"

"Create a modular architecture that supports easy extension and modification"
```

## Advanced Refactoring Prompts

### Legacy Code Modernization
```
"Modernize this legacy code while preserving its existing functionality"

"Refactor this code to use modern JavaScript/Node.js patterns and best practices"

"Update this code to use async/await instead of callbacks"
```

### Configuration and Flexibility
```
"Make this code more configurable by extracting hardcoded values into configuration"

"Add configuration options to make this code more flexible and reusable"
```

## Interactive Prompting Strategies

### Iterative Improvement
```
"Review this refactored code and suggest further improvements"

"What potential issues do you see in this refactored implementation?"

"How can we make this code even more maintainable and robust?"
```

### Code Review Style
```
"Review this refactored code as if you were conducting a code review - identify any issues or improvements"

"Compare the original and refactored versions - what are the key improvements and any potential concerns?"
```

## Domain-Specific Prompts

### E-commerce Specific
```
"Refactor this order processing code to handle different product types and pricing models"

"Implement proper inventory management patterns for e-commerce operations"

"Add support for complex discount rules and promotional pricing"
```

### Security Focused
```
"Review this payment processing code for security vulnerabilities and suggest improvements"

"Implement secure handling of sensitive customer data in this refactored code"
```

## Tips for Effective Prompting

1. **Be Specific**: Instead of "improve this code", specify what aspect to improve
2. **Provide Context**: Explain the business requirements and constraints
3. **Iterate**: Start with basic refactoring, then ask for specific improvements
4. **Ask for Explanations**: Request explanations of why certain patterns are recommended
5. **Request Alternatives**: Ask for multiple approaches to compare options

## Prompt Patterns That Work Well

### The Analysis Pattern
```
"Analyze this code and identify [specific issues]. Then suggest how to refactor it to address these issues."
```

### The Step-by-Step Pattern
```
"Help me refactor this code step by step:
1. First, extract the validation logic
2. Then, separate the calculation functions
3. Finally, implement proper error handling"
```

### The Comparison Pattern
```
"Show me how to refactor this code using [Pattern A] vs [Pattern B]. What are the pros and cons of each approach?"
```

### The Teaching Pattern
```
"Explain why this refactoring is better than the original code and what principles it follows"
```