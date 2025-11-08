<script setup lang="ts">
</script>

<template>
    <div>
        <nav class="navbar navbar-light" style="margin-bottom: 2rem">
            <div class="container-fluid home">
                <a class="navbar-brand" style="margin-left: 3rem; margin-top: 0.5rem" href="/">
                    <font-awesome-icon :icon="['fas', 'house']" style="font-size: 25px" />
                </a>
            </div>
        </nav>

        <div class="container-md space-bottom">
            <div class="row justify-content-center">
                <RouterView />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.home a:hover {
    color: #2d96bd;
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

h2 {
    font-weight: bold !important;
    font-size: 1.2rem !important;
}

h3 {
    font-weight: bold !important;
    font-size: 1.0rem !important;
}

p code {
    color: #E74C3C;
    background-color: #f5f5f5;
    padding: 0.25em;
}

p a {
    text-decoration: none;
    color: #2d96bd;
}

p a:hover {
    color: #ef3982;
}
</style>
