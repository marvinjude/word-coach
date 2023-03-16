import WordCoach from "word-coach-vue"
import { defineComponent } from "vue"

export default defineComponent({
  name: "App",
  render() {
    return (
      <div
        style={{
          background: "pink",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Manrope",
        }}
      >
        <div
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            padding: "5rem",
          }}
        >
          This is a fucking component
          <WordCoach />
        </div>
      </div>
    )
  },
})
