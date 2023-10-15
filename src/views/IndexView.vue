<template>
  <header>
    <p class="logo">fitlog</p>
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
  margin: 0 auto 2rem;
  text-align: center;
  font-size: xx-large;
  font-weight: bold;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
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