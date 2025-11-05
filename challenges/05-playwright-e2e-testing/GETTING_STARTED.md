# 🎭 Playwright E2E Testing Challenge

Welcome to the Playwright E2E Testing Challenge! This directory contains everything you need to master end-to-end testing with GitHub Copilot.

## 📁 Directory Structure

```
playwright-e2e-testing/
├── README.md                 # Main challenge instructions
├── SOLUTION_GUIDE.md         # Detailed solutions and best practices
├── COPILOT_PROMPTS.md        # Curated Copilot prompts library
├── package.json              # Dependencies and scripts
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json            # TypeScript configuration
├── src/                      # E-commerce application
│   ├── app/                  # Next.js pages
│   │   ├── layout.tsx
│   │   ├── page.tsx         # Homepage
│   │   └── globals.css
│   └── lib/                  # Utilities
│       ├── products.ts       # Product data
│       ├── cart.ts          # Cart logic
│       └── validation.ts    # Form validation
└── tests/                    # Test files
    ├── smoke/               # Basic smoke tests (COMPLETED)
    │   ├── homepage.spec.ts
    │   ├── navigation.spec.ts
    │   └── search.spec.ts
    ├── user-journeys/       # TODO: Complete user flows
    ├── edge-cases/          # TODO: Error scenarios
    ├── accessibility/       # TODO: A11y tests
    ├── responsive/          # TODO: Responsive tests
    ├── pages/               # Page Object Models
    │   └── BasePage.ts      # Example base page
    └── helpers/
        └── test-utils.ts    # Test utilities
```

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

3. **Start the application:**
   ```bash
   npm run dev
   ```

4. **Run existing tests (in another terminal):**
   ```bash
   npm test
   ```

5. **Open test UI (recommended):**
   ```bash
   npm run test:ui
   ```

## 📚 Documentation

- **[README.md](./README.md)** - Complete challenge instructions with tasks and objectives
- **[SOLUTION_GUIDE.md](./SOLUTION_GUIDE.md)** - Detailed solutions, code examples, and best practices
- **[COPILOT_PROMPTS.md](./COPILOT_PROMPTS.md)** - Library of effective Copilot prompts for test generation

## 🎯 Challenge Tasks

### ✅ Completed
- Basic application setup
- 3 smoke tests (homepage, navigation, search)
- Base page object example
- Test utilities

### 📝 Your Tasks
1. **Page Object Models** - Create comprehensive POMs for all pages
2. **User Journey Tests** - Test complete user workflows
3. **Error Handling** - Test validation and edge cases
4. **Accessibility** - Ensure WCAG compliance
5. **Responsive** - Test across different viewports

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm test             # Run all tests
npm run test:ui      # Open Playwright UI
npm run test:headed  # Run tests in headed mode
npm run test:debug   # Debug tests
npm run test:report  # Show test report
```

## 💡 Tips for Success

1. **Start with COPILOT_PROMPTS.md** - Review effective prompting strategies
2. **Use the examples** - Study BasePage.ts and existing smoke tests
3. **Run tests frequently** - Use `npm run test:ui` for interactive development
4. **Follow POM pattern** - Keep tests maintainable
5. **Be specific with Copilot** - Provide context and details in your prompts

## 🎓 Learning Objectives

By completing this challenge, you'll learn to:
- Generate comprehensive E2E tests using GitHub Copilot
- Implement and maintain Page Object Model pattern
- Test complete user journeys and edge cases
- Ensure accessibility compliance
- Write maintainable and reliable tests
- Effectively prompt AI assistants for test generation

## 📊 Success Criteria

Your solution should include:
- [ ] 25+ meaningful test scenarios
- [ ] Complete Page Object Models
- [ ] All user journeys covered
- [ ] Error and edge case testing
- [ ] Accessibility tests
- [ ] Responsive design tests
- [ ] Clean, maintainable code
- [ ] Documentation of learning process

## 🔗 Resources

- [Playwright Documentation](https://playwright.dev)
- [Page Object Model Guide](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Accessibility Testing](https://playwright.dev/docs/accessibility-testing)

## 🆘 Need Help?

1. Check [SOLUTION_GUIDE.md](./SOLUTION_GUIDE.md) for detailed examples
2. Review [COPILOT_PROMPTS.md](./COPILOT_PROMPTS.md) for prompting tips
3. Run tests in UI mode to debug: `npm run test:ui`
4. Check Playwright documentation

---

**Ready to master E2E testing with AI assistance? Start with the [README.md](./README.md)!** 🎭✨

**Note:** This challenge is part of the GitHub Copilot Workshop - Intermediate Level.
