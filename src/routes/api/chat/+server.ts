import { createOpenAI } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

// Create an OpenAI Provider instance
const openai = createOpenAI({
	apiKey: env.OPENAI_API_KEY ?? ''
});

export const POST: RequestHandler = async ({ request }) => {
	const { messages, customPrePrompt } = await request.json();

	// Log the custom pre-prompt and messages
	// console.log('Custom pre-prompt received on the server:', customPrePrompt);
	// console.log('Messages received on the server:', messages);

	const result = await streamText({
		model: openai('gpt-3.5-turbo'),
		messages: convertToCoreMessages([
			...(customPrePrompt ? [{ role: 'system', content: customPrePrompt }] : []),
			...messages
		]),
		temperature: 0.5,
		async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
			// console.log('Response Text:', text);
			// console.log('Tool Calls:', toolCalls);
			// console.log('Tool Results:', toolResults);
			// console.log('Usage:', usage);
			// console.log('Finish Reason:', finishReason);
		}
	});

	return result.toAIStreamResponse();
};
