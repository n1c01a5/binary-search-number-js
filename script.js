document.addEventListener("DOMContentLoaded", function () {
  const entryInput = document.getElementById("entryInput");
  const entryList = document.getElementById("entryList");
  let entries = [];

  fetch("http://localhost:3000/entries")
    .then((response) => response.json())
    .then((data) => {
      entries = data;
      renderEntries();
    })
    .catch((error) => {
      console.error("Error fetching entries:", error);
    });

  window.addEntry = function () {
    const entryValue = parseInt(entryInput.value, 10);

    if (isNaN(entryValue)) {
      alert("Please enter a valid number!");
      return;
    }

    fetch("http://localhost:3000/add-entry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ entry: entryValue }),
    })
      .then((response) => {
        if (response.status === 409) {
          throw new Error("Entry already exists");
        }
        return response.text();
      })
      .then((data) => {
        if (data === "Entry added successfully") {
          entries.push(entryValue);
          entries.sort((a, b) => a - b);
          renderEntries();
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  function findInsertionPosition(value, arr) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (arr[mid] === value) {
        return mid;
      } else if (arr[mid] < value) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return left;
  }

  function renderEntries() {
    entryList.innerHTML = "";
    for (const entry of entries) {
      const listItem = document.createElement("li");
      listItem.textContent = entry;
      entryList.appendChild(listItem);
    }
  }
});
