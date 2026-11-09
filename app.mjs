import { onMounted, ref } from 'vue'

// Shared by the server (renderToString) and the client (hydration).
export const App = {
  setup() {
    const hydrated = ref(false)
    onMounted(() => { hydrated.value = true })
    return {
      hydrated,
      text: ref(''),
      accepted: ref(false),
      unset: ref(),
      picked: ref('a'),
      selected: ref('a'),
    }
  },
  template: `
    <h1>v-model state changed before hydration</h1>
    <p>
      The client bundle is held back for a few seconds. Change every field while the
      status says "not hydrated yet", then compare the fields with the model.
    </p>
    <p id="status"><strong>{{ hydrated ? 'hydrated' : 'not hydrated yet' }}</strong></p>

    <p><label>text (control: preserved since #14411) <input id="text" v-model="text"></label></p>
    <p><label><input id="accepted" type="checkbox" v-model="accepted"> checkbox, model starts as <code>false</code></label></p>
    <p><label><input id="unset" type="checkbox" v-model="unset"> checkbox, model starts as <code>undefined</code></label></p>
    <p>
      radio
      <label><input id="radio-a" type="radio" name="pick" value="a" v-model="picked"> a</label>
      <label><input id="radio-b" type="radio" name="pick" value="b" v-model="picked"> b</label>
    </p>
    <p>
      <label>select
        <select id="select" v-model="selected">
          <option value="a">A</option>
          <option value="b">B</option>
        </select>
      </label>
    </p>

    <h2>Model</h2>
    <pre id="model">{{ JSON.stringify({ text, accepted, unset: unset === undefined ? 'undefined' : unset, picked, selected }, null, 2) }}</pre>
  `,
}
