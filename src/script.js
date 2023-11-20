let totalAmount = document.getElementById("total-amount");
let userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("product-title");
const shortDescription = document.getElementById("short-description");
const sourceOfIncome = document.getElementById("source-of-income");
const errorMessage = document.getElementById("budget-error");
const productTitleError = document.getElementById("product-title-error");
const productCostError = document.getElementById("product-cost-error");
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");
let tempAmount = 0;
let incomeList = []; // Array of income objects
let expenseList = []; // Array of expense objects

// Function to format the timestamp
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);

  if (isNaN(date)) {
    return "Invalid date"; // Return a default message for invalid dates
  }

  return date.toLocaleString();
};

// Function to update income details
const updateIncomeDetails = () => {
  let totalIncome = 0;
  let sourceOfIncomeList = [];

  // Clear income list HTML
  document.getElementById("income-list").innerHTML = "";

  // Iterate over incomeList to update HTML and calculate total income
  incomeList.forEach((income) => {
    totalIncome += parseInt(income.amount);
    sourceOfIncomeList.push(income.sourceOfIncome);

    const listItem = document.createElement("div");
    listItem.classList.add("income-list-item");
    listItem.innerHTML = `
      <div class="income-details">
        <p class="income-amount">$${income.amount}</p>
        <p class="income-source">${income.sourceOfIncome}</p>
        <p class="income-timestamp">${formatTimestamp(income.timestamp)}</p>
      </div>
    `;
    document.getElementById("income-list").appendChild(listItem);
  });

  // Update total income and source of income HTML elements
  document.getElementById("total-income-amount").textContent = totalIncome;
  document.getElementById("total-income-source").textContent =
    sourceOfIncomeList.join(", ");

  updateIncomeValues();
};

// Function to update expense list
const updateExpenseList = () => {
  let expenseListContainer = document.getElementById("expense-list");
  expenseListContainer.innerHTML = "";
  expenseList.forEach((expense) => {
    let timestamp = expense.timestamp;
    listCreator(
      expense.name,
      expense.description,
      expense.amount,
      timestamp
    );
  });

  updateIncomeValues();
};

// Function to update income values (Total Budget, Expenses, Balance)
const updateIncomeValues = () => {
  let totalIncome = incomeList.reduce(
    (total, income) => total + parseInt(income.amount),
    0
  );
  let totalExpenses = expenseList.reduce(
    (total, expense) => total + parseInt(expense.amount),
    0
  );
  expenditureValue.textContent = totalExpenses; // Update expenses
  balanceValue.textContent = totalIncome - totalExpenses; // Update balance
  amount.textContent = totalIncome; // Update total budget
};

// Move this line after the updateExpenseList() call in the modifyElement() function
updateExpenseList();


const disableButtons = (disable) => {
  // Replace the selectors with the appropriate button IDs or classes
  const buttons = document.querySelectorAll('.disable-button-class');

  buttons.forEach((button) => {
    button.disabled = disable;
  });
};

// Set Budget Part
totalAmountButton.addEventListener("click", () => {
  tempAmount = totalAmount.value;
  // empty or negative input
  if (tempAmount === "" || tempAmount < 0) {
    errorMessage.classList.remove("hide");
  } else {
    errorMessage.classList.add("hide");
    // Set Budget
    amount.textContent = tempAmount;
    // Set Balance
    updateIncomeValues();
    // Clear Input Box
    totalAmount.value = "";

    // Add income details to incomeList and update the income values
    incomeList.push({
      amount: tempAmount,
      sourceOfIncome: sourceOfIncome.value,
      timestamp: Date.now(), // Add current timestamp
    });
    sourceOfIncome.value = "";
    updateIncomeDetails();
  }
});

// Set expense details button event listener
checkAmountButton.addEventListener("click", () => {
  // Empty checks
  if (!userAmount.value || !productTitle.value) {
    productTitleError.classList.remove("hide");
    return;
  }

  // Expense details
  let expenseName = productTitle.value;
  let description = shortDescription.value;
  let expenseValue = userAmount.value;

  let expense = {
    name: expenseName,
    description: description,
    amount: expenseValue,
    timestamp: Date.now() // Add current timestamp
  };

  if (checkAmountButton.dataset.action === "edit") {
    // Find the expense object to edit and update the properties
    const expenseIndex = expenseList.findIndex(
      (expense) => expense.amount === checkAmountButton.dataset.amount
    );
    expenseList[expenseIndex].name = expenseName;
    expenseList[expenseIndex].description = description;
    expenseList[expenseIndex].amount = expenseValue;
  } else {
    // Add new expense details to the expenseList
    expenseList.push(expense);
  }

  // Update expense list and input fields
  updateExpenseList();

  // Clear input fields
  productTitle.value = "";
  shortDescription.value = "";
  userAmount.value = "";

  // Reset checkAmountButton dataset
  checkAmountButton.dataset.action = "";
  checkAmountButton.dataset.amount = "";

  // Enable totalAmountButton
  totalAmountButton.disabled = false;
});

// Function to modify expense list elements
const modifyElement = (element, isEdit = false) => {
  let parentDiv = element.closest(".sublist-content");
  let parentAmount = parentDiv.querySelector(".amount").innerText;
  let expenseDetails = document.createElement("div");
  expenseDetails.classList.add("expense-details");
  
  if (isEdit) {
    let parentText = parentDiv.querySelector(".product").innerText;
    let parentDescription = parentDiv.querySelector(".description").innerText;
    let timestampDiv = document.createElement("div");
    timestampDiv.classList.add("timestamp-div");
    let timestampText = document.createElement("p");
    timestampText.classList.add("timestamp");
    timestampText.textContent = parentDiv.querySelector(".timestamp").innerText;
    timestampDiv.appendChild(timestampText);
    expenseDetails.appendChild(timestampDiv);
    productTitle.value = "";
    shortDescription.value = "";
    userAmount.value = "";

    setTimeout(() => {
      productTitle.value = parentText;
      shortDescription.value = parentDescription;
      userAmount.value = parentAmount;
    }, 10);

    sourceOfIncome.value = sourceOfIncome.textContent;
    totalAmount.value = amount.textContent;

    disableButtons(true);
    totalAmountButton.disabled = true; // Disable totalAmountButton

    // Set dataset values for checkAmountButton
    checkAmountButton.dataset.action = "edit";
    checkAmountButton.dataset.amount = parentAmount;

    return; // Exit the function before creating new expense or modifying existing one
  } else {
    // Delete functionality
    parentDiv.remove(); // Remove expense entry from DOM
    updateExpenseList(); // Update expense list

    // Remove the deleted expense from expenseList array
    const expenseIndex = expenseList.findIndex(
      (expense) => expense.amount === parentAmount
    );

    expenseList.splice(expenseIndex, 1);

    // Enable totalAmountButton if expenseList is empty
    if (expenseList.length === 0) {
      totalAmountButton.disabled = false;
    }
  }

  // Clear input fields
  productTitle.value = "";
  shortDescription.value = "";
  userAmount.value = "";
};



// Function to add expenses to the list
const listCreator = (expenseName, description, expenseValue, timestamp) => {
  const list = document.getElementById("expense-list");
  let listItem = document.createElement("div");
  listItem.classList.add("sublist-content", "flex-space");

  // Use a different ID for the parent container of the expense list item
  listItem.id = "expense-item";


  let formattedTimestamp = timestamp;

  if (typeof timestamp === "number" && !isNaN(timestamp)) {
    // Check if timestamp is a valid number
    formattedTimestamp = formatTimestamp(timestamp); // Format the timestamp
  }

  let expenseDetails = document.createElement("div");
  expenseDetails.classList.add("expense-details");

  let productDiv = document.createElement("div");
  productDiv.classList.add("product-div");
  let productTitle = document.createElement("p");
  productTitle.classList.add("product");
  productTitle.textContent = expenseName;
  productDiv.appendChild(productTitle);

  let descriptionDiv = document.createElement("div");
  descriptionDiv.classList.add("description-div");
  let descriptionText = document.createElement("p");
  descriptionText.classList.add("description");
  descriptionText.textContent = description;
  descriptionDiv.appendChild(descriptionText);

  let amountDiv = document.createElement("div");
  amountDiv.classList.add("amount-div");
  let amountText = document.createElement("p");
  amountText.classList.add("amount");
  amountText.textContent = expenseValue;
  amountDiv.appendChild(amountText);
  
  let timestampDiv = document.createElement("div");
  timestampDiv.classList.add("timestamp-div");
  let timestampText = document.createElement("p");
  timestampText.classList.add("timestamp");
  timestampText.textContent = formattedTimestamp; // Use the formatted timestamp
  timestampDiv.appendChild(timestampText);

  expenseDetails.appendChild(productDiv);
  expenseDetails.appendChild(descriptionDiv);
  expenseDetails.appendChild(amountDiv);
  expenseDetails.appendChild(timestampDiv);

  listItem.appendChild(expenseDetails);

  let actionDiv = document.createElement("div");
  actionDiv.classList.add("action-div");
  let editButton = document.createElement("button");
  editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
  editButton.style.fontSize = "1.2em";
  editButton.addEventListener("click", () => {
    modifyElement(editButton.closest(".sublist-content"), true);
  });

  let deleteButton = document.createElement("button");
  deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
  deleteButton.style.fontSize = "1.2em";
  deleteButton.addEventListener("click", () => {
    modifyElement(deleteButton);
  });

  actionDiv.appendChild(editButton);
  actionDiv.appendChild(deleteButton);

  listItem.appendChild(actionDiv);
  list.appendChild(listItem);

  updateIncomeValues();
};