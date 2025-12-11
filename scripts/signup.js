document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signupForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener("click", () => {
            const type = password.getAttribute("type") === "password" ? "text" : "password";
            password.setAttribute("type", type);
            togglePassword.textContent = type === "password" ? "👁️" : "🙈";
        });
    }

    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener("click", () => {
            const type = confirmPassword.getAttribute("type") === "password" ? "text" : "password";
            confirmPassword.setAttribute("type", type);
            toggleConfirmPassword.textContent = type === "password" ? "👁️" : "🙈";
        });
    }

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

    function validateEmail(value) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    }

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            let valid = true;

            // Email validation
            if (!email || email.value.trim() === "") {
                showMessage(email, "O email é obrigatório.", "error");
                valid = false;
            } else if (!validateEmail(email.value.trim())) {
                showMessage(email, "Formato de email inválido.", "error");
                valid = false;
            } else {
                showMessage(email, "Email válido ✔", "success");
            }

            // Password validation
            if (!password || password.value.trim() === "") {
                showMessage(password, "A password é obrigatória.", "error");
                valid = false;
            } else if (password.value.length < 6) {
                showMessage(password, "A password deve ter pelo menos 6 caracteres.", "error");
                valid = false;
            } else {
                showMessage(password, "Password válida ✔", "success");
            }

            // Confirm password validation
            if (!confirmPassword || confirmPassword.value.trim() === "") {
                showMessage(confirmPassword, "Confirme a password.", "error");
                valid = false;
            } else if (confirmPassword.value !== password.value) {
                showMessage(confirmPassword, "As passwords não coincidem.", "error");
                valid = false;
            } else {
                showMessage(confirmPassword, "Passwords coincidem ✔", "success");
            }

            if (valid) {
                alert("Registo válido! Formulário pode ser enviado.");
                // form.submit(); // Descomente para enviar o formulário
            }
        });
    }

    // Clear messages on input
    if (email) email.addEventListener("input", () => clearMessage(email));
    if (password) {
        password.addEventListener("input", () => {
            clearMessage(password);
            clearMessage(confirmPassword);
        });
    }
    if (confirmPassword) confirmPassword.addEventListener("input", () => clearMessage(confirmPassword));
});