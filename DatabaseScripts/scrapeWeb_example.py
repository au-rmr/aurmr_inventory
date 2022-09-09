# Web Scrapping Example

import pandas as pd
import requests
from bs4 import BeautifulSoup as bs

base_url = "https://www.consumeraffairs.com/food/dominos.html?page="
i = 5
query_parameter = "?page="+str(i) #i represents the page number

all_pages_reviews = []

def scrapper():
    for i in range(1, 6):
        pagewise_reviews = []
        url = base_url + query_parameter
        response = requests.get(url)
        soup = bs(response.content, 'html.parser')
        rev_div = soup.findAll("div", attrs={'class', 'rvw-bd'})
        for j in range(len(rev_div)):
            pagewise_reviews.append(rev_div[j].find("p").text)
        for k in range(len(pagewise_reviews)):
            all_pages_reviews.append(pagewise_reviews[k])

        return all_pages_reviews


if __name__ == "__main__":
    reviews = scrapper()
    print(reviews)