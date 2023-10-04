<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# A Little Bit About Me..

Hi my name is **Koren Kaplan**, and I'm a software developer. I enjoy creating application all way from the idea in my head to an app in my phone or a website.
 This project was made as a final project for my academic studies as a Practical Software Engineer. In a group of two people I was responsible for the server side of the project.

# "Scan & Go": Nest.js Server Side REST API

"Scan and Go" is a mobile payment app for clothing stores that uses RFID chips to allow customers to scan items and pay for them without having to go through a checkout line. It is the fastest and most convenient way to shop for clothes.


## Table Of Contents
1. [Demo and Sceenshots](#demo-and-sceenshots)
2. [Tech-Stack](#tech-stack)
3. [Expanded Description](#expanded-description)
4. [Features](#features)
5. [Architecture](#architecture)
6. [Contact Information](#contact-information)

## Demo and Sceenshots
will come soon...

## Tech-Stack
**Programming language:** TypeScript
**Technologies**:
 1. Client - React-Native
 2. Server - Nest.js 
 3. Database - Mongodb Atlas
 4. Cloud Storage - AWS S3
 5. Server Hosting - Render
 6. Contact Information


## Expanded Description
**Main Purpose**

The main purpose of the app is to provide a quick and easy way to pay for clothing without having to wait in long lines, and to help you keep track of your expenses and show you charts of your spending habits.

**How to Use It**

1.  Register and add a credit card to the app.
2.  Pick a clothing item in the store and scan the RFID chip on the label.
3.  Add the item to your cart and enter a coupon if you have one.
4.  Complete the checkout process with just two clicks.

**Benefits**

-   The app is easy to use for everyone, regardless of their technical expertise.
-   The app saves you time by allowing you to skip the checkout line.
-   The app helps you keep track of your expenses and shows you charts of your spending habits, so you can make better financial decisions.
  
 ## Features

**Performance**

-   **Caching:** Uses the Nest.js caching mechanism to improve performance by storing frequently accessed data in memory.
-   **MongoDB indexing:** Uses indexes to improve the performance of frequently used queries.
-   **MongoDB design patterns:** Uses various design patterns to model the data in a way that optimizes performance and reduces the number of requests required. These patterns include the [Extended Reference](https://www.mongodb.com/blog/post/building-with-patterns-the-extended-reference-pattern), [Computed](https://www.mongodb.com/blog/post/building-with-patterns-the-computed-pattern), [Subset](https://www.mongodb.com/blog/post/building-with-patterns-the-subset-pattern), and [Bucket](https://www.mongodb.com/blog/post/building-with-patterns-the-bucket-pattern) patterns.
-   **Pagination:** Implements pagination with extended references to lists to improve loading times.
-   **Aggregation pipeline:** Uses the MongoDB aggregation pipeline and caching to combine data and present users with charts and stats about their shopping history in the app.

**Security**

 -   **Authentication:** Uses JSON Web Tokens (JWT) to authenticate the connected user.
 -   **Authorization:** Uses role-based access control (RBAC) to implement the following roles: user, store manager, and admin.
 -   **Rate limiting:** Protects the application from denial-of-service (DoS) attacks by limiting the number of requests that can be made without authentication. For example, this protects the application from excessive OTP requests, registrations, and login attempts.
 -   **One-time password (OTP):** Provides a secure way for users to reset their forgotten passwords. When a user requests to reset their password, the application sends an OTP to their registered email address. The OTP is valid for 5 minutes, and the user must enter it to reset their password. To prevent attackers from discovering registered email addresses, the application provides the same feedback to users regardless of whether their email address is registered.
 -   **Data encryption:** Encrypts sensitive user data in the database to protect it from unauthorized access.


**Cron Jobs**

-   **Sending Interval Reports:** The server sends a daily, weekly, monthly, and yearly transaction recap to the store manager's email in XLSX format.
-   **Sending New Coupons:** The server sends a new coupon to each user's email each month to encourage them to keep using the app.
-   **Creating a new collection in the database:** To improve search performance for exit scanners, the system creates a new Paid-Tags collection each year and searches from the most recent year backwards.

**More Features**

- **User Feedback system:** Users can reports bugs in the app and attach screenshots. Each system collects the device information that reported the bug such as the device model, carrier and OS version. The reports is handled by the admins of the app.
- **Purchase history and analytics:** The user is presented with all the information about past transactions, and a line chart to illustrate the data , it can be shown weekly, monthly and yearly stats.

			
## Architecture

The Nest.js server has a modular architecture, with each module responsible for a specific task or entity in the database. Each module is placed in a separate folder and has its own controller, service, module, interface, and DTOs.

Here are a few of the main modules in the project:

-   **Auth:** Responsible for the app's authentication, including login, registration, OTP, and token management.
-   **Mail:** Responsible for handling all the mail services of the app, including sending reports, receipts, coupons, and OTPs.
-   **Collections modules:** Each entity in the database has its own module, including CRUD operations and more specific operations related to that entity. 
-   **Manager's site:** A React website that provides the store manager with a dashboard to view stats about the app's sales, see all transactions in an active table, and add new products to the database.


 The modular architecture of the Nest.js server makes it easy to maintain and extend the application. Each module is self-contained and can be developed and tested independently. This makes it easy to add new features or fix bugs without affecting the rest of the application.
## Contact Information
**Linkedin:**  [https://www.linkedin.com/in/koren-kaplan/](https://www.linkedin.com/in/koren-kaplan/)

 


 
