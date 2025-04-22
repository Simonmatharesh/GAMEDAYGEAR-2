from selenium import webdriver
import time


driver = webdriver.Edge()


driver.get("file:///C:/Users/sm462/OneDrive/Documents/PSD%20PROJ/GAMEDAYGEAR/index.html") 


screen_sizes = {
    "Mobile - iPhone 12": (390, 844),
    "Tablet - iPad Air": (820, 1180),
    "Laptop - 1366x768": (1366, 768),
    "Desktop - Full HD": (1920, 1080)
}


for device, size in screen_sizes.items():
    driver.set_window_size(size[0], size[1])
    print(f"🔍 Testing {device} at {size[0]}x{size[1]} resolution")
    time.sleep(2)  # Wait to visually confirm


driver.quit()
