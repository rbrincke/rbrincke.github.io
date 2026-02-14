<template>
    <Article :article="article">
        <p>
            My oldest son, age 8, has for a while been asking about building a game. Initial ambitions started at the level of Mario Kart, but I ultimately negotiated it down to a puzzle game for which he could provide his own art.
        </p>

        <p>
            He helped design the interface, its logic, difficulty levels, and suggested the timer functionality. With a few helpful flexbox assists from GitHub CoPilot, we managed to build it on a single Sunday morning. His little brother contributed another piece of art and
            eagerly play-tested the game after. Grandma tried it too, so it has been approved for ages 5 to 70.
        </p>
        
        <p>
            You can try it out by clicking <a href="/puzzle-game">here</a>.
        </p>
    </Article>
</template>

<script setup lang="ts">
import Article from '@/components/article.vue';
import { type ArticleHeader } from '@/components/header';
import { ref } from 'vue';
import { articles } from '@/articles/list';

const article = ref<ArticleHeader>(articles['programming-a-puzzle-game']!);
</script>

<style lang="scss" scoped>
</style>
