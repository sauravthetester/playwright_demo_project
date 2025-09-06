import { test } from '../../fixtures/MyFixtures';


test.describe('Buttons interaction tests', () => {

  test('Buttons interaction test', {
    annotation: {
      type: 'smoke',
      description: 'Core functionality test for button interactions.'
    }
  }, async ({ homePage, elementsPage, buttonsPage }) => {

    await test.step('Navigate to Elements page', async () => {
        await homePage.clickElementsCard();
    });
  
    await test.step('Click on Text Box sub-menu', async () => {
        await elementsPage.clickButtonsSubMenu();
    });
    await test.step('Click on buttons', async () => {
        await buttonsPage.doubleClick();
        await buttonsPage.rightClick();
        await buttonsPage.regularClick();
    });
    await test.step('Verify button interaction messages', async () => {
        await buttonsPage.verifyDoubleClickMessage();
        await buttonsPage.verifyRightClickMessage();
        await buttonsPage.verifyClickMessage();
    });
  });

    test('Buttons interaction with locator', {
      annotation: {
        type: 'regression',
        description: 'Complex authentication and session management test'
      }
    }, async ({ page }) => {

        await page.goto('https://practice.expandtesting.com/login');
        await page.locator('#username').fill('practice');
        await page.locator('#password').fill('SuperSecretPassword!');
        await page.getByRole('button', { name: 'Login' }).click();
        await page.clock.fastForward('30:00');
        await page.context().clearCookies();
        await page.reload();
        await page.waitForTimeout(20000);
    });
});
