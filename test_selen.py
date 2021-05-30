from selenium import webdriver
import time
import camelot
import requests
import pandas as pd

PATH = "chromedriver.exe"
links = list()
pdf_files = ["cat1.pdf", "cat2.pdf", "cat3.pdf"]
excel_files = ["cat1.xlsx", "cat2.xlsx", "cat3.xlsx"]

op = webdriver.ChromeOptions()
op.add_argument('headless')
driver = webdriver.Chrome(options=op)

driver.get("https://arogya.maharashtra.gov.in/1177/Dedicated-COVID-Facilities-Status")
# category 1
link_el = driver.find_element_by_xpath(
    '//*[@id="SitePH_CmsContent_CMSContent"]/div/div/table/tbody/tr[2]/td[3]/p[2]/strong/a')
links.append(link_el.get_attribute('href'))

# category 2
link_el = driver.find_element_by_xpath(
    '//*[@id="SitePH_CmsContent_CMSContent"]/div/div/table/tbody/tr[4]/td[3]/p[2]/strong/a')
links.append(link_el.get_attribute('href'))

# category 3
link_el = driver.find_element_by_xpath(
    '//*[@id="SitePH_CmsContent_CMSContent"]/div/div/table/tbody/tr[6]/td[3]/p[2]/strong/a')
links.append(link_el.get_attribute('href'))

driver.quit()

file_no = 0
for link in links:
    r = requests.get(link)
    with open(pdf_files[file_no], 'wb') as f:
        f.write(r.content)

    print("\nExtracting tables(Be Patient) ..", end="")
    tables = camelot.read_pdf(pdf_files[file_no], pages='1-end')
    list_df = list()
    print(" Done")
    for table in tables[1:len(tables) - 1]:
        list_df.append(table.df)
    merge_df = pd.concat(list_df)
    merge_df.to_excel(excel_files[file_no], sheet_name="data", index=False, header=False)
    file_no = file_no + 1
    print("\nExcel file generated..")
