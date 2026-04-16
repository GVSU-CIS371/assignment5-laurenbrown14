<template>
  <div id="app-wrapper">
    <div class="mug-preview">
      <Beverage :isIced="beverageStore.currentTemp === 'Cold'" />
    </div>

    <main class="content-card">
      <div class="auth-box-header">
        <div v-if="!beverageStore.user">
          <button @click="beverageStore.withGoogle" class="auth-btn">
            Sign in with Google
          </button>
        </div>
        <div v-else class="user-info">
          <p>Welcome, {{ beverageStore.user.displayName }}</p>
          <button @click="beverageStore.logout" class="auth-btn logout">
            Sign Out
          </button>
        </div>
      </div>

      <hr class="divider" />

      <ul class="selection-list">
        <li>
          <template v-for="temp in beverageStore.temps" :key="temp">
            <label class="custom-radio">
              <input
                type="radio"
                name="temperature"
                :value="temp"
                v-model="beverageStore.currentTemp"
              />
              <span class="radio-tile">{{ temp }}</span>
            </label>
          </template>
        </li>

        <li>
          <template v-for="base in beverageStore.bases" :key="base.id">
            <label class="custom-radio">
              <input
                type="radio"
                name="base"
                :value="base"
                v-model="beverageStore.currentBase"
              />
              <span class="radio-tile">{{ base.name }}</span>
            </label>
          </template>
        </li>

        <li>
          <template v-for="creamer in beverageStore.creamers" :key="creamer.id">
            <label class="custom-radio">
              <input
                type="radio"
                name="creamer"
                :value="creamer"
                v-model="beverageStore.currentCreamer"
              />
              <span class="radio-tile">{{ creamer.name }}</span>
            </label>
          </template>
        </li>

        <li>
          <template v-for="syrup in beverageStore.syrups" :key="syrup.id">
            <label class="custom-radio">
              <input
                type="radio"
                name="syrup"
                :value="syrup"
                v-model="beverageStore.currentSyrup"
              />
              <span class="radio-tile">{{ syrup.name }}</span>
            </label>
          </template>
        </li>
      </ul>

      <div class="beverage-controls">
        <input
          type="text"
          v-model="beverageStore.beverageName"
          placeholder="Beverage Name"
          class="name-input"
        />
        <p v-if="beverageStore.statusMessage" class="status-msg">
          {{ beverageStore.statusMessage }}
        </p>

        <p v-if="!beverageStore.user" class="login-prompt">
          Please sign in to save your beverage!
        </p>

        <button
          @click="beverageStore.makeBeverage"
          class="make-btn"
          :disabled="!beverageStore.user"
        >
          🍺 Make Beverage
        </button>
      </div>

      <div v-if="!beverageStore.user" class="login-msg"></div>
    </main>

    <div
      id="beverage-container"
      v-if="beverageStore.user && beverageStore.savedBeverages.length > 0"
    >
      <h3>Saved Recipes</h3>
      <div class="recipe-grid">
        <button
          v-for="(bev, index) in beverageStore.savedBeverages"
          :key="index"
          class="recipe-button"
          @click="beverageStore.showBeverage(bev)"
        >
          {{ bev.name }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Beverage from "./components/Beverage.vue";
import { useBeverageStore } from "./stores/beverageStore";

const beverageStore = useBeverageStore();

onMounted(() => {
  beverageStore.init();

  onAuthStateChanged(auth, (user) => {
    beverageStore.setUser(user);
  });
});
</script>

<style lang="scss">
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(to bottom, #6e4228 0%, #956f5a 100%);
  color: white;
  padding: 40px 20px;
}

.mug-preview {
  margin-bottom: -10px;
  z-index: 10;
  pointer-events: none;
}

.content-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 30px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.auth-box-header {
  margin-bottom: 15px;
}

.auth-btn {
  background: white;
  color: #6e4228;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
  pointer-events: auto;

  &:hover {
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
  }

  &.logout {
    margin-top: 10px;
    background: #ffeded;
    color: #cc0000;
  }
}

.divider {
  border: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 20px 0;
}

ul.selection-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.custom-radio input {
  display: none;
}

.radio-tile {
  display: inline-block;
  padding: 6px 12px;
  margin: 5px;
  background-color: rgba(222, 222, 222, 0.8);
  border: 2px solid #6e4228;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  color: #6e4228;
  transition: 0.3s;
}

.custom-radio input:checked + .radio-tile {
  background-color: #945cd9;
  color: #fff;
  border-color: #fff;
}
.radio-tile:hover {
  background-color: #f0f0f0;
}

.beverage-controls {
  margin-top: 25px;

  .name-input {
    padding: 10px;
    border-radius: 8px;
    border: none;
    width: 60%;
    margin-bottom: 15px;
  }

  .make-btn {
    display: block;
    margin: 0 auto;
    padding: 10px 25px;
    background: #fff;
    color: #6e4228;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
  }
}

#beverage-container {
  margin-top: 20px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 300px;
  min-height: 100px;
}

.recipe-button {
  display: inline-block;
  padding: 5px 10px;
  margin: 5px;
  background-color: rgba(222, 222, 222, 0.8);
  border: 2px solid #6e4228;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  color: #6e4228;
}

.make-btn:disabled {
  background-color: #aaa !important;
  color: #666 !important;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>
