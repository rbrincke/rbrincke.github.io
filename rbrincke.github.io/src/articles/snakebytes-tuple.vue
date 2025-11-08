<template>
    <Article :article="article">
        <p>
            Tuples are used to assign or return multiple values at once. <a href="https://www.w3schools.com/python/python_tuples.asp">Many</a> <a href="https://www.programiz.com/python-programming/tuple">introductory</a> <a href="https://www.programiz.com/python-programming/tuple">examples</a> use syntax involving
            both parentheses and commas.
        </p>

        <code-block language="python">
            tpl = ('chicken', 'egg', 42)

            for e in tpl:
                print(e)  # 'chicken', 'egg', '42'
        </code-block>

        <p>
            At first glance it certainly <i>looks</i> like we're invoking an unnamed function using parentheses, with the arguments
            separated by commas, just <a href="https://doc.rust-lang.org/rust-by-example/primitives/tuples.html">like in Rust</a>. The evidence
            mounts as we successfully construct an empty tuple.
        </p>

        <code-block language="python">
        tpl = ()

        for e in tpl:
            print(e)  # Nothing is printed.
        </code-block>

        <p>
            But alas – tuples are actually sequences. The code below does not do what you would expect it to<note :num="1">At least not what <i>I</i> expected it to do. It prints the string's characters because a Python string is iterable. I see how it could be, but I suspect more often than not passing a string into a function that accepts an iterable is a mistake.</note>: it prints the
            characters in the string 'chicken' because <code>v = ('chicken')</code> is identical to <code>v = 'chicken'</code>, and so it iterates
            over the characters instead. IDEs like PyCharm hint at removing the 'redundant parentheses'.
        </p>

        <code-block language="python">
        tpl = ('chicken')

        for e in tpl:
            print(e)  # 'c', 'h', 'i', 'c', 'k', 'e', 'n'
        </code-block>

        <p>
            It is actually the <code>,</code> that makes an expression a tuple.
        </p>

        <code-block language="python">
        tpl = 'chicken',

        for e in tpl:
            print(e)  # 'chicken'
        </code-block>

        <p>
            In fact, the parentheses are entirely optional, except in the case of an empty tuple.
        </p>
    </Article>
</template>

<script setup lang="ts">
import codeBlock from '@/components/code-block.vue';
import Article from '@/components/article.vue';
import { type ArticleHeader } from '@/components/header';
import { ref } from 'vue';
import { articles } from '@/articles/list';
import note from '@/components/note.vue';

const article = ref<ArticleHeader>(articles['snakebytes-tuple']!);
</script>

<style lang="scss" scoped>
</style>
