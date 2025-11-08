<template>
    <Article :article="article">
        <p>
            Most programmers are familiar with block-scoped languages like C and Java. In such languages a block defines a new
            scope, usually defined using braces. Variables are generally resolved by starting in the current scope and
            traversing outwards.
        </p>

        <p>
            Given that, the Python code below behaves exactly as you would expect it to.
        </p>

        <code-block language="python">
            x = 0

            def read():
                print(x)

            read()  # 0
        </code-block>

        <p>
            And even basic assignments look promising.
        </p>

        <code-block language="python">
            x = 0

            if x == 0:
                x = 1

            print(x)  # 1
        </code-block>

        <h2>Python scopes</h2>

        <p>
            But Python actually uses Local-External-Global-Builtin (LEGB) scopes. The first whiff of confusion comes when we
            attempt to modify a value from within a function.
        </p>

        <code-block language="python">
            x = 0

            def change():
                x = 10

            change()
            print(x)  # 0
        </code-block>

        <p>
            A function introduces a new scope. In <code>change</code>'s scope, <code>x = 10</code> both declares a variable and assigns
            a value to it, whereas the outer scope remains untouched.
        </p>

        <p>
            So why did it work for the <code>if</code>-statement? Because <code>if</code> does not actually introduce a new scope! This allows you to do
            things like define a new variable inside an <code>if</code>-statement that <i>seemingly</i> escapes its scope.
        </p>

        <code-block language="python">
        x = 0

        if x == 0:
            message = 'Zero'
        else:
            message = 'Not Zero'

        print(message)  # 'Zero'
        </code-block>

        <p>
            In fact, this can lead to surprising behavior when variables are implicitly deleted, like for <code>except</code> (which deletes <code>e</code>).
        </p>

        <code-block language="python">
        e = 'Excellent'

        try:
            raise RuntimeError()
        except RuntimeError as e:
            pass

        print(e)  # NameError: name 'e' is not defined.
        </code-block>

        <h2>Implicit declarations</h2>

        <p>
            Note the absence of keywords like <code>var</code>, <code>val</code>, <code>let</code> or an <code>:=</code> operator: variable declarations are implicit.
            That means Python must decide what you mean by <code>x = 10</code> – are you declaring a new variable and assigning the value 
            10, or are you changing the value of an existing variable?
        </p>

        <p>
            Our first examples and a familiarity with block scopes suggest the latter, but it is actually the former: <code>x = 10</code> means
            'declare <code>x</code> and assign 10' in a scope where <code>x</code> is not found, but means 'reassign <code>x</code> to 10' if <code>x</code> is present.
        </p>

        <p>
            Other languages with implicit declarations <a href="https://www.oreilly.com/library/view/javascript-the-definitive/0596101996/ch04.html">have different though no less confusing takes on this</a>.
        </p>

        <p>
            If you wanted to change the value of an outer variable, you can do so by indicating that the scope of <code>x</code> should not
            be the default <code>local</code> scope.
        </p>

        <code-block language="python">
        x = 0

        def change_global():
            global x
            x = 10

        change_global()
        print(x)  # 10
        </code-block>

        <p>
            But <code>global</code> of course means global, not outer.
        </p>

        <code-block language="python">
        x = 0

        def change_in_function():
            x = 0  # Untouched.

            def change_global():
                global x
                x = 10

            change_global()
            print(x)

        change_in_function()  # 0
        print(x)  # 10
        </code-block>

        <p>
            Changing the <code>x</code> in function requires <code>nonlocal</code>.
        </p>

        <code-block language="python">
        x = 0

        def change_in_function():
            x = 0  # Untouched.

            def change_global():
                nonlocal x
                x = 10

            change_global()
            print(x)

        change_in_function()  # 10
        print(x)  # 0
        </code-block>

        <p>
            But <code>nonlocal</code> does not work for <code>global</code> variables.
        </p>

        <code-block language="python">
        x = 0

        def change_in_function():
            def change_global():
                nonlocal x  # SyntaxError: no binding for nonlocal 'x' found. 
                x = 10

            change_global()
        </code-block>

        <h2>Declaration ordering</h2>

        <p>
            Python scoping knows another curious twist: declarations further down in the code are considered in scope. Combine
            that with implicit declarations, and things become much harder to reason about.
        </p>

        <code-block language="python">
        x = 0

        def print_outer():
            def read():
                print(x)

            x = 100

            read()

        print_outer()  # 100
        </code-block>

        <code-block language="python">
        x = 0

        def print_outer():
            def read():
                print(x)

            read()

            x = 100

        print_outer()  # NameError: free variable 'x' referenced before assignment in enclosing scope.
        </code-block>

        <p>
            In a longer block of code that inadvertently implicitly re-declares a variable many lines below the function
            that uses it, this is going to be hard to spot. It certainly is one reason to take the IDE's shadow warning much
            more seriously.
        </p>

        <p>
            Compare this with the Kotlin code below (in which <code>x</code> is also mutable – not that this matters).
        </p>

        <code-block language="kotlin">
            var x = 42

            fun print_outer() {
                fun read() {
                    println(x)
                }

                var x = 21

                read()
            }

            print_outer()  // 42
        </code-block>

        <p>
            While Python uses lexical scoping, this almost feels like a stretch of the term: when reading it from top to bottom it
            uses a variable <i>declared</i> after the function itself.
        </p>

        <p>None of this is very obvious or intuitive for non-Pythonistas.</p>

    </Article>
</template>

<script setup lang="ts">
import codeBlock from '@/components/code-block.vue';
import Article from '@/components/article.vue';
import { type ArticleHeader } from '@/components/header';
import { ref } from 'vue';
import { articles } from '@/articles/list';

const article = ref<ArticleHeader>(articles['snakebytes-scope']!);
</script>

<style lang="scss" scoped>
</style>
