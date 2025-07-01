
// Global CSS class declarations
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Extend the global namespace for CSS classes
declare global {
  namespace React {
    interface HTMLAttributes<T> {
      className?: string;
    }
  }
}

export {};
