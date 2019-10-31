# Okeears - objectives and key results web app
[![Build Status](https://travis-ci.org/denis1stomin/okeears.svg?branch=master)](https://travis-ci.org/denis1stomin/okeears) [![Known Vulnerabilities](https://snyk.io/test/github/denis1stomin/okeears/badge.svg?targetFile=webui%2Fpackage.json)](https://snyk.io/test/github/denis1stomin/okeears?targetFile=webui%2Fpackage.json)

https://okeears.com

_Production deployment is served by https://github.com/denis1stomin/okeears-prod_

https://stage.okeears.com

_Staging deployment is served by https://github.com/denis1stomin/okeears-stage_

Okeears is a simple-to-use SaaS application which helps your team and organization to easily start charging ahead objectives and key results (OKR) process. By design the application is highly integrated with Microsoft Office 365.

## Security and compliance

* Microsoft Azure Active Directory authentication.
(Azure AD multifactor authentication (MFA) is supported out-of-the-box)
* Graph API is used to retrieve organizational structure.
* All the OKR data is stored in your organization's OneDrive account.
(Currently OneDrive for Business is supported only)
* OneNote API is used to store the data in human-readable format.
(You can use the OKR information in other O365-integrated systems. You can use OneNote mobile app on your phone)
* GDPR compliant :) since OneDrive/OneNote is used as a backend solution.
* Okeears is hosted using GitHub Pages open repositories!
* All the code is open-source!

## High level architecture

![Alt text](https://raw.githubusercontent.com/denis1stomin/okeears/master/doc/okeears_high_level_architecture.png "High level architecture diagram")

## Application permissions

Okeears needs you to provide a number of Azure AD `on-behalf-of` or delegated permissions.
You can easily revoke application permissions any time on https://portal.office.com/account/#apps.

* `Read all OneNote notebooks that user can access`
Allows the app to read OneNote notebooks that the signed-in user has access to in the organization.
_You need the permission to look over your teammates' objectives._

* `Read user OneNote notebooks`
Allows the app to read the titles of OneNote notebooks and sections and to create new pages, notebooks, and sections on behalf of the signed-in user.

* `Read and write user OneNote notebooks`
Allows the app to read, share, and modify OneNote notebooks on behalf of the signed-in user.

* `Create user OneNote notebooks`
Allows the app to read the titles of OneNote notebooks and sections and to create new pages, notebooks, and sections on behalf of the signed-in user.
_You need those three permissions above to work with your objectives._

* `Sign-in and read user profile`
Allows users to sign-in to the app, and allows the app to read the profile of signed-in users. It also allows the app to read basic company information of signed-in users.
_The permission is used to retrieve basic information about your teammates._

* `Read all users' basic profiles`
Allows the app to read a basic set of profile properties of other users in your organization on behalf of the signed-in user. This includes display name, first and last name, email address, open extensions and photo. Also allows the app to read the full profile of the signed-in user.
_The permission is used to retrieve your profile basic information._

* __NOT REQUESTED CURRENTLY__ `Read all users' full profiles`
Allows the app to read the full set of profile properties, reports, and managers of other users in your organization, on behalf of the signed-in user.
_The permission requires admin consent, therefore it is not requested by Okeears currently. But the permission is under consideration to be added in the future. Using this permission Okeears could retrieve full organizational structure relevant to you like it is done in Microsoft Delve. It will help you to align your goals with your managers tree._

* `Read user files`
Allows the app to read the signed-in user's files.

* __NOT REQUESTED CURRENTLY__ `Have full access to the application's folder`
Allows the app to read, create, update, and delete files in the application's folder.
_In theory this permission will replace all other notes/files permissions in the future. It will be used to store Okeears users' data._

* `Read users' relevant people lists`
Allows the app to read a scored list of people relevant to the signed-in user. The list can include local contacts, contacts from social networking or your organization's directory, and people from recent communications (such as email and Skype).
_Since firstly you want to look at objectives of people most relevant to you, Okeears automatically suggests you those people list. See links below to find more details about relevant people list._

* `Read and write app activity to users' activity feed`
Allows the app to read and report the signed-in user's activity in the app.
_Okeears uses this permission to update your activity feed._


## Useful links

https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-authentication-scenarios
https://docs.microsoft.com/en-us/azure/active-directory/authentication/concept-mfa-howitworks
https://docs.microsoft.com/en-us/azure/active-directory/develop/v1-permissions-and-consent
https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow
https://developer.microsoft.com/en-us/graph/docs/concepts/permissions_reference
https://github.com/microsoftgraph/microsoft-graph-docs/blob/master/concepts/permissions_reference.md
https://developer.microsoft.com/en-us/graph/docs/concepts/people_example
