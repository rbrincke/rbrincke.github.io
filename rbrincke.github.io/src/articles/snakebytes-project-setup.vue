<template>
    <Article :article="article">
        <p style="margin-top: 3rem">
            Python project configuration is not at all straightforward.
        </p>

        <p>
            When I first started working with Python a few months back I naively assumed project configuration was
            opinionated, something akin to Java and Maven. I tried following a few examples with varying degrees of
            success (most of which were really quite different!) – nothing really worked well.
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

        <code-block language="sh">
            python -m venv venv
        </code-block>

        <p>Before you do install anything into it, activate it using <code>source venv/bin/activate</code>.</p>

        <h2>Directory structure</h2>

        <p>Lots of people say not to put your source code in a <code>/src</code> directory, but to put it in a folder
            named after the
            project. I actually find that using <code>/src</code> works very well and provides a clear and consistent
            directory
            structure. Inside <code>/src</code> is often a single directory that contains the code.</p>

        <p>Our setup also makes use of a <code>/tests</code> directory containing an <code>/integration</code> and
            <code>/unit</code>
            subdirectory. Later, this separation allows us to easily run either unit tests, integration tests, or all
            tests.
        </p>

        <code-block language="plaintext">
            ├── src
            │ ├── projectname
            │ │ ├── __init__.py
            │ │ ├── code.py
            ├── tests
            │ ├── integration
            │ │ ├── __init__.py
            │ │ ├── test_code.py
            │ ├── unit
            │ │ ├── __init__.py
            │ │ ├── test_code.py
            ├── venv
            ├── pyproject.toml
            ├── requirements.txt
            └── .gitignore
        </code-block>

        <p>
            The build is described in <code>pyproject.toml</code> - it effectively replaces the legacy
            <code>setup.py</code>. Our configuration makes use of <a
                href="https://setuptools.pypa.io/en/latest/#">setuptools</a>, but other tools like poetry would work
            well too.
        </p>

        <code-block language="toml">
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
        </code-block>

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
            Open PyCharm, click <code>File » Open</code>, navigate into the directory containing your Git repository,
            and open it.
            PyCharm should automatically detect your virtual environment, shown at the bottom right (it'll say something
            like <code>Python 3.11 (projectname)</code>). If it does not, you can change it manually by clicking it and
            selecting
            your local virtual environment.
        </p>

        <p>
            For tests and imports to work well, PyCharm needs to be told where the key parts of the code are. Mark the
            <code>/src</code> directory (right-click the folder <code>» Mark Directory As</code>) as the
            <code>Source Root</code> (blue) and the <code>/tests</code>
            directory as the <code>Test Sources Root</code> (green).
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

        <code-block language="sh">
            source venv/bin/activate
            pip install -U pytest
        </code-block>

        <p>
            If you try to run the tests from the command line now, you'll end up with import errors. To fix this,
            perform an editable installation of your project.
        </p>

        <code-block language="sh">
            pip install --editable .
        </code-block>

        <p>You can now run the tests in three different ways:</p>

        <ul>
            <li><code>pytest tests/unit</code> to run the unit tests</li>
            <li><code>pytest tests/integration</code> to run the integration tests</li>
            <li><code>pytest tests</code> to run all tests</li>
        </ul>

        <h2>Bonus: Using your code in other projects</h2>

        <p>Because this is a proper project, it is easy to use this code from other projects.</p>

        <code-block language="sh">
            pip install git+https://github.com/user/project.git
        </code-block>
    </Article>
</template>

<script setup lang="ts">
import codeBlock from '@/components/code-block.vue';
import Article from '@/components/article.vue';
import { type ArticleHeader } from '@/components/header';
import { ref } from 'vue';
import { articles } from '@/articles/list';

const article = ref<ArticleHeader>(articles['snakebytes-project-setup']!);
</script>

<style lang="scss" scoped>
</style>
