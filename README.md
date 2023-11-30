# serverless-shortlinker-app
## Description
Simple service with registration which allows to create pseudonims for links and use short aliases instead of looong urls.
## Technologies used
* JavaScript
  + Node
    - Some plugins
  + TypeScript
    - Esbuild for compilation
  + Serverless (+some plugins)
* Amazon web service
  + AWS Lambda
  + Simple Email Service
  + Simple Querry Service
  + DynamoDb
* YML, JSON
## Deploing
1. Download project
2. Create .env with your credentials
3. Type `npm run deploy` inside project dir.
4. Cross your fingers and hope everything will be fine
## Usage
1. Register new user by calling `auth/register` with `email` and `password` in body
2. Verify with `auth/verify`. Give it `email` and `verification_code` (which you recieved from email)
3. Login with existing `email` and `password` combination to get bearer token with `auth/login`.
4. Play a bit with links:
   - Create new one with `link/createLink`. You should provide token in headers for that. also you need to add `link`, `alias` and one of expiration types:
     + NEVER
     + ONE_DAY
     + THREE_DAYS
     + ONE_WEEK
     + ONE_TIME
  - Manage your links by calling `link/manageLinks`. Only authentification needed. Gives stringified link objects array
  - Deactivate link with `link/deactivateLink`. Token and link nickname (in body called `alias`) is all you need.
  - Use link. Route is pretty simple `link/uselink/{put here your alias}`. It has, as you see, one path parameter, but that is all he needs.
### Notes
- You can change deployment stage by modifying script in `package.json`
- Move your email from sandbox in ses for better experience
- All functions logged (except SQS one). It can be usefull for get your verification code even if ses sends it too long.
- Ask me for link for deployed app or script for adding test user without this checks
