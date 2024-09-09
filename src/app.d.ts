// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			pb: import('pocketbase').default;
			user: import('pocketbase').default['authStore']['model'];
		}

		interface Post {
			id: string;
			author: string;
			authorId: string;
			comments: string[];
			content: string;
			collectionId: string;
			collectionName: string;
			created: string;
			updated: string;
			mentioning: string[];
			mentionedBy: string[];
			respondingTo: string[];
			authorUsername?: string; // Add this property
			authorAvatar?: string; // Add this property
			avatar?: string;
			username?: string;
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
