import * as dialog from "@zag-js/dialog";
import { useMachine, normalizeProps, Portal } from "@zag-js/react";

export function Dialog() {
  const [state, send] = useMachine(dialog.machine({ id: "1" }));

  const api = dialog.connect(state, send, normalizeProps);

  return (
    <>
      <button {...api.getTriggerProps()}>Open Dialog</button>
      {api.open && (
        <Portal>
          <div
            {...api.getBackdropProps()}
            className="bg-black/25 top-0 left-0 absolute backdrop-blur-sm h-screen w-screen z-50"
          />
          <div {...api.getPositionerProps()}>
            <div
              {...api.getContentProps()}
              className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-black z-[60]"
            >
              <h2 {...api.getTitleProps()}>Edit profile</h2>
              <p {...api.getDescriptionProps()}>
                Make changes to your profile here. Click save when you are done.
              </p>
              <div>
                <input placeholder="Enter name..." />
                <button type="button">Save</button>
              </div>
              <button {...api.getCloseTriggerProps()}>Close</button>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
