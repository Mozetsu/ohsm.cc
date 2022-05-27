const URLRegex = /^(https?:\/\/[^\s\.]+\.[^\s]{2,})/i;
const inputHTML = document.querySelector(".text-box");
const submitBtn = document.querySelector(".submit-btn");
const urlContainer = document.querySelector(".url-container");

// truncate url if too long
const sliceLongUrl = (url, limit) => (url.length > limit ? `${url.slice(0, limit)}...` : url);

const addUrlHTML = ({ clicks, longUrl, urlSlug }) => `
			<tr class="odd:bg-gray-50">
				<td class="p-6">${clicks}</td>
				<td class="p-6">${sliceLongUrl(longUrl, 50)}</td>
				<td class="p-6">
					<a
						href="https://ohsm.cc/${urlSlug}"
						target="_blank"
						class="hover:underline hover:underline-offset-2 text-purple-600 font-medium"
					>
						<p>ohsm.cc/${urlSlug}</p>
					</a>
				</td>
			</tr>
`;

submitBtn.addEventListener("click", async (event) => {
	if (!inputHTML.value || !URLRegex.test(inputHTML.value)) return;

	const data = {
		url: inputHTML.value,
	};

	const response = await fetch("/api/create", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	inputHTML.value = "";

	const urlData = await response.json();

	urlContainer.insertAdjacentHTML("afterbegin", addUrlHTML(urlData));
});
