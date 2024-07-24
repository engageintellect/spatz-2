<script lang="ts">
  import { PUBLIC_REPOSITORY_URL } from '$env/static/public'
  export let stars
  export let issues
  export let forks

  import Icon from '@iconify/svelte'
</script>

<div
  class="stats stats-vertical lg:stats-horizontal shadow-lg w-full border border-primary/[33%]"
>
  <a href={`${PUBLIC_REPOSITORY_URL}`} class="stat group">
    <div class="stat-title">Stars</div>
    <div class="flex items-center justify-between">
      <div class="stat-value">{stars || 0}</div>
      <div>
        <Icon
          icon="mdi:star"
          class="w-12 h-12 text-primary md:group-hover:scale-110 transition-all duration-300"
        />
      </div>
    </div>
    <div class="stat-desc">total stars</div>
  </a>

  <a href={`${PUBLIC_REPOSITORY_URL}/issues`} class="stat group">
    <div class="stat-title">Issues</div>
    <div class="flex items-center justify-between">
      <div class="stat-value">{issues || 0}</div>
      <div>
        <Icon
          icon="octicon:issue-opened-24"
          class="w-12 h-12 text-primary md:group-hover:scale-110 transition-all duration-300"
        />
      </div>
    </div>
    <div class="stat-desc">open issues</div>
  </a>

  <a href={`${PUBLIC_REPOSITORY_URL}`} class="stat group">
    <div class="stat-title">Forks</div>
    <div class="flex items-center justify-between">
      <div class="stat-value">{forks || 0}</div>

      <div>
        <Icon
          icon="carbon:fork"
          class="w-12 h-12 text-primary md:group-hover:scale-110 transition-all duration-300"
        />
      </div>
    </div>

    <div class="stat-desc">total forks</div>
  </a>
</div>
