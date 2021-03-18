<template>
    <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand d-flex justify-content-center align-items-center" href="#">
                <img src="https://avatars.githubusercontent.com/u/2487851?s=280&v=4" 
                    alt="Logo norsys" 
                    width="100" height="100" 
                    class="d-inline-block align-top" />

                <div class="d-flex flex-column mx-3">
                    <h1>Fiche de présence</h1>

                    <h2>{{ body_title }}</h2>
                </div>
            </a>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'MenuUnlogged',

    props: {
        body_title: String
    }
}
</script>

<style>

</style>