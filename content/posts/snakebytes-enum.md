---
title: "Snake bytes: Python's enum"
date: 2022-11-14T20:04:36+01:00
categories: ["Snakebytes"]
tags: ["Python", "enum", "programming"]
---

Python's enums tripped me up on my first encounter mostly because of the value assignment syntax.

<!--more-->

In Python, enums are simple classes that extend the `enum.Enum` class and in which enum variants appear as class members.

```python
from enum import Enum

class Names(Enum):
    Homer = 'Homer'
    Marge = 'Marge'
```

The assignment associates the enum variant with a value, in this case a string. Extending the `Enum` class gives
you the variant's `name` and its `value` as properties out of the box. It also implements an iterator, so you can get
the enum's variants via an expression such as `set(Names)`.

I'd argue that the use of assigned values is somewhat confusing for those coming from other languages. For starters,
variants with the same value serve as aliases and are considered equal to one another.

```python
from enum import Enum

class Names(Enum):
    Homer = 'Homer'
    Marge = 'Marge'
    Homey = 'Homer'

print(Names.Homer is Names.Homey)  # True
print(len(Names))  # 2
```

This is surprising and feels like it could lead to unintended consequences. Python offers a few ways out: annotate the
class `@unique`, or use `auto()` to set the value to equal the variant's name.

Additionally, the assigned values syntax bears a resemblance to enums in C, where an enum _is_ an integer type. Despite
the assignment of a value seemingly suggesting that this is like assigning a string to a variable, that is not the case.

```python
from enum import Enum

class Names(Enum):
    Homer = 'Homer'
    Marge = 'Marge'

print(Names.Homer == 'Homer')  # False

def print_name(name: str):
    print(name)

print_name(Names.Homer)  # Type error
```

There is however a way to make it behave precisely like this.

```python
from enum import Enum

class Names(str, Enum):
    Homer = 'Homer'
    Marge = 'Marge'

print(Names.Homer == 'Homer')  # True

def print_name(name: str):
    print(name)

print_name(Names.Homer)  # 'Names.Homer' (note this is not just 'Homer')
```

By adding the mix-in `str`, `Names.Homer` is now also a string `'Homer'`. In fact, the string is constructed via a call
to `str`'s `__init__` method using the argument `'Homer'`. Multiple arguments are provided as a tuple.

```python
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
```

Try adding `Bart = "Bart"`: you'll get an error "missing 1 required positional argument: 'last'".

Of course, your properties cannot be named `name` or `value` because `Enum` already defines those.
