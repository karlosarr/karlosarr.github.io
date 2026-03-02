export function greet(name: string): string {
  return `Hello ${name} via Bun!`;
}

console.log(greet("World"));