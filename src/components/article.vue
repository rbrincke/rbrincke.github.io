<template>
    <div ref="marginColumn" class="margin-column col-xs-12 col-md-3 col-lg-3 order-2 order-md-1">
        <div class="table-of-contents" v-if="index.length > 0 && windowWidth > 767">
            <div class="contents-heading">Contents</div>
            <ul>
                <li v-for="v of index" :key="v.id"><a :href="`#${v.id}`">{{ v.title }}</a></li>
            </ul>
        </div>

        <div v-for="note in footnotes" :key="note.id" class="note" :style="windowWidth <= 767 ? {} : { position: 'absolute', top: positions[note.id] + 'px', width: '100%' }">
            <sup class="note-number">{{ note.id }}</sup> <component :is="note.content" />
        </div>
    </div>

    <div ref="contents" class="article-column col-xs-12 col-md-8 col-lg-7 order-1 order-md-2">
        <h1 class="title">{{ article.title }}</h1>

        <div class="meta">
            <font-awesome-icon :icon="['fas', 'calendar-alt']" /> <time :datetime="article.date">{{ article.date }}</time> in <font-awesome-icon :icon="['fas', 'tags']" /> {{ article.tags.join(', ') }}
        </div>

        <div><slot></slot></div>
    </div>
</template>

<script setup lang="ts">
import { findSections, type Section } from '@/components/autotoc';
import type { ArticleHeader } from '@/components/header';
import { nextTick, onMounted, onUnmounted, provide, ref, useTemplateRef, type VNode } from 'vue';

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
        const marginRect = marginColumn.value?.getBoundingClientRect();

        footnotes.value.forEach(note => {
            const rect = note.element.getBoundingClientRect();
            positions.value[note.id] = marginRect ? rect.top - marginRect.top : rect.top + window.scrollY;
        });
    });
}

const root = useTemplateRef<HTMLElement>('contents');
const marginColumn = useTemplateRef<HTMLElement>('marginColumn');
const index = ref<Section[]>([]);

onMounted(() => {
    index.value = findSections(root.value as HTMLElement);
    onResize();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize);
})

onUnmounted(() => {
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onResize);
})
</script>

<style lang="scss" scoped>
    .article-column {
        min-width: 0;
        font-size: 1.075rem;
        line-height: 1.72;
    }

    .margin-column {
        position: relative;
    }

    .title {
        font-weight: 700;
        margin-bottom: 0;
        font-size: clamp(2.25rem, 5vw, 3.25rem);
        line-height: 1.08;
        letter-spacing: -0.045em;
    }

    .meta {
        font-size: 0.875rem;
        color: #a9a9b3;
        margin: 1.25rem 0 3.25rem;
    }

    .with-sidenotes {
        padding-right: 200px;
    }

    .table-of-contents {
        margin-top: 0.25rem;
        padding-right: 1.75rem;
    }

    .contents-heading {
        margin-bottom: 0.75rem;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #777781;
    }

    .table-of-contents ul {
        padding: 0;
        margin: 0;
        list-style: none;
        line-height: 1.35;
        font-size: 0.82rem;
    }

    *:is(.footer, .table-of-contents) a {
        text-decoration: none;
        color: #444;
    }

    *:is(.footer, .table-of-contents) a:hover {
        color: #2d96bd;
    }

    .table-of-contents li {
        padding: 7px 0;
        display: list-item;
    }

    .note {
        padding-right: 1.75rem;
        font-size: 0.78rem;
        line-height: 1.45;
        color: #6d6d76;
    }

    .note-number {
        margin-right: 0.25rem;
        color: #1d1d1f;
        font-weight: 700;
    }

    @media (max-width: 767px) {
        .article-column {
            font-size: 1.02rem;
            line-height: 1.68;
        }

        .margin-column {
            margin-top: 2.5rem;
        }

        .title {
            font-size: 2.25rem;
        }

        .note {
            position: static !important;
            margin: 1.25rem 0;
            padding: 1rem 0;
            border-top: 1px solid #ededed;
            width: 100% !important;
        }
    }
</style>
