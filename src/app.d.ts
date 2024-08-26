// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			pb: import('pocketbase').default;
			user: import('pocketbase').default['authStore']['model'];
		}

		interface Comment {
			id: string;
			postId: string;
			content: string;
			author: string[];
			created: string;
			authorUsername: string;
			authorAvatar: string;
		}

		interface Post {
			id: string;
			author: string;
			comments: Comment[];
			content: string;
			collectionId: string;
			collectionName: string;
			created: string;
			updated: string;
			avatar: string;
			username: string;
			likes: string[];
			expand: {
				author: {
					username: string;
					avatar: string;
				};
			};
		}

		interface User {
			id: string;
			username: string;
		}

		interface Message {
			content: string;
			role: string;
		}

		declare module '*.png?enhanced' {
			const value: string;
			export default value;
		}

		declare module '*.jpg?enhanced' {
			const value: string;
			export default value;
		}

		declare module '*.jpeg?enhanced' {
			const value: string;
			export default value;
		}

		declare module '*.webp?enhanced' {
			const value: string;
			export default value;
		}

		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
