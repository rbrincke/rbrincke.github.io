---
title: "Snake bytes: Python's tuple syntax"
date: 2022-11-12T19:21:02+01:00
lastmod: 2022-11-17T07:57:45+01:00
categories: ["Snakebytes"]
tags: ["Python", "tuple", "programming"]
---

Python's tuple syntax surprisingly relies on a combination of commas and parentheses.

<!--more-->

Tuples are used to assign or return multiple values at once. [Many](https://www.w3schools.com/python/python_tuples.asp) [introductory](https://www.programiz.com/python-programming/tuple) [examples](https://www.programiz.com/python-programming/tuple) use syntax involving
both parentheses and commas.

```python
tpl = ('chicken', 'egg', 42)

for e in tpl:
    print(e)  # 'chicken', 'egg', '42'
```

At first glance it certainly _looks_ like we're invoking an unnamed function using parentheses, with the arguments
separated by commas, just [like in Rust](https://doc.rust-lang.org/rust-by-example/primitives/tuples.html). The evidence
mounts as we successfully construct an empty tuple.

```python
tpl = ()

for e in tpl:
    print(e)  # Nothing is printed.
```

But alas - tuples are actually sequences. The code below does not do what you would expect it to{{< sidenote >}}At least not what _I_ expected it to do.\
\
It prints the string's characters because a Python string is iterable. I see how it could be, but I suspect more often than not passing a string into a function that accepts an iterable is a mistake.{{< /sidenote >}}: it prints the
characters in the string 'chicken' because `v = ('chicken')` is identical to `v = 'chicken'`, and so it iterates
over the characters instead. IDEs like PyCharm hint at removing the 'redundant parentheses'.

```python
tpl = ('chicken')

for e in tpl:
    print(e)  # 'c', 'h', 'i', 'c', 'k', 'e', 'n'
```

It is actually the `,` that makes an expression a tuple.

```python
tpl = 'chicken',

for e in tpl:
    print(e)  # 'chicken'
```

In fact, the parentheses are entirely optional, except in the case of an empty tuple.
