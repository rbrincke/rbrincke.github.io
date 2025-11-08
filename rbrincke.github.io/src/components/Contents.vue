<script setup lang="ts">
import ArticleHeader from '@/components/article-header.vue';
import { articles } from '@/articles/list';
</script>

<template>
    <div>
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-8">
                    <ArticleHeader v-for="[id, article] of Object.entries(articles)" class="article" :title="article.title"
                        :date="article.date" :summary="article.summary"
                        :link="id" :tags="article.tags">
                    </ArticleHeader>
                </div>
            </div>
        </div>
    </div>

    <RouterView />
</template>

<style scoped lang="scss">
    .article {
        border-bottom-width: 1px;
        border-bottom-style: dashed;
        border-bottom-color: rgb(240, 240, 240);
        padding-top: 1rem;
        padding-bottom: 0.8rem;
    }
</style>
