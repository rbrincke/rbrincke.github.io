---
title: "Snakebytes: Project Setup"
date: 2023-07-05T07:37:46+02:00
categories: ["Snakebytes"]
tags: ["Python", "configuration", "programming"]
---

Python project configuration is not at all straightforward.

<!--more-->

When I first started working with Python a few months back I naively assumed project configuration was opinionated, something akin to Java and Maven. I tried following a few examples with varying degrees of success (most of which were really quite different!) -- nothing really worked well.

Python has been around for a long time, long enough for best practices and tooling to have changed. This means you're going to run into 10-year-old posts that are no longer relevant. Advice ranges from 'do whatever works' to modifying paths to accommodate specific scenarios.

We'll focus on a setup that works well from PyCharm, supports running tests from the command line, and allows us to use code in other projects.

The remainder of this write-up assumes a clean Git repository as a starting point.

## Virtual environments

You may have multiple Python projects using different dependencies and different versions of the same dependencies. Python supports the creation of virtual environments (venv) that allows you to keep these environments separate.

In the root of your Git repository, create a new virtual environment:

```commandline
python -m venv venv
```

Before you do install anything into it, activate it using `source venv/bin/activate`.

## Directory structure

Lots of people say not to put your source code in a `/src` directory, but to put it in a folder named after the project. I actually find that using `/src` works very well and provides a clear and consistent directory structure. Within it is a single directory that contains the code.

Our setup also makes use a `/tests` directory containing an `/integration` and `/unit` subdirectory. Later on this allows us to easily run either unit tests, integration tests, or all tests.

```markdown
├── src
│   ├── projectname
│   │   ├── __init__.py
│   │   ├── code.py
├── tests
│   ├── integration
│   │   ├── __init__.py
│   │   ├── test_code.py
│   ├── unit
│   │   ├── __init__.py
│   │   ├── test_code.py
├── venv
├── pyproject.toml
└── .gitignore
```

The build is described in `pyproject.toml` -- it effectively replaces the legacy `setup.py` that lots of posts talk about. Our configuration makes use of [setuptools](https://setuptools.pypa.io/en/latest/#), but other tools like poetry would work well too.

```toml
[build-system]
requires = ["setuptools"]
build-backend = "setuptools.build_meta"

[project]
name = "projectname"
authors = [
    {name = "Code Author", email = "author@codeauthor.com"},
]
version = "0.1"
description = "Project description."
requires-python = ">=3.11"
dependencies = []

[tool.setuptools.packages.find]
where = ["src"]
```

## PyCharm

We're going to want this to work well in an IDE too, our tool of choice is PyCharm Community.

Open PyCharm, click `File » Open`, navigate to the directory containing your Git repository (click the entire folder), and open it. PyCharm should automatically detect your virtual environment, shown at the bottom right. If it does not, you can change it manually by clicking it and selecting `venv/bin/python3` from your virtual environment.

For tests and imports to work well, PyCharm needs to be told where the key parts of the code are. Mark (right-click the folder `» Mark Directory As`) the `/src` directory as the `Source Root` (blue) and the `/tests` directory as the `Test Sources Root` (green).

At this point you should be able to run unit tests directly from the IDE and imports should work as expected.

## Running tests from the command line

To run tests from the command line we'll use [pytest](https://docs.pytest.org/en/7.4.x/) (which is compatible with the ubiquitous `unittest`). Pytest is simple, rich, provides clear test output, and supports junit XML reports.

Activate the virtual environment and install it.

```commandline
source venv/bin/activate
pip install -U pytest
```

If you try to run the tests now, you'll end up with import errors. To fix this, perform an [editable installation](https://setuptools.pypa.io/en/latest/userguide/development_mode.html) of your project.

```commandline
pip install --editable .
```

You can now run the tests in three different ways:

- `pytest tests/unit` to run the unit tests
- `pytest tests/integration` to run the integration tests
- `pytest tests` to run all tests

## Bonus: Using your code in other projects

Because this is a proper project, it is easy to use this code from other projects.

```commandline
pip install git+https://github.com/user/project.git
```
