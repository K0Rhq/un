<script lang="ts">
  import { normalizeProps, useMachine } from "@zag-js/svelte";
  import * as zagSwitch from "@zag-js/switch";

  const [snapshot, send] = useMachine(
    zagSwitch.machine({ id: "1", name: "switch" }),
  );

  const api = $derived(zagSwitch.connect(snapshot, send, normalizeProps));
</script>

<label class="flex gap-2 items-center" {...api.getRootProps()}>
  <input {...api.getHiddenInputProps()} />
  <span class="bg-red-400 h-4 w-8 flex" {...api.getControlProps()}>
    <span
      class={` size-4 flex ${api.checked ? "bg-blue-400" : "bg-red-400"}`}
      {...api.getThumbProps()}
    ></span>
  </span>
  <span class="bg-green-800" {...api.getLabelProps()}
    >{api.checked ? "On" : "Off"}</span
  >
</label>
