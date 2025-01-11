<script lang="ts">
import * as pinInput from "@zag-js/pin-input";
import { normalizeProps, useMachine } from "@zag-js/svelte";

const [snapshot, send] = useMachine(
	pinInput.machine({
		id: "1",
	}),
);

const api = $derived(pinInput.connect(snapshot, send, normalizeProps));
</script>

<div class="flex flex-col gap-4">
  <div class="grid grid-cols-6 gap-2 w-64" {...api.getRootProps()}>
    <input
      class="bg-neutral-900 py-1 px-2 rounded-md border border-white/15 text-center"
      {...api.getInputProps({ index: 0 })}
    />
    <input
      class="bg-neutral-900 py-1 px-2 rounded-md border border-white/15 text-center"
      {...api.getInputProps({ index: 1 })}
    />
    <input
      class="bg-neutral-900 py-1 px-2 rounded-md border border-white/15 text-center"
      {...api.getInputProps({ index: 2 })}
    />
    <input
      class="bg-neutral-900 py-1 px-2 rounded-md border border-white/15 text-center"
      {...api.getInputProps({ index: 3 })}
    />
    <input
      class="bg-neutral-900 py-1 px-2 rounded-md border border-white/15 text-center"
      {...api.getInputProps({ index: 4 })}
    />
    <input
      class="bg-neutral-900 py-1 px-2 rounded-md border border-white/15 text-center"
      {...api.getInputProps({ index: 5 })}
    />
  </div>
  <button
    onclick={api.clearValue}
    class="p-1 w-fit px-2 text-xs bg-red-950 rounded-md">Clear</button
  >
</div>
