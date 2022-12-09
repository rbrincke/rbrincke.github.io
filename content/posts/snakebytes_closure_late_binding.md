---
title: "Snake bytes: Python's late binding for closures"
date: 2022-12-09T08:03:17+01:00
categories: ["Snakebytes"]
tags: ["Python", "closure", "programming"]
---

Python's closures are late-binding, but can be made to bind early with the help of default arguments.

<!--more-->

Having functions be first-class citizens is incredibly handy, especially if a function carries state by closing over
its environment. Python's closures are however late-binding, which requires extra care.

## Late binding

In the example below a function `create_message` that closes over a variable `seconds_to_go` is defined inside a 
`for`-loop and is subsequently added to a list. Then each function in the list is called and the resulting message
is printed to the console.

```python
countdown_messages = []

for seconds_to_go in [3, 2, 1]:
    def create_message():
        return f'In {seconds_to_go}...'

    countdown_messages.append(create_message)

for message in countdown_messages:
    print(message())
```

This code prints 'In 1...' three times - a rather unspectacular countdown. The variable `seconds_to_go` is
resolved when the function is _executed_, not when it is _created_. In other words, it binds late.

## Binding values at function creation time

A simple way to fix this is through Python's default argument syntax. A default argument is simply a function argument
that defaults to a predefined value if no arguments are provided. Default arguments in Python are evaluated at function
_creation_ time.

By adding `seconds=seconds_to_go` to the `create_message` function, the argument `seconds` (which we do not provide)
defaults to `seconds_to_go`. Because default arguments are evaluated and bound at creation time, `seconds` has
whatever value `seconds_to_go` has when the function is created. The code now successfully counts down from 3 to 1.

```python
countdown_messages = []

for seconds_to_go in [3, 2, 1]:
    def create_message(seconds=seconds_to_go):
        return f'In {seconds}...'

    countdown_messages.append(create_message)

for message in countdown_messages:
    print(message())
```

## Default argument evaluation

Because default arguments are evaluated at function creation time, it allowed us to fix the late-binding problem above.
It does however lead to counterintuitive behavior for default arguments, something first pointed out by
a friend of mine.

Consider the case below where milk and eggs are always added to our grocery list. Because we need nothing else, we
create the list by simple calling `grocery_list()`, relying on the default argument `[]`.

```python
def grocery_list(current=[]):
    current.append('1L Milk')
    current.append('6 Eggs')

    return current

print(grocery_list())  # ['1L Milk', '6 Eggs']
print(grocery_list())  # ['1L Milk', '6 Eggs', '1L Milk', '6 Eggs']
```

The first call prints `['1L Milk', '6 Eggs']`, but the second call prints `['1L Milk', '6 Eggs', '1L Milk', '6 Eggs']`.

Just like the closure code's default argument was evaluated at function creation time, the default argument expression
`[]` is evaluated once when the function is created and then points to the same mutable list for every function call.
This means that if the first call mutates the list, a subsequent call will observe those changes.

While immutable default arguments (like integers) are safe to use, mutable default arguments are not and should rely on a
workaround using `None` instead.

```python
def grocery_list(current=None):
    if current is None:
        current = []

    current.append('1L Milk')
    current.append('6 Eggs')

    return current

print(grocery_list())  # ['1L Milk', '6 Eggs']
print(grocery_list())  # ['1L Milk', '6 Eggs']
```

Note that IDEs like PyCharm warn us about this in simple cases.
