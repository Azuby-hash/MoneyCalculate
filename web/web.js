const url = "https://raw.githubusercontent.com/Azuby-hash/MoneyCalculate/main/index.json"

function fetchData() {
    return new Promise((resolve, reject) => {
        async function action() {
            try {
                const response = await fetch(url);
                const json = await response.json();
                resolve(json)
            } catch (error) {
                alert("Fetch data failed")
                reject(undefined)
            }
        }

        action()
    })
}

let data = { }

function reloadData() {
    console.log(data);


    function getUsersText(category) {
        userMultiples = category.users
        return userMultiples.map((userMultiple) => `${userMultiple[1]}${userMultiple[0]}`).join(", ");
    }

    const root = document.getElementsByClassName("root")[0]
    const addPeople = `
        <h1>Add People</h1>
        <input type="text" id="nameInput" placeholder="Enter a name">
        <button onclick="addPerson()">Add Person</button>
        <h2>People List: ${data.people.join(", ")}</h2>
    `
    const categorys = `
        <div class="section">
        <h2>Add Buy</h2>
        <select id="buyNameSelect">
            ${data.people.map(person => `<option value="${person}">${person}</option>`).join('')}
        </select>
        <input type="number" id="buyAmountInput" placeholder="Enter amount">
        <input type="date" id="buyDateInput">
        <input type="text" id="buyTitleInput">
        <button onclick="addBuy()">Add Buy</button>
        
        <h3>Buys:</h3>
        <ul id="buyList">
            ${data.categorys.map((category, index) => {
                return `
                <li>
                    <div>
                        <span>${category.title}</span>
                        <span> - </span>
                        <span>${category.date} - ${category.buy}: ${category.amount}k</span>
                        <button class="remove-btn" onclick="removeBuy(${index})">Remove</button>
                    </div>
                    <div class="user-list">
                        ${category.users.map((user, i) => {
                            return `
                                <div class="category-user">
                                    <span>${user[1]}x${user[0]}</span>
                                    <span>
                                        <select id="multiSelect${index}">
                                            <option value="0.5">0.5</option>
                                            <option value="1" selected="selected">1</option>
                                            <option value="1.5">1.5</option>
                                            <option value="2">2</option>
                                        </select>
                                        <button onclick="addUserCategoryMulti(${index}, ${i})">Add</button>
                                        <button onclick="removeUserCategoryMulti(${index}, ${i})">Remove</button>
                                    </span>
                                </div>
                            `
                        }).join("")}
                    </div>
                </li>
                `
            }).join("")}
        </ul>
        </div>
    `
    const calculate = `
        <div class="section">
            <h2>Calculate Payments</h2>
            <label for="startDate">Start Date:</label>
            <input type="date" id="startDate">
            <label for="endDate">End Date:</label>
            <input type="date" id="endDate">
            <button onclick="calculatePayments()">Calculate</button>
            <div id="calculationResult"></div>
        </div>
    `
    root.innerHTML = `${addPeople}${categorys}${calculate}`
}

async function root() {
    // const data = await fetchData()

    data = {
        "people": ["Hai", "Son", "Thuan", "Du"],
        "categorys": [
            {
                "title": "Thit lon",
                "date": "2024-07-27",
                "buy": "Hai",
                "amount": 123,
                "users": [
                    ["Son", 1], 
                    ["Thuan", 1], 
                    ["Hai", 1],
                    ["Du", 0]
                ]
            }
        ]
    }

    if (data == undefined) { return }

    reloadData()
}

function update() {

}

function addPerson() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();
    
    if (name) {
        data.people.push(name);
        reloadData()
        update()
        nameInput.value = '';
    }
}

function addBuy() {
    const nameSelect = document.getElementById('buyNameSelect');
    const amountInput = document.getElementById('buyAmountInput');
    const dateInput = document.getElementById('buyDateInput');
    const titleInput = document.getElementById('buyTitleInput');
    const name = nameSelect.value;
    const amount = parseFloat(amountInput.value);
    const title = titleInput.value;
    let date = dateInput.value;
    
    if (!date) {
        date = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
    }
    
    if (name && !isNaN(amount)) {
        data.categorys.push({
            "title": title,
            "date": date,
            "buy": name,
            "amount": amount,
            "users": data.people.map((person) => [person, 0])
        })
        reloadData()
        update()
        nameSelect.value = '';
        amountInput.value = '';
    } else {
        alert('Please select a person and enter a valid amount.');
    }
}

function removeBuy(index) {
    data.categorys.splice(index, 1);
    reloadData()
    update()
}

function addUserCategoryMulti(buyIndex, userIndex) {
    const multiSelect = document.getElementById(`multiSelect${buyIndex}`);
    const selectedMulti = parseFloat(multiSelect.value);
    
    data.categorys[buyIndex].users[userIndex][1] += selectedMulti;
    reloadData()
    update()
}

function removeUserCategoryMulti(buyIndex, userIndex) {
    const multiSelect = document.getElementById(`multiSelect${buyIndex}`);
    const selectedMulti = parseFloat(multiSelect.value);
 
    data.categorys[buyIndex].users[userIndex][1] = Math.max(0, data.categorys[buyIndex].users[userIndex][1] - selectedMulti);
    reloadData()
    update()
}

function calculatePayments() {
    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;
    
    if (!startDate) {
        startDate = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
    }

    if (!endDate) {
        endDate = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
    }

    let tranaction = {}
    data.people.forEach((person) => {
        data.people.forEach((_person) => {
            if (person != _person) {
                tranaction[[person, _person]] = 0
            }
        })
    })

    data.categorys.forEach(category => {
        if (category.date >= startDate && category.date <= endDate) {
            const userMultis = category.users
            
            let multi = 0
            userMultis.forEach((userMulti) => {
                multi = multi + userMulti[1]
            })

            const balance = category.amount / multi
            userMultis.forEach((userMulti) => {
                if (userMulti[0] != category.buy) {
                    const returnAmount = balance * userMulti[1]
                    tranaction[[userMulti[0], category.buy]] += returnAmount
                }
            })
        }
    });

    console.log(tranaction);

    const resultDiv = document.getElementById('calculationResult');
    resultDiv.innerHTML = `
        <h3>Calculation Results (${startDate} to ${endDate}):</h3>
        <h4>Payments:</h4>
        `;
        // <ul>${payments.map(payment => `<li>${payment}</li>`).join('')}</ul>
}

root()