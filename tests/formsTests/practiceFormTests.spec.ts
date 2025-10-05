import { expect } from '@playwright/test';
import { test } from '../../fixtures/MyFixtures';
import { FormData } from '../../pages/forms/PracticeFormPage';
import { promises as fs } from 'fs';

let practiceFormTestData: FormData[];

test.describe('Practice Form Tests', () => {

  test.beforeAll(async () => {
    // Load test data from JSON file
    const testDataJson = await fs.readFile('testdata/practiceFormData.json', 'utf-8');
    practiceFormTestData = JSON.parse(testDataJson);
  });

  // Smoke test for basic form functionality
  test.only('Single Practice Form Submission', {
    annotation: {
      type: 'smoke',
      description: 'Core functionality test for practice form submission with single dataset'
    }
  }, async ({ homePage, formsPage, practiceFormPage }) => {
    
    await test.step('Navigate to Forms page', async () => {
      await homePage.clickFormsCard();
    });

    await test.step('Navigate to Practice Form', async () => {
      await formsPage.clickPracticeFormMenuItem();
    });

    await test.step('Fill and submit the practice form', async () => {
      const testUser = practiceFormTestData[0]; // Use first test user
      await practiceFormPage.fillCompleteForm(testUser);
      await practiceFormPage.submitForm();
    });

    await test.step('Verify form submission', async () => {
      const testUser = practiceFormTestData[0];
      await practiceFormPage.verifyFormSubmission(testUser);
    });

    await test.step('Close modal', async () => {
      await practiceFormPage.closeModal();
    });
  });

  // Data-driven test for multiple users
  test.describe('Multiple User Form Submissions', () => {
    
    for (let i = 0; i < 5; i++) {
      test(`Practice Form Submission for User ${i + 1}`, {
        annotation: {
          type: 'regression',
          description: `Data-driven test for practice form submission with multiple test datasets - User ${i + 1}`
        }
      }, async ({ homePage, formsPage, practiceFormPage }) => {

        await test.step('Navigate to Forms page', async () => {
          await homePage.clickFormsCard();
        });

        await test.step('Navigate to Practice Form', async () => {
          await formsPage.clickPracticeFormMenuItem();
        });

        await test.step(`Fill and submit form for ${practiceFormTestData[i].testId}`, async () => {
          await practiceFormPage.fillCompleteForm(practiceFormTestData[i]);
          await practiceFormPage.submitForm();
        });

        await test.step('Verify form submission', async () => {
          await practiceFormPage.verifyFormSubmission(practiceFormTestData[i]);
        });

        await test.step('Close modal', async () => {
          await practiceFormPage.closeModal();
        });
      });
    }
  });

  // Parametrized test using forEach for all test data
  test('All Users Form Submission Loop', {
    annotation: {
      type: 'regression',
      description: 'Comprehensive test looping through all user data sets in a single test'
    }
  }, async ({ homePage, formsPage, practiceFormPage }) => {
    
    for (const userData of practiceFormTestData) {
      await test.step(`Testing form submission for ${userData.testId}`, async () => {
        
        await test.step('Navigate to Forms page', async () => {
          await homePage.clickFormsCard();
        });

        await test.step('Navigate to Practice Form', async () => {
          await formsPage.clickPracticeFormMenuItem();
        });

        await test.step(`Fill and submit form for ${userData.testId}`, async () => {
          await practiceFormPage.fillCompleteForm(userData);
          await practiceFormPage.submitForm();
        });

        await test.step('Verify form submission', async () => {
          await practiceFormPage.verifyFormSubmission(userData);
        });

        await test.step('Close modal and prepare for next iteration', async () => {
          await practiceFormPage.closeModal();
          // Wait a bit before next iteration to ensure modal is closed
          await practiceFormPage.page.waitForTimeout(500);
        });
      });
    }
  });

  // Individual field validation tests
  test('Form Field Validation Tests', {
    annotation: {
      type: 'smoke',
      description: 'Individual form field validation and interaction tests'
    }
  }, async ({ homePage, formsPage, practiceFormPage }) => {
    
    await test.step('Navigate to Practice Form', async () => {
      await homePage.clickFormsCard();
      await formsPage.clickPracticeFormMenuItem();
    });

    const testUser = practiceFormTestData[0];

    await test.step('Test individual field inputs', async () => {
      // Test name fields
      await practiceFormPage.fillFirstName(testUser.firstName);
      await expect(practiceFormPage.firstNameInput).toHaveValue(testUser.firstName);
      
      await practiceFormPage.fillLastName(testUser.lastName);
      await expect(practiceFormPage.lastNameInput).toHaveValue(testUser.lastName);
      
      // Test email field
      await practiceFormPage.fillEmail(testUser.email);
      await expect(practiceFormPage.emailInput).toHaveValue(testUser.email);
      
      // Test mobile field
      await practiceFormPage.fillMobile(testUser.mobile);
      await expect(practiceFormPage.mobileInput).toHaveValue(testUser.mobile);
      
      // Test address field
      await practiceFormPage.fillCurrentAddress(testUser.currentAddress);
      await expect(practiceFormPage.currentAddressInput).toHaveValue(testUser.currentAddress);
    });

    await test.step('Test gender selection', async () => {
      await practiceFormPage.selectGender(testUser.gender);
      // Verify gender is selected by checking the radio button
      const genderRadio = practiceFormPage.page.getByRole('radio', { name: testUser.gender });
      await expect(genderRadio).toBeChecked();
    });

    await test.step('Test date of birth selection', async () => {
      await practiceFormPage.selectDateOfBirth(
        testUser.dateOfBirth.day,
        testUser.dateOfBirth.month,
        testUser.dateOfBirth.year
      );
      // Verify date is set (the input should contain the selected date)
      await expect(practiceFormPage.dateOfBirthInput).toContainText(testUser.dateOfBirth.day);
    });
  });
});