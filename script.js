const BASE_URL =
  "https://v6.exchangerate-api.com/v6/144ccacfa7015ede02bc65bc/latest/";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("#btn");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amount = document.querySelector(".amount input");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // default selection
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  // update flag on change
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Main conversion function
const updateExchangeRate = async () => {
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  msg.innerText = "Converting...";

  try {
    const URL = `${BASE_URL}${fromCurr.value}`;

    let response = await fetch(URL);
    let data = await response.json();

    if (!data.conversion_rates) {
      msg.innerText = "Error fetching exchange rates";
      return;
    }

    let rate = data.conversion_rates[toCurr.value];

    let finalAmount = amtVal * rate;

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(
      2
    )} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Something went wrong. Try again.";
    console.error(error);
  }
};

// Flag update function
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];

  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Button click event
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Auto-run on page load
window.addEventListener("load", () => {
  updateExchangeRate();
});