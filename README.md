# Node-Serverless-Template

Node API template for aws serverless service

## Feature

-   Creating an api document creates an aws infrastructure with a serverless structure.
-   Optimization due to install necessary libraries by API.
-   Enable import Syntax and typescript using the Babel.
-   Setting up API testing locally closest lambda environment.

## Usage

-   Configurate your aws credentials file

    ✔ **Windows** default path: C/Users/{userName}/.aws/credentials
    ✔ **Linux** or **macOS** default path: ~/.aws/credentials

    ```text
    [development]
    aws_access_key_id={your_aws_access_key_id}
    aws_secret_access_key={your_aws_secret_access_key}

    [production]
    aws_access_key_id={your_aws_access_key_id}
    aws_secret_access_key={your_aws_secret_access_key}
    ```

    📌 If you want to change the name, please change it with the script of package.json

## Installation

-   nodeJS modules install

    ⚠ **DO NOT USE NPM INSTALL**

    ```
    npm run install-dist
    ```

## Run

-   Offline API test

    ```
    npm run offline
    ```

-   Bootstrap

    ```
    // Development
    npm run bootstrap

    // Production
    npm run bootstrap-prod
    ```

-   Deploy

    ```
    // Development
    npm run deploy

    // Production
    npm run deploy-prod
    ```

-   Destroy

    ```
    // Development
    npm run destroy

    // Production
    npm run destroy-prod
    ```

# Others

-   We recommand [Dash Bird](https://app.dashbird.io/) service for watch lambda infos.
-   We recommand [Planet Scale](https://planetscale.com/) service for database server.
