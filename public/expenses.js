const expensesBody = document.querySelector(".expenses-body");
const leaderboardsBody = document.querySelector(".leaderboards-body");
const descriptionField = document.getElementById("description");
const categoryField = document.getElementById("category");
const amountField = document.getElementById("amount");
const host = window.location.protocol + "//" + window.location.host;
const overlay = document.getElementById("loading");

let PAGE_NO = 1;
let lastPage = false;

async function getExpenses(nxt) {
  try {
    overlay.style.display = "block";
    expensesBody.innerHTML = "";
    if (nxt == 1 && !lastPage) {
      PAGE_NO++;
    } else if (nxt == -1 && PAGE_NO > 0) {
      PAGE_NO--;
    }
    const {
      data: { entries },
    } = await axios.get(host + `/expense/all/${PAGE_NO}`);
    console.log(entries);
    if (entries.length < 5) lastPage = true;
    else {
      lastPage = false;
    }
    if (PAGE_NO <= 1 || nxt == 0) {
      document.getElementById("prev").disabled = true;
    } else {
      document.getElementById("prev").disabled = false;
    }
    if (lastPage) {
      document.getElementById("next").disabled = true;
    } else {
      document.getElementById("next").disabled = false;
    }
    for (const obj of entries) appendExpense(obj);
    document.getElementById("pageno").textContent = `${
      lastPage ? "last" : PAGE_NO
    }`;
    overlay.style.display = "none";
  } catch (err) {
    console.error(err);
    overlay.style.display = "none";
  }
}

async function updateLeaderboards() {
  try {
    const res = await axios.get(host + "/leaderboards");
    leaderboardsBody.innerHTML = "";
    console.log(res.data);
    for (let i = 1; i <= res.data.result.length; i++) {
      if (res.data.result[i - 1].totalExpense === 0) continue;
      const obj = {
        rank: i,
        name: res.data.result[i - 1]["name"],
        totalExpenses: res.data.result[i - 1].totalExpense,
      };
      appendToLeaderboards(obj);
    }
  } catch (err) {
    console.error(err);
  }
}

function appendToLeaderboards({ rank, name, totalExpenses }) {
  const tr = document.createElement("tr");
  const th = document.createElement("th");
  th.setAttribute("scope", "row");
  th.classList.add("w-25");
  th.textContent = rank;

  const tdName = document.createElement("td");
  tdName.classList.add("w-50");
  tdName.textContent = name;

  const tdTotalExpenses = document.createElement("td");
  tdTotalExpenses.classList.add("w-25");
  tdTotalExpenses.textContent = totalExpenses;

  tr.appendChild(th);
  tr.appendChild(tdName);
  tr.appendChild(tdTotalExpenses);

  leaderboardsBody.appendChild(tr);
}

function appendExpense({ _id, amount, description, category }) {
  const tr = document.createElement("tr");

  const tdId = document.createElement("td");
  tdId.setAttribute("class", "d-none");
  tdId.textContent = _id.toString();
  tr.appendChild(tdId);

  const tdCategory = document.createElement("td");
  tdCategory.setAttribute("class", "w-25");
  tdCategory.textContent = category;
  tr.appendChild(tdCategory);

  const tdDescription = document.createElement("td");
  tdDescription.setAttribute("class", "w-25");
  tdDescription.textContent = description;
  tr.appendChild(tdDescription);

  const tdAmount = document.createElement("td");
  tdAmount.setAttribute("class", "w-25");
  tdAmount.textContent = amount;
  tr.appendChild(tdAmount);

  const tdBtn = document.createElement("td");
  tdBtn.setAttribute("class", "w-25");
  tr.appendChild(tdBtn);

  const btnDelete = document.createElement("button");
  btnDelete.setAttribute("class", "btn btn-light");
  btnDelete.textContent = "Delete";
  btnDelete.onclick = deleteExpense;
  tdBtn.appendChild(btnDelete);

  expensesBody.appendChild(tr);
}

async function deleteExpense() {
  try {
    overlay.style.display = "block";
    const id = this.parentElement.parentElement.firstElementChild.textContent;
    const res = await axios.delete(host + "/expense/" + id);
    console.log(res);
    if (res.status === 201) {
      this.parentElement.parentElement.remove();
      await updateLeaderboards();
      overlay.style.display = "none";
    } else throw new Error(req.data.message);
  } catch (err) {
    overlay.style.display = "none";
  }
}

window.onload = async () => {
  try {
    await getExpenses(0);

    const res = await axios.get(host + "/premium");
    if (res.data.isPremiumUser) {
      document.getElementById("btnPremium").style.display = "none";
      document.querySelector("h1").textContent += "+";
      await updateLeaderboards();
    } else {
      document.getElementById("download").style.display = "none";
      document.querySelector(".lower").setAttribute("class", "d-none");
    }
    overlay.style.display = "none";
  } catch (err) {
    console.log(err);
    overlay.style.display = "none";
  }
};

async function postExpense() {
  const expense = {
    amount: amountField.value,
    description: descriptionField.value,
    category: categoryField.value,
  };
  try {
    overlay.style.display = "block";
    const res = await axios.post(host + "/expense", expense);
    if (res.status === 201) {
      expense.id = res.data.id;
      appendExpense(expense);
      descriptionField.value = "";
      categoryField.value = "";
      amountField.value = "";
      await updateLeaderboards();
      overlay.style.display = "none";
      //window.alert(res.data.message);
    } else throw new Error("res.data.message");
  } catch (err) {
    overlay.style.display = "none";
    //window.alert(err);
  }
}

async function next() {}

document.expenseForm.onsubmit = async (event) => {
  event.preventDefault();
  postExpense();
};

document.getElementById("btnPremium").onclick = async () => {
  try {
    const response = await axios.post(host + "/premium", {});

    const options = {
      key: response.data.key_id,
      order_id: response.data.order.id,
      handler: async function (response) {
        const res = await axios.put(host + "/premium", {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        });
        window.location.reload();
      },
    };
    const payment = new Razorpay(options);
    payment.open();
    payment.on("payment.failed", function (response) {
      console.log(response);
      alert("Something went wrong");
    });
  } catch (err) {}
};

async function download() {
  try {
    overlay.style.display = "block";
    const res = await axios.get(host + "/expense/download");
    overlay.style.display = "none";
    const { records, filename } = res.data;
    downloadJSON(records, filename);
  } catch (err) {
    overlay.style.display = "none";
    window.alert("Error");
  }
}

function downloadJSON(data, fileName) {
  const jsonData = JSON.stringify(data);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = fileName;
  downloadLink.click();

  // Cleanup
  URL.revokeObjectURL(url);
}
