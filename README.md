# E-commerce website using java fullstack

This is a full-stack E-Commerce website built using Spring Boot (Microservices) for the backend and React.js for the frontend.This involves JWT Authentication with Spring Security ensures secure login and role-based access.Users can browse products, add items to the cart, and place orders.Admins can manage products (CRUD operations).Microservice architecture with Eureka Service Registry and API Gateway for routing.
## Features
### User Features
If the user is already registered then he/she can login through the username and password .\
Incase of a new   user then he/she needs to register (with role, phone number, email, etc.)\
Secure login via JWT Authentication.\
View available products.\
View product details.\
Add products to cart.\
Place orders.
### Admin Features
Secure login with admin credentials.\
Add new products.\
Update existing products.\
Delete products.\
View all available products.
### Authentication
Role-based access using Spring Security.\
JWT token-based authentication for API requests.
### Tech Stack
## Backend
Java.\
Spring Boot.\
Spring MVC.\
Spring Data JPA.\
Spring Security (JWT).\
Eureka Service Registry.\
API Gateway.\
MySQL Database.
## Frontend 
React.js.\
JavaScript (ES6).\
HTML5, CSS3.
### Microservices Architecture
The backend is built with 6 microservices, all registered via Eureka Service Registry and accessible through the API Gateway:
1)Auth Service – Handles registration, login, role management.\
2)Product Service – CRUD operations for products.\
3)Cart Service – Manage user cart items.\
4)Order Service – Place and track orders.\
5)API Gateway – Routes all requests to respective services.\
6)Service Registry (Eureka) – Service discovery for all microservices.\


