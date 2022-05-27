import serveSite from "./src/site";
import serveAPI, { slugRegex } from "./src/api";
import redirect from "./src/redirect";

addEventListener("fetch", (event) => {
	const url = new URL(event.request.url);

	if (url.pathname.startsWith("/api")) return serveAPI(event);

	if (slugRegex.test(url.pathname.substring(1))) return redirect(event);

	serveSite(event);
});
