import type { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "$lib/schema";
import type { Action } from '@sveltejs/kit';
import { GOOGLE_FORM_URL, FORM_PAYLOAD_FIRST_NAME, FORM_PAYLOAD_LAST_NAME, FORM_PAYLOAD_EMAIL, FORM_PAYLOAD_PHONE, FORM_PAYLOAD_TYPE, FORM_PAYLOAD_LOCATION, FORM_PAYLOAD_MESSAGE } from "$env/static/private";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(formSchema)),
  };
};

export const actions: Actions = {
  default: (async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    // Prepare the payload for the Google Form
    const payload = new URLSearchParams({
      [FORM_PAYLOAD_FIRST_NAME]: form.data.firstName,
      [FORM_PAYLOAD_LAST_NAME]: form.data.lastName,
      [FORM_PAYLOAD_PHONE]: form.data.phone,
      [FORM_PAYLOAD_TYPE]: form.data.type,
      [FORM_PAYLOAD_LOCATION]: form.data.location,
      [FORM_PAYLOAD_MESSAGE]: form.data.message,
      [FORM_PAYLOAD_EMAIL]: form.data.email,
    });

    // Submit the form data to the Google Form
    const response = await fetch(`${GOOGLE_FORM_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
    });

    // Check if the form submission was successful
    if (!response.ok) {
      return fail(500, {
        form,
        error: 'Failed to submit the form. Please try again later.',
      });
    }

    return {
      form,
      success: 'Form submitted successfully!',
    };
  }) as Action,
};
