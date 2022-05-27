import { serveHTML } from "../site";

export default (event) => {
	return event.respondWith(redirect(event));
};

async function redirect(event) {
	const cache = caches.default;
	const { request } = event;

	// Try to retrieve from cache.
	const cached = await cache.match(request);
	if (cached) return cached;

	const { pathname } = new URL(request.url);
	const slug = pathname.substring(1);

	const url = JSON.parse(await URLS.get(slug));

	if (url) {
		// Check if URL is protected
		if (url.protected) {
			return serveHTML(event, "unlock");
		}

		// Redirect client
		const redirres = Response.redirect(url.longUrl, 301);
		const response = new Response(redirres.body, redirres);

		// Cache
		response.headers.append("Cache-Control", "max-age=31536000");
		event.waitUntil(cache.put(request, response.clone()));

		return response;
	}

	return serveHTML(event, "404");
}
