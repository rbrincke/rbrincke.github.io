<template>
    <Article :article="article">
        <p>
            In Python, enums are simple classes that extend the <code>enum.Enum</code> class and in which enum variants appear as class members.
        </p>

        <code-block language="python">
        from enum import Enum

        class Names(Enum):
            Homer = 'Homer'
            Marge = 'Marge'
        </code-block>

        <p>
            The assignment associates the enum variant with a value, in this case a string. Extending the <code>Enum</code> class gives
            you the variant's <code>name</code> and its <code>value</code> as properties out of the box. It also implements an iterator, so you can get
            the enum's variants via an expression such as <code>set(Names)</code>.
        </p>

        <p>
            I'd argue that the use of assigned values is somewhat confusing for those coming from other languages. For starters,
            variants with the same value serve as aliases and are considered equal to one another.
        </p>

        <code-block language="python">
        from enum import Enum

        class Names(Enum):
            Homer = 'Homer'
            Marge = 'Marge'
            Homey = 'Homer'

        print(Names.Homer is Names.Homey)  # True
        print(len(Names))  # 2
        </code-block>

        <p>
            This is surprising and feels like it could lead to unintended consequences. Python offers a few ways out: annotate the
            class <code>@unique</code>, or use <code>auto()</code> to set the value to equal the variant's name.
        </p>

        <p>
            Additionally, the assigned values syntax bears a resemblance to enums in C, where an enum <i>is</i> an integer type. Despite
            the assignment of a value seemingly suggesting that this is like assigning a string to a variable, that is not the case.
        </p>

        <code-block language="python">
        from enum import Enum

        class Names(Enum):
            Homer = 'Homer'
            Marge = 'Marge'

        print(Names.Homer == 'Homer')  # False

        def print_name(name: str):
            print(name)

        print_name(Names.Homer)  # Type error
        </code-block>

        <p>
            There is however a way to make it behave precisely like this.
        </p>

        <code-block language="python">
        from enum import Enum

        class Names(str, Enum):
            Homer = 'Homer'
            Marge = 'Marge'

        print(Names.Homer == 'Homer')  # True

        def print_name(name: str):
            print(name)

        print_name(Names.Homer)  # 'Names.Homer' (note this is not just 'Homer')
        </code-block>

        <p>
            By adding the mix-in <code>str</code>, <code>Names.Homer</code> is now also a string <code>'Homer'</code>. In fact, the string is constructed via a call
            to <code>str</code>'s <code>__init__</code> method using the argument <code>'Homer'</code>. If you're looking for string-like enum, use <code>StrEnum</code>.
        </p>

        <p>
            This opens the door to more sophisticated enums where multiple arguments are provided as a tuple.
        </p>

        <code-block language="python">
        from enum import Enum

        class FullName:
            def __init__(self, first, last):
                self.first = first
                self.last = last

        class Names(FullName, Enum):
            Homer = "Homer", "Simpson"  # Tuple.
            Marge = "Marge", "Simpson"

        def print_name(name: FullName):
            print(f'{name.last}, {name.first}')

        print_name(Names.Homer)  # Simpson, Homer
        </code-block>

        <p>
            Try adding <code>Bart = "Bart"</code>: you'll get an error "missing 1 required positional argument: 'last'".
        </p>

        <p>
            Of course, your properties cannot be named <code>name</code> or <code>value</code> because <code>Enum</code> already defines those.
        </p>
    </Article>
</template>

<script setup lang="ts">
import codeBlock from '@/components/code-block.vue';
import Article from '@/components/article.vue';
import { type ArticleHeader } from '@/components/header';
import { ref } from 'vue';
import { articles } from '@/articles/list';

const article = ref<ArticleHeader>(articles['snakebytes-enum']!);
</script>

<style lang="scss" scoped>
</style>
