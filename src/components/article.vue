<template>
    <div class="col-xs-12 col-md-8 col-lg-7">
        <h1 class="title">{{ article.title }}</h1>

        <div class="meta">
            <font-awesome-icon :icon="['fas', 'calendar-alt']" /> <time :datetime="article.date">{{ article.date }}</time> in <font-awesome-icon :icon="['fas', 'tags']" /> {{ article.tags.join(', ') }}
        </div>

        <div ref="contents"><slot></slot></div>
    </div>

    <div class="col-xs-12 col-md-4 col-lg-3">
        <div class="table-of-contents" v-if="index.length > 0 && windowWidth > 767">
            <div style="text-transform: uppercase; font-size: 0.9rem; font-weight: bolder; margin-bottom: 0.75rem;">contents</div>
            <ul>
                <li v-for="v of index"><a :href="`#${v.id}`">{{ v.title }}</a></li>
            </ul>
        </div>

        <div v-for="note in footnotes" :key="note.id" class="note" :style="windowWidth <= 767 ? {} : { position: 'absolute', top: positions[note.id] + 'px', width: '200px' }">
            <sup style="font-weight: bold;">{{ note.id }}</sup> <component :is="note.content" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { findSections, type Section } from '@/components/autotoc';
import type { ArticleHeader } from '@/components/header';
import { nextTick, onMounted, provide, ref, useTemplateRef, type VNode } from 'vue';

defineProps<{
    article: ArticleHeader
}>();

interface Footnote {
    id: number;
    content: () => VNode[];
    element: HTMLElement;
}

const windowWidth = ref(0);

const footnotes = ref<Footnote[]>([]);
const positions = ref<number[]>([]);

function registerNote(content: () => VNode[], element: HTMLElement): number {
    const id = footnotes.value.length + 1;
    footnotes.value.push({ id, content, element });
    return id;
}

provide('registerNote', registerNote);

function onResize() {
    nextTick(() => {
        windowWidth.value = window.innerWidth;
        
        footnotes.value.forEach(note => {
            const rect = note.element.getBoundingClientRect();
            positions.value[note.id] = rect.top + window.scrollY;
        });
    });
}

const root = useTemplateRef<HTMLElement>('contents');
const index = ref<Section[]>([]);

onMounted(() => {
    index.value = findSections(root.value as HTMLElement);
    onResize();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize);
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
    margin-top: 1rem;
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

.note {
    font-size: .8rem;
    line-height: 110%;
    font-weight: 200;
}

.note a {
    color: red !important;
}
</style>
