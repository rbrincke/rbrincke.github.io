<template>
    <Article :article="article">
        <p>
            Having functions be first-class citizens is incredibly handy, especially if a function carries state by closing over
            its environment. Python's closures are however late-binding, which requires extra care.
        </p>

        <h2>Late binding</h2>

        <p>
            In the example below a function <code>create_message</code> that closes over a variable <code>seconds_to_go</code> is defined inside a 
            <code>for</code>-loop and is subsequently added to a list. Then each function in the list is called and the resulting message
            is printed to the console.
        </p>

        <code-block language="python">
        countdown_messages = []

        for seconds_to_go in [3, 2, 1]:
            def create_message():
                return f'In {seconds_to_go}...'

            countdown_messages.append(create_message)

        for message in countdown_messages:
            print(message())
        </code-block>

        <p>
            This code prints 'In 1...' three times – a rather unspectacular countdown. The variable <code>seconds_to_go</code> is
            resolved when the function is <i>executed</i>, not when it is <i>created</i>. In other words, it binds late.
        </p>

        <h2>Binding values at function creation time</h2>

        <p>
            A simple way to fix this is through Python's default argument syntax. A default argument is simply a function argument
            that defaults to a predefined value if no arguments are provided. Default arguments in Python are evaluated at function
            <i>creation</i> time.
        </p>

        <p>
            By adding <code>seconds=seconds_to_go</code> to the <code>create_message</code> function, the argument <code>seconds</code> (which we do not provide)
            defaults to <code>seconds_to_go</code>. Because default arguments are evaluated and bound at creation time, <code>seconds</code> has
            whatever value <code>seconds_to_go</code> has when the function is created. The code now successfully counts down from 3 to 1.
        </p>

        <code-block language="python">
        countdown_messages = []

        for seconds_to_go in [3, 2, 1]:
            def create_message(seconds=seconds_to_go):
                return f'In {seconds}...'

            countdown_messages.append(create_message)

        for message in countdown_messages:
            print(message())
        </code-block>

        <h2>Default argument evaluation</h2>

        <p>
            Because default arguments are evaluated at function creation time, it allowed us to fix the late-binding problem above.
            It does however lead to counterintuitive behavior for default arguments, something first pointed out by
            a friend of mine.
        </p>

        <p>
            Consider the case below where milk and eggs are always added to our grocery list. Because we need nothing else, we
            create the list by simple calling <code>grocery_list()</code>, relying on the default argument <code>[]</code>.
        </p>

        <code-block language="python">
        def grocery_list(current=[]):
            current.append('1L Milk')
            current.append('6 Eggs')

            return current

        print(grocery_list())  # ['1L Milk', '6 Eggs']
        print(grocery_list())  # ['1L Milk', '6 Eggs', '1L Milk', '6 Eggs']
        </code-block>

        <p>
            The first call prints <code>['1L Milk', '6 Eggs']</code>, but the second call prints <code>['1L Milk', '6 Eggs', '1L Milk', '6 Eggs']</code>.
        </p>

        <p>
            Just like the closure code's default argument was evaluated at function creation time, the default argument expression
            <code>[]</code> is evaluated once when the function is created and then points to the same mutable list for every function call.
            This means that if the first call mutates the list, a subsequent call will observe those changes.
        </p>

        <p>
            While immutable default arguments (like integers) are safe to use, mutable default arguments are not and should rely on a
            workaround using <code>None</code> instead.
        </p>

        <code-block language="python">
        def grocery_list(current=None):
            if current is None:
                current = []

            current.append('1L Milk')
            current.append('6 Eggs')

            return current

        print(grocery_list())  # ['1L Milk', '6 Eggs']
        print(grocery_list())  # ['1L Milk', '6 Eggs']
        </code-block>

        <p>
            Note that IDEs like PyCharm warn us about this in simple cases.
        </p>
    </Article>
</template>

<script setup lang="ts">
import codeBlock from '@/components/code-block.vue';
import Article from '@/components/article.vue';
import { type ArticleHeader } from '@/components/header';
import { ref } from 'vue';
import { articles } from '@/articles/list';

const article = ref<ArticleHeader>(articles['snakebytes-closure-late-binding']!);
</script>

<style lang="scss" scoped>
</style>
