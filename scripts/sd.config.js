import StyleDictionary from "style-dictionary";
export default {
  source: ["tokens-css.json"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "assets/css/",
      files: [{ destination: "bcx.tokens.css", format: "css/variables" }]
    }
  }
};
