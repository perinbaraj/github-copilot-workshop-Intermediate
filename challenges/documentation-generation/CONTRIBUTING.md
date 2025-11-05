# Contributing to Inventory Management API

Thank you for your interest in contributing to this project! This guide will help you get started with the development process and documentation requirements.

## 🚀 Getting Started

### Prerequisites
- Node.js 16 or higher
- npm 8 or higher  
- Git
- Code editor with TypeScript support (VS Code recommended)
- GitHub Copilot (for documentation generation practice)

### Setup Development Environment
1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/inventory-management-api.git
   cd inventory-management-api
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your local settings
   ```

4. **Verify Setup**
   ```bash
   npm run build
   npm test
   ```

## 📋 Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes
- Write code following project conventions
- Add comprehensive JSDoc documentation
- Include unit tests
- Update relevant documentation

### 3. Documentation Requirements
All code contributions MUST include:

#### JSDoc Comments
Every exported function, class, and method requires JSDoc:
```typescript
/**
 * Creates a new product in the inventory system
 * @param productData - The product information to create
 * @returns Promise that resolves to the created product
 * @throws {ValidationError} When product data is invalid
 * @throws {ConflictError} When product SKU already exists
 * @example
 * ```typescript
 * const product = await createProduct({
 *   name: "Laptop Computer",
 *   sku: "LAPTOP-001", 
 *   price: 999.99,
 *   category: "Electronics"
 * });
 * ```
 */
async function createProduct(productData: ProductCreateRequest): Promise<Product> {
  // Implementation
}
```

#### Required JSDoc Tags
- `@description` - Clear description of purpose
- `@param` - All parameters with types and descriptions  
- `@returns` - Return value description
- `@throws` - Possible exceptions
- `@example` - Usage example
- `@since` - Version when added (for new features)
- `@deprecated` - If marking as deprecated

### 4. API Documentation
For new endpoints, create/update:
- `docs/api/controllerName.md` - Detailed endpoint documentation
- Include request/response examples
- Document all status codes
- Add authentication requirements

### 5. Testing Requirements
- Unit tests for all new functions
- Integration tests for new endpoints  
- Minimum 80% code coverage
- Tests must pass in CI

### 6. Commit and Push
```bash
git add .
git commit -m "feat: add new feature with documentation"
git push origin feature/your-feature-name
```

### 7. Create Pull Request
- Use descriptive title and description
- Link to any related issues
- Ensure all CI checks pass
- Request review from maintainers

## 🎯 Documentation Standards

### Code Documentation
- **Functions**: Document purpose, parameters, return values, exceptions
- **Classes**: Document purpose, usage patterns, key methods
- **Interfaces**: Document all properties and their purposes
- **Constants**: Document purpose and valid values

### README Documentation  
Update README.md when adding:
- New features or endpoints
- Configuration options
- Setup requirements
- Usage examples

### API Documentation
Structure for endpoint documentation:
```markdown
## POST /api/products

Creates a new product in the inventory system.

### Authentication
Requires: `Bearer token` with `admin` role

### Request Body
```json
{
  "name": "Product Name",
  "sku": "PROD-001", 
  "price": 99.99,
  "category": "Electronics",
  "description": "Optional description"
}
```

### Responses
- `201` - Product created successfully
- `400` - Invalid request data
- `401` - Authentication required
- `409` - SKU already exists

### Example Response
```json
{
  "success": true,
  "data": {
    "id": "prod_123",
    "name": "Product Name",
    "sku": "PROD-001",
    "price": 99.99,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

## 🔧 Development Tools

### GitHub Copilot Usage
This project is designed for practicing GitHub Copilot documentation generation:

1. **JSDoc Generation**: Use Copilot to generate comprehensive JSDoc comments
2. **README Updates**: Get help writing clear README sections
3. **API Documentation**: Generate endpoint documentation from code
4. **Developer Guides**: Create setup and architecture documentation

### Helpful Commands
```bash
# Generate documentation
npm run docs:generate

# Check documentation coverage  
npm run validate:docs

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests with coverage
npm run test:coverage
```

### Code Quality Checks
Before submitting PR, ensure:
- [ ] All tests pass
- [ ] Code coverage ≥ 80%
- [ ] No linting errors
- [ ] Documentation coverage ≥ 80%
- [ ] All functions have JSDoc
- [ ] README is updated
- [ ] API docs are current

## 🐛 Reporting Issues

When reporting bugs or requesting features:
1. Check existing issues first
2. Use issue templates
3. Provide clear reproduction steps
4. Include environment details
5. Add relevant labels

## 📖 Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [JSDoc Documentation](https://jsdoc.app/)
- [GitHub Copilot Documentation](https://docs.github.com/copilot)
- [Express.js Documentation](https://expressjs.com/)

## 🏆 Recognition

Contributors who consistently provide high-quality documentation will be recognized in:
- Project README
- Release notes  
- Contributor hall of fame

Thank you for helping make this project well-documented and maintainable!