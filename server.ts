import { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { constructMongoConnection } from "./src/server.config";
import express from "express";
import bodyParser from "body-parser";
import UserPermissions, {
  IUserPermissions,
} from "./src/user-permissions.model";
import _ from "lodash";

const server = express();
const port = 5000;

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// const CompaniesModel = require("./companiesSchema");
// const constructMongoConnection = require("./backend/config/server.config.js");

// Connecting to database
const mongoConnectionString = constructMongoConnection();
mongoose.Promise = global.Promise;

mongoose.connect(mongoConnectionString, {}, function (error) {
  if (error) {
    console.log("Error!" + error);
  } else {
    console.log("Connected to MongoDB Atlas database");
  }
});

/**
 * Sample document in db:
 * {
 *    email: "yihfoo@gmail.com"
 *    permissions: [
 *      { featureName: mainPage, canAccess: false },
 *      { featureName: reportsPage, canAccess: true },
 *    ]
 * }
 */
// Sample call: http://localhost:5000/feature?email=xxx&featureName=yyy
server.get(`/feature`, async (req: Request, res: Response) => {
  const queryParam: any = req.query;
  const email = queryParam.email;
  const featureName = queryParam.featureName;

  console.log(
    `Call made to get permissions for /feature. Request parameters passed in:\nemail: "${email}"\nfeatureName: "${featureName}"`
  );
  console.log(
    `Attempting to find user profile and associated permissions for ${email}`
  );

  const userProfile = await UserPermissions.findOne({
    email: email,
  });
  const userPermissions = _.isEmpty(userProfile?.permissions)
    ? []
    : userProfile.permissions;

  let canAccess = null;
  for (const permission of userPermissions) {
    if (permission.featureName == featureName) {
      canAccess = permission.canAccess;
    }
  }

  if (canAccess !== null) {
    res.status(200).json({ canAccess: canAccess });
  } else {
    res.status(400).json({
      message: `Access permission not found for email="${email}" with featureName="${featureName}"`,
    });
  }
});

server.post(
  `/feature`,
  body("featureName").isString(),
  body("email").isEmail(),
  body("enable").isBoolean(),
  async (req: Request, res: Response) => {
    const { featureName, email, enable } = req.body;

    console.log(
      `Request made to set permissions for /feature with\n
      featureName == "${featureName}"\n
      email == "${email}"\n
      enable == "${enable}"\n`
    );

    try {
      const existingUserProfile = await UserPermissions.findOne({
        email: email,
      });
      if (_.isEmpty(existingUserProfile)) {
        console.log(
          `UserProfile for input email ${email} is not present, create a new userProfile`
        );
        const userProfile = await UserPermissions.create({
          email: email,
          permissions: [
            {
              featureName: featureName,
              canAccess: enable,
            },
          ],
        });
      } else {
        console.log(
          `userProfile for input email is present, examining associated permissions`
        );

        const existingUserPermissions = existingUserProfile.permissions.map(
          (permission) => permission.featureName
        );
        console.log(
          `existingUserPermissions: ${JSON.stringify(
            existingUserPermissions,
            null,
            2
          )}`
        );

        for (let i = 0; i < existingUserPermissions.length; ++i) {
          if (!existingUserPermissions.includes(featureName)) {
            console.log(
              `Permission does not exist for featureName ${featureName}. Creating an entry for it`
            );

            const updatedUserProfile = await UserPermissions.updateOne(
              {
                email: email,
              },
              {
                $addToSet: {
                  permissions: {
                    featureName: featureName,
                    canAccess: enable,
                  },
                },
              }
            );
          } else {
            console.log(
              `Permission exists for featureName ${featureName}. Updating its canAccess field`
            );
            const updatedUserProfile = await UserPermissions.updateOne(
              {
                email: email,
                "permissions.featureName": featureName,
              },
              {
                $set: {
                  "permissions.$.canAccess": enable,
                },
              }
            );
          }
        }
      }

      return res.status(200).json({});
    } catch (err) {
      // Triggers if attempt to update failed
      return res.status(304).json({});
    }
  }
);

server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
