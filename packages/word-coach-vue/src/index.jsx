import { defineComponent } from "vue"

const WordCoach = defineComponent({
  name: "WordCoach",
  data() {
    return {
      title: "Counter",
      counter: 0,
    }
  },
  computed: {
    $style() {
      return styles
    },
  },
  methods: {
    incrementCounter() {
      this.counter++
    },
    decrementCounter() {
      this.counter--
    },
  },
  render() {
    return (
      <section>
        <h1>{this.title}</h1>
        <p>{this.counter}</p>
        <button onClick={this.incrementCounter}>+</button>
        <button onClick={this.decrementCounter}>-</button>
      </section>
    )
  },
})

export default WordCoach
