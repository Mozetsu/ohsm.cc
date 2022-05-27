import { handler, validForm } from "./handlers.js";

document.querySelectorAll(".form-input").forEach((input) => {
	input.addEventListener("change", handler);
});

const form = document.querySelector("#form");
form.addEventListener("submit", async (event) => {
	event.preventDefault();

	if (!validForm) return;

	const URLData = {
		slug: window.location.pathname.substring(1),
		password: event.target.elements.password.value,
	};

	const response = await fetch("/api/unlock", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(URLData),
	});

	const url = await response.json();

	if (url.code === "BAD_PASSWORD") throw "Invalid password.";

	location.href = url;
});
