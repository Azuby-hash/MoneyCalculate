const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTposOo7cVHrCVKUdjWjEK44mUbUR2L1QIYW4yKiATog8lqyol1aiLe_UTqOVI02zmaGipGjPbtnKI4/pub?output=xlsx"

async function fetchData() {
    try {
        const response = await fetch(url);
        const csvText = await response.text();
        console.log(csvText);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchData()