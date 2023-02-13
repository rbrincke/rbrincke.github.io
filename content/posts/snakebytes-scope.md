---
title: "Snake bytes: Python's take on scope"
date: 2022-11-10T21:53:36+01:00
categories: ["Snakebytes"]
tags: ["Python", "scope", "programming"]
---

Python's take on scopes is quite different from that in other languages.

<!--more-->

Most programmers are familiar with block-scoped languages like C and Java. In such languages a block defines a new
scope, usually defined using braces. Variables are generally resolved by starting in the current scope and
traversing outwards.

Given that, the Python code below behaves exactly as you would expect it to.

```python
x = 0

def read():
    print(x)

read()  # 0
```

And even basic assignments look promising.

```python
x = 0

if x == 0:
    x = 1

print(x)  # 1
```

## Python scopes

But Python actually uses Local-External-Global-Builtin (LEGB) scopes. The first scent of confusion arises when we
attempt to modify a value from within a function.

```python
x = 0

def change():
    x = 10

change()
print(x)  # 0
```

A function introduces a new scope. In `change`'s scope, `x = 10` both declares a variable and assigns
a value to it, whereas the outer scope remains untouched.

So why did it work for the `if`-statement? Because `if` does not actually introduce a new scope! This allows you to do
things like define a new variable inside an `if`-statement that _seemingly_ escapes its scope.

```python
x = 0

if x == 0:
    message = 'Zero'
else:
    message = 'Not Zero'

print(message)  # 'Zero'
```

In fact, this can lead to surprising behavior when variables are implicitly deleted, like for `except` (which deletes
`e`).

```python
e = 'Excellent'

try:
    raise RuntimeError()
except RuntimeError as e:
    pass

print(e)  # NameError: name 'e' is not defined.
```

## Implicit declarations

Note the absence of keywords like `var`, `val`, `let` or an `:=` operator: variable declarations are implicit.
That means Python must decide what you mean by `x = 10` - are you declaring a new variable and assigning the value 
10, or are you changing the value of an existing variable?

Our first examples and a familiarity with block scopes suggest the latter, but it is actually the former: `x = 10` means
'declare `x` and assign 10' in scope where `x` is not found, but means 'reassign `x` to 10' if `x` is present.

Other languages with implicit declarations
[have different though no less confusing takes on this](https://www.oreilly.com/library/view/javascript-the-definitive/0596101996/ch04.html).

If you wanted to change the value of an outer variable, you can do so by indicating that the scope of `x` should not
be the default `local` scope.

```python
x = 0

def change_global():
    global x
    x = 10

change_global()
print(x)  # 10
```

But `global` of course means global, not outer.

```python
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
```

Changing the `x` in function requires `nonlocal`.

```python
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
```

But `nonlocal` does not work for `global` variables.

```python
x = 0

def change_in_function():
    def change_global():
        nonlocal x  # SyntaxError: no binding for nonlocal 'x' found. 
        x = 10

    change_global()
```

## Declaration ordering

Python scoping knows another curious twist: declarations further down in the code are considered in scope. Combine
that with implicit declarations, and things become much harder to reason about.

```python
x = 0

def print_outer():
    def read():
        print(x)

    x = 100

    read()

print_outer()  # 100
```

```python
x = 0

def print_outer():
    def read():
        print(x)

    read()

    x = 100

print_outer()  # NameError: free variable 'x' referenced before assignment in enclosing scope.
```

In a longer block of code that inadvertently implicitly re-declares a variable many lines below the function
that uses it, this is going to be hard to spot. It certainly is one reason to take the IDE's shadow warning much
more seriously.

Compare this with the Kotlin code below (in which `x` is also mutable - not that this matters).

```kotlin
    var x = 42

    fun print_outer() {
        fun read() {
            println(x)
        }

        var x = 21

        read()
    }

    print_outer()  # 42
```

While Python uses lexical scoping, this almost feels like a stretch of the term: when reading it from top to bottom it
uses a variable _declared_ after the function itself.

None of this is very obvious or intuitive for non-Pythonistas.
