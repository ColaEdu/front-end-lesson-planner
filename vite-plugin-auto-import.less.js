// vite-plugin-auto-import.less.js
export default function autoImportLess() {
    return {
      name: 'auto-import-less',
      enforce: 'pre',
      transform(code, id) {
        if (id.endsWith('.js')) {
          const matches = code.match(/import '\\w+(\/es\/[^']+)'/g);
          if (matches) {
            const imports = matches
              .map((i) => i.match(/import '(\w+(\/es\/[^']+))/)[1])
              .filter((i) => !/\/style\/index\//.test(i));
            return `${imports.map((i) => `import '${i}/style/index.less';`).join('\n')}\n${code}`;
          }
        }
      },
    };
  }