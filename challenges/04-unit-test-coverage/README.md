# 🧪 Unit Test Coverage Challenge with GitHub Copilot

**Objective**: Use GitHub Copilot to increase test coverage from 30% to 80%+ while learning effective AI-assisted test generation techniques.

**Difficulty**: 🟢 Beginner  
**Estimated Time**: 30-45 minutes  
**Skills**: AI-Assisted Testing, Copilot Prompting, Test Generation  
**Copilot Features**: Code completion, Chat assistance, Test generation

## 📋 Challenge Overview

You've inherited a shopping cart module that has basic functionality but poor test coverage. Your task is to use GitHub Copilot to generate comprehensive unit tests and achieve at least 80% code coverage while learning effective AI-assisted testing techniques.

### Current State
- ✅ Basic shopping cart functionality works
- ❌ Only 30% test coverage
- ❌ Missing edge case testing
- ❌ No error condition testing

### Success Criteria
- [ ] Achieve 80%+ test coverage using Copilot assistance
- [ ] All existing tests continue to pass
- [ ] New tests cover edge cases and error conditions
- [ ] Demonstrate effective Copilot prompting for test generation
- [ ] Document your Copilot learning experience

## 🚀 Getting Started

### 1. Prerequisites Check
- [ ] GitHub Copilot is enabled in your VS Code
- [ ] Copilot extension is installed and active
- [ ] You're signed in to GitHub in VS Code

### 2. Fork & Clone
```bash
# Fork this repository, then clone your fork
git clone https://github.com/YOUR_USERNAME/challenge-unit-test-coverage
cd challenge-unit-test-coverage

# Install dependencies
npm install

# Open in VS Code to activate Copilot
code .
```

### 3. Explore Current State
```bash
# Run existing tests to see current coverage
npm test

# Generate detailed coverage report
npm run test:coverage

# View coverage report in browser
open coverage/lcov-report/index.html
```

### 3. Study the Code
Review the files in `src/` to understand:
- `ShoppingCart.js` - Main cart functionality
- `CartItem.js` - Individual cart item handling
- `PriceCalculator.js` - Price calculation logic
- `DiscountEngine.js` - Discount application logic

### 4. Use Copilot to Generate Tests
Use these Copilot techniques to add comprehensive tests:

## 📁 Project Structure

```
challenge-unit-test-coverage/
├── src/
│   ├── ShoppingCart.js      # Main cart class (60% covered)
│   ├── CartItem.js          # Cart item model (40% covered)
│   ├── PriceCalculator.js   # Price logic (20% covered)
│   └── DiscountEngine.js    # Discount logic (10% covered)
├── tests/
│   ├── ShoppingCart.test.js # Existing basic tests
│   ├── CartItem.test.js     # Minimal existing tests
│   └── __mocks__/           # Mock files for testing
├── package.json             # Dependencies and scripts
├── jest.config.js           # Jest configuration
└── .github/
    └── workflows/
        └── test-coverage.yml # Automated validation
```

## ✅ Validation & Learning Assessment

Your solution will be evaluated on both technical success and Copilot usage:

1. **Coverage Achievement** - Must achieve 80%+ coverage
2. **Test Quality** - Tests must be meaningful and well-structured
3. **Copilot Techniques** - Document which prompting strategies you used
4. **Learning Reflection** - Share what you learned about AI-assisted testing






