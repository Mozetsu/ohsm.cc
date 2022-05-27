import { getCORSHeaders } from "./cors";
import { customAlphabet } from "nanoid";
import bcrypt from "bcryptjs";

export const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const extendedAlphabet = [...alphabet, "\\-", "\\_"].join("");
export const slugRegex = new RegExp(`(?!.*(-|_)$)(?!^(-|_).*)^[${extendedAlphabet}]{3,}$`, "i");
export const URLRegex = new RegExp("(^http[s]?:/{2})|(^www)|(^/{1,2})", "i");

const nanoid = customAlphabet(alphabet, 5);

const ErrorCodes = {
	BAD_REQ: { code: "BAD_REQ", message: "Bad Request." },
	BAD_URL: { code: "BAD_URL", message: "Provided URL is not a valid one." },
	BAD_SLUG: { code: "BAD_SLUG", message: "Slug is not in correct format." },
	BAD_PASSWORD: { code: "BAD_PASSWORD", message: "Incorrect password." },
	SLUG_NA: { code: "SLUG_NA", message: "Slug already in use." },
	NO_RECURSIVE: { code: "NO_RECURSIVE", message: "No recursive shortening." },
};

export default (event) => {
	event.respondWith(api(event));
};

async function api(event) {
	try {
		const { method } = event.request;
		const { pathname } = new URL(event.request.url);

		if (method === "GET" && pathname.split("/")[2] === "urls") {
			const { keys: data } = await URLS.list();
			return new Response(JSON.stringify(data) || []);
		}

		if (method === "POST" && pathname.split("/")[2] === "create") {
			return shortenUrl(event);
		}

		if (method === "POST" && pathname.split("/")[2] === "unlock") {
			return getUrl(event);
		}

		return new Response(JSON.stringify({ status: "online" }));
	} catch (e) {
		return new Response("Internal Error", { status: 500 });
	}
}

async function shortenUrl(event) {
	let body;
	try {
		body = await event.request.json();
	} catch (e) {
		return respond(event, event, ErrorCodes.BAD_REQ, 400);
	}

	const { url, slug, password } = body;

	// Url has to be valid url.
	if (!URLRegex.test(url)) {
		return respond(event, ErrorCodes.BAD_URL, 400);
	}

	// Extra security.
	try {
		const parsedURL = new URL(url);

		// No recursive business.
		if (parsedURL.hostname.endsWith("ohsm.cc")) {
			return respond(event, ErrorCodes.NO_RECURSIVE, 400);
		}
	} catch (e) {
		return respond(event, ErrorCodes.BAD_URL, 400);
	}

	// Slug has to be in base62 + _ + -, if provided.
	// Slug cannot start or end with -, _
	if (slug && !slugRegex.test(slug)) {
		return respond(event, ErrorCodes.BAD_SLUG, 400);
	}

	// Generate short link if slug not provided.
	const urlSlug = slug || nanoid();

	// Does url exist?
	const UrlExists = await URLS.get(urlSlug);

	if (UrlExists) {
		if (slug) {
			return respond(event, ErrorCodes.SLUG_NA, 400);
		}

		// Try again.
		return shortenUrl(event);
	}

	const shortUrl = {
		clicks: 0,
		urlSlug,
		protected: password ? true : false,
		password: password ? hashPassword(password) : null,
		longUrl: url,
		shortUrl: `ohsm.cc/${urlSlug}`,
		createdAt: Date.now(),
	};

	// Everyting is ok.
	await URLS.put(urlSlug, JSON.stringify(shortUrl));

	return respond(event, shortUrl);
}

function hashPassword(passwordString) {
	return bcrypt.hashSync(passwordString, 8);
}

function isValidPassword(passwordString, hash) {
	return bcrypt.compareSync(passwordString, hash);
}

async function getUrl(event) {
	let body;
	try {
		body = await event.request.json();
	} catch (e) {
		return respond(event, ErrorCodes.BAD_REQ, 400);
	}

	const { slug, password } = body;

	const url = JSON.parse(await URLS.get(slug));

	if (!isValidPassword(password, url.password)) {
		return respond(event, ErrorCodes.BAD_PASSWORD, 400);
	}

	return respond(event, url.longUrl);
}

function respond(event, data = {}, status = 200, headers = {}) {
	headers = { ...getCORSHeaders(event), ...headers };
	return new Response(JSON.stringify(data), { status, headers });
}
