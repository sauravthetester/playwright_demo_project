# Practice Form Test Automation Suite

This directory contains comprehensive test automation for the DemoQA Practice Form using Playwright with TypeScript.

## 🏗️ Project Structure

```
playwright_demo_project/
├── pages/
│   ├── FormsPage.ts                    # Forms section navigation
│   └── forms/
│       └── PracticeFormPage.ts         # Complete Practice Form page object
├── tests/
│   └── formsTests/
│       ├── practiceFormTests.spec.ts          # Main form tests with multiple datasets
│       └── practiceFormEdgeCasesTests.spec.ts # Edge case and boundary testing
├── testdata/
│   ├── practiceFormData.json           # Primary test datasets (5 users)
│   └── practiceFormEdgeCases.json      # Edge case datasets (3 scenarios)
└── fixtures/
    └── MyFixtures.ts                   # Updated with Forms page objects
```

## 📋 Test Data Structure

### Primary Test Data (`practiceFormData.json`)
Contains 5 comprehensive user profiles with:
- **user1**: John Doe (Male, Delhi)
- **user2**: Jane Smith (Female, Agra) 
- **user3**: Alex Johnson (Other, Karnal)
- **user4**: Maria Garcia (Female, Jaipur)
- **user5**: David Wilson (Male, Gurgaon)

### Edge Case Test Data (`practiceFormEdgeCases.json`)
Contains 3 boundary test scenarios:
- **edge_case_1**: Minimal data (single characters)
- **long_data_test**: Maximum length fields
- **special_chars**: Names and emails with special characters

## 🎯 Test Coverage

### Form Fields Covered
- ✅ First Name & Last Name
- ✅ Email Address
- ✅ Gender Selection (Radio buttons)
- ✅ Mobile Number (10 digits)
- ✅ Date of Birth (Date picker with year/month/day)
- ✅ Subjects (Autocomplete multi-select)
- ✅ Hobbies (Multiple checkboxes)
- ✅ Current Address (Text area)
- ✅ State & City (Dependent dropdowns)
- ✅ Form Submission & Modal Verification

### Test Types
1. **Smoke Tests** (`@smoke` annotation)
   - Single form submission with core functionality
   - Individual field validation tests

2. **Regression Tests** (`@regression` annotation)
   - Data-driven tests with multiple user profiles
   - Edge case boundary testing
   - Sequential form submission loops

## 🔧 Page Object Model

### FormsPage.ts
- Navigation to Practice Form from Forms section
- Clean separation of concerns

### PracticeFormPage.ts
- Complete form interaction methods
- Comprehensive form filling automation
- Modal verification and data validation
- Type-safe FormData interface

## 🚀 Running Tests

### Run all form tests:
```bash
npx playwright test tests/formsTests/
```

### Run by annotation:
```bash
# Smoke tests only
npx playwright test --grep "@smoke"

# Regression tests only  
npx playwright test --grep "@regression"
```

### Run specific test files:
```bash
# Main form tests
npx playwright test tests/formsTests/practiceFormTests.spec.ts

# Edge case tests
npx playwright test tests/formsTests/practiceFormEdgeCasesTests.spec.ts
```

## 📊 Test Scenarios

### Main Practice Form Tests
1. **Single Practice Form Submission** (Smoke)
2. **Multiple User Form Submissions** (Regression)
   - 5 individual parameterized tests
3. **All Users Form Submission Loop** (Regression)
   - Single test iterating through all datasets
4. **Form Field Validation Tests** (Smoke)
   - Individual field testing and validation

### Edge Cases Tests  
1. **Minimum Data Form Submission** (Smoke)
2. **Maximum Data Form Submission** (Regression)
3. **Special Characters Form Submission** (Regression)
4. **All Edge Cases Sequential Test** (Regression)

## 💡 Key Features

- **Data-Driven Testing**: Multiple JSON datasets for comprehensive coverage
- **Page Object Model**: Clean, maintainable page object architecture
- **Type Safety**: TypeScript interfaces for form data structure
- **Test Annotations**: Proper categorization for smoke vs regression testing
- **Modal Verification**: Complete form submission validation
- **Reusable Components**: Modular page objects and fixtures
- **Error Handling**: Robust element interactions with proper waits

## 🔍 Form Validation

The test suite validates:
- Form field inputs and values
- Radio button selections
- Checkbox selections
- Date picker functionality
- Dropdown selections
- Modal popup content verification
- Data persistence across form submission

This comprehensive test suite provides full coverage of the DemoQA Practice Form functionality with both happy path and edge case scenarios.