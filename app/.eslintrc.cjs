module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "airbnb",
        "airbnb-typescript",
        "airbnb/hooks",
        "prettier"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "project": ["./app/tsconfig.json"],
    },
    "ignorePatterns": ["vite.config.ts", ".eslintrc.cjs"],
    "settings": {
        "react": {
            "version": "detect",
        },
    },
    "rules": {
        "react/react-in-jsx-scope": "off",
    }
}
