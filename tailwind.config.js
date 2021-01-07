module.exports = {
  purge: ["./src/**/*.html", "./src/**/*.tsx", "./src/**/*.ts"],
  theme: {
    extend: {
      screens: {
        xs: { max: "400px" },
      },
    },
  },
};
