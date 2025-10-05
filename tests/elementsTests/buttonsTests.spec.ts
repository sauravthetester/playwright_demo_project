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
  
    await test.step('Click on Buttons sub-menu', async () => {
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
  }, async ({ loginPage }) => {

    await test.step('Navigate to login page', async () => {
      await loginPage.navigateToLoginPage();
    });

    await test.step('Perform login', async () => {
      await loginPage.login('practice', 'SuperSecretPassword!');
    });

    await test.step('Verify successful login', async () => {
      await loginPage.verifySuccessfulLogin();
    });

    await test.step('Simulate session expiration', async () => {
      await loginPage.performSessionExpirationTest();
    });

    await test.step('Wait for session timeout', async () => {
      await loginPage.waitForTimeout(20000);
    });
  });
});
