const url = "https://raw.githubusercontent.com/Azuby-hash/MoneyCalculate/main/index.json"

function fetchData() {
    return new Promise((resolve, reject) => {
        fetch('index.json')
            .then(response => response.json())
            .then(data => {
                resolve(data)
            })
            .catch(error => { 
                console.error("Error fetching JSON data:", error) 
                console.log("Try from publish json file");

                fetch(url)
                    .then((res) => {
                        return res.json()
                    })
                    .then((value) => {
                        resolve(value)
                    })
                    .catch((reason) => {
                        reject(reason)
                    })
            });
    })
}

let data = { }

function calculationResult() {
    if (data.calculated.length == 0) {
        return ``
    }

    const calculationResult = data.calculated[data.calculated.length - 1]
    const tranaction = calculationResult.tranaction
    const calculateDate = calculationResult.calculate_date
    const startDate = calculationResult.start_date
    const endDate = calculationResult.end_date

    return `
        <h3>Calculation Results (${startDate} to ${endDate})</h3>
        <h3>Results from ${calculateDate}</h3>
        <h4>Payments:</h4>
        <ul>${Object.keys(tranaction).map((tranKey) => `<li>${tranKey.split(",").join(" -> ")}: ${tranaction[tranKey]}</li>`).join('')}</ul>
    `
}

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
        <h2><span>People List: </span><span id="peopleList">${data.people.join(", ")}</span></h2>
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
                    <details class="user-list">
                        <summary id="summaryBuy${index}">
                            ${category.users.map((user) => {
                                return `<span>${user[1]}x${user[0]}</span>`
                            }).join("<span>, </span>")}
                        </summary>
                        <div class="user-list-details">
                            ${category.users.map((user, i) => {
                                return `
                                    <div class="category-user">
                                        <span id="detailsBuyUser${index}${i}">${user[1]}x${user[0]}</span>
                                        <span>
                                            <select id="multiSelect${index}${i}">
                                                <option value="0.5">0.5</option>
                                                <option value="1" selected="selected">1</option>
                                                <option value="1.5">1.5</option>
                                                <option value="2">2</option>
                                            </select>
                                            <button onclick="addUserCategoryMulti(${index}, ${i})">+</button>
                                            <button onclick="removeUserCategoryMulti(${index}, ${i})">-</button>
                                        </span>
                                    </div>
                                `
                            }).join("")}
                        </div>
                    </details>
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
            <div id="calculationResult">
                ${calculationResult()}
            </div>
        </div>
    `
    root.innerHTML = `${addPeople}${categorys}${calculate}`
}

async function root() {
    data = await fetchData()
    
    if (data == undefined) { return }

    reloadData()
}

function update() {
    fetch("http://localhost:3000/8af78f8f-6cc2-43e2-ac53-573b3c4cb247", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        method: "POST",
        body: JSON.stringify(data)
    })
}

function addPerson() {
    const nameInput = document.getElementById('nameInput');
    const peopleList = document.getElementById('peopleList');
    const name = nameInput.value.trim();
    
    if (name) {
        data.people.push(name);
        peopleList.innerHTML = data.people.join(", ")
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
    } else {
        alert('Please select a person and enter a valid amount.');
    }
}

function removeBuy(index) {
    if (confirm("Remove this buy?")) {
        data.categorys.splice(index, 1);
        reloadData()
        update()
    }
}

function addUserCategoryMulti(buyIndex, userIndex) {
    const multiSelect = document.getElementById(`multiSelect${buyIndex}${userIndex}`);
    const selectedMulti = parseFloat(multiSelect.value);
    
    const summary = document.getElementById(`summaryBuy${buyIndex}`)
    const detailsBuyUser = document.getElementById(`detailsBuyUser${buyIndex}${userIndex}`)

    data.categorys[buyIndex].users[userIndex][1] += selectedMulti;

    const user = data.categorys[buyIndex].users[userIndex]

    summary.innerHTML = `
        ${data.categorys[buyIndex].users.map((user) => {
            return `<span>${user[1]}x${user[0]}</span>`
        }).join("<span>, </span>")}
    `
    detailsBuyUser.innerHTML = `
        ${user[1]}x${user[0]}
    `

    update()
}

function removeUserCategoryMulti(buyIndex, userIndex) {
    const multiSelect = document.getElementById(`multiSelect${buyIndex}${userIndex}`);
    const selectedMulti = parseFloat(multiSelect.value);

    const summary = document.getElementById(`summaryBuy${buyIndex}`)
    const detailsBuyUser = document.getElementById(`detailsBuyUser${buyIndex}${userIndex}`)
 
    data.categorys[buyIndex].users[userIndex][1] = Math.max(0, data.categorys[buyIndex].users[userIndex][1] - selectedMulti);

    const user = data.categorys[buyIndex].users[userIndex]

    summary.innerHTML = `
        ${data.categorys[buyIndex].users.map((user) => {
            return `<span>${user[1]}x${user[0]}</span>`
        }).join("<span>, </span>")}
    `
    detailsBuyUser.innerHTML = `
        ${user[1]}x${user[0]}
    `

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
                tranaction[`${person},${_person}`] = 0
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

            function appendTranaction() {
                if (multi == 0) {
                    return
                }

                const balance = category.amount / multi
                userMultis.forEach((userMulti) => {
                    if (userMulti[0] != category.buy) {
                        const returnAmount = balance * userMulti[1]
                        tranaction[`${userMulti[0]},${category.buy}`] += returnAmount
                    }
                })
            }

            if (multi == 0) {
                if (confirm("No people used for some tranaction. Continue?")) {
                    appendTranaction()
                    return
                }
            }

            appendTranaction()
        }
    });

    Object.keys(tranaction).forEach((key) => {
        if (tranaction[key] == 0) {
            delete tranaction[key]
            return
        }

        if (tranaction[key] == undefined) {
            return
        }

        const reverseKey = key.split(",").reverse().join(",")

        if (tranaction[reverseKey]) {
            if (tranaction[key] > tranaction[reverseKey]) {
                tranaction[key] -= tranaction[reverseKey]
                delete tranaction[reverseKey]
            } else {
                tranaction[reverseKey] -= tranaction[key]
                delete tranaction[key]
            }
        }
    })

    console.log(tranaction);
    data.calculated.push({
        "calculate_date": new Date().toISOString().split('T')[0],
        "start_date": startDate,
        "end_date": endDate,
        "tranaction": tranaction
    })

    let calculation = document.getElementById('calculationResult');
    calculation.innerHTML = `${calculationResult()}`

    update()
}

root()