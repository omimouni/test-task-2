const postcss = require('postcss');
const plugin = require('tailwindcss/plugin');
const fs = require('fs');

/** @type {import('tailwindcss').Config} */
export default {
  // eslint-disable-next-line no-undef
  presets: [require('tailwind-preset')],
  content: [
    './src/**/*.{html,svelte,ts}',
    '../../packages/~ui/**/*.{html,svelte,ts}',
    '../../packages/~i18n/**/*.ts',
  ],
  prefix: '.',
  theme: {
    extend: {},
  },
  plugins: [
    // Experimental: Tailwind CSS plugin to add base styles to the app
    plugin(function({ addBase }) {
      try {

        // read the preflight.css file
        const baseStyles = postcss.parse(
          fs.readFileSync('../../node_modules/tailwindcss/lib/css/preflight.css', 'utf8')
        );

        // go through each rule in the base styles
        baseStyles.walkRules((rule) => {
          // map over the selectors
          rule.selectors = rule.selectors.map((selector) => {
            // If the selector is html, body, or :host, add the .uprent-reset class
            // Otherwise, add the .uprent-reset class to the selector
            return ['html', 'body', ':host'].includes(selector)
              ? '.uprent-reset'
              : ':where(.uprent-reset) ' + selector;
          });
        });

        // add the base styles to the app
        addBase(baseStyles.nodes);
        console.log("Successfully added base styles");
      } catch (error) {
        console.error("Error in Tailwind plugin:", error);
      }
    })
  ],

  corePlugins: {
    preflight: false,
  },
}
