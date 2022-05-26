import { getAssetFromKV } from "@cloudflare/kv-asset-handler";

export default (event) => {
	try {
		event.respondWith(handleStaticRequest(event));
	} catch (e) {
		event.respondWith(new Response("Internal Error", { status: 500 }));
	}
};

async function handleStaticRequest(event) {
	try {
		return await getAssetFromKV(event);
	} catch (error) {
		return new Response(error.message || error.toString(), { status: 500 });
	}
}
