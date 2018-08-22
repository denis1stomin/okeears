# Okeears - objectives and key results web app [![Build Status](https://travis-ci.org/denis1stomin/okeears.svg?branch=master)](https://travis-ci.org/denis1stomin/okeears)

https://www.okeears.com/

Okeears is a simple to use SaaS application which helps your team and organization to easily start charging ahead objectives and key results (OKR) process. By design the application is highly integrated with Microsoft Office 365.

## Security and compliance

* Microsoft Azure Active Directory authentication.
(Azure AD multifactor authentication (MFA) is supported out-of-the-box.)
* Graph API is used to retrieve organizational structure.
* All the OKR data is stored in your organization's OneDrive account.
(Currently OneDrive for Business is supported only.)
* OneNote API is used to store the data in human-readable format.
(You can use the OKR information in other O365-integrated systems.)
* GDPR compliant :) since OneDrive/OneNote is used as a backend solution.
* Okeears is hosted in Azure.
* All the source code is open-source!

## Application permissions

Okeears needs you to provide a number of Azure AD `on-behalf-of` permissions.



## Useful links

https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-authentication-scenarios
https://docs.microsoft.com/en-us/azure/active-directory/authentication/concept-mfa-howitworks
https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow
