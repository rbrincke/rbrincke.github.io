<script setup lang="ts">
defineProps<{
  title: string
  date: string
  summary: string
  link: string
  tags: string[]
}>();
</script>

<template>
  <div>
    <h5 class="title">
      <a :href="link">{{ title }}</a>
    </h5>

    <div class="meta">
      <time :datetime="date">{{ date }}</time>
    </div>

    <p class="summary">{{ summary }}</p>

    <div class="row footer">
      <div class="col"><a :href="link">Read More</a></div>
      <div class="col text-end">
        <font-awesome-icon :icon="['fas', 'tags']" /> {{ tags.join(', ') }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scopes>
  .title {
    font-weight: bold;
    margin-bottom: 0;
  }

  .title a {
    color: #222;
    text-decoration: none;
  }

  .title a:hover {
    color: #2d96bd;
  }

  .meta {
    font-size: 0.875rem;
    color: #a9a9b3;
  }

  .summary {
    margin-top: 0.4rem;
    margin-bottom: 0.4rem;
    color: #a9a9b3;
  }

  .footer {
    font-size: 0.875rem;
  }

  *:is(.footer, .meta) a {
    text-decoration: none;
    color: #2d96bd;
  }

  *:is(.footer, .meta) a:hover {
    color: #ef3982;
  }
</style>
