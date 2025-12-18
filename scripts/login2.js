document.addEventListener("DOMContentLoaded", () => {
  const pb = new PocketBase("http://127.0.0.1:8090");

  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // Displays a message (error or success) next to an input field.
  function showMessage(input, message, type) {
    const inputContainer = input.parentElement.parentElement;
    const msgContainer = inputContainer.querySelector(".message-container");

    msgContainer.innerHTML = "";

    const msg = document.createElement("p");
    msg.textContent = message;
    msg.classList.add("text-sm");

    if (type === "error") {
      msg.classList.add("text-red-600");
      input.parentElement.classList.add("border-red-500");
      input.parentElement.classList.remove("border-black");
    } else {
      msg.classList.add("text-green-600");
      input.parentElement.classList.add("border-green-500");
      input.parentElement.classList.remove("border-black");
    }

    msgContainer.appendChild(msg);
  }

  // Clears any message displayed next to an input field.
  function clearMessage(input) {
    const inputContainer = input.parentElement.parentElement;
    const msgContainer = inputContainer.querySelector(".message-container");
    msgContainer.innerHTML = "";
    input.parentElement.classList.remove("border-red-500", "border-green-500");
    input.parentElement.classList.add("border-black");
  }

  // Validates an email address format using a regular expression. Prevent multiple @
  function validateEmail(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  }

  // Handles the login form submission.
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let valid = true;

    // Validates the email and password inputs.
    if (emailInput.value.trim() === "") {
      showMessage(emailInput, "Email is required.", "error");
      valid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      showMessage(emailInput, "Invalid email format.", "error");
      valid = false;
    } else {
      clearMessage(emailInput);
    }

    if (passwordInput.value.trim() === "") {
      showMessage(passwordInput, "Password is required.", "error");
      valid = false;
    } else {
      clearMessage(passwordInput);
    }

    if (valid) {
      try {
        const authData = await pb
          .collection("users")
          .authWithPassword(emailInput.value, passwordInput.value);

        window.location.href = "main2.html";
      } catch (error) {
        showMessage(emailInput, "Invalid email or password.", "error");
        showMessage(passwordInput, "Invalid email or password.", "error");
      }
    }
  });

  // Clears validation messages in real-time as the user types.
  emailInput.addEventListener("input", () => clearMessage(emailInput));
  passwordInput.addEventListener("input", () => clearMessage(passwordInput));
});
