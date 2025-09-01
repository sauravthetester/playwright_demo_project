import { expect } from '@playwright/test';
import { test } from '../../fixtures/MyFixtures';
import { FormData } from '../../pages/forms/PracticeFormPage';
import { promises as fs } from 'fs';

let edgeCaseTestData: FormData[];

test.describe('Practice Form Edge Cases Tests', () => {

  test.beforeAll(async () => {
    // Load edge case test data from JSON file
    const testDataJson = await fs.readFile('testdata/practiceFormEdgeCases.json', 'utf-8');
    edgeCaseTestData = JSON.parse(testDataJson);
  });

  test('Minimum Data Form Submission', {
    annotation: {
      type: 'smoke',
      description: 'Test form submission with minimal required data'
    }
  }, async ({ homePage, formsPage, practiceFormPage }) => {
    
    await test.step('Navigate to Practice Form', async () => {
      await homePage.clickFormsCard();
      await formsPage.clickPracticeFormMenuItem();
    });

    await test.step('Submit form with minimal data', async () => {
      const minimalData = edgeCaseTestData[0]; // Single character names
      await practiceFormPage.fillCompleteForm(minimalData);
      await practiceFormPage.submitForm();
    });

    await test.step('Verify form submission', async () => {
      await practiceFormPage.verifyFormSubmission(edgeCaseTestData[0]);
      await practiceFormPage.closeModal();
    });
  });

  test('Maximum Data Form Submission', {
    annotation: {
      type: 'regression',
      description: 'Test form submission with maximum length data fields'
    }
  }, async ({ homePage, formsPage, practiceFormPage }) => {
    
    await test.step('Navigate to Practice Form', async () => {
      await homePage.clickFormsCard();
      await formsPage.clickPracticeFormMenuItem();
    });

    await test.step('Submit form with maximum data', async () => {
      const maxData = edgeCaseTestData[1]; // Long data
      await practiceFormPage.fillCompleteForm(maxData);
      await practiceFormPage.submitForm();
    });

    await test.step('Verify form submission', async () => {
      await practiceFormPage.verifyFormSubmission(edgeCaseTestData[1]);
      await practiceFormPage.closeModal();
    });
  });

  test('Special Characters Form Submission', {
    annotation: {
      type: 'regression',
      description: 'Test form submission with special characters in data fields'
    }
  }, async ({ homePage, formsPage, practiceFormPage }) => {
    
    await test.step('Navigate to Practice Form', async () => {
      await homePage.clickFormsCard();
      await formsPage.clickPracticeFormMenuItem();
    });

    await test.step('Submit form with special characters', async () => {
      const specialCharsData = edgeCaseTestData[2]; // Special characters
      await practiceFormPage.fillCompleteForm(specialCharsData);
      await practiceFormPage.submitForm();
    });

    await test.step('Verify form submission', async () => {
      await practiceFormPage.verifyFormSubmission(edgeCaseTestData[2]);
      await practiceFormPage.closeModal();
    });
  });

  // Run all edge cases in sequence
  test('All Edge Cases Sequential Test', {
    annotation: {
      type: 'regression',
      description: 'Sequential execution of all edge case scenarios'
    }
  }, async ({ homePage, formsPage, practiceFormPage }) => {
    
    for (const [index, testData] of edgeCaseTestData.entries()) {
      await test.step(`Testing edge case ${index + 1}: ${testData.testId}`, async () => {
        
        await test.step('Navigate to Practice Form', async () => {
          await homePage.clickFormsCard();
          await formsPage.clickPracticeFormMenuItem();
        });

        await test.step(`Fill and submit form for ${testData.testId}`, async () => {
          await practiceFormPage.fillCompleteForm(testData);
          await practiceFormPage.submitForm();
        });

        await test.step('Verify and close', async () => {
          await practiceFormPage.verifyFormSubmission(testData);
          await practiceFormPage.closeModal();
          await practiceFormPage.page.waitForTimeout(500); // Brief pause between iterations
        });
      });
    }
  });
});