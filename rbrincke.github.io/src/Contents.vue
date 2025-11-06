<script setup lang="ts">
import ArticleHeader from './components/article-header.vue';
import { articles } from './contents';
</script>

<template>
    <div>
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-8">
                    <ArticleHeader v-for="article in articles" class="article" :title="article.title"
                        :category="article.category" :date="article.date" :summary="article.summary"
                        :link="article.link" :tags="article.tags">
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
