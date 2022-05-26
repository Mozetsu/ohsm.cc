export const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const extendedAlphabet = [...alphabet, "\\-", "\\_"].join("");
export const slugRegex = new RegExp(`(?!.*(-|_)$)(?!^(-|_).*)^[${extendedAlphabet}]{3,}$`, "i");
const URLRegex = /^(https?:\/\/[^\s\.]+\.[^\s]{2,})/i;

export default (event) => {
	event.respondWith(api(event));
};

async function api(event) {
	try {
		const { method } = event.request;
		const { pathname } = new URL(event.request.url);

		if (method === "GET" && pathname.includes("/find")) {
			// const { keys: data } = await URLS.list();
			return new Response(JSON.stringify({ find: true }));
		}

		if (method === "GET" && pathname.endsWith("/urls")) {
			const { keys: data } = await URLS.list();
			return new Response(JSON.stringify(data) || []);
		}

		return new Response(JSON.stringify({ status: "online" }));
	} catch (e) {
		return new Response("Internal Error", { status: 500 });
	}
}
