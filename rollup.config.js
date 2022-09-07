import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete'

export default {
  input: 'src/lib',
  output: { dir: 'dist', format: 'esm' },
  plugins: [
    del({ targets: 'dist' }),
    typescript({
      rootDir: "./src/lib"
    }),
  ],
};
