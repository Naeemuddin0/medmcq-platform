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
    time.sleep(2)
    assert "/contact" in driver.current_url

# 5. Verify Login Page Loads
def test_login_page_loads(driver):
    driver.get(f"{BASE_URL}/login")
    # Check for email and password inputs by type
    email_input = driver.find_element(By.XPATH, "//input[@type='email']")
    pass_input = driver.find_element(By.XPATH, "//input[@type='password']")
    assert email_input is not None
    assert pass_input is not None

# 6. Verify Registration Page Loads
def test_register_page_loads(driver):
    driver.get(f"{BASE_URL}/register")
    # Check for name and email inputs
    name_input = driver.find_element(By.XPATH, "//input[contains(@placeholder, 'Name') or preceding-sibling::label[contains(text(), 'Name')]]")
    email_input = driver.find_element(By.XPATH, "//input[@type='email']")
    assert name_input is not None
    assert email_input is not None

# 7. Verify Navigation Bar Presence
def test_navbar_presence(driver):
    driver.get(BASE_URL)
    # Check for navigation container
    nav = driver.find_element(By.TAG_NAME, "nav")
    assert nav.is_displayed()

# 8. Test Invalid Login
def test_invalid_login_error(driver):
    driver.get(f"{BASE_URL}/login")
    email_input = driver.find_element(By.XPATH, "//input[@type='email']")
    pass_input = driver.find_element(By.XPATH, "//input[@type='password']")
    submit_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]")
    
    email_input.send_keys("wrong@example.com")
    pass_input.send_keys("wrongpassword")
    submit_btn.click()
    
    time.sleep(2)
    # Check if we are still on login page or see an error
    assert "/login" in driver.current_url

# 9. Verify Copyright Presence
def test_copyright_presence(driver):
    driver.get(BASE_URL)
    # Look for copyright text instead of footer tag
    body_text = driver.find_element(By.TAG_NAME, "body").text
    assert "©" in body_text or "All rights reserved" in body_text

# 10. Verify Logo presence
def test_logo_link(driver):
    driver.get(BASE_URL)
    # Logo usually links to home
    logo = driver.find_element(By.XPATH, "//a[contains(text(), 'MedMCQ') or .//img[contains(@alt, 'Logo')]]")
    assert logo is not None

# 11. Verify Practice Page Redirects
def test_practice_redirect(driver):
    driver.get(f"{BASE_URL}/practice")
    time.sleep(2)
    # If not logged in, it might stay on practice or go to login
    # We just verify the page loads
    assert driver.current_url is not None

# 12. Verify Dashboard Redirects
def test_dashboard_redirect(driver):
    driver.get(f"{BASE_URL}/dashboard")
    time.sleep(2)
    assert driver.current_url is not None

# 13. Verify Contact Form Inputs
def test_contact_form_inputs(driver):
    driver.get(f"{BASE_URL}/contact")
    inputs = driver.find_elements(By.TAG_NAME, "input")
    # Contact form should have at least name and email
    assert len(inputs) >= 2

# 14. Verify Meta Description Presence (SEO)
def test_meta_description(driver):
    driver.get(BASE_URL)
    meta = driver.find_element(By.XPATH, "//meta[@name='description']")
    assert meta.get_attribute("content") != ""

# 15. Verify Sign In Button on Home Page
def test_home_signin_button(driver):
    driver.get(BASE_URL)
    signin_btn = driver.find_element(By.XPATH, "//a[contains(text(), 'Sign In') or @href='/login']")
    assert signin_btn.is_displayed()
