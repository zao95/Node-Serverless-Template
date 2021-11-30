# Node-Serverless-Template

Node API template for aws serverless service

## Feature

-   Partial installation using npm --only
-   Enable import using the Babel
-   Setting up API testing locally

## Usage

-   Configurate your aws credentials file

    ✔ Default path: C/User/{userName}/.aws/credentials

    ```text
    [dev]
    aws_access_key_id={your_aws_access_key_id}
    aws_secret_access_key={your_aws_secret_access_key}

    [prod]
    aws_access_key_id={your_aws_access_key_id}
    aws_secret_access_key={your_aws_secret_access_key}
    ```

    📌 If you want to change the name, please change it with the script of package.json

## Installation

1. Make 'dist' directory

    ```
    mkdir dist
    ```

2. nodeJS modules install

    ⚠ **DO NOT USE NPM INSTALL**

    ```
    // Linux
    npm run package-install-linux
    ```

    ```
    // Window
    npm run package-install-window
    ```

## Run

-   Offline API test

    ```
    npm run offline
    ```

-   Bootstrap

    ```
    // Dev
    npm run bootstrap-dev

    // Prod
    npm run bootstrap-prod
    ```

-   Deploy

    ```
    // Dev
    npm run deploy-dev

    // Prod
    npm run deploy-prod
    ```

-   Destroy

    ```
    // Dev
    npm run destroy-dev

    // Prod
    npm run destroy-prod
    ```
