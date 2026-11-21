<template>
    <main class="about-page">
        <h1 class="title">About</h1>

        <div class="about-content">
            <p>
                You've stumbled on a page that veers somewhere between blog and notebook.
            </p>

            <p>
                I write things down when I find them interesting, or when I'm in the process
                of learning something new. Almost invariably the topic is computing,
                mathematics, or finance.
            </p>
        </div>
    </main>
</template>

<style lang="scss" scoped>
    .about-page {
        width: min(100% - 40px, 960px);
        margin: 0 auto;
    }

    .title {
        margin: 0 0 1.75rem;
        font-size: clamp(2.25rem, 5vw, 3.5rem);
        line-height: 1.06;
        letter-spacing: -0.055em;
        font-weight: 700;
    }

    .about-content {
        max-width: 680px;
        font-size: 1.075rem;
        line-height: 1.72;
    }

    .about-content p {
        margin: 0 0 1.25rem;
    }

    @media (max-width: 575px) {
        .about-page {
            width: calc(100% - 40px);
        }

        .title {
            font-size: 2.35rem;
        }

        .about-content {
            font-size: 1.02rem;
            line-height: 1.68;
        }
    }
</style>
