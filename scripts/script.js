// This script runs when the DOM is fully loaded.
document.addEventListener("DOMContentLoaded", async () => {
  const pb = new PocketBase("http://127.0.0.1:8090");

  const invoiceContainer = document.getElementById("invoice-container");
  const userSpan = document.querySelector("#user-span");
  const logoutButton = document.getElementById("logout-button");

  const metricActive = document.getElementById("metric-active");
  const metricExpiring = document.getElementById("metric-expiring");
  const metricExpired = document.getElementById("metric-expired");
  const metricTotal = document.getElementById("metric-total");

  const modal = document.getElementById("invoice-modal");
  const modalBody = document.getElementById("modal-body");
  const modalTitle = document.getElementById("modal-title");
  const closeModalButton = document.getElementById("modal-close-button");

  // Checks if a user is currently logged in. If not, redirects to the login page.
  if (!pb.authStore.isValid) {
    window.location.href = "login2.html";
    return;
  }

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

  // Calculates and updates the metric cards based on the fetched invoices.
  function updateMetrics(invoices) {
    let activeCount = 0;
    let expiringCount = 0;
    let expiredCount = 0;
    let totalValue = 0;

    invoices.forEach((invoice) => {
      const purchaseDate = new Date(invoice.purchase_date);
      const warrantyMonths = invoice.warranty_months;
      const expirationDate = new Date(purchaseDate);
      expirationDate.setMonth(expirationDate.getMonth() + warrantyMonths);
      const now = new Date();

      if (expirationDate < now) {
        expiredCount++;
      } else {
        activeCount++;
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(now.getDate() + 30);
        if (expirationDate <= thirtyDaysFromNow) {
          expiringCount++;
        }
        // Total value only includes invoices that have not expired.
        totalValue += invoice.price || 0;
      }
    });

    metricActive.textContent = activeCount;
    metricExpiring.textContent = expiringCount;
    metricExpired.textContent = expiredCount;
    metricTotal.textContent = `€${totalValue.toFixed(2)}`;
  }

  // Populates and opens the invoice preview modal with details of a specific invoice.
  function openModal(invoice) {
    modalTitle.textContent = invoice.title;

    // Gets the URL for the attached invoice file, if it exists.
    const fileUrl = invoice.invoice_file
      ? pb.files.getUrl(invoice, invoice.invoice_file)
      : "";
    const fileLinkHtml = fileUrl
      ? `<a href="${fileUrl}" target="_blank" class="text-blue-500 hover:underline">View Invoice File</a>`
      : "<span>Not available</span>";

    modalBody.innerHTML = `
            <div class="grid grid-cols-2 gap-4 text-lg">
                <div><strong class="font-bold">Category:</strong></div><div>${
                  invoice.category
                }</div>
                <div><strong class="font-bold">Store:</strong></div><div>${
                  invoice.store || "N/A"
                }</div>
                <div><strong class="font-bold">Price:</strong></div><div>€${invoice.price.toFixed(
                  2
                )}</div>
                <div><strong class="font-bold">Purchase Date:</strong></div><div>${new Date(
                  invoice.purchase_date
                ).toLocaleDateString()}</div>
                <div><strong class="font-bold">Warranty Months:</strong></div><div>${
                  invoice.warranty_months
                }</div>
                <div><strong class="font-bold">Warranty Expires:</strong></div><div>${new Date(
                  new Date(invoice.purchase_date).setMonth(
                    new Date(invoice.purchase_date).getMonth() +
                      invoice.warranty_months
                  )
                ).toLocaleDateString()}</div>
                <div><strong class="font-bold">Invoice Number:</strong></div><div>${
                  invoice.invoice_number || "N/A"
                }</div>
                <div><strong class="font-bold">Invoice File:</strong></div><div>${fileLinkHtml}</div>
                <div class="col-span-2"><strong class="font-bold">Notes:</strong></div>
                <div class="col-span-2">${
                  invoice.notes || "No notes provided."
                }</div>
            </div>
        `;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }

  closeModalButton.addEventListener("click", closeModal);

  // Adds event listener to the modal backdrop to close it when clicked.
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Event to open the modal when any invoice card is clicked.
  invoiceContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".invoice-card");
    if (card && card.dataset.invoice) {
      const invoiceData = JSON.parse(card.dataset.invoice);
      openModal(invoiceData);
    }
  });

  // Determines the warranty status of an invoice (Active, Expiring Soon, Expired).
  function getStatus(invoice) {
    const purchaseDate = new Date(invoice.purchase_date);
    const warrantyMonths = invoice.warranty_months;
    const expirationDate = new Date(purchaseDate);
    expirationDate.setMonth(expirationDate.getMonth() + warrantyMonths);
    const now = new Date();

    if (expirationDate < now) {
      return { text: "Expired", color: "red" };
    } else {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);
      if (expirationDate <= thirtyDaysFromNow) {
        return { text: "Expiring Soon", color: "yellow" };
      } else {
        return { text: "Active", color: "green" };
      }
    }
  }

  // Creates an HTML card element for a single invoice.
  function createInvoiceCard(invoice) {
    const card = document.createElement("div");
    card.className =
      "invoice-card bg-white border-[4px] border-black rounded-[14px] p-6 drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col justify-between cursor-pointer hover:scale-105 transition-transform";

    // Stores the full invoice object as a data attribute to be used by the modal.
    card.dataset.invoice = JSON.stringify(invoice);

    const status = getStatus(invoice);

    const fileUrl = invoice.invoice_file
      ? pb.files.getUrl(invoice, invoice.invoice_file)
      : "";
    const fileLinkHtml = fileUrl
      ? `<a href="${fileUrl}" target="_blank" class="text-blue-500 hover:underline">View File</a>`
      : "";

    // Fill the card's HTML with invoice details.
    card.innerHTML = `
            <div>
                <div class="flex justify-between items-start">
                    <h3 class="text-2xl font-black logo-text tracking-tight">${
                      invoice.title
                    }</h3>
                    <span class="text-sm font-bold px-3 py-1 rounded-full text-black" style="background-color: ${
                      status.color
                    };">${status.text}</span>
                </div>
                <p class="text-gray-600 font-medium mt-1">${
                  invoice.category
                }</p>
                <p class="text-gray-700 mt-2 truncate"><strong>Notes:</strong> ${
                  invoice.notes || ""
                }</p>
            </div>
            <div class="mt-6">
                <div class="flex justify-between items-center text-lg">
                    <span class="font-bold">Purchase Date:</span>
                    <span class="font-mono">${new Date(
                      invoice.purchase_date
                    ).toLocaleDateString()}</span>
                </div>
                <div class="flex justify-between items-center text-lg mt-2">
                    <span class="font-bold">Warranty Expires:</span>
                    <span class="font-mono">${new Date(
                      new Date(invoice.purchase_date).setMonth(
                        new Date(invoice.purchase_date).getMonth() +
                          invoice.warranty_months
                      )
                    ).toLocaleDateString()}</span>
                </div>
                <div class="flex justify-between items-center text-2xl font-black mt-4">
                    <span>Price:</span>
                    <span>€${invoice.price}</span>
                </div>
            </div>
        `;
    return card;
  }

  // Fetches all invoices for the current user and displays them on the page.
  async function loadInvoices() {
    try {
      const records = await pb.collection("invoices").getFullList({
        filter: `user = "${pb.authStore.model.id}"`,
        sort: "-purchase_date",
      });

      // Renders each invoice as a card.
      invoiceContainer.innerHTML = "";
      records.forEach((invoice) => {
        const card = createInvoiceCard(invoice);
        invoiceContainer.appendChild(card);
      });

      updateMetrics(records);
    } catch (error) {
      console.error("Failed to load invoices:", error);
      invoiceContainer.innerHTML = `<p class="text-red-500">Failed to load invoices. Make sure you are connected and the 'invoices' collection is set up correctly.</p>`;
    }
  }

  loadInvoices();
});
