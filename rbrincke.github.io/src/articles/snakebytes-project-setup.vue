<template>
    <div class="col-8">
        <h1 class="title">Snakebytes: Project Setup</h1>
        <div class="meta">
            <time datetime="2023-07-05">2023-07-05</time> in <a href="/">Snakebytes</a>
        </div>

        <p>
            Python project configuration is not at all straightforward.
        </p>

        <p>
            When I first started working with Python a few months back I naively assumed project configuration was
            opinionated, something akin to Java and Maven. I tried following a few examples with varying degrees of
            success (most of which were really quite different!) - nothing really worked well.
        </p>

        <p>
            Python has been around for a long time, long enough for best practices and tooling to have changed. This
            means you're going to run into 10-year-old posts that are no longer relevant. Advice ranges from 'do
            whatever works' to modifying paths to accommodate specific scenarios.
        </p>

        <p>
            We'll focus on a setup that works well from PyCharm, supports running tests from the command line, and
            allows us to use code in other projects.
        </p>

        <h2>Virtual environments</h2>

        <p>
            You may have multiple Python projects using different dependencies and different versions of the same
            dependencies. Python supports the creation of virtual environments (venv) that allows you to keep these
            environments separate.
        </p>

        <p>In the root of your Git repository, create a new virtual environment:</p>

        <pre class="code-block"><code>
python -m venv venv
        </code></pre>

        <p>Before you do install anything into it, activate it using <code>source venv/bin/activate</code>.</p>

        <h2>Directory structure</h2>

        <p>Lots of people say not to put your source code in a /src directory, but to put it in a folder named after the
            project. I actually find that using /src works very well and provides a clear and consistent directory
            structure. Inside /src is often a single directory that contains the code.</p>

        <p>Our setup also makes use of a <code>/tests</code> directory containing an /integration and /unit
            subdirectory. Later, this separation allows us to easily run either unit tests, integration tests, or all
            tests.
        </p>

        <pre class="code-block"><code>
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
├── requirements.txt
└── .gitignore
        </code></pre>

        <p>
            The build is described in <code>pyproject.toml</code> - it effectively replaces the legacy
            <code>setup.py</code>. Our configuration makes use of <a
                href="https://setuptools.pypa.io/en/latest/#">setuptools</a>, but other tools like poetry would work
            well too.
        </p>

        <pre class="code-block"><code>
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
dynamic = ["dependencies"]

[tool.setuptools.packages.find]
where = ["src"]

[tool.setuptools.dynamic]
dependencies = {file = ["requirements.txt"]}
        </code></pre>

        <p>
            It is possible to list dependencies directly, but we have chosen to make them dynamic by means of
            <code>requirements.txt</code>. Using <code>requirements.txt</code> to manage the project's dependencies
            means the setup plays nice with IDEs such as PyCharm, which will detect missing entries and point out
            version inconsistencies.
        </p>

        <h2>PyCharm</h2>

        <p>
            We're going to want this to work well in an IDE too, our tool of choice is PyCharm Community.
        </p>

        <p>
            Open PyCharm, click File » Open, navigate into the directory containing your Git repository, and open it.
            PyCharm should automatically detect your virtual environment, shown at the bottom right (it'll say something
            like Python 3.11 (projectname)). If it does not, you can change it manually by clicking it and selecting
            your local virtual environment.
        </p>

        <p>
            For tests and imports to work well, PyCharm needs to be told where the key parts of the code are. Mark the
            /src directory (right-click the folder » Mark Directory As) as the Source Root (blue) and the /tests
            directory as the Test Sources Root (green).
        </p>

        <p>
            At this point you should be able to run unit tests directly from the IDE and imports should work as
            expected.
        </p>

        <h2>Running tests from the command line</h2>

        <p>
            To run tests from the command line we'll use pytest (which is compatible with the ubiquitous unittest).
            Pytest is simple, rich, provides clear test output, and supports junit XML reports.
        </p>

        <p>
            Activate the virtual environment and install it.
        </p>

        <pre class="code-block"><code>
source venv/bin/activate
pip install -U pytest
        </code></pre>

        <p>
            If you try to run the tests from the command line now, you'll end up with import errors. To fix this,
            perform an editable installation of your project.
        </p>

        <pre class="code-block"><code>
pip install --editable .
        </code></pre>

        <p>You can now run the tests in three different ways:</p>

        <ul>
            <li>pytest tests/unit to run the unit tests</li>
            <li>pytest tests/integration to run the integration tests</li>
            <li>pytest tests to run all tests</li>
        </ul>

        <h2>Bonus: Using your code in other projects</h2>

        <p>Because this is a proper project, it is easy to use this code from other projects.</p>

        <pre class="code-block"><code>
pip install git+https://github.com/user/project.git
        </code></pre>
    </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
  .title {
    font-weight: bold;
    margin-bottom: 0;
  }

  .meta {
    font-size: 0.875rem;
    color: #a9a9b3;
    margin-bottom: 1rem;
  }

  code {
    color: #E74C3C !important;
  }

  .code-block {
    color: #E74C3C;
    background-color: #f5f5f5;
    padding-left: 1em;
  }
</style>
