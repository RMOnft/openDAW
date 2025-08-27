module.exports = {
    env: {
        node: true,
    },
    parser: "@typescript-eslint/parser",
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    plugins: ["@typescript-eslint"],
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2020,
    },
    rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-unused-vars": ["warn", {"argsIgnorePattern": "^_"}],
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-unnecessary-type-constraint": "off",
        "prefer-spread": "off",
        "require-yield": "off",
        "@typescript-eslint/no-this-alias": "off",
        "no-empty": "off",
        "no-case-declarations": "off",
        "no-constant-condition": "off",
        "prefer-const": "off",
        "no-unused-vars": "warn",
        "no-restricted-imports": [
            "error",
            {
                "patterns": [
                    {
                        "group": ["**/src/**", "@opendaw/*/src/**"],
                        "message": "Direct imports from src folders are not allowed. Use package exports instead."
                    }
                ]
            }
        ]
    },
};
