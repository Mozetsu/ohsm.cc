import { handler, validForm } from "./handlers.js";

const urlContainer = document.querySelector(".url-container");
const sliceLongUrl = (url, limit) => (url.length > limit ? `${url.slice(0, limit)}...` : url);
const addUrlHTML = ({ clicks, longUrl, urlSlug }) => ``;

document.querySelectorAll(".form-input").forEach((input) => {
	input.addEventListener("change", handler);
});

const form = document.querySelector("#form");
form.addEventListener("submit", async (event) => {
	event.preventDefault();

	if (!validForm) return;

	const URLData = {
		url: event.target.elements.url.value,
		slug: event.target.elements.slug.value,
		password: event.target.elements.password.value,
	};

	const response = await fetch("/api/create", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(URLData),
	});

	const parsedResponse = await response.json();

	// Check for errors
	if (parsedResponse.code) {
		return console.error(parsedResponse.code);
	}

	// Clear input fields
	event.target.elements.url.value = "";
	event.target.elements.slug.value = "";
	event.target.elements.password.value = "";

	console.log(parsedResponse);
});
