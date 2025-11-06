<script setup lang="ts">
</script>

<template>
    <div>
        <nav class="navbar navbar-light" style="margin-bottom: 2rem">
            <div class="container-fluid">
                <a class="navbar-brand" style="margin-left: 3rem; margin-top: 0.5rem" href="/">
                    <font-awesome-icon :icon="['fas', 'house']" style="font-size: 25px;" />
                </a>
            </div>
        </nav>

        <div class="container space-bottom">
            <div class="row justify-content-center">
                <RouterView />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.article {
    border-bottom-width: 1px;
    border-bottom-style: dashed;
    border-bottom-color: rgb(240, 240, 240);
    padding-top: 1rem;
    padding-bottom: 0.8rem;
}

.space-bottom {
    margin-bottom: 3rem;
}
</style>
