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
  <article class="article-header">
    <h5 class="title">
      <a :href="link">{{ title }}</a>
    </h5>

    <p class="summary">{{ summary }}</p>

    <div class="footer">
      <time :datetime="date">{{ date }}</time>
      <span class="tag-list">
        <font-awesome-icon :icon="['fas', 'tags']" />
        {{ tags.join(', ') }}
      </span>
      <RouterLink :to="link" class="read-link">Read article <span aria-hidden="true">→</span></RouterLink>
    </div>
  </article>
</template>

<style lang="scss" scoped>
  .article-header {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 1.25rem 0 1.35rem;
  }

  .title {
    margin: 0 0 0.35rem;
    font-size: 1.35rem;
    line-height: 1.25;
    letter-spacing: -0.025em;
    font-weight: 700;
  }

  .title a {
    color: #1d1d1f;
    text-decoration: none;
  }

  .title a:hover {
    color: #2d96bd;
  }

  .summary {
    max-width: 680px;
    margin: 0 0 0.9rem;
    color: #777781;
    line-height: 1.55;
  }

  .footer {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 18px;
    align-items: center;
    margin-top: auto;
    color: #777781;
    font-size: 0.78rem;
  }

  .tag-list {
    white-space: nowrap;
  }

  .read-link {
    color: #1d1d1f;
    font-weight: 600;
    text-decoration: none;
  }

  .read-link:hover {
    color: #ef3982;
  }

  @media (max-width: 575px) {
    .footer {
      grid-template-columns: 1fr auto;
    }

    .tag-list {
      display: none;
    }
  }
</style>
