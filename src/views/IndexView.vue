<template>
  <header>
    <p class="logo"><router-link to="/">fitlog</router-link></p>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/sign-in">Sign-in</RouterLink>
      </nav>
    </div>
  </header>
  <div class="wrapper">
    <RouterView />
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}
.wrapper {
  max-width: 1280px;
  margin: 0 auto;
  // padding: 2rem;

  font-weight: normal;
}

.logo {
  display: block;
  margin: 2rem 0;
  text-align: center;
  font-size: 2.5rem;

  a {
    color: black;
    font-weight: bold;
  }
}

nav {
  width: 100%;
  font-size: 1.1rem;
  text-align: center;
  margin-top: 2rem;
  
  a {
    text-decoration: none;
  }
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

</style>