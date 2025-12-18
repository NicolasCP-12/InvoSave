document.addEventListener("DOMContentLoaded", async () => {
  const pb = new PocketBase("http://127.0.0.1:8090");

  // Checks if a user is currently logged in. If not, redirects to the login page.
  if (!pb.authStore.isValid) {
    window.location.href = "login2.html";
    return;
  }

  // Get references to all the necessary HTML elements from the page.
  const invoiceForm = document.getElementById("invoice-form");
  if (!invoiceForm) return;

  const productName = document.getElementById("product-name");
  const category = document.getElementById("category");
  const storeBought = document.getElementById("store-bought");
  const price = document.getElementById("price");
  const invoiceNumber = document.getElementById("invoice-number");
  const purchaseDate = document.getElementById("purchase-date");
  const warrantyMonths = document.getElementById("warranty-months");
  const invoiceFile = document.getElementById("invoice-file");
  const notesInput = document.getElementById("notes");

  const userSpan = document.querySelector("#user-span");
  const logoutButton = document.getElementById("logout-button");

  // Displays the logged-in user's email in the header.
  if (userSpan) {
    userSpan.textContent = pb.authStore.model.email;
  }

  // Handles the logout process when the logout button is clicked.
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      pb.authStore.clear();
      window.location.href = "login2.html";
    });
  }

  // Handles the submission of the new invoice form.
  invoiceForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = productName.value.trim();
    const categoryValue = category.value.trim().toLowerCase();
    const store = storeBought.value.trim();
    const priceValue = Number(price.value);
    const invNumber = invoiceNumber.value.trim();
    const warranty = Number(warrantyMonths.value);
    const notes = notesInput.value.trim();
    const file = invoiceFile.files[0];

    if (!name) {
      alert("Product name is required");
      return;
    }
    if (!categoryValue) {
      alert("Category is required");
      return;
    }
    if (!purchaseDate.value) {
      alert("Purchase date is required");
      return;
    }

    // Converts the purchase date to the required ISO format.
    const date = new Date(purchaseDate.value).toISOString();

    try {
      const data = new FormData();
      data.append("user", pb.authStore.model.id);
      data.append("title", name);
      data.append("category", categoryValue);
      data.append("store", store);
      data.append("invoice_number", invNumber || "");
      data.append("price", priceValue);
      data.append("purchase_date", date);
      data.append("warranty_months", Number.isFinite(warranty) ? warranty : 0);
      data.append("notes", notes);
      if (file) {
        data.append("invoice_file", file);
      }

      const newInv = await pb.collection("invoices").create(data);

      console.log("Invoice created:", newInv);
      alert("Invoice created successfully!");
      window.location.href = "main2.html";
    } catch (err) {
      console.error("Invoice creation failed:", err);
    }
  });
});
