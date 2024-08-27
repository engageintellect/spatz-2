/**
 * @param {HTMLElement} node
 * @param {import('@stripe/stripe-js').StripeElementType} type
 * @param {import('@stripe/stripe-js').StripeElements} elements
 * @param {<EventKey extends string>(type: EventKey, detail?: any) => void} dispatch
 * @param {import('@stripe/stripe-js').StripeElementsOptions} options
 *
 * @returns {import('@stripe/stripe-js').StripeElementBase}
 */
export function mount(node: any, type: any, elements: any, dispatch: any, options = {}) {
	const element = elements.create(type, options);

	element.mount(node);
	element.on('change', (e: any) => dispatch('change', e));
	element.on('ready', (e: any) => dispatch('ready', e));
	element.on('focus', (e: any) => dispatch('focus', e));
	element.on('blur', (e: any) => dispatch('blur', e));
	element.on('escape', (e: any) => dispatch('escape', e));
	element.on('click', (e: any) => dispatch('click', e));
	element.on('loaderror', (e: any) => dispatch('loaderror', e));
	element.on('loaderstart', (e: any) => dispatch('loaderstart', e));
	element.on('networkschange', (e: any) => dispatch('networkschange', e));

	return element;
}

export const isServer = typeof window === 'undefined';

/**
 * @param {import('@stripe/stripe-js').Stripe} stripe
 * @returns {void}
 */
export function register(stripe: any) {
	if (!isServer) {
		return stripe.registerAppInfo({
			name: 'svelte-stripe-js',
			url: 'https://svelte-stripe-js.vercel.app'
		});
	}
}
