# Puppeteer Search Script
This is a Puppeteer script that allows users to perform searches on Google and Nike websites using headless Chrome.


### Installation
Clone this repository to your local machine:
```bash
git clone <repository_url>
```

### Navigate to the project directory:
```bash
cd puppeteer-search-script 
```
### Install dependencies using npm:
```bash
npm install
```
# Usage
Run the script:
```bash
npm start
```
Follow the prompts to select a website to search and provide search input.

Once the search is complete, the script will output the search results.

# Features
Allows searching on both Google and Nike websites.
Uses Puppeteer to automate browser interactions.
Supports user input for selecting search options and providing search queries.
Provides search results in the console.

# How it Works
The script prompts the user to select a website to search (Google or Nike).
It then prompts for a search query.
For Google searches, it performs a search using the provided query and extracts search results.
For Nike searches, it navigates to the Nike website, performs a search using the provided query, and extracts search results specific to Nike products.
The search results are displayed in the console, including links and relevant information.

