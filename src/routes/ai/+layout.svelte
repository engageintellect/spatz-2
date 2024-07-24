<script lang="ts">
  import { page } from '$app/stores'
  const navigation = [
    {
      title: 'chat',
      href: '/ai/chat',
    },
    {
      title: 'a',
      href: '/ai/a',
    },
    {
      title: 'b',
      href: '/ai/b',
    },
    {
      title: 'c',
      href: '/ai/c',
    },
  ]
</script>

<div class="w-full h-full bg-base-100">
  <a href="/ai" class="text-7xl">ai</a>
</div>
<div class="divider bg-base-100" />
<div class="flex flex-col md:flex-row w-full h-full">
  <ul
    class="sticky md:top-16 menu w-full menu-horizontal z-10 gap-2 overflow-auto flex flex-nowrap md:menu-vertical bg-base-100 h-full md:w-40 md:rounded-box"
  >
    {#each navigation as navItem}
      <li>
        <a
          href={navItem.href}
          class="text-lg bg-base-200 {$page.url.pathname === navItem.href
            ? 'active hover:bg-neutral'
            : ''}">{navItem.title}</a
        >
      </li>
    {/each}
  </ul>
  <div class="w-full px-2">
    <slot />
  </div>
</div>
