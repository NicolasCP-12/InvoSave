document.addEventListener("DOMContentLoaded", () => {
  const pb = new PocketBase("http://127.0.0.1:8090");

  const form = document.getElementById("signupForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const togglePassword = document.getElementById("togglePassword");
  const toggleConfirmPassword = document.getElementById(
    "toggleConfirmPassword"
  );

  // Toggles the password input field between 'password' and 'text' type.
  if (togglePassword) {
    togglePassword.addEventListener("click", () => {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      togglePassword.textContent = type === "password" ? "👁️" : "🙈";
    });
  }

  // Toggles the confirm password input field between 'password' and 'text' type.
  if (toggleConfirmPassword) {
    toggleConfirmPassword.addEventListener("click", () => {
      const type =
        confirmPasswordInput.getAttribute("type") === "password"
          ? "text"
          : "password";
      confirmPasswordInput.setAttribute("type", type);
      toggleConfirmPassword.textContent = type === "password" ? "👁️" : "🙈";
    });
  }

  // Displays a message (error or success) next to an input field.
  function showMessage(input, message, type) {
    if (!input) return;

    const inputContainer = input.parentElement.parentElement;
    const msgContainer = inputContainer.querySelector(".message-container");

    if (!msgContainer) return;

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
    if (!input) return;

    const inputContainer = input.parentElement.parentElement;
    const msgContainer = inputContainer.querySelector(".message-container");

    if (msgContainer) {
      msgContainer.innerHTML = "";
    }

    input.parentElement.classList.remove("border-red-500", "border-green-500");
    input.parentElement.classList.add("border-black");
  }

  // Validates an email address format using a regular expression and prevents multiple @
  function validateEmail(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  }

  // Handles the signup form submission.
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let valid = true;

      // Validates the email input.
      if (!emailInput || emailInput.value.trim() === "") {
        showMessage(emailInput, "Email is required.", "error");
        valid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        showMessage(emailInput, "Invalid email format.", "error");
        valid = false;
      } else {
        showMessage(emailInput, "Valid email ✔", "success");
      }

      // Validates the password input.
      if (!passwordInput || passwordInput.value.trim() === "") {
        showMessage(passwordInput, "Password is required.", "error");
        valid = false;
      } else if (passwordInput.value.length < 8) {
        showMessage(
          passwordInput,
          "Password must be at least 8 characters long.",
          "error"
        );
        valid = false;
      } else {
        showMessage(passwordInput, "Valid password ✔", "success");
      }

      // Validates the confirm password input.
      if (!confirmPasswordInput || confirmPasswordInput.value.trim() === "") {
        showMessage(
          confirmPasswordInput,
          "Please confirm your password.",
          "error"
        );
        valid = false;
      } else if (confirmPasswordInput.value !== passwordInput.value) {
        showMessage(confirmPasswordInput, "Passwords do not match.", "error");
        valid = false;
      } else {
        showMessage(confirmPasswordInput, "Passwords match ✔", "success");
      }

      // If all inputs are valid, attempt to create the user.
      if (valid) {
        try {
          const data = {
            email: emailInput.value,
            emailVisibility: true,
            password: passwordInput.value,
            passwordConfirm: confirmPasswordInput.value,
          };

          const record = await pb.collection("users").create(data);

          await pb.collection("users").requestVerification(emailInput.value);

          await pb
            .collection("users")
            .authWithPassword(emailInput.value, passwordInput.value);

          window.location.href = "main2.html";
        } catch (error) {
          showMessage(
            emailInput,
            "Failed to create account. Email may already be in use.",
            "error"
          );
        }
      }
    });
  }

  // Clears validation messages in real-time as the user types.
  if (emailInput)
    emailInput.addEventListener("input", () => clearMessage(emailInput));
  if (passwordInput) {
    passwordInput.addEventListener("input", () => {
      clearMessage(passwordInput);
      clearMessage(confirmPasswordInput);
    });
  }
  if (confirmPasswordInput)
    confirmPasswordInput.addEventListener("input", () =>
      clearMessage(confirmPasswordInput)
    );
});
