# Okeears - objectives and key results web app [![Build Status](https://travis-ci.org/denis1stomin/okeears.svg?branch=master)](https://travis-ci.org/denis1stomin/okeears)

https://www.okeears.com/

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
* Okeears is hosted in Azure as static web site.
* All the source code is open-source!

## Application permissions

Okeears needs you to provide a number of Azure AD `on-behalf-of` permissions.
You can easily revoke application permissions any time on https://portal.office.com/account/#apps.

* `Read all OneNote notebooks that you can access`
Allows the app to read all the OneNote notebooks that you have access to.

_You need the permission to look over your teammates' objectives._

* `Read your OneNote notebooks`
Allows the app to read OneNote notebooks on your behalf.

* `Read and write your OneNote notebooks`
Allows the app to read, share, and modify OneNote notebooks on your behalf.

* `Create your OneNote notebooks`
_Allows the app to view the titles of your OneNote notebooks and sections and to create new pages, notebooks, and sections on your behalf._

You need those three permissions above to work with your objectives.

* `Sign you in and read your profile`
Allows you to sign in to the app with your organizational account and let the app read your profile. It also allows the app to read basic company information.

* `Read all users' basic profiles`
Allows the app to read a basic set of profile properties of other users in your organization on your behalf. Includes display name, first and last name, email address and photo.

* `Read your files`
Allows the app to read your files.

* `Have full access to your files`
Allows the app to read, create, update, and delete your files.

OneDrive permissions are used only to share your OKR notebook with your teammates since OneNote API currently does not provide such possibility. Theoretically OneDrive permissions will be removed from the application in future when OneNote API become more mature.

* `Read your relevant people list`
Allows the app to read a list of people in the order that's most relevant to you. This includes your local contacts, your contacts from social networking, people listed in your organization's directory, and people from recent communications.

Since firstly you want to look at objectives of people most relevant to you, Okeears automatically suggests you those people list. See links below to find more details about relevant people list.


## Useful links

https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-authentication-scenarios
https://docs.microsoft.com/en-us/azure/active-directory/authentication/concept-mfa-howitworks
https://docs.microsoft.com/en-us/azure/active-directory/develop/v1-permissions-and-consent
https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow
https://developer.microsoft.com/en-us/graph/docs/concepts/permissions_reference
https://developer.microsoft.com/en-us/graph/docs/concepts/people_example
