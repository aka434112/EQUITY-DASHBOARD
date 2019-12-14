<template>
  <v-app id="app">
    <div>
      <v-overlay :value="loading"></v-overlay>
      <v-app-bar color="blue" dark>
          <v-app-bar-nav-icon @click="showNavMenu=true"></v-app-bar-nav-icon>
          <v-toolbar-title>EQUITY DASHBOARD</v-toolbar-title>
      </v-app-bar>
      <v-navigation-drawer v-model="showNavMenu" :mini-variant="mini" absolute bottom dark temporary>
        <v-list nav dense>
          <v-list-item v-for="item in items" :key="item.title" :to="item.to">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <router-view/>
    </div>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'App',
  data () {
    return {
      showNavMenu: false,
      items: [
        { title: 'Home', icon: 'mdi-home', to: '/' },
        { title: 'Settings', icon: 'mdi-settings', to: '/settings' }
      ],
      mini: false
    }
  },
  computed: {
    ...mapGetters(['loading'])
  }
}
</script>

<style>
#app {
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
