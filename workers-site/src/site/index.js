import { getAssetFromKV } from "@cloudflare/kv-asset-handler";

export default (event) => {
	try {
		event.respondWith(handleStaticRequest(event));
	} catch (e) {
		event.respondWith(new Response("Internal Error", { status: 500 }));
	}
};

async function handleStaticRequest(event) {
	let options = {};

	try {
		const page = await getAssetFromKV(event, options);

		// allow headers to be altered
		const response = new Response(page.body, page);

		response.headers.set("X-XSS-Protection", "1; mode=block");
		response.headers.set("X-Content-Type-Options", "nosniff");
		response.headers.set("X-Frame-Options", "DENY");
		response.headers.set("Referrer-Policy", "unsafe-url");

		return response;
	} catch (error) {
		try {
			let notFoundResponse = await getAssetFromKV(event, {
				mapRequestToAsset: (req) => new Request(`${new URL(req.url).origin}/404.html`, req),
			});

			return new Response(notFoundResponse.body, { ...notFoundResponse, status: 404 });
		} catch (e) {}
		return new Response(error.message || error.toString(), { status: 500 });
	}
}

export async function serveHTML(event, filename) {
	const notFoundResponse = await getAssetFromKV(event, {
		mapRequestToAsset: (req) => new Request(`${new URL(req.url).origin}/${filename}.html`, req),
	});

	return new Response(notFoundResponse.body, {
		...notFoundResponse,
		status: 404,
	});
}
