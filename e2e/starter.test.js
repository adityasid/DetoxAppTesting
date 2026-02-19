/**
 * Detox E2E Tests — Auth Flow
 *
 * Covers:
 *  1. Welcome screen visibility
 *  2. Navigation to Sign Up / Login screens
 *  3. Sign Up form — validation errors
 *  4. Sign Up form — successful submission
 *  5. Login form  — validation errors
 *  6. Login form  — successful submission
 *  7. Logout flow
 */

const VALID_NAME     = 'John Doe';
const VALID_EMAIL    = 'john.doe@example.com';
const VALID_PASSWORD = 'secret123';

// ─── Welcome Screen ───────────────────────────────────────────────────────────
describe('Welcome Screen', () => {
  beforeAll(async () => {
    await device.launchApp({newInstance: true});
  });

  it('should display the welcome screen', async () => {
    await expect(element(by.id('welcome_screen'))).toBeVisible();
  });

  it('should show "Create Account" and "Log In" buttons', async () => {
    await expect(element(by.id('goto_signup_button'))).toBeVisible();
    await expect(element(by.id('goto_login_button'))).toBeVisible();
  });
});

// ─── Sign Up Screen ───────────────────────────────────────────────────────────
describe('Sign Up Screen', () => {
  beforeEach(async () => {
    await device.launchApp({newInstance: true});
    await element(by.id('goto_signup_button')).tap();
    await expect(element(by.id('signup_screen'))).toExist();
  });

  it('should navigate to the sign up screen from welcome', async () => {
    await expect(element(by.id('signup_name_input'))).toBeVisible();
    await expect(element(by.id('signup_email_input'))).toBeVisible();
    await expect(element(by.id('signup_password_input'))).toBeVisible();
    await expect(element(by.id('signup_submit_button'))).toBeVisible();
  });

  it('should show validation errors when submitting an empty form', async () => {
    await element(by.id('signup_submit_button')).tap();
    await expect(element(by.id('signup_name_error'))).toBeVisible();
    await expect(element(by.id('signup_email_error'))).toBeVisible();
    await expect(element(by.id('signup_password_error'))).toBeVisible();
  });

  it('should show an error for an invalid email address', async () => {
    await element(by.id('signup_name_input')).typeText(VALID_NAME);
    await element(by.id('signup_email_input')).typeText('not-an-email');
    await element(by.id('signup_password_input')).typeText(VALID_PASSWORD);
    await element(by.id('signup_submit_button')).tap();
    await expect(element(by.id('signup_email_error'))).toBeVisible();
  });

  it('should show an error when password is too short', async () => {
    await element(by.id('signup_name_input')).typeText(VALID_NAME);
    await element(by.id('signup_email_input')).typeText(VALID_EMAIL);
    await element(by.id('signup_password_input')).typeText('abc');
    await element(by.id('signup_submit_button')).tap();
    await expect(element(by.id('signup_password_error'))).toBeVisible();
  });

  it('should navigate to home screen on successful sign up', async () => {
    await element(by.id('signup_name_input')).typeText(VALID_NAME);
    await element(by.id('signup_email_input')).typeText(VALID_EMAIL);
    await element(by.id('signup_password_input')).typeText(VALID_PASSWORD);
    await element(by.id('signup_submit_button')).tap();
    await expect(element(by.id('home_screen'))).toExist();
    await expect(element(by.id('home_welcome_text'))).toBeVisible();
  });

  it('should navigate to login screen via the link at the bottom', async () => {
    await element(by.id('goto_login_link')).tap();
    await expect(element(by.id('login_screen'))).toExist();
  });
});

// ─── Login Screen ─────────────────────────────────────────────────────────────
describe('Login Screen', () => {
  beforeEach(async () => {
    await device.launchApp({newInstance: true});
    await element(by.id('goto_login_button')).tap();
    await expect(element(by.id('login_screen'))).toExist();
  });

  it('should navigate to the login screen from welcome', async () => {
    await expect(element(by.id('login_email_input'))).toBeVisible();
    await expect(element(by.id('login_password_input'))).toBeVisible();
    await expect(element(by.id('login_submit_button'))).toBeVisible();
  });

  it('should show validation errors when submitting an empty form', async () => {
    await element(by.id('login_submit_button')).tap();
    await expect(element(by.id('login_email_error'))).toBeVisible();
    await expect(element(by.id('login_password_error'))).toBeVisible();
  });

  it('should show an error for an invalid email address', async () => {
    await element(by.id('login_email_input')).typeText('bad-email');
    await element(by.id('login_password_input')).typeText(VALID_PASSWORD);
    await element(by.id('login_submit_button')).tap();
    await expect(element(by.id('login_email_error'))).toBeVisible();
  });

  it('should navigate to home screen on successful login', async () => {
    await element(by.id('login_email_input')).typeText(VALID_EMAIL);
    await element(by.id('login_password_input')).typeText(VALID_PASSWORD);
    await element(by.id('login_submit_button')).tap();
    await expect(element(by.id('home_screen'))).toExist();
    await expect(element(by.id('home_welcome_text'))).toBeVisible();
  });

  it('should navigate to sign up screen via the link at the bottom', async () => {
    await element(by.id('goto_signup_link')).tap();
    await expect(element(by.id('signup_screen'))).toExist();
  });
});

// ─── Home Screen & Logout ─────────────────────────────────────────────────────
describe('Home Screen', () => {
  beforeEach(async () => {
    await device.launchApp({newInstance: true});
    // Log in to reach the home screen
    await element(by.id('goto_login_button')).tap();
    await element(by.id('login_email_input')).typeText(VALID_EMAIL);
    await element(by.id('login_password_input')).typeText(VALID_PASSWORD);
    await element(by.id('login_submit_button')).tap();
    await expect(element(by.id('home_screen'))).toExist();
  });

  it('should display the personalised welcome message', async () => {
    await expect(element(by.id('home_welcome_text'))).toBeVisible();
  });

  it('should show the logout button', async () => {
    await expect(element(by.id('logout_button'))).toBeVisible();
  });

  it('should return to welcome screen after logout', async () => {
    await element(by.id('logout_button')).tap();
    await expect(element(by.id('welcome_screen'))).toExist();
  });
});
