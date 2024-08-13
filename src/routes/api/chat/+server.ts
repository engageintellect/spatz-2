import { createOpenAI } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

// Create an OpenAI Provider instance
const openai = createOpenAI({
	apiKey: env.OPENAI_API_KEY ?? ''
});

export const POST: RequestHandler = async ({ request }) => {
	// Extract the `messages` from the body of the request
	const { messages } = await request.json();

	// Define a pre-prompt or context as a system message
	const prePrompt = {
		role: 'system',
		content: 'You are an AI assistant named spatz.'
	};

	// Prepend the pre-prompt to the messages array
	const updatedMessages = [
		prePrompt,
		...messages.map((message: { content: string; role: string }) => ({
			content: message.content,
			role: message.role
		}))
	];

	// Call the language model with streaming
	const result = await streamText({
		model: openai('gpt-3.5-turbo'),
		messages: convertToCoreMessages(updatedMessages),
		temperature: 0.5,
		async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
			// Implement your own logic here, e.g., for storing messages
			// or recording token usage
		}
	});

	// Respond with the stream
	return result.toAIStreamResponse();
};
