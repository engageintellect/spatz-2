import type { Admin, Record } from 'pocketbase'
import { writable } from 'svelte/store'

export const currentUser = writable<Record | Admin | null>()

export const welcomeMessage = writable<boolean>(true)
