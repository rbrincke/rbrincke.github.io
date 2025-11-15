<script setup lang="ts">
</script>

<template>
    <div class="app-container">
        <nav class="navbar navbar-light header">
            <a class="navbar-brand" href="/">
                <font-awesome-icon :icon="['fas', 'house']" class="big-icon" />
            </a>
            <a href="/about">
                <font-awesome-icon :icon="['fas', 'address-card']" class="big-icon" />
            </a>
        </nav>

        <div class="container-md space-bottom">
            <div class="row justify-content-center">
                <RouterView />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .header {
        margin-bottom: 2rem;
        margin-right: 1.25rem;
        margin-left: 1.25rem;
    }

    .app-container big-icon {
        font-size: 25px;
    }

    .article {
        border-bottom-width: 1px;
        border-bottom-style: dashed;
        border-bottom-color: rgb(240, 240, 240);
        padding-top: 1rem;
        padding-bottom: 0.8rem;
    }

    .space-bottom {
        margin-bottom: 2rem;
    }

    .app-container h2 {
        font-weight: bold !important;
        font-size: 1.2rem !important;
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
