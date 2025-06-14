import { lazy, Suspense, useState, useEffect } from "react";
import type { ComponentType } from "react";

interface DynamicComponentProps {
  component: string;
}

export default function DynamicComponent({ component }: DynamicComponentProps) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
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
        console.error("Error loading component:", err);
        setError(`Failed to load component: ${filename}`);
      }
    }

    if (filename) {
      loadComponent();
    }
  }, [filename]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!Component) {
    return <div className="loading">Loading component...</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
}
