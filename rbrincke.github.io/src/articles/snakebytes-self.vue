<template>
    <Article :article="article">
        <p>
            In Python, the first argument passed to a class method automatically refers to the class instance. This parameter is
            typically called <code>self</code>, but ultimately that is just a convention.
        </p>

        <code-block language="python">
        class Example:
            def __init__(self):
                self.x = 42

        print(Example().x)  # 42
        </code-block>

        <p>
            Python also supports class variables: these are variables that are associated with the class itself rather than
            an instance thereof.
        </p>

        <code-block language="python">
        class Example:
            x = 21
            
            def __init__(self):
                self.x = 42
                
            def get(self):
                return self.x

        e = Example()
        print(e.x)  # 42
        print(Example.x)  # 21
        print(e.get())  # 42
        </code-block>

        <h2><code>self</code> and class variables</h2>

        <p>
            As one would expect, the expression <code>self.x</code> in the <code>get()</code> method refers to the class <i>instance</i> variable. To those
            mostly familiar with Java or Kotlin it may however be surprising that the <code>x</code> defined on the class is <i>also</i> in scope
            when using <code>self</code>.
        </p>

        <code-block language="python">
        class Example:
            x = 21

            def get(self):
                return self.x

        e = Example()
        print(e.x)  # 21
        print(Example.x)  # 21
        print(e.get())  # 21
        </code-block>

        <p>Compare this to the Kotlin code below, where <code>this.x</code> and <code>this.y</code> always refer to the <i>instance</i> variables.</p>

        <code-block language="kotlin">
        class Example {
            val x = 42

            fun getPlainX() = x  // 42
            fun getThisX() = this.x // 42

            fun getPlainY() = y // 21
            fun getThisY() = this.y // Compilation error.

            companion object {
                val x = 21
                val y = 21
            }
        }
        </code-block>

        <p>
            Combine this with Python's <a href="/snakebytes-scope">implicit variable declarations</a> and the result may not end up as
            expected, demonstrated below using two very similar looking <code>add</code> methods.
        </p>

        <code-block language="python">
        class Example:
            values = [0]

            def add1(self, new):
                self.values = self.values + [new]

            def add2(self, new):
                self.values += [new]
        </code-block>

        <p>
            In <code>add1</code>, <code>self.values = ...</code> creates a new <i>instance</i> variable <code>values</code>. It now shadows the class variable <code>values</code>,
            which is left untouched.
        </p>

        <code-block language="python">
        e = Example()
        e.add1(1)

        print(e.values)  # [0, 1]
        print(Example.values)  # [0]
        </code-block>

        <p>
            Conversely <code>add2</code> mutates the <i>class</i> variable <code>self.values</code>.
        </p>

        <code-block language="python">
        e = Example()
        e.add2(1)

        print(e.values)  # [0, 1]
        print(Example.values)  # [0, 1]
        </code-block>

        <p>
            Note that a single initial call to <code>add1()</code> causes <code>add2()</code> to behave as expected because now <code>add2()</code> refers to the
            brand-new instance variable created by <code>add1()</code>!
        </p>
    </Article>
</template>

<script setup lang="ts">
import codeBlock from '@/components/code-block.vue';
import Article from '@/components/article.vue';
import { type ArticleHeader } from '@/components/header';
import { ref } from 'vue';
import { articles } from '@/articles/list';

const article = ref<ArticleHeader>(articles['snakebytes-self']!);
</script>

<style lang="scss" scoped>
</style>
