<script setup lang="ts">
import ArticleHeader from '@/components/article-header.vue';
import { articles } from '@/articles/list';
import { link } from '@/components/header';
import { computed } from 'vue';

const entries = computed(() =>
    Object.entries(articles).sort(([, a], [, b]) => b.date.localeCompare(a.date))
);
</script>

<template>
    <main class="landing-page">
        <section class="introduction">
            <h1>Writing about programming, mathematics, and the puzzles in between.</h1>
        </section>

        <section class="archive" aria-labelledby="archive-title">
            <h2 id="archive-title" class="section-label">Writing</h2>
            <div class="archive-list">
                <ArticleHeader
                    v-for="[id, article] of entries"
                    :key="id"
                    class="archive-item"
                    :title="article.title"
                    :date="article.date"
                    :summary="article.summary"
                    :link="link(id)"
                    :tags="article.tags"
                />
            </div>
        </section>
    </main>
</template>

<style scoped lang="scss">
    .landing-page {
        width: min(100% - 40px, 960px);
        margin: 0 auto;
    }

    .introduction {
        max-width: 780px;
        padding: 0.25rem 0 2.25rem;
    }

    .section-label {
        margin: 0;
        color: #777781;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }

    .introduction h1 {
        max-width: 760px;
        margin: 0;
        font-size: clamp(2.25rem, 5vw, 3.5rem);
        line-height: 1.06;
        letter-spacing: -0.055em;
        font-weight: 700;
    }

    .archive {
        padding-bottom: 1rem;
    }

    .archive > .section-label {
        padding-bottom: 0.75rem;
        border-bottom: 1px solid #e7e7e7;
    }

    .archive-list {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        column-gap: 40px;
    }

    .archive-item {
        border-bottom: 1px solid #ededed;
    }

    @media (max-width: 575px) {
        .landing-page {
            width: calc(100% - 40px);
        }

        .introduction {
            padding: 0.25rem 0 1.75rem;
        }

        .introduction h1 {
            font-size: 2.35rem;
        }

        .archive-list {
            grid-template-columns: 1fr;
        }
    }
</style>
