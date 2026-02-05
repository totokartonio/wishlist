#!/usr/bin/env bun

import fs from "fs";
import path from "path";

// Get component name from command line arguments
const componentInput = process.argv[2];

if (!componentInput) {
  console.error("❌ Error: Please specify component name");
  console.log("Usage: create-component <ComponentName>");
  console.log("    or: create-component <Path/ComponentName>");
  console.log("Example: create-component Wishlist");
  console.log("         create-component Wishlist/atoms/List");
  process.exit(1);
}

// Parse path and component name
const parts = componentInput.split("/");
const componentName = parts[parts.length - 1];
const subPath = parts.slice(0, -1).join("/");

// Check that component name starts with capital letter
if (!/^[A-Z]/.test(componentName)) {
  console.error("❌ Error: Component name must start with a capital letter");
  process.exit(1);
}

// Define paths
const srcPath = path.join(process.cwd(), "src");
const componentsPath = path.join(srcPath, "components");
const componentPath = subPath
  ? path.join(componentsPath, subPath, componentName)
  : path.join(componentsPath, componentName);

// Check if src directory exists
if (!fs.existsSync(srcPath)) {
  console.error("❌ Error: src folder not found in current directory");
  process.exit(1);
}

// Create components folder if it doesn't exist
if (!fs.existsSync(componentsPath)) {
  fs.mkdirSync(componentsPath, { recursive: true });
  console.log("✅ Created components folder");
}

// Check if component already exists
if (fs.existsSync(componentPath)) {
  console.error(`❌ Error: Component ${componentName} already exists`);
  process.exit(1);
}

// Create component folder
fs.mkdirSync(componentPath, { recursive: true });

// File templates
const tsxTemplate = `import styles from './${componentName}.module.css';

const ${componentName} = () => {
  return (
    <div className={styles.container}>
      <h1>${componentName}</h1>
    </div>
  );
};

export { ${componentName} };
`;

const indexTemplate = `export { ${componentName} as default } from './${componentName}';
`;

const cssTemplate = `.container {
  /* Styles for ${componentName} */
}
`;

// Create files
interface FileTemplate {
  name: string;
  content: string;
}

const files: FileTemplate[] = [
  { name: `${componentName}.tsx`, content: tsxTemplate },
  { name: "index.ts", content: indexTemplate },
  { name: `${componentName}.module.css`, content: cssTemplate },
];

files.forEach((file) => {
  const filePath = path.join(componentPath, file.name);
  fs.writeFileSync(filePath, file.content, "utf8");
  console.log(`✅ Created file ${file.name}`);
});

console.log(`\n🎉 Component ${componentName} successfully created!`);
const relativePath = subPath
  ? `src/components/${subPath}/${componentName}`
  : `src/components/${componentName}`;
console.log(`📁 Path: ${relativePath}`);
console.log(`\n💡 Import the component:`);
const importPath = subPath
  ? `./components/${subPath}/${componentName}`
  : `./components/${componentName}`;
console.log(`   import ${componentName} from '${importPath}';`);
