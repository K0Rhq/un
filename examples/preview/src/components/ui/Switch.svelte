<script lang="ts">
import { normalizeProps, useMachine } from "@zag-js/svelte";
import * as zagSwitch from "@zag-js/switch";

const { id = "1", name = "switch", ...rest }: zagSwitch.Service = $props();

const [snapshot, send] = useMachine(zagSwitch.machine({ id, name, ...rest }));

const api = $derived(zagSwitch.connect(snapshot, send, normalizeProps));
</script>

<label class="flex gap-2 items-center" {...api.getRootProps()}>
  <input {...api.getHiddenInputProps()} />
  <span
    class="bg-neutral-900 cursor-pointer border border-white/15 px-1 rounded-full overflow-clip h-7 w-12 flex"
    {...api.getControlProps()}
  >
    <span
      class={`size-5 self-center rounded-full flex duration-150 ${api.checked ? "bg-sky-500 translate-x-[18px]" : "bg-neutral-500"}`}
      {...api.getThumbProps()}
    ></span>
  </span>
  <span {...api.getLabelProps()}>{api.checked ? "On" : "Off"}</span>
</label>
