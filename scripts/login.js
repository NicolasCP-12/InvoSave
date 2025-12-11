document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const email = document.getElementById("email");
    const senha = document.getElementById("senha");

    function showMessage(input, message, type) {
        const msgContainer = input.nextElementSibling;

        msgContainer.innerHTML = "";
        msgContainer.classList.remove("text-red-600", "text-green-600");

        input.classList.remove("border-red-500", "border-green-500");

        const msg = document.createElement("p");
        msg.textContent = message;
        msg.classList.add("text-sm", "mt-0");

        if (type === "error") {
            msg.classList.add("text-red-600");
            input.classList.add("border-red-500");
        } else {
            msg.classList.add("text-green-600");
            input.classList.add("border-green-500");
        }

        msgContainer.appendChild(msg);
    }

    function clearMessage(input) {
        const msgContainer = input.nextElementSibling;
        msgContainer.innerHTML = "";
        input.classList.remove("border-red-500", "border-green-500");
    }

    function validateEmail(value) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    }

    form.addEventListener("submit", (e) => {
        let valid = true;

        if (email.value.trim() === "") {
            showMessage(email, "O email é obrigatório.", "error");
            valid = false;
        } else if (!validateEmail(email.value.trim())) {
            showMessage(email, "Formato de email inválido.", "error");
            valid = false;
        } else {
            showMessage(email, "Email válido ✔", "success");
        }

        if (senha.value.trim() === "") {
            showMessage(senha, "A password é obrigatória.", "error");
            valid = false;
        } else if (senha.value.length < 6) {
            showMessage(senha, "A password deve ter pelo menos 6 caracteres.", "error");
            valid = false;
        } else {
            showMessage(senha, "Password válida ✔", "success");
        }

        if (!valid) e.preventDefault();
    });

    email.addEventListener("input", () => clearMessage(email));
    senha.addEventListener("input", () => clearMessage(senha));
});
