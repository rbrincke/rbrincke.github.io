---
title: "Snake bytes: Python's self"
date: 2022-11-17T07:13:58+01:00
categories: ["Snakebytes"]
tags: ["Python", "self", "programming"]
---

The scope of Python's `self` includes class variables.

<!--more-->

In Python, the first argument passed to a class method automatically refers to the class instance. This parameter is
typically called `self`, but ultimately that is just a convention.

```python
class Example:
    def __init__(self):
        self.x = 42

print(Example().x)  # 42
```

Python also supports class variables: these are variables that are associated with the class itself rather than
an instance thereof.

```python
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
```

## `self` and class variables

As one would expect, the expression `self.x` in the `get()` method refers to the class _instance_ variable. To those
mostly familiar with Java or Kotlin it may however be surprising that the `x` defined on the class is _also_ in scope
when using `self`.

```python
class Example:
    x = 21

    def get(self):
        return self.x

e = Example()
print(e.x)  # 21
print(Example.x)  # 21
print(e.get())  # 21
```

Compare this to the Kotlin code below, where `this.x` and `this.y` always refer to the _instance_ variables.

```kotlin
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
```

Combine this with Python's [implicit variable declarations](../snakebytes-scope) and the result may not end up as
expected, demonstrated below using two very similar looking `add` methods.

```python
class Example:
    values = [0]

    def add1(self, new):
        self.values = self.values + [new]

    def add2(self, new):
        self.values += [new]
```

In `add1`, `self.values = ...` creates a new _instance_ variable `values`. It now shadows the class variable `values`,
which is left untouched.

```python
e = Example()
e.add1(1)

print(e.values)  # [0, 1]
print(Example.values)  # [0]
```

Conversely `add2` mutates the _class_ variable `self.values`.

```python
e = Example()
e.add2(1)

print(e.values)  # [0, 1]
print(Example.values)  # [0, 1]
```

Note that a single initial call to `add1()` causes `add2()` to behave as expected because now `add2()` refers to the
brand-new instance variable created by `add1()`!
