import { json } from "@sveltejs/kit"
import { PUBLIC_GITHUB_STARS_URL } from "$env/static/public";

export async function GET() {
	const res = await fetch(PUBLIC_GITHUB_STARS_URL);
	const data = await res.json();
	
	return json(
		{
			stars: data.stargazers_count,
			issues: data.open_issues,
			forks: data.forks,

		}
	);
}