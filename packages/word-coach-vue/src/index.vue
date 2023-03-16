<template>
  <section>
    <h2>{{ counter }}</h2>
    <button @click="incrementCounter">+</button>
    <button @click="decrementCounter">-</button>
  </section>
</template>

<script>
import styles from "word-coach-common/styles.module.css"

console.log(styles)

const WorkCoachVue = {

  data() {
    return {
      title: "Counter",
      counter: 0
    };
  },
  methods: {
    incrementCounter() {
      this.counter++;
    },
    decrementCounter() {
      this.counter--;
    }
  },
  computed: {
    $style() {
      return styles;
    },
  },
};
export default WorkCoachVue
</script>