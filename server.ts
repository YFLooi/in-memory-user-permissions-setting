import { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";

const express = require("express");
const bodyParser = require("body-parser");

const server = express();
const port = 5000;

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

/**
 * Sample entry:
 * {
 *    email: "yihfoo@gmail.com"
 *    permissions: [
 *      { featureName: mainPage, canAccess: false },
 *      { featureName: reportsPage, canAccess: true },
 *    ]
 * }
 */
const userPermissions: {
  email: string;
  permissions: { featureName: string; canAccess: boolean }[];
}[] = [];

// Sample call: http://localhost:5000/feature?email=xxx&featureName=yyy
server.get(`/feature`, async (req: Request, res: Response) => {
  const email = req.query.email;
  const featureName = req.query.featureName;

  console.log(
    `Call made to get permissions for /feature. Queries passed in:\nemail: "${email}"\nfeatureName: "${featureName}"`
  );
  console.log(
    `Attempting to find user profile and associated permissions for ${email}`
  );

  let canAccess = null;
  for (const user of userPermissions) {
    if (user.email == email) {
      for (const permission of user.permissions) {
        if (permission.featureName == featureName) {
          canAccess = permission.canAccess;
        }
      }
    }
  }

  if (canAccess !== null) {
    res.status(200).json({ canAccess: canAccess });
  } else {
    res
      .status(400)
      .json({ message: `Access permission not found for email "${email}"` });
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

    const existingEmails = userPermissions.map((user) => {
      return user.email;
    });
    if (!existingEmails.includes(email)) {
      console.log(`Input email is not present, create a new entry`);
      userPermissions.push({
        email: email,
        permissions: [
          {
            featureName: featureName,
            canAccess: enable,
          },
        ],
      });
    } else {
      console.log(`Input email is present, examining associated permissions`);

      for (let i = 0; i < userPermissions.length; ++i) {
        if (userPermissions[i].email == email) {
          const existingPermissions = userPermissions[i].permissions.map(
            (user) => {
              return user.featureName;
            }
          );

          if (!existingPermissions.includes(featureName)) {
            console.log(
              `Permission does not exist for featureName ${featureName}. Craeting an entry for it`
            );
            userPermissions[i].permissions.push({
              featureName: featureName,
              canAccess: enable,
            });
          } else {
            console.log(
              `Permission exists for featureName ${featureName}. Updating its canAccess field`
            );
            for (let j = 0; j < userPermissions[i].permissions.length; ++j) {
              if (
                userPermissions[i].permissions[j].featureName == featureName
              ) {
                userPermissions[i].permissions[j].canAccess = enable;
              }
            }
          }
        }
      }
    }

    return res.status(200).json({
      message: `Successfully updated permission for ${featureName} for ${email}`,
    });
  }
);

server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
