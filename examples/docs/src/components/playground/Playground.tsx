import { Suspense, useState, useEffect } from "react";
import type { ComponentType } from "react";

interface PlaygroundProps {
  component: string;
}

export default function Playground({ component }: PlaygroundProps) {
  const [Component, setComponent] = useState<ComponentType<
    Record<string, never>
  > | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filename = component;

  useEffect(() => {
    async function loadComponent() {
      try {
        // Clear any previous component and error
        setComponent(null);
        setError(null);

        // Dynamically import the component
        const importedModule = await import(`../../previews/${filename}`);
        const LoadedComponent = importedModule.default;

        if (!LoadedComponent) {
          throw new Error(`No default export found in ${filename}`);
        }

        setComponent(() => LoadedComponent);
      } catch (err) {
        console.error("Error loading preview:", err);
        setError(`Failed to load preview: ${filename}`);
      }
    }

    if (filename) {
      loadComponent();
    }
  }, [filename]);

  if (error) {
    return (
      <div id="unpreview-error-message" className="text-red-400">
        {error}
      </div>
    );
  }

  if (!Component) {
    return <div id="unpreview-loading">Loading preview...</div>;
  }

  return (
    <Suspense fallback={<div id="unpreview-loading">Loading...</div>}>
      <Component />
    </Suspense>
  );
}
