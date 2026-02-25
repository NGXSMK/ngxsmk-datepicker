<script setup lang="ts">
import { ref, onMounted } from 'vue'

const date = ref(null)
const datepickerRef = ref<any>(null)

const handleDateSelect = (e: any) => {
  date.value = e.detail
}

onMounted(() => {
  if (datepickerRef.value) {
    datepickerRef.value.addEventListener('dateSelect', handleDateSelect)
  }
})
</script>

<template>
  <div class="container">
    <div>
      <a href="https://vuejs.org/" target="_blank">
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>
    <h1>Vue + ngxsmk-datepicker</h1>

    <div class="content">
      <p>This is a Vue App rendering the Angular Web Component directly.</p>
      
      <div class="picker-wrapper">
        <!-- Use the custom element natively -->
        <ngxsmk-datepicker 
          ref="datepickerRef" 
          mode="range" 
          theme="light"
          :classes="JSON.stringify({ header: 'bg-green-600 text-white rounded-t-lg' })"
        ></ngxsmk-datepicker>
      </div>

      <div class="result">
        <strong>Selected Date (In Vue State):</strong>
        <pre>{{ date ? JSON.stringify(date, null, 2) : 'No date selected' }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 2rem;
  font-family: sans-serif;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.content {
  margin-top: 2rem;
}
.picker-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
ngxsmk-datepicker {
  width: 100%;
  max-width: 300px;
}
.result {
  margin-top: 2rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  color: #333;
}
.result pre {
  margin-top: 1rem;
}
</style>
