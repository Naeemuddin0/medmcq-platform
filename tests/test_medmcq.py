import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
import time

# Configuration: Target URL (can be set via environment variable)
BASE_URL = os.getenv('BASE_URL', 'http://medmcq-web-dev:3000') 

from selenium.webdriver.chrome.service import Service

@pytest.fixture(scope="module")
def driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--remote-debugging-port=9222")
    chrome_options.add_argument("--window-size=1920,1080")
    
    driver = webdriver.Chrome(options=chrome_options)
    driver.implicitly_wait(10)
    yield driver
    driver.quit()

# 1. Verify Page Title
def test_page_title(driver):
    driver.get(BASE_URL)
    assert "MedMCQ" in driver.title

# 2. Verify Home Page Hero Section
def test_hero_section_presence(driver):
    driver.get(BASE_URL)
    hero = driver.find_element(By.TAG_NAME, "h1")
    assert hero.is_displayed()
    assert len(hero.text) > 0

# 3. Verify Navigation to About Page
def test_nav_about(driver):
    driver.get(BASE_URL)
    about_link = driver.find_element(By.LINK_TEXT, "About")
    about_link.click()
    assert "/about" in driver.current_url
    assert "About" in driver.page_source

# 4. Verify Navigation to Contact Page
def test_nav_contact(driver):
    driver.get(BASE_URL)
    contact_link = driver.find_element(By.LINK_TEXT, "Contact")
    contact_link.click()
    assert "/contact" in driver.current_url

# 5. Verify Login Page Loads
def test_login_page_loads(driver):
    driver.get(f"{BASE_URL}/login")
    assert "Sign In" in driver.page_source
    email_field = driver.find_element(By.NAME, "email")
    password_field = driver.find_element(By.NAME, "password")
    assert email_field.is_displayed()
    assert password_field.is_displayed()

# 6. Verify Registration Page Loads
def test_register_page_loads(driver):
    driver.get(f"{BASE_URL}/register")
    assert "Sign Up" in driver.page_source or "Register" in driver.page_source
    name_field = driver.find_element(By.NAME, "name")
    assert name_field.is_displayed()

# 7. Verify Navigation Bar Presence
def test_navbar_presence(driver):
    driver.get(BASE_URL)
    nav = driver.find_element(By.TAG_NAME, "nav")
    assert nav.is_displayed()

# 8. Test Invalid Login
def test_invalid_login_error(driver):
    driver.get(f"{BASE_URL}/login")
    driver.find_element(By.NAME, "email").send_keys("invalid@test.com")
    driver.find_element(By.NAME, "password").send_keys("wrongpass")
    driver.find_element(By.TAG_NAME, "form").submit()
    # Check for error message - wait a bit for NextAuth redirect/toast
    time.sleep(2)
    assert "Invalid" in driver.page_source or "error" in driver.page_source.lower()

# 9. Verify Footer Presence
def test_footer_presence(driver):
    driver.get(BASE_URL)
    footer = driver.find_element(By.TAG_NAME, "footer")
    assert footer.is_displayed()

# 10. Verify Logo presence
def test_logo_link(driver):
    driver.get(BASE_URL)
    logo = driver.find_element(By.XPATH, "//a[contains(text(), 'MedMCQ')]")
    assert logo.is_displayed()

# 11. Verify Practice Page Redirects (if unauthenticated)
def test_practice_redirect(driver):
    driver.get(f"{BASE_URL}/practice")
    # Should redirect to login if protected
    time.sleep(1)
    assert "/login" in driver.current_url

# 12. Verify Dashboard Redirects (if unauthenticated)
def test_dashboard_redirect(driver):
    driver.get(f"{BASE_URL}/dashboard")
    time.sleep(1)
    assert "/login" in driver.current_url

# 13. Verify Contact Form Inputs
def test_contact_form_inputs(driver):
    driver.get(f"{BASE_URL}/contact")
    inputs = driver.find_elements(By.TAG_NAME, "input")
    # Name, Email etc.
    assert len(inputs) >= 2

# 14. Verify Meta Description Presence (SEO)
def test_meta_description(driver):
    driver.get(BASE_URL)
    meta = driver.find_element(By.XPATH, "//meta[@name='description']")
    assert meta.get_attribute("content")

# 15. Verify Sign In Button on Home Page
def test_home_signin_button(driver):
    driver.get(BASE_URL)
    signin_btns = driver.find_elements(By.LINK_TEXT, "Sign In")
    if not signin_btns:
         signin_btns = driver.find_elements(By.LINK_TEXT, "Login")
    assert len(signin_btns) > 0
    assert signin_btns[0].is_displayed()
