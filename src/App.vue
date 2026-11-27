<script setup lang="ts">
</script>

<template>
    <div class="app-container">
        <header class="site-header">
            <nav class="header-inner" aria-label="Primary navigation">
                <RouterLink class="brand" to="/" aria-label="TEN BRINCKE home">
                    <img class="brand-logo" src="/logo.svg" alt="TEN BRINCKE">
                </RouterLink>
                <div class="header-links">
                    <RouterLink to="/">Writing</RouterLink>
                    <RouterLink to="/about">About</RouterLink>
                </div>
            </nav>
        </header>

        <div class="container-lg space-bottom">
            <div class="row justify-content-center">
                <RouterView />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    :root {
        font-family: 'Inter', sans-serif;
        color: #1d1d1f;
        background: #fff;
    }

    body {
        margin: 0;
        font-family: 'Inter', sans-serif;
        color: #1d1d1f;
        background: #fff;
    }

    .site-header {
        height: 88px;
        margin-bottom: 2.5rem;
        border-bottom: 1px solid #ededed;
    }

    .header-inner {
        height: 100%;
        max-width: 1120px;
        margin: 0 auto;
        padding: 0 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .header-inner .brand {
        display: flex;
        align-items: center;
    }

    .brand-logo {
        display: block;
        width: 128px;
        height: auto;
    }

    .header-links {
        display: flex;
        gap: 28px;
        align-items: center;
        font-size: 0.9rem;
        font-weight: 500;
    }

    .header-inner a {
        color: #1d1d1f;
        text-decoration: none;
    }

    .header-inner a:hover,
    .header-inner a.router-link-active {
        color: #2d96bd;
    }

    .space-bottom {
        margin-bottom: 4rem;
    }

    .app-container .lead {
        font-size: 1.25rem;
        line-height: 1.55;
    }

    @media (max-width: 575px) {
        .site-header {
            height: 72px;
            margin-bottom: 1.5rem;
        }

        .header-inner {
            padding: 0 20px;
        }

        .header-links {
            gap: 18px;
        }

        .brand-logo {
            width: 111px;
        }

        .app-container .lead {
            font-size: 1.15rem;
        }
    }

    .app-container h2 {
        font-weight: bold !important;
        font-size: 1.55rem !important;
        letter-spacing: -0.02em;
        margin-top: 2.5rem;
    }

    .app-container h3 {
        font-weight: bold !important;
        font-size: 1.0rem !important;
    }

    .app-container nav a {
        text-decoration: none;
        color: black;
    }

    .app-container nav a:hover {
        text-decoration: none;
        color: #2d96bd;
    }

    .app-container a {
        text-decoration: none;
        color: #2d96bd;
    }

    .app-container a:hover {
        color: #ef3982;
    }
</style>
