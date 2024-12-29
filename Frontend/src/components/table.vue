<script setup>
const number = 50;
</script>

<template>
    <section>
        <h1>1321</h1>
        <h2>1321</h2>
        <h3>ASdasdas</h3>
        <h1 v-for="i in number" :key="i">{{ i }}</h1>
    </section>
</template>


<style scoped>
section{
    width: 100%;
    border: 0px solid transparent;
    padding: 1rem;

    overflow-y: scroll;
}
</style>