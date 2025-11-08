<template>
    <div class="col-xs-12 col-lg-10 with-sidenotes">
        <h1 class="title">{{ article.title }}</h1>

        <div class="table-of-contents">
            <div style="text-transform: uppercase; font-size: 0.9rem; font-weight: bolder; margin-bottom: 0.75rem;">contents</div>
            <ul>
                <li v-for="v of index"><a :href="`#${v.id}`">{{ v.title }}</a></li>
            </ul>
        </div>

        <div class="meta">
            <font-awesome-icon :icon="['fas', 'calendar-alt']" /> <time :datetime="article.date">{{ article.date }}</time> in <font-awesome-icon :icon="['fas', 'tags']" /> {{ article.tags.join(', ') }}
        </div>

        <div ref="contents"><slot></slot></div>
    </div>
</template>

<script setup lang="ts">
import { findSections, type Section } from '@/components/autotoc';
import type { ArticleHeader } from '@/components/header';
import { onMounted, ref, useTemplateRef } from 'vue';

defineProps<{
    article: ArticleHeader
}>();

const root = useTemplateRef<HTMLElement>('contents');
const index = ref<Section[]>([]);

onMounted(() => {
    index.value = findSections(root.value as HTMLElement);
})
</script>

<style lang="scss" scoped>
.title {
    font-weight: bold;
    margin-bottom: 0;
    font-size: 2rem;
}

.meta {
    font-size: 0.875rem;
    color: #a9a9b3;
    margin-bottom: 4rem;
}

.with-sidenotes {
    padding-right: 200px;
}

.table-of-contents {
    float: right;
    margin-right: -200px;
    width: 180px;
    position: relative;
    transform: translateY(-1rem);
    border-left: 3px solid #f5f5f5;
    padding-left: 0.5rem;
}

.table-of-contents ul {
    text-indent: -0.85rem;
    padding-left: .8rem;
    list-style: none;
    line-height: 1rem;
    font-size: 0.9rem;
}

*:is(.footer, .table-of-contents) a {
    text-decoration: none !important;
    color: #444 !important;
}

*:is(.footer, .table-of-contents) a:hover {
    color: #2d96bd !important;
}

.table-of-contents li {
    padding-top: 8px;
    display: list-item;
}
</style>
