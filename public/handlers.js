export const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\\-\\_";
export const SLUG_REGEX = new RegExp(`^(?!.*(-|_)$)(?!^(-|_).*)^[${ALPHABET}]{3,}$`, "i");
export const URL_REGEX = new RegExp("(^http[s]?:/{2})|(^www)|(^/{1,2})", "i");
export const PASSWORD_REGEX = new RegExp("^(?!.*(-|_)$)(?=.*[a-zA-Z0-9]).{3,}$", "i");

export let validForm = false;
const urlError = document.querySelector("#url-error");
const slugError = document.querySelector("#slug-error");
const passwordError = document.querySelector("#password-error");

export const handler = (event) => {
	const textValue = event.target.value;

	validForm = false;

	// URL validation
	if (event.target.name === "url") {
		// Empty input field, hide error message
		if (!textValue.length) return urlError.classList.add("hidden");

		// Invalid URL stringm display error message
		if (!URL_REGEX.test(textValue)) {
			urlError.innerText = "Please provide a valid URL address";
			return urlError.classList.remove("hidden");
		}

		// Everything fine, proceed
		urlError.classList.add("hidden");
	}

	// Slug validation
	if (event.target.name === "slug") {
		// Empty input field, hide error message
		if (!textValue.length) return slugError.classList.add("hidden");

		// Invalid URL stringm display error message
		if (!SLUG_REGEX.test(textValue)) {
			slugError.innerText = "Please provide a valid slug expression";
			return slugError.classList.remove("hidden");
		}

		// Everything fine, proceed
		slugError.classList.add("hidden");
	}

	// Slug validation
	if (event.target.name === "password") {
		// Empty input field, hide error message
		if (!textValue.length) return passwordError.classList.add("hidden");

		// Invalid URL stringm display error message
		if (!PASSWORD_REGEX.test(textValue)) {
			passwordError.innerText = "Password should be at least 3 characters long";
			return passwordError.classList.remove("hidden");
		}

		// Everything fine, proceed
		passwordError.classList.add("hidden");
	}

	validForm = true;
};
