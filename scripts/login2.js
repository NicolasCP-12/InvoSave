document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const email = document.getElementById("email");
    const senha = document.getElementById("senha");

    function showMessage(input, message, type) {
        const inputContainer = input.parentElement.parentElement;
        const msgContainer = inputContainer.querySelector(".message-container");

        msgContainer.innerHTML = "";

        const msg = document.createElement("p");
        msg.textContent = message;
        msg.classList.add("text-sm");

        if (type === "error") {
            msg.classList.add("text-red-600");
            // Aplica borda vermelha ao container do input
            input.parentElement.classList.add("border-red-500");
            input.parentElement.classList.remove("border-black");
        } else {
            msg.classList.add("text-green-600");
            // Aplica borda verde ao container do input
            input.parentElement.classList.add("border-green-500");
            input.parentElement.classList.remove("border-black");
        }

        msgContainer.appendChild(msg);
    }

    function clearMessage(input) {
        const inputContainer = input.parentElement.parentElement;
        const msgContainer = inputContainer.querySelector(".message-container");
        msgContainer.innerHTML = "";
        input.parentElement.classList.remove("border-red-500", "border-green-500");
        input.parentElement.classList.add("border-black");
    }

    function validateEmail(value) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Previne o envio para testar a validação
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

        if (valid) {
            alert("Login válido! Formulário pode ser enviado.");
        }
    });

    email.addEventListener("input", () => clearMessage(email));
    senha.addEventListener("input", () => clearMessage(senha));
});