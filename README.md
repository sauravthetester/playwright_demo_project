# Playwright Test Automation Framework

This repository contains a comprehensive test automation framework built with Playwright. It demonstrates various testing capabilities, patterns, and best practices for web automation testing.

## 🚀 Features

- Page Object Model (POM) implementation
- Custom fixtures for test setup and teardown
- Parallel test execution support
- Multiple browser configurations
- Advanced locator strategies with fallback mechanisms
- Allure reporting integration
- CI/CD ready configuration

## 🏗️ Project Structure

```
playwright_demo_project/
├── fixtures/
│   └── MyFixtures.ts         # Custom test fixtures
├── pages/
│   ├── elements/             # Page objects for Elements section
│   ├── forms/               # Page objects for Forms section
│   ├── main/               # Core page objects
│   └── utils/              # Utility functions and helpers
├── tests/
│   ├── elementsTests/      # Element interaction tests
│   └── formsTests/        # Form handling tests
├── testdata/              # Test data files
├── playwright.config.ts   # Playwright configuration
└── utils/                # Global utilities
```

## ⚙️ Configuration

### Playwright Config Highlights

- Base URL: https://demoqa.com/
- Parallel execution: Configurable based on CI/non-CI environment
- Retries: 2 retries in CI, 1 in local
- Reporters: Line reporter and Allure integration
- Trace: Retained on failure for debugging
- Multiple projects configuration:
  - element-tests-chrome: Headless mode for element tests
  - forms-tests-chrome: Headed mode for form tests

## 🛠️ Test Architecture

### Page Object Model

The framework implements a robust Page Object Model with:
- Separate page classes for different sections
- Reusable components and utilities
- Type-safe methods and properties

### Custom Fixtures

Custom fixtures provide:
- Automated setup and teardown
- Shared context between tests
- Page object instantiation
- Common utilities

### Advanced Locator Strategies

The framework includes a `LocatorFallback` utility that provides:
- Multiple fallback strategies for element location
- Smart retry mechanisms
- Comprehensive error handling
- Support for various selector types

## 🧪 Test Categories

### Elements Tests
- Button interactions
- Text box operations
- Form validations
- Dynamic element handling

### Forms Tests
- Form submissions
- Input validations
- Dynamic form handling
- Error scenarios

## 📊 Reporting

- Integrated Allure reporting
- Line reporter for CI environments
- Detailed test traces on failure
- Screenshots and videos on failure

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install browsers:
   ```bash
   npx playwright install
   ```

3. Run tests:
   ```bash
   # Run all tests
   npx playwright test

   # Run specific project
   npx playwright test --project=element-tests-chrome

   # Run in headed mode
   npx playwright test --headed
   ```

## 🔄 CI/CD Integration

The framework is configured for CI/CD with:
- Automated retries
- Parallel execution
- Headless mode
- Comprehensive reporting

## 📝 Test Development Guidelines

1. Create page objects for new pages
2. Use the existing fixture pattern
3. Implement proper error handling
4. Follow the naming conventions
5. Add appropriate annotations for Allure reporting

## 🛠️ Utilities

### LocatorFallback
A utility class that provides robust element location strategies:
```typescript
await locator.getLocatorWithFallback([
  () => page.locator('#primary-id'),
  () => page.getByRole('button', { name: 'Submit' }),
  () => page.getByText('Submit')
]);
```

## 📚 Best Practices

1. Use page objects for better maintainability
2. Implement proper waiting strategies
3. Use custom fixtures for common setup
4. Follow the proper naming conventions
5. Add appropriate comments and documentation
6. Use type-safe selectors and methods

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details