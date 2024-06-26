# Top XYZ

Create a toplist for anything!
We all have areas in our lives where we are a bit extra passionate. For you it could be horror movies, hamburger restaurants, cat breeds, or anything else.

Top XYZ is a web app that helps you to keep track of your personal favorites, enables you to rank them, and sharing them with others.

View demo here:
https://gifyu.com/image/SfZPz

## 🚀 Quick Start

Update May 26 2024 -
The application is no longer publically hosted. You can view a demo of the application on the link above.

Navigate to [topxyz.net](https://topxyz.net), browse existing toplists or create your own.
Creating your own toplists requires registering with your email and a password.

## 🛠️ Built With

-   Go backend API with CRUD operations for toplists and user account management
-   React frontend
-   JWT authentication
-   PostgreSQL database
-   CI/CD with Github actions

## 💻 Run locally

### Dependencies

-   Go version 1.20+
-   PostgreSQL version 15+
-   Node version 16+

### Clone the repo

```
git clone https://github.com/limesten/topxyz.git && cd topxyz
```

### Project setup

1. This setup assumes that you already are familiar with PostgreSQL, and that you have it up and running with a database ready to use.

2. Within the backend directory:

    Read .env.example and set up the variables according to preference

    Rename .env.example to .env

    ```
    make migrateup
    ```

    ```
    go build -o topxyz && ./topxyz
    ```

3. Within the frontend directory:

    Read .env.example and set up the variables according to preference

    Rename .env.example to .env

    ```
    npm install
    ```

    ```
    npm run dev
    ```

### Submit a pull request

If you'd like to contribute, please fork the repository and open a pull request to the `main` branch.
