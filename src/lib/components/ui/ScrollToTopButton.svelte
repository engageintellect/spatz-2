<script lang="ts">
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'
  import Icon from '@iconify/svelte'

  let showButton = false

  function checkScroll() {
    showButton = window.scrollY > 100
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  onMount(() => {
    window.addEventListener('scroll', checkScroll)
    return () => {
      window.removeEventListener('scroll', checkScroll)
    }
  })
</script>

{#if showButton}
  <button
    class="fixed bottom-5 shadow-lg btn btn-primary shadow-lg"
    on:click={scrollToTop}
    transition:fade={{ duration: 100 }}
  >
    <Icon icon="mdi-arrow-up" class="w-6 h-6" />
  </button>
{/if}
