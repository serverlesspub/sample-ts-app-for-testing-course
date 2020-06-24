# Sample Serverless app for Senzo course

This is a sample serverless app for [Testing Serverless Applications course on Senzon Homeschool](https://homeschool.dev/class/testing-serverless-apps/).

## Folder structure

This project has the following folder structure:

```bash
.
├── LICENSE
├── README.md  # This file
├── WHO-COVID-19-global-data.csv # Sample data
├── build # Build folder
│   └── parse-covid-csv # Each function has its own folder
│       ├── lambda.js # Function source code
│       └── lambda.js.map # Source maps
├── jest.config.js # Jest configuration for testing
├── package-lock.json
├── package.json
├── samconfig.toml # AWS SAM config file, generated by SAM
├── src # Source code for all functions
│   ├── parse-covid-csv # Fuction source code
│   │   ├── events # Events for local testing
│   │   │   ├── context.ts
│   │   │   └── event.json
│   │   └── lambda.ts # Function source code
│   └── tests
│       └── parse-covid-csv
│           └── lambda.test.ts
├── template.yaml # Main CloudFormation file
├── tsconfig.json
├── webpack.config.js # Webpack config
└── yarn.lock
```

## Usage

To use this template, make sure you have the following prerequisites:

- AWS profile
- AWS SAM installed and configured
- Node.js version 8 or more (version 12 is recommended)

### Build TypeScript

To build TypeScript, run the `npm install` or `yarn install` command to install the dependencies, then run the following command:

```bash
npm run build
```

If you want to build a project and run the webpack bundle analyzer, run the following command:

```bash
npm run build-analyze
```

### First time deploy

To deploy the project, run the following command:

```bash
sam deploy --guided
```

This will run an interactive deployment process and ask you for the Amazon S3 bucket name. Amazon S3 bucket must have unique names, so try to be creative. If the deployment fails, you'll need to go to the AWS CloudFormation and delete the stack manually.

After the deployment is done, SAM will save your configuration to the `samconfig.toml` file.

_NOTE: The `samconfig.toml` file is on git ignore list._

See the initial deployment flow video [here](./flow.mp4).

### Next deployments

To deploy the app again, build TypeScript and simply run the following command:

```bash
sam deploy
```

### Testing

To run the application tests, run the following command:

```bash
npm test
```

This will run the jest tests for the sample serverless component, particularly the [`/src/tests/parse-covid-csv/lambda.test.ts`](./src/tests/parse-covid-csv/lambda.test.ts).

Note. If you notice error logs during the test run, please do not get concerned, as the tests are also evaluating the error cases and it is recommended to trace the particular error logs.

## License

MIT, see [LICENSE](LICENSE).
