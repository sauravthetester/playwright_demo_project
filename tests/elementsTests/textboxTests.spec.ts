import { expect } from '@playwright/test';
import { test } from '../../fixtures/MyFixtures';
import { promises as fs } from 'fs';

let textBoxData: any;

test.describe('Text Box Tests', () => {

  // Load the text box data from the JSON file before running the tests
  test.beforeAll(async () => {
    const textBoxDataJSONString = await fs.readFile('testdata/textboxData.json', 'utf-8');
    textBoxData = JSON.parse(textBoxDataJSONString);
  });

  // Test to verify the text box submission functionality
  test('Text Box Submission Test', {
    annotation: {
      type: 'smoke',
      description: 'Core functionality test for form submission with data validation'
    }
  }, async ({ homePage, elementsPage, textBoxPage }) => {
    // amazon-qa/login
    // amazon-dev/login
    // amazon-prod/login
    await test.step('Navigate to Elements page', async () => {
      await homePage.clickElementsCard();
    });

    await test.step('Click on Text Box sub-menu', async () => {
      await elementsPage.clickTextBoxSubMenu();
    });

    await test.step('Fill in the text boxes and submit', async () => {
      await textBoxPage.fillTextBoxesAndSubmit(textBoxData);
    });

    await test.step('Verify submission', async () => {
      await textBoxPage.verifySubmission(textBoxData);
    });
  });
});
