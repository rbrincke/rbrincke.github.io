---
title: "Snake bytes: Python's enum"
date: 2022-11-12T19:21:02+01:00
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
    print(e)  # 'chicken', 'egg'
```

At first glance it certainly _looks_ like we're invoking an unnamed function using parentheses, with the arguments
separated by commas, just [like in Rust](https://doc.rust-lang.org/rust-by-example/primitives/tuples.html). The evidence
mounts as we successfully construct an empty tuple.

```python
tpl = ()

for e in tpl:
    print(e)  # Nothing is printed.
```

But alas - tuples are actually sequences. The code below does not do what you would expect it to: it prints the
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
