import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { PUBLIC_OPENAI_MODEL } from '$env/static/public';
// You may want to replace the above with a static private env variable
// for dead-code elimination and build-time type-checking:
import { OPENAI_API_KEY } from '$env/static/private'
 
import type { RequestHandler } from './$types';

 
// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY || '',
});
 
export const POST = (async ({ request }) => {
  // Extract the `prompt` from the body of the request
  const { messages } = await request.json();
 
  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: PUBLIC_OPENAI_MODEL || 'gpt-3.5-turbo',
    stream: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages: messages.map((message: App.Message) => ({
      content: message.content,
      role: message.role,
    })),
  });
 
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}) satisfies RequestHandler;