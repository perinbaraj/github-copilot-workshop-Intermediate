# 🎯 Effective Copilot Prompts for Playwright Testing

This document contains a curated collection of effective GitHub Copilot prompts for generating Playwright E2E tests. Use these as templates and starting points for your test generation.

## 📚 Table of Contents

1. [Page Object Model Generation](#page-object-model-generation)
2. [Test Scenario Creation](#test-scenario-creation)
3. [Selector Strategies](#selector-strategies)
4. [Assertion Patterns](#assertion-patterns)
5. [Accessibility Testing](#accessibility-testing)
6. [Responsive Testing](#responsive-testing)
7. [Error Handling](#error-handling)
8. [Performance Testing](#performance-testing)

## 🏗️ Page Object Model Generation

### Basic Page Object
```
"Create a Playwright Page Object Model for the homepage with methods to access the hero section, featured products, and navigation menu"
```

### Complex Page Object
```
"Generate a Playwright Page Object for a shopping cart page that includes methods to:
- Get all cart items
- Update item quantities
- Remove items from cart
- Calculate total price
- Apply discount codes
- Proceed to checkout"
```

### Form-Based Page Object
```
"Build a Playwright Page Object Model for a checkout form with methods to:
- Fill personal information (name, email, phone)
- Fill shipping address
- Fill payment details
- Submit the form
- Validate error messages"
```

### Base Page Object
```
"Create a base Page Object class for Playwright that includes common methods like:
- Navigation to different pages
- Wait for page load
- Get page title
- Take screenshot
- Check if element is visible"
```

## 🧪 Test Scenario Creation

### User Journey Tests
```
"Generate a Playwright test for the complete e-commerce purchase flow:
1. Browse products
2. Add 2 items to cart
3. Update quantities
4. Apply discount code
5. Proceed to checkout
6. Fill shipping information
7. Complete payment
8. Verify order confirmation"
```

### Authentication Flow
```
"Create Playwright tests for user authentication including:
- Registration with validation
- Login with valid credentials
- Login with invalid credentials
- Logout
- Remember me functionality
- Password reset flow"
```

### Search and Filter
```
"Write Playwright tests for product search and filtering:
- Search by product name
- Filter by category
- Filter by price range
- Sort by price (low to high, high to low)
- Sort by rating
- Verify results are correctly filtered"
```

### Multi-Step Form
```
"Generate tests for a multi-step checkout process with validation at each step:
- Step 1: Shipping information with field validation
- Step 2: Payment details with card validation
- Step 3: Order review
- Step 4: Confirmation
Include back navigation between steps"
```

## 🎯 Selector Strategies

### Data-TestId Selectors
```
"Generate Playwright selectors using data-testid attributes for:
- Navigation menu items
- Product cards
- Form inputs
- Buttons
- Error messages"
```

### Role-Based Selectors
```
"Create Playwright selectors using ARIA roles for accessibility:
- Buttons
- Links
- Headings
- Forms
- Lists
Ensure selectors work with screen readers"
```

### Robust Selector Strategy
```
"Suggest the most robust Playwright selector for a 'Add to Cart' button that:
- Works across different browsers
- Is resistant to UI changes
- Doesn't rely on class names or CSS
- Is accessible and semantic"
```

## ✅ Assertion Patterns

### Comprehensive Assertions
```
"Generate comprehensive Playwright assertions for a product card that verify:
- Product name is visible
- Product image is loaded
- Price is displayed correctly
- Rating stars are shown
- Add to cart button is enabled
- Out of stock badge (if applicable)"
```

### State Assertions
```
"Create Playwright assertions to verify cart state after adding 3 items:
- Cart count badge shows '3'
- Cart total is calculated correctly
- Each item appears in cart
- Quantities are accurate
- Continue shopping button is visible
- Checkout button is enabled"
```

### Error State Assertions
```
"Write Playwright assertions for form validation errors:
- Error messages are displayed
- Fields are highlighted in red
- Error icon is shown
- Form cannot be submitted
- Specific error text matches expected
- Error count is accurate"
```

## ♿ Accessibility Testing

### Axe Integration
```
"Generate a Playwright test that uses axe-core to check accessibility on:
- Homepage
- Product listing page
- Cart page
- Checkout page
Assert no violations of WCAG AA standards"
```

### Keyboard Navigation
```
"Create Playwright tests for keyboard navigation through the checkout flow:
- Tab through all form fields in correct order
- Test Enter key to submit
- Test Escape key to cancel
- Verify focus indicators are visible
- Check that no keyboard traps exist"
```

### Screen Reader Compatibility
```
"Write Playwright tests to verify screen reader compatibility:
- All images have alt text
- Form inputs have associated labels
- Buttons have descriptive text
- ARIA labels are present where needed
- Heading hierarchy is correct"
```

### Focus Management
```
"Generate tests for focus management in a modal dialog:
- Focus moves to modal when opened
- Tab cycles through modal elements only
- Escape key closes modal
- Focus returns to trigger element
- Background content is inert"
```

## 📱 Responsive Testing

### Viewport Testing
```
"Create Playwright tests for responsive design on different viewports:
- Mobile (375px width)
- Tablet (768px width)
- Desktop (1920px width)
Verify layout adapts correctly and content is accessible"
```

### Mobile Navigation
```
"Generate tests for mobile hamburger menu:
- Menu button is visible on mobile
- Menu opens on click
- All navigation items are present
- Menu closes when item is clicked
- Menu closes when clicking outside"
```

### Touch Interactions
```
"Write Playwright tests for touch interactions on mobile:
- Swipe gestures on product carousel
- Pull to refresh
- Long press on product image
- Pinch to zoom
- Touch-friendly button sizes"
```

## ❌ Error Handling

### Form Validation
```
"Generate Playwright tests for checkout form validation covering:
- Empty required fields
- Invalid email format
- Invalid phone number
- Invalid credit card number
- Invalid zip code
- Future expiry date validation"
```

### Network Error Scenarios
```
"Create tests for handling network errors:
- Simulate offline mode
- Test API timeout
- Test failed API requests
- Verify error messages are shown
- Test retry mechanisms
- Verify graceful degradation"
```

### Out of Stock Handling
```
"Write Playwright tests for out-of-stock products:
- Verify 'Out of Stock' badge is displayed
- Add to cart button is disabled
- Product page shows availability status
- Email notification signup is available
- Related in-stock products are suggested"
```

## ⚡ Performance Testing

### Page Load Performance
```
"Generate Playwright tests to measure and assert page load performance:
- Time to first byte < 200ms
- First contentful paint < 1s
- Time to interactive < 3s
- Total page load < 5s
Generate performance reports"
```

### API Response Times
```
"Create tests to monitor API response times:
- Product listing API < 500ms
- Search API < 300ms
- Add to cart API < 200ms
- Checkout API < 1s
Fail test if thresholds exceeded"
```

## 🔄 Advanced Patterns

### Data-Driven Testing
```
"Generate a data-driven Playwright test for login that tests multiple user credentials from a dataset:
- Valid users
- Invalid emails
- Wrong passwords
- Blocked accounts
Use test.describe.parallel for faster execution"
```

### Visual Regression
```
"Create Playwright visual regression tests that:
- Take screenshots of key pages
- Compare with baseline images
- Highlight differences
- Fail on visual changes
- Update baselines when needed"
```

### API Mocking
```
"Write Playwright tests that mock API responses:
- Mock product listing API
- Return test data
- Simulate slow responses
- Simulate error responses
- Verify UI handles mocked data correctly"
```

### Custom Fixtures
```
"Generate a Playwright custom fixture for authenticated user:
- Logs in before each test
- Stores authentication token
- Reuses session across tests
- Cleans up after test suite"
```

## 💡 Tips for Effective Prompting

### Be Specific
❌ "Create a test for login"
✅ "Generate a Playwright test for login that verifies successful login with valid credentials, shows error for invalid password, and redirects to dashboard after successful authentication"

### Provide Context
❌ "Test the cart"
✅ "Write a Playwright test for a shopping cart that starts with 2 items, updates quantity of first item to 3, removes second item, and verifies total price is recalculated correctly"

### Include Edge Cases
❌ "Test form submission"
✅ "Create Playwright tests for checkout form including: successful submission with valid data, validation errors for empty fields, invalid email format, invalid credit card, and verify error messages persist until corrected"

### Request Best Practices
✅ "Generate a Playwright test following best practices: use Page Object Model, independent test data, proper waits instead of timeouts, meaningful assertions, and descriptive test names"

## 🎓 Prompt Patterns

### The Scenario Pattern
```
"Create a test for [specific scenario] that:
- [Step 1]
- [Step 2]
- [Step 3]
And verifies [expected outcomes]"
```

### The Validation Pattern
```
"Write tests to validate [feature] with:
- [Valid case 1]
- [Valid case 2]
- [Invalid case 1]
- [Invalid case 2]
Assert appropriate [messages/states]"
```

### The Journey Pattern
```
"Generate an end-to-end test for [user journey]:
Starting from [initial state]
User performs [actions]
System responds with [reactions]
Final state is [end state]"
```

### The Accessibility Pattern
```
"Create accessibility tests for [component/page] checking:
- Keyboard navigation
- Screen reader compatibility
- ARIA attributes
- Color contrast
- Focus management"
```

## 📖 Usage Examples

### Example 1: Complete Purchase Flow
```typescript
// Prompt used:
// "Generate a comprehensive Playwright test for complete purchase flow from browsing to order confirmation with all assertions"

test('complete purchase journey', async ({ page }) => {
  // Navigate to products
  await page.goto('/products');
  
  // Add first product to cart
  await page.getByTestId('add-to-cart-1').click();
  await expect(page.getByTestId('cart-badge')).toHaveText('1');
  
  // Continue shopping and add another product
  await page.getByTestId('continue-shopping').click();
  await page.getByTestId('add-to-cart-2').click();
  await expect(page.getByTestId('cart-badge')).toHaveText('2');
  
  // Go to cart
  await page.getByTestId('nav-cart').click();
  
  // Verify cart items
  await expect(page.getByTestId('cart-item-1')).toBeVisible();
  await expect(page.getByTestId('cart-item-2')).toBeVisible();
  
  // Proceed to checkout
  await page.getByTestId('proceed-checkout').click();
  
  // Fill checkout form
  // ... more steps
});
```

---

## 🔗 Additional Resources

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [GitHub Copilot Documentation](https://docs.github.com/copilot)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

**Remember**: The quality of your tests depends on the quality of your prompts. Be specific, provide context, and iterate based on the results!
