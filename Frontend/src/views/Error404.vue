<script setup>

</script>

<template>
    <section>
        <div>
            <h1>404!</h1>
            <h2>PAGE NOT FOUND</h2>
        </div>
    </section>
</template>

<style scoped>
section{
    
    color: var(--font-color-light);
    height: 100dvh;

    display: flex;
    justify-content: center;
    align-items: center;
    >div{
        background-color: color-mix(in srgb, var(--glass-bg-hard-trans) 100%, transparent 0%);
        backdrop-filter: blur(10px);
        width: 100dvw;
        height: 100dvh;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        >h1{
            font-size: 30pt;
        }
        >h2{
            font-size: 20pt;
        }
    }
}
</style>