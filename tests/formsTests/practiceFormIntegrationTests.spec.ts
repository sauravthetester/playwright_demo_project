import { test } from '../../fixtures/MyFixtures';
import { FormData } from '../../pages/forms/PracticeFormPage';
import { promises as fs } from 'fs';

// This is a comprehensive integration test that combines both datasets
test.describe('Complete Practice Form Integration Tests', () => {

  test('Combined Dataset Integration Tests', {
    annotation: {
      type: 'regression',
      description: 'Integration test using both primary and edge case datasets'
    }
  }, async ({ homePage, formsPage, practiceFormPage }) => {
    
    // Load both datasets
    const primaryDataJson = await fs.readFile('testdata/practiceFormData.json', 'utf-8');
    const edgeCaseDataJson = await fs.readFile('testdata/practiceFormEdgeCases.json', 'utf-8');
    
    const primaryData: FormData[] = JSON.parse(primaryDataJson);
    const edgeCaseData: FormData[] = JSON.parse(edgeCaseDataJson);
    
    // Combine both datasets
    const allTestData = [...primaryData, ...edgeCaseData];
    
    await test.step(`Processing ${allTestData.length} total test cases`, async () => {
      console.log(`Running integration test with ${allTestData.length} datasets`);
      console.log(`Primary datasets: ${primaryData.length}, Edge cases: ${edgeCaseData.length}`);
    });
    
    for (const [index, userData] of allTestData.entries()) {
      await test.step(`Integration test ${index + 1}/${allTestData.length}: ${userData.testId}`, async () => {
        
        await test.step('Navigate to Practice Form', async () => {
          await homePage.clickFormsCard();
          await formsPage.clickPracticeFormMenuItem();
        });

        await test.step(`Fill and submit form for ${userData.testId}`, async () => {
          await practiceFormPage.fillCompleteForm(userData);
          await practiceFormPage.submitForm();
        });

        await test.step('Verify form submission', async () => {
          await practiceFormPage.verifyFormSubmission(userData);
          await practiceFormPage.closeModal();
          // Small delay between iterations for stability
          if (index < allTestData.length - 1) {
            await practiceFormPage.page.waitForTimeout(300);
          }
        });
      });
    }
  });
});