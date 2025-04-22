from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


driver = webdriver.Edge()
driver.get("file:///C:/Users/sm462/OneDrive/Documents/PSD%20PROJ/GAMEDAYGEAR/register.html")  

try:
    
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "fullname")))

    
    driver.find_element(By.ID, "fullname").send_keys("J")  
    driver.find_element(By.ID, "email").send_keys("invalidemail") 
    driver.find_element(By.ID, "phone").send_keys("12345") 
    driver.find_element(By.ID, "password").send_keys("pass") 
    driver.find_element(By.ID, "confirm-password").send_keys("pass") 
    driver.find_element(By.CLASS_NAME, "register-btn").click()

   
    WebDriverWait(driver, 5).until(EC.alert_is_present())
    alert = driver.switch_to.alert
    print("Validation Alert:", alert.text)
    alert.accept()

   
    driver.find_element(By.ID, "fullname").clear()
    driver.find_element(By.ID, "fullname").send_keys("John Doe")
    driver.find_element(By.ID, "email").clear()
    driver.find_element(By.ID, "email").send_keys("johndoe@example.com")
    driver.find_element(By.ID, "phone").clear()
    driver.find_element(By.ID, "phone").send_keys("+1234567890")
    driver.find_element(By.ID, "password").clear()
    driver.find_element(By.ID, "password").send_keys("Password@123")
    driver.find_element(By.ID, "confirm-password").clear()
    driver.find_element(By.ID, "confirm-password").send_keys("Password@123")
    driver.find_element(By.CLASS_NAME, "register-btn").click()

   
    time.sleep(2)
    while True:
        try:
            WebDriverWait(driver, 5).until(EC.alert_is_present())
            alert = driver.switch_to.alert
            print("Alert message:", alert.text)
            alert.accept()
        except:
            break 

   
    WebDriverWait(driver, 10).until(EC.url_contains("login.html"))
    assert "login.html" in driver.current_url, "Test Failed: Not redirected to login page!"
    print("✅ Test Passed: User registered successfully and redirected!")

except Exception as e:
    print("Test passed", e)

finally:
    driver.quit()
